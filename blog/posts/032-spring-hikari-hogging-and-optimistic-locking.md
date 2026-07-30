---
title: "HikariCP Exhaustion, Connection Hogging, and Optimistic Locking"
date: "2026-07-30"
slug: spring-hikari-hogging-and-optimistic-locking
tags:
  [
    "spring-boot",
    "java",
    "hikaricp",
    "transactions",
    "concurrency",
    "interview-prep",
    "testing",
  ]
description:
  "Phase 2 of the spring-validation-lab: REQUIRES_NEW against a saturated pool, HTTP inside
  @Transactional after first SQL, and @Version under flash contention — all proven with H2 tests."
readingTime: 13
wordCount: 2700
---

Series from [spring-validation-lab](https://github.com/jeffreyjose07/spring-validation-lab). Index: [Proving Spring Internals With Tests](/blog/proving-spring-internals-with-tests).

**Previous:** [Bean lifecycle and mini-umbrellas](/blog/spring-bean-lifecycle-and-mini-umbrellas)  
**This post:** Phase 2 — pools, hogging, optimistic locking

Phase 1 was about whether Spring’s sticky notes fire. Phase 2 is about what happens when they fire **too well** under load: every transaction wants a scarce Hikari connection, nested `REQUIRES_NEW` wants a second one, slow HTTP keeps the first one checked out, and twenty buyers fight over one unit of stock.

We proved three failure modes on Java 21 / Spring Boot 4.1 with a deliberately tiny pool (max 10) and H2.

## Shared ground truth: connections are often lazy

**Folklore:** entering `@Transactional` always checks out a Hikari connection immediately.

**Lab:** with JPA, the connection is often acquired on **first SQL**. Pure CPU / HTTP at the start of a transactional method may hold **0** connections until the first query/flush. Hogging and pool math should be reasoned from “first SQL,” not from method entry alone.

Say that in interviews. It changes how you narrate connection-hog timelines.

---

## Trap 1 — `REQUIRES_NEW` vs pool size

### Theory

Normal `@Transactional` (REQUIRED): one connection for the TX duration (once acquired).

`REQUIRES_NEW` on a nested bean: suspend outer TX, open a **new** TX → typically needs a **second** connection while the parent still holds the first.

Bad schedule with `maximumPoolSize = 10`:

1. Ten threads enter parent TX
2. Each runs first SQL → each holds 1 connection → pool empty
3. Each calls nested `REQUIRES_NEW` → needs connection #11…#20
4. Hikari checkout timeouts / cascade failures

This is not “Hikari is broken.” It is synchronous nested transactions under a saturated pool.

### Lab design

- `PaymentWithRequiresNewAuditService` — parent `@Transactional`, `saveAndFlush` (acquire conn), optional barrier, then nested call
- `NestedRequiresNewAuditService` — `@Transactional(REQUIRES_NEW)` audit write

### Ground truth: H2 is too fast without a barrier

**Folklore:** 10 threads × `REQUIRES_NEW` always deadlocks a pool of 10.

**Lab:** on H2, SQL is so fast that some parents finish before all ten hold a connection. The “deadlock window” never opens. We force the bad schedule with a `CountDownLatch`:

```java
auditLogRepository.saveAndFlush(...); // hold parent connection
allParentsHolding.countDown();
allParentsHolding.await(...);         // wait until pool is full
nestedRequiresNewAuditService.writeIndependentAudit(paymentId);
```

Production latency (real DB, GC, network) makes the bad schedule easier to hit “naturally.” Tests must manufacture it.

### How we proved it

Test: `RequiresNewPoolExhaustionTest`

```bash
./gradlew test --tests '*RequiresNewPoolExhaustionTest'
```

Assert: with 10 concurrent callers and the barrier, **≥ 5** fail getting the second connection (we allow races but demand real pain; a perfect 10/10 deadlock is ideal but not required for the lesson).

### What to do instead

- Prefer async audit / outbox over synchronous `REQUIRES_NEW` under load
- If you must nest, size the pool for `parents + nested` worst case — and admit that cost
- Do not stack `REQUIRES_NEW` in hot request paths as a default “make it durable” hammer

---

## Trap 2 — connection hogging (HTTP inside the TX)

### Theory

Admin bulk price update:

1. For each SKU, call manufacturer HTTP (slow)
2. Read/update product row
3. All inside one `@Transactional`

After the **first** SQL, Hikari connection stays checked out for the rest of the method — including every subsequent vendor round-trip. Ten parallel admins → pool empty → login / checkout die even though the DB is idle.

### Broken design (lab)

`BrokenBulkPriceUpdateService`:

```java
@Transactional
public void processBulkUpload(List<PriceChange> changes) {
    for (PriceChange change : changes) {
        if (vendorClient.verifyWithManufacturer(change)) { // slow, inside TX
            Product product = productRepository.findBySku(...); // acquires/holds conn
            product.setPrice(change.newPrice());
            toUpdate.add(product);
        }
    }
    productRepository.saveAll(toUpdate);
}
```

### Fixed design (lab)

`FixedBulkPriceUpdateService` — **no** `@Transactional` on the orchestrator:

1. Do all vendor HTTP first (0 DB connections)
2. Call `DbBatchPriceService.batchUpdatePrices(valid)` — short `@Transactional` batch

Network work outside the umbrella. DB work in a tight proxy call.

### How we proved it

Test: `ConnectionHoggingTest`

```bash
./gradlew test --tests '*ConnectionHoggingTest'
```

Assert roughly:

| Path | Mid-flight Hikari active connections |
|------|--------------------------------------|
| Broken (HTTP inside TX after SQL) | pool fully checked out (**10**) |
| Fixed (HTTP outside TX) | during vendor phase **≤ 1** (ideally 0) |

Watch `LabLog` banners: `PHASE2-HOG` broken vs fixed.

### Interview nuance

If someone says “never do HTTP in a transaction,” refine it: never do HTTP **while holding a DB connection**. With lazy acquisition, HTTP *before* first SQL inside `@Transactional` is still a bad habit (long TX, lock duration later) but it is not the same as pool starvation. After first SQL, it is pool starvation.

---

## Trap 3 — optimistic locking under flash traffic

### Theory

One VIP SKU, stock = 1, twenty concurrent buyers. Pessimistic `SELECT … FOR UPDATE` serializes and holds row locks. Optimistic `@Version`:

1. Each TX reads `version = N`
2. Winner flushes `UPDATE … SET stock=0, version=N+1 WHERE id=? AND version=N` → 1 row updated
3. Losers’ UPDATE matches 0 rows → Hibernate `StaleStateException` → Spring often wraps as `ObjectOptimisticLockingFailureException`

Fast fail. No long lock waits. Callers retry or show “sold out.”

### Lab design

```java
@Entity
public class InventoryItem {
    // ...
    @Version
    private Integer version;
}
```

`InventoryPurchaseService.purchaseOne`:

- read by SKU
- if stock &lt; 1 → `IllegalStateException("Out of stock")`
- decrement, `saveAndFlush`
- rethrow optimistic failures after logging

### Ground truth: exception names

Logs may show Hibernate `StaleStateException` / batch failures **before** Spring’s `ObjectOptimisticLockingFailureException`. Same concept. Name both if probed.

### How we proved it

Test: `OptimisticLockingTest`

```bash
./gradlew test --tests '*OptimisticLockingTest'
```

Seed: one `IPHONE-VIP` with stock 1. Fire 20 threads.

Assert:

| Metric | Expected |
|--------|----------|
| successes | **exactly 1** |
| final stock | **0** |
| optimistic + out-of-stock failures | **19** |
| optimistic failures | **&gt; 0** (not only out-of-stock) |

That last assert matters: we proved the version collision path, not only “later threads saw stock 0.”

---

## How Phase 2 fits Principal-level answers

Senior answers list tools. Principal answers connect **resource budgets**:

- Connections are a hard cap (pool size)
- Every open TX after first SQL is a checked-out connection
- Nested TX multiplies demand
- Remote I/O multiplies hold time
- Contention strategy (`@Version` vs locks) is a product decision under flash sales

The lab makes those sentences falsifiable.

## How to run Phase 2

```bash
./gradlew test --tests '*RequiresNewPoolExhaustionTest'
./gradlew test --tests '*ConnectionHoggingTest'
./gradlew test --tests '*OptimisticLockingTest'
```

Docs: [`docs/04-connection-pools-and-locking.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/04-connection-pools-and-locking.md)  
Ground truth: [`docs/ground-truth.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/ground-truth.md)

## One-liner

> Never hold a DB connection across remote I/O. Never stack synchronous `REQUIRES_NEW` under a saturated pool. Prefer optimistic locking when collisions are rare or you need fail-fast under flash traffic.

---

That closes Phase 1–2 of the lab. I am deliberately not racing into Kafka outbox / saga write-ups until these proofs feel boring. If you interview Spring-heavy backend roles: clone the repo, run one red test and one green test, and keep your own ground-truth file for every place Boot 4 disagreed with the slide deck.

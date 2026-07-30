---
title: "Spring Bean Lifecycle, Circular Deps, and Mini-Umbrellas"
date: "2026-07-30"
slug: spring-bean-lifecycle-and-mini-umbrellas
tags:
  [
    "spring-boot",
    "java",
    "transactions",
    "lifecycle",
    "interview-prep",
    "testing",
  ]
description:
  "Phase 1 wrap: @PostConstruct runs before the AOP proxy; constructor cycles fail to boot;
  Spring Data invents mini-transactions when you have no outer @Transactional."
readingTime: 12
wordCount: 2500
---

Series from [spring-validation-lab](https://github.com/jeffreyjose07/spring-validation-lab). Index: [Proving Spring Internals With Tests](/blog/proving-spring-internals-with-tests).

**Previous:** [ThreadLocals and `@Async`](/blog/spring-threadlocals-and-async)  
**This post:** lifecycle, circular dependencies, repository mini-transactions  
**Next:** [HikariCP, connection hogging, optimistic locking](/blog/spring-hikari-hogging-and-optimistic-locking)

Phase 1 is not only proxies and ThreadLocals. Three related traps show up in every senior Spring loop: startup seeding that “has `@Transactional` but doesn’t,” circular constructor graphs that refuse to boot, and services that throw after two `save()` calls only to discover **both rows persisted** because there was never an outer umbrella.

We proved all three with H2.

## Trap 1 — `@PostConstruct` before the proxy

### Theory (lifecycle order, simplified)

1. Instantiation (`new`)
2. Injection (constructors / setters / fields)
3. Initialization (`@PostConstruct`, `InitializingBean`, …)
4. **AOP proxy creation** / publish bean to the context for clients

So when `@PostConstruct` runs, you are still on the **raw target**. A `@Transactional` sticky note on that method is unread. No Spring transaction umbrella opens from that annotation.

People then observe: “but my seed rows are in the DB!” Correct — Spring Data repository methods are themselves `@Transactional(REQUIRED)`. With no outer TX, each `save()` opens a **mini-transaction**, commits, and returns. Your PostConstruct “transaction” failed; the repository’s did not.

### Broken-ish design we measured

`PostConstructSeeder`:

```java
@PostConstruct
@Transactional // ignored — no proxy yet
public void seedOnStartup() {
    observedAsProxyDuringPostConstruct = AopUtils.isAopProxy(this);
    transactionActiveDuringPostConstruct =
            TransactionSynchronizationManager.isActualTransactionActive();

    repository.save(new SeedConfig("MAX_USERS", "5000"));
    repository.save(new SeedConfig("THEME", "DARK"));
}
```

### How we proved it

Test: `PostConstructBeforeProxyTest`

```bash
./gradlew test --tests '*PostConstructBeforeProxyTest'
```

Assert during PostConstruct observations:

| Observation | Expected |
|-------------|----------|
| `postConstructRan` | true |
| `isAopProxy(this)` | **false** |
| `isActualTransactionActive()` | **false** |
| rows for `MAX_USERS` / `THEME` | **both present** (mini-TXs) |

Second test in the same class: after full context build, the **injected** `PostConstructSeeder` **is** a proxy (`AopUtils.isAopProxy(postConstructSeeder) == true`). An `ApplicationRunner` (`AfterContextReadySeeder`) with `@Transactional` sees `txActive=true` and can seed under a real umbrella.

### What to do instead

For transactional startup work, wait until the context is ready:

- `ApplicationRunner` / `CommandLineRunner`
- `ContextRefreshedEvent` listener
- explicit `@Transactional` service called from those hooks (so the call crosses a proxy)

Do not put critical multi-step transactional seeding on `@PostConstruct`.

## Trap 2 — constructor circular dependencies

### Theory

Constructor injection A ↔ B means neither object can finish construction without the other. There is no half-built instance to stash in the third-level cache the way field/setter injection historically allowed.

Spring Boot **disables circular references by default** since 2.6. Field injection cycles also fail unless you re-enable the escape hatch. The principled fix is almost always a **third orchestrator** or `@Lazy` on one side — not “turn circular refs back on and move on.”

### How we proved the crash

`ConstructorCircularDependencyTest` uses `ApplicationContextRunner` scanning profile-gated circular beans.

1. **Constructor cycle** (`circular-constructor` profile) → context **hasFailed**, cause mentions circular / `BeanCurrentlyInCreationException`.
2. **Field cycle** (`circular-field`) → also fails by default on modern Boot.
3. **Runner escape hatch:** `.withAllowCircularReferences(true)` boots the field cycle.
4. **Principal fix:** `@Lazy` on one constructor parameter boots cleanly without enabling circular refs globally.

```bash
./gradlew test --tests '*ConstructorCircularDependencyTest'
```

### Ground truth: the property people mis-cite

**Folklore:** set `spring.main.allow-circular-references=true` and every test harness suddenly allows cycles.

**Lab:** that property applies to **`SpringApplication`**. A raw `ApplicationContextRunner` **ignores** it. Use:

```java
runner.withAllowCircularReferences(true)
```

or fix the graph with `@Lazy` / redesign.

If an interviewer asks “how do you allow circular references in tests?”, distinguishing `SpringApplication` vs `ApplicationContextRunner` is a strong senior signal.

## Trap 3 — repository mini-umbrellas

### Theory

`SimpleJpaRepository` methods are `@Transactional` with `Propagation.REQUIRED`:

- Outer TX present → join it
- No outer TX → open a short-lived transaction, commit on method exit

So “my service method is not transactional” does **not** mean “nothing commits until I say so.” It means each repository call may commit immediately.

That is catastrophic for multi-step writes that must be atomic: save A, save B, throw → both A and B already durable.

### Broken design (lab)

`NonTransactionalNoteService` — no class/method `@Transactional`, two `save()`s, then throw.

### Fixed / contrasting design

`TransactionalNoteService` — outer `@Transactional`, same two saves, then throw → both roll back.

### How we proved it

Test: `RepositoryMiniUmbrellaTest`

```bash
./gradlew test --tests '*RepositoryMiniUmbrellaTest'
```

| Path | After exception |
|------|-----------------|
| No outer TX | `note-a` and `note-b` **both count = 1** |
| Outer `@Transactional` | `note-c` and `note-d` **both count = 0** |

Same throw. Different atomicity. The difference is the umbrella.

## How the three traps connect

All three are about **when** Spring’s transactional interceptors exist and **who** opens the transaction:

| Moment / call | Who reads `@Transactional`? |
|---------------|-----------------------------|
| `@PostConstruct` on your bean | Nobody (no proxy yet) |
| `repository.save` with no outer TX | Repository proxy → mini-TX |
| `repository.save` under your `@Transactional` service | Your proxy opened umbrella; repo joins |
| Constructor A↔B | Context never finishes — annotations irrelevant |

Once you see that map, “transactional seeding on PostConstruct” and “partial commits without outer TX” stop feeling like unrelated trivia.

## Interview answers that hold

**Q: Can I use `@Transactional` on `@PostConstruct`?**  
A: The annotation on that method is ignored; proxy does not exist yet. Rows may still persist via repository mini-transactions. Use a runner after context refresh.

**Q: Why did half my writes survive an exception?**  
A: No outer transaction. Each Spring Data `save` likely committed independently. Wrap the unit of work in `@Transactional` on a proxied service method.

**Q: Constructor circular dependency — enable the flag?**  
A: Prefer redesign or `@Lazy`. Know Boot defaults to deny cycles. Know `spring.main.allow-circular-references` is a `SpringApplication` concern; runners need their own API.

## How to run Phase 1 lifecycle proofs

```bash
./gradlew test --tests '*PostConstructBeforeProxyTest'
./gradlew test --tests '*ConstructorCircularDependencyTest'
./gradlew test --tests '*RepositoryMiniUmbrellaTest'
```

Docs: [`docs/03-bean-lifecycle.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/03-bean-lifecycle.md)

## One-liner

> Know the lifecycle order. Startup transactional work needs a fully built context. And “no outer transaction” does not mean “no transaction” — repositories will invent mini ones.

Next (Phase 2): [HikariCP exhaustion, connection hogging, and optimistic locking](/blog/spring-hikari-hogging-and-optimistic-locking).

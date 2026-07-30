---
title: "Proving Spring Internals With Tests (Not Folklore)"
date: "2026-07-30"
slug: proving-spring-internals-with-tests
tags:
  [
    "spring-boot",
    "java",
    "testing",
    "transactions",
    "interview-prep",
    "architecture",
  ]
description:
  "I stopped trusting slide-deck explanations of Spring proxies, ThreadLocals, and HikariCP.
  Here is a Java 21 / Spring Boot 4.1 lab where broken and fixed designs are proven with H2 tests—
  and where folklore quietly disagreed with the framework."
readingTime: 12
wordCount: 2100
---

I have been grinding Spring Boot for Senior / Principal interviews the way a lot of us do: architecture stories, whiteboard failure modes, “remember self-invocation.” It sounds sharp until you realize you have never **forced the JVM to show you** the bug.

So I built a lab.

**Repo:** [jeffreyjose07/spring-validation-lab](https://github.com/jeffreyjose07/spring-validation-lab)  
**Stack:** Java 21, Spring Boot 4.1, Gradle 9.3, H2, JUnit  

Each topic has a **broken** path and a **fixed** path. Assertions are the proof. Console `LabLog` banners narrate what is happening while the test runs. Teaching notes live under [`docs/`](https://github.com/jeffreyjose07/spring-validation-lab/tree/main/docs) so the README stays a landing page, not a novel.

## Why README was not enough

I looked at how serious learning repos are structured. The pattern that fits this lab:

| Place | Job |
|-------|-----|
| **README** | What / why / how to run / link to docs |
| **`docs/`** | Intent → theory → broken proof → fixed proof → interview one-liner |
| **Tests + logs** | Executable proof and live commentary |

That is roughly the [Diátaxis](https://diataxis.fr/) split: orientation in the README, explanation next to the code. If everything is dumped into README, nobody runs the tests. If there is no README map, nobody finds the docs.

## The loop I use now

1. State the production trap (self-invocation, ThreadLocal loss, pool starvation, …).  
2. Write the **broken** service on purpose.  
3. Assert the failure (wrong rows, NPE, timeouts, pool fully checked out).  
4. Write the **fixed** design.  
5. Assert the success.  
6. Capture anything that disagreed with the blog-post version of Spring in `docs/ground-truth.md`.

That last step mattered more than I expected.

## What the proofs cover so far

### Proxies and `@Transactional`

`@Transactional` is a sticky note. The proxy reads it. `this.saveIndependently()` never hits the proxy, so `REQUIRES_NEW` is dead text and the “independent” save rolls back with the outer transaction.

**Proof:** `SelfInvocationProxyTest` — broken count is 0; fixed separate-bean path leaves count 1 after outer failure.

### ThreadLocals and `@Async`

`SecurityContextHolder` is ThreadLocal. A naive async executor has an empty locker.

**Proof:** `SecurityContextAsyncTest` — naive executor NPE; explicit username arg works; `DelegatingSecurityContextRunnable` works.

### Lifecycle and mini-umbrellas

`@PostConstruct` runs **before** proxy creation. `@Transactional` on it is ignored, but Spring Data still opens **mini-transactions** per `save()`.

Constructor A↔B with Boot’s default circular-ref ban refuses to start. `@Lazy` on one side is the principled band-aid; refactoring the cycle is the real fix.

**Proofs:** `PostConstructBeforeProxyTest`, `ConstructorCircularDependencyTest`, `RepositoryMiniUmbrellaTest`.

### HikariCP, hogging, optimistic locking

Ten parents each holding a connection and asking for `REQUIRES_NEW` against a pool of ten: timeouts. Slow HTTP inside a transaction after the first SQL: pool hogging. `@Version`: one winner under flash contention.

**Proofs:** `RequiresNewPoolExhaustionTest`, `ConnectionHoggingTest`, `OptimisticLockingTest`.

## Where folklore was wrong (this is the gold)

Implementing the lab on **Spring Boot 4.1** corrected several “everybody knows” claims:

1. **Default `@Async` may already propagate SecurityContext.** I had to build a deliberately naive executor to demonstrate the null context.  
2. **Connections are often acquired lazily** (first SQL), not always at `@Transactional` method entry.  
3. **Pool deadlocks need a race window** — H2 is so fast the bad schedule barely happens without a barrier latch.  
4. **`spring.main.allow-circular-references` does not apply to a raw `ApplicationContextRunner`** — use the runner API or `@Lazy`.  
5. **Inside a method, `this` is never the proxy** — even when a transaction is active. Check the bean from the context, or `TransactionSynchronizationManager`.

Those notes are checked into [`docs/ground-truth.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/ground-truth.md). Interview answers that ignore them are soft under follow-ups.

## How to try it

```bash
git clone https://github.com/jeffreyjose07/spring-validation-lab.git
cd spring-validation-lab
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./gradlew test --tests '*SelfInvocationProxyTest'
```

Open a single test in IntelliJ and watch the Run console for lines like:

```text
========== [PHASE1-PROXY] BROKEN self-invocation ==========
  → Calling this.saveIndependently(...) — REQUIRES_NEW sticky note will NOT be read
  ✗ Throwing after 'independent' save — expect BOTH to roll back...
```

## What I am not doing next (yet)

I am deliberately not racing into Kafka outbox / saga posts until the Phase 1–2 proofs feel boring. The point of this lab is **competence under the hood**, not checklist coverage.

If you interview for Spring-heavy backend roles: stop only reading about proxies. Make one fail on purpose. Keep the green and red tests. Write down every place the framework surprised you.

That surprise list is the difference between sounding senior and being able to debug production at 2 a.m.

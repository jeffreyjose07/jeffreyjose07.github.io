---
title: "Spring ThreadLocals and @Async: What We Proved"
date: "2026-07-30"
slug: spring-threadlocals-and-async
tags:
  [
    "spring-boot",
    "java",
    "security",
    "async",
    "interview-prep",
    "testing",
  ]
description:
  "Phase 1 continued: SecurityContext lives in a ThreadLocal by default. Naive @Async loses
  Authentication (not the context object). Explicit args and DelegatingSecurityContextRunnable fixes."
readingTime: 11
wordCount: 2200
---

Series from [spring-validation-lab](https://github.com/jeffreyjose07/spring-validation-lab). Index: [Proving Spring Internals With Tests](/blog/proving-spring-internals-with-tests).

**Previous:** [Proxies and self-invocation](/blog/spring-proxies-and-self-invocation)  
**This post:** ThreadLocals, `@Async`, and SecurityContext  
**Next:** [Bean lifecycle and mini-umbrellas](/blog/spring-bean-lifecycle-and-mini-umbrellas)

The classic interview line is: “`@Async` loses the SecurityContext because ThreadLocal does not cross threads.” That sentence is directionally right and operationally sloppy. On Spring Boot 4.1 we had to be precise — and we had to build a **naive executor on purpose**, because the default path did not fail the way folklore promised.

## The production trap

Request thread authenticates the user. Controller calls a service that fires `@Async` audit logging. The worker thread calls:

```java
SecurityContextHolder.getContext().getAuthentication().getName();
```

Boom: NPE. Ops blames “null SecurityContext.” Debug session shows something more annoying: `getContext()` returned a **non-null empty context**. What was null was **`Authentication`**.

Same class of bug shows up with:

- raw `Executor` / `CompletableFuture.runAsync`
- `parallelStream()` after reading ThreadLocal state
- custom thread pools without a `TaskDecorator`

## Theory: lockers, not magic globals

`SecurityContextHolder` uses a **strategy**. Default strategy is **ThreadLocal** (MODE_THREADLOCAL). Think of it as a labeled locker on the current thread:

1. Filter / interceptor puts `Authentication` into the context on the Tomcat (or WebFlux — different story) thread.
2. Your service reads it on that same thread — fine.
3. `@Async` schedules work on a **pool thread** — different locker.
4. Unless something **copied** the context onto the worker, the worker’s locker is empty.

Fixes fall into two buckets:

| Approach | Idea |
|----------|------|
| **Explicit** | Pass `username` / user id / DTO as a method argument. No ThreadLocal required on the worker. |
| **Framework** | `TaskDecorator` + `DelegatingSecurityContextRunnable` (or Spring Security’s async support) copies context onto the worker and **clears** it afterward so pool threads do not leak identity. |

Explicit is clearer for audits and batch jobs. Framework propagation is convenient when many layers already assume `SecurityContextHolder`.

## Ground truth: folklore vs Boot 4.1

### 1. Default `@Async` may already propagate

**Folklore:** Any `@Async` method always sees a missing security context.

**Lab:** Plain `@Async` on our Boot 4.1 / modern Spring Security stack did **not** reliably demonstrate the failure. Framework wiring already helped in some paths.

So the lab defines `naiveAsyncExecutor` — a `ThreadPoolTaskExecutor` with **no** `TaskDecorator` — and binds the broken service with `@Async("naiveAsyncExecutor")`. That keeps the ThreadLocal loss demonstrable and honest.

**Interview phrasing:** ThreadLocal does not cross threads *unless* the executor (or Security) copies it. Always verify your executor bean.

### 2. Empty context ≠ null context

`SecurityContextHolder.getContext()` typically returns a context object even when nobody is authenticated. The failure mode is almost always:

```text
context != null
authentication == null
authentication.getName() → NPE
```

Say that out loud in interviews. It signals you have actually tripped the bug.

## Broken design (lab)

`BrokenAsyncAuditService`:

```java
@Async("naiveAsyncExecutor")
public CompletableFuture<String> logAccessBroken() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null) {
        return CompletableFuture.failedFuture(
                new NullPointerException("SecurityContext is null on async thread"));
    }
    return CompletableFuture.completedFuture(auth.getName());
}
```

(The error message says “SecurityContext” for historical slogan reasons; the check is on `Authentication`. The test asserts the NPE cause.)

`AsyncConfig#naiveAsyncExecutor` — no decorator, no copy, no clear.

### How we proved it

Test: `SecurityContextAsyncTest#asyncWithoutPropagationLosesSecurityContext`

```bash
./gradlew test --tests '*SecurityContextAsyncTest.asyncWithout*'
```

Setup: put `UsernamePasswordAuthenticationToken("jeffrey", ...)` on the test thread.

Assert: `join()` fails with `CompletionException` whose cause is `NullPointerException` (missing auth on worker).

## Fixed design A — explicit argument

`ExplicitAsyncAuditService` takes `String username` (or could take a richer DTO). The worker never reads `SecurityContextHolder` for identity.

Test: `explicitArgumentPropagationWorks` → result equals `"jeffrey"`.

This is the design I push hardest in interviews for fire-and-forget audit: **make the boundary obvious**. Arguments are visible in signatures, logs, and tests.

## Fixed design B — framework copy

`PropagatingAsyncAuditService` uses `@Async("securityContextPropagatingExecutor")`.

The executor sets:

```java
executor.setTaskDecorator(runnable -> {
    SecurityContext context = SecurityContextHolder.getContext();
    return new DelegatingSecurityContextRunnable(runnable, context);
});
```

`DelegatingSecurityContextRunnable` installs the captured context on the worker thread before `run()`, then restores/clears appropriately so the next task on that pool thread does not inherit yesterday’s principal.

Test: `frameworkPropagationWorks` → worker still sees `"jeffrey"` with no explicit arg.

### Why clear matters

Without cleanup, pool threads keep ThreadLocals. User A’s request finishes; thread returns to pool; User B’s task briefly sees User A. That is a security incident class, not a style nit.

## What we learned that slides skip

1. **ThreadLocal is a concurrency primitive**, not a request-scoped DI feature. Crossing threads is always your problem unless the framework documents a copy.
2. **`@Async` is not one behavior.** It depends on which `Executor` bean is wired and whether Security auto-config decorated it.
3. **Prefer explicit data for domain events.** Propagation is for when you must keep calling `SecurityContextHolder` deep in shared libraries.
4. **Prove both failure and fix.** One green “async works” test teaches nothing about the failure mode.

## Interview answers that hold

**Q: Why did async audit log as anonymous / NPE?**  
A: Worker thread did not receive Authentication. Context object can still be non-null. Check the executor for a Security `TaskDecorator`, or pass the principal explicitly.

**Q: Is `SecurityContextHolder.setStrategyName(MODE_INHERITABLETHREADLOCAL)` the fix?**  
A: It helps only for child threads created in ways that inherit ThreadLocals. It is easy to misuse with pools (inheritance at pool-thread creation time ≠ per-task copy). Prefer decorator or explicit args for `@Async` pools.

**Q: What about WebFlux / reactive?**  
A: Different model (Reactor Context), not ThreadLocal-by-default the same way. Do not answer a servlet `@Async` question with Reactor slogans.

## How to run just this proof

```bash
./gradlew test --tests '*SecurityContextAsyncTest'
```

Docs: [`docs/02-threadlocals-and-async.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/02-threadlocals-and-async.md)

## One-liner

> ThreadLocal state does not cross thread boundaries. `@Async`, `parallelStream`, and raw thread pools leave Authentication behind unless you copy it or pass data explicitly — and verify your executor, because modern defaults may already propagate.

Next: [Bean lifecycle, circular dependencies, and repository mini-umbrellas](/blog/spring-bean-lifecycle-and-mini-umbrellas).

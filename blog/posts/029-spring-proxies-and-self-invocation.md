---
title: "Spring Proxies and Self-Invocation: What We Proved"
date: "2026-07-30"
slug: spring-proxies-and-self-invocation
tags:
  [
    "spring-boot",
    "java",
    "transactions",
    "aop",
    "interview-prep",
    "testing",
  ]
description:
  "Phase 1 of the spring-validation-lab: @Transactional is a sticky note read by a proxy.
  Self-invocation makes REQUIRES_NEW dead text. Broken and fixed designs, asserted with H2."
readingTime: 12
wordCount: 2400
---

This is part of a series from [spring-validation-lab](https://github.com/jeffreyjose07/spring-validation-lab) — Java 21, Spring Boot 4.1, Gradle, H2. Series index: [Proving Spring Internals With Tests](/blog/proving-spring-internals-with-tests).

**This post:** proxies and `@Transactional` self-invocation.  
**Next:** [ThreadLocals and `@Async`](/blog/spring-threadlocals-and-async).

I used to say “self-invocation bypasses the proxy” in interviews like it was a slogan. That is not the same as being able to force a rollback and point at a row count of zero. This post is the full proof we built for that trap — theory, broken code, fixed code, assertions, and the ground-truth surprise that still trips people in follow-ups.

## The production trap

You need an audit (or ledger) write that **must survive** even if the outer business method fails and rolls back. The textbook move is `@Transactional(propagation = Propagation.REQUIRES_NEW)` on an “independent” method.

Someone writes:

```java
@Transactional
public void processBatchThenFail(...) {
    this.saveIndependently(accountId, amount); // looks fine
    throw new IllegalStateException("boom");
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveIndependently(...) {
    repository.save(...);
}
```

In production review this often ships. In a real outage it looks like “REQUIRES_NEW is broken.” It is not. The call never crossed a Spring AOP proxy, so the sticky note was never read.

## Theory: sticky notes, not JVM keywords

`@Transactional` is not bytecode magic by default. Spring wraps your bean in a **CGLIB (or JDK) proxy** when transaction AOP is active. External callers receive the **proxy** from the `ApplicationContext`.

Call path that works:

1. Caller → **proxy**
2. Proxy sees `@Transactional` → begins / suspends / joins a transaction
3. Proxy invokes your real method on the **target**
4. Proxy commits or rolls back on the way out

Call path that fails silently:

1. You are already inside the target method
2. You call `this.saveIndependently(...)`
3. `this` is the **raw target object**, not the proxy
4. No interceptor runs → `REQUIRES_NEW` is dead text
5. The “independent” save joins (or shares) the outer transaction
6. Outer throw → everything rolls back together

`REQUIRES_NEW` means: suspend the outer TX and open a new one. That only happens if the **proxy** sees the call.

## Ground truth you should say in interviews

**Inside a method body, `this` is never the proxy** — even when a transaction is already active because the proxy opened it.

People say: “If `TransactionSynchronizationManager.isActualTransactionActive()` is true, then `AopUtils.isAopProxy(this)` must be true.” We measured the opposite.

Proof of interception is one of:

- `TransactionSynchronizationManager.isActualTransactionActive()` after entering via a proxied call
- Checking the bean **injected from the context** (`AopUtils.isAopProxy(injectedBean) == true`)
- Observing commit/rollback behavior under controlled failure (best)

Never trust `AopUtils.isAopProxy(this)` inside the class as proof that annotations are “on.”

## Broken design (lab)

Class: `BrokenSelfInvocationLedgerService`

```java
@Transactional
public void processBatchThenFail(String accountId, long amount) {
    this.saveIndependently(accountId, amount);
    throw new IllegalStateException("Simulated business failure after independent save");
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveIndependently(String accountId, long amount) {
    repository.save(new LedgerEntry(accountId, amount));
}
```

Console banners (via `LabLog`) make the intent loud while the test runs:

```text
========== [PHASE1-PROXY] BROKEN self-invocation ==========
  → Calling this.saveIndependently(...) — REQUIRES_NEW sticky note will NOT be read
  ✗ Throwing after 'independent' save — expect BOTH to roll back...
```

### How we proved it

Test: `SelfInvocationProxyTest#selfInvocationDoesNotCommitIndependently`

```bash
./gradlew test --tests '*SelfInvocationProxyTest.selfInvocation*'
```

Assert:

1. Method throws `IllegalStateException` (simulated business failure).
2. `repository.countByAccountId("acct-broken")` is **0**.

If `REQUIRES_NEW` had fired, the independent row would already be committed before the outer throw. Zero rows means there was only one transaction, and it rolled back.

That is the interview-grade proof: not a stack trace story, a **persisted count**.

## Fixed design (lab)

Split the independent write onto another Spring bean so the call crosses a proxy boundary.

- `FixedLedgerService` — outer `@Transactional`, orchestrates, then throws
- `IndependentLedgerWriteService` — `@Transactional(REQUIRES_NEW)` + repository save

```java
@Transactional
public void processBatchThenFail(String accountId, long amount) {
    independentWriteService.saveIndependently(accountId, amount);
    throw new IllegalStateException("Simulated business failure after independent save");
}
```

Same failure throw. Different call graph.

### How we proved the fix

Test: `SelfInvocationProxyTest#separateBeanRequiresNewSurvivesOuterRollback`

Assert:

1. Outer method still throws.
2. `repository.countByAccountId("acct-fixed")` is **1**.

The independent TX committed before the outer rollback. That is the behavioral definition of `REQUIRES_NEW` working.

## Why “inject self” is a weaker fix

You can inject your own bean and call `self.saveIndependently(...)`. It works mechanically. It also keeps two concerns in one class and confuses readers (“why is this calling itself through a field?”).

Prefer:

- A small dedicated write service (what the lab does), or
- An application event / outbox later when the independence is really a domain boundary

For interviews: know that self-injection works; prefer a separate bean as the clean answer.

## What this teaches beyond the slogan

1. **Annotations are metadata.** Without an interceptor (proxy, AspectJ weave, etc.), they do nothing.
2. **Propagation only applies at proxy boundaries.** `REQUIRED`, `REQUIRES_NEW`, `NESTED` — same rule.
3. **Silent failure is the danger.** Self-invocation does not throw “annotation ignored.” It just behaves like a normal method call.
4. **Prove with data.** Rollback + row count beats hand-waving about AOP.

## Interview answers that hold under follow-up

**Q: Why did my REQUIRES_NEW audit roll back with the payment?**  
A: Likely called via `this`. The proxy never saw the call. Split the write onto another bean and re-test with an intentional outer failure; the audit row should remain.

**Q: How do you know you are talking to a proxy?**  
A: The object from the context is a proxy when AOP applies. Inside the method, `this` is still the target. Use TX activity / commit behavior, not `isAopProxy(this)`.

**Q: Does `@EnableAspectJAutoProxy(exposeProxy = true)` + `AopContext.currentProxy()` count?**  
A: Yes, it can force re-entry through the proxy. It is a smell for most codebases — couples you to AOP internals. Prefer another bean.

## How to run just this proof

```bash
git clone https://github.com/jeffreyjose07/spring-validation-lab.git
cd spring-validation-lab
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # macOS
./gradlew test --tests '*SelfInvocationProxyTest'
```

Teaching notes: [`docs/01-proxies-and-transactions.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/01-proxies-and-transactions.md)  
Ground-truth notes: [`docs/ground-truth.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/ground-truth.md)

## One-liner

> Annotations like `@Transactional` only apply when the call crosses a Spring proxy. Self-invocation is a silent no-op for AOP.

Next: [Spring ThreadLocals and `@Async`](/blog/spring-threadlocals-and-async) — where SecurityContext goes when work jumps threads, and why “null SecurityContext” is usually the wrong diagnosis.

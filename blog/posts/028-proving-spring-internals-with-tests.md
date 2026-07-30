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
  "Series hub: a Java 21 / Spring Boot 4.1 lab where broken and fixed Spring designs are proven
  with H2 tests. Deep dives for proxies, ThreadLocals, lifecycle, and HikariCP."
readingTime: 3
wordCount: 520
---

I stopped trusting slide-deck explanations of Spring proxies, ThreadLocals, and HikariCP. So I built a lab where every trap has a **broken** path, a **fixed** path, and assertions that force the JVM to show the bug.

**Repo:** [jeffreyjose07/spring-validation-lab](https://github.com/jeffreyjose07/spring-validation-lab)  
**Stack:** Java 21, Spring Boot 4.1, Gradle 9.3, H2, JUnit  

This post is the **series index**. The short overview was not enough — the detailed write-ups live in the posts below.

## Deep dives

| # | Post | What we proved |
|---|------|----------------|
| 1 | [Proxies and self-invocation](/blog/spring-proxies-and-self-invocation) | `this.method()` skips the proxy; `REQUIRES_NEW` is dead text; separate bean leaves the independent row after outer rollback |
| 2 | [ThreadLocals and `@Async`](/blog/spring-threadlocals-and-async) | Naive executor loses **Authentication** (context object can still be non-null); explicit args and `DelegatingSecurityContextRunnable` fix it |
| 3 | [Bean lifecycle and mini-umbrellas](/blog/spring-bean-lifecycle-and-mini-umbrellas) | `@PostConstruct` before proxy; constructor cycles fail to boot; Spring Data invents mini-TXs without an outer umbrella |
| 4 | [HikariCP, hogging, optimistic locking](/blog/spring-hikari-hogging-and-optimistic-locking) | `REQUIRES_NEW` vs pool of 10; HTTP inside TX after first SQL; `@Version` under 20 concurrent buyers |

Teaching notes in the repo mirror the same path under [`docs/`](https://github.com/jeffreyjose07/spring-validation-lab/tree/main/docs). Folklore corrections live in [`docs/ground-truth.md`](https://github.com/jeffreyjose07/spring-validation-lab/blob/main/docs/ground-truth.md).

## The loop

1. State the production trap.  
2. Write the **broken** service on purpose.  
3. Assert the failure (wrong rows, NPE, timeouts, pool fully checked out).  
4. Write the **fixed** design.  
5. Assert the success.  
6. Write down every place Boot 4.1 disagreed with the blog-post version of Spring.

## How to try it

```bash
git clone https://github.com/jeffreyjose07/spring-validation-lab.git
cd spring-validation-lab
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # macOS
./gradlew test --tests '*SelfInvocationProxyTest'
```

Open a single test in IntelliJ and watch the Run console for `LabLog` banners like:

```text
========== [PHASE1-PROXY] BROKEN self-invocation ==========
  → Calling this.saveIndependently(...) — REQUIRES_NEW sticky note will NOT be read
```

## What I am not doing next (yet)

I am deliberately not racing into Kafka outbox / saga posts until the Phase 1–2 proofs feel boring. The point of this lab is **competence under the hood**, not checklist coverage.

If you interview for Spring-heavy backend roles: stop only reading about proxies. Make one fail on purpose. Keep the green and red tests. Write down every place the framework surprised you.

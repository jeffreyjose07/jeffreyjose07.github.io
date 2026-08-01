---
title: "The Two-Month Outage: Dead DNS, Eager Filters, and Two Kinds of Postgres URL"
date: "2026-08-01"
slug: two-month-outage-aiven-dns-and-jdbc-urls
tags:
  [
    "scalable-chat-platform",
    "postgresql",
    "aiven",
    "render",
    "spring-boot",
    "incident",
    "github-actions",
    "debugging",
    "deployment",
  ]
description:
  "scalable-chat-platform was down for two months and I did not notice. A free-tier Postgres
  powered off, its DNS record vanished, and a servlet filter took the whole app down with it —
  including the health endpoint that was supposed to tell me."
readingTime: 14
wordCount: 2900
---

Working log for [scalable-chat-platform](https://github.com/jeffreyjose07/scalable-chat-platform). **Previous:** [Hardening the Chat Platform: Deps, Deep Health, and CI Pings](/blog/hardening-chat-platform-deps-health-ci).

In episode 027 I added a scheduled GitHub Action that pings `GET /api/health/status` every five minutes and fails loudly if any dependency is down. That was the right instinct. Then it went red on **2026-06-03** and stayed red for **two months**, firing every five minutes into a void, and I did not notice until I went looking for something else.

This is the post-mortem. It has three stacked failure modes, each one hiding the next, and each producing a completely different error at a different layer of the stack. The interesting part is not the fix — the fix was one environment variable. The interesting part is why an app with a carefully built three-dependency health check could not tell me which dependency had died.

---

## The symptom: zero bytes

The first thing I did was the obvious thing.

```bash
curl -sS -o /dev/null -w "HTTP %{http_code} time=%{time_total}s\n" \
  --max-time 60 https://scalable-chat-platform.onrender.com
```

```
curl: (28) Operation timed out after 60003 milliseconds with 0 bytes received
HTTP 000  time=60.003420s
```

**Zero bytes.** That detail matters. A crashed-but-running Spring Boot app gives you a 500 with a JSON error body. A container that died gives you Render's own 502 page, and quickly. Zero bytes after a full 60-second timeout means nothing upstream ever accepted the request — the container was not listening on 8080 at all.

The CI probe had been saying the same thing for two months, in a more compact form:

```
curl: (28) Operation timed out after 45001 milliseconds with 0 bytes received
##[error]Process completed with exit code 28.
```

## Dating the outage with `gh`

Before touching any config, I wanted two numbers: *when* did this start, and *which* dependency broke. The GitHub Actions history had both, for free.

```bash
gh run list --workflow="ping-app-health.yml" --status success --limit 3 \
  --json createdAt -q '.[].createdAt'
```

```
2026-06-03T07:06:50Z
2026-06-02T06:51:40Z
2026-06-01T13:07:03Z
```

Last green: **June 3rd**. Then:

```bash
gh run list --workflow="ping-app-health.yml" --limit 100 \
  --json conclusion -q '[.[].conclusion] | group_by(.) | map({(.[0]): length}) | add'
```

```json
{"failure":99,"startup_failure":1}
```

Ninety-nine consecutive failures. But the genuinely useful signal was the *other* workflow:

```
2026-08-01T03:37  success   Keep Redis Alive
2026-07-31T19:43  success   Keep Redis Alive
2026-07-31T14:24  success   Keep Redis Alive
```

`Keep Redis Alive` connects to Upstash using the same `REDIS_URL` secret the app uses, and it had been **green throughout the entire outage**. That is an independent, credential-level proof that Redis was healthy. One `gh` command eliminated a third of the dependency surface before I read a single line of application log.

> Two scheduled workflows hitting two different layers turned out to be worth more than either alone. The app-level probe said "something is broken." The dependency-level probe said "and it is not Redis."

## The log: a pool that starts and never finishes

Render's log stream had the shape of the problem:

```
05:49:31.658  INFO  o.h.e.t.j.p.i.JtaPlatformInitiator  : HHH000489: No JTA platform available
05:49:31.769  INFO  com.zaxxer.hikari.HikariDataSource  : HikariPool-1 - Starting...
06:38:18.723  OpenJDK 64-Bit Server VM warning: Options -Xverify:none and -noverify were deprecated
```

`HikariPool-1 - Starting...` and then **nothing** — until a fresh JVM boot 49 minutes later. The line that should follow, and never did, is `HikariPool-1 - Start completed.` The application was dying between those two log lines, over and over, in a restart loop.

The full stack trace bottomed out at the only line that mattered:

```
Caused by: java.net.UnknownHostException: pg-xxxxxxxx-chat-platform-db.g.aivencloud.com
    at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source)
    at org.postgresql.core.PGStream.createSocket(PGStream.java:243)
    at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:132)
    ...
    at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:561)
```

`UnknownHostException`. Not "connection refused." Not "authentication failed." Not "timeout." **The hostname did not resolve.**

I confirmed it from my laptop, outside Render entirely:

```bash
dig +short pg-xxxxxxxx-chat-platform-db.g.aivencloud.com
# (no output — NXDOMAIN)

dig +short ep-old-breeze-a1lpt8gb-pooler.ap-southeast-1.aws.neon.tech
# 52.220.170.93
# 13.228.184.177
```

The old Neon endpoint from [episode 014's migration odyssey](/blog/from-neon-to-supabase-to-aiven-postgresql-migration) still resolved. The current Aiven one had no DNS record at all.

### Why the record disappeared

Aiven's free tier powers off a service after a period with no client activity. When it powers off, the nodes are released and **the DNS record goes with them**. The service still exists in the console, your data still exists, but the hostname stops resolving until you power it back on.

This is a meaningfully different failure from the one you plan for. Everyone writes retry logic for "database is slow" or "connection refused." Almost nobody writes it for "the hostname ceased to exist," because in a normal production environment hostnames do not spontaneously stop resolving. Free tiers are not a normal production environment.

---

## The real bug: why the *whole app* died

Here is the part I actually got wrong, and the part worth internalising.

`application-render.yml` opens with what I thought was insurance:

```yaml
spring:
  main:
    lazy-initialization: true
```

Lazy initialization is supposed to mean beans are created on first use, not at startup. My mental model was that a dead Postgres would produce a degraded app: the UI would load, static assets would serve, non-DB endpoints would answer, and only the database-backed paths would fail.

That is not what happened, and the stack trace explains why:

```
Error creating bean with name 'securityConfig'
  → Unsatisfied dependency: 'jwtAuthenticationFilter'
    → Unsatisfied dependency: 'userService'
      → Unsatisfied dependency: 'userRepository'
        → Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory'
          → Unable to build Hibernate SessionFactory
            → JDBCConnectionException: Unable to open JDBC Connection for DDL execution
```

Read that chain bottom-up and the trap is obvious. `JwtAuthenticationFilter` is a **servlet filter**. Servlet filters are `ServletContextInitializer` beans, and Tomcat must instantiate every one of them at context startup to build the filter chain — there is no "first use" to defer to, because the filter chain *is* the thing being constructed. Spring has no choice but to create it eagerly.

Creating the filter requires `UserService`, which requires `UserRepository`, which requires the `EntityManagerFactory`, which requires a live JDBC connection because `ddl-auto: update` makes Hibernate run schema introspection at boot.

**So `lazy-initialization: true` bought me nothing.** One unreachable database took down Tomcat itself.

### The health endpoint could never have saved me

This is the sharpest lesson in the whole incident.

`HealthController` is genuinely good code. It probes all three stores, measures response times, caches results with a shorter TTL while unhealthy so recovery is noticed fast, and returns a proper non-200 when anything is down:

```java
@RestController
@RequestMapping("/api/health")
public class HealthController {
    @Autowired private DataSource dataSource;
    @Autowired private MongoTemplate mongoTemplate;
    @Autowired private RedisTemplate<String, String> redisTemplate;
    // ... deep probe with caching
}
```

It never ran. Not once in two months. Tomcat never finished starting, so no controller was ever mapped, so the endpoint that exists specifically to tell me "postgresql: DOWN" could not be reached **precisely when it had something to say**.

> A health check that shares a fate with the thing it monitors is not a health check. It is a second copy of the outage.

That is why the probe got zero bytes instead of a JSON body naming the dead dependency. The monitoring was structurally incapable of reporting the most important failure mode it had.

---

## Fix, part one: power on

The recovery itself was anticlimactic. Power the service back on in the Aiven console, then verify from outside:

```bash
dig +short pg-xxxxxxxx-chat-platform-db.g.aivencloud.com
# 165.22.223.111

nc -z -v -G 8 pg-xxxxxxxx-chat-platform-db.g.aivencloud.com 24531
# Connection to ... port 24531 [tcp/*] succeeded!
```

DNS back, TCP open. Then the question that actually mattered: **did the data survive?**

```bash
psql "host=... port=24531 dbname=defaultdb user=avnadmin sslmode=require" \
  -Atc "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
```

```
conversation_participants
conversations
users
```

```
users|8
conversations|5
```

All three tables, all rows intact, PostgreSQL 15.18. A power-off is not a deletion — the volume is preserved. Worth knowing before you panic.

## Fix, part two: two kinds of Postgres URL

This is the trap that would have cost me another hour if I had not caught it before redeploying.

Aiven hands you a connection string in this shape:

```
postgres://avnadmin:PASSWORD@pg-xxxxxxxx-chat-platform-db.g.aivencloud.com:24531/defaultdb?sslmode=require
```

That is a **libpq URI**. It is what `psql`, `pg_dump`, and most non-JVM drivers expect. Paste it straight into Render's `DATABASE_URL` and the app still will not boot, because `application-render.yml` passes it through unmodified:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    driver-class-name: org.postgresql.Driver
```

Spring hands `spring.datasource.url` to `DriverManager`, which selects a driver by asking each registered one `acceptsURL(url)`. `org.postgresql.Driver` only accepts strings beginning with `jdbc:postgresql:` or `jdbc:postgres:`. A bare `postgres://` URI matches **no** driver, so you get:

```
Driver claims to not accept jdbcUrl
```

...thrown before a single packet leaves the container. It never reaches DNS, never reaches TCP. A completely different error, at a completely different layer, that looks nothing like the problem you just fixed.

There is a second wrinkle: that profile sets no `spring.datasource.username` or `password`, so the credentials **must** live inside the URL as query parameters. The working value is:

```
jdbc:postgresql://pg-xxxxxxxx-chat-platform-db.g.aivencloud.com:24531/defaultdb?ssl=require&user=avnadmin&password=***&autoCommit=false
```

So the same database now needs **two different strings** depending on who is connecting:

| Consumer | Format | Shape |
| --- | --- | --- |
| Render `DATABASE_URL` (Spring) | JDBC | `jdbc:postgresql://host:port/db?user=…&password=…` |
| GitHub secret (`psql`) | libpq URI | `postgres://user:pass@host:port/db?sslmode=require` |

Writing that table down and keeping it somewhere is the actual deliverable of this section.

## Fix, part three: a truncated secret

With the app back up, I added a keep-alive workflow (below) and ran it. It failed:

```
psql: error: connection to server at "pg-xxxxxxxx-chat-platform-db.g.aivencloud.com"
(165.22.223.111), port 24531 failed:
FATAL:  password authentication failed for user "avnadmin"
```

Third failure mode, third layer. And notice how much this error tells you: DNS resolved (it printed the IP), TCP connected, TLS negotiated, the server parsed the username. Everything worked *except* the credential. That is a one-value fix, not a design problem.

The cause was mundane and entirely self-inflicted — my terminal had been mangling multi-line pastes all session, and the secret had been silently truncated on the way in. The robust fix avoids the interactive paste prompt entirely:

```bash
printf 'postgres://avnadmin:PASSWORD@HOST:24531/defaultdb?sslmode=require' > /tmp/pg_uri.txt
gh secret set AIVEN_POSTGRES_URI --repo user/repo < /tmp/pg_uri.txt && rm -P /tmp/pg_uri.txt
```

`printf` rather than `echo` is deliberate: `echo` appends a trailing newline, and a stray `\n` inside a connection URI is its own subtle authentication failure.

---

## Verification

```bash
curl -sS https://scalable-chat-platform.onrender.com/api/health/status
```

```json
{
  "service": "chat-platform-backend",
  "status": "UP",
  "dependencies": {
    "postgresql": { "responseTime": "82ms",   "details": "Connection successful", "status": "UP" },
    "mongodb":    { "responseTime": "64ms",   "details": "Ping successful",       "status": "UP" },
    "redis":      { "responseTime": "4046ms", "response": "PONG",                 "status": "UP" }
  }
}
```

And the CI probe, green for the first time since June 3rd:

```
overall: UP
  postgresql: UP
  mongodb: UP
  redis: UP
```

### An unrelated bug the health JSON just handed me

Look again at those response times. Postgres: **82ms**. Mongo: **64ms**. Redis: **4046ms**.

Redis is a thousand times slower than Postgres for a single `PING`. That is an Upstash free-tier cold start. Now compare it to the timeout configured in the same profile:

```yaml
spring:
  redis:
    timeout: 2000ms
```

The configured timeout is **2 seconds**. The observed cold-start latency is **4 seconds**. A user request that lands on a cold Redis will time out where my health check succeeded — because the health check ran first and warmed the connection. That is a latent production bug I would not have found without printing per-dependency timings, and it is a good argument for putting response times in health payloads even when everything says `UP`.

## Prevention

The keep-alive workflow, modelled directly on the Redis one that had been quietly proving its worth all along:

```yaml
name: Keep Postgres Alive

on:
  schedule:
    - cron: '30 */6 * * *'
  workflow_dispatch:

jobs:
  ping-postgres:
    runs-on: ubuntu-latest
    steps:
      - name: Install postgresql-client
        run: sudo apt-get update && sudo apt-get install -y postgresql-client
      - name: Ping PostgreSQL
        env:
          PG_URI: ${{ secrets.AIVEN_POSTGRES_URI }}
        run: psql "$PG_URI" -Atc "SELECT now();"
```

Two details that are easy to get wrong:

1. **The cron is offset to `:30`.** The Redis keep-alive runs at `0 */6`. Staggering them avoids two jobs contending for runners and hitting two providers in the same instant.
2. **Scheduled workflows only fire from the default branch.** A cron sitting on a feature branch is completely inert, and GitHub gives you no warning about it. Merging to `main` is not cosmetic here — it is what arms the job.

There is a third gotcha worth flagging: GitHub **disables scheduled workflows after 60 days of repository inactivity**. Dependabot keeps this repo busy enough that it has not bitten me, but if that ever stops, both keep-alives die silently — and then so does the database they protect.

---

## What I would actually change

The keep-alive is a workaround. It treats the symptom — an idle timer — rather than the disease, which is that **Postgres is a hard single point of failure for a deployment that does not need it to be**.

If I wanted this app to survive a database outage in degraded mode, the thing to fix is not connection pool settings. It is the dependency chain that pulls JPA into eager startup. Concretely:

- Break `JwtAuthenticationFilter`'s compile-time dependency on `UserService` — inject an `ObjectProvider<UserService>` and resolve it per-request, so filter construction no longer forces the JPA graph.
- Move off `ddl-auto: update` to a migration tool, so boot does not require a live connection for schema introspection.
- Give the health endpoint its own dependency-free path, so it can report `postgresql: DOWN` instead of sharing the outage.

Any one of those turns "the entire site is a 60-second timeout" into "the site loads and says the database is down." That is a much better two months.

## Lessons

**A red check nobody looks at is not monitoring.** The signal was there, correct and precise, every five minutes for two months. The gap was not detection — it was escalation. A failing scheduled workflow needs to reach a human, or it is just a log file with a nicer UI.

**Failure modes are legible by layer, if you read the exact exception.** `UnknownHostException` (resolution) → `Driver claims to not accept jdbcUrl` (client-side URL parsing, never leaves the process) → `FATAL: password authentication failed` (full connection, rejected at auth). Three errors, three layers, three completely different fixes. Reading the precise wording is faster than changing several things and redeploying blind.

**Verify at each layer before moving to the next.** `dig`, then `nc`, then `psql`, then the app. Each step took seconds and each one eliminated an entire category of cause. Fixing the environment variable and hitting redeploy would have conflated three separate problems into one confusing loop.

**Lazy initialization is not a resilience feature.** It defers what it can. Servlet filters are not among them. If a bean ends up in the filter chain, everything it transitively depends on is a startup-time hard dependency, whatever the config says.

The app has been up since, the keep-alive is green, and the health endpoint is once again the first place I will look — assuming, this time, that something tells me to look.

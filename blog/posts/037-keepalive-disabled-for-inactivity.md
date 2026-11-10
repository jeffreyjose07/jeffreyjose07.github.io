---
title: "The Keepalive That Was Disabled for Inactivity"
date: "2026-11-10"
slug: keepalive-disabled-for-inactivity
tags:
  [
    "scalable-chat-platform",
    "aiven",
    "postgresql",
    "github-actions",
    "ai-agents",
    "mcp",
    "monitoring",
    "incident",
    "free-tier",
  ]
description:
  "In August I shipped a workflow to stop Aiven powering off my free Postgres. The event log
  says it lost: the write ping ran every six hours for twelve days and Aiven powered the
  service down anyway. Meanwhile GitHub disabled the whole workflow for repository inactivity
  on day 62 — an inactivity shutdown one layer up — and the API half never ran at all because
  its secret was never set."
readingTime: 18
wordCount: 3655
---

Working log for [scalable-chat-platform](https://github.com/jeffreyjose07/scalable-chat-platform). **Previous:** [The Two-Month Outage: Dead DNS, Eager Filters, and Two Kinds of Postgres URL](/blog/two-month-outage-aiven-dns-and-jdbc-urls).

Episode 033 ended on a confident note. The app was up, the keep-alive was green, and I wrote that the health endpoint was "once again the first place I will look — assuming, this time, that something tells me to look."

Nothing told me to look. I went looking anyway, three months later. The fix I shipped in August had failed, and it failed in a more interesting way than "it didn't run": one half never ran at all, the other half ran perfectly and was beaten anyway, and the thing meant to supervise both was switched off by GitHub for inactivity.

Then I connected Aiven's management API and found out the outage I wrote about in episode 033 was the *second* one.

---

## The scoreboard, and why it lies

In August I replaced a read-only `SELECT now();` ping with a workflow testing two hypotheses about what Aiven counts as "activity." Then I pushed it and stopped thinking about it. Three months of run history:

```bash
gh run list --workflow=keep-postgres-alive.yml --limit 400 \
  --json conclusion -q '.[].conclusion' | sort | uniq -c
```

```
 256 failure
  25 success
```

Every one of those 25 successes is in the first week of August, and the last is on **2026-08-07**. My first reading was the obvious one: it went red when the database died and never recovered.

That reading is wrong, and the way it is wrong is the most useful thing in this post. The job was red for three months because of a *missing secret in its first step*, not because the database was unreachable. For long stretches inside those 256 failures, the part I actually cared about was working fine. A red job conclusion told me nothing, and I had trained myself to read it as if it told me everything.

## Hypothesis A never ran, not once

The first hypothesis was that Aiven's notion of activity concerns the *platform*, not the database — the warning email says free services are powered off if "they or the Aiven platform aren't actively used," and the remedy it prescribes is logging into the Console. An authenticated API call was the closest programmatic stand-in, and I thought it the stronger bet.

```
AIVEN_API_TOKEN:
##[error]Set repository secret AIVEN_API_TOKEN (Aiven Console -> User profile -> Tokens).
```

Empty, on every run from August to October. The half of the experiment I considered most likely to be the answer **never executed a single time**, and I have no data about it whatsoever.

That is a design fault rather than an oversight. I wrote a step that fails loudly without a secret, handed over an instruction to create that secret, and built nothing that would notice if it never happened. In a run history, "never ran" and "ran and failed" render identically — both are a red X. I had 256 of them and could not distinguish the two states without opening a log.

**An unset secret is an untested hypothesis wearing a failure's clothes.** Worse: here it was also a *successful* hypothesis wearing a failure's clothes, because it masked this.

## Hypothesis B ran correctly for twelve days and lost

The second hypothesis was that a genuine write might register where a read did not — `INSERT … ON CONFLICT DO UPDATE`, generating WAL and advancing the transaction id. I verified the SQL against a throwaway Postgres before shipping, and in my first pass at this post I wrote that it "could never have worked," reasoning that a powered-off service has no DNS record, so the write could never land.

That is true of *recovery* and irrelevant to *prevention*. Here is a run from 5 September:

```
INSERT INTO keepalive_ping AS k (id, last_ping, ping_count)
        SET last_ping  = now(),
            ping_count = k.ping_count + 1;
 id |           last_ping           | ping_count
```

The write landed. It kept landing, every six hours. And the Aiven event log records what happened next:

```
2026-09-02T15:37:11Z  jeffreyjose.k@gmail.com  Powered on the service
2026-09-14T23:26:58Z  Aiven Automation         Powered down the free service due to inactivity
```

Twelve days of a WAL-generating write every six hours, and Aiven powered the service down **for inactivity**. The same thing had already happened in August: powered on the 15th, write ping running the whole time, powered down on the 24th.

So hypothesis B is not untested and not unworkable. It is **falsified**. Writing to a free Aiven Postgres on a six-hour cadence does not stop Aiven from deciding the service is inactive. Whatever that automation measures, it is not transactions.

This is a better outcome than the one in my draft. "Could never have worked" is an argument. "Ran for twelve days and the service was powered off anyway" is a result.

## The event log is the only honest history

Episode 033's closing lesson was *check the platform, not your config*. I had been reconstructing this incident from GitHub Actions logs and `dig`. One call to Aiven's event log replaced all of it:

| Powered on (actor) | Powered down by Aiven | Days up | Keepalive in place |
| --- | --- | --- | --- |
| — | 2026-03-07 | — | none |
| 2026-05-19 (me) | 2026-05-24 | 5 | none |
| 2026-05-27 (me) | 2026-06-09 | 13 | none |
| 2026-08-01 (me) | 2026-08-07 | 6 | read-only `SELECT` |
| 2026-08-15 (me) | 2026-08-24 | 9 | WAL write |
| 2026-09-02 (me) | 2026-09-14 | 12 | WAL write |
| 2026-11-10 (me) | — | — | Aiven agent |

Four things fall out of that table.

**Every power-on in eight months was manual.** Six of them, all with my address in the `actor` field. Every power-down was `Aiven Automation`, every one citing inactivity. Nothing I have ever built has recovered this database. I have been the recovery mechanism, running on an interval of "whenever I happen to notice," which the table measures at between five days and two and a half months.

**There is no fixed threshold.** Five, thirteen, six, nine, twelve days. In August I listed "the exact inactivity threshold" as the key missing number and assumed it was a constant I hadn't found. It isn't a constant. Aiven's own free-tier documentation declines to give a figure, and the event log shows why — the interval varies by a factor of nearly three.

**The keepalive cannot be credited with the variation.** The write-ping windows are the two longest of the four short ones (9 and 12 days), which looks encouraging until you notice that a window with no keepalive at all ran 13 days. With n=5 and a spread of 5–13, the variance swallows any effect. I can say the write ping did not prevent the power-off. I cannot say it did nothing, and I am not going to pretend otherwise.

**Episode 033 documented the wrong outage.** That post was about a two-month blackout, which the log dates to 2026-06-09 → 2026-08-01, fifty-three days. Directly above it sits **2026-03-07 → 2026-05-19: seventy-three days**, twenty days longer, which I never knew about and which no post of mine mentions. I wrote three thousand words about my worst outage while a worse one sat one row up in a log I hadn't thought to read.

## The finding: the monitor was disabled for inactivity

The run history stops on 2026-10-16. Not a failure — it simply stops, 25 days before I went looking.

```bash
gh workflow list --all --json name,state -q '.[] | "\(.state)  \(.name)"'
```

```
active                Frontend CI
disabled_inactivity   Keep Postgres Alive
disabled_inactivity   Keep Redis Alive
disabled_inactivity   Ping app health
active                Dependabot Updates
```

`disabled_inactivity`. GitHub disables scheduled workflows in repositories with no activity for 60 days. My last commit was the keepalive experiment itself, on 2026-08-15 — and Aug 15 to Oct 16 is **62 days**. The rule fired almost exactly on schedule.

So the chain reads: the free Postgres powers off because nothing used it for long enough, and the GitHub Action built specifically to prevent that is switched off because nobody committed to its repository for long enough. **The watchdog was killed by the same kind of timer it was built to defeat, one layer up.**

Neither policy is a bug. Nobody should burn cloud capacity on abandoned projects, and a cron job firing forever against a repo its owner forgot is exactly the waste GitHub's rule exists to stop. The failure is in the composition: I built a free-tier guard on top of a free tier and never asked what *its* idle policy was.

One more detail in that output. `Frontend CI` and `Dependabot Updates` are still `active` — event-triggered workflows are unaffected, only `schedule:` gets disabled. Every alarm I had was on a schedule. They all went quiet together, which is the worst possible correlation for a set of supposedly independent alarms.

## What an Aiven managed agent changes

The fix now in place is an Aiven **managed agent** — `postgres-health-monitor`, running `gemini-3.8-flash` hourly, inside the Aiven project itself. [Managed Agents](https://aiven.io/docs/tools/agents) is in limited availability; you request access per project and enable it once approved. Its instructions tell it to enumerate services, inspect health and node state, and restart any PostgreSQL service failing three consecutive health checks, with guardrails against destructive actions.

The important thing about it is not the model and not the remediation logic. It is the **address**.

Every previous version of this guard lived somewhere that could go idle: a GitHub Actions schedule in a repository I might not commit to, pinging a database that might not exist. The agent lives on Aiven's side of the boundary. It has no repository to go quiet, and crucially it does not need the database to be reachable to do its job — it talks to the management API, which answers whether or not any VMs exist. Both August hypotheses failed on placement rather than logic. This one is placed correctly, and placement is the thing that was actually wrong.

### My prediction, written down to be falsified

**The restart branch will rarely or never fire, and the agent will work anyway.**

An agent that runs hourly and calls the management API to list projects and inspect services is, every hour, *using the Aiven platform*. That is hypothesis A — the one whose secret I never set — finally running in production, by accident, on someone else's infrastructure. The remediation is the headline feature; the heartbeat is the mechanism.

Note what the table above says about this: today's power-on at 14:29 was mine, not the agent's. The agent is minutes old and has recovered nothing yet. In eight months of event log there is not one automated recovery of any kind. So this prediction is live, and the event log is exactly where it will be settled — the next `service_poweron` row will name either `Aiven Automation`, the agent, or me.

## Four things in those instructions worth a second look

I read the agent's system instructions against Aiven's documentation. Four mismatches, worst first.

**The remediation verb may not match the failure mode.** The instructions say to "initiate a service restart." Aiven's [power cycle documentation](https://aiven.io/docs/platform/concepts/service-power-cycle) describes three operations on this axis — power off, power on, delete — and restart is not among them. A powered-off service has had its VMs *removed from the cloud*; there is no process to restart. Recovery is `avn service update SERVICE_NAME --power-on`, which creates new VMs and restores from the latest backup, and can take "from a few minutes to a few hours." If the agent's tool surface offers a restart but not a power-on, the one scenario I built it for is the one scenario it cannot fix. And the event log confirms the state it will actually encounter is `service_poweroff`, not a sick node.

**A powered-off service may not fail a health check — it has no health to check.** The trigger is "three consecutive health check failures." A service with no nodes doesn't report failing nodes; `aiven_service_get` returns a `state`. Mine currently reads `RUNNING` with one node `running`. Powered off, there is nothing to fail three times. The condition worth watching is `state != RUNNING`, which is simpler and strictly more reliable than counting failures.

**The 403 is about the agent's identity, not yours.** The permissions error reads `user_role_not_allowed_to_perform_operation`, which sounds like it refers to you. It doesn't. [Agents get their own Aiven identity](https://aiven.io/docs/tools/agents/permissions) — "the agent uses this identity, not yours" — with its own MCP role: read-only, read-write, or full access. Read-write explicitly cannot create or delete services; changing service configuration needs full access. A power-on is a service update. So an agent under-privileged enough to be refused the event log is very likely under-privileged enough to be refused the power-on, and it would discover that at the worst possible moment. That is a role to fix in the integration settings, not a prompt to reword. For contrast, my own membership on this project reads `admin` — which is why the same event-log call that 403'd for the agent returned twelve rows for me.

**A system instruction is not a constraint.** The 404 came from calling `/v1/project/chat-platform` when the project is `chat-platform-db`. The usual reading is that the model shortened a name from conversational context. What makes it interesting is that the instructions *already forbid this*, in as many words: "Dont ask the user which project to use — call the Aiven project-listing tool to resolve it yourself." The instruction to look it up rather than guess was present, and it guessed anyway. Prompt text expresses a preference. If a value must be correct, pin it literally or make the lookup the only path to it. `aiven_project_list` returns exactly one project here, so there was never anything to guess.

## Three expiry timers, stacked

The agent is a better design than mine. It also sits on three clocks, and I would rather write them down now than rediscover them in a log:

| Clock | Length | What happens |
| --- | --- | --- |
| Agent MCP token | 90 days | Aiven-managed and not viewable; renewed by reconnecting MCP for the agent |
| Platform trial | 30 days remaining | $50 of credits, against **non-free** plans only |
| Powered-off service | 180 days | Service is deleted automatically |

The second row has a wrinkle worth stating plainly, because I assumed otherwise before checking. `aiven_service_get` reports this service as `plan: free-1-1gb`, `plan_price_usd: 0`. The trial credits apply to non-free plans, so they are not protecting this database and the free-tier power-off policy applies in full. The trial is not a reprieve.

The 90-day row is this post's own lesson wearing better clothes. An agent whose credential silently expires in 90 days is a workflow that silently disables in 62. The failure mode is identical: the guard stops, nothing announces it, and the thing it guarded is fine right up until it isn't. I don't have a clean answer for that. The honest version is that every free or trial tier in this chain has an idle or expiry policy, each longer than my attention span and shorter than forever, and the only durable fix is the one I keep declining to buy.

## Where it actually stands

The database is genuinely back — `state: RUNNING`, one node `running`, `pg_version` 15.19, and a fresh backup at 14:37 today. The backup list is its own little tell:

```
2026-09-13_03-54   42885294
2026-09-14_03-54   42936494
2026-11-10_14-37   42956974
```

Two days in September, then a 57-day hole, then today. Backups stop when the VMs stop; the gap is the outage, recorded in a field nobody thinks to read.

### The correction: the app was asleep, not dead

I first published this section saying the app was down, on this evidence:

```bash
curl -sS --max-time 120 -w "HTTP=%{http_code} time=%{time_total}s\n" \
  https://scalable-chat-platform.onrender.com/api/health/status
```

The first request returned zero bytes after 75 seconds; the second returned HTTP 502 in 9.3 seconds. Episode 033 built a taxonomy for exactly that — zero bytes means nothing upstream accepted the connection, a fast 502 is Render's own page for a container that died — so I wrote that the first request woke something and the second got the corpse, and I blamed the boot dependency.

That was wrong, and the Render logs say so plainly. Every boot in them completes:

```
Started ChatPlatformApplication in 157.503 seconds
Started ChatPlatformApplication in 80.699 seconds
Started ChatPlatformApplication in 82.792 seconds
```

No exception, no stack trace. The app boots fine. What I measured was a **cold start on a free instance**, and the dashboard explains why: the service runs on Render's **Free** plan, which spins down after roughly fifteen minutes without traffic — so `render.yaml`'s `plan: starter` is still fiction, exactly as episode 033 found. Laid against my own requests:

| Time | Event |
| --- | --- |
| 14:36:47 | boot Started (157s); browser traffic at 14:37 |
| 14:51:47 | last scheduler log, then silence |
| ~14:52 | spun down — last real traffic 14:37, plus fifteen minutes |
| 15:04:56 | **my curl wakes it** → boot Started 80.7s later |
| 15:06:26 | `Instance restarted` |
| 15:15:23 | `Instance restarted` |
| 15:31 | `HTTP 200` in 5.1s |

My probe was the thing that woke it. The zero bytes was an eighty-second boot in progress; the 502 was Render answering while that boot still ran. Nothing had died. As of this edit the app is fully healthy — `HTTP 200` in 0.19s, all three dependencies `UP`, Redis at **66ms** against the 4301ms I measured in August.

The symmetry with episode 033 is the part worth keeping. That post warned that a 45-second probe timeout against a 45-to-60-second cold start "produces failures that are indistinguishable from a real outage — which is precisely how a genuine outage hid in plain sight." Startup has since grown to 80–157 seconds. I wrote that warning down, published it, and then walked into it from the other direction: in 033 a real outage hid behind cold starts, and here a cold start impersonated an outage.

Two things in that table remain real problems. The restarts at 15:06 and 15:15 are genuine and I **cannot** attribute them — an OOM kill and a Render-initiated recycle look identical from inside the container, and `-XX:MaxRAMPercentage=75.0` asks for a 384 MB heap inside a 512 MB instance, leaving very little for metaspace, code cache and thread stacks. Separately, Render's **Health Check Path is still empty**, three months after episode 033 called setting it "the single highest-value change on this list." Nothing probes the app, so a failed boot is never caught and a deploy is marked Live regardless.

The boot dependency I blamed is still a real design flaw — `ddl-auto: update` makes Hibernate connect during startup, so a container booting while the database is off cannot start. It just wasn't what I was looking at. Nor is it idle: the commit Render currently has live is `eb20ccd`, the August keepalive experiment itself. Nothing has deployed since, because auto-deploy fires on commit and there have been no commits.

That is the next piece of work, and most of it turns out to be configuration rather than code — the opposite of what I claimed when I first published this.

## Lessons

**A red check is not a signal, it is a prompt to read a log.** 256 failures encoded at least three distinct states — secret missing, host unresolvable, and write succeeding while a sibling step failed — and the dashboard rendered all three identically. If a step can fail for a reason that isn't the thing you're monitoring, it will, and it will hide the thing you're monitoring.

**Ask what the idle policy is of the thing you use to defeat an idle policy.** Free tiers compose, and so do their timers. A scheduled GitHub Action guarding a free database is two inactivity clocks in series, and the shorter one wins.

**A keepalive you cannot measure is a belief.** I shipped a write ping, never checked whether it ran, and would have gone on believing it worked. The event log settled in one call what three months of run history could not.

**On a free tier, a cold start and a corpse are the same observation.** Zero bytes then a fast 502 is what a dead container looks like, and also what an eighty-second boot looks like from outside. Only the platform's own logs separate them — and a probe against a service that spins down changes the state it is measuring, so the first request is never evidence about what was there before it.

**Move the watchdog outside the thing it watches, and prefer the control plane.** The agent's advantage is not that it is cleverer. It lives somewhere that does not go idle and talks to an API that answers when every VM is gone.

**A system instruction is a preference, not a constraint.** The agent's own prompt told it to look the project name up instead of guessing. It guessed. Anything that must be correct should not depend on a model choosing to comply.

**Read the vendor's verbs.** "Restart" and "power on" sound interchangeable and are not: one acts on a running process, the other rebuilds VMs from backup and can take hours. Remediation has to name the operation the platform actually implements.

**Check the platform, not your config — and then check the parts of the platform you didn't think to ask about.** I ended episode 033 on the first half of that and still managed to miss a seventy-three-day outage sitting one row above the one I wrote about. `render.yaml` still says `plan: starter`. The event log, the workflow states, and the backup list tell the truth.

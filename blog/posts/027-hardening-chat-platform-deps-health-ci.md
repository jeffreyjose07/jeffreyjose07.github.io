---
title: "Hardening the Chat Platform: Deps, Deep Health, and CI Pings"
date: "2026-05-27"
tags:
  [
    "scalable-chat-platform",
    "spring-boot",
    "react",
    "github-actions",
    "health",
    "deployment",
  ]
description:
  "Merged five Dependabot frontend PRs, fixed React 19 + Docker builds, opened actuator health for probes,
  and added caching and rate limits—then moved scheduled pings into the app repo so nothing doubles up."
readingTime: 8
wordCount: 1100
---

This is a working log for [scalable-chat-platform](https://github.com/jeffreyjose07/scalable-chat-platform): what got merged, why the order mattered, and where health checks and GitHub Actions ended up. The app already exposes a **deep** checklist at `GET /api/health/status` (PostgreSQL, MongoDB, Redis); Actuator health is in the mix where Spring is configured for it. This session was about **not** treating that endpoint as free work for the world, and about **not** running the same cron in two repositories.

## Dependabot and merge order

Five frontend-related bumps landed after resolving conflicts:

- **Headless UI** → `2.2.9`
- **axios** → `1.12.2`
- **@hookform/resolvers** → `5.2.2`
- **react-hook-form** → `7.65.0`
- **React 19** with aligned types

**Headless UI went in before React 19** on purpose. Older Headless UI majors and React 19 do not always play nice together; ordering the merge avoids a broken peer dependency surface while the lockfile settles.

After React 19 landed, **`useRef` typing in search-related components** needed tightening—straightforward breakage from stricter generics, fixed in place rather than suppressed with `any`.

## Health checks and abuse resistance

Nothing changed about what “healthy” means: the deep route still aggregates real dependencies. The hardening story is **who can hammer it** and **how often the expensive path runs**.

**Security configuration** allows anonymous access to actuator-style health probes where uptime tools need them: `/api/actuator/health/**` and `/actuator/health/**` (see commit `13580ca` on the app repo). That keeps external monitors and container health checks honest without opening the rest of the admin surface.

To avoid turning `/api/health/status` into an accidental DDoS against your own databases:

- **TTL caching** on the deep health response so repeat hits within a window reuse a stored result.
- A **separate rate-limit bucket** for health traffic so normal API throttles stay sensible.
- **Broader URL patterns** on the limiting filter (`/api/*`, `/actuator/*`, `/health`) so probes and API traffic are categorized consistently.

Configuration lives under `app.health.*` (cache TTL and related knobs in `application.yml`). **Tests** cover the health controller—including cache behavior—so regressions fail in CI instead of production.

## Render, Docker, and the frontend install step

Render’s Docker build failed during `frontendInstall`: **Testing Library React v13** and **React 19** do not belong in the same install graph. The fix was to move to **@testing-library/react v16**, add **@testing-library/dom**, bump **@testing-library/user-event**, and **regenerate `package-lock.json`** so CI and Docker see one consistent tree.

## GitHub Actions: one place for scheduled pings

The app repository now owns **`.github/workflows/ping-app-health.yml`**: cron roughly every five minutes plus `workflow_dispatch`, `APP_BASE_URL` secret, `curl`, and **`jq`** for a readable summary. That is where scheduled wake-ups belong—same repo as the service, secret colocated with deployment docs.

Earlier I had experimented with a **portfolio** workflow (`keep-alive.yml`) hitting the Render URL from [jeffreyjose07.github.io](https://github.com/jeffreyjose07/jeffreyjose07.github.io). That duplicated the cron and split configuration across projects. **I removed it from the Pages repo** so there is exactly one scheduler: the chat platform workflow. No duplicate pings, no need for `APP_BASE_URL` on the blog side.

## What I deliberately did not commit

Local `backend/src/main/resources/static/static/js/main.*` bundles from a dev build stayed out of git—noise, not source of truth.

## Links and commits (app repo)

- [`13580ca`](https://github.com/jeffreyjose07/scalable-chat-platform/commit/13580ca) — actuator health paths reachable for anonymous probes.
- [`f04579c`](https://github.com/jeffreyjose07/scalable-chat-platform/commit/f04579c) — ping workflow, Testing Library / lockfile fix, health cache, rate limits, tests, and config.

If you fork the platform, copy the **ping workflow** and set **`APP_BASE_URL`** in that repository’s secrets; keep the **portfolio** repository focused on static site and blog builds only.

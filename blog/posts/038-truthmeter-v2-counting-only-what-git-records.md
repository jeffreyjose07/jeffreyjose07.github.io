---
title: "TruthMeter 2.0: Deleting the Guesswork and Counting Only What Git Records"
date: "2026-11-15"
slug: truthmeter-v2-counting-only-what-git-records
tags: ["truthmeter-ai", "typescript", "vscode", "git", "ai-agents", "metrics", "testing", "github-actions", "developer-tools"]
description: "A year after shipping TruthMeter AI, I opened it again and found its core number meant nothing: any paste, any autocomplete and any file containing console.error counted as 'AI'. Version 2 deletes 19,000 lines and measures only verifiable evidence: co-author trailers, git blame survival, fix-within-72h and opt-in agent session logs. It is also the first release published to the Marketplace with no stored token."
---

Working log for [truthmeterai](https://github.com/jeffreyjose07/truthmeterai). **Previous:** [Building TruthMeter AI: Measuring the Real Impact of AI Coding Assistants](/blog/building-truthmeter-ai-measuring-the-real-impact-o).

Episode 021 opened by complaining that AI vendors publish misleading metrics. "95% acceptance rate" means nothing if developers rewrite what they accept. I built TruthMeter to measure the real thing instead, wrote 4,500 words about it, and shipped it with 145 passing tests.

A year later I opened it again to update its dependencies. Before touching `package.json` I read the function every number in the extension depended on. It was producing exactly the kind of number that post complained about.

This is the story of version 2: what was wrong, what replaced it, and what the replacement says about this blog's own repository.

---

## The function everything rested on

Every metric in v1 started from one question: was this edit made by an AI? VS Code has no API for that, so v1 guessed. This is the code from episode 021, unchanged:

```typescript
private isAIGenerated(change: TextDocumentChangeEvent): boolean {
  const text = change.document.getText();
  const insertedLength = change.contentChanges[0]?.text.length || 0;

  // Heuristic 1: Large text insertions (>100 chars at once)
  if (insertedLength > 100) return true;

  // Heuristic 2: Pattern matching for AI signatures
  const aiPatterns = [
    /\/\/ TODO: Implement/gi,
    /function\s+\w+\([^)]*\)\s*{\s*\/\/ Implementation/gi,
    /catch\s*\([^)]+\)\s*{\s*console\.error/gi
  ];
  if (aiPatterns.some(pattern => pattern.test(text))) return true;

  // Heuristic 3: Rapid successive changes (AI streaming)
  const timeSinceLastChange = Date.now() - this.lastChangeTime;
  if (timeSinceLastChange < 100 && insertedLength > 20) return true;
```

Read each heuristic as a test with false positives:

- **Heuristic 1** counts any insertion over 100 characters. That includes pasting from Stack Overflow, pasting your own code from another file, and `git checkout` rewriting a buffer. A paste is not an AI.
- **Heuristic 2** is worse than it looks. `text` is `document.getText()`, the **whole file**, not the inserted text. Once a file contains one `catch (e) { console.error`, every edit you make to that file counts as AI-generated, including typing a single character.
- **Heuristic 3** treats two changes less than 100 ms apart as AI streaming. Accepting an IntelliSense suggestion, expanding a snippet and format-on-save all do that.

Everything else sat on top: churn, the "AI share" percentage, the ROI dashboard that turned hours into rupees. The research figures the post quoted were real. They were being multiplied by a number that meant nothing.

The 145 tests did not catch any of this, and they could not have. They checked that the heuristics returned what the heuristics were written to return. No test asked whether a paste is an AI. **A test suite can only confirm a definition. It cannot tell you the definition is wrong.**

## The rule for version 2

One constraint decided everything else: **count only what is recorded somewhere you can verify.** If TruthMeter says a commit is AI-written, you can open the commit and see why. Where no evidence exists, the extension says it doesn't know instead of guessing.

That ruled out keystroke timing and pattern matching completely. What is left are four sources of evidence, each of which you can check yourself:

1. **Attribution in git history.** Co-author trailers, agent bot authors and tool footers.
2. **Line survival.** `git blame` at HEAD shows how much of that code still exists.
3. **Fix within 72 hours.** How often a commit is followed by a fix or revert touching the same files.
4. **Agent session logs**, opt-in. Claude Code and Codex record every file they edit, locally.

The rewrite deleted 18,957 lines and added 6,221. Webpack, husky, nyc, the ROI calculator, the keystroke tracker and three planning documents for features that never shipped are all gone. The extension now has zero runtime dependencies and bundles to **32 KB** with esbuild. v1 was 2 MB.

![The TruthMeter 2.0 dashboard](/blog/images/truthmeter-v2-dashboard.png)

## Attribution: who says a commit was AI-written

AI coding tools increasingly sign their work. Claude Code adds `Co-Authored-By: Claude … <noreply@anthropic.com>` and a "Generated with Claude Code" footer. GitHub's coding agent commits as `copilot-swe-agent[bot]`. Jules commits as `google-labs-jules[bot]`. Cursor, Codex, Aider, Devin, Windsurf and Amazon Q all leave something similar.

Matching those looks trivial, but it isn't, because these tools have human names. A rule as loose as `/claude/i` on the co-author line flags a painter:

```typescript
it('does not flag a human co-author named Claude', () => {
    assert.strictEqual(classifyCommit(human('docs\n\nCo-authored-by: Claude Monet <claude@monet.fr>')), undefined);
});
```

Jules Verne and Devin Smith had the same problem. The final rules anchor on something no human contributor would have: an `@anthropic.com` address or a model name for Claude, the `google-labs-jules` bot identity for Jules, `devin-ai-integration` or a Cognition address for Devin. Each signal also carries a **confidence**. A Copilot co-author trailer is marked *medium*, because it says Copilot was involved without saying how much of the commit it wrote. A bot author is *high*: the bot made the commit.

Rules are checked in a fixed order: custom rules from your settings, then agent authors, then trailers, then footers. A team that tags commits `[ai-assisted]` can add that as a rule without waiting for me. An invalid regex in a custom rule is skipped instead of crashing the analysis, and there is a test for that too.

## Survival: is the code still there?

GitClear's churn research is the reason this matters. A commit is easy to count. What is still in the codebase weeks later tells you whether the commit was any good.

TruthMeter runs `git blame --line-porcelain -w HEAD` across the files those commits touched and counts how many current lines each commit still owns. Three details turned out to matter:

- **Only mature commits count.** Code written yesterday has had no time to be rewritten, so including it inflates survival. By default a commit must be 14 days old, and the dashboard shows newer commits as "too recent" instead of as 100%.
- **The denominator is measurable lines.** If a file was deleted, its lines count as gone. If blame was skipped for a file, because of the 400-file cap on huge repos, its lines are dropped from both sides instead of being counted as lost.
- **Lock files and build output are excluded.** A `package-lock.json` change can add 5,000 lines. Without the exclusion one dependency bump would outweigh a month of real work.

`-w` matters too: without it, a reformat that only changes whitespace hands every line to whoever ran the formatter.

## Fix within 72 hours, and the files everything touches

The second quality signal is how often a commit is followed, within three days, by a `fix:` or revert that touches the same files. It is cheap to compute and easy to explain.

On the first runs against real repositories the fix rate came out far too high. The cause was `package.json`. Nearly every commit touches it, nearly every fix touches it, so every commit "shared a file" with a later fix. `README.md` and `CHANGELOG.md` did the same thing. These hub files (manifests, READMEs, changelogs, `.gitignore`) are now ignored when looking for shared files, and the rate dropped to something believable.

Rates are also withheld when either group has fewer than five mature commits. A 0% or 100% from two commits is noise presented with a percentage sign.

## Agent logs: the commits that don't say so

Trailers only work if they are kept. Plenty of people turn them off, and some repositories forbid them outright. Agents still leave a record locally, though:

- **Claude Code** writes JSONL transcripts to `~/.claude/projects/`. Every `Edit`, `Write` and `MultiEdit` tool call includes the absolute `file_path` and a timestamp.
- **Codex** writes sessions to `~/.codex/sessions/`. Its `apply_patch` calls contain `*** Update File:` headers, and the session metadata records the working directory.

With logs enabled, TruthMeter finds commits with no trailer whose files an agent edited in the 24 hours before the commit. They stay in the "other" group, since an agent editing a file doesn't prove it wrote the commit. The dashboard reports how many there are, as a warning that the AI share is probably understated.

This is **off by default** and turning it on asks for explicit consent. TruthMeter reads only file paths and timestamps inside the current workspace, never prompts or code, and nothing leaves the machine. Session logs are private data even when they are on your own disk.

## What it says about this blog

The first repository I pointed it at, after its own, was this one. Over the last year:

| | |
| --- | --- |
| Commits | 173 |
| AI-attributed by trailer | 23 |
| No trailer, but Claude Code edited their files within 24 h | **18** |

The 18 are not a bug. This repository's `CLAUDE.md` forbids AI co-author trailers, and a git hook rejects them. TruthMeter has never seen that file. It found the gap from the session logs alone, and it reported those 18 as "other" with a caveat that the true AI share is higher. Counting both, at least 41 of 173 commits, about a quarter, had an agent involved.

Then a result I almost put in the wrong section. AI-attributed lines here survive at **67%**, other lines at **38%**. It reads like a headline: AI code lasts longer than mine.

It doesn't mean that. The "other" group contains the `auto: rebuild blog` commits that CI makes after every post. Those commits regenerate HTML in `public/blog/`, and the next rebuild rewrites much of it again. Generated output that gets regenerated on every deploy is about the least durable code possible, and it is all on the human side of the comparison. TruthMeter excludes `dist/`, `build/` and `out/` but not `public/blog/`, and it does not separate bot commits from human ones yet.

So the honest reading is that this comparison is confounded, and the tool did not warn me about it. That is the next feature: treat commits by CI bots as their own group. I would rather publish that than the 67%.

On TruthMeter's own repository the answer is simpler: 5 of 5 commits are AI-attributed. I wrote v2 with Claude Code, and the commits say so.

## Testing against git instead of against itself

v1's tests mocked git and checked the heuristics against themselves. v2's main integration test builds a real repository in a temp directory and back-dates every commit with `GIT_AUTHOR_DATE` and `GIT_COMMITTER_DATE`:

- six AI commits 35 to 40 days old, ten lines each
- six human commits alongside them
- a human `fix:` one hour after AI commit #3, changing one of its lines
- a refactor 20 days ago that rewrites five lines in three of the AI files, plus a 500-line lock file
- one AI commit two days old

That scenario has answers you can work out on paper before running anything. 60 AI lines are in mature commits, 15 are rewritten by the refactor and one by the fix, so survival must be exactly **44/60**. One of six mature AI commits was fixed within 72 hours, so the fix rate must be exactly **1/6**. Human lines must total 80, not 580, because the lock file is excluded. The test asserts those numbers. A heuristic can't pass a test like that by agreeing with itself.

The end-to-end suite launches real VS Code twice in CI, version 1.90 (the minimum supported) and the current stable, opens the same fixture repo and checks the commands, status bar and dashboard. That caught a problem no unit test would: mocha 12 is ESM-only, and VS Code 1.90's extension host loads tests with `require()`, so the whole suite died with `ERR_REQUIRE_ESM` before running one test. Mocha is pinned to 11, with a note in the repo saying why.

Building the webview turned up one more gotcha. The dashboard's comparison bars are sized with inline `style=""` attributes. If a nonce is present in `style-src`, browsers **ignore** `'unsafe-inline'`, so those attributes would be silently blocked. The fix is to use the nonce only for scripts and leave `style-src` with `'unsafe-inline'` and no nonce.

## Publishing in late 2026

The release workflow is the part of the project that changed most underneath me. Microsoft is retiring global Azure DevOps personal access tokens, and on **1 December 2026** they stop working for Marketplace publishing. The `VSCE_PAT` secret this repo had used since 2025 has two weeks left.

The replacement is **trusted publishing**: GitHub Actions requests a short-lived OIDC token for the workflow run, and the Marketplace exchanges it for a publish credential, but only after checking the token's claims against a policy you set on the publisher page: repository owner, repository and workflow filename. Nothing long-lived is stored anywhere.

I shipped 2.0.0 with both paths, OIDC first and the PAT as a fallback. The OIDC step failed with:

```
The token could not be exchanged for the specified publisher.
```

That was expected. No policy existed yet, so the PAT fallback published 2.0.0. After adding the policy (`jeffreyjose07` / `truthmeterai` / `publish.yml`), I tagged 2.0.1 and the run went:

```
success  Publish to VS Code Marketplace (OIDC trusted publishing)
skipped  Publish to VS Code Marketplace (PAT fallback, works until 2026-12-01)
success  Publish to Open VSX
```

Then I deleted the fallback and the secret. Leaving it would have been worse than useless. The OIDC step had `continue-on-error: true` so the fallback could run, which means a broken policy would have fallen through to an expired token. The run would fail with a confusing 401 from the wrong step instead of the real error.

Two more details. The policy records GitHub's **numeric** IDs for the owner and repository next to their names, so someone who claims the name `jeffreyjose07/truthmeterai` after a rename can't publish as me. And Open VSX, which serves Cursor, Windsurf and VSCodium, still uses a token and a different publisher ID. The workflow rewrites the `publisher` field with `jq`, packages a second VSIX and publishes it.

## By the numbers

| | v1 (Nov 2025) | v2 (Nov 2026) |
| --- | --- | --- |
| Source lines (excluding tests) | ~5,000 | 1,452 |
| Runtime dependencies | 8 | 0 |
| Bundle | 2 MB | 32 KB |
| Tests | 145, checking heuristics against themselves | 32, against real git and real VS Code |
| What "AI" means | a guess from paste size, regex and timing | a commit that records it |
| Marketplace publishing | stored PAT | OIDC, no stored secret |
| Time to analyse a repo | — | 1–2 s |

Fewer tests and less code, but it measures something real now.

## What I'd tell myself a year ago

The pitch was right. Vendor metrics are misleading, and churn and survival matter more than acceptance rates. My mistake was rebuilding the vendors' problem one level down: I needed a number, there was no honest way to get it, so I made one up and wrote thorough tests for it.

v2 often says less. A repo with no trailers and no agent logs shows zero AI-attributed commits and an offer to turn on session evidence, instead of a confident 37%. That is a less impressive dashboard. It is also the first version I'd trust with a decision.

The extension is on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=JeffreyJose.truthmeter-ai) and [Open VSX](https://open-vsx.org/extension/jeffreyjose07/truthmeter-ai). The v1 settings (`aiMetrics.*`) were removed rather than migrated. They configured features that no longer exist, and the changelog says so.

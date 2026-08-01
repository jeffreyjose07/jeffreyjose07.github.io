---
title: "Documentation That Outlived Its Code"
date: "2026-08-01"
slug: documentation-that-outlived-its-code
tags:
  [
    "meta",
    "documentation",
    "refactoring",
    "portfolio",
    "blog",
    "technical-debt",
  ]
description:
  "Every doc in this repo described a site that no longer existed — a terminal aesthetic
  replaced a year ago and a colour system reduced to an identity function. Auditing them
  turned up 60 lines of configuration that no code reads."
readingTime: 7
wordCount: 1364
---

Working log for this blog. **Previous:** [[object Object]: How One Dependabot Bump Broke 34 of 39 Posts](/blog/object-object-marked-token-api).

`CLAUDE.md` in this repository opened with this:

> **Colors**: Terminal green (#55ff55), amber (#ff8855), cyan (#55ffff), magenta (#ff55ff)
> **Typography**: Monaco, Menlo, Ubuntu Mono - monospace fonts only
> **Background**: Pure black (#000000) with terminal gray text (#c9c9c9)
> **No modern UI elements**: No gradients, shadows, or contemporary web design patterns

The site it describes has not existed since [episode 026](/blog/redesigning-the-portfolio-teal-fonts-and-timelines), when I replaced the whole thing with `Syne` headings, `Plus Jakarta Sans` body text, and an emerald teal accent. The document sat there for months, confidently instructing anyone who read it — me, or any tool I pointed at the repo — to preserve an aesthetic that had already been deleted.

This is a post about auditing every Markdown file in a repo against the code, and what falls out when you do.

---

## The failure mode: docs are asserted, code is executed

Code has a forcing function. Write something false in a `.ts` file and the build fails, the tests go red, the page renders wrong. Documentation has no such mechanism. A `.md` file that describes a system deleted a year ago will keep describing it forever, and nothing anywhere will complain.

Worse, docs are *load-bearing for decisions*. Nobody reads a stale file and shrugs; they read it and act. In this repo the stale design section was actively steering work in the wrong direction — every time I asked for a change, the instruction "maintain the strict 90s terminal aesthetic" came along for the ride.

The tell that finally caught it: I asked for a comparison against other developer portfolios, and the answer came back framed around preserving a terminal look. Then I actually opened the site. Light mode. Teal. Geometric sans. Nothing terminal about it.

## What the audit found

Seven non-post Markdown files. Every one contained something false.

### 1. The design system in `CLAUDE.md` was a year out of date

Replaced with what the code actually says, sourced from `tailwind.config.ts` and `src/index.css` rather than memory:

```css
/* src/index.css — the real accent */
--primary:      162 75% 38%;   /* light */
--primary-glow: 162 75% 52%;
```

```js
// tailwind.config.ts — the real fonts
fontFamily: {
    sans:    ['Plus Jakarta Sans', 'sans-serif'],
    heading: ['Syne', 'sans-serif'],
}
```

### 2. `BLOG.md` documented a colour system that does nothing

An entire chapter explained how technical terms were automatically colour-coded as you wrote — React in yellow, Spring Boot in blue, Docker in green, with a table of mappings and instructions for adding your own terms.

Here is the function that was supposed to be doing it:

```javascript
class SemanticColorizer {
    colorizeText(text) {
        return text;
    }
}
```

An identity function. It takes text and returns the same text. At some point the colouriser was gutted and the documentation was not.

The instructions for extending it were worse than useless — they told you to add entries to an `autoColorTerms` key in `blog/config.json`. That key does not exist in the file. You could follow the documentation exactly and produce no effect whatsoever, with no error to tell you why.

### 3. `README.md` had a CI pipeline that isn't there

It described a four-job workflow:

> 1. **build-blog** … 2. **commit-blog** … 3. **build-portfolio** … 4. **deploy**

The actual `.github/workflows/deploy.yml` has exactly one job, `build-and-deploy`, that does all four things in sequence. It also claimed Node v18 while `package.json` requires `>=20.19.0`, and advertised "semantic highlighting" — the identity function again.

### 4. `plan.md` was a finished roadmap with every box unticked

Ten `- [ ]` items for a thumbnail generator that has been shipping images for months. Its design spec also named `Outfit` and `Inter` as the site fonts and violet `#7c3aed` as "Site Primary" — two design systems ago.

I marked it complete and added a header noting which parts are superseded, but deliberately **did not rewrite the body**. It is a record of what was planned at the time. Rewriting it would erase the decision history, which is the only thing a finished roadmap is still good for.

### 5. The post template promised magic it can't do

`blog/posts/_template.md` — the file you copy to start writing — told you the build would colour your technical terms automatically. Every new post started from a lie about how the system works.

## The part I did not change

There are 35 blog posts in this repo. Many describe the terminal aesthetic. Several walk through the colour system in detail. All of them are now, strictly speaking, inaccurate about the current site.

**I left every one of them alone.**

A blog post is a dated record of what was true when it was written. Episode 026 *is* the redesign — rewriting the posts around it to match today's CSS would falsify the very history the blog exists to keep. Documentation describes the present tense and must track it; posts describe a moment and must not.

The distinction is worth being explicit about, because "update all the docs" could easily be read as "update all the Markdown," and those are very different instructions. The test I used: **would changing this file make a past statement untrue?** If yes, it is a record — annotate it, don't edit it. If no, it is documentation — fix it.

## Then: 60 lines of configuration nobody reads

Documenting `blog/config.json` accurately required knowing which keys the build actually uses. Rather than assume, I checked each one:

```bash
for k in semanticCategories contextualRules tagColors colors social resumeUrl baseUrl; do
  grep -c "config\.$k" blog/scripts/build.js blog/templates/*.html
done
```

The results split cleanly:

| Key | References |
| --- | --- |
| `title`, `description` | 20, 13 |
| `social` | 13 |
| `resumeUrl` | 3 |
| `tagColors` | 2 |
| **`colors`** | **0** |
| **`semanticCategories`** | **0** |
| **`contextualRules`** | **0** |
| **`baseUrl`** | **0** |

`semanticCategories` alone was ~60 lines: six categories, each with a description and a list of twenty-odd patterns mapping words like `kubernetes`, `microservices` and `memory leak` to colour roles. Carefully structured, clearly the product of real thought, and read by absolutely nothing.

Config that *looks* tunable but has no effect is worse than no config. It is a trap for your future self: something renders wrong, you find a promising-looking pattern list, you edit it, you rebuild, nothing changes, and now you are debugging the wrong file.

### Deleting it safely

The claim "this config is dead" is falsifiable, so I tested it rather than trusting the grep. Build the site with the original config, hash the output. Build with the trimmed config, hash again:

```
local build, ORIGINAL config: 24c885867cd00cd5080264df6c0982a0
local build, TRIMMED config:  24c885867cd00cd5080264df6c0982a0
```

Byte-identical. `blog/config.json` went from 134 lines to 51, and every remaining key is live.

One wrinkle worth recording: the freshly built `sitemap.xml` *did* differ from the committed one — but the same diff appeared with the original config too, and the sorted URL sets hashed identically. It was ordering that differs between my machine and the CI runner, not an effect of the deletion. Without the A/B test I might have blamed my own change and reverted a correct edit.

## What I added to stop the drift

Fixing the docs does not stop them rotting again. Two things now push back:

**A precedence rule, written into `CLAUDE.md` itself:**

> This repo has repeatedly shipped documentation that outlived the code — the terminal aesthetic, the semantic colour system, a "24 posts" roadmap. When a doc and the code disagree, **the code wins**. Check `src/index.css`, `tailwind.config.ts`, `blog/scripts/build.js` and `.github/workflows/deploy.yml` before acting on any description in a Markdown file.

A document instructing you not to trust it is a strange artefact, but it is honest about the failure mode, and it names the files that hold ground truth.

**An explicit dead-code section**, so the identity-function colouriser is documented as broken rather than quietly omitted. Silence reads as "fine". Naming it means the next person either fixes it or deletes it, instead of rediscovering it in a year.

## Lessons

**Docs rot silently; code rots loudly.** Nothing in CI checks that `CLAUDE.md` matches `index.css`. Until something does, assume every Markdown file is stale until verified against source.

**Verify before documenting.** The most useful output of this audit was not the prose — it was the `grep -c` that proved four config keys were dead. I would never have found that by reading, only by checking.

**Distinguish records from documentation.** Blog posts, ADRs, finished roadmaps are dated artefacts: annotate, never rewrite. READMEs, agent instructions, templates are present-tense: they must track reality or actively mislead.

**Dead configuration is a liability, not neutral weight.** Sixty lines that look meaningful and do nothing will cost someone an afternoon. Delete it, and prove it was dead with a byte-comparison rather than an argument.

**Fix the template.** `_template.md` is copied into every new post. A false statement there propagates into everything you write next — the highest-leverage line in the repository, and the easiest to forget.

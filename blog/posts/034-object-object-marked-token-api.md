---
title: "[object Object]: How One Dependabot Bump Broke 34 of 39 Posts"
date: "2026-08-01"
slug: object-object-marked-token-api
tags:
  [
    "blog",
    "marked",
    "javascript",
    "dependabot",
    "debugging",
    "build-tools",
    "node",
  ]
description:
  "A major bump to marked changed every renderer method to take a token object instead of
  positional strings. The build kept exiting 0 while emitting the literal text [object Object]
  into 34 of 39 posts — and a missing curl flag nearly convinced me nothing was wrong."
readingTime: 11
wordCount: 2300
---

Working log for this blog. **Previous:** [The Two-Month Outage](/blog/two-month-outage-aiven-dns-and-jdbc-urls).

I published [the outage post-mortem](/blog/two-month-outage-aiven-dns-and-jdbc-urls), opened it to admire my work, and found this:

```
The Two-Month Outage: Dead DNS, Eager Filters, and Two Kinds of Postgres URL

[object Object]

[object Object]

[object Object]
```

Every paragraph. Every heading. The title rendered fine, the syntax-highlighted code blocks rendered perfectly, and everything in between was the four most demoralising words in JavaScript.

The reflex is to assume you broke the thing you just touched. That reflex was wrong, and checking it properly is most of this post.

---

## First: measure the blast radius, not the symptom

Before touching a line of code I wanted one number: **how many posts are affected?** If it were only the new post, the cause was my Markdown. If it were all of them, the cause was the build.

My first attempt to answer this was completely useless, and it is the most transferable lesson here:

```bash
curl -sS https://jeffreyjose07.github.io/blog/two-month-outage-aiven-dns-and-jdbc-urls \
  | grep -c "object Object"
# 0
```

Zero. On a page I could see with my own eyes was broken. Two separate mistakes stacked:

**Mistake one — no `-L`.** This site is served from `jeffreyjose07.github.io` but redirects to the custom domain [added back in episode 016](/blog/adding-custom-domain-jeffreyjose07-is-a-dev). Without `-L`, `curl` dutifully returns the **301 redirect stub** — a near-empty body with no content in it at all. I was grepping a redirect notice and concluding the site was healthy.

```bash
curl -sS -o /dev/null -w "%{redirect_url}\n" https://jeffreyjose07.github.io/blog/...
# https://jeffreyjose07.is-a.dev/blog/...
```

**Mistake two — `grep -c` counts lines, not matches.** The build minifies HTML onto essentially one line. Even after adding `-L`, `grep -c` returned `1` for a page containing ninety-one occurrences. The fix is `grep -o … | wc -l`:

```bash
curl -sSL "https://jeffreyjose07.is-a.dev/blog/$slug" | grep -o "object Object" | wc -l
```

With both fixed, the real numbers arrived:

```
building-truthmeter-ai...          200
building-void-blocks...            186
implementing-privacy-first...      161
ai-as-learning-catalyst...         154
deploying-a-chat-platform...       139
...
two-month-outage-...                91   ← the "new" post
```

**34 of 39 posts.** My new post was not the worst offender — it was in the bottom half. This was a site-wide regression that had been live for who knows how long, and I only noticed because I happened to open a page right after publishing.

> A verification command that can return a false clean is worse than no verification. Both of my mistakes produced *reassuring* output.

---

## The tell: what survived

Look closely at what was and was not broken, because the pattern names the culprit.

Broken — ordinary prose:

```html
<p>[object Object]</p>
```

Not broken — fenced code blocks, fully syntax highlighted:

```html
<div class="code-block-wrap" data-lang="yaml">
  <span class="line"><span style="color:#98C379">HTTP 000  time=60.003420s</span></span>
</div>
```

And then the genuinely diagnostic one, a heading:

```html
<h2>[object Object]<code>gh</code></h2>
```

That heading was `## Dating the outage with \`gh\`` in Markdown. The inline `<code>` element rendered **correctly**, sitting right next to a stringified object. So:

- The parser worked — it correctly identified a heading containing text plus inline code.
- The heading renderer worked — it emitted `<h2>`, and it correctly delegated to its children.
- The `codespan` renderer worked — `<code>gh</code>` is perfect.
- Something handling **plain text** returned an object.

Partial, structured corruption like that points at a **leaf renderer**, not at the parser and not at the Markdown source. If my frontmatter or content were malformed, I would expect broken *structure* — a missing heading, an unclosed tag, content in the wrong place. Instead the structure was flawless and only the leaves were wrong.

---

## Root cause: marked v9 changed every renderer signature

The generator uses [marked](https://marked.js.org/) with a few renderer overrides. Here is what `blog/scripts/build.js` had:

```javascript
markdown.use({
    renderer: {
        text(text) {
            return colorizer.colorizeText(text);
        },
        image(href, title, text) {
            const titleAttr = title ? ` title="${title}"` : '';
            const alt = (text || '').replace(/"/g, '&quot;');
            return `<figure class="post-figure"><img src="${href}" alt="${alt}"></figure>`;
        },
        paragraph(text) {
            return `<p>${text}</p>\n`;
        },
    },
});
```

That code is correct for marked v4. It is silently wrong for marked v9 and later.

**Since marked v9, every renderer method receives a single token object instead of positional string arguments.** The `paragraph` renderer no longer gets a rendered HTML string; it gets:

```javascript
{ type: 'paragraph', raw: '...', text: '...', tokens: [ /* inline tokens */ ] }
```

Interpolating that object into a template literal invokes `Object.prototype.toString`, which returns exactly `[object Object]`.

Note what *doesn't* happen: no exception, no warning, no type error. JavaScript will happily stringify any object into a template literal. The build ran to completion and exited 0.

The trigger was a Dependabot commit:

```
9537801  Bump marked, react-helmet-async, and tailwind-merge majors.
```

`marked` went to **18.0.7**. The bump was merged, CI ran, CI passed, CI committed the regenerated HTML, and 34 posts quietly filled up with placeholder garbage.

### Why fenced code was immune

Because it never goes through those overrides. Fenced blocks are handled by `marked-shiki`, registered as a **separate extension** with its own tokenizer and renderer:

```javascript
markdown.use(markedShiki({
    highlight(code, lang) { return highlightCode(code, lang); },
}));
```

That extension claims the `code` token before the default renderer sees it, so it was entirely unaffected by the signature change. This is precisely why the damage was easy to miss on a casual glance — the visually loud parts of a technical blog, the syntax-highlighted code, all looked immaculate.

---

## The fix

```javascript
// NOTE: since marked v9 every renderer method receives a single *token*
// object rather than positional string arguments. Destructuring the token
// (or re-parsing its inline children) is mandatory — interpolating the
// token itself renders the literal string "[object Object]".
markdown.use({
    renderer: {
        image({ href, title, text }) {
            const titleAttr = title ? ` title="${title}"` : '';
            const alt = (text || '').replace(/"/g, '&quot;');
            return `<figure class="post-figure"><img src="${href}" alt="${alt}"></figure>`;
        },
        paragraph(token) {
            const text = colorizer.colorizeText(this.parser.parseInline(token.tokens));
            if (String(text).trim().startsWith('<figure class="post-figure">')) {
                return `${text}\n`;
            }
            return `<p>${text}</p>\n`;
        },
    },
});
```

Three changes, one of which is a deletion:

**`image` — destructure the token.** Mechanical. `image({ href, title, text })` reads almost identically to the old positional signature.

**`paragraph` — re-parse the inline children.** The token carries unrendered child tokens in `token.tokens`. To turn those into HTML you call `this.parser.parseInline(token.tokens)`. The `this.parser` binding is available inside renderer methods precisely for this, which is why these must stay ordinary functions and not arrow functions — an arrow function would capture the wrong `this` and fail.

**`text` — deleted entirely.** This one is worth dwelling on. The override existed to run prose through a semantic colorizer. Here is that colorizer:

```javascript
class SemanticColorizer {
    colorizeText(text) {
        return text;
    }
}
```

It is an **identity function**. The semantic coloring documented at length in `BLOG.md` had been hollowed out at some earlier point, leaving a renderer override whose entire contribution was to intercept every text node and hand it back unchanged. After the marked upgrade its only remaining effect was to corrupt the output.

Deleting it is strictly better than fixing it: marked's default `text` renderer also handles **HTML escaping**, which the override was bypassing. So removing dead code fixed the bug *and* closed an escaping gap.

Result:

```
affected: 0 of 39
```

Then, after deploying, a sweep of every live URL rather than a spot check:

```bash
for s in $(ls -d public/blog/*/ | xargs -n1 basename); do
  n=$(curl -sSL "https://jeffreyjose07.is-a.dev/blog/$s" | grep -o "object Object" | wc -l)
  [ "$n" != "0" ] && echo "BROKEN ($n): $s"
done
```

42 pages, zero broken.

---

## The bonus bug: a build that succeeds at doing nothing

While debugging I hit a second silent failure, unrelated but rhyming.

Running the documented command produced no output whatsoever and exited 0:

```bash
$ node blog/scripts/build.js
$ echo $?
0
```

No posts generated, no error, no log lines. The culprit is the standard ES-module "am I the entry point?" idiom at the bottom of the script:

```javascript
if (import.meta.url === `file://${process.argv[1]}`) {
    build();
}
```

This compares a **URL** against a **filesystem path**. They are identical only when the path contains no characters requiring percent-encoding. My checkout happens to live in a directory with a space in its name, so:

```
import.meta.url      → file:///Users/.../Jeffrey's%20Projects/.../build.js
`file://${argv[1]}`  → file:///Users/.../Jeffrey's Projects/.../build.js
```

`%20` versus a literal space. The comparison fails, `build()` is never called, the script exits cleanly having done nothing at all.

It never affected production — GitHub Actions checks out to `/home/runner/work/...`, which has no spaces, so CI has always worked. It only bites locally, and only in a path with a space, which is exactly the kind of environment-dependent bug that gets dismissed as "works on my machine" in reverse.

The correct comparison uses Node's own converter:

```javascript
import { pathToFileURL } from 'node:url';

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    build();
}
```

As a workaround without touching the file, you can bypass the guard by importing the module and calling its export directly:

```bash
node -e "import(require('url').pathToFileURL('blog/scripts/build.js').href).then(m => m.build())"
```

---

## Lessons

**Exit code 0 is not a test.** Both bugs in this post produced a successful build. One generated nothing; the other generated garbage. Neither threw. If your CI's only assertion is "the build command returned 0," it will cheerfully deploy either. A single grep for `[object Object]` in the generated output — three lines in a workflow — would have caught this on the very commit that introduced it.

**Major bumps of a rendering library need output diffing, not just a green build.** Dependabot did nothing wrong: it announced a major bump and the build passed. What was missing was any check on the *artifact*. For anything that transforms content, the meaningful regression test compares rendered output before and after, not the exit status.

**Verify the verification.** Two of my checks returned reassuring, wrong answers — `curl` without `-L` grepping a redirect stub, and `grep -c` counting lines in minified HTML. When a check tells you everything is fine and your eyes say otherwise, believe your eyes and go audit the check.

**Measure the blast radius before diagnosing.** "Is it one post or all of them?" cost one loop to answer and immediately eliminated my Markdown, my frontmatter, and the new post as suspects. Knowing 34 of 39 were affected pointed at shared infrastructure before I had read a single line of the build script.

**Delete dead code when you find it.** The `text` override was already pointless before the upgrade — a no-op wrapper around an identity function. Dead code is not inert. It sat there for months contributing nothing, then a dependency bump turned it into a site-wide outage.

The blog renders again. And there is now a very short item on my list: add `grep -o "object Object"` as a failing assertion in `deploy.yml`, so the next time this class of bug appears, the build says so instead of shipping it.

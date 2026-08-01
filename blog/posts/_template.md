---
title: "your post title here"
date: "2025-01-24"
tags: ["tag1", "tag2", "tag3"]
description: "brief description for meta tags and previews"
readingTime: 3
wordCount: 500
---

Your first paragraph starts here. Write naturally — prose is rendered as plain
Markdown against the site theme. There is no automatic colour coding of technical
terms; use `**bold**`, `*italic*` or `` `code` `` when you want emphasis.

## section headings

Section headings (h2) render in `Syne`. Sentence case reads best.

### subsection headings

Subsection headings (h3) are smaller, same family.

## text formatting

You can use standard Markdown formatting:

- **Bold text** for emphasis
- *Italic text* for subtle emphasis  
- `inline code` will appear in yellow
- Links like [this link](https://example.com) will appear in cyan

## lists

Bullet points work normally:
- First item
- Second item with `code`
- Third item with **emphasis**

Numbered lists also work:
1. First numbered item
2. Second item
3. Third item

## code blocks

```javascript
// Code blocks will be styled with syntax highlighting
function example() {
  return "code appears in yellow background";
}
```

## syntax highlighting

Fenced code blocks are highlighted at build time by Shiki using the `one-dark-pro`
theme. Always tag the language:

```java
@Transactional
public void transfer(String from, String to, long amount) {
    // highlighted with the same grammars VS Code uses
}
```

Unlabelled fences are guessed; unknown languages fall back to plaintext.

## quotes and emphasis

> Block quotes can be used for important callouts or philosophical reflections.

## technical sections

When writing about complex topics, do the emphasis yourself — the build will not add
it for you:

The **React** application uses `TypeScript` for type safety, deploys via GitHub
Actions to GitHub Pages, and implements WebSocket connections for real-time
communication.

Tables work too, and are often the clearest way to present a comparison:

| Consumer | Format |
| --- | --- |
| Spring `DATABASE_URL` | `jdbc:postgresql://…` |
| `psql` | `postgres://…` |

## before you publish

- Name the file `###-descriptive-title.md` with the next episode number
- Commit **the Markdown only** — CI builds and commits the HTML and thumbnail
- Test locally first: `node blog/scripts/build.js`
# Blog Documentation

This document explains how to create and manage blog posts using the automated blog system. The system transforms simple Markdown files into styled HTML pages with build-time syntax highlighting, generated thumbnails, tag filtering and RSS.

> **Design note:** the blog uses the site's current design system — `Syne` headings,
> `Plus Jakarta Sans` body, emerald teal accent (`#1cc9a0`), dark by default. The 90s
> terminal aesthetic was replaced in episode 026; only the generated post thumbnails
> still use the terminal motif.

## Quick Start

1. **Create a new blog post:**
   ```bash
   # Copy the template
   cp blog/posts/_template.md blog/posts/my-new-post.md
   
   # Edit your post
   nano blog/posts/my-new-post.md
   ```

2. **Test locally (Optional):**
   ```bash
   npm run build:blog
   ```

3. **Publish:**
   ```bash
   git add blog/posts/my-new-post.md
   git commit -m "add new blog post: my thoughts on..."
   git push
   ```

4. **Automatic build:** GitHub Actions will detect the change and automatically generate the HTML files within minutes.

## Blog Post Format

Blog posts are written in Markdown with YAML frontmatter:

```markdown
---
title: "your post title here"
date: "2025-01-24"
tags: ["tag1", "tag2", "tag3"]
description: "brief description for meta tags and previews"
readingTime: 3  # optional, will be calculated if omitted
wordCount: 500  # optional, will be calculated if omitted
---

Your blog content starts here...

## section headings

Content goes here with automatic color coding applied to technical terms.
```

### Required Fields
- `title`: The title of your blog post
- `date`: Publication date in YYYY-MM-DD format

### Optional Fields
- `tags`: Array of tags for categorization
- `description`: Brief description for SEO and previews
- `readingTime`: Estimated reading time in minutes
- `wordCount`: Word count for the post
- `slug`: Custom URL slug (auto-generated from title if omitted)

## Styling: what actually happens to your prose

**Nothing automatic.** Earlier versions of this document described a semantic
colour-coding system that highlighted technical terms (React, Spring Boot, Docker…)
as you wrote them. **That system no longer exists.**

`SemanticColorizer.colorizeText()` in `blog/scripts/build.js` is an identity function
that returns its input unchanged, and the `autoColorTerms` key older docs referred to
does not exist in `blog/config.json` at all.
Prose renders as plain Markdown against the site's theme:

- Headings in `Syne`, body in `Plus Jakarta Sans`
- Links and accents in emerald teal (`#1cc9a0`)
- `inline code` in the mono stack
- Fenced code blocks highlighted by **Shiki** at build time (see below)

If you want a term emphasised, use normal Markdown — `**bold**`, `*italic*`, or
`` `code` ``. Do not expect the build to colour it for you.

## Markdown Features

### Headers
```markdown
## main sections (blue)
### subsections (magenta)
```

### Text Formatting
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
`inline code` appears in yellow
[Links](https://example.com) appear in cyan
```

### Lists
```markdown
- Bullet points
- Work normally
- With automatic coloring

1. Numbered lists
2. Also work
3. With full styling
```

### Code Blocks (Shiki / VS Code Dark+)

Fenced blocks are highlighted at **build time** with [Shiki](https://shiki.style/) — the same TextMate grammars VS Code uses — theme `one-dark-pro`.

```markdown
```java
@Transactional
public void processBatchThenFail(String accountId, long amount) {
    this.saveIndependently(accountId, amount);
}
```
```

Always set a language tag when you can (`java`, `bash`, `typescript`, `json`, `yaml`, `cpp`, …). Unlabeled fences are best-effort guessed (Java/TS/CSS/YAML/SQL/bash/…). Unknown tags load on demand from Shiki’s language bundle or fall back to plaintext. Aliases live in `blog/scripts/syntax-highlight.js`.

Only **fenced** code goes through Shiki. Prose is rendered as plain Markdown — see
"Styling: what actually happens to your prose" above.

### Quotes
```markdown
> Block quotes for important callouts or philosophical reflections
```

## File Organization

```
blog/
├── config.json          # Blog configuration and color mappings
├── posts/               # Your blog posts (Markdown files)
│   ├── _template.md     # Template for new posts
│   ├── post1.md         # Your blog posts
│   └── post2.md
├── templates/           # HTML templates
│   ├── post.html        # Individual post template
│   └── index.html       # Blog index template
└── scripts/             # Build scripts
    └── build.js         # Main build script
```

## Automatic Features

### Episode Numbering and File Naming Convention

**IMPORTANT:** Blog posts must follow the numbered naming pattern to maintain proper episode ordering:

```
000-first-post.md
001-second-post.md
002-third-post.md
008-latest-post.md
```

**Before creating a new post:**
1. Check existing posts to find the next episode number:
   ```bash
   ls blog/posts/ | grep -E '^[0-9]' | tail -1
   ```
2. Use the next sequential number with zero-padding (e.g., 008, 009, 010)

**Naming Format:**
- **Pattern:** `###-descriptive-title.md`
- **Examples:** `008-ai-learning-catalyst.md`, `009-react-hooks-explained.md`
- **Zero-padding:** Always use 3 digits (001, not 1)

Posts are automatically numbered as episodes based on the filename prefix, which determines the display order and navigation structure.

### Blog Index
The main blog index at `/blog` is automatically updated with:
- All published posts in reverse chronological order
- Proper episode numbering
- Formatted dates
- Post count statistics

### Metadata Generation
- Reading time estimation (200 words per minute)
- Word count calculation
- Automatic slug generation from titles
- SEO meta tags

## GitHub Actions Workflow

The blog builds automatically when you:
1. Push changes to any file in `blog/posts/`
2. Update templates in `blog/templates/`  
3. Modify the build script or configuration
4. Manually trigger the workflow

### Workflow Process
1. **Detects changes** to blog-related files
2. **Installs dependencies** and runs the build script
3. **Generates HTML files** in `public/blog/`
4. **Commits and pushes** the generated files
5. **GitHub Pages** serves the updated content

### Monitoring Builds
- Check the **Actions** tab in your GitHub repository
- Build logs show detailed progress and any errors
- Failed builds will notify you via GitHub

## Troubleshooting

### Common Issues

**Build fails with "Cannot find module":**
```bash
# Install missing dependencies
npm install
```

**Post doesn't appear:**
- Check that the Markdown file is in `blog/posts/`
- Ensure frontmatter is properly formatted
- Verify the GitHub Action completed successfully

**Styling looks broken:**
- The build script maintains all existing CSS
- Check that templates weren't accidentally modified
- Ensure color class names match the config

**GitHub Action doesn't trigger:**
- Confirm changes were made to files in `blog/` directory
- Check that the workflow file exists and has proper permissions
- Look at the Actions tab for error messages

### Getting Help

1. Check the **GitHub Actions** logs for detailed error messages
2. Review this documentation for proper formatting
3. Look at existing posts as examples
4. Test locally with `npm run build:blog`

## Local Development

### Prerequisites
```bash
# Install dependencies
npm install
```

### Building Locally
```bash
# Build the blog
npm run build:blog

# Serve locally (if you have a local server)
npx serve public
```

### Testing Changes
1. Make changes to posts or templates
2. Run `npm run build:blog`
3. Check the generated files in `public/blog/`
4. Commit and push when satisfied

## Advanced Configuration

### Changing Theme Colours
The blog's palette lives in `blog/templates/styles.html` as CSS custom properties
(`--primary: #1cc9a0`, `--primary-glow: #5eead4`, `--font-heading`, `--font-sans`).
These intentionally mirror the React side's HSL tokens in `src/index.css`
(`--primary: 162 75% 38%`). **Change both together** — the portfolio and blog are one
identity, and letting them drift is what produced a light portfolio next to a dark
blog for months.

### Customizing Templates
- `blog/templates/post.html` — individual posts
- `blog/templates/index.html` — the blog index
- `blog/templates/header.html` — shared nav (keep in sync with `navItems` in
  `src/components/Navigation.tsx`; these are two hand-maintained copies)
- `blog/templates/styles.html` — all blog CSS

### Build Script Customization
The build script at `blog/scripts/build.js` can be modified to add metadata, new
output formats, or extra Markdown handling.

**If you touch the `marked` renderer**, note that since marked v9 every renderer
method receives a single *token object*, not positional strings. Interpolating the
token directly emits the literal text `[object Object]`. Use
`this.parser.parseInline(token.tokens)` for block renderers and destructure the token
for inline ones. See episode 034 — this exact mistake broke 34 of 39 posts.

CI guards against a recurrence: the **Verify blog output** step in
`.github/workflows/deploy.yml` fails the build if any page renders a stringified
token, or if no HTML is produced at all.
# Blog Documentation

This document explains how to create and manage blog posts using the automated blog system. The system transforms simple Markdown files into beautifully styled HTML pages with a terminal aesthetic and automatic color coding.

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

## Color Coding System

The blog system automatically applies semantic color coding to technical terms:

### Color Meanings
- **Green (#55ff55)**: Highlights, key concepts, success states
- **Blue (#5588ff)**: Frameworks, architectural concepts, structure
- **Orange (#ff8855)**: Warnings, dates, temporal information  
- **Cyan (#55ffff)**: Links, interactive elements
- **Magenta (#ff55ff)**: Tags, metadata, special labels
- **Yellow (#ffff55)**: Code snippets, technical terms

### Auto-Colored Terms
The following terms are automatically colored when they appear in your posts:

**Frameworks & Technologies:**
- React, TypeScript, JavaScript → code color (yellow)
- Spring Boot, API, architecture → framework color (blue) 
- WebSocket, CI/CD, microservices → tag color (magenta)

**Tools & Platforms:**
- GitHub, Docker, testing → success color (green)
- deployment, security, mobile → warning color (orange)
- Claude Code, portfolio, blog → link/highlight colors

**Design & Aesthetics:**
- terminal, minimal → highlight color (green)
- responsive, CSS → framework/tag colors
- aesthetic → tag color (magenta)

You can add more terms in `blog/config.json` under `autoColorTerms`.

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

### Code Blocks
```markdown
```javascript
// Code blocks get syntax highlighting
function example() {
  return "styled appropriately";
}
```
```

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

### Episode Numbering
Posts are automatically numbered as episodes (001, 002, 003, etc.) based on the alphabetical order of filenames. To control ordering, prefix your files:

```
001-first-post.md
002-second-post.md
003-latest-thoughts.md
```

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

### Adding New Color Terms
Edit `blog/config.json`:

```json
{
  "autoColorTerms": {
    "YourFramework": "framework",
    "YourTool": "success",
    "YourConcept": "highlight"
  }
}
```

### Customizing Templates
- Modify `blog/templates/post.html` for individual posts
- Modify `blog/templates/index.html` for the blog index
- All existing terminal styling is preserved

### Build Script Customization
The build script at `blog/scripts/build.js` can be modified to:
- Add new automatic replacements
- Integrate with other tools
- Generate additional metadata
- Support custom post types

Remember: the system is designed to be simple and maintainable while preserving the beautiful terminal aesthetic that makes the blog unique.
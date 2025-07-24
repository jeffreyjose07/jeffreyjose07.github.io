# Blog System Technical Documentation

This document provides technical details about the automated blog system architecture, implementation, and maintenance.

## Architecture Overview

The blog system transforms Markdown files into styled HTML pages through a Node.js build process, automated via GitHub Actions. It maintains the terminal aesthetic while providing a friction-free writing experience.

### Core Components

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Markdown      │    │   Build Script   │    │  Static HTML    │
│   Posts         ├───→│   (Node.js)      ├───→│  GitHub Pages   │
│   (blog/posts/) │    │                  │    │  (public/blog/) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ↑                       ↑                       ↑
         │                       │                       │
    ┌─────────┐              ┌─────────┐            ┌─────────┐
    │ Writer  │              │ GitHub  │            │ Reader  │
    │ Creates │              │ Actions │            │ Views   │
    │ Content │              │ Builds  │            │ Blog    │
    └─────────┘              └─────────┘            └─────────┘
```

## Build System (`blog/scripts/build.js`)

### Dependencies
- **marked**: Markdown to HTML conversion
- **gray-matter**: YAML frontmatter parsing
- Node.js built-in modules (fs, path)

### Core Functions

#### `processPost(filename, episodeNumber)`
Converts a single Markdown file to HTML:

1. **Parse**: Extract frontmatter and content using gray-matter
2. **Transform**: Convert Markdown to HTML with marked
3. **Enhance**: Apply automatic color coding
4. **Calculate**: Generate word count and reading time
5. **Template**: Inject content into HTML template
6. **Write**: Output final HTML file

#### `generateIndex(posts)`
Creates the main blog index page:

1. **Sort**: Order posts by episode number (newest first)
2. **Template**: Generate HTML for each post entry
3. **Populate**: Fill index template with posts list
4. **Write**: Output index.html

#### Automatic Color Coding
The system uses a custom marked renderer that:

1. **Scans**: All text content during HTML generation
2. **Matches**: Technical terms against configured mappings
3. **Wraps**: Matched terms in semantic CSS classes
4. **Preserves**: Original text while adding styling

```javascript
// Example color coding transformation
"React application" → "React application"
"React application" → "<span class='framework'>React</span> application"
```

### Configuration (`blog/config.json`)

```json
{
  "title": "blog",
  "description": "...",
  "author": "Jeffrey Jose",
  "baseUrl": "/blog",
  "colors": {
    "highlight": "#55ff55",
    "framework": "#5588ff",
    "warning": "#ff8855",
    "success": "#55ff55",
    "link": "#55ffff",
    "tag": "#ff55ff",
    "code": "#ffff55"
  },
  "autoColorTerms": {
    "React": "framework",
    "GitHub": "success",
    "TypeScript": "code"
  }
}
```

## Template System

### Post Template (`blog/templates/post.html`)
- Complete HTML document with embedded CSS
- Placeholder replacement using simple string substitution
- Responsive design with mobile-first approach
- Terminal aesthetic preservation

#### Template Variables
- `{{title}}` - Post title
- `{{episodeNumber}}` - Zero-padded episode number
- `{{date}}` - Formatted publication date
- `{{content}}` - Processed HTML content
- `{{wordCount}}` - Calculated word count
- `{{readingTime}}` - Estimated reading time
- `{{tagsFormatted}}` - HTML-formatted tags

### Index Template (`blog/templates/index.html`)
- Main blog listing page
- Post list generation with episode numbers
- Statistics display (total posts)
- Navigation and aesthetic elements

## GitHub Actions Workflow

### Trigger Conditions
```yaml
on:
  push:
    branches: [ main ]
    paths:
      - 'blog/posts/**'
      - 'blog/templates/**'
      - 'blog/scripts/**'
      - 'blog/config.json'
```

### Workflow Steps

1. **Checkout**: Fetch repository with full history
2. **Setup**: Install Node.js and dependencies
3. **Detect**: Check for blog-related changes
4. **Build**: Run the blog build script
5. **Commit**: Add generated files to repository
6. **Deploy**: GitHub Pages serves updated content

### Optimization Features
- **Change detection**: Only builds when blog content changes
- **Smart commits**: Descriptive commit messages based on changes
- **Error handling**: Detailed logging and failure reporting
- **Manual trigger**: Workflow dispatch for manual builds

## CSS Architecture

### Color System
Terminal-inspired color palette with semantic meanings:

```css
.highlight    { color: #55ff55; } /* Success/key concepts */
.framework    { color: #5588ff; } /* Technologies/structure */
.warning      { color: #ff8855; } /* Alerts/temporal info */
.link-color   { color: #55ffff; } /* Links/interactive */
.tag-color    { color: #ff55ff; } /* Metadata/categories */
.code-color   { color: #ffff55; } /* Code/technical terms */
```

### Responsive Design
Mobile-first approach with breakpoints:

```css
/* Base (mobile) */
font-size: 15px;

/* Desktop */
@media (min-width: 768px) {
  font-size: 16px;
}
```

### Typography Hierarchy
- **Main title**: 16px/18px, green, terminal cursor effect
- **Section headers**: 14px/16px, blue, lowercase
- **Subsection headers**: 13px/14px, magenta, lowercase
- **Body text**: 15px/16px, terminal gray
- **Code**: 13px/14px, yellow, monospace
- **Metadata**: 11px/12px, orange/gray, smaller

## Performance Considerations

### Build Performance
- **Incremental**: Only processes changed files
- **Efficient**: Direct file operations, no heavy frameworks
- **Cached**: GitHub Actions caches dependencies

### Runtime Performance
- **Static**: Pure HTML, no JavaScript frameworks
- **Minimal**: Inline CSS, single HTTP request
- **Progressive**: Reading progress indicator only
- **Mobile-optimized**: Responsive images and layout

### SEO Optimization
- **Meta tags**: Generated from frontmatter
- **Semantic HTML**: Proper heading hierarchy
- **Mobile-friendly**: Responsive design
- **Fast loading**: Minimal overhead

## Maintenance and Extensions

### Adding New Features

1. **New color terms**: Update `blog/config.json`
2. **Template changes**: Modify templates, rebuild
3. **Build enhancements**: Edit `blog/scripts/build.js`
4. **Styling updates**: Modify template CSS

### Monitoring and Debugging

#### Build Logs
GitHub Actions provides detailed logs:
- File processing status
- Error messages and stack traces
- Generation statistics
- Commit information

#### Local Testing
```bash
# Install dependencies
npm install

# Build locally
npm run build:blog

# Check output
ls -la public/blog/
```

#### Common Issues

**Template errors**: Check placeholder syntax
**Color coding fails**: Verify regex patterns in config
**Build timeouts**: Optimize large posts or images
**GitHub permissions**: Ensure GITHUB_TOKEN has write access

### Future Enhancements

**Planned Features:**
- Image optimization and lazy loading
- RSS feed generation
- Search functionality
- Post series/collections
- Comment system integration
- Syntax highlighting for code blocks

**Architectural Improvements:**
- TypeScript conversion for type safety
- Plugin system for extensibility
- Build caching for large blogs
- Preview/draft functionality

## Security Considerations

### Content Sanitization
- Markdown is processed with marked's built-in sanitization
- No user-generated content at runtime
- Static file generation prevents injection attacks

### GitHub Actions Security
- Uses official GitHub actions with pinned versions
- Limited token permissions (contents: write)
- No secrets or sensitive data in workflows
- Automated dependency updates via Dependabot

### Deployment Security
- GitHub Pages HTTPS enforcement
- No server-side processing
- Content Security Policy headers available
- Branch protection for main branch

## Contributing Guidelines

### Code Style
- 2-space indentation for JavaScript
- Semicolons required
- ES6+ features encouraged
- Clear variable names and comments

### Testing New Features
1. **Local testing**: Always test builds locally first
2. **Template validation**: Ensure templates generate valid HTML
3. **Content testing**: Test with various post types and lengths
4. **Mobile testing**: Verify responsive behavior

### Documentation Updates
- Update this README for technical changes
- Update BLOG.md for user-facing changes
- Include examples for new features
- Maintain configuration documentation

This system is designed to be simple, maintainable, and extensible while preserving the unique terminal aesthetic that makes the blog special.
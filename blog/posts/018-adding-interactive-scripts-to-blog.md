---
title: "Adding Interactive Scripts to Blog Posts"
date: "2025-01-26"
tags: ["meta", "engineering", "frontend", "tutorials"]
description: "how we extended the blog system to support inline JavaScript and CSS for interactive visualizations"
readingTime: 5
wordCount: 1030
---

The blog has always been **markdown-first**. Write a `.md` file, run the build script, and get a fully styled HTML page. This workflow was **frictionless** for text content, but what happens when you need an **interactive visualization**?

This post documents how we extended the system to support **inline scripts** and **styles** without breaking the markdown workflow.

## the problem

I wanted to add an interactive algorithm visualization to [blog post 017](/blog/solving-adjacent-increasing-subarrays-from-naive-t). The visualization needed:

- **Custom CSS** for terminal-aesthetic styling
- **JavaScript functions** for array manipulation and state tracking
- **Event handlers** for user interactions
- **Dynamic DOM updates** as the algorithm runs

The existing system couldn't handle this. Markdown files became HTML through `marked.js`, but there was no way to inject **custom scripts** or **styles** into individual posts.

## design considerations

### option 1: embed everything in markdown

Just write the HTML, CSS, and JavaScript directly in the markdown file.

**Problems:**
- Markdown parsers treat indented content as code blocks
- Blank lines within HTML break parsing
- No separation of concerns
- Difficult to maintain

### option 2: create a custom component system

Build a React-like component system with special syntax.

**Problems:**
- Over-engineered for a static blog
- Adds build complexity
- Breaks the markdown-first principle

### option 3: frontmatter injection

Use YAML frontmatter to specify inline styles and scripts, then inject them into the template.

**Benefits:**
- Keeps markdown clean
- Separates concerns (content vs. styling vs. behavior)
- Works with existing build system
- No special syntax needed

We went with **option 3**.

## implementation

### step 1: extend frontmatter schema

Added two new optional fields to the frontmatter:

```yaml
---
title: "post title"
date: "2025-01-26"
tags: ["tag1", "tag2"]
inlineStyles: |
  .custom-class {
      color: #55ff55;
  }
inlineScripts: |
  function customFunction() {
      console.log('hello');
  }
---
```

The `|` symbol indicates a **multiline string** in YAML. Everything indented under it becomes part of the field.

### step 2: modify the build script

The build script (`blog/scripts/build.js`) already processes frontmatter using `gray-matter`. We just needed to extract the new fields and inject them.

```javascript
// Process inline styles and scripts from frontmatter
const inlineStyles = frontmatter.inlineStyles || '';
const inlineScripts = frontmatter.inlineScripts || '';

// Load and populate template
const template = loadTemplate('post');
const html = template
    .replace(/{{title}}/g, frontmatter.title)
    // ... other replacements ...
    .replace(/{{inlineStyles}}/g, inlineStyles)
    .replace(/{{inlineScripts}}/g, inlineScripts);
```

If a post doesn't have `inlineStyles` or `inlineScripts`, we inject **empty strings**. This ensures backward compatibility.

### step 3: update the template

Modified `blog/templates/post.html` to include injection points:

```html
<style>
    /* Regular post styles */
    .post-content {
        line-height: 1.7;
    }

    /* Inline styles injected from frontmatter */
    {{inlineStyles}}
</style>
```

And at the bottom of the script section:

```html
<script>
    // Regular page scripts
    function initializeMaterializationEffect() {
        // ...
    }

    /* Inline scripts injected from frontmatter */
    {{inlineScripts}}
</script>
```

### step 4: write the HTML in markdown

With the infrastructure in place, the markdown file can include **raw HTML** for the visualization:

```markdown
## the visualization

<div class="viz-container">
    <div class="input-section">
        <label>enter an array</label>
        <input type="text" id="arrayInput">
        <button onclick="loadCustomArray()">load</button>
    </div>
    <div class="array-container" id="arrayContainer"></div>
    <div class="controls">
        <button onclick="reset()">reset</button>
        <button onclick="step()">next step</button>
    </div>
</div>
```

**Critical rule:** No blank lines within the HTML block. Markdown parsers reset their state on blank lines and will treat subsequent indented content as code blocks.

## the tricky part: markdown and html

Markdown's HTML handling is **surprisingly finicky**. Here's what went wrong initially:

### attempt 1: blank lines everywhere

```html
<div class="viz-container">
    <div class="input-section">
        ...
    </div>

    <div class="array-container"></div>

    <div class="controls">
        ...
    </div>
</div>
```

**Result:** Everything after the first blank line got wrapped in `<pre><code>` tags and escaped.

### attempt 2: inconsistent indentation

```html
<div class="viz-container">
<div class="input-section">
    ...
</div>
    <div class="array-container"></div>
</div>
```

**Result:** Parsing broke. Some sections rendered, others escaped.

### attempt 3: no blank lines, consistent indentation

```html
<div class="viz-container">
    <div class="input-section">
        ...
    </div>
    <div class="array-container"></div>
    <div class="controls">
        ...
    </div>
</div>
```

**Result:** Perfect rendering. All HTML treated as raw HTML.

**Lesson learned:** When embedding HTML in markdown, treat the entire block as a single unit. No blank lines. Consistent indentation.

## writing the visualization

With the system working, I could write the visualization logic entirely in the frontmatter:

**282 lines of CSS** defining:
- Terminal color palette (#55ff55 green, #ffff55 yellow, etc.)
- Array item styling with hover states
- State boxes and explanation panels
- Button styles with disabled states
- Mobile responsive breakpoints

**185 lines of JavaScript** implementing:
- Array input validation
- Visualization state management
- Step-by-step algorithm execution
- Auto-play functionality
- DOM manipulation for visual updates

The visualization in [blog post 017](/blog/solving-adjacent-increasing-subarrays-from-naive-t) uses **all of this**. Users can input custom arrays, step through the algorithm, and see how the optimal solution works in real time.

## benefits of this approach

**Separation of concerns:** Content (markdown), styling (CSS), behavior (JavaScript) are separate but colocated.

**Reusability:** The same visualization logic could be used in multiple posts by copying the frontmatter.

**Maintainability:** Need to fix a bug in the visualization? Edit the frontmatter, rebuild. No scattered files.

**Backward compatibility:** Posts without inline scripts still work perfectly. Empty string injection ensures no breaking changes.

**Terminal aesthetic preservation:** Custom CSS ensures every interactive element matches the 90s BBS aesthetic.

## future improvements

**1. script library system**

Instead of duplicating visualization code across posts, create a library:

```yaml
inlineScripts: |
  import { ArrayVisualizer } from '/blog/scripts/visualizers.js';
  const viz = new ArrayVisualizer('arrayContainer');
```

**2. style theming**

Extract common visualization styles into a shared theme:

```yaml
visualizationTheme: "terminal"
```

The build script would inject the corresponding CSS automatically.

**3. component registry**

Pre-built interactive components users can reference:

```markdown
[interactive-code-editor lang="javascript"]
[algorithm-visualizer type="sorting"]
```

## lessons learned

**Markdown is powerful but opinionated.** Understanding how parsers handle HTML blocks is crucial. Blank lines matter. Indentation matters.

**Frontmatter is underrated.** YAML's multiline strings make it perfect for embedding code. No special escaping needed.

**Build systems should be extensible.** Adding two fields to the frontmatter and two placeholders to the template gave us full scripting support. No architectural changes needed.

**Backward compatibility matters.** The `|| ''` fallback ensures old posts don't break. New features shouldn't require updating everything.

The system now supports **any** interactive content. Algorithm visualizations, code playgrounds, interactive diagrams—all possible within the markdown-first workflow.

And the blog remains what it's always been: text files that become beautiful, functional web pages.

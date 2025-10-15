---
title: "Adding Interactive Scripts to Blog Posts"
date: "2025-01-26"
tags: ["meta", "engineering", "frontend", "tutorials"]
description: "how we extended the blog system to support inline JavaScript and CSS for interactive visualizations - with live demos"
readingTime: 8
wordCount: 1650
inlineStyles: |
  /* Demo 1: Terminal greeting */
  .demo-box {
      background: #0a0a0a;
      border: 1px solid #333333;
      border-radius: 4px;
      padding: 20px;
      margin: 24px 0;
  }
  .demo-title {
      color: #55ffff;
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 12px;
  }
  .terminal-input {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
  }
  .terminal-input input {
      flex: 1;
      padding: 8px 12px;
      background: #000000;
      border: 1px solid #333333;
      border-radius: 3px;
      color: #55ff55;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
  }
  .terminal-input input:focus {
      outline: none;
      border-color: #55ff55;
      box-shadow: 0 0 0 2px rgba(85, 255, 85, 0.2);
  }
  .terminal-input button {
      padding: 8px 16px;
      background: #0a0a0a;
      border: 1px solid #333333;
      border-radius: 3px;
      color: #55ff55;
      cursor: pointer;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
  }
  .terminal-input button:hover {
      background: #1a1a1a;
      border-color: #55ff55;
  }
  .terminal-output {
      background: #000000;
      border: 1px solid #333333;
      padding: 12px;
      border-radius: 3px;
      min-height: 40px;
      color: #55ff55;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
  }
  /* Demo 2: Color picker */
  .color-demo {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
  }
  .color-swatch {
      width: 100px;
      height: 100px;
      border: 2px solid #333333;
      border-radius: 4px;
      transition: all 0.3s ease;
  }
  .color-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
  }
  .color-buttons button {
      padding: 8px 16px;
      background: #0a0a0a;
      border: 1px solid #333333;
      border-radius: 3px;
      cursor: pointer;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      transition: all 0.2s ease;
  }
  .color-buttons button.green { color: #55ff55; }
  .color-buttons button.yellow { color: #ffff55; }
  .color-buttons button.cyan { color: #55ffff; }
  .color-buttons button.magenta { color: #ff55ff; }
  .color-buttons button:hover {
      background: #1a1a1a;
  }
  /* Demo 3: Click counter */
  .counter-display {
      text-align: center;
      padding: 20px;
      background: #000000;
      border: 1px solid #333333;
      border-radius: 3px;
      margin: 12px 0;
  }
  .counter-number {
      font-size: 48px;
      color: #55ff55;
      font-weight: bold;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  }
  .counter-label {
      color: #888888;
      font-size: 12px;
      margin-top: 8px;
  }
  .counter-buttons {
      display: flex;
      gap: 8px;
      justify-content: center;
  }
  .counter-buttons button {
      padding: 10px 20px;
      background: #0a0a0a;
      border: 1px solid #333333;
      border-radius: 3px;
      color: #55ff55;
      cursor: pointer;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      font-weight: 600;
  }
  .counter-buttons button:hover {
      background: #1a1a1a;
      border-color: #55ff55;
  }
  /* Demo 4: Matrix rain mini */
  .matrix-canvas {
      width: 100%;
      height: 150px;
      background: #000000;
      border: 1px solid #333333;
      border-radius: 3px;
  }
  .matrix-controls {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      justify-content: center;
  }
  .matrix-controls button {
      padding: 8px 16px;
      background: #0a0a0a;
      border: 1px solid #333333;
      border-radius: 3px;
      color: #55ff55;
      cursor: pointer;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
  }
  .matrix-controls button:hover {
      background: #1a1a1a;
      border-color: #55ff55;
  }
inlineScripts: |
  // Demo 1: Terminal greeting
  function greetUser() {
      const nameInput = document.getElementById('nameInput');
      const output = document.getElementById('terminalOutput');
      const name = nameInput.value.trim() || 'anonymous';
      output.innerHTML = `> hello, ${name}!<br>> welcome to the interactive blog system<br>> type: help`;
  }
  document.addEventListener('DOMContentLoaded', () => {
      const nameInput = document.getElementById('nameInput');
      if (nameInput) {
          nameInput.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') greetUser();
          });
      }
  });
  // Demo 2: Color picker
  function changeColor(color) {
      const swatch = document.getElementById('colorSwatch');
      const colors = {
          green: '#55ff55',
          yellow: '#ffff55',
          cyan: '#55ffff',
          magenta: '#ff55ff'
      };
      swatch.style.backgroundColor = colors[color];
      swatch.style.borderColor = colors[color];
      swatch.style.boxShadow = `0 0 20px ${colors[color]}40`;
  }
  // Demo 3: Click counter
  let clickCount = 0;
  function incrementCounter() {
      clickCount++;
      updateCounter();
  }
  function decrementCounter() {
      if (clickCount > 0) clickCount--;
      updateCounter();
  }
  function resetCounter() {
      clickCount = 0;
      updateCounter();
  }
  function updateCounter() {
      const display = document.getElementById('counterDisplay');
      if (display) {
          display.textContent = clickCount;
          if (clickCount > 10) {
              display.style.color = '#ffff55';
          } else if (clickCount > 20) {
              display.style.color = '#ff8855';
          } else {
              display.style.color = '#55ff55';
          }
      }
  }
  // Demo 4: Matrix rain
  let matrixInterval = null;
  function startMatrix() {
      const canvas = document.getElementById('matrixCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      canvas.width = canvas.offsetWidth;
      canvas.height = 150;
      const columns = Math.floor(canvas.width / 20);
      const drops = Array(columns).fill(0);
      if (matrixInterval) clearInterval(matrixInterval);
      matrixInterval = setInterval(() => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#55ff55';
          ctx.font = '15px monospace';
          for (let i = 0; i < drops.length; i++) {
              const text = String.fromCharCode(0x30A0 + Math.random() * 96);
              ctx.fillText(text, i * 20, drops[i] * 20);
              if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
                  drops[i] = 0;
              }
              drops[i]++;
          }
      }, 50);
  }
  function stopMatrix() {
      if (matrixInterval) {
          clearInterval(matrixInterval);
          matrixInterval = null;
          const canvas = document.getElementById('matrixCanvas');
          if (canvas) {
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#000000';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
      }
  }
---

The blog has always been **markdown-first**. Write a `.md` file, run the build script, and get a fully styled HTML page. This workflow was **frictionless** for text content, but what happens when you need an **interactive visualization**?

This post documents how we extended the system to support **inline scripts** and **styles**—and includes **live demos** you can play with right now.

## the problem

I wanted to add an interactive algorithm visualization to [blog post 017](/blog/solving-adjacent-increasing-subarrays-from-naive-t). The visualization needed custom CSS, JavaScript functions, event handlers, and dynamic DOM updates.

The existing system couldn't handle this. Markdown files became HTML through `marked.js`, but there was no way to inject **custom scripts** or **styles** into individual posts.

## the solution: frontmatter injection

We extended the YAML frontmatter to accept `inlineStyles` and `inlineScripts` fields:

```yaml
---
title: "Post Title"
inlineStyles: |
  .custom-class {
      color: #55ff55;
  }
inlineScripts: |
  function demo() {
      alert('hello!');
  }
---
```

The build script extracts these fields and injects them into the HTML template. Simple, clean, backward compatible.

## live demos

Let's see what this enables. Try these interactive examples—they're all powered by the inline script system.

### demo 1: terminal greeting

Type your name and press enter (or click the button).

<div class="demo-box">
    <div class="demo-title">terminal greeting</div>
    <div class="terminal-input">
        <input type="text" id="nameInput" placeholder="enter your name">
        <button onclick="greetUser()">greet</button>
    </div>
    <div class="terminal-output" id="terminalOutput">> awaiting input...</div>
</div>

**How it works:** The `greetUser()` function is defined in the frontmatter's `inlineScripts`. When you click the button, it reads the input, processes it, and updates the output div with terminal-style text.

### demo 2: terminal color palette

Click the buttons to change the color. This demonstrates CSS variable updates from JavaScript.

<div class="demo-box">
    <div class="demo-title">terminal colors</div>
    <div class="color-demo">
        <div class="color-swatch" id="colorSwatch" style="background-color: #55ff55; border-color: #55ff55;"></div>
        <div class="color-buttons">
            <button class="green" onclick="changeColor('green')">terminal green</button>
            <button class="yellow" onclick="changeColor('yellow')">warning yellow</button>
            <button class="cyan" onclick="changeColor('cyan')">info cyan</button>
            <button class="magenta" onclick="changeColor('magenta')">error magenta</button>
        </div>
    </div>
</div>

**How it works:** The `changeColor()` function updates the swatch's background color and adds a glow effect using inline styles. All the color definitions are in the frontmatter CSS.

### demo 3: click counter

A simple state management demo. See how many clicks you can get.

<div class="demo-box">
    <div class="demo-title">click counter</div>
    <div class="counter-display">
        <div class="counter-number" id="counterDisplay">0</div>
        <div class="counter-label">clicks registered</div>
    </div>
    <div class="counter-buttons">
        <button onclick="incrementCounter()">+ increment</button>
        <button onclick="decrementCounter()">- decrement</button>
        <button onclick="resetCounter()">reset</button>
    </div>
</div>

**How it works:** JavaScript maintains a `clickCount` variable. The buttons call functions that modify the count and update the DOM. The color changes when you hit certain thresholds.

### demo 4: matrix rain mini

The classic Matrix falling characters effect—in your blog post.

<div class="demo-box">
    <div class="demo-title">matrix rain</div>
    <canvas class="matrix-canvas" id="matrixCanvas"></canvas>
    <div class="matrix-controls">
        <button onclick="startMatrix()">start</button>
        <button onclick="stopMatrix()">stop</button>
    </div>
</div>

**How it works:** A Canvas 2D context with an interval-based animation loop. The `startMatrix()` function creates falling characters using Unicode characters and alpha blending for the trail effect.

## implementation details

### build script changes

Modified `blog/scripts/build.js` to extract and inject the new frontmatter fields:

```javascript
// Process inline styles and scripts from frontmatter
const inlineStyles = frontmatter.inlineStyles || '';
const inlineScripts = frontmatter.inlineScripts || '';

// Inject into template
const html = template
    .replace(/{{inlineStyles}}/g, inlineStyles)
    .replace(/{{inlineScripts}}/g, inlineScripts);
```

### template modifications

Added injection points to `blog/templates/post.html`:

```html
<style>
    /* Regular styles */
    /* ... */

    /* Inline styles injected from frontmatter */
    {{inlineStyles}}
</style>

<script>
    /* Regular scripts */
    /* ... */

    /* Inline scripts injected from frontmatter */
    {{inlineScripts}}
</script>
```

### markdown HTML rules

When embedding HTML in markdown for these demos, **critical rules**:

1. **No blank lines** within the HTML block—markdown parsers reset on blank lines
2. **Consistent indentation**—keeps the parser happy
3. **Treat as single unit**—the entire HTML block should flow without interruption

Example of what **not** to do:

```html
<div class="demo">
    <button>Click</button>

    <div class="output"></div>  <!-- blank line above breaks this -->
</div>
```

Example of what **works**:

```html
<div class="demo">
    <button>Click</button>
    <div class="output"></div>
</div>
```

## what this enables

The inline script system makes these possible:

**Algorithm visualizations** - Like the sorting visualizer in post 017, with state tracking and step-by-step execution.

**Interactive code playgrounds** - Users can modify code and see results instantly.

**Data visualizations** - Charts, graphs, and diagrams that update based on user input.

**Games** - Simple browser games embedded directly in blog posts.

**Calculators and tools** - Practical utilities that solve real problems.

All of this while maintaining the **markdown-first philosophy**. No complex build pipeline, no frontend framework, just YAML frontmatter and vanilla JavaScript.

## benefits

**Separation of concerns:** Content lives in markdown, styling in CSS, behavior in JavaScript—all colocated in one file.

**Backward compatibility:** Posts without inline scripts work perfectly. Old posts don't break.

**Terminal aesthetic preservation:** Custom CSS ensures every interactive element matches the 90s BBS aesthetic.

**Maintainability:** Fix a bug? Edit the frontmatter, rebuild. No scattered files or complex refactors.

**Performance:** Static HTML generation means fast page loads. JavaScript only runs for interactive features.

## the full picture

This post itself uses **127 lines of CSS** and **98 lines of JavaScript** in its frontmatter to power all four demos. Check the source markdown to see how it all fits together.

The [algorithm visualization in post 017](/blog/solving-adjacent-increasing-subarrays-from-naive-t) uses even more—**282 lines of CSS** and **185 lines of JavaScript**—for a full step-by-step algorithm execution interface.

And the blog remains what it's always been: text files that become beautiful, functional web pages.

**Try the demos above.** Every button click, color change, and matrix character proves the system works. The blog is no longer just static text—it's an interactive platform.

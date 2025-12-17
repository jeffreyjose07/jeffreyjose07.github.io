---
title: "Optimizing Performance and Pagination: A Deep Dive into Web Vitals"
date: "2025-12-17"
tags: ["optimization", "web-development", "performance", "accessibility", "seo"]
description: "How I refactored the blog's pagination system for better SEO, optimized image loading strategies to boost Core Web Vitals, and fixed critical accessibility issues."
readingTime: 6
wordCount: 1200
---

As this portfolio and blog continue to grow, maintaining peak performance and a seamless user experience becomes increasingly challenging. Today, I tackled several technical debt items that were affecting both **SEO** and **Core Web Vitals**. This post details the journey of refactoring the pagination system, implementing advanced image loading strategies, and resolving accessibility bottlenecks identified by Google PageSpeed Insights.

## the pagination problem

Initially, the blog's pagination was simple but brittle. The build script generated flat HTML files like `page2.html` and `page3.html`. While functional, this approach had significant downsides:

1.  **URL Structure**: `jeffreyjose07.is-a.dev/blog/page2.html` is not clean or idiomatic. The standard convention is a directory-based structure like `/blog/page/2/`.
2.  **Scalability**: Flat files clutter the root directory and make URL management cumbersome.
3.  **SEO**: Search engines prefer structured, predictable URL hierarchies.

### the solution: directory-based routing

I refactored the Node.js build script (`blog/scripts/build.js`) to generate a nested directory structure. Instead of writing `page${i}.html`, the script now creates a directory for each page:

```javascript
// Old approach
// fs.writeFileSync(path.join(OUTPUT_DIR, `page${i + 1}.html`), html);

// New approach
const pageDir = path.join(OUTPUT_DIR, 'page', (i + 1).toString());
if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
}
fs.writeFileSync(path.join(pageDir, 'index.html'), html);
```

This simple change transforms the URL from `/blog/page2.html` to `/blog/page/2/`, which is cleaner, professional, and more SEO-friendly. I also updated the pagination links in the template to respect this new structure:

```html
<!-- Before -->
<a href="/blog/page2.html">2</a>

<!-- After -->
<a href="/blog/page/2/">2</a>
```

## optimizing core web vitals

A recent PageSpeed Insights analysis revealed a mobile performance score of **91**, which is good, but I aimed for perfection. The primary bottlenecks were **Largest Contentful Paint (LCP)** and **Cumulative Layout Shift (CLS)** caused by unoptimized images.

### from background-image to img tags

The blog index originally displayed post thumbnails using `div` elements with `background-image`. While this makes it easy to handle different aspect ratios using `background-size: cover`, it has a major performance drawback: browser preloaders cannot discover background images as easily as `<img>` tags, delaying the LCP.

I refactored the template to use semantic `<img>` tags with modern CSS:

```css
.post-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Replicates background-size: cover */
    transition: transform 0.5s ease;
}
```

### intelligent loading strategy

To further improve LCP, I implemented a conditional loading strategy. The browser shouldn't lazy-load images that are in the initial viewport, nor should it eagerly load images that are off-screen.

I updated the build script to apply `loading="eager"` to the first 3 posts on the first page, and `loading="lazy"` to everything else. Additionally, for the main profile image on the homepage, I added `fetchPriority="high"` to explicitly signal its importance to the browser's resource scheduler.

```javascript
// Eager load images for the first 3 posts on the first page, lazy load others
const loadingAttr = (i === 0 && index < 3) ? 'eager' : 'lazy';

thumbnailHtml = `<div class="post-thumbnail">
    <img src="${thumbSrc}" alt="${post.title}" loading="${loadingAttr}" width="400" height="225">
</div>`;
```

This ensures the most critical content loads immediately, while conserving bandwidth for the rest.

### optimizing font delivery

Google Fonts can often be a render-blocking resource. To address this, I switched to a non-blocking loading strategy using `rel="preload"` combined with an `onload` handler.

```html
<link rel="preload" as="style" href="..." />
<link rel="stylesheet" href="..." media="print" onload="this.media='all'" />
<noscript>
  <link rel="stylesheet" href="..." />
</noscript>
```

This technique allows the browser to fetch the font stylesheet asynchronously without blocking the initial paint, significantly improving the **First Contentful Paint (FCP)** metric.

## accessibility wins

Performance isn't just about speed; it's about usability. The audit flagged several **accessibility** issues that needed immediate attention:

1.  **Icon-Only Buttons**: Social media links and the theme toggle button lacked text labels, making them invisible to screen readers. I added `aria-label` attributes to all icon-only interactions.
    
    ```jsx
    <a 
      href={social.href} 
      aria-label={social.label} // Added for accessibility
      target="_blank"
    >
      <social.icon />
    </a>
    ```

2.  **Contrast Ratios**: The "Email", "Phone", and "Location" labels in the contact section used a muted color that failed contrast guidelines on dark backgrounds. I updated the text color from `text-zinc-400` to `text-white` to ensure maximum legibility for all users.

3.  **Heading Hierarchy**: I restructured the heading levels in the Skills and Education sections (changing `CardTitle` to render as `h3` and adjusting nested headings) to ensure a strictly sequential descending order, which is crucial for screen reader navigation.

4.  **Layout Stability**: I added explicit `width` and `height` attributes to the main profile avatar. This allows the browser to reserve space for the image before it loads, preventing jarring layout shifts (CLS).

## conclusion

These changes might seem small individually, but collectively they represent a significant step forward in engineering quality. By refactoring the pagination, we now have a robust URL structure. By optimizing images, we've reduced the LCP and improved the mobile experience. And by fixing accessibility issues, we've ensured the site is inclusive for everyone.

The journey of optimization is never truly finished, but today's updates bring us much closer to that 100/100 score.

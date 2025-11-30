---
title: "Refining Navigation and Branding: A Journey to Consistency"
date: "2025-11-30"
tags: ["design", "branding", "ux", "frontend", "css"]
description: "How I unified the navigation experience across my portfolio, blog, and games, and refined the 'JJ' logo for better visibility."
readingTime: 5
wordCount: 800
---

Consistency is key in design. When I looked at my portfolio, I realized that while individual sections looked great, the overall experience felt disjointed. The blog had a different header than the main site, the games had their own unique navigation, and the logo—while cool—wasn't as visible as I wanted it to be.

Today, I embarked on a mission to unify the branding and navigation across the entire `jeffreyjose07.github.io` ecosystem. Here's how I did it.

## The "JJ" Monogram

The first step was to refine the logo. I wanted something bold, geometric, and instantly recognizable. The previous iteration was a bit too subtle.

I iterated on a design featuring two thick, rounded J's. To add a bit of dynamism, I made the left 'J' start slightly higher than the right one, and added a distinct dot on the right side. This created a balanced yet energetic monogram that works perfectly as a favicon and a header logo.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Left J -->
  <path d="M180 120 V340 A60 60 0 0 1 60 340" 
        fill="none" stroke="url(#grad)" stroke-width="80" stroke-linecap="round" />
  <!-- Right J -->
  <path d="M332 172 V340 A60 60 0 0 1 212 340" 
        fill="none" stroke="url(#grad)" stroke-width="80" stroke-linecap="round" />
  <!-- Dot -->
  <circle cx="420" cy="340" r="40" fill="url(#grad)" />
</svg>
```

With the new SVG in hand, I regenerated all the favicons—ICO, PNGs, and the Apple Touch Icon—ensuring that the site looks sharp on every device, from a 4K monitor to an iPhone home screen.

## Unifying the Navigation

The biggest challenge was the navigation. My portfolio used a sleek "Top Bar" style, but the blog was still using an older "Floating Pill" design. Worse, the blog had a bug where duplicate menus would sometimes appear.

### The "Top Bar" Standard

I decided to standardize on the "Top Bar" design. It's clean, professional, and provides easy access to all sections of the site without intruding on the content.

I updated `src/components/Navigation.tsx` to solidify this style for the main React app. Then, I turned my attention to the static parts of the site.

### Fixing the Blog

The blog is statically generated using a custom Node.js script. I had to dive into `blog/templates/header.html` and completely rewrite the CSS and HTML to match the React component.

**Key Changes:**
1.  **Fixed Positioning:** Moved from `top: 1.5rem` to `top: 0` with `width: 100%`.
2.  **Backdrop Filter:** Added a blur effect that activates on scroll, giving it that premium glassmorphism look.
3.  **Responsive Design:** Ensured the mobile menu works seamlessly with the new layout.

### Updating the Games

My games—Snake and Void Blocks—are standalone HTML pages. They also needed to join the family. I updated their headers to include the new logo and the standard Top Bar navigation. Now, whether you're playing a game, reading a blog post, or checking out my projects, the navigation remains consistent.

## The Result

The result is a cohesive, polished experience. The new logo pops, the navigation feels familiar no matter where you are, and the site feels more like a single, unified product rather than a collection of disparate pages.

It's a small detail, but in UI/UX, details are everything.

---

*Check out the new logo in the header above!*

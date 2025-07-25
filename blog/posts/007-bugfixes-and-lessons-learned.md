---
title: "Lessons from the Bugs: How We Improved the Portfolio and Blog"
slug: "bugfixes-and-lessons-learned"
date: "2025-07-25"
tags: ["meta", "bugfixes", "engineering", "changelog"]
description: "A retrospective on bugs encountered while building this portfolio/blog, and how each was fixed."
readingTime: 6
wordCount: 1200
---

# Lessons from the Bugs: How We Improved the Portfolio and Blog

Building and maintaining a modern portfolio and blog site is an ongoing journey. Along the way, bugs inevitably surface—some subtle, some obvious, all valuable learning opportunities. Here’s a retrospective on the bugs we’ve fixed so far, and the lessons learned from each.

## 1. Excluding the RSS Feed from Version Control
**The Bug:** The generated `feed.xml` RSS file was tracked by git, causing timestamp conflicts on every build.

**The Fix:** We updated `.gitignore` to exclude the RSS feed, ensuring builds remain clean and reproducible.

---

## 2. Image Alignment and Responsive Sizing
**The Bug:** Images in blog posts and components weren’t aligning properly on all screen sizes.

**The Fix:** Improved CSS for image containers and made image styles responsive, ensuring consistent appearance across devices.

---

## 3. Blog Episode Numbering
**The Bug:** Blog episode numbers didn’t start at `000`, causing confusion in navigation and archives.

**The Fix:** Adjusted the build script logic so episode numbers begin at `000`, matching the intended order and design.

---

## 4. JSX Structure in Loops
**The Bug:** Incorrect placement of button elements inside map functions led to invalid JSX and runtime errors.

**The Fix:** Refactored the affected components to ensure all JSX elements are properly structured and keyed.

---

## 5. Action Buttons and Animation Interference
**The Bug:** Action buttons inside card components were interfering with card animations.

**The Fix:** Moved action buttons outside the card structure, restoring intended animations and improving UX.

---

## 6. Button Click Issues and Navigation
**The Bug:** Buttons and navigation links weren’t always responding as expected, especially on mobile.

**The Fix:** Replaced custom button components with native `<button>` elements and explicit event handlers, improving reliability. Anchor tags were used for navigation where appropriate.

---

## 7. Node Modules Corruption
**The Bug:** Corrupted `node_modules` directory caused build and dependency errors.

**The Fix:** Removed and reinstalled all dependencies, then updated and locked versions to prevent recurrence.

---

## 8. IntersectionObserver Unobserve Logic
**The Bug:** The IntersectionObserver in one component failed to unobserve elements correctly, leading to memory leaks.

**The Fix:** Fixed the unobserve logic to properly disconnect observers, improving performance and stability.

---

## 9. Uniform Green Gradient in Sidebar
**The Bug:** Sidebar gradients were inconsistent across browsers and devices.

**The Fix:** Standardized the CSS for gradients, ensuring a uniform appearance everywhere.

---

## 10. Deployment and Build Issues
**The Bug:** Missing files and outdated deployment configs caused failed builds and missing assets on production.

**The Fix:** Added missing files, updated deployment configuration, and improved the build process for reliability.

---

## Conclusion

Every bug is an opportunity to learn and improve. By systematically addressing these issues, we’ve made the portfolio and blog more robust, user-friendly, and maintainable. Here’s to many more iterations—and fewer bugs in the future!

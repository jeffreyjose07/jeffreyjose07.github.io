---
title: "Creating This Portfolio Website and Blog"
date: "2025-01-24"
tags: ["frontend", "meta"]
description: "How I built my portfolio website and blog using React, TypeScript, and Vite"
readingTime: 2
wordCount: 500
---

Building a portfolio website is one of those projects that every developer eventually tackles. After years of putting it off, I finally decided to create something that would showcase my work and serve as a creative outlet for technical writing.

## The Portfolio Website

The main portfolio site is built as a modern single-page application using React and TypeScript. I wanted something fast, responsive, and easy to maintain while still looking professional.

The design follows a clean, modern aesthetic with smooth animations and a responsive layout. I implemented a custom theme system with both light and dark modes, though I personally prefer the dark theme for development work.

The site includes sections for my professional experience, projects, skills, education, and contact information. Each section is designed to be scannable and informative without being overwhelming.

## The Blog

For the blog, I took inspiration from [MusicForProgramming.net](https://musicforprogramming.net/) - a site I've always admired for its minimal, terminal-like aesthetic and focus on content over form.

The blog is intentionally simple: black background, white monospace text, and no unnecessary visual elements. This design choice reflects my philosophy that technical content should be easy to read and distraction-free.

Rather than using a complex CMS or static site generator, I opted for simple HTML files with inline CSS. This keeps the blog lightweight and gives me complete control over the presentation without any build complexity.

## Deployment and Workflow

The entire site is hosted on GitHub Pages, with automatic deployment through GitHub Actions. Every push to the main branch triggers a build process that compiles the React application and deploys it to the gh-pages branch.

This setup gives me a seamless workflow: write code locally, push to GitHub, and see changes live within minutes. The blog posts can be added by simply creating new HTML files in the appropriate directory structure.

## Lessons Learned

This project reinforced several principles I value in software development:

- Simple solutions are often the best solutions
- Performance matters - the site loads instantly
- Good design doesn't require complexity
- Having the right tools makes development enjoyable

Building this portfolio and blog has been a satisfying project that combines technical skills with creative expression. It serves as both a showcase of my work and a platform for sharing thoughts on software engineering topics.

The source code is available on GitHub, and I plan to write more about the specific technical decisions and implementation details in future posts.
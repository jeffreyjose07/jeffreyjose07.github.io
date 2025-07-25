# Jeffrey Jose - Portfolio

A modern, responsive portfolio website built with React and TypeScript, showcasing my experience, education, and skills.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jeffreyjose07/jeffreyjose07.github.io.git
cd jeffreyjose07.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Build

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

This repository contains both a modern portfolio site and a fully static blog:

- **Portfolio**: Built with React, TypeScript, Vite, and Tailwind CSS. Features include responsive layout, dark/light mode, animated UI, and interactive sections for experience, education, and skills.
- **Blog**: Markdown-based posts are located in `blog/posts/`. The blog is built using a custom Node.js script that converts Markdown to HTML, applies semantic coloring, and generates archive, navigation, and RSS pages. Blog templates use embedded CSS for styling.

## Blog Workflow

- To add a new blog post, create a Markdown file in `blog/posts/` with the appropriate frontmatter (title, date, etc.).
- The build script (`blog/scripts/build.js`) will automatically process all posts, generate HTML, and update the archive and RSS feed.
- All blog headings, blockquotes, and links retain their original capitalization from Markdown (no forced lowercase).

## Automated CI/CD

Deployment is managed by a multi-stage GitHub Actions workflow:

1. **build-blog**: Detects changes to blog content and builds the blog if necessary.
2. **commit-blog**: If new blog HTML is generated, commits it back to the repository.
3. **build-portfolio**: Always builds the portfolio site after blog processing.
4. **deploy**: Uploads the built site to GitHub Pages.

**Any change to either the portfolio or the blog will trigger a full rebuild and redeploy.**

## Technologies Used

- **React** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Node.js** - Blog build scripts
- **Marked** - Markdown to HTML conversion for blog

## Features

- Responsive design that works on all devices
- Dark/light theme toggle
- Interactive sections for experience, education, and skills
- Contact form
- Modern UI with smooth animations
- Static blog with semantic highlighting, archive, and RSS feed

## Deployment

This project is deployed on GitHub Pages and automatically builds and redeploys from the main branch using GitHub Actions. Both portfolio and blog changes are always reflected live.

---

### Adding a Blog Post
1. Create a new Markdown file in `blog/posts/` (see existing posts for format).
2. Commit and push your changes to the `main` branch.
3. The CI workflow will build the blog, commit generated HTML, build the portfolio, and deploy the updated site.

---

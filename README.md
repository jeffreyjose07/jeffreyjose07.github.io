# Jeffrey Jose - Portfolio

A modern, responsive portfolio website built with React and TypeScript, showcasing my experience, education, and skills.

## Getting Started

### Prerequisites

- Node.js **v20.19.0 or higher** (enforced by `engines` in `package.json`)
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

- **Portfolio**: Built with React, TypeScript, Vite, and Tailwind CSS. Dark by default with a light toggle, responsive layout, and sections for experience, projects, skills and education. Project cards link to the blog posts written about them.
- **Blog**: Markdown posts in `blog/posts/`, named `###-slug.md`. A custom Node.js script converts them to static HTML, highlights fenced code with **Shiki** (`one-dark-pro`), and generates the index, archive, sitemap, `posts.json` and RSS. Blog templates carry their own embedded CSS mirroring the React theme tokens.

## Design System

- **Headings**: `Syne` · **Body**: `Plus Jakarta Sans` · **Code**: system mono
- **Accent**: emerald teal — `hsl(162 75% 38%)` light / `hsl(162 75% 46%)` dark
  (`src/index.css`), mirrored as `#1cc9a0` in `blog/templates/styles.html`
- **Theme**: dark default, light toggle, system preference respected

An earlier 90s terminal aesthetic was replaced in episode 026. Older blog posts still
describe it — they are dated records, not current documentation.

## Blog Workflow

- To add a post, create `blog/posts/###-slug.md` with frontmatter (title, date, tags,
  description). Use the next sequential episode number.
- Commit **the Markdown only**. CI runs the build and commits the generated HTML and
  thumbnails itself, so committing local build output races it.
- Test locally with `node blog/scripts/build.js` before pushing.

## Automated CI/CD

A single GitHub Actions job, `build-and-deploy` in `.github/workflows/deploy.yml`:

1. Detects whether `blog/{posts,templates,scripts,config.json}` changed.
2. Builds the blog if so (`npm run build:blog`).
3. **Verifies the output** — fails if no HTML was produced, or if any page contains a
   stringified renderer token. A green exit code alone is not treated as proof.
4. Commits generated `public/blog/` and `public/assets/thumbnails/` back to the branch.
5. Builds the portfolio and deploys to GitHub Pages.

**Any change to either the portfolio or the blog triggers a full rebuild and redeploy.**

## Technologies Used

- **React** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Node.js** - Blog build scripts
- **Marked + marked-shiki** - Markdown to HTML with build-time syntax highlighting
- **Shiki** - VS Code TextMate grammars, `one-dark-pro` theme
- **Puppeteer** - Terminal-style post thumbnail generation

## Features

- Responsive design that works on all devices
- Dark by default, with a light theme toggle
- Recent blog posts surfaced on the homepage (`RecentWriting`)
- Project cards linking to the long-form write-ups behind them
- Contact form (EmailJS — see `EMAILJS_SETUP.md`)
- Privacy-friendly analytics (GoatCounter — see `ANALYTICS.md`)
- Static blog with Shiki syntax highlighting, tag filtering, search, archive,
  sitemap and RSS feed

## Deployment

This project is deployed on GitHub Pages and automatically builds and redeploys from the main branch using GitHub Actions. Both portfolio and blog changes are always reflected live.

---

### Adding a Blog Post
1. Create a new Markdown file in `blog/posts/` (see existing posts for format).
2. Commit and push your changes to the `main` branch.
3. The CI workflow will build the blog, commit generated HTML, build the portfolio, and deploy the updated site.

---

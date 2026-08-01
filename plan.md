# Project Roadmap: Content-Aware Terminal Thumbnails

> ## ✅ COMPLETED — shipped, see episode 024 ("Automating Terminal-Style Thumbnails")
>
> This roadmap is **done** and kept as a historical record of the design decisions.
> The implementation lives in `scripts/thumbnail-generator/` (`generate.js` +
> `template.html`) and runs during the blog build; output goes to
> `public/assets/thumbnails/<slug>.png` and is committed by CI.
>
> **Three details below are out of date and were deliberately left unedited, to
> preserve the original record:**
> - The palette specifies violet `#7c3aed` as "Site Primary". The site accent is now
>   **emerald teal** (`#1cc9a0` / `hsl(162 75% 38%)`) — changed in episode 026.
> - The typography section names `Outfit` and `Inter`. The site now uses **`Syne`**
>   for headings and **`Plus Jakarta Sans`** for body.
> - "Run generation script for all existing 24 posts" — there are now 35.
>
> Do not treat the colours in this file as the design system. See `CLAUDE.md`.

**Goal:** Replace generic gradient thumbnails with "Terminal Screenshot" style images that communicate post content and align with the site's "Premium Dark" aesthetic.

## 1. Design Specification
To ensure visual consistency with the existing `Outfit` and `Inter` typography and `#09090b` background:

*   **Dimensions:** `1200x630px` (Open Graph standard), centered safe zone for blog grid.
*   **Background:**
    *   **Outer Container:** `#09090b` (Site Background)
    *   **Terminal Window:** `#0a0a0a` (Deep Black) with a subtle border `rgba(255, 255, 255, 0.1)`.
    *   **Window Controls:** Minimal macOS style dots (Red, Yellow, Green) or flat monochrome for a stricter terminal look.
    *   **Shadow:** Soft, colored glow behind the terminal based on the primary tag color (e.g., subtle violet glow for general posts).
*   **Typography:**
    *   **Terminal Font:** `JetBrains Mono` or `Fira Code` (Google Fonts) - *Modern, ligature-rich, premium developer feel.*
    *   **Window Title:** `Outfit` (SemiBold) - *Matches site headings.*
*   **Color Palette (Adapting Site Theme):**
    *   **Prompt/Accent:** `#7c3aed` (Site Primary/Violet)
    *   **Success/String:** `#4ade80` (Green-400)
    *   **Error/Keyword:** `#f87171` (Red-400)
    *   **Command:** `#f8fafc` (Slate-50)
    *   **Comment:** `#94a3b8` (Slate-400)

## 2. Selected Strategy: "The Simulated Terminal"
We will generate images that look like a terminal window executing a command relevant to the blog post's topic.

**Visual Structure:**
```text
┌──────────────────────────────────────────────┐
│  ● ● ●  ~/blog/posts/013-neon-migration      │
│──────────────────────────────────────────────│
│                                              │
│  $ psql -h neon.tech -U jeffrey dbname       │
│  Password: ************                      │
│                                              │
│  Connected to Neon (PostgreSQL 15.2)         │
│  SSL connection (protocol: TLSv1.3)          │
│                                              │
│  db=> \dt                                    │
│        List of relations                     │
│  Schema |    Name    | Type  | Owner         │
│  -------+------------+-------+--------       │
│  public | migrations | table | jeffrey       │
│  public | posts      | table | jeffrey       │
│  (2 rows)                                    │
│                                              │
│  db=> _                                      │
│                                              │
└──────────────────────────────────────────────┘
```

## 3. Mapping Logic (Tag → Command)
| Tag Category | Command Pattern | Output Style |
| :--- | :--- | :--- |
| **Personal** | `whoami`<br>`cat journal.txt` | User info or text stream |
| **Tutorial** | `man {topic}`<br>`./guide.sh --start` | Manual page or step list |
| **Frontend** | `npm run dev`<br>`npx vite build` | Build output / success messages |
| **Backend** | `curl -X POST /api/...`<br>`docker logs api` | JSON response or server logs |
| **Database** | `psql`<br>`SELECT * FROM ...` | Table results |
| **GameDev** | `cargo run`<br>`./game_engine` | ASCII loading bar / Game loop |
| **DevOps** | `git push`<br>`kubectl get pods` | Status tables / Progress bars |
| **AI/LLM** | `python train.py`<br>`./llm --prompt "..."` | Epoch progress / Token stream |

## 4. Technical Stack
*   **Runtime:** Node.js
*   **Renderer:** `puppeteer` (Headless Chrome) - Chosen for superior font rendering and CSS layout capabilities compared to `node-canvas`.
*   **Templating:** HTML/CSS (Flexbox/Grid) injected into the browser page.
*   **Fonts:** Google Fonts loaded dynamically.

## 5. Implementation Roadmap

### Phase 1: Setup & Tooling
- [x] Initialize `scripts/thumbnail-generator` with `puppeteer`.
- [x] Create `scripts/thumbnail-generator/template.html` with the basic terminal structure.
- [x] Configure `tsconfig.json` or script setup to run TS/JS modules.

### Phase 2: Template Development
- [x] **Base Template:** Window frame, shadow, padding, scalable SVG controls.
- [x] **Content Modules:**
    -   `CommandOutput` (Standard shell interaction)
    -   `CodeSnippet` (Syntax highlighted code block)
    -   `ProgressBar` (For "Building..." or "Loading..." metaphors)

### Phase 3: Batch Generation
- [x] Create `scripts/thumbnail-generator/config.json` to map specific posts to specific commands (overriding defaults).
- [x] Run generation script for all existing 24 posts.
- [x] Save outputs to `public/assets/thumbnails/`.

### Phase 4: Integration
- [x] Update `blog/posts/*.md` frontmatter to point to new images (or standard naming convention).
- [x] Update `blog/templates/post.html` and `index.html` to render them.
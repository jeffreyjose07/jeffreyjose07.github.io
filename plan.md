# Project Roadmap: Content-Aware Terminal Thumbnails

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
- [ ] Initialize `scripts/thumbnail-generator` with `puppeteer`.
- [ ] Create `scripts/thumbnail-generator/template.html` with the basic terminal structure.
- [ ] Configure `tsconfig.json` or script setup to run TS/JS modules.

### Phase 2: Template Development
- [ ] **Base Template:** Window frame, shadow, padding, scalable SVG controls.
- [ ] **Content Modules:**
    -   `CommandOutput` (Standard shell interaction)
    -   `CodeSnippet` (Syntax highlighted code block)
    -   `ProgressBar` (For "Building..." or "Loading..." metaphors)

### Phase 3: Batch Generation
- [ ] Create `scripts/thumbnail-generator/config.json` to map specific posts to specific commands (overriding defaults).
- [ ] Run generation script for all existing 24 posts.
- [ ] Save outputs to `public/assets/thumbnails/`.

### Phase 4: Integration
- [ ] Update `blog/posts/*.md` frontmatter to point to new images (or standard naming convention).
- [ ] Update `blog/templates/post.html` and `index.html` to render them.
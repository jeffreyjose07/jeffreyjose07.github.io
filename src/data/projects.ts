export interface Writeup {
    /** Short label shown on the link, e.g. "Post-mortem: the two-month outage". */
    label: string;
    /** Path to the blog post, e.g. "/blog/two-month-outage-aiven-dns-and-jdbc-urls". */
    href: string;
}

export interface Project {
    title: string;
    description: string;
    image: string;
    videoUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    technologies: string[];
    highlights: string[];
    /**
     * Long-form writing about this project. These are the evidence behind the
     * highlights — real incidents, migrations and measurements rather than
     * claims — so they carry more weight than the bullet list above.
     */
    writeups?: Writeup[];
}

export const featuredProjects: Project[] = [
    {
        title: "Scalable Chat Platform",
        description: "A production real-time chat application built with Spring Boot 3.2 and React 18, running on Render against Aiven PostgreSQL, MongoDB Atlas and Upstash Redis. Multi-database architecture, WebSocket messaging, and a deployment I have since taken apart in public — including a two-month outage post-mortem.",
        image: "/scalable-chat-platform.png",
        liveUrl: "https://scalable-chat-platform.onrender.com/",
        githubUrl: "https://github.com/jeffreyjose07/scalable-chat-platform",
        technologies: ["Spring Boot 3.2", "React 18", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Docker", "WebSocket"],
        highlights: [
            "Multi-database strategy: PostgreSQL for identity, MongoDB for messages, Redis for JWT revocation",
            "Real-time WebSocket messaging with role-based access control and JWT authentication",
            "Deep health endpoint probing all three datastores independently, with per-dependency latency",
            "Dockerized single-service deployment: React compiled into the Spring Boot jar"
        ],
        writeups: [
            {
                label: "Post-mortem: two months down, dead DNS and eager filters",
                href: "/blog/two-month-outage-aiven-dns-and-jdbc-urls"
            },
            {
                label: "Hardening: deps, deep health checks and CI pings",
                href: "/blog/hardening-the-chat-platform-deps-deep-health-and-c"
            },
            {
                label: "Database odyssey: Neon → Supabase → Aiven",
                href: "/blog/from-neon-to-supabase-to-aiven-a-postgresql-migrat"
            },
            {
                label: "Deploying it to Render in the first place",
                href: "/blog/deploying-a-chat-platform-to-render"
            }
        ]
    },
    {
        title: "TruthMeter AI - AI Pair Programming Metrics Extension",
        description: "A VS Code extension that measures the ACTUAL impact of AI coding assistants on developer productivity based on peer-reviewed research, not vanity metrics. Works with any AI assistant (GitHub Copilot, Cursor, Windsurf Cascade, etc.) and tracks what actually matters: code quality, true productivity gains, and economic ROI.",
        image: "/truthmeter-ai-screenshot.png",
        liveUrl: "https://marketplace.visualstudio.com/items?itemName=jeffreyjose.truthmeter-ai",
        githubUrl: "https://github.com/jeffreyjose07/truthmeterai",
        technologies: ["TypeScript", "VS Code Extension API", "Node.js", "Git Analysis", "Webpack", "Mocha Testing"],
        highlights: [
            "Research-backed metrics from METR 2025, GitClear 2024, and GitHub studies",
            "Tracks code churn, duplication, complexity, and actual vs perceived productivity",
            "Privacy-first design — all data stored locally, no cloud sync",
            "145+ passing tests with 80%+ code coverage"
        ],
        writeups: [
            {
                label: "Why I built it, and what the research actually says",
                href: "/blog/building-truthmeter-ai-measuring-the-real-impact-o"
            }
        ]
    },
    {
        title: "VOID BLOCKS",
        description: "A cyberpunk Tetris variant written to a hard constraint: one HTML file, no build step, no dependencies, no network. Everything — game loop, rendering, virus mechanics, audio — lives in under 50KB of vanilla JavaScript against a 16ms frame budget.",
        image: "/games/void-blocks/screenshot.png",
        liveUrl: "/play/void-blocks",
        githubUrl: "https://github.com/jeffreyjose07/void-blocks-game",
        technologies: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3", "Game Development"],
        highlights: [
            "Single HTML file under 50KB with zero dependencies and no build step",
            "Locked 60fps via requestAnimationFrame — all rendering in Canvas 2D, no sprite assets",
            "Probabilistic virus-spread mechanic (30% infection chance) layered onto the classic grid",
            "Firewall challenge phases triggered every 10 levels"
        ],
        writeups: [
            {
                label: "Building it: constraints, mechanics and the 50KB budget",
                href: "/blog/building-void-blocks-a-cyberpunk-tetris-game"
            },
            {
                label: "Mobile responsiveness and terminal UI",
                href: "/blog/enhancing-game-ui-mobile-responsiveness-and-termin"
            }
        ]
    },
    {
        title: "Snake Game - Terminal Aesthetic",
        description: "Classic Snake rebuilt under the same single-file constraint as VOID BLOCKS: zero dependencies, Canvas 2D rendering, and one input layer that has to work identically for keyboard and touch.",
        image: "/snake-game-screenshot.png",
        liveUrl: "/play/snake",
        githubUrl: "https://github.com/jeffreyjose07/snake-game",
        technologies: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3", "Game Development", "Responsive Design"],
        highlights: [
            "Single HTML file with zero dependencies",
            "Smooth 60fps game loop with requestAnimationFrame",
            "One input abstraction serving both desktop keyboard and mobile touch",
            "Retro glow effects rendered entirely in Canvas — no image assets"
        ],
        writeups: [
            {
                label: "Building it, and the security work behind it",
                href: "/blog/building-a-secure-snake-game-with-terminal-aesthet"
            }
        ]
    },
];

/**
 * Earlier academic work from IIT Kharagpur (2017–2019). Kept for completeness;
 * these predate the professional work above and have no public repositories.
 */
export const otherProjects: Project[] = [
    {
        title: "Detection of Forest Area in SAR Images",
        description: "Computer vision project for detecting forest areas in polarimetric SAR RISAT-1 images using ML algorithms.",
        image: "/generic-project.png",
        technologies: ["Python", "Computer Vision", "Machine Learning", "SAR Image Processing"],
        highlights: []
    },
    {
        title: "Graph-based Document Summarization",
        description: "NLP system generating concise summaries using TextRank and degree-centrality graph algorithms.",
        image: "/generic-project.png",
        technologies: ["Python", "NLP", "Graph Theory", "Algorithm Design"],
        highlights: []
    },
    {
        title: "Emotional Intelligence in Social Media",
        description: "Data analytics project analyzing emotional intelligence patterns and gender differences in Twitter data.",
        image: "/generic-project.png",
        technologies: ["Python", "Data Analytics", "Sentiment Analysis", "Statistical Analysis"],
        highlights: []
    }
];

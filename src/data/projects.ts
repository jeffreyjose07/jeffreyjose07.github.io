export interface Project {
    title: string;
    description: string;
    image: string;
    liveUrl?: string;
    githubUrl?: string;
    technologies: string[];
    highlights: string[];
}

export const projects: Project[] = [
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
            "Privacy-first design - all data stored locally, no cloud sync",
            "145+ passing tests with 80%+ code coverage",
            "Real-time dashboard with comprehensive metrics visualization",
            "Economic ROI calculator including hidden costs and technical debt",
            "SPACE Framework integration (Satisfaction, Performance, Activity, Efficiency)",
            "Works with all AI coding assistants - GitHub Copilot, Cursor, Cascade, etc."
        ]
    },
    {
        title: "Scalable Chat Platform",
        description: "A production-ready real-time chat application built with Spring Boot 3.2 and React 18. Features multi-database architecture, WebSocket messaging, and horizontal scaling design supporting 1000+ concurrent users.",
        image: "/scalable-chat-platform.png",
        liveUrl: "https://scalable-chat-platform.onrender.com/",
        githubUrl: "https://github.com/jeffreyjose07/scalable-chat-platform",
        technologies: ["Spring Boot 3.2", "React 18", "TypeScript", "PostgreSQL", "MongoDB", "Redis", "Docker", "WebSocket"],
        highlights: [
            "Multi-database strategy: PostgreSQL, MongoDB, Redis",
            "Real-time WebSocket messaging with 500+ msg/sec capacity",
            "Role-based access control with JWT authentication",
            "Supports 1000+ concurrent users with horizontal scaling",
            "Private and group conversations with read receipts",
            "Message search and filtering capabilities",
            "Dockerized deployment on Render platform",
            "Event-driven architecture with async processing"
        ]
    },
    {
        title: "VOID BLOCKS",
        description: "A single-file cyberpunk Tetris variant built with vanilla JavaScript and HTML5 Canvas. Features unique virus spreading mechanics, firewall challenges, and terminal-aesthetic design with zero external dependencies.",
        image: "/games/void-blocks/screenshot.png",
        liveUrl: "/play/void-blocks",
        githubUrl: "https://github.com/jeffreyjose07/void-blocks-game",
        technologies: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3", "Game Development"],
        highlights: [
            "Single HTML file under 50KB with zero dependencies",
            "Virus spreading mechanics with 30% infection chance",
            "Firewall challenges triggered every 10 levels",
            "Time manipulation via data fragments",
            "Optimized 60fps performance with requestAnimationFrame",
            "Terminal-inspired cyberpunk aesthetic with glow effects"
        ]
    },
    {
        title: "Snake Game - Terminal Aesthetic",
        description: "A modern take on the classic Snake game with terminal-inspired cyberpunk aesthetics. Built with vanilla JavaScript and HTML5 Canvas, featuring smooth gameplay, retro glow effects, and responsive controls optimized for both desktop and mobile.",
        image: "/snake-game-screenshot.png",
        liveUrl: "/play/snake",
        githubUrl: "https://github.com/jeffreyjose07/snake-game",
        technologies: ["Vanilla JavaScript", "HTML5 Canvas", "CSS3", "Game Development", "Responsive Design"],
        highlights: [
            "Classic Snake gameplay with modern enhancements",
            "Terminal-inspired cyberpunk visual design",
            "Smooth 60fps performance with requestAnimationFrame",
            "Responsive controls for desktop and mobile",
            "Retro glow effects and ASCII-style aesthetics",
            "Score tracking and game over animations",
            "Single HTML file with zero dependencies"
        ]
    },
    {
        title: "Detection of Forest Area in SAR Images",
        description: "Computer vision project focused on detecting and classifying forest areas in polarimetric SAR RISAT-1 images using advanced image processing techniques and machine learning algorithms.",
        image: "/generic-project.png",
        technologies: ["Python", "Computer Vision", "Machine Learning", "SAR Image Processing", "Pattern Recognition"],
        highlights: [
            "Implemented advanced SAR image processing algorithms",
            "Developed classification models for forest area detection",
            "Applied polarimetric analysis techniques",
            "Achieved accurate forest boundary identification",
            "Utilized RISAT-1 satellite imagery data"
        ]
    },
    {
        title: "Graph-based Document Summarization",
        description: "Natural language processing system that generates concise summaries of word documents using graph-based approaches including text-rank and degree-centrality algorithms.",
        image: "/generic-project.png",
        technologies: ["Python", "NLP", "Graph Theory", "Text Processing", "Algorithm Design"],
        highlights: [
            "Implemented TextRank algorithm for document summarization",
            "Applied degree-centrality based sentence ranking",
            "Developed graph-based text representation",
            "Automated summary generation pipeline",
            "Evaluated summarization quality metrics"
        ]
    },
    {
        title: "Emotional Intelligence in Social Media",
        description: "Data analytics project analyzing emotional intelligence patterns in Twitter users based on gender differences in tweets posted on sensitive topics, providing insights into social media behavior.",
        image: "/generic-project.png",
        technologies: ["Python", "Data Analytics", "Social Media Mining", "Sentiment Analysis", "Statistical Analysis"],
        highlights: [
            "Analyzed large-scale Twitter dataset",
            "Implemented sentiment analysis algorithms",
            "Studied gender-based emotional patterns",
            "Applied statistical analysis techniques",
            "Generated behavioral insights from social media data"
        ]
    }
];

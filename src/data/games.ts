export interface Game {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail?: string;
}

export const games: Game[] = [
    {
        id: "snake",
        title: "Snake Game",
        description: "A modern take on the classic Snake game with terminal-inspired cyberpunk aesthetics.",
        url: "/games/snake/index.html",
        thumbnail: "/snake-game-screenshot.png"
    },
    {
        id: "void-blocks",
        title: "Void Blocks",
        description: "A single-file cyberpunk Tetris variant with virus spreading mechanics.",
        url: "/games/void-blocks/index.html",
        thumbnail: "/games/void-blocks/screenshot.png"
    }
];

export const getGameById = (id: string): Game | undefined => {
    return games.find(game => game.id === id);
};

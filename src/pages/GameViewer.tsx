import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet-async";

const GameViewer = () => {
    const { gameId } = useParams();

    const games = {
        "snake": {
            title: "Snake Game",
            url: "/games/snake/index.html"
        },
        "void-blocks": {
            title: "Void Blocks",
            url: "/games/void-blocks/index.html"
        }
    };

    const game = games[gameId as keyof typeof games];

    if (!game) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Navigation />
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Game Not Found</h1>
                    <p className="text-gray-600">The game you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Helmet>
                <title>{game.title} | Jeffrey Jose</title>
                <meta name="description" content={`Play ${game.title} - A project by Jeffrey Jose`} />
            </Helmet>
            <Navigation />
            <div className="flex-grow pt-20 flex flex-col">
                <iframe
                    src={game.url}
                    title={game.title}
                    className="w-full flex-grow border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </div>
    );
};

export default GameViewer;

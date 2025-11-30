import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Helmet } from "react-helmet-async";
import { getGameById } from "@/data/games";
import { ArrowLeft } from "lucide-react";

const GameViewer = () => {
    const { gameId } = useParams();
    const game = getGameById(gameId || "");

    if (!game) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                <Navigation />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center p-8">
                        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Game Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">The game you are looking for does not exist.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <Helmet>
                <title>{game.title} | Jeffrey Jose</title>
                <meta name="description" content={`Play ${game.title} - ${game.description}`} />
            </Helmet>
            <Navigation />
            <div className="flex-grow pt-20 flex flex-col relative">
                {/* Game Header / Controls Overlay */}
                <div className="absolute top-24 left-4 z-10 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-lg transition-all border border-white/10"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                </div>

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

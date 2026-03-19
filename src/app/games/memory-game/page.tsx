"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mountain, Rocket, Laptop, Palette, Zap, Flame, Star, Lightbulb, MoveLeft, BoxSelect } from "lucide-react";

interface Card {
  id: number;
  iconType: string;
  flipped: boolean;
  matched: boolean;
}

const ICONS = ["Mountain", "Rocket", "Laptop", "Palette", "Zap", "Flame", "Star", "Lightbulb"];

const getIcon = (type: string, className: string = "w-8 h-8") => {
  switch (type) {
    case "Mountain": return <Mountain className={className} />;
    case "Rocket": return <Rocket className={className} />;
    case "Laptop": return <Laptop className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Star": return <Star className={className} />;
    case "Lightbulb": return <Lightbulb className={className} />;
    default: return <Star className={className} />;
  }
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("memory-game-best");
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (gameOver && (!bestScore || moves < bestScore)) {
      localStorage.setItem("memory-game-best", moves.toString());
      setBestScore(moves);
    }
  }, [gameOver, moves, bestScore]);

  function initializeGame(): void {
    const shuffled = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((iconType, id) => ({
        id,
        iconType,
        flipped: false,
        matched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
  }

  useEffect(() => {
    initializeGame();
  }, []);

  function handleCardClick(cardId: number): void {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].matched) return;

    setCards((prev) =>
      prev.map((c) =>
        c.id === cardId ? { ...c, flipped: true } : c
      )
    );

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.iconType === secondCard.iconType) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          )
        );
        setFlippedCards([]);

        const allMatched = cards.every((c) =>
          c.id === first || c.id === second || c.matched
        );
        if (allMatched) {
          setTimeout(() => setGameOver(true), 500);
        }
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === first || c.id === second ? { ...c, flipped: false } : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Header */}
      <header className="border-b-4 border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-[0_4px_0_0_#2563EB]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-600 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center text-white shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]">
                <BoxSelect className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight dark:text-zinc-50">Memory Game</h1>
                <p className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400">MATCH ALL PAIRS!</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-0 active:translate-x-0 active:shadow-none"
            >
              <MoveLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {moves}
            </div>
            <div className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Moves</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {cards.filter((c) => c.matched).length / 2}
            </div>
            <div className="text-sm md:text-base font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Pairs</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] text-center">
            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {bestScore ?? "-"}
            </div>
            <div className="text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Best</div>
          </div>
        </div>

        {/* Game Grid */}
        {!gameOver ? (
          <div className="grid grid-cols-4 gap-4 sm:gap-6 bg-zinc-100 dark:bg-zinc-800/50 p-6 sm:p-8 border-4 border-zinc-900 dark:border-zinc-100 shadow-[8px_8px_0_0_#2563EB]">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched}
                className={`
                  aspect-square border-4 border-zinc-900 dark:border-zinc-100 flex items-center justify-center
                  transition-all duration-200 cursor-pointer
                  ${card.flipped || card.matched
                    ? "bg-white dark:bg-zinc-800 shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.1)] text-blue-600 dark:text-blue-400"
                    : "bg-blue-600 hover:bg-blue-500 shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa]"
                  }
                  ${flippedCards.includes(card.id) ? "scale-95 translate-y-1 shadow-none" : "hover:-translate-y-1"}
                  ${card.matched ? "opacity-50" : ""}
                `}
              >
                {card.flipped || card.matched ? getIcon(card.iconType, "w-8 h-8 sm:w-12 sm:h-12") : <CardBack />}
              </button>
            ))}
          </div>
        ) : (
          /* Game Over */
          <div className="p-12 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[12px_12px_0_0_#E11D48] text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-rose-500 border-4 border-zinc-900 flex items-center justify-center animate-bounce">
                <Star className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black mb-4 dark:text-zinc-50 uppercase tracking-tight">You Won!</h2>
            <p className="text-xl font-bold text-zinc-600 dark:text-zinc-400 mb-8 border-y-2 border-zinc-200 dark:border-zinc-800 py-4">
              Completed in {moves} moves
              {bestScore && moves === bestScore && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-400 items-center justify-center gap-2">
                  <Star className="w-5 h-5 inline mr-2" />
                  NEW BEST SCORE!
                </span>
              )}
            </p>
            <button
              onClick={initializeGame}
              className="px-8 py-4 bg-emerald-500 text-zinc-900 font-black text-xl border-4 border-zinc-900 shadow-[6px_6px_0_0_#18181b] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#18181b] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 p-8 bg-zinc-100 dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]">
          <h2 className="text-2xl font-black mb-4 dark:text-zinc-50 uppercase">How to Play</h2>
          <ul className="space-y-3 font-bold text-zinc-700 dark:text-zinc-400">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-600"></div> Click a card to flip it</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-rose-600"></div> Try to find matching pairs</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-600"></div> Complete in as few moves as possible</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-amber-600"></div> Your best score is saved locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CardBack() {
  return (
    <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400 to-blue-600 flex flex-col items-center justify-center p-2 opacity-80 gap-1">
      <div className="w-full flex-1 border-2 border-zinc-900/20"></div>
      <div className="w-full flex-1 border-2 border-zinc-900/20"></div>
      <div className="w-full flex-1 border-2 border-zinc-900/20"></div>
    </div>
  );
}

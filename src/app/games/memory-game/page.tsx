"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mountain, Rocket, Laptop, Palette, Zap, Flame, Star, Lightbulb, BoxSelect } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

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
      <PageHeader 
        title="Memory Game" 
        subtitle="MATCH ALL PAIRS!" 
        icon={<BoxSelect className="w-6 h-6" />} 
        iconClass="bg-rose-600 text-white" 
        shadowClass="shadow-[0_4px_0_0_#2563EB]" 
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <NeoBlock noPadding className="p-6 text-center" shadowClass="shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]">
            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {moves}
            </div>
            <div className="text-sm md:text-base font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Moves</div>
          </NeoBlock>
          <NeoBlock noPadding className="p-6 text-center" shadowClass="shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]">
            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {cards.filter((c) => c.matched).length / 2}
            </div>
            <div className="text-sm md:text-base font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">Pairs</div>
          </NeoBlock>
          <NeoBlock noPadding className="p-6 text-center" shadowClass="shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]">
            <div className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {bestScore ?? "-"}
            </div>
            <div className="text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Best</div>
          </NeoBlock>
        </div>

        {/* Game Grid */}
        {!gameOver ? (
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#2563EB]" className="bg-zinc-100 dark:bg-zinc-800/50 p-6 sm:p-8">
            <div className="grid grid-cols-4 gap-4 sm:gap-6">
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
          </NeoBlock>
        ) : (
          /* Game Over */
          <NeoBlock shadowClass="shadow-[12px_12px_0_0_#E11D48]" className="p-12 text-center">
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
            <div className="flex justify-center">
              <NeoButton onClick={initializeGame} variant="success" className="px-8 py-4 text-xl">
                Play Again
              </NeoButton>
            </div>
          </NeoBlock>
        )}

        {/* Instructions */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]" className="mt-12 bg-zinc-100 dark:bg-zinc-900">
          <h2 className="text-2xl font-black mb-4 dark:text-zinc-50 uppercase">How to Play</h2>
          <ul className="space-y-3 font-bold text-zinc-700 dark:text-zinc-400">
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-600"></div> Click a card to flip it</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-rose-600"></div> Try to find matching pairs</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-emerald-600"></div> Complete in as few moves as possible</li>
            <li className="flex items-center gap-3"><div className="w-2 h-2 bg-amber-600"></div> Your best score is saved locally</li>
          </ul>
        </NeoBlock>
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

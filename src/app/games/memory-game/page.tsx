"use client";

import { useState, useEffect } from "react";

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🏔", "🚀", "💻", "🎨", "⚡", "🔥", "🌟", "💡"];

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
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({
        id,
        emoji,
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

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      const firstCard = cards[first];
      const secondCard = cards[second];

      if (firstCard.emoji === secondCard.emoji) {
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
          setFlippedCards([]);
        }, 1000);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Memory Game 🧠</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Match all pairs!</p>
            </div>
            <a
              href="/"
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
            >
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {moves}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Moves</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {cards.filter((c) => c.matched).length / 2}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Pairs Found</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {bestScore ?? "-"}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Best Score</div>
          </div>
        </div>

        {/* Game Grid */}
        {!gameOver ? (
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched || flippedCards.length === 2}
                className={`
                  aspect-square rounded-xl font-bold text-4xl sm:text-5xl
                  transition-all duration-300 cursor-pointer
                  ${card.flipped || card.matched
                    ? "bg-white dark:bg-zinc-700 shadow-md"
                    : "bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  }
                  ${flippedCards.includes(card.id) ? "scale-95" : "hover:scale-102"}
                  ${card.matched ? "opacity-50" : ""}
                `}
              >
                {card.flipped || card.matched ? card.emoji : "?"}
              </button>
            ))}
          </div>
        ) : (
          {/* Game Over */}
          <div className="p-8 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-4 dark:text-white">You Won!</h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-6">
              Completed in {moves} moves
              {bestScore && moves === bestScore && (
                <span className="ml-2 text-yellow-600 dark:text-yellow-400">🏆 New Best!</span>
              )}
            </p>
            <button
              onClick={initializeGame}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-6 bg-white/80 dark:bg-zinc-800/80 rounded-xl">
          <h2 className="font-semibold mb-3 dark:text-white">How to Play</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Click a card to flip it</li>
            <li>• Try to find matching pairs</li>
            <li>• Complete in as few moves as possible</li>
            <li>• Your best score is saved locally</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

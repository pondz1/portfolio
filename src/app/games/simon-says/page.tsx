"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Brain, RotateCcw, Trophy, Zap } from "lucide-react";

type Color = "red" | "blue" | "green" | "yellow";

interface PanelConfig {
  id: Color;
  baseClass: string;
  activeClass: string;
  shadowColor: string;
  label: string;
}

const panels: PanelConfig[] = [
  {
    id: "green",
    baseClass: "bg-emerald-500 dark:bg-emerald-600",
    activeClass: "bg-emerald-300 dark:bg-emerald-400",
    shadowColor: "#10B981",
    label: "Green",
  },
  {
    id: "red",
    baseClass: "bg-red-500 dark:bg-red-600",
    activeClass: "bg-red-300 dark:bg-red-400",
    shadowColor: "#EF4444",
    label: "Red",
  },
  {
    id: "yellow",
    baseClass: "bg-amber-400 dark:bg-amber-500",
    activeClass: "bg-amber-200 dark:bg-amber-300",
    shadowColor: "#F59E0B",
    label: "Yellow",
  },
  {
    id: "blue",
    baseClass: "bg-blue-500 dark:bg-blue-600",
    activeClass: "bg-blue-300 dark:bg-blue-400",
    shadowColor: "#3B82F6",
    label: "Blue",
  },
];

type GameState = "idle" | "showing" | "player-turn" | "game-over";

const TONE_MAP: Record<Color, number> = {
  green: 329.63,
  red: 220.0,
  yellow: 277.18,
  blue: 440.0,
};

function playTone(color: Color) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = TONE_MAP[color];
    osc.type = "sine";
    gain.gain.value = 0.15;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available
  }
}

export default function SimonSaysPage() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [activePanel, setActivePanel] = useState<Color | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [round, setRound] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  const showSequence = useCallback(
    (seq: Color[]) => {
      setGameState("showing");
      setDisabled(true);

      seq.forEach((color, index) => {
        const showTimeout = setTimeout(() => {
          setActivePanel(color);
          playTone(color);
        }, (index + 1) * 600);

        const hideTimeout = setTimeout(() => {
          setActivePanel(null);
        }, (index + 1) * 600 + 400);

        timeoutRef.current.push(showTimeout, hideTimeout);
      });

      const endTimeout = setTimeout(() => {
        setGameState("player-turn");
        setDisabled(false);
      }, (seq.length + 1) * 600);

      timeoutRef.current.push(endTimeout);
    },
    [clearTimeouts]
  );

  const startGame = useCallback(() => {
    clearTimeouts();
    const firstColor = panels[Math.floor(Math.random() * panels.length)].id;
    const newSeq = [firstColor];
    setSequence(newSeq);
    setPlayerIndex(0);
    setScore(0);
    setRound(1);
    setGameState("showing");

    // Small delay before showing
    const delay = setTimeout(() => showSequence(newSeq), 500);
    timeoutRef.current.push(delay);
  }, [clearTimeouts, showSequence]);

  const nextRound = useCallback(
    (prevSeq: Color[]) => {
      const newColor = panels[Math.floor(Math.random() * panels.length)].id;
      const newSeq = [...prevSeq, newColor];
      setSequence(newSeq);
      setPlayerIndex(0);
      setRound((r) => r + 1);
      setGameState("showing");
      setDisabled(true);

      const delay = setTimeout(() => showSequence(newSeq), 600);
      timeoutRef.current.push(delay);
    },
    [showSequence]
  );

  const handlePanelClick = useCallback(
    (color: Color) => {
      if (gameState !== "player-turn" || disabled) return;

      setActivePanel(color);
      playTone(color);

      const flashTimeout = setTimeout(() => setActivePanel(null), 200);
      timeoutRef.current.push(flashTimeout);

      if (color !== sequence[playerIndex]) {
        // Wrong answer
        setGameState("game-over");
        setDisabled(true);
        setHighScore((prev) => Math.max(prev, score));
        return;
      }

      const nextIdx = playerIndex + 1;

      if (nextIdx === sequence.length) {
        // Completed the round
        const newScore = score + sequence.length;
        setScore(newScore);
        setDisabled(true);
        setGameState("showing");

        const delay = setTimeout(() => nextRound(sequence), 800);
        timeoutRef.current.push(delay);
      } else {
        setPlayerIndex(nextIdx);
      }
    },
    [gameState, disabled, sequence, playerIndex, score, nextRound]
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Simon Says"
        subtitle="Memory Pattern Game"
        icon={<Brain className="w-5 h-5" />}
        iconClass="bg-violet-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#7C3AED]"
      />

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        {/* Score Bar */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#7C3AED]" className="mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Score</div>
              <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">{score}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Round</div>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{round}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">Best</div>
              <div className="text-3xl font-black text-amber-500">{highScore}</div>
            </div>
          </div>
        </NeoBlock>

        {/* Game Board */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {panels.map((panel) => {
              const isActive = activePanel === panel.id;
              const canClick = gameState === "player-turn" && !disabled;

              return (
                <button
                  key={panel.id}
                  onClick={() => handlePanelClick(panel.id)}
                  disabled={!canClick}
                  className={`
                    aspect-square border-4 border-zinc-900 dark:border-zinc-100
                    transition-all duration-150 cursor-pointer
                    ${isActive ? panel.activeClass : panel.baseClass}
                    ${canClick ? "hover:-translate-y-1 hover:translate-x-1 active:translate-y-1 active:translate-x-1 active:shadow-none" : ""}
                    ${
                      isActive
                        ? `shadow-[0_0_0_0_#000] scale-105`
                        : `shadow-[6px_6px_0_0_${panel.shadowColor}]`
                    }
                  `}
                  aria-label={`${panel.label} panel`}
                >
                  <span className="sr-only">{panel.label}</span>
                </button>
              );
            })}
          </div>

          {/* Status */}
          <div className="mt-6 text-center">
            {gameState === "idle" && (
              <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">
                Press Start to play
              </p>
            )}
            {gameState === "showing" && (
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  Watch the pattern...
                </p>
              </div>
            )}
            {gameState === "player-turn" && (
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                Your turn — repeat the sequence
              </p>
            )}
            {gameState === "game-over" && (
              <div className="space-y-2">
                <p className="text-xl font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">
                  Game Over
                </p>
                <p className="text-base font-bold text-zinc-600 dark:text-zinc-400">
                  You reached round {round} with {score} points
                </p>
              </div>
            )}
          </div>
        </NeoBlock>

        {/* Controls */}
        <div className="flex gap-4 justify-center">
          {(gameState === "idle" || gameState === "game-over") && (
            <NeoButton onClick={startGame} variant="primary">
              <Brain className="w-5 h-5" />
              {gameState === "idle" ? "Start Game" : "Play Again"}
            </NeoButton>
          )}
          {gameState !== "idle" && (
            <NeoButton onClick={startGame} variant="danger">
              <RotateCcw className="w-5 h-5" />
              Reset
            </NeoButton>
          )}
        </div>

        {/* How to Play */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#2563EB] mt-8" className="noPadding">
          <div className="border-b-4 border-zinc-900 dark:border-zinc-100 p-4 md:p-6">
            <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              How to Play
            </h2>
          </div>
          <div className="p-4 md:p-6 space-y-3">
            <p className="font-bold text-zinc-700 dark:text-zinc-300">
              1. Watch the colored panels flash in sequence
            </p>
            <p className="font-bold text-zinc-700 dark:text-zinc-300">
              2. Repeat the pattern by clicking the panels in the same order
            </p>
            <p className="font-bold text-zinc-700 dark:text-zinc-300">
              3. Each round adds one more step to the sequence
            </p>
            <p className="font-bold text-zinc-700 dark:text-zinc-300">
              4. One wrong click ends the game — how far can you go?
            </p>
          </div>
        </NeoBlock>
      </main>
    </div>
  );
}

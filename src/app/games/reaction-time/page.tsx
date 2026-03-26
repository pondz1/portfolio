"use client";

import { useState, useRef, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Zap, Trophy, RotateCcw, Timer, TrendingUp } from "lucide-react";

type GameState = "idle" | "waiting" | "ready" | "result" | "too-early";

export default function ReactionTime() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = useCallback(() => {
    setGameState("waiting");
    const delay = Math.random() * 4000 + 1500; // 1.5s - 5.5s
    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (gameState === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState("too-early");
    } else if (gameState === "ready") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setAttempts((prev) => [...prev, time]);
      if (bestTime === null || time < bestTime) {
        setBestTime(time);
      }
      setGameState("result");
    }
  }, [gameState, bestTime]);

  const resetGame = useCallback(() => {
    setGameState("idle");
    setReactionTime(0);
    setAttempts([]);
    setBestTime(null);
  }, []);

  const avgTime =
    attempts.length > 0
      ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
      : null;

  const getRating = (ms: number) => {
    if (ms < 200) return { label: "INSANE", color: "text-purple-600" };
    if (ms < 250) return { label: "FAST", color: "text-emerald-600" };
    if (ms < 350) return { label: "AVERAGE", color: "text-amber-600" };
    return { label: "SLOW", color: "text-rose-600" };
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Reaction Time"
        subtitle="Test your reflexes"
        icon={<Zap className="w-5 h-5" />}
        iconClass="bg-amber-400 text-zinc-900"
        shadowClass="shadow-[0_4px_0_0_#F59E0B]"
        backLink="/games"
        backText="Games"
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#3B82F6]" className="p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Best</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {bestTime !== null ? `${bestTime}ms` : "--"}
            </p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#10B981]" className="p-4 text-center">
            <Timer className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Average</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {avgTime !== null ? `${avgTime}ms` : "--"}
            </p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#A855F7]" className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Attempts</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{attempts.length}</p>
          </NeoBlock>
        </div>

        {/* Game Area */}
        <NeoBlock
          shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]"
          className="mb-6 overflow-hidden"
        >
          <div
            onClick={gameState === "idle" || gameState === "result" || gameState === "too-early" ? undefined : handleClick}
            className={`relative flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
              gameState === "idle" || gameState === "result" || gameState === "too-early"
                ? ""
                : "select-none"
            }`}
            style={{ minHeight: "280px" }}
          >
            {gameState === "idle" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 border-4 border-amber-400 bg-amber-400/20 flex items-center justify-center shadow-[4px_4px_0_0_#F59E0B]">
                  <Zap className="w-10 h-10 text-amber-600" />
                </div>
                <p className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 text-center">
                  Click Start to Begin
                </p>
                <NeoButton onClick={startGame} variant="primary">
                  <Zap className="w-5 h-5" />
                  Start
                </NeoButton>
              </div>
            )}

            {gameState === "waiting" && (
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 border-4 border-rose-500 bg-rose-500/20 flex items-center justify-center shadow-[4px_4px_0_0_#EF4444]">
                  <Timer className="w-10 h-10 text-rose-600 animate-pulse" />
                </div>
                <p className="text-xl font-black uppercase text-rose-600 text-center">
                  Wait for Green...
                </p>
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  Don&apos;t click yet!
                </p>
              </div>
            )}

            {gameState === "ready" && (
              <div className="flex flex-col items-center gap-3 bg-emerald-500/10 w-full" style={{ minHeight: "280px", justifyContent: "center" }}>
                <div className="w-20 h-20 border-4 border-emerald-500 bg-emerald-500 flex items-center justify-center shadow-[4px_4px_0_0_#10B981]">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <p className="text-2xl font-black uppercase text-emerald-600 text-center">
                  Click NOW!
                </p>
              </div>
            )}

            {gameState === "result" && (
              <div className="flex flex-col items-center gap-4">
                <p className="text-6xl font-black text-zinc-900 dark:text-zinc-50">
                  {reactionTime}<span className="text-2xl text-zinc-500 dark:text-zinc-400">ms</span>
                </p>
                <p className={`text-xl font-black uppercase ${getRating(reactionTime).color}`}>
                  {getRating(reactionTime).label}
                </p>
                <div className="flex gap-3 mt-2">
                  <NeoButton onClick={startGame} variant="primary">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </NeoButton>
                  <NeoButton onClick={resetGame} variant="secondary">
                    Reset
                  </NeoButton>
                </div>
              </div>
            )}

            {gameState === "too-early" && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 border-4 border-rose-500 bg-rose-500 flex items-center justify-center shadow-[4px_4px_0_0_#EF4444]">
                  <span className="text-4xl font-black text-white">!</span>
                </div>
                <p className="text-xl font-black uppercase text-rose-600 text-center">
                  Too Early!
                </p>
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  Wait for the green signal
                </p>
                <NeoButton onClick={startGame} variant="danger">
                  <RotateCcw className="w-4 h-4" />
                  Try Again
                </NeoButton>
              </div>
            )}
          </div>
        </NeoBlock>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <NeoBlock
            shadowClass="shadow-[6px_6px_0_0_#A855F7]"
            className="p-6"
          >
            <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Recent Attempts
            </h2>
            <div className="flex flex-wrap gap-2">
              {attempts.slice(-10).map((t, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 border-2 border-zinc-900 dark:border-zinc-100 font-black text-sm ${
                    t === bestTime
                      ? "bg-amber-400 text-zinc-900 shadow-[2px_2px_0_0_#18181b]"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {t}ms
                </span>
              ))}
            </div>
          </NeoBlock>
        )}
      </main>
    </div>
  );
}

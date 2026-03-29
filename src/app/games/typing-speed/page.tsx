"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Keyboard, Trophy, RotateCcw, Timer, Target, TrendingUp } from "lucide-react";

const sentences = [
  "The quick brown fox jumps over the lazy dog near the riverbank.",
  "Programming is the art of telling another human what one wants the computer to do.",
  "Every great developer you know got there by solving problems they were unqualified to solve.",
  "Code is like humor. When you have to explain it, it is bad and hard to understand.",
  "First solve the problem, then write the code to implement your solution properly.",
  "Simplicity is the soul of efficiency in software engineering and design.",
  "The best error message is the one that never shows up on the screen at all.",
  "Any fool can write code that a computer can understand but good programmers write for humans.",
  "Experience is the name everyone gives to their mistakes while learning to build things.",
  "Walking on water and developing software from a specification are both easy if they are frozen.",
  "Measuring programming progress by lines of code is like measuring aircraft building by weight.",
  "The most disastrous thing you can learn is your first programming language well enough.",
  "Java is to JavaScript what car is to carpet despite the similarity in their names.",
  "A language that does not affect the way you think about programming is not worth knowing.",
  "Talk is cheap so show me the code and let the implementation speak for itself clearly.",
];

type GameState = "idle" | "playing" | "done";

export default function TypingSpeed() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [currentSentence, setCurrentSentence] = useState("");
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsed, setElapsed] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [usedSentences, setUsedSentences] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const pickSentence = useCallback(() => {
    if (usedSentences.size >= sentences.length) {
      setUsedSentences(new Set());
    }
    let idx: number;
    do {
      idx = Math.floor(Math.random() * sentences.length);
    } while (usedSentences.has(idx));
    setUsedSentences((prev) => new Set(prev).add(idx));
    return sentences[idx];
  }, [usedSentences]);

  const startGame = useCallback(() => {
    const sentence = pickSentence();
    setCurrentSentence(sentence);
    setTyped("");
    setStartTime(Date.now());
    setElapsed(0);
    setWpm(0);
    setAccuracy(100);
    setGameState("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [pickSentence]);

  useEffect(() => {
    if (gameState === "playing") {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, startTime]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (gameState !== "playing") return;
      const value = e.target.value;
      setTyped(value);

      // Calculate live accuracy
      let correct = 0;
      for (let i = 0; i < value.length; i++) {
        if (value[i] === currentSentence[i]) correct++;
      }
      setAccuracy(value.length > 0 ? Math.round((correct / value.length) * 100) : 100);

      // Check if completed
      if (value.length >= currentSentence.length) {
        const finalTime = (Date.now() - startTime) / 1000;
        const wordCount = currentSentence.split(" ").length;
        const calculatedWpm = Math.round((wordCount / finalTime) * 60);
        setWpm(calculatedWpm);
        setElapsed(Date.now() - startTime);
        setGameState("done");
        if (timerRef.current) clearInterval(timerRef.current);

        if (bestWpm === null || calculatedWpm > bestWpm) {
          setBestWpm(calculatedWpm);
        }
        setHistory((prev) => [...prev, calculatedWpm]);
      }
    },
    [gameState, currentSentence, startTime, bestWpm]
  );

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const decimal = Math.floor((ms % 1000) / 100);
    return `${seconds}.${decimal}s`;
  };

  const resetAll = () => {
    setGameState("idle");
    setCurrentSentence("");
    setTyped("");
    setWpm(0);
    setAccuracy(100);
    setElapsed(0);
    setHistory([]);
    setBestWpm(null);
    setUsedSentences(new Set());
  };

  const avgWpm =
    history.length > 0
      ? Math.round(history.reduce((a, b) => a + b, 0) / history.length)
      : null;

  const getWpmRating = (w: number) => {
    if (w >= 80) return { label: "LEGENDARY", color: "text-purple-600" };
    if (w >= 60) return { label: "FAST", color: "text-emerald-600" };
    if (w >= 40) return { label: "AVERAGE", color: "text-amber-600" };
    return { label: "SLOW", color: "text-rose-600" };
  };

  // Render characters with color coding
  const renderSentence = () => {
    const chars = currentSentence.split("");
    return chars.map((char, i) => {
      let className = "text-zinc-400 dark:text-zinc-500";
      if (i < typed.length) {
        className =
          typed[i] === char
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30";
      } else if (i === typed.length) {
        className =
          "text-zinc-900 dark:text-zinc-50 border-b-4 border-blue-600 dark:border-blue-400 animate-pulse";
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Typing Speed"
        subtitle="How fast can you type?"
        icon={<Keyboard className="w-5 h-5" />}
        iconClass="bg-emerald-500 text-white"
        shadowClass="shadow-[0_4px_0_0_#10B981]"
        backLink="/games"
        backText="Games"
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#10B981]" className="p-4 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Best WPM</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {bestWpm !== null ? bestWpm : "--"}
            </p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#3B82F6]" className="p-4 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Avg WPM</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {avgWpm !== null ? avgWpm : "--"}
            </p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#A855F7]" className="p-4 text-center">
            <Target className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Rounds</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{history.length}</p>
          </NeoBlock>
        </div>

        {/* Game Area */}
        <NeoBlock
          shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]"
          className="mb-6"
        >
          {gameState === "idle" && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="w-20 h-20 border-4 border-emerald-500 bg-emerald-500/20 flex items-center justify-center shadow-[4px_4px_0_0_#10B981]">
                <Keyboard className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 text-center">
                Type the sentence as fast as you can
              </p>
              <NeoButton onClick={startGame} variant="success" className="py-4 px-8 text-lg">
                <Keyboard className="w-5 h-5" />
                Start Typing
              </NeoButton>
            </div>
          )}

          {gameState === "playing" && (
            <div className="p-6 md:p-8">
              {/* Timer + Live Stats */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
                  <Timer className="w-4 h-4" />
                  {formatTime(elapsed)}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                    Accuracy: <span className={`font-black ${accuracy >= 95 ? "text-emerald-600" : accuracy >= 80 ? "text-amber-600" : "text-rose-600"}`}>{accuracy}%</span>
                  </span>
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                    {Math.round((typed.length / 5) / (elapsed / 60000 || 1))} WPM
                  </span>
                </div>
              </div>

              {/* Sentence Display */}
              <div className="bg-zinc-100 dark:bg-zinc-800 border-4 border-zinc-900 dark:border-zinc-100 p-6 mb-4">
                <p className="text-lg md:text-xl font-mono leading-relaxed tracking-wide">
                  {renderSentence()}
                </p>
              </div>

              {/* Hidden input that stays focused */}
              <input
                ref={inputRef}
                type="text"
                value={typed}
                onChange={handleInput}
                className="w-full p-4 border-4 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 font-mono text-lg text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa]"
                placeholder="Start typing here..."
                autoFocus
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {/* Progress Bar */}
              <div className="mt-4 h-3 bg-zinc-200 dark:bg-zinc-700 border-2 border-zinc-900 dark:border-zinc-100">
                <div
                  className="h-full bg-emerald-500 transition-all duration-150"
                  style={{ width: `${Math.min((typed.length / currentSentence.length) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {gameState === "done" && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="text-center">
                <p className="text-6xl font-black text-zinc-900 dark:text-zinc-50">
                  {wpm}
                  <span className="text-2xl text-zinc-500 dark:text-zinc-400 ml-2">WPM</span>
                </p>
                <p className={`text-xl font-black uppercase mt-2 ${getWpmRating(wpm).color}`}>
                  {getWpmRating(wpm).label}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <NeoBlock shadowClass="shadow-[3px_3px_0_0_#10B981]" className="p-3 text-center">
                  <p className="text-xs font-bold text-zinc-500 uppercase">Time</p>
                  <p className="text-lg font-black">{formatTime(elapsed)}</p>
                </NeoBlock>
                <NeoBlock shadowClass="shadow-[3px_3px_0_0_#3B82F6]" className="p-3 text-center">
                  <p className="text-xs font-bold text-zinc-500 uppercase">Accuracy</p>
                  <p className={`text-lg font-black ${accuracy >= 95 ? "text-emerald-600" : accuracy >= 80 ? "text-amber-600" : "text-rose-600"}`}>
                    {accuracy}%
                  </p>
                </NeoBlock>
              </div>

              <div className="flex gap-3">
                <NeoButton onClick={startGame} variant="primary">
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </NeoButton>
                <NeoButton onClick={resetAll} variant="secondary">
                  Reset All
                </NeoButton>
              </div>
            </div>
          )}
        </NeoBlock>

        {/* History */}
        {history.length > 0 && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#A855F7]" className="p-6">
            <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Round History
            </h2>
            <div className="flex flex-wrap gap-2">
              {history.map((w, i) => (
                <span
                  key={i}
                  className={`px-3 py-1 border-2 border-zinc-900 dark:border-zinc-100 font-black text-sm ${
                    w === bestWpm
                      ? "bg-emerald-400 text-zinc-900 shadow-[2px_2px_0_0_#18181b]"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {w} WPM
                </span>
              ))}
            </div>
          </NeoBlock>
        )}
      </main>
    </div>
  );
}

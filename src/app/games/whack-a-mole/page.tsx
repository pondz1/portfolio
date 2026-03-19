"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Trophy, Hammer, RotateCcw, Circle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

export default function WhackAMole() {
  const [moles, setMoles] = useState<boolean[]>(new Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [whackedHole, setWhackedHole] = useState<number | null>(null);

  const moleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomHole = useCallback(() => {
    let newHole;
    do {
      newHole = Math.floor(Math.random() * 9);
    } while (moles[newHole]);
    return newHole;
  }, [moles]);

  const showMole = useCallback(() => {
    const newMoles = new Array(9).fill(false);
    const hole = Math.floor(Math.random() * 9);
    newMoles[hole] = true;
    setMoles(newMoles);
  }, []);

  const startGame = useCallback(() => {
    setMoles(new Array(9).fill(false));
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setWhackedHole(null);

    if (moleIntervalRef.current) clearInterval(moleIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    moleIntervalRef.current = setInterval(showMole, 800);
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false);
          if (moleIntervalRef.current) clearInterval(moleIntervalRef.current);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    showMole();
  }, [showMole]);

  const whackMole = useCallback((e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    if (!gameActive || !moles[index]) return;

    setMoles((prev) => {
      const newMoles = [...prev];
      newMoles[index] = false;
      return newMoles;
    });

    setScore((prev) => {
      const newScore = prev + 10;
      if (newScore > highScore) setHighScore(newScore);
      return newScore;
    });

    setWhackedHole(index);
    setTimeout(() => setWhackedHole(null), 200);
  }, [gameActive, moles, highScore]);

  useEffect(() => {
    return () => {
      if (moleIntervalRef.current) clearInterval(moleIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <PageHeader 
        title="Whack-a-Mole" 
        subtitle="SMASH THE MOLES" 
        icon={<Hammer className="w-5 h-5" />} 
        iconClass="bg-rose-600 text-white" 
        shadowClass="shadow-[0_4px_0_0_#DC2626]" 
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Board */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#DC2626]" className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-black text-rose-600">{score}</div>
            <div className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1">SCORE</div>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#F59E0B]" className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-black text-amber-500">{timeLeft}</div>
            <div className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1">TIME LEFT</div>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#8B5CF6]" className="p-4 text-center">
            <div className="text-3xl md:text-4xl font-black text-purple-500">{highScore}</div>
            <div className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400 mt-1">HIGH SCORE</div>
          </NeoBlock>
        </div>

        {/* Game Grid */}
        <NeoBlock shadowClass="shadow-[12px_12px_0_0_#92400E]" className="bg-amber-100 dark:bg-zinc-900 p-6 md:p-8 mb-8 h-[400px] flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 md:gap-6 w-full h-full">
            {moles.map((hasMole, index) => (
               <button
                key={index}
                onClick={(e) => whackMole(e, index)}
                disabled={!gameActive || !hasMole}
                 className={`
                  border-4 border-zinc-800 dark:border-zinc-600 
                  flex items-center justify-center
                  transition-all duration-100 cursor-pointer
                  touch-manipulation
                  ${hasMole
                     ? 'bg-amber-800 hover:bg-rose-600 text-amber-100 hover:scale-95 active:scale-90'
                    : 'bg-amber-200 dark:bg-zinc-800 shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.2)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.1)]'
                  }
                  ${whackedHole === index ? 'bg-rose-600!' : ''}
                   disabled:cursor-not-allowed
                `}
               >
                {hasMole && <Circle className="w-16 h-16 md:w-20 md:h-20 fill-current" />}
                {whackedHole === index && !hasMole && (
                  <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_0_4px_#000]"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </NeoBlock>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
           <NeoButton
            onClick={startGame}
            disabled={gameActive}
            className="py-3 md:py-4 text-lg md:text-xl flex items-center gap-3 bg-rose-600 text-white px-6 md:px-8"
          >
            {gameActive ? (
              <>
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                Playing...
              </>
            ) : (
              <>
                <Hammer className="w-5 h-5 md:w-6 md:h-6" />
                Start Game
              </>
            )}
           </NeoButton>
        </div>

        {/* Game Over Message */}
        {!gameActive && score > 0 && (
          <div className="mb-8 text-center">
             <NeoBlock shadowClass="shadow-[8px_8px_0_0_#DC2626]" className="inline-block p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-black uppercase text-zinc-900 dark:text-zinc-50 mb-2">
                Game Over!
              </h2>
              <p className="text-lg md:text-xl font-bold text-zinc-600 dark:text-zinc-400 mb-4">
                Final Score: <span className="text-rose-600">{score}</span>
              </p>
              {score >= highScore && score > 0 && (
                <div className="flex items-center justify-center gap-2 text-amber-500 font-black">
                   <Trophy className="w-6 h-6" />
                  New High Score!
                </div>
              )}
             </NeoBlock>
          </div>
        )}

        {/* Instructions */}
         <NeoBlock shadowClass="shadow-[8px_8px_0_0_#4B5563]" className="p-6">
           <h3 className="text-lg md:text-xl font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4">
            How to Play
          </h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300 font-bold">
            <li className="flex items-start gap-2">
               <span className="text-rose-600">•</span>
              Click or tap circles when they appear
            </li>
            <li className="flex items-start gap-2">
               <span className="text-rose-600">•</span>
              Each whack gives you 10 points
             </li>
             <li className="flex items-start gap-2">
               <span className="text-rose-600">•</span>
              You have 30 seconds to score as much as possible
            </li>
            <li className="flex items-start gap-2">
               <span className="text-rose-600">•</span>
              Beat your high score to earn the trophy!
            </li>
          </ul>
        </NeoBlock>
      </div>
    </div>
  );
}

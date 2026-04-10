"use client";

import { useState, useCallback, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { RotateCcw, Trophy, XCircle, Skull, Settings2, CheckCircle2 } from "lucide-react";

type Category = "Animals" | "Countries" | "Food" | "Technology" | "Sports";
type Difficulty = "easy" | "medium" | "hard";

const WORDS: Record<Category, Record<Difficulty, string[]>> = {
  Animals: {
    easy: ["ELEPHANT", "GIRAFFE", "PENGUIN", "DOLPHIN", "KANGAROO", "CROCODILE", "FLAMINGO", "BUTTERFLY", "HEDGEHOG", "TORTOISE", "CHAMELEON", "PANGOLIN", "PLATYPUS"],
    medium: ["MONKEY", "PARROT", "FALCON", "BADGER", "IGUANA", "OSPREY", "BISON", "OTTER", "RAVEN", "VIPER", "GECKO", "FINCH"],
    hard: ["CAT", "DOG", "OWL", "FOX", "YAK", "EMU", "RAY", "COD", "EEL", "ANT", "BEE"],
  },
  Countries: {
    easy: ["AUSTRALIA", "ARGENTINA", "INDONESIA", "MONGOLIA", "PHILIPPINES", "VENEZUELA", "MOZAMBIQUE", "KAZAKHSTAN", "PORTUGAL", "COLOMBIA"],
    medium: ["BRAZIL", "JAPAN", "SPAIN", "CHILE", "NEPAL", "SWEDEN", "KENYA", "ITALY", "QATAR", "FIJI", "CUBA", "IRAN"],
    hard: ["USA", "UK", "LAOS", "TOGO", "CHAD", "PERU", "OMAN", "IRAQ", "MALI", "NIUE"],
  },
  Food: {
    easy: ["SPAGHETTI", "CHOCOLATE", "CROISSANT", "BLUEBERRY", "PINEAPPLE", "AVOCADO", "CINNAMON", "PEPPERONI", "MACARONI", "GUACAMOLE"],
    medium: ["PASTA", "SUSHI", "STEAK", "BAGEL", "CURRY", "CREPE", "MANGO", "PEACH", "OLIVE", "TACO", "BACON", "PRAWN"],
    hard: ["PIE", "HAM", "EGG", "FIG", "SOY", "OAT", "JAM", "YAM", "TEA", "RUM"],
  },
  Technology: {
    easy: ["ALGORITHM", "DATABASE", "BLUETOOTH", "KEYBOARD", "PROCESSOR", "INTERNET", "COMPILER", "FRAMEWORK", "MICROCHIP", "BANDWIDTH"],
    medium: ["PYTHON", "DOCKER", "KERNEL", "ROUTER", "SERVER", "BUFFER", "CURSOR", "SOCKET", "SYNTAX", "BITMAP", "KERNEL", "RENDER"],
    hard: ["API", "CSS", "GIT", "RAM", "VPN", "CPU", "SQL", "USB", "XML", "DNS", "SSH", "APP"],
  },
  Sports: {
    easy: ["BASKETBALL", "SWIMMING", "VOLLEYBALL", "BADMINTON", "SNOWBOARD", "GYMNASTIC", "BOWLING", "MARATHON", "WRESTLING", "LACROSSE"],
    medium: ["SOCCER", "TENNIS", "HOCKEY", "BOXING", "FENCING", "KARATE", "POLO", "RUGBY", "DIVING", "ROWING", "SKING", "GOLF"],
    hard: ["JUDO", "SUMO", "POLO", "DART", "GOLF", "SURF", "BIKE", "YOGA", "CLIMB", "KAYAK"],
  },
};

const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const CATEGORIES: Category[] = ["Animals", "Countries", "Food", "Technology", "Sports"];
const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy (8+ letters)" },
  { value: "medium", label: "Medium (5-7 letters)" },
  { value: "hard", label: "Hard (3-4 letters)" },
];

function getWord(category: Category, difficulty: Difficulty): string {
  const pool = WORDS[category][difficulty];
  return pool[Math.floor(Math.random() * pool.length)];
}

function HangmanFigure({ wrongGuesses }: { wrongGuesses: number }) {
  const parts = [
    // Head
    wrongGuesses >= 1 && (
      <div key="head" className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 border-4 border-zinc-900 dark:border-zinc-100" />
    ),
    // Body
    wrongGuesses >= 2 && (
      <div key="body" className="absolute top-12 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-zinc-900 dark:bg-zinc-100" />
    ),
    // Left arm
    wrongGuesses >= 3 && (
      <div key="larm" className="absolute top-16 left-1/2 -translate-x-8 w-8 h-0.5 bg-zinc-900 dark:bg-zinc-100 -rotate-45 origin-right" />
    ),
    // Right arm
    wrongGuesses >= 4 && (
      <div key="rarm" className="absolute top-16 left-1/2 w-8 h-0.5 bg-zinc-900 dark:bg-zinc-100 rotate-45 origin-left" />
    ),
    // Left leg
    wrongGuesses >= 5 && (
      <div key="lleg" className="absolute top-28 left-1/2 -translate-x-8 w-8 h-0.5 bg-zinc-900 dark:bg-zinc-100 rotate-45 origin-right" />
    ),
    // Right leg
    wrongGuesses >= 6 && (
      <div key="rleg" className="absolute top-28 left-1/2 w-8 h-0.5 bg-zinc-900 dark:bg-zinc-100 -rotate-45 origin-left" />
    ),
  ].filter(Boolean);

  return (
    <div className="relative w-32 h-36 border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
      {/* Gallows */}
      <div className="absolute top-0 left-2 bottom-0 w-0.5 bg-zinc-400 dark:bg-zinc-600" />
      <div className="absolute top-2 left-2 right-0 h-0.5 bg-zinc-400 dark:bg-zinc-600" />
      <div className="absolute top-2 left-1/2 w-0.5 h-0.5 bg-zinc-400 dark:bg-zinc-600 -translate-x-1/2" />
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-zinc-400 dark:bg-zinc-600" />
      {parts}
    </div>
  );
}

export default function HangmanGame() {
  const [category, setCategory] = useState<Category>("Animals");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [word, setWord] = useState(() => getWord("Animals", "medium"));
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  const wrongGuesses = [...guessedLetters].filter((l) => !word.includes(l)).length;
  const correctLetters = [...guessedLetters].filter((l) => word.includes(l));
  const isWin = word.split("").every((l) => guessedLetters.has(l));
  const isLoss = wrongGuesses >= 6;

  useEffect(() => {
    if (isWin && !gameOver) {
      setGameOver(true);
      setWon(true);
      setWins((w) => w + 1);
    }
    if (isLoss && !gameOver) {
      setGameOver(true);
      setWon(false);
      setLosses((l) => l + 1);
    }
  }, [isWin, isLoss, gameOver]);

  const startNewGame = useCallback(() => {
    const newWord = getWord(category, difficulty);
    setWord(newWord);
    setGuessedLetters(new Set());
    setGameOver(false);
    setWon(false);
    setShowSettings(false);
  }, [category, difficulty]);

  const handleGuess = useCallback(
    (letter: string) => {
      if (gameOver || guessedLetters.has(letter)) return;
      setGuessedLetters((prev) => new Set(prev).add(letter));
    },
    [gameOver, guessedLetters]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleGuess]);

  const getLetterClass = (letter: string) => {
    if (!guessedLetters.has(letter)) {
      return "bg-white dark:bg-zinc-800 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-50 hover:bg-blue-100 dark:hover:bg-zinc-700 cursor-pointer";
    }
    if (word.includes(letter)) {
      return "bg-emerald-500 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-50 cursor-default";
    }
    return "bg-rose-400 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-50 cursor-default opacity-60";
  };

  const handleShareResult = () => {
    const text = `Hangman ${won ? "WIN" : "LOSS"} | Word: ${word} | Category: ${category} | Difficulty: ${difficulty} | Score: ${wins}W/${losses}L`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Hangman"
        subtitle="Guess the word before the stick figure is complete"
        icon={<Skull className="w-5 h-5" />}
        iconClass="bg-rose-500 text-white"
        shadowClass="shadow-[0_4px_0_0_#E11D48]"
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <NeoBlock noPadding className="px-4 py-2 flex items-center gap-2 border-2">
              <Trophy className="w-5 h-5 text-emerald-500" />
              <span className="font-black text-sm uppercase">{wins} W</span>
            </NeoBlock>
            <NeoBlock noPadding className="px-4 py-2 flex items-center gap-2 border-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <span className="font-black text-sm uppercase">{losses} L</span>
            </NeoBlock>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShareResult}
              className="px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-bold text-sm uppercase shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#18181b] dark:hover:shadow-[5px_5px_0_0_#fafafa] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              {copied ? "Copied!" : "Share"}
            </button>
            <NeoButton onClick={startNewGame} variant="success" className="py-2 px-4 text-sm">
              <RotateCcw className="w-4 h-4" />
              New Game
            </NeoButton>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#F59E0B]" className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-lg uppercase">Game Settings</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-sm uppercase text-zinc-600 dark:text-zinc-400 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 font-bold text-sm uppercase transition-all cursor-pointer ${
                        category === cat
                          ? "bg-amber-400 text-zinc-900 shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa]"
                          : "bg-white dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold text-sm uppercase text-zinc-600 dark:text-zinc-400 mb-2">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => setDifficulty(d.value)}
                      className={`px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 font-bold text-sm uppercase transition-all cursor-pointer ${
                        difficulty === d.value
                          ? "bg-blue-600 text-white shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa]"
                          : "bg-white dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="font-bold text-sm text-zinc-600 dark:text-zinc-400">
                {category} / {difficulty.toUpperCase()}
              </span>
            </div>
          </NeoBlock>
        )}

        {/* Settings Toggle */}
        {!showSettings && (
          <button
            onClick={() => setShowSettings(true)}
            className="mb-6 flex items-center gap-2 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-bold text-sm uppercase text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 shadow-[3px_3px_0_0_#18181b] dark:shadow-[3px_3px_0_0_#fafafa] hover:-translate-y-1 hover:shadow-[5px_5px_0_0_#18181b] dark:hover:shadow-[5px_5px_0_0_#fafafa] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <Settings2 className="w-4 h-4" />
            Category: {category} / {difficulty.toUpperCase()}
          </button>
        )}

        {/* Game Area */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#2563EB]" className="mb-6">
          {/* Hangman Figure + Wrong Guess Counter */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <HangmanFigure wrongGuesses={wrongGuesses} />
            <div className="flex items-center gap-2">
              <span className="font-black text-sm uppercase text-zinc-600 dark:text-zinc-400">Wrong: </span>
              <span className={`font-black text-lg ${wrongGuesses >= 4 ? "text-rose-500" : wrongGuesses >= 2 ? "text-amber-500" : "text-emerald-500"}`}>
                {wrongGuesses} / 6
              </span>
            </div>
          </div>

          {/* Word Display */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {word.split("").map((letter, idx) => {
              const revealed = guessedLetters.has(letter) || (gameOver && !won);
              return (
                <div
                  key={idx}
                  className={`w-10 h-12 md:w-12 md:h-14 border-b-4 flex items-center justify-center font-black text-xl md:text-2xl uppercase transition-all ${
                    revealed
                      ? word.includes(letter) || !won
                        ? "border-emerald-500 text-zinc-900 dark:text-zinc-50"
                        : "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-50"
                      : "border-zinc-900 dark:border-zinc-100 text-transparent"
                  } ${!won && revealed && !word.includes(letter) ? "border-rose-500 text-rose-500" : ""}`}
                >
                  {revealed ? letter : ""}
                </div>
              );
            })}
          </div>

          {/* Game Over Message */}
          {gameOver && (
            <div className={`text-center mb-6 p-4 border-2 ${won ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-rose-500 bg-rose-50 dark:bg-rose-950/30"}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {won ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <span className="font-black text-lg uppercase text-emerald-600 dark:text-emerald-400">You Won!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-rose-500" />
                    <span className="font-black text-lg uppercase text-rose-600 dark:text-rose-400">Game Over</span>
                  </>
                )}
              </div>
              {!won && (
                <p className="text-zinc-600 dark:text-zinc-400 font-bold">
                  The word was: <span className="text-zinc-900 dark:text-zinc-50 uppercase">{word}</span>
                </p>
              )}
            </div>
          )}
        </NeoBlock>

        {/* Keyboard */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#8B5CF6]" className="overflow-x-auto">
          <div className="flex flex-col items-center gap-2">
            {KEYBOARD_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1.5">
                {row.split("").map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={gameOver || guessedLetters.has(letter)}
                    className={`w-8 h-10 md:w-10 md:h-12 border-2 border-zinc-900 dark:border-zinc-100 font-black text-sm md:text-base uppercase flex items-center justify-center transition-all duration-200 ${
                      getLetterClass(letter)
                    } ${!guessedLetters.has(letter) && !gameOver ? "hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-1 active:shadow-none" : ""}`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-bold text-zinc-400 dark:text-zinc-600 mt-4 uppercase">
            Use keyboard or click letters to guess
          </p>
        </NeoBlock>
      </main>
    </div>
  );
}

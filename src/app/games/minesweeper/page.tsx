"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Bomb, Flag, RotateCcw, Trophy, Timer as TimerIcon } from "lucide-react";

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; mines: number; label: string }> = {
  easy: { rows: 9, cols: 9, mines: 10, label: "Easy" },
  medium: { rows: 12, cols: 12, mines: 30, label: "Medium" },
  hard: { rows: 16, cols: 16, mines: 50, label: "Hard" },
};

const ADJACENT_COLORS: Record<number, string> = {
  1: "text-blue-600 dark:text-blue-400",
  2: "text-emerald-600 dark:text-emerald-400",
  3: "text-rose-600 dark:text-rose-400",
  4: "text-purple-600 dark:text-purple-400",
  5: "text-amber-600 dark:text-amber-400",
  6: "text-cyan-600 dark:text-cyan-400",
  7: "text-zinc-900 dark:text-zinc-200",
  8: "text-zinc-600 dark:text-zinc-400",
};

function createBoard(rows: number, cols: number, mines: number, firstClick?: [number, number]): Cell[][] {
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );

  // Place mines, avoiding first click and its neighbors
  const forbidden = new Set<string>();
  if (firstClick) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        forbidden.add(`${firstClick[0] + dr},${firstClick[1] + dc}`);
      }
    }
  }

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].mine && !forbidden.has(`${r},${c}`)) {
      board[r][c].mine = true;
      placed++;
    }
  }

  // Calculate adjacency
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].adjacent = count;
    }
  }

  return board;
}

function revealCell(board: Cell[][], rows: number, cols: number, r: number, c: number) {
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  if (board[r][c].revealed || board[r][c].flagged) return;

  board[r][c].revealed = true;

  if (board[r][c].adjacent === 0 && !board[r][c].mine) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        revealCell(board, rows, cols, r + dr, c + dc);
      }
    }
  }
}

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>({
    easy: null,
    medium: null,
    hard: null,
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const config = DIFFICULTIES[difficulty];

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  const initGame = useCallback(
    (firstClick?: [number, number]) => {
      const newBoard = createBoard(config.rows, config.cols, config.mines, firstClick);
      setBoard(newBoard);
      setGameState(firstClick ? "playing" : "idle");
      setFlagCount(0);
      setTimer(0);
      stopTimer();
      if (firstClick) {
        startTimer();
      }
    },
    [config, stopTimer, startTimer]
  );

  useEffect(() => {
    initGame();
  }, [difficulty, initGame]);

  // Load best times from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("minesweeper-best");
    if (saved) {
      try {
        setBestTimes(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveBestTime = useCallback(
    (d: Difficulty, time: number) => {
      setBestTimes((prev) => {
        if (prev[d] !== null && time >= prev[d]!) return prev;
        const updated = { ...prev, [d]: time };
        localStorage.setItem("minesweeper-best", JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const handleCellClick = (r: number, c: number) => {
    if (gameState === "won" || gameState === "lost") return;

    const cell = board[r][c];
    if (cell.revealed || cell.flagged) return;

    if (gameState === "idle") {
      const newBoard = createBoard(config.rows, config.cols, config.mines, [r, c]);
      revealCell(newBoard, config.rows, config.cols, r, c);

      if (newBoard[r][c].mine) {
        // Shouldn't happen due to first-click protection, but just in case
        newBoard[r][c].revealed = true;
        setBoard(newBoard);
        setGameState("lost");
        stopTimer();
        return;
      }

      setBoard(newBoard);
      setGameState("playing");
      startTimer();
      checkWin(newBoard);
      return;
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (cell.mine) {
      // Reveal all mines
      for (let row of newBoard) {
        for (let c of row) {
          if (c.mine) c.revealed = true;
        }
      }
      setBoard(newBoard);
      setGameState("lost");
      stopTimer();
      return;
    }

    revealCell(newBoard, config.rows, config.cols, r, c);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameState === "won" || gameState === "lost") return;
    if (gameState === "idle") return;

    const cell = board[r][c];
    if (cell.revealed) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
    setFlagCount((prev) => prev + (newBoard[r][c].flagged ? 1 : -1));
  };

  const checkWin = (b: Cell[][]) => {
    let unrevealed = 0;
    for (let row of b) {
      for (let cell of row) {
        if (!cell.revealed && !cell.mine) unrevealed++;
      }
    }
    if (unrevealed === 0) {
      setGameState("won");
      stopTimer();
      saveBestTime(difficulty, timer);
    }
  };

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Minesweeper"
        subtitle="Classic mine-clearing puzzle"
        icon={<Bomb className="w-5 h-5" />}
        iconClass="bg-rose-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#E11D48]"
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex gap-2">
            {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
              <NeoButton
                key={d}
                variant={difficulty === d ? "primary" : "secondary"}
                onClick={() => setDifficulty(d)}
                className="px-4 py-2 text-sm"
              >
                {DIFFICULTIES[d].label}
              </NeoButton>
            ))}
          </div>
          <NeoButton variant="secondary" onClick={() => initGame()} className="px-4 py-2 text-sm">
            <RotateCcw className="w-4 h-4" />
            New Game
          </NeoButton>
        </div>

        {/* Status Bar */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#E11D48]" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/40 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
                <Bomb className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Mines</p>
                <p className="text-xl font-black">{config.mines - flagCount}</p>
              </div>
            </div>

            <div className="text-center">
              {gameState === "won" && (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Trophy className="w-6 h-6" />
                  <span className="font-black text-lg uppercase">You Win!</span>
                </div>
              )}
              {gameState === "lost" && (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <Bomb className="w-6 h-6" />
                  <span className="font-black text-lg uppercase">Game Over</span>
                </div>
              )}
              {gameState !== "won" && gameState !== "lost" && (
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                  {gameState === "idle" ? "Click to start" : "In Progress"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase text-right">Time</p>
                <p className="text-xl font-black font-mono">{formatTime(timer)}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center">
                <TimerIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </NeoBlock>

        {/* Game Board */}
        <div className="overflow-x-auto mb-6">
          <div
            className="inline-grid gap-[2px] border-4 border-zinc-900 dark:border-zinc-100 p-[2px] bg-zinc-300 dark:bg-zinc-700"
            style={{
              gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isRevealed = cell.revealed;
                const isFlagged = cell.flagged;
                const isMine = cell.mine;

                let cellClass =
                  "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-black text-sm sm:text-base border-2 border-zinc-400 dark:border-zinc-600 transition-colors select-none ";

                if (isRevealed) {
                  if (isMine) {
                    cellClass +=
                      "bg-rose-500 border-rose-700 dark:bg-rose-600 dark:border-rose-400 text-white";
                  } else {
                    cellClass +=
                      "bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600";
                  }
                } else {
                  cellClass +=
                    "bg-zinc-300 dark:bg-zinc-700 border-zinc-500 dark:border-zinc-500 hover:bg-zinc-400 dark:hover:bg-zinc-600 cursor-pointer";
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    className={cellClass}
                    onClick={() => handleCellClick(r, c)}
                    onContextMenu={(e) => handleRightClick(e, r, c)}
                  >
                    {isRevealed && isMine && <Bomb className="w-4 h-4 sm:w-5 sm:h-5" />}
                    {isRevealed && !isMine && cell.adjacent > 0 && (
                      <span className={ADJACENT_COLORS[cell.adjacent] || "text-zinc-900"}>
                        {cell.adjacent}
                      </span>
                    )}
                    {!isRevealed && isFlagged && (
                      <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Instructions & Best Times */}
        <div className="grid md:grid-cols-2 gap-6">
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#2563EB]">
            <h3 className="text-lg font-black uppercase mb-4 text-blue-600 dark:text-blue-400">How to Play</h3>
            <ul className="space-y-2 text-sm font-bold text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">-</span>
                Left-click to reveal a cell
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">-</span>
                Right-click to flag a suspected mine
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">-</span>
                Numbers show how many adjacent cells contain mines
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">-</span>
                Reveal all non-mine cells to win
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">-</span>
                First click is always safe
              </li>
            </ul>
          </NeoBlock>

          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#10B981]">
            <h3 className="text-lg font-black uppercase mb-4 text-emerald-600 dark:text-emerald-400">Best Times</h3>
            <div className="space-y-3">
              {(Object.keys(DIFFICULTIES) as Difficulty[]).map((d) => (
                <div
                  key={d}
                  className="flex items-center justify-between py-2 border-b-2 border-zinc-200 dark:border-zinc-700 last:border-0"
                >
                  <span className="font-bold text-zinc-700 dark:text-zinc-300">{DIFFICULTIES[d].label}</span>
                  <span className="font-black font-mono text-zinc-900 dark:text-zinc-50">
                    {bestTimes[d] !== null ? formatTime(bestTimes[d]!) : "--:--"}
                  </span>
                </div>
              ))}
            </div>
          </NeoBlock>
        </div>
      </div>
    </div>
  );
}

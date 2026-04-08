"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Grid3X3, RotateCcw, Trophy, ArrowDown } from "lucide-react";

const ROWS = 6;
const COLS = 7;
const EMPTY = 0;
const PLAYER1 = 1;
const PLAYER2 = 2;

type CellValue = 0 | 1 | 2;
type Board = CellValue[][];

function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY) as CellValue[]);
}

function checkWin(board: Board, row: number, col: number, player: CellValue): [number, number][] {
  const directions = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal ↘
    [1, -1], // diagonal ↙
  ];

  for (const [dr, dc] of directions) {
    const cells: [number, number][] = [[row, col]];
    // Check forward
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c]);
      } else break;
    }
    // Check backward
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        cells.push([r, c]);
      } else break;
    }
    if (cells.length >= 4) return cells;
  }
  return [];
}

function isDraw(board: Board): boolean {
  return board[0].every((cell) => cell !== EMPTY);
}

function getLowestEmptyRow(board: Board, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === EMPTY) return r;
  }
  return -1;
}

const PIECE_COLORS: Record<CellValue, string> = {
  [EMPTY]: "bg-zinc-200 dark:bg-zinc-800",
  [PLAYER1]: "bg-rose-500 border-rose-600",
  [PLAYER2]: "bg-amber-400 border-amber-500",
};

const PIECE_WIN_COLORS: Record<CellValue, string> = {
  [EMPTY]: "",
  [PLAYER1]: "ring-4 ring-rose-300 dark:ring-rose-700",
  [PLAYER2]: "ring-4 ring-amber-200 dark:ring-amber-600",
};

const PLAYER_LABELS: Record<CellValue, string> = {
  [EMPTY]: "",
  [PLAYER1]: "Red",
  [PLAYER2]: "Yellow",
};

const PLAYER_DOT_COLORS: Record<CellValue, string> = {
  [EMPTY]: "",
  [PLAYER1]: "bg-rose-500",
  [PLAYER2]: "bg-amber-400",
};

export default function ConnectFourPage() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPlayer, setCurrentPlayer] = useState<CellValue>(PLAYER1);
  const [winCells, setWinCells] = useState<[number, number][]>([]);
  const [isDrawState, setIsDrawState] = useState(false);
  const [scores, setScores] = useState({ [PLAYER1]: 0, [PLAYER2]: 0, draws: 0 });
  const [moveHistory, setMoveHistory] = useState<number[]>([]);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const dropPiece = useCallback(
    (col: number) => {
      if (winCells.length > 0 || isDrawState) return;

      const row = getLowestEmptyRow(board, col);
      if (row === -1) return;

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = currentPlayer;

      const winningCells = checkWin(newBoard, row, col, currentPlayer);

      if (winningCells.length > 0) {
        setWinCells(winningCells);
        setBoard(newBoard);
        setScores((prev) => ({
          ...prev,
          [currentPlayer]: (prev[currentPlayer as 1 | 2] ?? 0) + 1,
        }));
        setMoveHistory((prev) => [...prev, col]);
      } else if (isDraw(newBoard)) {
        setIsDrawState(true);
        setBoard(newBoard);
        setScores((prev) => ({
          ...prev,
          draws: prev.draws + 1,
        }));
        setMoveHistory((prev) => [...prev, col]);
      } else {
        setCurrentPlayer((prev) => (prev === PLAYER1 ? PLAYER2 : PLAYER1));
        setBoard(newBoard);
        setMoveHistory((prev) => [...prev, col]);
      }
    },
    [board, currentPlayer, winCells, isDrawState]
  );

  const undoMove = useCallback(() => {
    if (moveHistory.length === 0) return;
    if (winCells.length > 0 || isDrawState) {
      // Full reset to last state before win/draw
      const newScores = { ...scores };
      if (winCells.length > 0) {
        const winner = board[winCells[0][0]][winCells[0][1]];
        newScores[winner as 1 | 2] -= 1;
      } else {
        newScores.draws -= 1;
      }
      setScores(newScores);
      setWinCells([]);
      setIsDrawState(false);
    }

    const newBoard = board.map((r) => [...r]);
    const lastCol = moveHistory[moveHistory.length - 1];
    // Find the topmost piece in that column to remove
    for (let r = 0; r < ROWS; r++) {
      if (newBoard[r][lastCol] !== EMPTY) {
        newBoard[r][lastCol] = EMPTY;
        break;
      }
    }

    setBoard(newBoard);
    setCurrentPlayer((prev) => (prev === PLAYER1 ? PLAYER2 : PLAYER1));
    setMoveHistory((prev) => prev.slice(0, -1));
  }, [board, moveHistory, winCells, isDrawState, scores]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER1);
    setWinCells([]);
    setIsDrawState(false);
    setMoveHistory([]);
    setHoverCol(null);
  }, []);

  const resetScores = useCallback(() => {
    resetGame();
    setScores({ [PLAYER1]: 0, [PLAYER2]: 0, draws: 0 });
  }, [resetGame]);

  const isGameOver = winCells.length > 0 || isDrawState;
  const winner = winCells.length > 0 ? board[winCells[0][0]][winCells[0][1]] : EMPTY;
  const canDrop = (col: number) => board[0][col] === EMPTY && !isGameOver;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Connect Four"
        subtitle="Drop pieces, connect four in a row"
        icon={<Grid3X3 className="w-5 h-5" />}
        iconClass="bg-purple-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#9333EA]"
        backLink="/#games"
        backText="Games"
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Scoreboard */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#9333EA]" className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-rose-600" />
                <span className="font-black text-lg">Red: {scores[PLAYER1]}</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-amber-500" />
                <span className="font-black text-lg">Yellow: {scores[PLAYER2]}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-zinc-500">Draws: {scores.draws}</span>
              <button
                onClick={resetScores}
                className="text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors uppercase"
              >
                Reset
              </button>
            </div>
          </div>
        </NeoBlock>

        {/* Status */}
        <div className="mb-4 text-center">
          {isGameOver ? (
            winner !== EMPTY ? (
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-amber-500" />
                <span className="text-2xl font-black uppercase">
                  <span className={winner === PLAYER1 ? "text-rose-500" : "text-amber-400"}>
                    {PLAYER_LABELS[winner]}
                  </span>{" "}
                  Wins!
                </span>
              </div>
            ) : (
              <span className="text-2xl font-black uppercase text-zinc-500">Draw!</span>
            )
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-4 h-4 rounded-full ${PLAYER_DOT_COLORS[currentPlayer]}`} />
              <span className="text-xl font-black uppercase">
                <span className={currentPlayer === PLAYER1 ? "text-rose-500" : "text-amber-400"}>
                  {PLAYER_LABELS[currentPlayer]}
                </span>
                &apos;s Turn
              </span>
            </div>
          )}
        </div>

        {/* Column hover indicators */}
        <div className="flex justify-center mb-1 px-1">
          {Array.from({ length: COLS }, (_, c) => (
            <div key={c} className="w-12 sm:w-14 h-8 flex items-center justify-center">
              {hoverCol === c && canDrop(c) && (
                <ArrowDown className={`w-5 h-5 ${currentPlayer === PLAYER1 ? "text-rose-500" : "text-amber-400"} animate-bounce`} />
              )}
            </div>
          ))}
        </div>

        {/* Board */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#9333EA]" className="mb-6 bg-blue-600 dark:bg-blue-800 border-blue-800 dark:border-blue-950 overflow-x-auto">
          <div className="flex flex-col items-center min-w-fit">
            {board.map((row, r) => (
              <div key={r} className="flex">
                {row.map((cell, c) => {
                  const isWin = winCells.some(([wr, wc]) => wr === r && wc === c);
                  return (
                    <button
                      key={c}
                      onClick={() => dropPiece(c)}
                      onMouseEnter={() => setHoverCol(c)}
                      onMouseLeave={() => setHoverCol(null)}
                      disabled={!canDrop(c)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 m-1 rounded-full border-4 transition-all duration-150 ${
                        PIECE_COLORS[cell]
                      } ${isWin ? PIECE_WIN_COLORS[cell] : ""} ${
                        canDrop(c) && !isWin
                          ? "cursor-pointer hover:scale-105"
                          : "cursor-default"
                      }`}
                      aria-label={`Row ${r + 1}, Column ${c + 1}: ${
                        cell === EMPTY ? "empty" : PLAYER_LABELS[cell]
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </NeoBlock>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <NeoButton onClick={undoMove} variant="secondary" disabled={moveHistory.length === 0}>
            Undo
          </NeoButton>
          <NeoButton
            onClick={resetGame}
            variant="primary"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </NeoButton>
        </div>

        {/* How to Play */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#9333EA]" className="mt-6">
          <h2 className="text-lg font-black uppercase mb-3 tracking-tight">How to Play</h2>
          <ul className="space-y-2 font-bold text-zinc-600 dark:text-zinc-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-black">1.</span>
              Players take turns dropping pieces into columns
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-black">2.</span>
              Pieces fall to the lowest available space in the column
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-black">3.</span>
              First player to connect 4 pieces in a row (horizontal, vertical, or diagonal) wins
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-black">4.</span>
              If the board fills up with no winner, it&apos;s a draw
            </li>
          </ul>
        </NeoBlock>
      </main>
    </div>
  );
}

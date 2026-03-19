"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveLeft, X, Circle, Trophy, RefreshCw, Hash } from "lucide-react";

type Player = "X" | "O" | null;
type Winner = "X" | "O" | "draw" | null;
type Board = (Player)[];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Winner>(null);
  const [xWins, setXWins] = useState(0);
  const [oWins, setOWins] = useState(0);
  const [draws, setDraws] = useState(0);

  function checkWinner(currentBoard: Board): Winner {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6], // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return null;
  }

  function handleCellClick(index: number): void {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner === "X" || gameWinner === "O") {
      setWinner(gameWinner);
      if (gameWinner === "X") setXWins(xWins + 1);
      else setOWins(oWins + 1);
      return;
    }

    if (!newBoard.includes(null)) {
      setWinner("draw");
      setDraws(draws + 1);
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  }

  function resetGame(): void {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      {/* Header */}
      <header className="border-b-4 border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10 shadow-[0_4px_0_0_#9333EA]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center text-white shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa]">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight dark:text-zinc-50">Tic-Tac-Toe</h1>
                <p className="text-xs md:text-sm font-bold text-zinc-600 dark:text-zinc-400">CLASSIC 3-IN-A-ROW</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 border-2 border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-bold hover:bg-purple-600 hover:text-white transition-colors shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa] active:translate-y-0 active:translate-x-0 active:shadow-none"
            >
              <MoveLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-8 md:mt-12 max-w-4xl">
        {/* Scoreboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="p-4 md:p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] flex flex-col items-center justify-center">
            <div className={`flex items-center justify-center mb-2 ${currentPlayer === "X" ? "text-blue-600" : "text-rose-600"}`}>
              {currentPlayer === "X" ? <X className="w-10 h-10 stroke-[3]" /> : <Circle className="w-10 h-10 stroke-[3]" />}
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Current Turn</div>
          </div>
          
          <div className="p-4 md:p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#2563EB] flex flex-col items-center justify-center">
             <div className="flex items-center gap-2 mb-2 text-blue-600">
              <X className="w-6 h-6 stroke-[3]" />
              <span className="text-3xl md:text-4xl font-black">{xWins}</span>
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Wins</div>
          </div>

          <div className="p-4 md:p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#E11D48] flex flex-col items-center justify-center">
             <div className="flex items-center gap-2 mb-2 text-rose-600">
              <Circle className="w-6 h-6 stroke-[3]" />
              <span className="text-3xl md:text-4xl font-black">{oWins}</span>
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Wins</div>
          </div>

          <div className="p-4 md:p-6 bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#9333EA] flex flex-col items-center justify-center">
             <div className="text-3xl md:text-4xl font-black text-purple-600 mb-2">
              {draws}
            </div>
            <div className="text-sm font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Draws</div>
          </div>
        </div>

        {/* Game Board Container */}
        <div className="max-w-md mx-auto">
          {/* Winner Banner */}
          {winner && (
            <div className={`text-center mb-8 p-6 border-4 border-zinc-900 dark:border-zinc-100 shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa] ${
              winner === "X" ? "bg-blue-100 dark:bg-blue-900/40" : winner === "O" ? "bg-rose-100 dark:bg-rose-900/40" : "bg-purple-100 dark:bg-purple-900/40"
            }`}>
              <div className="flex items-center justify-center gap-4">
                {winner === "X" && <X className="w-12 h-12 stroke-[3] text-blue-600 dark:text-blue-400" />}
                {winner === "O" && <Circle className="w-12 h-12 stroke-[3] text-rose-600 dark:text-rose-400" />}
                {winner === "draw" && <Hash className="w-12 h-12 stroke-[3] text-purple-600 dark:text-purple-400" />}
              </div>
              <h2 className={`mt-4 text-3xl font-black uppercase ${
                winner === "X" ? "text-blue-600 dark:text-blue-400" : winner === "O" ? "text-rose-600 dark:text-rose-400" : "text-purple-600 dark:text-purple-400"
              }`}>
                {winner === "draw" ? "It's a draw!" : "Wins!"}
              </h2>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[12px_12px_0_0_#9333EA] p-6 sm:p-8 mb-12">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null || winner !== null}
                  className={`
                    aspect-square border-4 flex items-center justify-center
                    transition-all duration-200
                    ${cell === null && winner === null
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:-translate-y-1 shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa] cursor-pointer"
                      : cell !== null
                        ? "border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 cursor-default shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.05)] dark:shadow-[inset_4px_4px_0_0_rgba(255,255,255,0.05)]"
                        : "border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed text-zinc-300 shadow-none border-dashed"
                    }
                  `}
                >
                  {cell === "X" && <X className="w-12 h-12 sm:w-16 sm:h-16 stroke-[3] text-blue-600" />}
                  {cell === "O" && <Circle className="w-12 h-12 sm:w-16 sm:h-16 stroke-[3] text-rose-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={resetGame}
              className="flex items-center gap-3 px-8 py-4 bg-purple-600 text-white font-black text-xl border-4 border-zinc-900 dark:border-zinc-100 shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[10px_10px_0_0_#18181b] dark:hover:shadow-[10px_10px_0_0_#fafafa] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all uppercase tracking-wide cursor-pointer"
            >
              <RefreshCw className="w-6 h-6 stroke-[3]" />
              New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

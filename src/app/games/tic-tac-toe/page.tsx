"use client";

import { useState } from "react";

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

  function getCellContent(player: Player): string {
    if (player === "X") return "×";
    if (player === "O") return "○";
    return "";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">Tic-Tac-Toe ❌⭕</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Classic 3-in-a-row game</p>
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
        {/* Scoreboard */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className={`text-3xl font-bold ${currentPlayer === "X" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-900 dark:text-white"}`}>
              {currentPlayer === "X" ? "×" : "X"}
            </div>
            <div className={`text-sm ${currentPlayer === "X" ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 dark:text-zinc-400"}`}>
              {currentPlayer === "X" ? "Turn" : "Player"}
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {xWins}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">× Wins</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {oWins}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">○ Wins</div>
          </div>
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-center">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
              {draws}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">Draws</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="max-w-md mx-auto mb-8">
          {(winner === "X" || winner === "O") && (
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {winner === "X" ? "×" : "○"} Wins! 🎉
              </div>
            </div>
          )}
          {winner === "draw" && (
            <div className="text-center mb-6 p-4 bg-gradient-to-r from-gray-100 to-zinc-100 dark:from-zinc-700 dark:to-zinc-600 rounded-xl">
              <div className="text-4xl font-bold text-zinc-600 dark:text-zinc-400">
                It's a Draw! 🤝
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-3 gap-4">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={cell !== null}
                  className={`
                    aspect-square rounded-xl text-6xl font-bold
                    transition-all duration-200 cursor-pointer
                    flex items-center justify-center
                    ${cell === null
                      ? "bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 hover:scale-105"
                      : "cursor-default"
                    }
                    ${cell === "X" ? "text-indigo-600 dark:text-indigo-400" : ""}
                    ${cell === "O" ? "text-purple-600 dark:text-purple-400" : ""}
                  `}
                >
                  {cell ? getCellContent(cell) : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-lg"
          >
            New Game
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-white/80 dark:bg-zinc-800/80 rounded-xl">
          <h2 className="font-semibold mb-3 dark:text-white">How to Play</h2>
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Player × starts first</li>
            <li>• Click a cell to place your mark</li>
            <li>• First to get 3 in a row (horizontal, vertical, or diagonal) wins</li>
            <li>• Scores are tracked across games</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

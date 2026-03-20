'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trophy, Crown, Gamepad2, Skull, RefreshCw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Tile = number;

type Board = Tile[][];

const GridIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
  </svg>
);

export default function Game2048() {
  const SIZE = 4;
  const WINNING_TILE = 2048;

  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const createEmptyBoard = (): Board => {
    return Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  };

  const getEmptyCells = (currentBoard: Board): [number, number][] => {
    const empty: [number, number][] = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (currentBoard[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }
    return empty;
  };

  const addRandomTile = useCallback((currentBoard: Board): Board => {
    const emptyCells = getEmptyCells(currentBoard);
    if (emptyCells.length === 0) return currentBoard;

    const newBoard = currentBoard.map(row => [...row]);
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }, []);

  const slideRow = (row: Tile[]): Tile[] => {
    const filtered = row.filter(tile => tile !== 0);
    const result: Tile[] = [];
    
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        result.push(filtered[i] * 2);
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return result;
  };

  const move = useCallback((direction: Direction): boolean => {
    let moved = false;
    let newScore = score;

    const rotateBoard = (b: Board): Board => {
      const newB: Board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          newB[c][SIZE - 1 - r] = b[r][c];
        }
      }
      return newB;
    };

    let rotated = board;
    const rotations = direction === 'UP' ? 1 : direction === 'RIGHT' ? 2 : direction === 'DOWN' ? 3 : 0;

    for (let i = 0; i < rotations; i++) {
      rotated = rotateBoard(rotated);
    }

    const newBoard = rotated.map(row => {
      const newRow = slideRow(row);
      if (newRow.join(',') !== row.join(',')) moved = true;
      newRow.forEach(tile => {
        if (tile > row[row.findIndex((v, i) => v !== newRow[i])]) {
          newScore += tile;
        }
      });
      return newRow;
    });

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      rotated = rotateBoard(newBoard);
    }

    if (moved) {
      setScore(newScore);
      if (newScore > highScore) setHighScore(newScore);
      const boardWithNewTile = addRandomTile(newBoard);
      setBoard(boardWithNewTile);

      // Check for 2048
      if (boardWithNewTile.some(row => row.some(tile => tile === WINNING_TILE))) {
        setWon(true);
      }

      // Check game over
      if (getEmptyCells(boardWithNewTile).length === 0) {
        let canMove = false;
        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            const tile = boardWithNewTile[r][c];
            if (r < SIZE - 1 && tile === boardWithNewTile[r + 1][c]) canMove = true;
            if (c < SIZE - 1 && tile === boardWithNewTile[r][c + 1]) canMove = true;
          }
        }
        if (!canMove) {
          setGameOver(true);
        }
      }
    }

    return moved;
  }, [board, score, highScore, addRandomTile]);

  const startNewGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    const boardWithOne = addRandomTile(emptyBoard);
    const boardWithTwo = addRandomTile(boardWithOne);
    setBoard(boardWithTwo);
    setScore(0);
    setGameOver(false);
    setWon(false);
  }, [addRandomTile]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        startNewGame();
      }
      return;
    }

    const keyMap: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT',
      'w': 'UP',
      's': 'DOWN',
      'a': 'LEFT',
      'd': 'RIGHT',
    };

    const direction = keyMap[e.key];
    if (direction) {
      e.preventDefault();
      move(direction);
    }
  }, [gameOver, move, startNewGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const getTileColor = (tile: Tile): string => {
    const colors: Record<number, string> = {
      0: 'bg-zinc-200 dark:bg-zinc-800',
      2: 'bg-amber-100 dark:bg-amber-900/30 text-zinc-900 dark:text-amber-100',
      4: 'bg-amber-200 dark:bg-amber-800 text-zinc-900 dark:text-amber-50',
      8: 'bg-orange-300 dark:bg-orange-700 text-zinc-900',
      16: 'bg-orange-400 dark:bg-orange-600 text-white',
      32: 'bg-red-400 dark:bg-red-600 text-white',
      64: 'bg-red-500 dark:bg-red-500 text-white',
      128: 'bg-yellow-400 dark:bg-yellow-600 text-white',
      256: 'bg-yellow-500 dark:bg-yellow-500 text-white',
      512: 'bg-yellow-600 dark:bg-yellow-400 text-white',
      1024: 'bg-amber-500 dark:bg-amber-300 text-white',
      2048: 'bg-emerald-500 text-white',
    };
    return colors[tile] || 'bg-purple-500 text-white';
  };

  const getFontSize = (tile: Tile): string => {
    if (tile < 100) return 'text-4xl';
    if (tile < 1000) return 'text-3xl';
    return 'text-2xl';
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      <PageHeader 
        title="2048" 
        subtitle="COMBINE TILES TO REACH 2048" 
        icon={<GridIcon className="w-5 h-5" />} 
        iconClass="bg-amber-500 text-zinc-900" 
        shadowClass="shadow-[0_4px_0_0_#f59e0b]" 
      />

      <div className="container mx-auto px-4 mt-8 md:mt-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Game Area */}
          <NeoBlock shadowClass="shadow-[12px_12px_0_0_#f59e0b]" className="flex-1 max-w-[480px] w-full mx-auto">
            <div className="flex justify-between items-center mb-8 border-b-4 border-zinc-900 dark:border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-amber-500" />
                <div>
                  <div className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Score</div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none">{score}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-500 uppercase tracking-widest">High Score</div>
                  <div className="text-3xl font-black text-emerald-500 leading-none">{highScore}</div>
                </div>
                <Crown className="w-6 h-6 text-emerald-500" />
              </div>
            </div>

            <div className="relative mb-8">
              <div className="bg-zinc-300 dark:bg-zinc-700 border-4 border-zinc-900 dark:border-zinc-100 p-3">
                <div className="grid grid-cols-4 gap-3">
                  {board.map((row, rowIndex) =>
                    row.map((tile, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`aspect-square flex items-center justify-center font-black ${getTileColor(tile)} border-2 border-zinc-900 dark:border-zinc-100`}
                      >
                        {tile !== 0 && (
                          <span className={getFontSize(tile)}>
                            {tile}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {gameOver && (
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 border-4 border-zinc-900 dark:border-zinc-100 m-[-2px]">
                  <Skull className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
                  <div className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Game Over</div>
                  <p className="text-zinc-300 font-bold mb-8 text-center">Final Score: {score}</p>
                  
                  <NeoButton onClick={startNewGame} variant="success" className="px-8 py-4">
                    <RefreshCw className="w-5 h-5" /> Play Again
                  </NeoButton>
                </div>
              )}

              {won && !gameOver && (
                <div className="absolute inset-0 bg-emerald-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 border-4 border-emerald-400 dark:border-emerald-300 m-[-2px]">
                  <Trophy className="w-16 h-16 text-white mb-4 animate-bounce" />
                  <div className="text-4xl font-black text-white mb-2 uppercase tracking-tight">You Win!</div>
                  <p className="text-zinc-200 font-bold mb-8 text-center">Score: {score}</p>
                  
                  <div className="flex gap-4">
                    <NeoButton onClick={startNewGame} variant="success" className="px-8 py-4">
                      <RefreshCw className="w-5 h-5" /> New Game
                    </NeoButton>
                  </div>
                </div>
              )}
            </div>
            
            <NeoButton onClick={startNewGame} variant="secondary" className="w-full py-4 text-lg">
              <RefreshCw className="w-5 h-5" /> New Game
            </NeoButton>
          </NeoBlock>

          {/* Controls Information */}
          <div className="flex-1 w-full max-w-sm mx-auto flex flex-col gap-6">
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]">
              <h2 className="flex items-center gap-2 text-2xl font-black uppercase mb-6 dark:text-white">
                <Gamepad2 className="w-6 h-6 text-amber-500" /> Controls
              </h2>
              
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] p-3 font-black dark:text-white">
                  <ArrowUp className="w-5 h-5" /> Arrow Keys or WASD
                </div>
              </div>
              
              <p className="font-bold text-center text-zinc-600 dark:text-zinc-400">
                Use arrow keys or WASD to slide tiles in that direction. When two tiles with the same number touch, they merge into one!
              </p>
            </NeoBlock>
            
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="p-6">
              <h2 className="text-xl font-black uppercase mb-4 dark:text-white">How to Play</h2>
              <ul className="space-y-3 font-bold text-zinc-700 dark:text-zinc-400">
                <li className="flex gap-3"><div className="w-2 h-2 mt-2 bg-amber-500"></div> Use arrow keys to slide tiles.</li>
                <li className="flex gap-3"><div className="w-2 h-2 mt-2 bg-emerald-500"></div> When two tiles with the same number collide, they merge.</li>
                <li className="flex gap-3"><div className="w-2 h-2 mt-2 bg-blue-500"></div> Reach 2048 to win!</li>
                <li className="flex gap-3"><div className="w-2 h-2 mt-2 bg-rose-500"></div> Game over when no moves left.</li>
              </ul>
            </NeoBlock>

            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="p-6">
              <h2 className="text-xl font-black uppercase mb-4 dark:text-white">Tile Values</h2>
              <div className="grid grid-cols-4 gap-2">
                {['2', '4', '8', '16', '32', '64', '128', '2048'].map((value) => (
                  <div
                    key={value}
                    className={`aspect-square flex items-center justify-center font-black text-sm ${getTileColor(parseInt(value))} border border-zinc-900 dark:border-zinc-100`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </NeoBlock>
          </div>
          
        </div>
      </div>
    </div>
  );
}

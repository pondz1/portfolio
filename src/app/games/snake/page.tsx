'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Crown, Gamepad2, Skull, RefreshCw } from 'lucide-react';
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

const BoxIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

export default function SnakeGame() {
  const gridSize = 20;
  const canvasSize = 400;

  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef<Direction>('RIGHT');
  const snakeRef = useRef<Position[]>([]);
  const foodRef = useRef<Position>({ x: 0, y: 0 });
  const highScoreRef = useRef(0);
  const scoreRef = useRef(0);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      if (gameOver) return prevSnake;

      const head = { ...prevSnake[0] };
      const dir = directionRef.current;

      switch (dir) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return prevSnake;
      }

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(prevSnake));
        return [head, ...prevSnake];
      }

      return [head, ...prevSnake.slice(0, -1)];
    });
  }, [gameOver, generateFood, highScore, food]);

  const startGame = useCallback(() => {
    const initialSnake = [{ x: 10, y: 10 }];
    const initialFood = { x: 5, y: 5 };
    
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);

    // Update refs
    snakeRef.current = initialSnake;
    foodRef.current = initialFood;

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(() => {
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const currentHighScore = highScoreRef.current;
      
      if (!currentSnake || currentSnake.length === 0) return;

      const head = { ...currentSnake[0] };
      const dir = directionRef.current;

      switch (dir) {
        case 'UP': head.y--; break;
        case 'DOWN': head.y++; break;
        case 'LEFT': head.x--; break;
        case 'RIGHT': head.x++; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
        setGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return;
      }

      // Check self collision
      if (currentSnake.some(seg => seg.x === head.x && seg.y === head.y)) {
        setGameOver(true);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        return;
      }

      // Check food collision
      if (head.x === currentFood.x && head.y === currentFood.y) {
        const newScore = scoreRef.current + 10;
        scoreRef.current = newScore;
        setScore(newScore);
        
        if (newScore > currentHighScore) {
          highScoreRef.current = newScore;
          setHighScore(newScore);
        }

        const newFood: Position = { x: 0, y: 0 };
        do {
          newFood.x = Math.floor(Math.random() * gridSize);
          newFood.y = Math.floor(Math.random() * gridSize);
        } while (currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y));
        
        foodRef.current = newFood;
        setFood(newFood);
        snakeRef.current = [head, ...currentSnake];
        setSnake([head, ...currentSnake]);
      } else {
        snakeRef.current = [head, ...currentSnake.slice(0, -1)];
        setSnake([head, ...currentSnake.slice(0, -1)]);
      }
    }, 120);
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const currentDir = directionRef.current;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    const newDir = e.key;

    // Prevent reversing direction
    if ((newDir === 'ArrowUp' && currentDir !== 'DOWN') ||
        (newDir === 'ArrowDown' && currentDir !== 'UP') ||
        (newDir === 'ArrowLeft' && currentDir !== 'RIGHT') ||
        (newDir === 'ArrowRight' && currentDir !== 'LEFT')) {
      directionRef.current = newDir === 'ArrowUp' ? 'UP' :
                          newDir === 'ArrowDown' ? 'DOWN' :
                          newDir === 'ArrowLeft' ? 'LEFT' : 'RIGHT';
      setDirection(directionRef.current);
    }

    // Space to restart
    if (e.key === ' ' && gameOver) {
      e.preventDefault();
      startGame();
    }
  }, [gameOver, startGame, setDirection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    startGame();
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [startGame]);

  const drawGrid = (ctx: CanvasRenderingContext2D, isDark: boolean) => {
    ctx.strokeStyle = isDark ? '#3f3f46' : '#e4e4e7';
    ctx.lineWidth = 1;

    for (let i = 0; i <= gridSize; i++) {
      const pos = (canvasSize / gridSize) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvasSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvasSize, pos);
      ctx.stroke();
    }
  };

  const renderCanvas = useCallback(() => {
    const canvas = document.getElementById('snakeCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains('dark');

    // Clear canvas
    ctx.fillStyle = isDark ? '#fafafa' : '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    drawGrid(ctx, isDark);

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#2563eb' : '#60a5fa'; // blue-600 vs blue-400
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      // Draw eyes on head
      if (isHead) {
        ctx.fillStyle = '#fff';
        const eyeOffset = cellSize / 4;
        const eyeSize = 3;

        let eye1X, eye1Y, eye2X, eye2Y;
        const headX = segment.x * cellSize;
        const headY = segment.y * cellSize;

        switch (direction) {
          case 'UP':
            eye1X = headX + eyeOffset;
            eye1Y = headY + eyeOffset;
            eye2X = headX + cellSize - eyeOffset;
            eye2Y = headY + eyeOffset;
            break;
          case 'DOWN':
            eye1X = headX + eyeOffset;
            eye1Y = headY + cellSize - eyeOffset;
            eye2X = headX + cellSize - eyeOffset;
            eye2Y = headY + cellSize - eyeOffset;
            break;
          case 'LEFT':
            eye1X = headX + eyeOffset;
            eye1Y = headY + eyeOffset;
            eye2X = headX + eyeOffset;
            eye2Y = headY + cellSize - eyeOffset;
            break;
          case 'RIGHT':
            eye1X = headX + cellSize - eyeOffset;
            eye1Y = headY + eyeOffset;
            eye2X = headX + cellSize - eyeOffset;
            eye2Y = headY + cellSize - eyeOffset;
            break;
        }

        ctx.fillRect(eye1X - eyeSize/2, eye1Y - eyeSize/2, eyeSize, eyeSize);
        ctx.fillRect(eye2X - eyeSize/2, eye2Y - eyeSize/2, eyeSize, eyeSize);
      }
    });

    // Draw border
    ctx.strokeStyle = isDark ? '#fafafa' : '#18181b';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, canvasSize, canvasSize);

  }, [snake, food, direction]);

  useEffect(() => {
    renderCanvas();
    // Re-render on theme change
    const observer = new MutationObserver(() => renderCanvas());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [renderCanvas]);

  const cellSize = canvasSize / gridSize;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans pb-12">
      <PageHeader 
        title="Snake" 
        subtitle="DON'T HIT THE WALLS" 
        icon={<BoxIcon className="w-5 h-5" />} 
        iconClass="bg-emerald-500 text-zinc-900" 
        shadowClass="shadow-[0_4px_0_0_#22c55e]" 
      />

      <div className="container mx-auto px-4 mt-8 md:mt-12 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Game Area */}
          <NeoBlock shadowClass="shadow-[12px_12px_0_0_#22c55e]" className="flex-1 max-w-[480px] w-full mx-auto">
            <div className="flex justify-between items-center mb-8 border-b-4 border-zinc-900 dark:border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-emerald-500" />
                <div>
                  <div className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Score</div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-none">{score}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div className="text-right">
                  <div className="text-xs font-black text-amber-500 uppercase tracking-widest">High Score</div>
                  <div className="text-3xl font-black text-amber-500 leading-none">{highScore}</div>
                </div>
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
            </div>

            <div className="flex justify-center mb-8 relative">
              <canvas
                id="snakeCanvas"
                width={canvasSize}
                height={canvasSize}
                className="w-full max-w-[400px] aspect-square block bg-zinc-50 dark:bg-zinc-950"
              />
              
              {gameOver && (
                <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 border-4 border-zinc-900 dark:border-zinc-100 m-[2px]">
                  <Skull className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
                  <div className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Game Over</div>
                  <p className="text-zinc-300 font-bold mb-8 text-center">Score: {score}</p>
                  
                  <NeoButton onClick={startGame} variant="success" className="px-8 py-4">
                    <RefreshCw className="w-5 h-5" /> Play Again
                  </NeoButton>
                </div>
              )}
            </div>
            
            <div className="text-center font-bold text-zinc-600 dark:text-zinc-400 p-4 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100">
              {gameOver ? 'Press spacebar to restart' : 'Use arrow keys to move'}
            </div>
          </NeoBlock>

          {/* Controls Information */}
          <div className="flex-1 w-full max-w-sm mx-auto flex flex-col gap-6">
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]">
              <h2 className="flex items-center gap-2 text-2xl font-black uppercase mb-6 dark:text-white">
                <Gamepad2 className="w-6 h-6 text-blue-600" /> Controls
              </h2>
              
              <div className="grid grid-cols-3 gap-3 max-w-[200px] mx-auto mb-6">
                <div></div>
                <div className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] p-3 text-center font-black dark:text-white">↑</div>
                <div></div>
                <div className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] p-3 text-center font-black dark:text-white">←</div>
                <div className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] p-3 text-center font-black dark:text-white">↓</div>
                <div className="bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-900 dark:border-zinc-100 shadow-[2px_2px_0_0_#18181b] dark:shadow-[2px_2px_0_0_#fafafa] p-3 text-center font-black dark:text-white">→</div>
              </div>
              
              <p className="font-bold text-center text-zinc-600 dark:text-zinc-400">
                You can also use SPACEBAR to restart game when it's over.
              </p>
            </NeoBlock>
            
            <NeoBlock shadowClass="shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa]" className="p-6">
              <h2 className="text-xl font-black uppercase mb-4 dark:text-white">Rules</h2>
              <ul className="space-y-3 font-bold text-zinc-700 dark:text-zinc-400">
                <li className="flex gap-3"><div className="w-2 h-2 mt-2 bg-rose-600"></div> Eat red food to grow and earn 10 points.</li>
                <li className="flex gap-3"><div className="w-2 h-2 mt-2 bg-blue-600"></div> Don't hit walls or yourself!</li>
              </ul>
            </NeoBlock>
          </div>
          
        </div>
      </div>
    </div>
  );
}

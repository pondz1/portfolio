'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

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
    if (gameOver) return;

    setSnake(prevSnake => {
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
  }, [food, gameOver, generateFood, highScore]);

  const startGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setGameOver(false);
    setScore(0);

    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    gameLoopRef.current = setInterval(moveSnake, 150);
  }, [moveSnake]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    const currentDir = directionRef.current;
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
  }, [gameOver, startGame]);

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

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;

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

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Draw grid
    drawGrid(ctx);

    // Draw food (apple)
    const cellSize = canvasSize / gridSize;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22c55e' : '#4ade80';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );

      // Draw eyes on head
      if (isHead) {
        ctx.fillStyle = '#000';
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

        ctx.beginPath();
        ctx.arc(eye1X, eye1Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eye2X, eye2Y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [snake, food, direction]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🐍 Snake Game</h1>
            <p className="text-purple-200">Eat the food, grow longer, don't hit the walls!</p>
          </div>

          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-sm text-purple-200">Score</div>
              <div className="text-3xl font-bold text-white">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-purple-200">High Score</div>
              <div className="text-3xl font-bold text-yellow-400">{highScore}</div>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <canvas
              id="snakeCanvas"
              width={canvasSize}
              height={canvasSize}
              className="bg-white rounded-lg shadow-lg"
            />
          </div>

          {gameOver && (
            <div className="text-center mb-4">
              <div className="text-2xl font-bold text-red-400 mb-2">Game Over!</div>
              <p className="text-purple-200">Press Space or click the button to play again</p>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {gameOver ? 'Play Again' : 'Restart'}
            </button>
          </div>

          <div className="mt-8 text-center text-purple-200 text-sm">
            <div className="font-semibold mb-2">Controls:</div>
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              <div></div>
              <div className="bg-white/10 rounded p-2">↑</div>
              <div></div>
              <div className="bg-white/10 rounded p-2">←</div>
              <div className="bg-white/10 rounded p-2">↓</div>
              <div className="bg-white/10 rounded p-2">→</div>
            </div>
            <p className="mt-2 text-purple-300">Use arrow keys or swipe to move</p>
          </div>
        </div>
      </div>
    </div>
  );
}

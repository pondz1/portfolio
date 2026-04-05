"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Blocks, RotateCcw, Trophy, Heart, Pause, Play } from "lucide-react";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 14;
const BALL_RADIUS = 8;
const BRICK_ROWS = 6;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 22;
const BRICK_PADDING = 6;
const BRICK_TOP_OFFSET = 50;

const BRICK_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
];

type GameState = "idle" | "playing" | "paused" | "won" | "lost";

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
  color: string;
}

function createBricks(): Brick[] {
  const bricks: Brick[] = [];
  const brickWidth = (CANVAS_WIDTH - BRICK_PADDING * (BRICK_COLS + 1)) / BRICK_COLS;
  for (let row = 0; row < BRICK_ROWS; row++) {
    for (let col = 0; col < BRICK_COLS; col++) {
      bricks.push({
        x: BRICK_PADDING + col * (brickWidth + BRICK_PADDING),
        y: BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_PADDING),
        width: brickWidth,
        height: BRICK_HEIGHT,
        alive: true,
        color: BRICK_COLORS[row % BRICK_COLORS.length],
      });
    }
  }
  return bricks;
}

function createBall(): Ball {
  return {
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 40,
    dx: 4 * (Math.random() > 0.5 ? 1 : -1),
    dy: -4,
  };
}

export default function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>("idle");
  const ballRef = useRef<Ball>(createBall());
  const bricksRef = useRef<Brick[]>(createBricks());
  const paddleXRef = useRef<number>((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const scoreRef = useRef<number>(0);
  const livesRef = useRef<number>(3);
  const keysRef = useRef<Set<string>>(new Set());

  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState<number>(0);
  const [bricksLeft, setBricksLeft] = useState(BRICK_ROWS * BRICK_COLS);

  const updateDisplay = useCallback(() => {
    setScore(scoreRef.current);
    setLives(livesRef.current);
    setBricksLeft(bricksRef.current.filter(b => b.alive).length);
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    // Background
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid lines for style
    ctx.strokeStyle = "#18181b";
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Bricks
    bricksRef.current.forEach(brick => {
      if (!brick.alive) return;
      ctx.fillStyle = brick.color;
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      // Border
      ctx.strokeStyle = "#fafafa";
      ctx.lineWidth = 2;
      ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      // Highlight
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(brick.x, brick.y, brick.width, brick.height / 3);
    });

    // Paddle
    ctx.fillStyle = "#3B82F6";
    ctx.fillRect(paddleXRef.current, CANVAS_HEIGHT - 25, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.strokeStyle = "#fafafa";
    ctx.lineWidth = 2;
    ctx.strokeRect(paddleXRef.current, CANVAS_HEIGHT - 25, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#fafafa";
    ctx.fill();
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Idle text
    if (gameStateRef.current === "idle") {
      ctx.fillStyle = "#fafafa";
      ctx.font = "bold 24px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Press SPACE or click START", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = "bold 14px 'Space Grotesk', sans-serif";
      ctx.fillStyle = "#71717a";
      ctx.fillText("Arrow keys or mouse to move paddle", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    }

    if (gameStateRef.current === "paused") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 32px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }, []);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (gameStateRef.current === "playing") {
      const ball = ballRef.current;

      // Paddle movement
      if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a")) {
        paddleXRef.current = Math.max(0, paddleXRef.current - 7);
      }
      if (keysRef.current.has("ArrowRight") || keysRef.current.has("d")) {
        paddleXRef.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleXRef.current + 7);
      }

      // Ball movement
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collisions
      if (ball.x - BALL_RADIUS <= 0 || ball.x + BALL_RADIUS >= CANVAS_WIDTH) {
        ball.dx = -ball.dx;
        ball.x = Math.max(BALL_RADIUS, Math.min(CANVAS_WIDTH - BALL_RADIUS, ball.x));
      }
      if (ball.y - BALL_RADIUS <= 0) {
        ball.dy = -ball.dy;
        ball.y = BALL_RADIUS;
      }

      // Ball fell below
      if (ball.y + BALL_RADIUS > CANVAS_HEIGHT) {
        livesRef.current -= 1;
        if (livesRef.current <= 0) {
          gameStateRef.current = "lost";
          setGameState("lost");
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
          }
        } else {
          ballRef.current = createBall();
        }
        updateDisplay();
      }

      // Paddle collision
      if (
        ball.dy > 0 &&
        ball.y + BALL_RADIUS >= CANVAS_HEIGHT - 25 &&
        ball.y + BALL_RADIUS <= CANVAS_HEIGHT - 25 + PADDLE_HEIGHT + 4 &&
        ball.x >= paddleXRef.current &&
        ball.x <= paddleXRef.current + PADDLE_WIDTH
      ) {
        ball.dy = -ball.dy;
        // Adjust angle based on where ball hits paddle
        const hitPos = (ball.x - paddleXRef.current) / PADDLE_WIDTH;
        ball.dx = 8 * (hitPos - 0.5);
        // Normalize speed
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        const targetSpeed = Math.min(speed, 7);
        ball.dx = (ball.dx / speed) * targetSpeed;
        ball.dy = (ball.dy / speed) * targetSpeed;
        ball.y = CANVAS_HEIGHT - 25 - BALL_RADIUS;
      }

      // Brick collisions
      bricksRef.current.forEach(brick => {
        if (!brick.alive) return;
        if (
          ball.x + BALL_RADIUS > brick.x &&
          ball.x - BALL_RADIUS < brick.x + brick.width &&
          ball.y + BALL_RADIUS > brick.y &&
          ball.y - BALL_RADIUS < brick.y + brick.height
        ) {
          brick.alive = false;
          ball.dy = -ball.dy;
          scoreRef.current += 10;
          updateDisplay();

          // Check win
          if (bricksRef.current.every(b => !b.alive)) {
            gameStateRef.current = "won";
            setGameState("won");
            scoreRef.current += 100; // Bonus
            updateDisplay();
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
            }
          }
        }
      });
    }

    draw(ctx);
    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, [draw, highScore, updateDisplay]);

  const startGame = useCallback(() => {
    ballRef.current = createBall();
    bricksRef.current = createBricks();
    scoreRef.current = 0;
    livesRef.current = 3;
    paddleXRef.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    gameStateRef.current = "playing";
    setGameState("playing");
    updateDisplay();
  }, [updateDisplay]);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === "playing") {
      gameStateRef.current = "paused";
      setGameState("paused");
    } else if (gameStateRef.current === "paused") {
      gameStateRef.current = "playing";
      setGameState("playing");
    }
  }, []);

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " || e.key === "Space") {
        e.preventDefault();
        if (gameStateRef.current === "idle" || gameStateRef.current === "won" || gameStateRef.current === "lost") {
          startGame();
        } else if (gameStateRef.current === "playing" || gameStateRef.current === "paused") {
          togglePause();
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [startGame, togglePause]);

  // Mouse handler for paddle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      paddleXRef.current = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, mouseX - PADDLE_WIDTH / 2));
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Game loop
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [gameLoop]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Breakout"
        subtitle="Classic brick-breaking arcade game"
        icon={<Blocks className="w-5 h-5" />}
        iconClass="bg-blue-600 text-white"
        shadowClass="shadow-[0_4px_0_0_#3B82F6]"
        backLink="/games"
        backText="Games"
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#F59E0B]" className="p-3 text-center">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-amber-500" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Score</p>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{score}</p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#EF4444]" className="p-3 text-center">
            <Heart className="w-4 h-4 mx-auto mb-1 text-rose-500" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Lives</p>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{lives}</p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#8B5CF6]" className="p-3 text-center">
            <Blocks className="w-4 h-4 mx-auto mb-1 text-purple-500" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Bricks</p>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{bricksLeft}</p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#3B82F6]" className="p-3 text-center">
            <Trophy className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Best</p>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50">{highScore || "--"}</p>
          </NeoBlock>
        </div>

        {/* Game Canvas */}
        <NeoBlock
          shadowClass="shadow-[8px_8px_0_0_#3B82F6]"
          className="mb-6 overflow-hidden"
          noPadding
        >
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full border-b-4 border-zinc-900 dark:border-zinc-100 cursor-none"
            style={{ imageRendering: "auto" }}
          />
        </NeoBlock>

        {/* Controls */}
        <div className="flex gap-3 justify-center flex-wrap">
          {(gameState === "idle" || gameState === "won" || gameState === "lost") && (
            <NeoButton onClick={startGame} variant="primary">
              <Play className="w-4 h-4" />
              {gameState === "idle" ? "Start Game" : "Play Again"}
            </NeoButton>
          )}
          {(gameState === "playing" || gameState === "paused") && (
            <>
              <NeoButton onClick={togglePause} variant="warning">
                {gameState === "paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {gameState === "paused" ? "Resume" : "Pause"}
              </NeoButton>
              <NeoButton onClick={startGame} variant="danger">
                <RotateCcw className="w-4 h-4" />
                Restart
              </NeoButton>
            </>
          )}
        </div>

        {/* Win/Lose Messages */}
        {gameState === "won" && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#10B981]" className="p-6 mt-6 text-center">
            <p className="text-3xl font-black text-emerald-600 uppercase">You Win!</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400 mt-2">
              All bricks destroyed! +100 bonus points
            </p>
          </NeoBlock>
        )}
        {gameState === "lost" && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#EF4444]" className="p-6 mt-6 text-center">
            <p className="text-3xl font-black text-rose-600 uppercase">Game Over</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400 mt-2">
              Final score: {score} points
            </p>
          </NeoBlock>
        )}

        {/* Instructions */}
        <NeoBlock shadowClass="shadow-[4px_4px_0_0_#18181b] dark:shadow-[4px_4px_0_0_#fafafa]" className="p-6 mt-6">
          <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-3">How to Play</h2>
          <div className="space-y-2 text-sm font-bold text-zinc-600 dark:text-zinc-400">
            <p>Move the paddle with your mouse or arrow keys</p>
            <p>Bounce the ball to break all the bricks</p>
            <p>You have 3 lives - don&apos;t let the ball fall!</p>
            <p>Destroy all bricks for a 100-point bonus</p>
          </div>
        </NeoBlock>
      </main>
    </div>
  );
}

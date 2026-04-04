"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Bird, RotateCcw, Trophy, Play } from "lucide-react";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const GAP_SIZE = 160;
const GRAVITY = 0.45;
const FLAP_FORCE = -7.5;
const PIPE_SPEED = 2.5;

type GameState = "idle" | "playing" | "gameover";

export default function FlappyBirdPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const birdRef = useRef({ x: 80, y: CANVAS_HEIGHT / 2, velocity: 0 });
  const pipesRef = useRef<{ x: number; topHeight: number; passed: boolean }[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const gameStateRef = useRef<GameState>("idle");
  const lastPipeRef = useRef(0);

  useEffect(() => {
    const stored = localStorage.getItem("flappy-bird-best");
    if (stored) setBestScore(parseInt(stored, 10));
  }, []);

  const resetGame = useCallback(() => {
    birdRef.current = { x: 80, y: CANVAS_HEIGHT / 2, velocity: 0 };
    pipesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    frameRef.current = 0;
    lastPipeRef.current = 0;
  }, []);

  const flap = useCallback(() => {
    if (gameStateRef.current === "idle") {
      resetGame();
      gameStateRef.current = "playing";
      setGameState("playing");
      birdRef.current.velocity = FLAP_FORCE;
      return;
    }
    if (gameStateRef.current === "playing") {
      birdRef.current.velocity = FLAP_FORCE;
      return;
    }
    if (gameStateRef.current === "gameover") {
      resetGame();
      gameStateRef.current = "idle";
      setGameState("idle");
    }
  }, [resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [flap]);

  const drawBird = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const rotation = Math.min(Math.max(birdRef.current.velocity * 3, -30), 90);
    ctx.save();
    ctx.translate(x + BIRD_SIZE / 2, y + BIRD_SIZE / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Body
    ctx.fillStyle = "#FBBF24";
    ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);

    // Wing
    ctx.fillStyle = "#F59E0B";
    ctx.fillRect(-BIRD_SIZE / 2 - 4, -2, 14, 10);

    // Eye
    ctx.fillStyle = "#18181B";
    ctx.fillRect(6, -8, 6, 6);

    // Beak
    ctx.fillStyle = "#EF4444";
    ctx.fillRect(BIRD_SIZE / 2, -2, 8, 6);

    // Border
    ctx.strokeStyle = "#18181B";
    ctx.lineWidth = 2;
    ctx.strokeRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);

    ctx.restore();
  };

  const drawPipe = (ctx: CanvasRenderingContext2D, x: number, topHeight: number) => {
    const bottomY = topHeight + GAP_SIZE;
    const bottomHeight = CANVAS_HEIGHT - bottomY;

    // Top pipe
    ctx.fillStyle = "#10B981";
    ctx.fillRect(x, 0, PIPE_WIDTH, topHeight);
    ctx.strokeStyle = "#18181B";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 0, PIPE_WIDTH, topHeight);
    // Top pipe cap
    ctx.fillStyle = "#059669";
    ctx.fillRect(x - 4, topHeight - 20, PIPE_WIDTH + 8, 20);
    ctx.strokeRect(x - 4, topHeight - 20, PIPE_WIDTH + 8, 20);

    // Bottom pipe
    ctx.fillStyle = "#10B981";
    ctx.fillRect(x, bottomY, PIPE_WIDTH, bottomHeight);
    ctx.strokeRect(x, bottomY, PIPE_WIDTH, bottomHeight);
    // Bottom pipe cap
    ctx.fillStyle = "#059669";
    ctx.fillRect(x - 4, bottomY, PIPE_WIDTH + 8, 20);
    ctx.strokeRect(x - 4, bottomY, PIPE_WIDTH + 8, 20);
  };

  const checkCollision = () => {
    const bird = birdRef.current;
    const birdLeft = bird.x + 2;
    const birdRight = bird.x + BIRD_SIZE - 2;
    const birdTop = bird.y + 2;
    const birdBottom = bird.y + BIRD_SIZE - 2;

    // Ceiling and floor
    if (birdTop < 0 || birdBottom > CANVAS_HEIGHT) return true;

    for (const pipe of pipesRef.current) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;
      const gapTop = pipe.topHeight;
      const gapBottom = pipe.topHeight + GAP_SIZE;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < gapTop || birdBottom > gapBottom) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      frameRef.current++;

      // Clear
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Clouds (decorative)
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      for (let i = 0; i < 4; i++) {
        const cx = ((frameRef.current * 0.3 + i * 120) % (CANVAS_WIDTH + 80)) - 40;
        const cy = 60 + i * 100;
        ctx.fillRect(cx, cy, 60, 20);
        ctx.fillRect(cx + 10, cy - 10, 40, 10);
      }

      // Ground
      ctx.fillStyle = "#92400E";
      ctx.fillRect(0, CANVAS_HEIGHT - 40, CANVAS_WIDTH, 40);
      ctx.fillStyle = "#15803D";
      ctx.fillRect(0, CANVAS_HEIGHT - 44, CANVAS_WIDTH, 8);
      ctx.strokeStyle = "#18181B";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, CANVAS_HEIGHT - 44, CANVAS_WIDTH, 44);

      if (gameStateRef.current === "playing") {
        // Physics
        birdRef.current.velocity += GRAVITY;
        birdRef.current.y += birdRef.current.velocity;

        // Pipe generation
        if (frameRef.current - lastPipeRef.current > 90) {
          const minTop = 60;
          const maxTop = CANVAS_HEIGHT - GAP_SIZE - 100;
          const topHeight = Math.random() * (maxTop - minTop) + minTop;
          pipesRef.current.push({ x: CANVAS_WIDTH, topHeight, passed: false });
          lastPipeRef.current = frameRef.current;
        }

        // Move pipes
        for (const pipe of pipesRef.current) {
          pipe.x -= PIPE_SPEED;

          // Score
          if (!pipe.passed && pipe.x + PIPE_WIDTH < birdRef.current.x) {
            pipe.passed = true;
            scoreRef.current++;
            setScore(scoreRef.current);
          }
        }

        // Remove off-screen pipes
        pipesRef.current = pipesRef.current.filter((p) => p.x > -PIPE_WIDTH - 10);

        // Collision
        if (checkCollision()) {
          gameStateRef.current = "gameover";
          setGameState("gameover");
          const prev = bestScore;
          if (scoreRef.current > prev) {
            setBestScore(scoreRef.current);
            localStorage.setItem("flappy-bird-best", String(scoreRef.current));
          }
        }
      }

      // Draw pipes
      for (const pipe of pipesRef.current) {
        drawPipe(ctx, pipe.x, pipe.topHeight);
      }

      // Draw bird
      if (gameStateRef.current !== "idle" || frameRef.current % 60 < 40) {
        drawBird(ctx, birdRef.current.x, birdRef.current.y);
      }

      // Idle floating
      if (gameStateRef.current === "idle") {
        birdRef.current.y = CANVAS_HEIGHT / 2 + Math.sin(frameRef.current * 0.05) * 15;
      }

      // In-canvas score (during play)
      if (gameStateRef.current === "playing") {
        ctx.save();
        ctx.font = "bold 48px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#18181B";
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 6;
        ctx.strokeText(String(scoreRef.current), CANVAS_WIDTH / 2, 70);
        ctx.fillText(String(scoreRef.current), CANVAS_WIDTH / 2, 70);
        ctx.restore();
      }

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [bestScore]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Flappy Bird"
        subtitle="Tap or press Space to fly"
        icon={<Bird className="w-5 h-5" />}
        iconClass="bg-amber-500 text-white"
        shadowClass="shadow-[0_4px_0_0_#F59E0B]"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto">
          <NeoBlock shadowClass="shadow-[8px_8px_0_0_#10B981]" noPadding>
            {/* Score Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-zinc-900 dark:border-zinc-100 bg-amber-50 dark:bg-zinc-800">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span className="font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider text-sm">Score</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{score}</span>
                <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">/</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{bestScore}</span>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full cursor-pointer block"
                onClick={flap}
                onTouchStart={(e) => {
                  e.preventDefault();
                  flap();
                }}
              />

              {/* Idle Overlay */}
              {gameState === "idle" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                  <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[8px_8px_0_0_#18181b] dark:shadow-[8px_8px_0_0_#fafafa] px-8 py-6 text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Ready?</h2>
                    <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-4">
                      Tap, click, or press Space
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
                      <Play className="w-5 h-5" />
                      <span className="font-black uppercase text-sm">Start</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameState === "gameover" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-900 dark:border-zinc-100 shadow-[8px_8px_0_0_#EF4444] px-8 py-6 text-center">
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-1 text-rose-600">Game Over</h2>
                    <p className="text-4xl font-black text-zinc-900 dark:text-zinc-50 mb-1">{score}</p>
                    <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4">
                      Best: {bestScore}
                    </p>
                    <NeoButton variant="danger" onClick={flap} className="text-xs px-4 py-2">
                      <RotateCcw className="w-4 h-4" />
                      Retry
                    </NeoButton>
                  </div>
                </div>
              )}
            </div>
          </NeoBlock>

          {/* Instructions */}
          <NeoBlock className="mt-6" shadowClass="shadow-[6px_6px_0_0_#FBBF24]">
            <h3 className="text-lg font-black uppercase tracking-wider mb-3">How to Play</h3>
            <div className="grid gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/40 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Tap, click, or press Space/Up to make the bird flap
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/40 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trophy className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Fly through the gaps between pipes to score points
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/40 border-2 border-zinc-900 dark:border-zinc-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                </div>
                <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  Hitting a pipe or the ground ends the game. Tap to retry.
                </p>
              </div>
            </div>
          </NeoBlock>
        </div>
      </div>
    </div>
  );
}

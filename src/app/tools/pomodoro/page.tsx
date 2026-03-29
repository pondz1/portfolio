"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Clock, Play, Pause, RotateCcw, SkipForward, Coffee, Brain, CheckCircle } from "lucide-react";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const MODE_CONFIG: Record<PomodoroMode, { label: string; minutes: number; color: string; icon: React.ReactNode; shadowColor: string; bgAccent: string }> = {
  work: {
    label: "Focus",
    minutes: 25,
    color: "bg-rose-500",
    icon: <Brain className="w-5 h-5" />,
    shadowColor: "#EF4444",
    bgAccent: "bg-rose-500/10",
  },
  shortBreak: {
    label: "Short Break",
    minutes: 5,
    color: "bg-emerald-500",
    icon: <Coffee className="w-5 h-5" />,
    shadowColor: "#10B981",
    bgAccent: "bg-emerald-500/10",
  },
  longBreak: {
    label: "Long Break",
    minutes: 15,
    color: "bg-blue-500",
    icon: <Clock className="w-5 h-5" />,
    shadowColor: "#3B82F6",
    bgAccent: "bg-blue-500/10",
  },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIG.work.minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocus, setTotalFocus] = useState(0); // total focus minutes
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<Record<PomodoroMode, number>>({
    work: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const config = MODE_CONFIG[mode];

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsRunning(false);
            if (mode === "work") {
              setSessions((s) => s + 1);
              setTotalFocus((t) => t + customMinutes.work);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, customMinutes.work]);

  const switchMode = useCallback(
    (newMode: PomodoroMode) => {
      setMode(newMode);
      setTimeLeft(customMinutes[newMode] * 60);
      setIsRunning(false);
    },
    [customMinutes]
  );

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes[mode] * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === "work") {
      setSessions((s) => s + 1);
      setTotalFocus((t) => t + customMinutes.work);
      const nextMode = (sessions + 1) % longBreakInterval === 0 ? "longBreak" : "shortBreak";
      switchMode(nextMode);
    } else {
      switchMode("work");
    }
  };

  const applySettings = () => {
    setTimeLeft(customMinutes[mode] * 60);
    setIsRunning(false);
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = 1 - timeLeft / (customMinutes[mode] * 60);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <PageHeader
        title="Pomodoro Timer"
        subtitle="Stay focused, take breaks"
        icon={<Clock className="w-5 h-5" />}
        iconClass="bg-rose-500 text-white"
        shadowClass="shadow-[0_4px_0_0_#EF4444]"
        backLink="/tools"
        backText="Tools"
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          {(Object.keys(MODE_CONFIG) as PomodoroMode[]).map((m) => {
            const cfg = MODE_CONFIG[m];
            const isActive = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3 px-4 border-4 border-zinc-900 dark:border-zinc-100 font-black uppercase text-sm tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isActive
                    ? `${cfg.color} text-white shadow-[4px_4px_0_0_${cfg.shadowColor}]`
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#18181b] dark:hover:shadow-[4px_4px_0_0_#fafafa]"
                }`}
              >
                {cfg.icon}
                <span className="hidden sm:inline">{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timer Display */}
        <NeoBlock
          shadowClass={`shadow-[8px_8px_0_0_${config.shadowColor}]`}
          className="mb-6 overflow-hidden"
        >
          <div className={`${config.bgAccent} p-8 md:p-12`}>
            <div className="text-center">
              {/* Circular progress */}
              <div className="relative inline-block mb-6">
                <svg className="w-56 h-56 md:w-64 md:h-64 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-zinc-200 dark:text-zinc-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="butt"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress)}`}
                    className={mode === "work" ? "text-rose-500" : mode === "shortBreak" ? "text-emerald-500" : "text-blue-500"}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl md:text-6xl font-black font-mono text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mt-1">
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 border-2 border-zinc-900 dark:border-zinc-100 mb-6 max-w-xs mx-auto">
                <div
                  className={`h-full transition-all duration-500 ${config.color}`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                {!isRunning ? (
                  <NeoButton
                    onClick={handleStart}
                    variant={mode === "work" ? "danger" : mode === "shortBreak" ? "success" : "primary"}
                    className="py-4 px-8 text-lg"
                  >
                    <Play className="w-5 h-5 stroke-[3]" />
                    Start
                  </NeoButton>
                ) : (
                  <NeoButton
                    onClick={handlePause}
                    variant="secondary"
                    className="py-4 px-8 text-lg"
                  >
                    <Pause className="w-5 h-5 stroke-[3]" />
                    Pause
                  </NeoButton>
                )}

                <NeoButton onClick={handleReset} variant="secondary" className="py-4 px-4">
                  <RotateCcw className="w-5 h-5" />
                </NeoButton>

                <NeoButton onClick={handleSkip} variant="secondary" className="py-4 px-4">
                  <SkipForward className="w-5 h-5" />
                </NeoButton>
              </div>
            </div>
          </div>
        </NeoBlock>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#EF4444]" className="p-4 text-center">
            <CheckCircle className="w-5 h-5 mx-auto mb-1 text-rose-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Sessions</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{sessions}</p>
          </NeoBlock>
          <NeoBlock shadowClass="shadow-[4px_4px_0_0_#3B82F6]" className="p-4 text-center">
            <Brain className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase">Focus Time</p>
            <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{totalFocus}m</p>
          </NeoBlock>
        </div>

        {/* Session Dots */}
        {sessions > 0 && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#A855F7]" className="p-6 mb-6">
            <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              Session Progress
            </h2>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: sessions }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 bg-rose-500 flex items-center justify-center"
                >
                  <span className="text-xs font-black text-white">{i + 1}</span>
                </div>
              ))}
              {Array.from({ length: Math.max(0, longBreakInterval - (sessions % longBreakInterval)) }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-8 h-8 border-2 border-dashed border-zinc-400 dark:border-zinc-600 flex items-center justify-center"
                  >
                    <span className="text-xs font-bold text-zinc-400">{sessions + i + 1}</span>
                  </div>
                )
              )}
            </div>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-3">
              Long break every {longBreakInterval} sessions
            </p>
          </NeoBlock>
        )}

        {/* Settings */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#18181b] dark:shadow-[6px_6px_0_0_#fafafa]" className="p-6">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full text-left flex items-center justify-between cursor-pointer"
          >
            <h2 className="text-lg font-black uppercase text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <RotateCcw className="w-5 h-5" />
              Settings
            </h2>
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
              {showSettings ? "Close" : "Edit"}
            </span>
          </button>

          {showSettings && (
            <div className="mt-6 space-y-4 border-t-4 border-zinc-900 dark:border-zinc-100 pt-6">
              <div className="space-y-4">
                {(Object.keys(customMinutes) as PomodoroMode[]).map((m) => (
                  <div key={m} className="flex items-center justify-between">
                    <label className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase">
                      {MODE_CONFIG[m].label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={customMinutes[m]}
                        onChange={(e) =>
                          setCustomMinutes((prev) => ({
                            ...prev,
                            [m]: Math.max(1, Math.min(120, parseInt(e.target.value) || 1)),
                          }))
                        }
                        className="w-20 p-2 border-4 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-black text-center text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-blue-600"
                      />
                      <span className="text-sm font-bold text-zinc-500">min</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase">
                    Long Break Every
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={2}
                      max={10}
                      value={longBreakInterval}
                      onChange={(e) =>
                        setLongBreakInterval(Math.max(2, Math.min(10, parseInt(e.target.value) || 4)))
                      }
                      className="w-20 p-2 border-4 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 font-black text-center text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-blue-600"
                    />
                    <span className="text-sm font-bold text-zinc-500">sessions</span>
                  </div>
                </div>
              </div>
              <NeoButton onClick={applySettings} variant="primary" className="w-full">
                Apply Settings
              </NeoButton>
            </div>
          )}
        </NeoBlock>
      </main>
    </div>
  );
}

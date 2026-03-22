"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { NeoBlock } from "@/components/ui/NeoBlock";
import { NeoButton } from "@/components/ui/NeoButton";
import { Timer, Play, Pause, RotateCcw, Flag } from "lucide-react";

type Lap = {
  id: number;
  time: string;
  total: string;
};

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const format = (num: number) => num.toString().padStart(2, "0");

    if (hours > 0) {
      return `${format(hours)}:${format(minutes)}:${format(seconds)}.${format(centiseconds)}`;
    }
    return `${format(minutes)}:${format(seconds)}.${format(centiseconds)}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    const previousLapTime = laps.length > 0 ? laps[0].total : "00:00:00.00";
    const lapId = laps.length + 1;

    setLaps((prev) => [
      {
        id: lapId,
        time: formatTime(time - parseTime(previousLapTime)),
        total: formatTime(time),
      },
      ...prev,
    ]);
  };

  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(":").map(Number);
    const seconds = parts[2] || 0;
    const minutes = parts[1] || 0;
    const hours = parts[0] || 0;
    return hours * 3600000 + minutes * 60000 + seconds * 1000;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Stopwatch"
          subtitle="Track time with precision timing and lap recording"
          icon={<Timer className="w-5 h-5" />}
          iconClass="bg-blue-600 text-white"
          shadowClass="shadow-[0_4px_0_0_#2563EB]"
        />

        {/* Main Time Display */}
        <NeoBlock shadowClass="shadow-[8px_8px_0_0_#3B82F6]" className="p-12 mb-8">
          <div className="text-center">
            <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
              {formatTime(time)}
            </div>
            <p className="mt-4 text-lg font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
              {isRunning ? "Running" : "Stopped"}
            </p>
          </div>
        </NeoBlock>

        {/* Control Buttons */}
        <NeoBlock shadowClass="shadow-[6px_6px_0_0_#10B981]" className="p-8 mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {!isRunning ? (
              <NeoButton
                onClick={handleStart}
                variant="primary"
                className="py-4 px-8 text-xl font-bold flex items-center gap-3"
              >
                <Play className="w-6 h-6 stroke-[3]" />
                Start
              </NeoButton>
            ) : (
              <NeoButton
                onClick={handleStop}
                variant="danger"
                className="py-4 px-8 text-xl font-bold flex items-center gap-3"
              >
                <Pause className="w-6 h-6 stroke-[3]" />
                Stop
              </NeoButton>
            )}

            {isRunning && (
              <NeoButton
                onClick={handleLap}
                variant="secondary"
                className="py-4 px-8 text-xl font-bold flex items-center gap-3"
              >
                <Flag className="w-6 h-6 stroke-[3]" />
                Lap
              </NeoButton>
            )}

            <NeoButton
              onClick={handleReset}
              variant="secondary"
              className="py-4 px-8 text-xl font-bold flex items-center gap-3"
            >
              <RotateCcw className="w-6 h-6 stroke-[3]" />
              Reset
            </NeoButton>
          </div>
        </NeoBlock>

        {/* Laps List */}
        {laps.length > 0 && (
          <NeoBlock shadowClass="shadow-[6px_6px_0_0_#8B5CF6]" className="p-8">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
              <Flag className="w-6 h-6" />
              Laps
            </h2>
            <div className="space-y-3">
              {laps.map((lap) => (
                <div
                  key={lap.id}
                  className="flex items-center justify-between border-4 border-zinc-900 dark:border-zinc-100 p-4 bg-white dark:bg-zinc-900"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center font-black text-xl">
                      {lap.id}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                        Lap Time
                      </div>
                      <div className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-50">
                        {lap.time}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-zinc-600 dark:text-zinc-400 uppercase">
                      Total
                    </div>
                    <div className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-50">
                      {lap.total}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </NeoBlock>
        )}
      </div>
    </div>
  );
}

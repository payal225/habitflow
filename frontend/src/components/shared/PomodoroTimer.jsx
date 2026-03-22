import React, { useState, useEffect, useRef } from "react";

const MODES = {
  work: { label: "Focus", duration: 25 * 60, color: "#22c55e" },
  short: { label: "Short Break", duration: 5 * 60, color: "#3b82f6" },
  long: { label: "Long Break", duration: 15 * 60, color: "#8b5cf6" }
};

const PomodoroTimer = () => {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES.work.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (mode === "work") setSessions(s => s + 1);
            // Play sound notification
            try {
              const ctx = new AudioContext();
              const oscillator = ctx.createOscillator();
              const gainNode = ctx.createGain();
              oscillator.connect(gainNode);
              gainNode.connect(ctx.destination);
              oscillator.frequency.value = 800;
              gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
              oscillator.start(ctx.currentTime);
              oscillator.stop(ctx.currentTime + 0.5);
            } catch(e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    setIsRunning(false);
  };

  const handleReset = () => {
    setTimeLeft(MODES[mode].duration);
    setIsRunning(false);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="card text-center">
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
        Pomodoro Timer 🍅
      </h2>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: "var(--border)" }}>
        {Object.entries(MODES).map(([key, val]) => (
          <button key={key} onClick={() => handleModeChange(key)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: mode === key ? val.color : "transparent",
              color: mode === key ? "white" : "var(--text-muted)"
            }}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Circular Timer */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none"
              stroke={MODES[mode].color} strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-primary)" }}>
              {minutes}:{seconds}
            </span>
            <span className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{MODES[mode].label}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <button onClick={handleReset} className="btn-ghost px-4">↺ Reset</button>
        <button onClick={() => setIsRunning(!isRunning)}
          className="btn px-8 py-3 text-white font-bold rounded-xl transition-all active:scale-95"
          style={{ background: MODES[mode].color }}>
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
      </div>

      {/* Sessions */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="w-3 h-3 rounded-full transition-all"
            style={{ background: i < (sessions % 4) ? MODES.work.color : "var(--border)" }} />
        ))}
        <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
          {sessions} session{sessions !== 1 ? "s" : ""} completed
        </span>
      </div>
    </div>
  );
};

export default PomodoroTimer;
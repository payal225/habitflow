import React, { useState, useEffect } from "react";
import PomodoroTimer from "../components/shared/PomodoroTimer";
import MotivationQuote from "../components/shared/MotivationQuote";
import api from "../utils/api";

const Pomodoro = () => {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);

  useEffect(() => {
    api.get("/habits").then(data => setHabits(data.habits));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
        Focus Mode 🍅
      </h1>

      <MotivationQuote />

      <PomodoroTimer />

      {/* Link Habit to Session */}
      <div className="card">
        <h3 className="font-bold mb-3" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
          Working on...
        </h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedHabit(null)}
            className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: !selectedHabit ? "var(--accent)" : "var(--border)",
              color: !selectedHabit ? "white" : "var(--text-secondary)"
            }}>
            Free Session
          </button>
          {habits.map(habit => (
            <button key={habit._id} onClick={() => setSelectedHabit(habit)}
              className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1"
              style={{
                background: selectedHabit?._id === habit._id ? (habit.color || "var(--accent)") : "var(--border)",
                color: selectedHabit?._id === habit._id ? "white" : "var(--text-secondary)"
              }}>
              <span>{habit.icon}</span>{habit.name}
            </button>
          ))}
        </div>
        {selectedHabit && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {selectedHabit.icon} Focusing on: <strong>{selectedHabit.name}</strong>
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Current streak: 🔥 {selectedHabit.currentStreak} days
            </p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card">
        <h3 className="font-bold mb-3" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
          Pomodoro Tips 💡
        </h3>
        <div className="space-y-2">
          {[
            { icon: "🍅", tip: "Work for 25 minutes without distractions" },
            { icon: "☕", tip: "Take a 5 minute break after each session" },
            { icon: "🏖️", tip: "Take a 15 minute break after 4 sessions" },
            { icon: "📵", tip: "Put your phone away during focus time" },
            { icon: "📝", tip: "Write down distracting thoughts instead of acting on them" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg" style={{ background: "var(--bg-primary)" }}>
              <span className="text-lg">{item.icon}</span>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
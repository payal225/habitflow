import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const MOODS = [
  { emoji: "😢", label: "Awful", value: 1, color: "#ef4444" },
  { emoji: "😕", label: "Bad", value: 2, color: "#f97316" },
  { emoji: "😐", label: "Okay", value: 3, color: "#f59e0b" },
  { emoji: "😊", label: "Good", value: 4, color: "#22c55e" },
  { emoji: "🤩", label: "Amazing", value: 5, color: "#8b5cf6" }
];

const MoodTracker = () => {
  const [todayMood, setTodayMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_moods") || "[]");
    setMoodHistory(stored);
    const todayEntry = stored.find(m => m.date === today);
    if (todayEntry) {
      setTodayMood(todayEntry.value);
      setNote(todayEntry.note || "");
    }
  }, []);

  const handleMoodSelect = (mood) => {
    setTodayMood(mood.value);
    setShowNote(true);
  };

  const handleSave = () => {
    const stored = JSON.parse(localStorage.getItem("ht_moods") || "[]");
    const filtered = stored.filter(m => m.date !== today);
    const newEntry = { date: today, value: todayMood, note, emoji: MOODS[todayMood - 1].emoji };
    const updated = [newEntry, ...filtered].slice(0, 30);
    localStorage.setItem("ht_moods", JSON.stringify(updated));
    setMoodHistory(updated);
    setShowNote(false);
    toast.success("Mood saved!");
  };

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0];
    const entry = moodHistory.find(m => m.date === date);
    return { date, entry };
  });

  const currentMood = todayMood ? MOODS[todayMood - 1] : null;

  return (
    <div className="card">
      <h3 className="font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
        How are you feeling? 🌈
      </h3>

      {/* Mood Selector */}
      <div className="flex justify-between mb-4">
        {MOODS.map(mood => (
          <button key={mood.value} onClick={() => handleMoodSelect(mood)}
            className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-110"
            style={{
              background: todayMood === mood.value ? `${mood.color}20` : "transparent",
              border: todayMood === mood.value ? `2px solid ${mood.color}` : "2px solid transparent",
              transform: todayMood === mood.value ? "scale(1.1)" : "scale(1)"
            }}>
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-medium" style={{ color: todayMood === mood.value ? mood.color : "var(--text-muted)" }}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Note Input */}
      {showNote && (
        <div className="space-y-3 animate-slide-up">
          <textarea className="input resize-none" rows={2}
            placeholder="Add a note about your mood... (optional)"
            value={note} onChange={e => setNote(e.target.value)} />
          <button onClick={handleSave} className="btn-primary w-full">
            Save Mood
          </button>
        </div>
      )}

      {/* Today's mood display */}
      {currentMood && !showNote && (
        <div className="p-3 rounded-xl mb-4" style={{ background: `${currentMood.color}15` }}>
          <p className="text-sm font-medium" style={{ color: currentMood.color }}>
            Today you feel {currentMood.emoji} {currentMood.label}
          </p>
          {note && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>"{note}"</p>}
          <button onClick={() => setShowNote(true)} className="text-xs mt-1 underline" style={{ color: "var(--text-muted)" }}>
            Change mood
          </button>
        </div>
      )}

      {/* Last 7 days */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Last 7 days</p>
        <div className="flex justify-between">
          {last7Days.map(({ date, entry }) => (
            <div key={date} className="flex flex-col items-center gap-1">
              <span className="text-xl">{entry ? entry.emoji : "○"}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const TEMPLATES = [
  {
    category: "🏃 Fitness",
    habits: [
      { name: "Morning Run", icon: "🏃", category: "fitness", frequency: "daily", color: "#f97316", difficulty: "medium", description: "Run for at least 20 minutes every morning" },
      { name: "100 Push-ups", icon: "💪", category: "fitness", frequency: "daily", color: "#ef4444", difficulty: "hard", description: "Complete 100 push-ups throughout the day" },
      { name: "Evening Walk", icon: "🚶", category: "fitness", frequency: "daily", color: "#22c55e", difficulty: "easy", description: "Take a relaxing 30 minute walk in the evening" },
      { name: "Gym Session", icon: "🏋️", category: "fitness", frequency: "daily", color: "#f59e0b", difficulty: "hard", description: "Complete a full gym workout session" },
    ]
  },
  {
    category: "📚 Learning",
    habits: [
      { name: "Read 30 Min", icon: "📚", category: "learning", frequency: "daily", color: "#3b82f6", difficulty: "easy", description: "Read any book for at least 30 minutes" },
      { name: "Learn Coding", icon: "💻", category: "learning", frequency: "daily", color: "#8b5cf6", difficulty: "medium", description: "Practice coding for at least 1 hour" },
      { name: "Watch Tutorial", icon: "🎓", category: "learning", frequency: "daily", color: "#06b6d4", difficulty: "easy", description: "Watch one educational video or tutorial" },
      { name: "Flashcards", icon: "🃏", category: "learning", frequency: "daily", color: "#ec4899", difficulty: "easy", description: "Review flashcards for 15 minutes" },
    ]
  },
  {
    category: "🧘 Mindfulness",
    habits: [
      { name: "Meditation", icon: "🧘", category: "mindfulness", frequency: "daily", color: "#8b5cf6", difficulty: "easy", description: "Meditate for at least 10 minutes" },
      { name: "Gratitude Journal", icon: "📔", category: "mindfulness", frequency: "daily", color: "#f472b6", difficulty: "easy", description: "Write 3 things you are grateful for" },
      { name: "Deep Breathing", icon: "🌬️", category: "mindfulness", frequency: "daily", color: "#22c55e", difficulty: "easy", description: "Practice deep breathing for 5 minutes" },
      { name: "Digital Detox", icon: "📵", category: "mindfulness", frequency: "daily", color: "#f59e0b", difficulty: "medium", description: "Spend 2 hours without social media" },
    ]
  },
  {
    category: "💪 Health",
    habits: [
      { name: "Drink Water", icon: "💧", category: "health", frequency: "daily", color: "#3b82f6", difficulty: "easy", description: "Drink 8 glasses of water today" },
      { name: "Sleep 8hrs", icon: "😴", category: "health", frequency: "daily", color: "#6366f1", difficulty: "medium", description: "Get at least 8 hours of quality sleep" },
      { name: "Eat Healthy", icon: "🥗", category: "health", frequency: "daily", color: "#22c55e", difficulty: "medium", description: "Eat a balanced and nutritious meal" },
      { name: "No Junk Food", icon: "🚫", category: "health", frequency: "daily", color: "#ef4444", difficulty: "hard", description: "Avoid junk food and processed snacks" },
    ]
  },
  {
    category: "💰 Finance",
    habits: [
      { name: "Track Expenses", icon: "💰", category: "finance", frequency: "daily", color: "#22c55e", difficulty: "easy", description: "Log all expenses in a budget tracker" },
      { name: "Save Money", icon: "🏦", category: "finance", frequency: "daily", color: "#f59e0b", difficulty: "medium", description: "Save at least 10% of daily spending" },
      { name: "No Impulse Buy", icon: "🛑", category: "finance", frequency: "daily", color: "#ef4444", difficulty: "hard", description: "Avoid any unplanned purchases today" },
      { name: "Invest Daily", icon: "📈", category: "finance", frequency: "daily", color: "#8b5cf6", difficulty: "hard", description: "Review or make a small investment" },
    ]
  },
  {
    category: "🎨 Creativity",
    habits: [
      { name: "Draw Daily", icon: "✏️", category: "creativity", frequency: "daily", color: "#ec4899", difficulty: "easy", description: "Sketch or draw anything for 15 minutes" },
      { name: "Write Story", icon: "📝", category: "creativity", frequency: "daily", color: "#f97316", difficulty: "medium", description: "Write at least 200 words of creative writing" },
      { name: "Play Music", icon: "🎵", category: "creativity", frequency: "daily", color: "#8b5cf6", difficulty: "medium", description: "Practice a musical instrument for 20 minutes" },
      { name: "Photography", icon: "📷", category: "creativity", frequency: "daily", color: "#3b82f6", difficulty: "easy", description: "Take one creative photo today" },
    ]
  },
];

const DIFFICULTY_COLORS = {
  easy: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  hard: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const HabitTemplates = ({ onAdd, onClose }) => {
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const handleAddTemplate = async (template) => {
    setAdding(template.name);
    try {
      const data = await api.post("/habits", {
        ...template,
        startDate: new Date().toISOString().split("T")[0],
        reminder: { enabled: false, time: "08:00" },
      });
      onAdd(data.habit);
      toast.success(`${template.icon} ${template.name} added!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(null);
    }
  };

  const categories = ["all", ...TEMPLATES.map(t => t.category)];

  const filtered = TEMPLATES
    .filter(t => activeCategory === "all" || t.category === activeCategory)
    .map(t => ({
      ...t,
      habits: t.habits.filter(h =>
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.description.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(t => t.habits.length > 0);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        width: "100%", maxWidth: "800px", maxHeight: "85vh",
        background: "var(--bg-card)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        animation: "scaleIn 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
                🎯 Habit Templates
              </h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                Choose from {TEMPLATES.reduce((a, t) => a + t.habits.length, 0)} pre-made habits to get started instantly
              </p>
            </div>
            <button onClick={onClose} style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
            <input className="input" placeholder="Search templates..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: "44px" }} />
          </div>
        </div>

        {/* Category tabs */}
        <div style={{
          display: "flex", gap: "8px", padding: "12px 24px",
          overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px", borderRadius: "100px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                border: "1px solid",
                background: activeCategory === cat ? "rgba(99,102,241,0.2)" : "transparent",
                borderColor: activeCategory === cat ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.08)",
                color: activeCategory === cat ? "#a78bfa" : "var(--text-muted)",
                transition: "all 0.2s",
              }}>
              {cat === "all" ? "✨ All" : cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
              <p style={{ color: "var(--text-muted)" }}>No templates found</p>
            </div>
          ) : (
            filtered.map(group => (
              <div key={group.category} style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)", marginBottom: "12px" }}>
                  {group.category}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
                  {group.habits.map((habit, i) => {
                    const diff = DIFFICULTY_COLORS[habit.difficulty];
                    const isAdding = adding === habit.name;
                    return (
                      <div key={i} style={{
                        padding: "16px", borderRadius: "16px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.3s", cursor: "pointer",
                        position: "relative", overflow: "hidden",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = habit.color + "40"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
                      >
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: habit.color, opacity: 0.6 }} />
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "24px" }}>{habit.icon}</span>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{habit.name}</span>
                          </div>
                        </div>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>{habit.description}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: diff.bg, color: diff.color }}>
                            {habit.difficulty}
                          </span>
                          <button onClick={() => handleAddTemplate(habit)} disabled={isAdding}
                            style={{
                              padding: "6px 14px", borderRadius: "100px", border: "none",
                              background: isAdding ? "rgba(34,197,94,0.2)" : `linear-gradient(135deg, ${habit.color}, ${habit.color}cc)`,
                              color: "white", fontSize: "11px", fontWeight: 700,
                              cursor: isAdding ? "not-allowed" : "pointer",
                              transition: "all 0.2s",
                              boxShadow: `0 2px 8px ${habit.color}30`,
                            }}>
                            {isAdding ? "Adding..." : "+ Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitTemplates;

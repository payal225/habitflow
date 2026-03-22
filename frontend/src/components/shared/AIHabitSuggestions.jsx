import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const GOALS = [
  { id: "fitness", label: "Get Fit", icon: "💪", color: "#f97316" },
  { id: "mindfulness", label: "Be Mindful", icon: "🧘", color: "#8b5cf6" },
  { id: "learning", label: "Learn More", icon: "📚", color: "#3b82f6" },
  { id: "productivity", label: "Be Productive", icon: "🎯", color: "#22c55e" },
  { id: "health", label: "Stay Healthy", icon: "🥗", color: "#ec4899" },
  { id: "finance", label: "Save Money", icon: "💰", color: "#f59e0b" },
  { id: "creativity", label: "Be Creative", icon: "🎨", color: "#06b6d4" },
  { id: "social", label: "Be Social", icon: "👥", color: "#6366f1" },
];

const AI_SUGGESTIONS = {
  fitness: [
    { name: "Morning Run", icon: "🏃", difficulty: "medium", reason: "Cardio boosts energy and metabolism all day", color: "#f97316" },
    { name: "100 Push-ups", icon: "💪", difficulty: "hard", reason: "Builds upper body strength and discipline", color: "#ef4444" },
    { name: "Evening Stretching", icon: "🤸", difficulty: "easy", reason: "Reduces injury risk and improves flexibility", color: "#22c55e" },
    { name: "Drink Protein Shake", icon: "🥤", difficulty: "easy", reason: "Supports muscle recovery after workouts", color: "#f59e0b" },
  ],
  mindfulness: [
    { name: "Morning Meditation", icon: "🧘", difficulty: "easy", reason: "Reduces stress and improves focus throughout day", color: "#8b5cf6" },
    { name: "Gratitude Journal", icon: "📔", difficulty: "easy", reason: "Shifts mindset to positivity and abundance", color: "#ec4899" },
    { name: "Digital Detox Hour", icon: "📵", difficulty: "medium", reason: "Reduces anxiety and improves sleep quality", color: "#f59e0b" },
    { name: "Deep Breathing", icon: "🌬️", difficulty: "easy", reason: "Activates parasympathetic nervous system", color: "#22c55e" },
  ],
  learning: [
    { name: "Read 30 Minutes", icon: "📚", difficulty: "easy", reason: "Expands vocabulary and knowledge daily", color: "#3b82f6" },
    { name: "Watch Tutorial", icon: "🎓", difficulty: "easy", reason: "Keeps skills sharp and up to date", color: "#8b5cf6" },
    { name: "Practice Coding", icon: "💻", difficulty: "medium", reason: "Builds programming skills through repetition", color: "#22c55e" },
    { name: "Learn New Word", icon: "📖", difficulty: "easy", reason: "Improves communication and expression", color: "#f59e0b" },
  ],
  productivity: [
    { name: "Plan Tomorrow", icon: "📋", difficulty: "easy", reason: "Reduces morning decision fatigue significantly", color: "#22c55e" },
    { name: "2-Minute Rule", icon: "⚡", difficulty: "easy", reason: "If it takes less than 2 min, do it now", color: "#f59e0b" },
    { name: "Deep Work Session", icon: "🎯", difficulty: "hard", reason: "90 min focused work beats 3 hrs distracted", color: "#3b82f6" },
    { name: "Inbox Zero", icon: "📧", difficulty: "medium", reason: "Clear inbox = clear mind for better focus", color: "#8b5cf6" },
  ],
  health: [
    { name: "Drink 8 Glasses", icon: "💧", difficulty: "easy", reason: "Hydration improves energy, skin and focus", color: "#3b82f6" },
    { name: "Sleep 8 Hours", icon: "😴", difficulty: "medium", reason: "Sleep is when your body repairs and grows", color: "#6366f1" },
    { name: "Eat Vegetables", icon: "🥦", difficulty: "easy", reason: "Micronutrients support all body functions", color: "#22c55e" },
    { name: "No Sugar Today", icon: "🚫", difficulty: "hard", reason: "Reduces inflammation and energy crashes", color: "#ef4444" },
  ],
  finance: [
    { name: "Track Expenses", icon: "💰", difficulty: "easy", reason: "Awareness is the first step to saving more", color: "#22c55e" },
    { name: "Save 10%", icon: "🏦", difficulty: "medium", reason: "Pay yourself first builds wealth over time", color: "#f59e0b" },
    { name: "No Impulse Buy", icon: "🛑", difficulty: "hard", reason: "Wait 24 hours before any unplanned purchase", color: "#ef4444" },
    { name: "Review Budget", icon: "📊", difficulty: "easy", reason: "Weekly review keeps spending on track", color: "#8b5cf6" },
  ],
  creativity: [
    { name: "Draw Daily", icon: "✏️", difficulty: "easy", reason: "Creativity is a muscle that grows with use", color: "#ec4899" },
    { name: "Write 200 Words", icon: "📝", difficulty: "medium", reason: "Daily writing builds clarity and expression", color: "#f97316" },
    { name: "Play Music", icon: "🎵", difficulty: "medium", reason: "Music practice rewires the brain positively", color: "#8b5cf6" },
    { name: "Take One Photo", icon: "📷", difficulty: "easy", reason: "Photography trains observation and attention", color: "#3b82f6" },
  ],
  social: [
    { name: "Call a Friend", icon: "📞", difficulty: "easy", reason: "Strong relationships are key to happiness", color: "#22c55e" },
    { name: "Random Kindness", icon: "❤️", difficulty: "easy", reason: "Acts of kindness boost your own mood too", color: "#ec4899" },
    { name: "Meet Someone New", icon: "🤝", difficulty: "medium", reason: "Expanding network opens unexpected doors", color: "#3b82f6" },
    { name: "Write Thank You", icon: "💌", difficulty: "easy", reason: "Gratitude strengthens relationships deeply", color: "#f59e0b" },
  ],
};

const DIFF_COLORS = {
  easy: { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  hard: { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
};

const AIHabitSuggestions = ({ onAdd, onClose }) => {
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [adding, setAdding] = useState(null);

  const toggleGoal = (id) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
    setGenerated(false);
  };

  const generateSuggestions = () => {
    if (selectedGoals.length === 0) { toast.error("Select at least one goal!"); return; }
    setLoading(true);
    setTimeout(() => {
      const results = [];
      selectedGoals.forEach(goal => {
        const goalSuggestions = AI_SUGGESTIONS[goal] || [];
        results.push(...goalSuggestions.slice(0, 2));
      });
      setSuggestions(results.slice(0, 8));
      setGenerated(true);
      setLoading(false);
      toast.success(`🤖 AI generated ${Math.min(results.length, 8)} personalized habits!`);
    }, 1800);
  };

  const handleAdd = async (suggestion) => {
    setAdding(suggestion.name);
    try {
      const data = await api.post("/habits", {
        name: suggestion.name,
        icon: suggestion.icon,
        category: selectedGoals[0] || "other",
        frequency: "daily",
        color: suggestion.color,
        difficulty: suggestion.difficulty,
        description: suggestion.reason,
        startDate: new Date().toISOString().split("T")[0],
        reminder: { enabled: false, time: "08:00" },
      });
      onAdd(data.habit);
      toast.success(`${suggestion.icon} ${suggestion.name} added!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(null);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{
        width: "100%", maxWidth: "680px", maxHeight: "88vh",
        background: "var(--bg-card)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        animation: "scaleIn 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px",
                }}>🤖</div>
                <h2 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                  AI Habit Suggestions
                </h2>
              </div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Tell us your goals and AI will suggest the perfect habits
              </p>
            </div>
            <button onClick={onClose} style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)", fontSize: "16px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Goal Selection */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "12px" }}>
              SELECT YOUR GOALS ({selectedGoals.length} selected)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {GOALS.map(goal => (
                <button key={goal.id} onClick={() => toggleGoal(goal.id)} style={{
                  padding: "12px 8px", borderRadius: "14px",
                  border: `1px solid ${selectedGoals.includes(goal.id) ? goal.color + "50" : "rgba(255,255,255,0.08)"}`,
                  background: selectedGoals.includes(goal.id) ? `${goal.color}15` : "rgba(255,255,255,0.04)",
                  cursor: "pointer", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: selectedGoals.includes(goal.id) ? "scale(1.05)" : "scale(1)",
                }}>
                  <div style={{ fontSize: "24px", marginBottom: "4px" }}>{goal.icon}</div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: selectedGoals.includes(goal.id) ? goal.color : "var(--text-muted)" }}>
                    {goal.label}
                  </div>
                  {selectedGoals.includes(goal.id) && (
                    <div style={{ fontSize: "10px", color: goal.color, marginTop: "2px" }}>✓ Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {!generated && (
            <button onClick={generateSuggestions} disabled={loading || selectedGoals.length === 0}
              style={{
                width: "100%", padding: "14px", borderRadius: "14px", border: "none",
                background: loading ? "rgba(99,102,241,0.3)" : selectedGoals.length === 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
                backgroundSize: "200% 200%",
                animation: !loading && selectedGoals.length > 0 ? "gradientShift 3s ease infinite" : "none",
                color: selectedGoals.length === 0 ? "var(--text-muted)" : "white",
                fontSize: "15px", fontWeight: 700,
                cursor: loading || selectedGoals.length === 0 ? "not-allowed" : "pointer",
                boxShadow: selectedGoals.length > 0 && !loading ? "0 4px 20px rgba(99,102,241,0.35)" : "none",
                transition: "all 0.3s", marginBottom: "8px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              }}>
              {loading ? (
                <>
                  <span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  AI is analyzing your goals...
                </>
              ) : "🤖 Generate AI Suggestions"}
            </button>
          )}

          {/* Suggestions */}
          {generated && suggestions.length > 0 && (
            <div className="animate-slide-up">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px" }}>
                  🤖 AI RECOMMENDATIONS ({suggestions.length})
                </label>
                <button onClick={() => { setGenerated(false); setSuggestions([]); }}
                  style={{ fontSize: "12px", color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  ↺ Regenerate
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {suggestions.map((s, i) => {
                  const diff = DIFF_COLORS[s.difficulty];
                  const isAdding = adding === s.name;
                  return (
                    <div key={i} style={{
                      padding: "16px", borderRadius: "16px",
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${s.color}25`,
                      position: "relative", overflow: "hidden",
                      animation: `slideUp 0.4s ease ${i * 60}ms both`,
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: s.color }} />
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <span style={{ fontSize: "24px" }}>{s.icon}</span>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{s.name}</p>
                          <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "100px", background: diff.bg, color: diff.color }}>
                            {s.difficulty}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>
                        💡 {s.reason}
                      </p>
                      <button onClick={() => handleAdd(s)} disabled={isAdding}
                        style={{
                          width: "100%", padding: "8px", borderRadius: "10px", border: "none",
                          background: isAdding ? "rgba(34,197,94,0.2)" : `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                          color: isAdding ? "#22c55e" : "white",
                          fontSize: "12px", fontWeight: 700, cursor: isAdding ? "not-allowed" : "pointer",
                          transition: "all 0.2s",
                          boxShadow: `0 2px 8px ${s.color}30`,
                        }}>
                        {isAdding ? "Adding... ⏳" : "+ Add This Habit"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHabitSuggestions;

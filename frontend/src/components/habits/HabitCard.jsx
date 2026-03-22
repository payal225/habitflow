import React, { useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import Confetti from "../shared/Confetti";

const CATEGORY_COLORS = {
  health: { bg: "rgba(239,68,68,0.12)", color: "#f87171", border: "rgba(239,68,68,0.2)" },
  fitness: { bg: "rgba(249,115,22,0.12)", color: "#fb923c", border: "rgba(249,115,22,0.2)" },
  learning: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  mindfulness: { bg: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  productivity: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  social: { bg: "rgba(236,72,153,0.12)", color: "#f472b6", border: "rgba(236,72,153,0.2)" },
  finance: { bg: "rgba(16,185,129,0.12)", color: "#34d399", border: "rgba(16,185,129,0.2)" },
  creativity: { bg: "rgba(99,102,241,0.12)", color: "#818cf8", border: "rgba(99,102,241,0.2)" },
  other: { bg: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "rgba(100,116,139,0.2)" },
};

const DIFFICULTY = {
  easy: { label: "Easy", color: "#22c55e", bg: "rgba(34,197,94,0.12)", xp: 10 },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", xp: 20 },
  hard: { label: "Hard", color: "#ef4444", bg: "rgba(239,68,68,0.12)", xp: 30 },
};

const HabitCard = ({ habit, onUpdate, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpAnim, setXpAnim] = useState(false);
  const [hovered, setHovered] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const isCompleted = habit.completions?.some(c => c.date === today);
  const difficulty = DIFFICULTY[habit.difficulty || "medium"];
  const category = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.other;
  const habitColor = habit.color || "#22c55e";

  const handleToggle = async () => {
    setLoading(true);
    try {
      const data = await api.post(`/habits/${habit._id}/complete`, { date: today });
      onUpdate(data.habit);
      if (data.action === "completed") {
        setShowConfetti(true);
        setXpAnim(true);
        toast.success(`+${difficulty.xp} XP! ${habit.name} done! 🎉`);
        setTimeout(() => setXpAnim(false), 2000);
      } else {
        toast.success("Unmarked ↩️");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this habit?")) return;
    try {
      await api.delete(`/habits/${habit._id}`);
      onDelete(habit._id);
      toast.success("Habit deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: isCompleted
            ? `linear-gradient(135deg, rgba(${habitColor === "#22c55e" ? "34,197,94" : "99,102,241"},0.08), rgba(0,0,0,0))`
            : "var(--bg-card)",
          border: `1px solid ${hovered ? (isCompleted ? habitColor + "40" : "rgba(255,255,255,0.12)") : (isCompleted ? habitColor + "25" : "rgba(255,255,255,0.06)")}`,
          borderRadius: "20px",
          padding: "18px 20px",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hovered ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hovered
            ? `0 12px 30px rgba(0,0,0,0.25), 0 0 0 1px ${habitColor}20`
            : isCompleted
              ? `0 4px 16px ${habitColor}15`
              : "0 2px 8px rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "hidden",
          animation: "fadeIn 0.3s ease",
        }}>

        {/* Left color accent bar */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
          background: isCompleted
            ? `linear-gradient(180deg, ${habitColor}, ${habitColor}60)`
            : `linear-gradient(180deg, ${habitColor}40, transparent)`,
          borderRadius: "20px 0 0 20px",
          transition: "all 0.3s",
        }} />

        {/* XP popup */}
        {xpAnim && (
          <div style={{
            position: "absolute", top: "12px", right: "60px",
            background: `linear-gradient(135deg, ${difficulty.color}, ${difficulty.color}cc)`,
            color: "white", fontSize: "12px", fontWeight: 700,
            padding: "4px 10px", borderRadius: "100px",
            animation: "slideUp 0.3s ease, fadeIn 0.3s ease",
            boxShadow: `0 4px 12px ${difficulty.color}40`,
            zIndex: 10,
          }}>+{difficulty.xp} XP ⚡</div>
        )}

        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", paddingLeft: "8px" }}>
          {/* Complete button */}
          <button onClick={handleToggle} disabled={loading}
            style={{
              width: "32px", height: "32px", borderRadius: "10px", flexShrink: 0,
              border: `2px solid ${isCompleted ? habitColor : "rgba(255,255,255,0.15)"}`,
              background: isCompleted
                ? `linear-gradient(135deg, ${habitColor}, ${habitColor}cc)`
                : "rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              transform: isCompleted ? "scale(1.05)" : "scale(1)",
              boxShadow: isCompleted ? `0 4px 12px ${habitColor}40` : "none",
              marginTop: "2px",
            }}>
            {loading
              ? <span style={{ width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
              : isCompleted
                ? <span style={{ color: "white", fontSize: "14px", fontWeight: 700 }}>✓</span>
                : null}
          </button>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", flex: 1 }}>
                <span style={{ fontSize: "20px" }}>{habit.icon}</span>
                <span style={{
                  fontSize: "15px", fontWeight: 600,
                  color: isCompleted ? "var(--text-muted)" : "var(--text-primary)",
                  textDecoration: isCompleted ? "line-through" : "none",
                  transition: "all 0.3s",
                }}>{habit.name}</span>

                {/* Category badge */}
                <span style={{
                  padding: "2px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700,
                  background: category.bg, color: category.color,
                  border: `1px solid ${category.border}`,
                  letterSpacing: "0.3px",
                }}>{habit.category}</span>

                {/* Difficulty badge */}
                <span style={{
                  padding: "2px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: 700,
                  background: difficulty.bg, color: difficulty.color,
                }}>
                  {difficulty.label === "Easy" ? "🟢" : difficulty.label === "Medium" ? "🟡" : "🔴"} {difficulty.label}
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                <button onClick={() => onEdit(habit)} style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer", fontSize: "13px", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                >✏️</button>
                <button onClick={handleDelete} style={{
                  width: "30px", height: "30px", borderRadius: "8px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                  cursor: "pointer", fontSize: "13px", transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                >🗑️</button>
              </div>
            </div>

            {/* Description */}
            {habit.description && (
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "10px", lineHeight: 1.5 }}>
                {habit.description}
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "14px" }}>🔥</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fb923c" }}>{habit.currentStreak}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>streak</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "14px" }}>⭐</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Best: {habit.longestStreak}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "14px" }}>📈</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{habit.totalCompletions} done</span>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{
                  fontSize: "11px", fontWeight: 700,
                  color: difficulty.color,
                  background: difficulty.bg,
                  padding: "2px 8px", borderRadius: "100px",
                }}>{difficulty.xp} XP/day</span>
              </div>
            </div>

            {/* Completion mini progress */}
            {habit.totalCompletions > 0 && (
              <div style={{ marginTop: "10px" }}>
                <div style={{
                  height: "3px", borderRadius: "2px",
                  background: "rgba(255,255,255,0.06)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%", borderRadius: "2px",
                    background: `linear-gradient(90deg, ${habitColor}, ${habitColor}80)`,
                    width: `${Math.min((habit.currentStreak / Math.max(habit.longestStreak, 1)) * 100, 100)}%`,
                    transition: "width 1s ease",
                    boxShadow: `0 0 6px ${habitColor}60`,
                  }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HabitCard;

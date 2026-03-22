import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const CATEGORIES = ["Career", "Health", "Finance", "Travel", "Learning", "Relationships", "Lifestyle", "Personal"];
const EMOJIS = ["🎯","💪","💰","✈️","📚","❤️","🏠","⭐","🚀","🏆","🌟","🎨","🎵","🌿","🔥","💎","🧠","🌈"];

const VisionBoard = () => {
  const [goals, setGoals] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "Career", emoji: "🎯", deadline: "", color: "#22c55e", achieved: false });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_vision") || "[]");
    setGoals(stored);
  }, []);

  const save = (updated) => {
    localStorage.setItem("ht_vision", JSON.stringify(updated));
    setGoals(updated);
  };

  const handleAdd = () => {
    if (!form.title.trim()) { toast.error("Enter a goal title!"); return; }
    const goal = { ...form, id: Date.now(), createdAt: new Date().toISOString() };
    save([goal, ...goals]);
    setForm({ title: "", description: "", category: "Career", emoji: "🎯", deadline: "", color: "#22c55e", achieved: false });
    setShowAdd(false);
    toast.success("🌟 Vision goal added!");
  };

  const toggleAchieved = (id) => {
    const updated = goals.map(g => g.id === id ? { ...g, achieved: !g.achieved } : g);
    save(updated);
    const goal = goals.find(g => g.id === id);
    if (!goal.achieved) toast.success("🏆 Goal achieved! Congratulations!");
  };

  const handleDelete = (id) => {
    save(goals.filter(g => g.id !== id));
    toast.success("Goal removed");
  };

  const filtered = filter === "all" ? goals : filter === "achieved" ? goals.filter(g => g.achieved) : goals.filter(g => g.category === filter);
  const achievedCount = goals.filter(g => g.achieved).length;

  const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#f59e0b", "#06b6d4", "#ef4444"];

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>🌟 Vision Board</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{achievedCount}/{goals.length} goals achieved</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          padding: "8px 14px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #f59e0b, #f97316)",
          color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(245,158,11,0.3)",
        }}>+ Add Goal</button>
      </div>

      {/* Progress */}
      {goals.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(achievedCount / goals.length) * 100}%`, background: "linear-gradient(90deg, #f59e0b, #22c55e)", borderRadius: "3px", transition: "width 0.8s ease" }} />
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{Math.round((achievedCount / goals.length) * 100)}% of your vision achieved</p>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {["all", "achieved", ...CATEGORIES].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
            border: `1px solid ${filter === f ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`,
            background: filter === f ? "rgba(245,158,11,0.15)" : "transparent",
            color: filter === f ? "#fbbf24" : "var(--text-muted)",
            cursor: "pointer", transition: "all 0.2s",
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "16px", animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <input className="input" placeholder="Goal title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <textarea className="input" placeholder="Describe your goal..." value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            style={{ marginBottom: "8px", resize: "none", minHeight: "70px" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
            <input type="date" className="input" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                  style={{ width: "24px", height: "24px", borderRadius: "50%", background: c, border: `2px solid ${form.color === c ? "white" : "transparent"}`, cursor: "pointer", transition: "all 0.2s", transform: form.color === c ? "scale(1.2)" : "scale(1)" }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
            {EMOJIS.map(e => (
              <button key={e} type="button" onClick={() => setForm({ ...form, emoji: e })}
                style={{ width: "32px", height: "32px", borderRadius: "8px", fontSize: "16px", border: `1px solid ${form.emoji === e ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)"}`, background: form.emoji === e ? "rgba(255,255,255,0.12)" : "transparent", cursor: "pointer" }}>
                {e}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
            <button onClick={handleAdd} style={{ flex: 2, padding: "10px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Add to Vision Board 🌟</button>
          </div>
        </div>
      )}

      {/* Goals grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌟</div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No goals yet. Add your first vision goal!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {filtered.map(goal => (
            <div key={goal.id} style={{
              padding: "16px", borderRadius: "16px",
              background: goal.achieved ? `${goal.color}10` : "rgba(255,255,255,0.04)",
              border: `1px solid ${goal.achieved ? goal.color + "40" : "rgba(255,255,255,0.08)"}`,
              position: "relative", overflow: "hidden",
              opacity: goal.achieved ? 0.8 : 1,
              transition: "all 0.3s",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: goal.color }} />
              {goal.achieved && (
                <div style={{ position: "absolute", top: "8px", right: "8px", fontSize: "16px" }}>🏆</div>
              )}
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{goal.emoji}</div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px", textDecoration: goal.achieved ? "line-through" : "none" }}>{goal.title}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", lineHeight: 1.4 }}>{goal.description}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", background: `${goal.color}20`, color: goal.color, fontWeight: 700 }}>{goal.category}</span>
                {goal.deadline && <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>📅 {goal.deadline}</span>}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => toggleAchieved(goal.id)} style={{
                  flex: 1, padding: "7px", borderRadius: "10px", border: "none", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                  background: goal.achieved ? "rgba(34,197,94,0.15)" : `${goal.color}20`,
                  color: goal.achieved ? "#22c55e" : goal.color,
                }}>{goal.achieved ? "✅ Done!" : "Mark Done"}</button>
                <button onClick={() => handleDelete(goal.id)} style={{ padding: "7px 10px", borderRadius: "10px", border: "none", background: "rgba(239,68,68,0.1)", color: "#f87171", cursor: "pointer", fontSize: "11px" }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisionBoard;

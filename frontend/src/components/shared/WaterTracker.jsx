import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const GOAL = 8;

const WaterTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const [animating, setAnimating] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_water") || "{}");
    setGlasses(stored[today] || 0);
  }, []);

  const save = (val) => {
    const stored = JSON.parse(localStorage.getItem("ht_water") || "{}");
    stored[today] = val;
    localStorage.setItem("ht_water", JSON.stringify(stored));
  };

  const addGlass = () => {
    if (glasses >= GOAL) { toast("Already at daily goal! 🎉"); return; }
    const newVal = glasses + 1;
    setGlasses(newVal);
    setAnimating(newVal - 1);
    save(newVal);
    setTimeout(() => setAnimating(null), 400);
    if (newVal === GOAL) toast.success("Daily water goal reached! 💧🎉");
    else toast.success(`Glass ${newVal}/${GOAL} 💧`);
  };

  const removeGlass = () => {
    if (glasses === 0) return;
    const newVal = glasses - 1;
    setGlasses(newVal);
    save(newVal);
  };

  const percentage = Math.round((glasses / GOAL) * 100);

  const getColor = () => {
    if (percentage >= 100) return "#22c55e";
    if (percentage >= 60) return "#3b82f6";
    if (percentage >= 30) return "#60a5fa";
    return "#94a3b8";
  };

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "20px", padding: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
            💧 Water Intake
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Daily goal: {GOAL} glasses</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "28px", fontWeight: 800, color: getColor(), fontFamily: "Cormorant Garamond, sans-serif" }}>
            {glasses}<span style={{ fontSize: "14px", color: "var(--text-muted)" }}>/{GOAL}</span>
          </div>
          <div style={{ fontSize: "11px", color: getColor(), fontWeight: 600 }}>{percentage}%</div>
        </div>
      </div>

      {/* Glass grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "6px", marginBottom: "16px" }}>
        {Array.from({ length: GOAL }, (_, i) => (
          <div key={i} onClick={i === glasses ? addGlass : i < glasses ? removeGlass : addGlass}
            style={{
              aspectRatio: "1",
              borderRadius: "10px",
              background: i < glasses
                ? `linear-gradient(180deg, ${getColor()}cc, ${getColor()})`
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${i < glasses ? getColor() + "40" : "rgba(255,255,255,0.08)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              transform: animating === i ? "scale(1.3)" : i < glasses ? "scale(1.05)" : "scale(1)",
              boxShadow: i < glasses ? `0 4px 12px ${getColor()}30` : "none",
            }}>
            {i < glasses ? "💧" : "○"}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: "14px" }}>
        <div style={{
          height: "100%", borderRadius: "3px",
          width: `${percentage}%`,
          background: `linear-gradient(90deg, #60a5fa, ${getColor()})`,
          transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: `0 0 8px ${getColor()}60`,
        }} />
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={removeGlass} disabled={glasses === 0}
          style={{
            flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)",
            cursor: glasses === 0 ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: 600,
            opacity: glasses === 0 ? 0.4 : 1, transition: "all 0.2s",
          }}>− Remove</button>
        <button onClick={addGlass} disabled={glasses >= GOAL}
          style={{
            flex: 2, padding: "10px", borderRadius: "12px", border: "none",
            background: glasses >= GOAL ? "rgba(34,197,94,0.2)" : `linear-gradient(135deg, #3b82f6, #60a5fa)`,
            color: "white", cursor: glasses >= GOAL ? "not-allowed" : "pointer",
            fontSize: "13px", fontWeight: 700,
            boxShadow: glasses < GOAL ? "0 4px 15px rgba(59,130,246,0.3)" : "none",
            transition: "all 0.3s",
          }}>
          {glasses >= GOAL ? "✅ Goal Reached!" : "💧 Add Glass"}
        </button>
      </div>

      {/* Tip */}
      <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "12px" }}>
        {glasses === 0 ? "Start hydrating! Your body needs water 💧"
          : glasses < 4 ? "Keep going! Halfway there 💪"
          : glasses < GOAL ? "Almost there! Just a few more glasses 🌊"
          : "Amazing! You've hit your water goal today! 🎉"}
      </p>
    </div>
  );
};

export default WaterTracker;

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";

const WeightTracker = () => {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg");
  const [goal, setGoal] = useState("");
  const [history, setHistory] = useState([]);
  const [note, setNote] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_weight") || "[]");
    const goalStored = localStorage.getItem("ht_weight_goal") || "";
    const unitStored = localStorage.getItem("ht_weight_unit") || "kg";
    setHistory(stored);
    setGoal(goalStored);
    setUnit(unitStored);
    const todayEntry = stored.find(e => e.date === today);
    if (todayEntry) setWeight(todayEntry.weight);
  }, []);

  const handleSave = () => {
    if (!weight || isNaN(weight)) { toast.error("Enter a valid weight!"); return; }
    const entry = { date: today, weight: parseFloat(weight), note, unit };
    const stored = JSON.parse(localStorage.getItem("ht_weight") || "[]");
    const filtered = stored.filter(e => e.date !== today);
    const updated = [entry, ...filtered].sort((a, b) => a.date.localeCompare(b.date)).slice(-30);
    localStorage.setItem("ht_weight", JSON.stringify(updated));
    localStorage.setItem("ht_weight_goal", goal);
    localStorage.setItem("ht_weight_unit", unit);
    setHistory(updated);
    toast.success(`Weight logged: ${weight} ${unit} 💪`);
    setNote("");
  };

  const latest = history[history.length - 1];
  const first = history[0];
  const change = latest && first && history.length > 1 ? (latest.weight - first.weight).toFixed(1) : null;
  const chartData = history.slice(-14).map(e => ({
    date: new Date(e.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: e.weight,
    goal: goal ? parseFloat(goal) : null,
  }));

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>⚖️ Weight Tracker</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Track your fitness progress</p>
        </div>
        {latest && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "26px", fontWeight: 800, color: "#f97316", fontFamily: "Cormorant Garamond, sans-serif" }}>{latest.weight} <span style={{ fontSize: "14px" }}>{unit}</span></div>
            {change && <div style={{ fontSize: "11px", color: parseFloat(change) < 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{parseFloat(change) > 0 ? "+" : ""}{change} {unit}</div>}
          </div>
        )}
      </div>

      {/* Input row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: "8px", marginBottom: "10px" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>⚖️</span>
          <input type="number" className="input" placeholder="Today's weight" value={weight}
            onChange={e => setWeight(e.target.value)} style={{ paddingLeft: "34px" }} />
        </div>
        <select className="input" value={unit} onChange={e => { setUnit(e.target.value); localStorage.setItem("ht_weight_unit", e.target.value); }}>
          <option value="kg">kg</option>
          <option value="lbs">lbs</option>
        </select>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🎯</span>
          <input type="number" className="input" placeholder="Goal weight" value={goal}
            onChange={e => setGoal(e.target.value)} style={{ paddingLeft: "34px" }} />
        </div>
      </div>

      <input type="text" className="input" placeholder="Add a note (optional)..." value={note}
        onChange={e => setNote(e.target.value)} style={{ marginBottom: "10px" }} />

      <button onClick={handleSave} style={{
        width: "100%", padding: "11px", borderRadius: "12px", border: "none",
        background: "linear-gradient(135deg, #f97316, #fb923c)",
        color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer",
        boxShadow: "0 4px 15px rgba(249,115,22,0.3)", marginBottom: "16px",
      }}>Log Weight ⚖️</button>

      {/* Chart */}
      {chartData.length > 1 && (
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>LAST 14 DAYS</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
              <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 4 }} name={`Weight (${unit})`} />
              {goal && <Line type="monotone" dataKey="goal" stroke="#22c55e" strokeWidth={1} strokeDasharray="5 5" dot={false} name="Goal" />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeightTracker;

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const QUALITY = [
  { label: "Terrible", emoji: "😴", color: "#ef4444", value: 1 },
  { label: "Poor", emoji: "😪", color: "#f97316", value: 2 },
  { label: "Okay", emoji: "😐", color: "#f59e0b", value: 3 },
  { label: "Good", emoji: "😊", color: "#22c55e", value: 4 },
  { label: "Amazing", emoji: "🌟", color: "#8b5cf6", value: 5 },
];

const SleepTracker = () => {
  const [bedtime, setBedtime] = useState("22:00");
  const [wakeTime, setWakeTime] = useState("06:00");
  const [quality, setQuality] = useState(null);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_sleep") || "[]");
    setHistory(stored);
    const todayEntry = stored.find(s => s.date === today);
    if (todayEntry) {
      setBedtime(todayEntry.bedtime);
      setWakeTime(todayEntry.wakeTime);
      setQuality(todayEntry.quality);
      setSaved(true);
    }
  }, []);

  const calcDuration = () => {
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);
    let mins = (wh * 60 + wm) - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return { hours: Math.floor(mins / 60), mins: mins % 60, total: mins };
  };

  const handleSave = () => {
    if (!quality) { toast.error("Please rate your sleep quality!"); return; }
    const dur = calcDuration();
    const entry = { date: today, bedtime, wakeTime, quality, duration: dur.total };
    const stored = JSON.parse(localStorage.getItem("ht_sleep") || "[]");
    const filtered = stored.filter(s => s.date !== today);
    const updated = [entry, ...filtered].slice(0, 30);
    localStorage.setItem("ht_sleep", JSON.stringify(updated));
    setHistory(updated);
    setSaved(true);
    toast.success(`Sleep logged! ${dur.hours}h ${dur.mins}m 🌙`);
  };

  const dur = calcDuration();
  const selectedQ = quality ? QUALITY.find(q => q.value === quality) : null;

  const getSleepColor = () => {
    if (dur.total >= 480) return "#22c55e";
    if (dur.total >= 360) return "#f59e0b";
    return "#ef4444";
  };

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().split("T")[0];
    return history.find(h => h.date === date) || null;
  });

  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "20px", padding: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
            🌙 Sleep Tracker
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Track your sleep quality</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "24px", fontWeight: 800, color: getSleepColor(), fontFamily: "Syne, sans-serif" }}>
            {dur.hours}h {dur.mins}m
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>tonight</div>
        </div>
      </div>

      {/* Time inputs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <div>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>BEDTIME</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🌙</span>
            <input type="time" value={bedtime} onChange={e => { setBedtime(e.target.value); setSaved(false); }}
              className="input" style={{ paddingLeft: "34px", fontSize: "14px", fontFamily: "JetBrains Mono, monospace" }} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>WAKE TIME</label>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>☀️</span>
            <input type="time" value={wakeTime} onChange={e => { setWakeTime(e.target.value); setSaved(false); }}
              className="input" style={{ paddingLeft: "34px", fontSize: "14px", fontFamily: "JetBrains Mono, monospace" }} />
          </div>
        </div>
      </div>

      {/* Sleep quality */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "10px" }}>SLEEP QUALITY</label>
        <div style={{ display: "flex", gap: "6px" }}>
          {QUALITY.map(q => (
            <button key={q.value} onClick={() => { setQuality(q.value); setSaved(false); }}
              style={{
                flex: 1, padding: "10px 4px", borderRadius: "12px", border: "none",
                background: quality === q.value ? `${q.color}20` : "rgba(255,255,255,0.05)",
                cursor: "pointer", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                transform: quality === q.value ? "scale(1.08)" : "scale(1)",
                outline: quality === q.value ? `2px solid ${q.color}60` : "none",
              }}>
              <div style={{ fontSize: "20px", marginBottom: "3px" }}>{q.emoji}</div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: quality === q.value ? q.color : "var(--text-muted)" }}>{q.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Save button */}
      <button onClick={handleSave}
        style={{
          width: "100%", padding: "11px", borderRadius: "12px", border: "none",
          background: saved ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, #8b5cf6, #6366f1)",
          color: saved ? "#22c55e" : "white",
          fontSize: "13px", fontWeight: 700, cursor: "pointer",
          transition: "all 0.3s", marginBottom: "16px",
          boxShadow: saved ? "none" : "0 4px 15px rgba(139,92,246,0.3)",
        }}>
        {saved ? "✅ Sleep Logged!" : "Save Sleep Data 🌙"}
      </button>

      {/* Last 7 days */}
      <div>
        <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>LAST 7 DAYS</label>
        <div style={{ display: "flex", gap: "4px" }}>
          {last7.map((entry, i) => {
            const date = new Date(Date.now() - (6 - i) * 86400000);
            const dayLabel = date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
            const hours = entry ? Math.floor(entry.duration / 60) : 0;
            const barHeight = entry ? Math.min((hours / 10) * 100, 100) : 0;
            const barColor = hours >= 8 ? "#22c55e" : hours >= 6 ? "#f59e0b" : hours > 0 ? "#ef4444" : "rgba(255,255,255,0.08)";
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "100%", height: "50px", borderRadius: "6px", background: "rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0,
                    height: `${barHeight}%`, background: barColor,
                    borderRadius: "6px", transition: "height 0.8s ease",
                    boxShadow: entry ? `0 0 6px ${barColor}60` : "none",
                  }} />
                </div>
                <span style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 600 }}>{dayLabel}</span>
                {entry && <span style={{ fontSize: "8px", color: barColor }}>{hours}h</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SleepTracker;
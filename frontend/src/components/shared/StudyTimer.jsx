import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const SUBJECTS = [
  { name: "Mathematics", icon: "🔢", color: "#3b82f6" },
  { name: "Science", icon: "🔬", color: "#22c55e" },
  { name: "English", icon: "📝", color: "#ec4899" },
  { name: "History", icon: "📜", color: "#f59e0b" },
  { name: "Coding", icon: "💻", color: "#8b5cf6" },
  { name: "Other", icon: "📚", color: "#94a3b8" },
];

const StudyTimer = () => {
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [customSubject, setCustomSubject] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_study") || "[]");
    setSessions(stored);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleStop = () => {
    if (seconds < 60) { toast.error("Study for at least 1 minute!"); return; }
    const session = {
      subject: customSubject || subject.name,
      icon: subject.icon,
      color: subject.color,
      duration: seconds,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
      id: Date.now(),
    };
    const updated = [session, ...sessions].slice(0, 50);
    localStorage.setItem("ht_study", JSON.stringify(updated));
    setSessions(updated);
    setRunning(false);
    setSeconds(0);
    toast.success(`${formatTime(session.duration)} of ${session.subject} logged! 🎓`);
  };

  const todaySessions = sessions.filter(s => s.date === new Date().toISOString().split("T")[0]);
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.duration, 0);
  const weekTotal = sessions.filter(s => (new Date() - new Date(s.date)) / 86400000 <= 7).reduce((sum, s) => sum + s.duration, 0);

  const subjectTotals = SUBJECTS.map(sub => ({
    ...sub,
    total: sessions.filter(s => s.subject === sub.name).reduce((sum, s) => sum + s.duration, 0),
  })).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

  const progressDeg = Math.min((seconds % 3600) / 3600 * 360, 360);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>📖 Study Timer</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Track your study sessions</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#8b5cf6" }}>Today: {formatTime(todayTotal)}</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Week: {formatTime(weekTotal)}</div>
        </div>
      </div>

      {/* Subject selector */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
        {SUBJECTS.map(sub => (
          <button key={sub.name} onClick={() => setSubject(sub)} style={{
            padding: "6px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: 600,
            border: `1px solid ${subject.name === sub.name ? sub.color + "60" : "rgba(255,255,255,0.08)"}`,
            background: subject.name === sub.name ? `${sub.color}15` : "transparent",
            color: subject.name === sub.name ? sub.color : "var(--text-muted)",
            cursor: "pointer", transition: "all 0.2s",
          }}>{sub.icon} {sub.name}</button>
        ))}
      </div>

      <input type="text" className="input" placeholder="Or type custom subject..." value={customSubject}
        onChange={e => setCustomSubject(e.target.value)} style={{ marginBottom: "16px" }} />

      {/* Timer display */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{
          width: "140px", height: "140px", borderRadius: "50%", margin: "0 auto 16px",
          background: `conic-gradient(${subject.color} ${progressDeg}deg, rgba(255,255,255,0.06) 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: running ? `0 0 30px ${subject.color}40` : "none",
          transition: "box-shadow 0.5s",
          position: "relative",
        }}>
          <div style={{
            width: "110px", height: "110px", borderRadius: "50%",
            background: "var(--bg-card)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: "28px", marginBottom: "2px" }}>{subject.icon}</span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "22px", fontWeight: 700, color: subject.color }}>{formatTime(seconds)}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {!running ? (
            <button onClick={() => setRunning(true)} style={{
              padding: "12px 32px", borderRadius: "14px", border: "none",
              background: `linear-gradient(135deg, ${subject.color}, ${subject.color}cc)`,
              color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer",
              boxShadow: `0 4px 15px ${subject.color}40`,
            }}>▶ Start Studying</button>
          ) : (
            <>
              <button onClick={() => setRunning(false)} style={{
                padding: "12px 20px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.06)", color: "var(--text-primary)",
                fontSize: "14px", fontWeight: 700, cursor: "pointer",
              }}>⏸ Pause</button>
              <button onClick={handleStop} style={{
                padding: "12px 20px", borderRadius: "14px", border: "none",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
              }}>✅ Save Session</button>
            </>
          )}
        </div>
      </div>

      {/* Subject breakdown */}
      {subjectTotals.length > 0 && (
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>SUBJECT BREAKDOWN</p>
          {subjectTotals.map((sub, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "16px" }}>{sub.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600 }}>{sub.name}</span>
                  <span style={{ fontSize: "11px", color: sub.color, fontWeight: 700 }}>{formatTime(sub.total)}</span>
                </div>
                <div style={{ height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((sub.total / Math.max(...subjectTotals.map(s => s.total))) * 100, 100)}%`, background: sub.color, borderRadius: "2px", transition: "width 0.8s ease" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent sessions */}
      {todaySessions.length > 0 && (
        <div style={{ marginTop: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "8px" }}>TODAY'S SESSIONS</p>
          {todaySessions.slice(0, 4).map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "5px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span>{s.icon}</span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{s.subject}</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{formatTime(s.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyTimer;

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const REMINDER_SOUNDS = ["🔔", "⏰", "📢", "🎵", "🌅"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const NotificationReminders = ({ habits }) => {
  const [reminders, setReminders] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [permission, setPermission] = useState("default");
  const [form, setForm] = useState({
    title: "", message: "", time: "08:00",
    days: [1, 2, 3, 4, 5], sound: "🔔", habitId: "", enabled: true
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_reminders") || "[]");
    setReminders(stored);
    if ("Notification" in window) setPermission(Notification.permission);
    checkReminders(stored);
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") toast.success("Notifications enabled! 🔔");
      else toast.error("Please enable notifications in browser settings");
    }
  };

  const checkReminders = (rems) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    const currentDay = now.getDay();
    rems.forEach(rem => {
      if (rem.enabled && rem.time === currentTime && rem.days.includes(currentDay)) {
        if (permission === "granted") {
          new Notification(rem.title || "HabitFlow Reminder", {
            body: rem.message || "Time to complete your habits!",
            icon: "/favicon.ico",
          });
        }
      }
    });
  };

  const save = (updated) => {
    localStorage.setItem("ht_reminders", JSON.stringify(updated));
    setReminders(updated);
  };

  const handleAdd = () => {
    if (!form.title.trim()) { toast.error("Enter a reminder title!"); return; }
    if (form.days.length === 0) { toast.error("Select at least one day!"); return; }
    const reminder = { ...form, id: Date.now() };
    save([...reminders, reminder]);
    setForm({ title: "", message: "", time: "08:00", days: [1, 2, 3, 4, 5], sound: "🔔", habitId: "", enabled: true });
    setShowAdd(false);
    toast.success("Reminder set! 🔔");
  };

  const toggleReminder = (id) => {
    save(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteReminder = (id) => {
    save(reminders.filter(r => r.id !== id));
    toast.success("Reminder deleted");
  };

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const testNotification = () => {
    if (permission === "granted") {
      new Notification("HabitFlow Test 🌱", { body: "Your notifications are working perfectly!" });
      toast.success("Test notification sent!");
    } else {
      requestPermission();
    }
  };

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>🔔 Reminders</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{reminders.filter(r => r.enabled).length} active reminders</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          padding: "8px 14px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #f59e0b, #f97316)",
          color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer",
        }}>+ Add</button>
      </div>

      {/* Permission banner */}
      {permission !== "granted" && (
        <div style={{ padding: "14px", borderRadius: "14px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "#fbbf24" }}>🔔 Enable Notifications</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Allow notifications to receive habit reminders</p>
          </div>
          <button onClick={requestPermission} style={{ padding: "8px 14px", borderRadius: "10px", border: "none", background: "rgba(245,158,11,0.2)", color: "#fbbf24", fontSize: "12px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>Enable</button>
        </div>
      )}

      {/* Test notification */}
      {permission === "granted" && (
        <button onClick={testNotification} style={{ width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.08)", color: "#4ade80", fontSize: "12px", fontWeight: 600, cursor: "pointer", marginBottom: "14px" }}>
          🔔 Test Notification
        </button>
      )}

      {/* Add reminder modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
          <div style={{ width: "100%", maxWidth: "460px", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", animation: "scaleIn 0.3s ease" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(249,115,22,0.05))" }}>
              <h3 style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>🔔 New Reminder</h3>
              <button onClick={() => setShowAdd(false)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>TITLE</label>
                <input className="input" placeholder="e.g. Morning Habits Time!" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>MESSAGE</label>
                <input className="input" placeholder="e.g. Don't forget your habits!" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>TIME</label>
                  <input type="time" className="input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{ fontFamily: "JetBrains Mono, monospace" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>SOUND</label>
                  <div style={{ display: "flex", gap: "4px" }}>
                    {REMINDER_SOUNDS.map(s => (
                      <button key={s} onClick={() => setForm({ ...form, sound: s })}
                        style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `1px solid ${form.sound === s ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`, background: form.sound === s ? "rgba(245,158,11,0.15)" : "transparent", cursor: "pointer", fontSize: "16px" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>REPEAT ON</label>
                <div style={{ display: "flex", gap: "6px" }}>
                  {DAYS.map((day, i) => (
                    <button key={i} onClick={() => toggleDay(i)}
                      style={{ flex: 1, padding: "8px 4px", borderRadius: "10px", border: `1px solid ${form.days.includes(i) ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.08)"}`, background: form.days.includes(i) ? "rgba(245,158,11,0.15)" : "transparent", color: form.days.includes(i) ? "#fbbf24" : "var(--text-muted)", fontSize: "10px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              {habits?.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "6px" }}>LINKED HABIT (optional)</label>
                  <select className="input" value={form.habitId} onChange={e => setForm({ ...form, habitId: e.target.value })}>
                    <option value="">No specific habit</option>
                    {habits.map(h => <option key={h._id} value={h._id}>{h.icon} {h.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button onClick={handleAdd} style={{ flex: 2, padding: "11px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Set Reminder 🔔</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminders list */}
      {reminders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔔</div>
          <p style={{ fontSize: "13px" }}>No reminders yet. Add one to stay on track!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {reminders.map(rem => (
            <div key={rem.id} style={{ padding: "14px 16px", borderRadius: "14px", background: rem.enabled ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${rem.enabled ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`, transition: "all 0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{rem.sound}</span>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: rem.enabled ? "var(--text-primary)" : "var(--text-muted)" }}>{rem.title}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{rem.message}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "14px", fontWeight: 700, color: rem.enabled ? "#fbbf24" : "var(--text-muted)" }}>{rem.time}</span>
                  <button onClick={() => toggleReminder(rem.id)} style={{ width: "40px", height: "22px", borderRadius: "11px", border: "none", background: rem.enabled ? "#f59e0b" : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "white", position: "absolute", top: "3px", left: rem.enabled ? "21px" : "3px", transition: "left 0.3s" }} />
                  </button>
                  <button onClick={() => deleteReminder(rem.id)} style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", border: "none", color: "#f87171", cursor: "pointer", fontSize: "12px" }}>✕</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                {DAYS.map((day, i) => (
                  <span key={i} style={{ padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: 700, background: rem.days.includes(i) ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)", color: rem.days.includes(i) ? "#fbbf24" : "var(--text-muted)" }}>{day}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationReminders;

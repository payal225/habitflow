import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const MOODS = ["😢", "😕", "😐", "😊", "🤩"];
const TAGS = ["productive", "tired", "motivated", "stressed", "happy", "focused", "anxious", "calm", "energetic", "grateful"];

const HabitJournal = () => {
  const [entries, setEntries] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [form, setForm] = useState({ title: "", content: "", mood: 3, tags: [], gratitude: "", wins: "", improvements: "" });
  const [viewEntry, setViewEntry] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_journal") || "[]");
    setEntries(stored);
    const todayEntry = stored.find(e => e.date === new Date().toISOString().split("T")[0]);
    if (todayEntry) setForm({ ...todayEntry });
  }, []);

  const save = (updated) => {
    localStorage.setItem("ht_journal", JSON.stringify(updated));
    setEntries(updated);
  };

  const handleSave = () => {
    if (!form.content.trim() && !form.title.trim()) { toast.error("Write something first!"); return; }
    const entry = {
      ...form,
      date: selectedDate,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      wordCount: form.content.split(" ").filter(Boolean).length,
    };
    const filtered = entries.filter(e => e.date !== selectedDate);
    const updated = [entry, ...filtered].sort((a, b) => b.date.localeCompare(a.date));
    save(updated);
    setShowAdd(false);
    toast.success("Journal entry saved! 📔");
  };

  const handleDelete = (id) => {
    save(entries.filter(e => e.id !== id));
    setViewEntry(null);
    toast.success("Entry deleted");
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const filtered = entries.filter(e =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    e.content?.toLowerCase().includes(search.toLowerCase())
  );

  const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
  const avgMood = entries.length > 0 ? (entries.reduce((sum, e) => sum + (e.mood || 3), 0) / entries.length).toFixed(1) : 0;

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>📔 Habit Journal</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{entries.length} entries • {totalWords} words written</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          padding: "8px 14px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #ec4899, #f472b6)",
          color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(236,72,153,0.3)",
        }}>+ Write</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "Entries", value: entries.length, color: "#ec4899" },
          { label: "Avg Mood", value: `${MOODS[Math.round(avgMood) - 1] || "😐"}`, color: "#f59e0b" },
          { label: "Words", value: totalWords, color: "#8b5cf6" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}20`, textAlign: "center" }}>
            <div style={{ fontSize: "20px", fontWeight: 800, color: s.color, fontFamily: "Black Han Sans, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "14px" }}>
        <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
        <input className="input" placeholder="Search journal..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "38px" }} />
      </div>

      {/* Add entry modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
          <div style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "scaleIn 0.3s ease" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.05))" }}>
              <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>📔 Journal Entry</h3>
              <button onClick={() => setShowAdd(false)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              {/* Date & Title */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <input type="date" className="input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                <input className="input" placeholder="Entry title (optional)" value={form.title || ""}
                  onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              {/* Mood */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>HOW ARE YOU FEELING?</label>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  {MOODS.map((m, i) => (
                    <button key={i} onClick={() => setForm({ ...form, mood: i + 1 })}
                      style={{ fontSize: "28px", background: "none", border: `2px solid ${form.mood === i + 1 ? "#ec4899" : "transparent"}`, borderRadius: "12px", padding: "6px 10px", cursor: "pointer", transition: "all 0.2s", transform: form.mood === i + 1 ? "scale(1.15)" : "scale(1)" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>TODAY'S REFLECTION</label>
                <textarea className="input" placeholder="Write about your day, thoughts, feelings..." value={form.content || ""}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  style={{ minHeight: "120px", resize: "vertical" }} />
              </div>

              {/* Gratitude */}
              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>🙏 GRATITUDE</label>
                <textarea className="input" placeholder="What are you grateful for today?" value={form.gratitude || ""}
                  onChange={e => setForm({ ...form, gratitude: e.target.value })}
                  style={{ minHeight: "70px", resize: "none" }} />
              </div>

              {/* Wins & Improvements */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>🏆 TODAY'S WINS</label>
                  <textarea className="input" placeholder="What went well?" value={form.wins || ""}
                    onChange={e => setForm({ ...form, wins: e.target.value })}
                    style={{ minHeight: "80px", resize: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>💡 IMPROVEMENTS</label>
                  <textarea className="input" placeholder="What to improve?" value={form.improvements || ""}
                    onChange={e => setForm({ ...form, improvements: e.target.value })}
                    style={{ minHeight: "80px", resize: "none" }} />
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>TAGS</label>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      style={{ padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", border: `1px solid ${form.tags?.includes(tag) ? "#ec4899" : "rgba(255,255,255,0.1)"}`, background: form.tags?.includes(tag) ? "rgba(236,72,153,0.15)" : "transparent", color: form.tags?.includes(tag) ? "#f472b6" : "var(--text-muted)" }}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "10px" }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 2, padding: "11px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(236,72,153,0.3)" }}>Save Entry 📔</button>
            </div>
          </div>
        </div>
      )}

      {/* View entry modal */}
      {viewEntry && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}>
          <div style={{ width: "100%", maxWidth: "560px", maxHeight: "85vh", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "scaleIn 0.3s ease" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{viewEntry.date}</p>
                <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{viewEntry.title || "Journal Entry"}</h3>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleDelete(viewEntry.id)} style={{ padding: "7px 12px", borderRadius: "10px", background: "rgba(239,68,68,0.1)", border: "none", color: "#f87171", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>🗑️ Delete</button>
                <button onClick={() => setViewEntry(null)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: "rgba(255,255,255,0.08)", border: "none", color: "var(--text-primary)", cursor: "pointer" }}>✕</button>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{MOODS[(viewEntry.mood || 3) - 1]}</div>
              {viewEntry.content && <p style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.8, marginBottom: "16px", whiteSpace: "pre-wrap" }}>{viewEntry.content}</p>}
              {viewEntry.gratitude && (
                <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: "10px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#fbbf24", marginBottom: "6px" }}>🙏 GRATITUDE</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{viewEntry.gratitude}</p>
                </div>
              )}
              {viewEntry.wins && (
                <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "10px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#4ade80", marginBottom: "6px" }}>🏆 WINS</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{viewEntry.wins}</p>
                </div>
              )}
              {viewEntry.improvements && (
                <div style={{ padding: "12px", borderRadius: "12px", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: "10px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#a78bfa", marginBottom: "6px" }}>💡 IMPROVEMENTS</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{viewEntry.improvements}</p>
                </div>
              )}
              {viewEntry.tags?.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
                  {viewEntry.tags.map(tag => (
                    <span key={tag} style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "11px", background: "rgba(236,72,153,0.1)", color: "#f472b6", border: "1px solid rgba(236,72,153,0.2)" }}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Entries list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📔</div>
          <p style={{ fontSize: "13px" }}>No journal entries yet. Start writing!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filtered.map(entry => (
            <div key={entry.id} onClick={() => setViewEntry(entry)}
              style={{ padding: "14px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "20px" }}>{MOODS[(entry.mood || 3) - 1]}</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{entry.title || "Journal Entry"}</span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{entry.date}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{entry.content}</p>
              {entry.tags?.length > 0 && (
                <div style={{ display: "flex", gap: "4px", marginTop: "8px", flexWrap: "wrap" }}>
                  {entry.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ padding: "2px 8px", borderRadius: "100px", fontSize: "10px", background: "rgba(236,72,153,0.1)", color: "#f472b6" }}>#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitJournal;

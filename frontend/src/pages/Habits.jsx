import React, { useState, useEffect } from "react";
import api from "../utils/api";
import HabitCard from "../components/habits/HabitCard";
import HabitForm from "../components/habits/HabitForm";
import HabitTemplates from "../components/habits/HabitTemplates";
import HabitShare from "../components/habits/HabitShare";
import Spinner from "../components/shared/Spinner";
import WaterTracker from "../components/shared/WaterTracker";
import SleepTracker from "../components/shared/SleepTracker";

const CATEGORIES = ["all","health","fitness","learning","mindfulness","productivity","social","finance","creativity","other"];

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [shareHabit, setShareHabit] = useState(null);
  const [editHabit, setEditHabit] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("habits");

  useEffect(() => {
    api.get("/habits").then(data => {
      setHabits(data.habits);
      setLoading(false);
    });
  }, []);

  const filtered = habits.filter(h => {
    const matchCat = filter === "all" || h.category === filter;
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleUpdate = (updated) => setHabits(prev => prev.map(h => h._id === updated._id ? { ...h, ...updated } : h));
  const handleDelete = (id) => setHabits(prev => prev.filter(h => h._id !== id));
  const handleSave = (habit) => {
    setHabits(prev => editHabit ? prev.map(h => h._id === habit._id ? habit : h) : [habit, ...prev]);
    setEditHabit(null);
  };
  const handleEdit = (habit) => { setEditHabit(habit); setShowForm(true); };
  const handleShare = (habit) => setShareHabit(habit);

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: "26px", fontWeight: 800, color: "var(--text-primary)" }}>
          My Habits ✅
        </h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setShowTemplates(true)} style={{
            padding: "10px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(99,102,241,0.15)", color: "#a78bfa",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            transition: "all 0.2s",
          }}>🎯 Templates</button>
          <button onClick={() => { setEditHabit(null); setShowForm(true); }} style={{
            padding: "10px 16px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 15px rgba(34,197,94,0.3)",
            transition: "all 0.2s",
          }}>+ New Habit</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", padding: "4px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { id: "habits", label: "Habits", icon: "✅" },
          { id: "water", label: "Water", icon: "💧" },
          { id: "sleep", label: "Sleep", icon: "🌙" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: "10px", borderRadius: "11px", border: "none",
            background: activeTab === tab.id ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
            fontSize: "13px", fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: activeTab === tab.id ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
          }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Water Tab */}
      {activeTab === "water" && (
        <div className="animate-slide-up">
          <WaterTracker />
        </div>
      )}

      {/* Sleep Tab */}
      {activeTab === "sleep" && (
        <div className="animate-slide-up">
          <SleepTracker />
        </div>
      )}

      {/* Habits Tab */}
      {activeTab === "habits" && (
        <div className="space-y-4 animate-slide-up">
          {/* Search & Filter */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
              <input className="input" placeholder="Search habits..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: "44px" }} />
            </div>
            <select className="input" style={{ width: "160px" }}
              value={filter} onChange={e => setFilter(e.target.value)}>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { label: "Total", value: habits.length, color: "#22c55e" },
              { label: "Active", value: habits.filter(h => h.isActive !== false).length, color: "#3b82f6" },
              { label: "Completed Today", value: habits.filter(h => h.completions?.some(c => c.date === new Date().toISOString().split("T")[0])).length, color: "#8b5cf6" },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, padding: "12px", borderRadius: "14px", textAlign: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Habits list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", borderRadius: "20px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                {habits.length === 0 ? "No habits yet" : "No habits match your filter"}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                {habits.length === 0 ? "Start with a template or create your own!" : "Try a different search or category"}
              </p>
              {habits.length === 0 && (
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button onClick={() => setShowTemplates(true)} style={{
                    padding: "10px 20px", borderRadius: "12px",
                    background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a78bfa", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  }}>🎯 Browse Templates</button>
                  <button onClick={() => setShowForm(true)} style={{
                    padding: "10px 20px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    border: "none", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                  }}>+ Create Custom</button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 stagger">
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {filtered.length} habit{filtered.length !== 1 ? "s" : ""}
              </p>
              {filtered.map(habit => (
                <div key={habit._id} style={{ position: "relative" }}>
                  <HabitCard habit={habit} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={handleEdit} />
                  <button onClick={() => handleShare(habit)} style={{
                    position: "absolute", top: "12px", right: "80px",
                    width: "28px", height: "28px", borderRadius: "8px",
                    background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.2)",
                    color: "#60a5fa", fontSize: "12px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(59,130,246,0.25)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(59,130,246,0.15)"}
                    title="Share habit"
                  >🔗</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {(showForm || editHabit) && (
        <HabitForm habit={editHabit} onSave={handleSave}
          onClose={() => { setShowForm(false); setEditHabit(null); }} />
      )}
      {showTemplates && (
        <HabitTemplates onAdd={handleSave} onClose={() => setShowTemplates(false)} />
      )}
      {shareHabit && (
        <HabitShare habit={shareHabit} onClose={() => setShareHabit(null)} />
      )}
    </div>
  );
};

export default Habits;
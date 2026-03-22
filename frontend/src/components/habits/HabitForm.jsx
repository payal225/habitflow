import React, { useState, useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const CATEGORIES = ["health","fitness","learning","mindfulness","productivity","social","finance","creativity","other"];
const ICONS = ["⭐","💪","📚","🧘","🎯","💰","🎨","🏃","💧","😴","🥗","🧠","🌿","🎵","✍️"];
const COLORS = ["#22c55e","#3b82f6","#f59e0b","#ef4444","#8b5cf6","#ec4899","#14b8a6","#f97316"];
const DIFFICULTIES = [
  { value: "easy", label: "Easy", icon: "🟢", xp: 10, desc: "10 XP per completion" },
  { value: "medium", label: "Medium", icon: "🟡", xp: 20, desc: "20 XP per completion" },
  { value: "hard", label: "Hard", icon: "🔴", xp: 30, desc: "30 XP per completion" }
];

const HabitForm = ({ habit, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: "", description: "", category: "other",
    frequency: "daily", color: "#22c55e", icon: "⭐",
    difficulty: "medium",
    startDate: new Date().toISOString().split("T")[0],
    reminder: { enabled: false, time: "08:00" }
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!habit;

  useEffect(() => {
    if (habit) setForm({ ...form, ...habit });
  }, [habit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Habit name required"); return; }
    setLoading(true);
    try {
      let data;
      if (isEditing) {
        data = await api.put(`/habits/${habit._id}`, form);
        toast.success("Habit updated!");
      } else {
        data = await api.post("/habits", form);
        toast.success("New habit created! 🌱");
      }
      onSave(data.habit);
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto" style={{ background: "var(--bg-card)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
            {isEditing ? "Edit Habit" : "New Habit"}
          </h2>
          <button onClick={onClose} className="text-2xl hover:opacity-70" style={{ color: "var(--text-muted)" }}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Habit Name *</label>
            <input className="input" placeholder="e.g. Morning meditation" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} placeholder="Optional description..."
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Frequency</label>
              <select className="input" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="label">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d.value} type="button" onClick={() => setForm({ ...form, difficulty: d.value })}
                  className="p-3 rounded-xl border-2 text-center transition-all"
                  style={{
                    borderColor: form.difficulty === d.value ? (d.value === "easy" ? "#22c55e" : d.value === "medium" ? "#f59e0b" : "#ef4444") : "var(--border)",
                    background: form.difficulty === d.value ? (d.value === "easy" ? "#22c55e15" : d.value === "medium" ? "#f59e0b15" : "#ef444415") : "transparent"
                  }}>
                  <div className="text-xl mb-1">{d.icon}</div>
                  <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{d.label}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="label">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => setForm({ ...form, icon })}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${form.icon === icon ? "ring-2 ring-green-500 bg-green-50" : "hover:bg-gray-100"}`}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="label">Color</label>
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button key={color} type="button" onClick={() => setForm({ ...form, color })}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === color ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : "hover:scale-110"}`}
                  style={{ background: color }} />
              ))}
            </div>
          </div>

          <div>
            <label className="label">Start Date</label>
            <input type="date" className="input" value={form.startDate}
              onChange={e => setForm({ ...form, startDate: e.target.value })} />
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
            <input type="checkbox" id="reminder" checked={form.reminder.enabled}
              onChange={e => setForm({ ...form, reminder: { ...form.reminder, enabled: e.target.checked } })}
              className="w-4 h-4 accent-green-500" />
            <label htmlFor="reminder" className="text-sm font-medium flex-1" style={{ color: "var(--text-secondary)" }}>
              Enable reminder
            </label>
            {form.reminder.enabled && (
              <input type="time" className="input w-32 py-1.5" value={form.reminder.time}
                onChange={e => setForm({ ...form, reminder: { ...form.reminder, time: e.target.value } })} />
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? "Saving..." : isEditing ? "Update Habit" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
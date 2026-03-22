import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../utils/api";
import Spinner from "../components/shared/Spinner";
import toast from "react-hot-toast";

const AVATARS = ["🧑", "👩", "👨", "🧔", "👱", "👩‍💻", "👨‍💻", "🦸", "🧙", "🎯", "🌱", "🔥", "⭐", "🦁", "🐯"];

const Profile = () => {
  const { user, updatePreferences } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("🧑");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/habits"),
      api.get("/habits/analytics/summary")
    ]).then(([h, a]) => {
      setHabits(h.habits);
      setAnalytics(a.analytics);
      setLoading(false);
    });
    const savedAvatar = localStorage.getItem("ht_avatar") || "🧑";
    setSelectedAvatar(savedAvatar);
    setReminderTime(user?.preferences?.reminderTime || "08:00");
  }, []);

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      localStorage.setItem("ht_avatar", selectedAvatar);
      await updatePreferences({ darkMode, reminderTime });
      toast.success("Preferences saved!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner size="lg" />
    </div>
  );

  const joinDate = new Date(user?.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const totalCompletions = habits.reduce((acc, h) => acc + h.totalCompletions, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
        Profile 👤
      </h1>

      {/* Profile Card */}
      <div className="card text-center">
        <div className="text-6xl mb-3">{selectedAvatar}</div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{user?.name}</h2>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Member since {joinDate}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
          {[
            { label: "Habits", value: habits.length },
            { label: "Completions", value: totalCompletions },
            { label: "Best Streak", value: `${analytics?.bestStreak || 0}d` }
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{stat.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Picker */}
      <div className="card">
        <h3 className="font-bold mb-4" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
          Choose Avatar
        </h3>
        <div className="flex flex-wrap gap-3">
          {AVATARS.map(avatar => (
            <button key={avatar} onClick={() => setSelectedAvatar(avatar)}
              className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: selectedAvatar === avatar ? "var(--accent-light)" : "var(--border)",
                border: selectedAvatar === avatar ? "2px solid var(--accent)" : "2px solid transparent"
              }}>
              {avatar}
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="font-bold mb-4" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
          Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Dark Mode</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Toggle dark/light theme</p>
            </div>
            <button onClick={toggleDarkMode}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: darkMode ? "var(--accent)" : "var(--border)" }}>
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm"
                style={{ left: darkMode ? "26px" : "2px" }} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Reminder Time</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Daily habit reminder</p>
            </div>
            <input type="time" className="input w-32 py-1.5" value={reminderTime}
              onChange={e => setReminderTime(e.target.value)} />
          </div>
        </div>

        <button onClick={handleSavePreferences} className="btn-primary w-full mt-4" disabled={saving}>
          {saving ? "Saving..." : "Save Preferences"}
        </button>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="font-bold mb-4" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
          Achievements 🏆
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: "🌱", label: "First Habit", desc: "Created your first habit", unlocked: habits.length >= 1 },
            { icon: "🔥", label: "On Fire", desc: "3 day streak", unlocked: analytics?.bestStreak >= 3 },
            { icon: "⚡", label: "Consistent", desc: "7 day streak", unlocked: analytics?.bestStreak >= 7 },
            { icon: "💎", label: "Diamond", desc: "30 day streak", unlocked: analytics?.bestStreak >= 30 },
            { icon: "🎯", label: "Achiever", desc: "10 completions", unlocked: totalCompletions >= 10 },
            { icon: "🏆", label: "Champion", desc: "50 completions", unlocked: totalCompletions >= 50 },
            { icon: "📚", label: "Collector", desc: "5 habits created", unlocked: habits.length >= 5 },
            { icon: "🌟", label: "Superstar", desc: "100 completions", unlocked: totalCompletions >= 100 },
            { icon: "🧘", label: "Zen Master", desc: "Perfect week", unlocked: analytics?.bestStreak >= 7 }
          ].map((achievement, i) => (
            <div key={i} className="p-3 rounded-xl text-center transition-all"
              style={{
                background: achievement.unlocked ? "var(--accent-light)" : "var(--bg-primary)",
                opacity: achievement.unlocked ? 1 : 0.5
              }}>
              <div className="text-2xl mb-1">{achievement.unlocked ? achievement.icon : "🔒"}</div>
              <p className="text-xs font-bold" style={{ color: achievement.unlocked ? "var(--accent)" : "var(--text-muted)" }}>
                {achievement.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import HabitCard from "../components/habits/HabitCard";
import HabitForm from "../components/habits/HabitForm";
import MotivationQuote from "../components/shared/MotivationQuote";
import MoodTracker from "../components/shared/MoodTracker";
import DailyChallenge from "../components/shared/DailyChallenge";
import { SkeletonCard, AnimatedButton, AnimatedProgressBar, CountUp, GradientBadge, PulseDot, Tooltip } from "../components/shared/UIEnhancements";

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState(null);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const todayStr = new Date().toISOString().split("T")[0];

  const fetchData = async () => {
    try {
      const [habitsRes, analyticsRes] = await Promise.all([
        api.get("/habits"),
        api.get("/habits/analytics/summary")
      ]);
      setHabits(habitsRes.habits);
      setAnalytics(analyticsRes.analytics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const todayHabits = habits.filter(h => h.isActive !== false);
  const completedToday = todayHabits.filter(h => h.completions?.some(c => c.date === todayStr));
  const completionRate = todayHabits.length > 0 ? Math.round((completedToday.length / todayHabits.length) * 100) : 0;

  const handleUpdate = (updated) => setHabits(prev => prev.map(h => h._id === updated._id ? { ...h, ...updated } : h));
  const handleDelete = (id) => setHabits(prev => prev.filter(h => h._id !== id));
  const handleSave = (habit) => {
    setHabits(prev => editHabit ? prev.map(h => h._id === habit._id ? habit : h) : [habit, ...prev]);
    setEditHabit(null);
  };
  const handleEdit = (habit) => { setEditHabit(habit); setShowForm(true); };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
              Good morning, {user?.name?.split(" ")[0]}!
            </h1>
            <PulseDot color="#22c55e" size={8} />
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{today}</p>
        </div>
        <AnimatedButton
          gradient
          icon="✨"
          onClick={() => { setEditHabit(null); setShowForm(true); }}>
          New Habit
        </AnimatedButton>
      </div>

      {/* Motivation Quote */}
      <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
        <MotivationQuote />
      </div>

      {/* Daily Challenge */}
      <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
        <DailyChallenge />
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-fade-in">
              <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "10px", marginBottom: "12px" }} />
              <div className="skeleton" style={{ width: "60%", height: "24px", marginBottom: "8px" }} />
              <div className="skeleton" style={{ width: "80%", height: "14px" }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[
            { label: "Today's Progress", value: completedToday.length, suffix: `/${todayHabits.length}`, icon: "🎯", gradient: "gradient-text-green" },
            { label: "Completion Rate", value: completionRate, suffix: "%", icon: "📈", gradient: "gradient-text-purple" },
            { label: "Best Streak", value: analytics?.bestStreak || 0, suffix: " days", icon: "🔥", gradient: "gradient-text-sunset" },
            { label: "Total Habits", value: analytics?.totalHabits || 0, suffix: "", icon: "✅", gradient: "gradient-text-rainbow" }
          ].map((stat, i) => (
            <Tooltip key={i} text={stat.label}>
              <div className="card hover-lift animate-fade-in" style={{ cursor: "default" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.gradient}`}>
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
              </div>
            </Tooltip>
          ))}
        </div>
      )}

      {/* Animated Progress Bar */}
      {!loading && todayHabits.length > 0 && (
        <div className="card animate-slide-up">
          <AnimatedProgressBar
            value={completionRate}
            gradient={completionRate === 100 ? "rainbow" : completionRate >= 50 ? "green" : "blue"}
            showLabel={true}
            height="12px"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {completedToday.length} of {todayHabits.length} habits completed
            </p>
            {completionRate === 100 && (
              <GradientBadge gradient="rainbow">🎉 Perfect Day!</GradientBadge>
            )}
            {completionRate >= 50 && completionRate < 100 && (
              <GradientBadge gradient="green">🔥 On Fire!</GradientBadge>
            )}
            {completionRate < 50 && completionRate > 0 && (
              <GradientBadge gradient="purple">💪 Keep Going!</GradientBadge>
            )}
          </div>
        </div>
      )}

      {/* Mood Tracker */}
      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <MoodTracker />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-3 gap-3 stagger-children">
        {[
          { path: "/analytics", icon: "📊", label: "Analytics", gradient: "gradient-bg-blue-purple" },
          { path: "/pomodoro", icon: "🍅", label: "Focus Timer", gradient: "gradient-bg-green" },
          { path: "/profile", icon: "🏆", label: "Achievements", gradient: "gradient-bg-purple-pink" }
        ].map((item, i) => (
          <Link key={i} to={item.path}
            className="card text-center hover-lift animate-fade-in"
            style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }} className="animate-float">{item.icon}</div>
            <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{item.label}</p>
          </Link>
        ))}
      </div>

      {/* Today's Habits */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
              Today's Habits
            </h2>
            {todayHabits.length > 0 && (
              <GradientBadge gradient="green">{todayHabits.length}</GradientBadge>
            )}
          </div>
          <Link to="/habits" className="text-sm text-green-500 hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : todayHabits.length === 0 ? (
          <div className="card text-center py-12 animate-scale-in">
            <div className="text-5xl mb-4 animate-bounce-custom">🌱</div>
            <p className="font-medium" style={{ color: "var(--text-primary)" }}>No habits yet</p>
            <p className="text-sm mt-1 mb-6" style={{ color: "var(--text-muted)" }}>Start building great habits today!</p>
            <AnimatedButton gradient icon="✨" onClick={() => setShowForm(true)}>
              Add Your First Habit
            </AnimatedButton>
          </div>
        ) : (
          <div className="space-y-3 stagger-children">
            {todayHabits.map(habit => (
              <HabitCard key={habit._id} habit={habit} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      {(showForm || editHabit) && (
        <HabitForm habit={editHabit} onSave={handleSave} onClose={() => { setShowForm(false); setEditHabit(null); }} />
      )}
    </div>
  );
};

export default Dashboard;

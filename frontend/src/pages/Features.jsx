import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import WaterTracker from "../components/shared/WaterTracker";
import SleepTracker from "../components/shared/SleepTracker";
import WeightTracker from "../components/shared/WeightTracker";
import ExpenseTracker from "../components/shared/ExpenseTracker";
import StudyTimer from "../components/shared/StudyTimer";
import VisionBoard from "../components/shared/VisionBoard";
import Leaderboard from "../components/shared/Leaderboard";
import AIHabitSuggestions from "../components/shared/AIHabitSuggestions";
import HabitJournal from "../components/shared/HabitJournal";
import MiniGames from "../components/shared/MiniGames";
import NotificationReminders from "../components/shared/NotificationReminders";
import StreakCalendar from "../components/shared/StreakCalendar";
import ThemeCustomizer from "../components/shared/ThemeCustomizer";
import HabitBuddy from "../components/shared/HabitBuddy";

const FEATURE_CARDS = [
  { id: "ai", label: "AI Suggestions", icon: "🤖", color: "#6366f1", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", desc: "Personalized habits based on your goals", tag: "Smart" },
  { id: "buddy", label: "Habit Buddy", icon: "👥", color: "#22c55e", gradient: "linear-gradient(135deg,#22c55e,#4ade80)", desc: "Find accountability partners to grow together", tag: "Social" },
  { id: "calendar", label: "Streak Calendar", icon: "🗓️", color: "#22c55e", gradient: "linear-gradient(135deg,#22c55e,#4ade80)", desc: "GitHub-style yearly activity heatmap", tag: "Visual" },
  { id: "journal", label: "Habit Journal", icon: "📔", color: "#ec4899", gradient: "linear-gradient(135deg,#ec4899,#f472b6)", desc: "Write daily reflections & track mood", tag: "Reflect" },
  { id: "games", label: "Mini Games", icon: "🎮", color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#fbbf24)", desc: "Earn coins by playing habit games", tag: "Fun" },
  { id: "reminders", label: "Reminders", icon: "🔔", color: "#f97316", gradient: "linear-gradient(135deg,#f97316,#fb923c)", desc: "Custom notifications for every habit", tag: "Alerts" },
  { id: "theme", label: "Theme Studio", icon: "🎨", color: "#8b5cf6", gradient: "linear-gradient(135deg,#8b5cf6,#a78bfa)", desc: "Customize colors, fonts and style", tag: "Design" },
  { id: "leaderboard", label: "Leaderboard", icon: "🏆", color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#f97316)", desc: "Compete with friends on streaks", tag: "Social" },
  { id: "water", label: "Water Tracker", icon: "💧", color: "#3b82f6", gradient: "linear-gradient(135deg,#3b82f6,#60a5fa)", desc: "Track daily hydration with 8 glasses", tag: "Health" },
  { id: "sleep", label: "Sleep Tracker", icon: "🌙", color: "#8b5cf6", gradient: "linear-gradient(135deg,#6366f1,#8b5cf6)", desc: "Log sleep quality and duration", tag: "Health" },
  { id: "weight", label: "Weight Tracker", icon: "⚖️", color: "#f97316", gradient: "linear-gradient(135deg,#f97316,#fb923c)", desc: "Track fitness progress with charts", tag: "Fitness" },
  { id: "expense", label: "Expense Tracker", icon: "💸", color: "#22c55e", gradient: "linear-gradient(135deg,#22c55e,#4ade80)", desc: "Budget tracking with pie charts", tag: "Finance" },
  { id: "study", label: "Study Timer", icon: "📖", color: "#ec4899", gradient: "linear-gradient(135deg,#ec4899,#f472b6)", desc: "Track study sessions by subject", tag: "Learn" },
  { id: "vision", label: "Vision Board", icon: "🌟", color: "#f59e0b", gradient: "linear-gradient(135deg,#f59e0b,#fcd34d)", desc: "Set life goals and track milestones", tag: "Goals" },
];

const Features = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(null);
  const [habits, setHabits] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    api.get("/habits").then(data => setHabits(data.habits)).catch(() => {});
  }, []);

  const handleAddHabit = (habit) => {
    setHabits(prev => [habit, ...prev]);
    setShowAI(false);
  };

  const handleCardClick = (id) => {
    if (id === "ai") { setShowAI(true); setActiveTab("ai"); return; }
    if (id === "theme") { setShowTheme(true); setActiveTab("theme"); return; }
    setActiveTab(id);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "buddy": return <HabitBuddy user={user} habits={habits} />;
      case "calendar": return <StreakCalendar habits={habits} />;
      case "journal": return <HabitJournal />;
      case "games": return <MiniGames habits={habits} />;
      case "reminders": return <NotificationReminders habits={habits} />;
      case "leaderboard": return <Leaderboard habits={habits} user={user} />;
      case "water": return <WaterTracker />;
      case "sleep": return <SleepTracker />;
      case "weight": return <WeightTracker />;
      case "expense": return <ExpenseTracker />;
      case "study": return <StudyTimer />;
      case "vision": return <VisionBoard />;
      default: return null;
    }
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: "80vh" }}>

      {/* Hero Header */}
      <div style={{ marginBottom: "32px", position: "relative" }}>
        <div style={{ position: "absolute", top: "-20px", left: "-20px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "0", right: "0", width: "150px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", borderRadius: "100px", background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)", marginBottom: "12px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", animation: "ping 1.5s infinite" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#a78bfa", letterSpacing: "1px" }}>14 POWERFUL TOOLS</span>
          </div>
          <h1 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
            Feature <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Arsenal</span> ⚡
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Click any tool to open it. Your complete wellness toolkit.</p>
        </div>
      </div>

      {/* Active content */}
      {activeTab && activeTab !== "ai" && activeTab !== "theme" && (
        <div className="animate-slide-up" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <button onClick={() => setActiveTab(null)} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px", borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "var(--text-secondary)", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            >← Back</button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "20px" }}>{FEATURE_CARDS.find(f => f.id === activeTab)?.icon}</span>
              <span style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                {FEATURE_CARDS.find(f => f.id === activeTab)?.label}
              </span>
            </div>
          </div>
          {renderContent()}
        </div>
      )}

      {/* Feature Cards Grid */}
      {!activeTab && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }} className="stagger">
          {FEATURE_CARDS.map((feature, i) => (
            <div key={feature.id}
              onClick={() => handleCardClick(feature.id)}
              onMouseEnter={() => setHoveredCard(feature.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="animate-fade-in"
              style={{
                padding: "22px 18px", borderRadius: "20px", cursor: "pointer",
                background: hoveredCard === feature.id ? `${feature.color}12` : "rgba(255,255,255,0.03)",
                border: `1px solid ${hoveredCard === feature.id ? feature.color + "40" : "rgba(255,255,255,0.07)"}`,
                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                transform: hoveredCard === feature.id ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hoveredCard === feature.id ? `0 20px 40px ${feature.color}20, 0 0 0 1px ${feature.color}20` : "none",
                position: "relative", overflow: "hidden",
              }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hoveredCard === feature.id ? feature.gradient : "transparent", transition: "all 0.3s" }} />
              <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px", borderRadius: "50%", background: `radial-gradient(circle, ${feature.color}15 0%, transparent 70%)`, transition: "all 0.3s", opacity: hoveredCard === feature.id ? 1 : 0 }} />
              <div style={{ display: "inline-flex", marginBottom: "14px" }}>
                <span style={{ padding: "3px 10px", borderRadius: "100px", fontSize: "9px", fontWeight: 700, background: `${feature.color}18`, color: feature.color, border: `1px solid ${feature.color}30`, letterSpacing: "0.5px" }}>{feature.tag}</span>
              </div>
              <div style={{
                width: "52px", height: "52px", borderRadius: "16px",
                background: hoveredCard === feature.id ? feature.gradient : `${feature.color}15`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px", marginBottom: "14px",
                boxShadow: hoveredCard === feature.id ? `0 8px 20px ${feature.color}40` : "none",
                transition: "all 0.3s",
                transform: hoveredCard === feature.id ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
              }}>{feature.icon}</div>
              <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "15px", fontWeight: 700, color: hoveredCard === feature.id ? "var(--text-primary)" : "var(--text-secondary)", marginBottom: "6px", transition: "color 0.3s" }}>{feature.label}</h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "14px" }}>{feature.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: 600, color: hoveredCard === feature.id ? feature.color : "var(--text-muted)", transition: "all 0.3s" }}>
                <span>Open</span>
                <span style={{ transform: hoveredCard === feature.id ? "translateX(4px)" : "translateX(0)", transition: "transform 0.3s" }}>→</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mini feature tiles when content is open */}
      {activeTab && activeTab !== "ai" && activeTab !== "theme" && (
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "12px" }}>OTHER TOOLS</p>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            {FEATURE_CARDS.filter(f => f.id !== activeTab).map(feature => (
              <button key={feature.id} onClick={() => handleCardClick(feature.id)}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-muted)", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = `${feature.color}15`; e.currentTarget.style.color = feature.color; e.currentTarget.style.borderColor = `${feature.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <span style={{ fontSize: "14px" }}>{feature.icon}</span>
                {feature.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAI && <AIHabitSuggestions onAdd={handleAddHabit} onClose={() => { setShowAI(false); setActiveTab(null); }} />}
      {showTheme && <ThemeCustomizer onClose={() => { setShowTheme(false); setActiveTab(null); }} />}
    </div>
  );
};

export default Features;

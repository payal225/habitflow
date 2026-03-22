import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Confetti from "./Confetti";

const CHALLENGES = [
  { title: "10 Minute Walk", desc: "Take a 10 minute walk outside", icon: "🚶", xp: 50, category: "fitness" },
  { title: "Drink 8 Glasses", desc: "Drink 8 glasses of water today", icon: "💧", xp: 40, category: "health" },
  { title: "Read 10 Pages", desc: "Read at least 10 pages of any book", icon: "📚", xp: 45, category: "learning" },
  { title: "5 Min Meditation", desc: "Meditate for 5 minutes", icon: "🧘", xp: 35, category: "mindfulness" },
  { title: "No Social Media", desc: "Avoid social media for 2 hours", icon: "📵", xp: 60, category: "productivity" },
  { title: "Call a Friend", desc: "Call or text a friend you haven't spoken to in a while", icon: "📞", xp: 40, category: "social" },
  { title: "Save Money", desc: "Avoid any unnecessary spending today", icon: "💰", xp: 50, category: "finance" },
  { title: "Draw Something", desc: "Draw or doodle anything for 10 minutes", icon: "✏️", xp: 35, category: "creativity" },
  { title: "20 Push-ups", desc: "Do 20 push-ups anytime today", icon: "💪", xp: 55, category: "fitness" },
  { title: "Gratitude List", desc: "Write 3 things you are grateful for", icon: "🙏", xp: 30, category: "mindfulness" },
  { title: "Learn Something", desc: "Watch a educational video or read an article", icon: "🎓", xp: 45, category: "learning" },
  { title: "Clean Your Space", desc: "Clean and organize your workspace", icon: "🧹", xp: 40, category: "productivity" },
  { title: "Healthy Meal", desc: "Cook or eat a healthy meal today", icon: "🥗", xp: 45, category: "health" },
  { title: "Random Act of Kindness", desc: "Do something kind for someone today", icon: "❤️", xp: 60, category: "social" },
  { title: "Journal Entry", desc: "Write a journal entry about your day", icon: "📔", xp: 35, category: "mindfulness" },
  { title: "Stretch for 5 Min", desc: "Do a 5 minute stretching routine", icon: "🤸", xp: 30, category: "fitness" },
  { title: "Digital Detox Hour", desc: "Spend 1 hour without any screens", icon: "🌿", xp: 55, category: "productivity" },
  { title: "Try Something New", desc: "Try a new food, activity, or skill today", icon: "🌟", xp: 50, category: "creativity" },
  { title: "Early to Bed", desc: "Go to sleep before 11 PM tonight", icon: "😴", xp: 40, category: "health" },
  { title: "Plan Tomorrow", desc: "Write a to-do list for tomorrow", icon: "📋", xp: 30, category: "productivity" }
];

const CATEGORY_COLORS = {
  fitness: "#f97316",
  health: "#22c55e",
  learning: "#3b82f6",
  mindfulness: "#8b5cf6",
  productivity: "#f59e0b",
  social: "#ec4899",
  finance: "#14b8a6",
  creativity: "#6366f1"
};

const DailyChallenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Pick a challenge based on today's date (consistent for the whole day)
    const dayIndex = new Date().getDate() % CHALLENGES.length;
    setChallenge(CHALLENGES[dayIndex]);

    // Check if already completed today
    const stored = JSON.parse(localStorage.getItem("ht_challenges") || "{}");
    if (stored[today]) setCompleted(true);
  }, []);

  const handleComplete = () => {
    const stored = JSON.parse(localStorage.getItem("ht_challenges") || "{}");
    stored[today] = true;
    localStorage.setItem("ht_challenges", JSON.stringify(stored));
    setCompleted(true);
    setShowConfetti(true);
    toast.success(`+${challenge.xp} XP! Daily challenge completed!`);
  };

  if (!challenge) return null;

  const color = CATEGORY_COLORS[challenge.category] || "#22c55e";

  return (
    <>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <div className="card relative overflow-hidden" style={{ border: `2px solid ${color}30` }}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10"
          style={{ background: color, transform: "translate(30%, -30%)" }} />

        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: `${color}20`, color }}>
              DAILY CHALLENGE
            </span>
            <h3 className="text-lg font-bold mt-2" style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}>
              {challenge.icon} {challenge.title}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-2xl font-bold" style={{ color }}>+{challenge.xp}</span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>XP reward</p>
          </div>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>{challenge.desc}</p>

        {completed ? (
          <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: `${color}15` }}>
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-bold" style={{ color }}>Challenge completed!</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Come back tomorrow for a new challenge</p>
            </div>
          </div>
        ) : (
          <button onClick={handleComplete} className="btn w-full py-3 font-bold text-white transition-all active:scale-95"
            style={{ background: color }}>
            Mark as Complete
          </button>
        )}

        {/* Resets in */}
        <p className="text-xs text-center mt-3" style={{ color: "var(--text-muted)" }}>
          New challenge tomorrow at midnight
        </p>
      </div>
    </>
  );
};

export default DailyChallenge;
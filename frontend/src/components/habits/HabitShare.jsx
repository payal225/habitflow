import React, { useState } from "react";
import toast from "react-hot-toast";

const HabitShare = ({ habit, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [shareType, setShareType] = useState("link");

  const shareData = {
    name: habit.name,
    icon: habit.icon,
    category: habit.category,
    frequency: habit.frequency,
    difficulty: habit.difficulty || "medium",
    description: habit.description,
    color: habit.color,
    streak: habit.currentStreak,
    total: habit.totalCompletions,
  };

  const shareUrl = `${window.location.origin}/habit-share?data=${btoa(JSON.stringify(shareData))}`;

  const shareText = `🌱 I'm building a great habit with HabitFlow!

${habit.icon} ${habit.name}
📊 Current Streak: 🔥 ${habit.currentStreak} days
✅ Total Completions: ${habit.totalCompletions}
📅 Frequency: ${habit.frequency}

Join me on HabitFlow and start tracking your habits! 💪
${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Link copied! 🔗");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    toast.success("Share text copied! 📋");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleTwitter = () => {
    const tweet = `${habit.icon} I've completed ${habit.currentStreak} days of "${habit.name}" on HabitFlow! 🔥 Building better habits every day! #HabitFlow #BuildingHabits`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        width: "100%", maxWidth: "440px",
        background: "var(--bg-card)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "24px", overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
        animation: "scaleIn 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "24px",
          background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.05))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
              Share Habit 🔗
            </h2>
            <button onClick={onClose} style={{
              width: "32px", height: "32px", borderRadius: "10px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-primary)", fontSize: "16px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Habit preview card */}
          <div style={{
            padding: "16px", borderRadius: "16px", marginBottom: "20px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${habit.color || "#22c55e"}30`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: habit.color || "#22c55e" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span style={{ fontSize: "32px" }}>{habit.icon}</span>
              <div>
                <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "16px" }}>{habit.name}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{habit.category} • {habit.frequency}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#fb923c" }}>🔥 {habit.currentStreak}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Current Streak</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#22c55e" }}>✅ {habit.totalCompletions}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Completions</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#8b5cf6" }}>⭐ {habit.longestStreak}</p>
                <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>Best Streak</p>
              </div>
            </div>
          </div>

          {/* Share link */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "8px" }}>SHARE LINK</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{
                flex: 1, padding: "10px 14px", borderRadius: "12px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "11px", color: "var(--text-muted)",
                fontFamily: "JetBrains Mono, monospace",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{shareUrl}</div>
              <button onClick={handleCopyLink} style={{
                padding: "10px 16px", borderRadius: "12px", border: "none",
                background: copied ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: copied ? "#22c55e" : "white",
                fontSize: "12px", fontWeight: 700, cursor: "pointer",
                transition: "all 0.3s", whiteSpace: "nowrap",
              }}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
            </div>
          </div>

          {/* Share buttons */}
          <label style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "10px" }}>SHARE ON</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[
              { label: "WhatsApp", icon: "💬", color: "#25d366", action: handleWhatsApp },
              { label: "Twitter/X", icon: "🐦", color: "#1d9bf0", action: handleTwitter },
              { label: "Copy Text", icon: "📋", color: "#8b5cf6", action: handleCopyText },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} style={{
                padding: "12px 8px", borderRadius: "14px", border: "none",
                background: `${btn.color}15`,
                color: btn.color, cursor: "pointer",
                fontSize: "12px", fontWeight: 700,
                transition: "all 0.3s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${btn.color}25`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${btn.color}15`; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: "20px" }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="btn-secondary" style={{ width: "100%" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitShare;
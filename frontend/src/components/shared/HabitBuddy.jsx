import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const BUDDY_SUGGESTIONS = [
  { name: "Priya Sharma", avatar: "P", color: "#22c55e", habits: ["Morning Run", "Meditation"], streak: 23, xp: 1240, status: "online", badge: "🔥 Consistent" },
  { name: "Rahul Mehta", avatar: "R", color: "#3b82f6", habits: ["Reading", "Coding"], streak: 15, xp: 890, status: "online", badge: "📚 Learner" },
  { name: "Anjali Singh", avatar: "A", color: "#ec4899", habits: ["Yoga", "Journaling"], streak: 31, xp: 1580, status: "away", badge: "🧘 Mindful" },
  { name: "Vikram Patel", avatar: "V", color: "#f97316", habits: ["Gym", "Diet"], streak: 8, xp: 420, status: "offline", badge: "💪 Fighter" },
  { name: "Sneha Rao", avatar: "S", color: "#8b5cf6", habits: ["Piano", "Drawing"], streak: 45, xp: 2100, status: "online", badge: "🎨 Creative" },
  { name: "Arjun Kumar", avatar: "A", color: "#f59e0b", habits: ["Study", "Exercise"], streak: 12, xp: 660, status: "away", badge: "🎯 Focused" },
];

const CHALLENGES = [
  { id: 1, title: "7-Day Streak Challenge", desc: "Maintain a 7 day streak together", icon: "🔥", duration: "7 days", reward: 500, difficulty: "Easy" },
  { id: 2, title: "Morning Routine Master", desc: "Complete morning habits for 14 days", icon: "🌅", duration: "14 days", reward: 1000, difficulty: "Medium" },
  { id: 3, title: "100 Completions Club", desc: "Reach 100 total habit completions", icon: "💯", duration: "Ongoing", reward: 2000, difficulty: "Hard" },
  { id: 4, title: "Wellness Week", desc: "Complete all wellness habits for a week", icon: "🌿", duration: "7 days", reward: 750, difficulty: "Medium" },
];

const STATUS_COLORS = { online: "#22c55e", away: "#f59e0b", offline: "#475569" };

const HabitBuddy = ({ user, habits }) => {
  const [buddies, setBuddies] = useState([]);
  const [activeTab, setActiveTab] = useState("find");
  const [requests, setRequests] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [search, setSearch] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_buddies") || "[]");
    const reqs = JSON.parse(localStorage.getItem("ht_buddy_requests") || "[]");
    const challenges = JSON.parse(localStorage.getItem("ht_challenges_active") || "[]");
    const sent = JSON.parse(localStorage.getItem("ht_sent_requests") || "[]");
    setBuddies(stored);
    setRequests(reqs);
    setActiveChallenges(challenges);
    setSentRequests(sent);
    // Generate invite code
    const code = localStorage.getItem("ht_invite_code") || Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem("ht_invite_code", code);
    setInviteCode(code);
  }, []);

  const handleAddBuddy = (buddy) => {
    if (buddies.find(b => b.name === buddy.name)) { toast.error("Already your buddy!"); return; }
    if (sentRequests.includes(buddy.name)) { toast.error("Request already sent!"); return; }
    const updated = [...sentRequests, buddy.name];
    setSentRequests(updated);
    localStorage.setItem("ht_sent_requests", JSON.stringify(updated));
    toast.success(`Buddy request sent to ${buddy.name}! 🤝`);
    setTimeout(() => {
      const newBuddies = [...buddies, { ...buddy, since: new Date().toISOString().split("T")[0] }];
      setBuddies(newBuddies);
      localStorage.setItem("ht_buddies", JSON.stringify(newBuddies));
      const updatedSent = sentRequests.filter(n => n !== buddy.name);
      setSentRequests(updatedSent);
      localStorage.setItem("ht_sent_requests", JSON.stringify(updatedSent));
      toast.success(`${buddy.name} accepted your request! 🎉`);
    }, 3000);
  };

  const handleRemoveBuddy = (name) => {
    const updated = buddies.filter(b => b.name !== name);
    setBuddies(updated);
    localStorage.setItem("ht_buddies", JSON.stringify(updated));
    toast.success("Buddy removed");
  };

  const handleJoinChallenge = (challenge) => {
    if (activeChallenges.find(c => c.id === challenge.id)) { toast.error("Already joined!"); return; }
    const updated = [...activeChallenges, { ...challenge, startDate: new Date().toISOString().split("T")[0], progress: 0 }];
    setActiveChallenges(updated);
    localStorage.setItem("ht_challenges_active", JSON.stringify(updated));
    toast.success(`Joined ${challenge.title}! 🎯`);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(`Join me on HabitFlow! Use code: ${inviteCode} at http://localhost:3000/register`);
    toast.success("Invite link copied! 🔗");
  };

  const myXP = habits ? habits.reduce((sum, h) => {
    const xp = h.difficulty === "hard" ? 30 : h.difficulty === "medium" ? 20 : 10;
    return sum + h.totalCompletions * xp;
  }, 0) : 0;

  const myStreak = habits ? Math.max(...habits.map(h => h.currentStreak), 0) : 0;
  const filtered = BUDDY_SUGGESTIONS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) && !buddies.find(buddy => buddy.name === b.name));

  const TABS = [
    { id: "find", label: "Find Buddies", icon: "🔍" },
    { id: "mybuddies", label: `My Buddies (${buddies.length})`, icon: "👥" },
    { id: "challenges", label: "Challenges", icon: "🏆" },
    { id: "invite", label: "Invite", icon: "📨" },
  ];

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>👥 Habit Buddy System</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Find accountability partners to grow together</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "100px", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.25)" }}>
          <span style={{ fontSize: "14px" }}>⚡</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#22c55e" }}>{myXP} XP</span>
        </div>
      </div>

      {/* My profile card */}
      <div style={{ padding: "14px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(99,102,241,0.05))", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, color: "white", flexShrink: 0 }}>
          {user?.name?.[0]?.toUpperCase() || "Y"}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{user?.name || "You"}</p>
          <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{buddies.length} buddies • {activeChallenges.length} active challenges</p>
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", fontWeight: 800, color: "#f97316" }}>🔥{myStreak}</p>
            <p style={{ fontSize: "9px", color: "var(--text-muted)" }}>streak</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", fontWeight: 800, color: "#f59e0b" }}>⚡{myXP}</p>
            <p style={{ fontSize: "9px", color: "var(--text-muted)" }}>XP</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "16px", padding: "4px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: 1, padding: "9px 6px", borderRadius: "11px", border: "none",
            background: activeTab === tab.id ? "rgba(255,255,255,0.08)" : "transparent",
            color: activeTab === tab.id ? "var(--text-primary)" : "var(--text-muted)",
            fontSize: "11px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}>{tab.icon} {tab.label}</button>
        ))}
      </div>

      {/* Find Buddies Tab */}
      {activeTab === "find" && (
        <div className="animate-slide-up">
          <div style={{ position: "relative", marginBottom: "14px" }}>
            <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🔍</span>
            <input className="input" placeholder="Search buddies..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: "38px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map((buddy, i) => (
              <div key={i} style={{ padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "12px", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `linear-gradient(135deg, ${buddy.color}, ${buddy.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "white" }}>{buddy.avatar}</div>
                  <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "12px", height: "12px", borderRadius: "50%", background: STATUS_COLORS[buddy.status], border: "2px solid var(--bg-card)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{buddy.name}</p>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", background: `${buddy.color}15`, color: buddy.color, fontWeight: 700 }}>{buddy.badge}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>🔥 {buddy.streak} streak</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>⚡ {buddy.xp} XP</span>
                  </div>
                  <div style={{ display: "flex", gap: "4px", marginTop: "4px", flexWrap: "wrap" }}>
                    {buddy.habits.map(h => (
                      <span key={h} style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", color: "var(--text-muted)" }}>{h}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleAddBuddy(buddy)} disabled={sentRequests.includes(buddy.name)}
                  style={{ padding: "8px 14px", borderRadius: "10px", border: "none", background: sentRequests.includes(buddy.name) ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg, ${buddy.color}, ${buddy.color}cc)`, color: sentRequests.includes(buddy.name) ? "var(--text-muted)" : "white", fontSize: "12px", fontWeight: 700, cursor: sentRequests.includes(buddy.name) ? "not-allowed" : "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {sentRequests.includes(buddy.name) ? "Pending..." : "+ Add"}
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
                <p style={{ fontSize: "13px" }}>No buddies found. Try a different search!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Buddies Tab */}
      {activeTab === "mybuddies" && (
        <div className="animate-slide-up">
          {buddies.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>👥</div>
              <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>No buddies yet!</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>Find accountability partners to grow together</p>
              <button onClick={() => setActiveTab("find")} style={{ padding: "10px 24px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Find Buddies 🔍</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {buddies.map((buddy, i) => (
                <div key={i} style={{ padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `linear-gradient(135deg, ${buddy.color}, ${buddy.color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "white" }}>{buddy.avatar}</div>
                    <div style={{ position: "absolute", bottom: "-2px", right: "-2px", width: "12px", height: "12px", borderRadius: "50%", background: STATUS_COLORS[buddy.status], border: "2px solid var(--bg-card)" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{buddy.name}</p>
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "100px", background: `${buddy.color}15`, color: buddy.color, fontWeight: 700 }}>{buddy.badge}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Buddies since {buddy.since}</p>
                    <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                      <span style={{ fontSize: "11px", color: "#f97316", fontWeight: 600 }}>🔥 {buddy.streak} streak</span>
                      <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>⚡ {buddy.xp} XP</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                    <button style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "rgba(59,130,246,0.15)", color: "#60a5fa", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>💬 Message</button>
                    <button onClick={() => handleRemoveBuddy(buddy.name)} style={{ padding: "6px 12px", borderRadius: "8px", border: "none", background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div className="animate-slide-up">
          {activeChallenges.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>ACTIVE CHALLENGES</p>
              {activeChallenges.map(c => (
                <div key={c.id} style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "24px" }}>{c.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{c.title}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.duration} • 🪙 {c.reward} coins</p>
                  </div>
                  <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "100px", background: "rgba(34,197,94,0.15)", color: "#22c55e", fontWeight: 700 }}>Active</span>
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>AVAILABLE CHALLENGES</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CHALLENGES.filter(c => !activeChallenges.find(ac => ac.id === c.id)).map(challenge => {
              const diffColors = { Easy: "#22c55e", Medium: "#f59e0b", Hard: "#ef4444" };
              return (
                <div key={challenge.id} style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>{challenge.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{challenge.title}</p>
                      <span style={{ fontSize: "9px", padding: "2px 8px", borderRadius: "100px", background: `${diffColors[challenge.difficulty]}15`, color: diffColors[challenge.difficulty], fontWeight: 700 }}>{challenge.difficulty}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>{challenge.desc}</p>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>⏱️ {challenge.duration}</span>
                      <span style={{ fontSize: "11px", color: "#fbbf24", fontWeight: 600 }}>🪙 {challenge.reward} coins</span>
                    </div>
                  </div>
                  <button onClick={() => handleJoinChallenge(challenge)} style={{ padding: "9px 16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer", flexShrink: 0, boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>Join 🎯</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite Tab */}
      {activeTab === "invite" && (
        <div className="animate-slide-up">
          <div style={{ padding: "28px", borderRadius: "18px", background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))", border: "1px solid rgba(99,102,241,0.2)", textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "14px" }}>📨</div>
            <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Invite Friends</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>Share your code and earn bonus XP when friends join!</p>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <div style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "24px", fontWeight: 800, color: "var(--accent)", letterSpacing: "4px" }}>{inviteCode}</span>
              </div>
              <button onClick={copyInviteCode} style={{ padding: "12px 20px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(99,102,241,0.35)" }}>📋 Copy</button>
            </div>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>You earn +200 XP for every friend who joins using your code!</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[
              { icon: "💬", label: "Share on WhatsApp", color: "#25d366", action: () => window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on HabitFlow! Use code: ${inviteCode} 🌱`)}`) },
              { icon: "🐦", label: "Share on Twitter", color: "#1d9bf0", action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Building better habits with HabitFlow! Join me using code: ${inviteCode} 🌱 #HabitFlow`)}`) },
              { icon: "📧", label: "Send via Email", color: "#ec4899", action: () => window.open(`mailto:?subject=Join me on HabitFlow&body=Hey! I'm using HabitFlow to build better habits. Join me using invite code: ${inviteCode}`) },
              { icon: "🔗", label: "Copy Link", color: "#22c55e", action: copyInviteCode },
            ].map((btn, i) => (
              <button key={i} onClick={btn.action} style={{ padding: "14px", borderRadius: "14px", border: `1px solid ${btn.color}25`, background: `${btn.color}10`, color: btn.color, fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
                onMouseEnter={e => { e.currentTarget.style.background = `${btn.color}20`; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${btn.color}10`; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <span style={{ fontSize: "24px" }}>{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitBuddy;

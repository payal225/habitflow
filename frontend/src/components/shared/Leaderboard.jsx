import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["#f59e0b", "#94a3b8", "#f97316"];

const Leaderboard = ({ habits, user }) => {
  const [friends, setFriends] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendStreak, setFriendStreak] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_friends") || "[]");
    setFriends(stored);
  }, []);

  const myBestStreak = habits ? Math.max(...habits.map(h => h.currentStreak), 0) : 0;
  const myTotalCompletions = habits ? habits.reduce((sum, h) => sum + h.totalCompletions, 0) : 0;
  const myXP = habits ? habits.reduce((sum, h) => {
    const xp = h.difficulty === "hard" ? 30 : h.difficulty === "medium" ? 20 : 10;
    return sum + h.totalCompletions * xp;
  }, 0) : 0;

  const handleAddFriend = () => {
    if (!friendName.trim()) { toast.error("Enter friend's name!"); return; }
    const friend = {
      id: Date.now(),
      name: friendName,
      streak: parseInt(friendStreak) || Math.floor(Math.random() * 15) + 1,
      completions: Math.floor(Math.random() * 50) + 10,
      xp: Math.floor(Math.random() * 500) + 100,
      avatar: friendName[0]?.toUpperCase(),
      color: ["#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"][Math.floor(Math.random() * 5)],
    };
    const updated = [...friends, friend];
    localStorage.setItem("ht_friends", JSON.stringify(updated));
    setFriends(updated);
    setFriendName("");
    setFriendStreak("");
    setShowAdd(false);
    toast.success(`${friendName} added to leaderboard! 🏆`);
  };

  const allPlayers = [
    { id: "me", name: user?.name || "You", streak: myBestStreak, completions: myTotalCompletions, xp: myXP, avatar: user?.name?.[0]?.toUpperCase() || "Y", color: "#22c55e", isMe: true },
    ...friends,
  ].sort((a, b) => b.xp - a.xp);

  const myRank = allPlayers.findIndex(p => p.isMe) + 1;

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>🏆 Leaderboard</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>You are ranked #{myRank} of {allPlayers.length}</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          padding: "8px 14px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #f59e0b, #f97316)",
          color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer",
        }}>+ Add Friend</button>
      </div>

      {/* My stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "My XP", value: myXP, color: "#f59e0b", icon: "⚡" },
          { label: "Best Streak", value: `${myBestStreak}d`, color: "#f97316", icon: "🔥" },
          { label: "Rank", value: `#${myRank}`, color: "#22c55e", icon: "🏆" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "12px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}25`, textAlign: "center" }}>
            <div style={{ fontSize: "18px", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add friend form */}
      {showAdd && (
        <div style={{ padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "14px", animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <input className="input" placeholder="Friend's name" value={friendName} onChange={e => setFriendName(e.target.value)} />
            <input type="number" className="input" placeholder="Their streak (optional)" value={friendStreak} onChange={e => setFriendStreak(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "9px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontWeight: 600 }}>Cancel</button>
            <button onClick={handleAddFriend} style={{ flex: 2, padding: "9px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #f59e0b, #f97316)", color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Add to Board 🏆</button>
          </div>
        </div>
      )}

      {/* Leaderboard list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {allPlayers.map((player, i) => (
          <div key={player.id} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 14px", borderRadius: "14px",
            background: player.isMe ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
            border: `1px solid ${player.isMe ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`,
            transition: "all 0.3s",
          }}>
            {/* Rank */}
            <div style={{ width: "28px", textAlign: "center", flexShrink: 0 }}>
              {i < 3 ? (
                <span style={{ fontSize: "20px" }}>{MEDALS[i]}</span>
              ) : (
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-muted)" }}>#{i + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: `linear-gradient(135deg, ${player.color}, ${player.color}cc)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "14px", fontWeight: 700, color: "white", flexShrink: 0,
              boxShadow: player.isMe ? `0 0 12px ${player.color}50` : "none",
            }}>{player.avatar}</div>

            {/* Name & streak */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: player.isMe ? "#22c55e" : "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player.name}</p>
                {player.isMe && <span style={{ fontSize: "9px", padding: "1px 6px", borderRadius: "4px", background: "rgba(34,197,94,0.2)", color: "#22c55e", fontWeight: 700 }}>YOU</span>}
              </div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>🔥 {player.streak} day streak</p>
            </div>

            {/* XP */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 800, color: i < 3 ? RANK_COLORS[i] : "var(--text-secondary)", fontFamily: "Syne, sans-serif" }}>⚡{player.xp}</p>
              <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>XP</p>
            </div>
          </div>
        ))}
      </div>

      {friends.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "16px", padding: "16px", borderRadius: "12px", background: "rgba(245,158,11,0.05)", border: "1px dashed rgba(245,158,11,0.2)" }}>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Add friends to compete on the leaderboard! 🏆</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
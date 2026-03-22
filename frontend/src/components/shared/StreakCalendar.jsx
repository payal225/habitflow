import React, { useState } from "react";

const StreakCalendar = ({ habits }) => {
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [hoveredDay, setHoveredDay] = useState(null);

  const today = new Date();
  const currentYear = today.getFullYear();

  // Generate all days of the year
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31);
  const days = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d).toISOString().split("T")[0]);
  }

  // Count completions per day
  const getCompletionMap = () => {
    const map = {};
    const habitsToUse = selectedHabit
      ? habits.filter(h => h._id === selectedHabit)
      : habits;

    habitsToUse.forEach(habit => {
      habit.completions?.forEach(c => {
        map[c.date] = (map[c.date] || 0) + 1;
      });
    });
    return map;
  };

  const completionMap = getCompletionMap();
  const maxCount = Math.max(...Object.values(completionMap), 1);

  const getColor = (date, count) => {
    const dateObj = new Date(date + "T00:00:00");
    const isFuture = dateObj > today;
    if (isFuture) return "rgba(255,255,255,0.03)";
    if (!count) return "rgba(255,255,255,0.06)";
    const intensity = count / maxCount;
    if (selectedHabit) {
      const habit = habits.find(h => h._id === selectedHabit);
      const color = habit?.color || "#22c55e";
      if (intensity < 0.25) return color + "40";
      if (intensity < 0.5) return color + "70";
      if (intensity < 0.75) return color + "aa";
      return color;
    }
    if (intensity < 0.25) return "#22c55e40";
    if (intensity < 0.5) return "#22c55e70";
    if (intensity < 0.75) return "#22c55eaa";
    return "#22c55e";
  };

  // Group days into weeks
  const firstDayOfYear = new Date(currentYear, 0, 1).getDay();
  const weeks = [];
  let week = Array(firstDayOfYear).fill(null);

  days.forEach(day => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstValid = week.find(d => d);
    if (firstValid) {
      const m = new Date(firstValid + "T00:00:00").getMonth();
      if (m !== lastMonth) {
        monthLabels.push({
          index: wi,
          label: new Date(firstValid + "T00:00:00").toLocaleDateString("en-US", { month: "short" })
        });
        lastMonth = m;
      }
    }
  });

  const totalCompletions = Object.values(completionMap).reduce((a, b) => a + b, 0);
  const activeDays = Object.keys(completionMap).filter(d => completionMap[d] > 0).length;
  const currentStreak = (() => {
    let streak = 0;
    let d = new Date(today);
    while (true) {
      const dateStr = d.toISOString().split("T")[0];
      if (completionMap[dateStr]) { streak++; d.setDate(d.getDate() - 1); }
      else break;
    }
    return streak;
  })();

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
            🗓️ Streak Calendar {currentYear}
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {totalCompletions} completions • {activeDays} active days
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "22px", fontWeight: 800, color: "#f97316", fontFamily: "Syne, sans-serif" }}>🔥 {currentStreak}</p>
          <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>current streak</p>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px", marginBottom: "16px" }}>
        {[
          { label: "Total Done", value: totalCompletions, color: "#22c55e" },
          { label: "Active Days", value: activeDays, color: "#3b82f6" },
          { label: "Best Streak", value: `${Math.max(...habits.map(h => h.longestStreak), 0)}d`, color: "#f59e0b" },
        ].map((s, i) => (
          <div key={i} style={{ padding: "10px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: `1px solid ${s.color}20`, textAlign: "center" }}>
            <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Habit filter */}
      <div style={{ marginBottom: "14px" }}>
        <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
          <button onClick={() => setSelectedHabit(null)} style={{
            padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
            border: `1px solid ${!selectedHabit ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
            background: !selectedHabit ? "rgba(34,197,94,0.15)" : "transparent",
            color: !selectedHabit ? "#22c55e" : "var(--text-muted)",
            cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
          }}>All Habits</button>
          {habits.map(h => (
            <button key={h._id} onClick={() => setSelectedHabit(h._id)} style={{
              padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
              border: `1px solid ${selectedHabit === h._id ? (h.color || "#22c55e") + "60" : "rgba(255,255,255,0.08)"}`,
              background: selectedHabit === h._id ? (h.color || "#22c55e") + "20" : "transparent",
              color: selectedHabit === h._id ? (h.color || "#22c55e") : "var(--text-muted)",
              cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
            }}>{h.icon} {h.name}</button>
          ))}
        </div>
      </div>

      {/* Calendar heatmap */}
      <div style={{ overflowX: "auto" }}>
        {/* Month labels */}
        <div style={{ display: "flex", marginBottom: "4px", paddingLeft: "24px" }}>
          {weeks.map((_, wi) => {
            const label = monthLabels.find(m => m.index === wi);
            return (
              <div key={wi} style={{ width: "13px", marginRight: "2px", fontSize: "9px", color: "var(--text-muted)", flexShrink: 0 }}>
                {label ? label.label : ""}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: "2px" }}>
          {/* Day labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginRight: "4px" }}>
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <div key={i} style={{ height: "13px", fontSize: "8px", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>{d}</div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {week.map((day, di) => {
                const count = day ? (completionMap[day] || 0) : 0;
                const color = day ? getColor(day, count) : "transparent";
                const isToday = day === today.toISOString().split("T")[0];
                return (
                  <div key={di}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    style={{
                      width: "13px", height: "13px",
                      borderRadius: "3px",
                      background: color,
                      border: isToday ? "1px solid #22c55e" : "1px solid transparent",
                      cursor: day ? "pointer" : "default",
                      transition: "all 0.2s",
                      transform: hoveredDay === day && day ? "scale(1.3)" : "scale(1)",
                      flexShrink: 0,
                      position: "relative",
                    }}
                    title={day ? `${day}: ${count} completion${count !== 1 ? "s" : ""}` : ""}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Less</span>
          {["rgba(255,255,255,0.06)", "#22c55e40", "#22c55e70", "#22c55eaa", "#22c55e"].map((c, i) => (
            <div key={i} style={{ width: "13px", height: "13px", borderRadius: "3px", background: c }} />
          ))}
          <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>More</span>
        </div>
      </div>

      {/* Hovered day tooltip */}
      {hoveredDay && completionMap[hoveredDay] > 0 && (
        <div style={{ marginTop: "10px", padding: "10px 14px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", fontSize: "12px", color: "#4ade80", fontWeight: 600, textAlign: "center" }}>
          📅 {hoveredDay} — {completionMap[hoveredDay]} habit{completionMap[hoveredDay] !== 1 ? "s" : ""} completed
        </div>
      )}
    </div>
  );
};

export default StreakCalendar;
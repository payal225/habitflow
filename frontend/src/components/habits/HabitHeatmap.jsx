import React from "react";

const HabitHeatmap = ({ habits }) => {
  // Generate last 365 days
  const days = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split("T")[0]);
  }

  // Count completions per day across all habits
  const completionMap = {};
  habits.forEach(habit => {
    habit.completions?.forEach(c => {
      completionMap[c.date] = (completionMap[c.date] || 0) + 1;
    });
  });

  const maxCount = Math.max(...Object.values(completionMap), 1);

  const getColor = (count) => {
    if (!count) return "var(--border)";
    const intensity = count / maxCount;
    if (intensity < 0.25) return "#bbf7d0";
    if (intensity < 0.5) return "#4ade80";
    if (intensity < 0.75) return "#22c55e";
    return "#15803d";
  };

  // Group days into weeks
  const weeks = [];
  let week = [];
  const firstDay = new Date(days[0]).getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);
  days.forEach(day => {
    week.push(day);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length > 0) weeks.push(week);

  // Month labels
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstValid = week.find(d => d);
    if (firstValid) {
      const m = new Date(firstValid).getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ index: wi, label: new Date(firstValid).toLocaleDateString("en-US", { month: "short" }) });
        lastMonth = m;
      }
    }
  });

  const totalCompletions = Object.values(completionMap).reduce((a, b) => a + b, 0);
  const activeDays = Object.keys(completionMap).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
          Year Activity 🗓️
        </h2>
        <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{totalCompletions} completions</span>
          <span>{activeDays} active days</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-1" style={{ paddingLeft: "20px" }}>
          {weeks.map((_, wi) => {
            const label = monthLabels.find(m => m.index === wi);
            return (
              <div key={wi} className="text-xs flex-shrink-0" style={{ width: "14px", marginRight: "2px", color: "var(--text-muted)" }}>
                {label ? label.label : ""}
              </div>
            );
          })}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 mr-1">
            {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
              <div key={i} className="text-xs h-3.5 flex items-center" style={{ color: "var(--text-muted)", fontSize: "9px" }}>{d}</div>
            ))}
          </div>

          {/* Heatmap grid */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {Array(7).fill(null).map((_, di) => {
                const date = week[di];
                const count = date ? (completionMap[date] || 0) : 0;
                return (
                  <div key={di}
                    className="rounded-sm flex-shrink-0 transition-all hover:scale-110"
                    style={{
                      width: "14px", height: "14px",
                      background: date ? getColor(count) : "transparent",
                      cursor: date ? "pointer" : "default"
                    }}
                    title={date ? `${date}: ${count} completion${count !== 1 ? "s" : ""}` : ""}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Less</span>
        {["var(--border)", "#bbf7d0", "#4ade80", "#22c55e", "#15803d"].map((color, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: color }} />
        ))}
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>More</span>
      </div>
    </div>
  );
};

export default HabitHeatmap;

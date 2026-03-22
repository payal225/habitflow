import React, { useState } from "react";

const HabitCalendar = ({ habit }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  const completedDates = new Set(habit.completions?.map(c => c.date) || []);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isCompleted = completedDates.has(dateStr);
    const isToday = dateStr === today;
    const isFuture = dateStr > today;

    days.push(
      <div key={dateStr}
        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all
          ${isCompleted ? "text-white shadow-sm" : ""}
          ${isToday ? "ring-2 ring-offset-1" : ""}
          ${isFuture ? "opacity-30" : ""}
          ${!isCompleted && !isFuture ? "hover:opacity-80" : ""}
        `}
        style={{
          background: isCompleted ? (habit.color || "#22c55e") : "var(--border)",
          ringColor: habit.color || "#22c55e",
          color: isCompleted ? "white" : "var(--text-muted)"
        }}
        title={dateStr}>
        {d}
      </div>
    );
  }

  const completionRate = Math.round((completedDates.size / daysInMonth) * 100);

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{habit.icon}</span>
          <h3 className="font-bold" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
            {habit.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">◀</button>
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{monthName}</span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "var(--text-muted)" }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            🔥 {habit.currentStreak} day streak
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            ✅ {habit.totalCompletions} total
          </span>
        </div>
        <span className="text-xs font-bold" style={{ color: habit.color || "#22c55e" }}>
          {completionRate}% this month
        </span>
      </div>
    </div>
  );
};

export default HabitCalendar;

// Export habits data as CSV or JSON

export const exportAsCSV = (habits) => {
  const rows = [
    ["Habit Name", "Category", "Frequency", "Current Streak", "Longest Streak", "Total Completions", "Start Date"]
  ];

  habits.forEach(habit => {
    rows.push([
      habit.name,
      habit.category,
      habit.frequency,
      habit.currentStreak,
      habit.longestStreak,
      habit.totalCompletions,
      habit.startDate
    ]);
  });

  const csvContent = rows.map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `habitflow_export_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportAsJSON = (habits) => {
  const data = habits.map(habit => ({
    name: habit.name,
    category: habit.category,
    frequency: habit.frequency,
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
    totalCompletions: habit.totalCompletions,
    startDate: habit.startDate,
    completions: habit.completions?.map(c => c.date) || []
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `habitflow_export_${new Date().toISOString().split("T")[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const generateReport = (habits, analytics) => {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  
  const rows = [
    ["HabitFlow - Progress Report"],
    [`Generated on: ${today}`],
    [""],
    ["SUMMARY"],
    ["Total Habits", analytics?.totalHabits || 0],
    ["Completed Today", analytics?.completedToday || 0],
    ["Today's Rate", `${analytics?.completionRateToday || 0}%`],
    ["Best Streak", `${analytics?.bestStreak || 0} days`],
    [""],
    ["HABIT DETAILS"],
    ["Name", "Category", "Streak", "Best Streak", "Total Done", "Started"]
  ];

  habits.forEach(h => {
    rows.push([h.name, h.category, `${h.currentStreak}d`, `${h.longestStreak}d`, h.totalCompletions, h.startDate]);
  });

  const csvContent = rows.map(row => Array.isArray(row) ? row.join(",") : row).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `habitflow_report_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

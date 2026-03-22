import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../utils/api";
import Spinner from "../components/shared/Spinner";
import HabitHeatmap from "../components/habits/HabitHeatmap";
import HabitCalendar from "../components/habits/HabitCalendar";
import { exportAsCSV, exportAsJSON, generateReport } from "../utils/exportData";
import toast from "react-hot-toast";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Promise.all([
      api.get("/habits/analytics/summary"),
      api.get("/habits")
    ]).then(([a, h]) => {
      setAnalytics(a.analytics);
      setHabits(h.habits);
      if (h.habits.length > 0) setSelectedHabit(h.habits[0]);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Spinner size="lg" />
    </div>
  );

  const chartData = analytics?.weeklyTrend?.map(d => ({
    day: new Date(d.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" }),
    completed: d.count,
    total: d.total
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
        Analytics
      </h1>

      <div className="flex gap-2 p-1 rounded-xl" style={{ background: "var(--border)" }}>
        {["overview", "calendar", "heatmap", "export"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize"
            style={{
              background: activeTab === tab ? "var(--bg-card)" : "transparent",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)"
            }}>
            {tab === "overview" ? "Overview" : tab === "calendar" ? "Calendar" : tab === "heatmap" ? "Heatmap" : "Export"}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Habits", value: analytics?.totalHabits || 0, icon: "📋" },
              { label: "Done Today", value: `${analytics?.completedToday || 0}/${analytics?.totalHabits || 0}`, icon: "✅" },
              { label: "Today's Rate", value: `${analytics?.completionRateToday || 0}%`, icon: "🎯" },
              { label: "Best Streak", value: `${analytics?.bestStreak || 0}d`, icon: "🔥" }
            ].map((s, i) => (
              <div key={i} className="card text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
              Last 7 Days
            </h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="completed" fill="#22c55e" radius={[6, 6, 0, 0]} name="Completed" />
                <Bar dataKey="total" fill="var(--border)" radius={[6, 6, 0, 0]} name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
              Streak Leaderboard
            </h2>
            <div className="space-y-3">
              {[...habits].sort((a, b) => b.currentStreak - a.currentStreak).map((habit, i) => (
                <div key={habit._id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: "var(--bg-primary)" }}>
                  <span className="text-lg font-bold w-6" style={{ color: "var(--text-muted)" }}>#{i + 1}</span>
                  <span className="text-xl">{habit.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: "var(--text-primary)" }}>{habit.name}</p>
                    <div className="w-full h-1.5 rounded-full mt-1.5 overflow-hidden" style={{ background: "var(--border)" }}>
                      <div className="h-full rounded-full" style={{
                        width: `${habit.longestStreak > 0 ? (habit.currentStreak / habit.longestStreak) * 100 : 0}%`,
                        background: habit.color || "#22c55e"
                      }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-orange-500">🔥 {habit.currentStreak}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>best: {habit.longestStreak}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {habits.map(habit => (
              <button key={habit._id} onClick={() => setSelectedHabit(habit)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium flex-shrink-0 transition-all"
                style={{
                  background: selectedHabit?._id === habit._id ? (habit.color || "#22c55e") : "var(--border)",
                  color: selectedHabit?._id === habit._id ? "white" : "var(--text-secondary)"
                }}>
                <span>{habit.icon}</span>{habit.name}
              </button>
            ))}
          </div>
          {selectedHabit && <HabitCalendar habit={selectedHabit} />}
        </div>
      )}

      {activeTab === "heatmap" && (
        <div className="space-y-4">
          <HabitHeatmap habits={habits} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map(habit => (
              <div key={habit._id} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{habit.icon}</span>
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{habit.name}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full text-white"
                    style={{ background: habit.color || "#22c55e" }}>
                    {habit.totalCompletions} days
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {Array.from({ length: 30 }, (_, i) => {
                    const date = new Date(Date.now() - (29 - i) * 86400000).toISOString().split("T")[0];
                    const done = habit.completions?.some(c => c.date === date);
                    return (
                      <div key={i} className="w-4 h-4 rounded-sm"
                        style={{ background: done ? (habit.color || "#22c55e") : "var(--border)" }}
                        title={date} />
                    );
                  })}
                </div>
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>Last 30 days</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "export" && (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "Black Han Sans, sans-serif", color: "var(--text-primary)" }}>
              Export Your Data
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Download your habit data in different formats</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "📊", title: "CSV Export", desc: "Open in Excel or Google Sheets", action: () => { exportAsCSV(habits); toast.success("Exported as CSV!"); } },
                { icon: "🗂️", title: "JSON Export", desc: "Raw data for developers or backup", action: () => { exportAsJSON(habits); toast.success("Exported as JSON!"); } },
                { icon: "📝", title: "Progress Report", desc: "Full report with stats and details", action: () => { generateReport(habits, analytics); toast.success("Report downloaded!"); } }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl border" style={{ borderColor: "var(--border)" }}>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                  <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  <button onClick={item.action} className="btn-primary w-full">Download</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card text-center">
            <div className="text-4xl mb-3">🏆</div>
            <p className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              {analytics?.completionRateToday || 0}% completion rate today!
            </p>
            <p className="text-sm mt-1 mb-4" style={{ color: "var(--text-muted)" }}>
              {analytics?.completedToday || 0} of {analytics?.totalHabits || 0} habits completed
            </p>
            <button onClick={() => {
              const text = `I completed ${analytics?.completedToday || 0}/${analytics?.totalHabits || 0} habits today with a ${analytics?.bestStreak || 0} day best streak! 🌱 #HabitFlow #BuildingHabits`;
              navigator.clipboard.writeText(text);
              toast.success("Copied! Share on social media!");
            }} className="btn-primary">
              Copy Share Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

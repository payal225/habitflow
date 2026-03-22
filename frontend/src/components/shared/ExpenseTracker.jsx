import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

const CATEGORIES = [
  { label: "Food", icon: "🍕", color: "#f97316" },
  { label: "Transport", icon: "🚗", color: "#3b82f6" },
  { label: "Shopping", icon: "🛍️", color: "#ec4899" },
  { label: "Bills", icon: "💡", color: "#f59e0b" },
  { label: "Health", icon: "💊", color: "#22c55e" },
  { label: "Entertainment", icon: "🎬", color: "#8b5cf6" },
  { label: "Education", icon: "📚", color: "#06b6d4" },
  { label: "Other", icon: "📦", color: "#94a3b8" },
];

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState("");
  const [form, setForm] = useState({ amount: "", category: "Food", note: "", date: new Date().toISOString().split("T")[0] });
  const [showForm, setShowForm] = useState(false);
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_expenses") || "[]");
    const budgetStored = localStorage.getItem("ht_budget") || "";
    setExpenses(stored);
    setBudget(budgetStored);
  }, []);

  const save = (updated) => {
    localStorage.setItem("ht_expenses", JSON.stringify(updated));
    setExpenses(updated);
  };

  const handleAdd = () => {
    if (!form.amount || isNaN(form.amount)) { toast.error("Enter valid amount!"); return; }
    const entry = { ...form, amount: parseFloat(form.amount), id: Date.now() };
    const updated = [entry, ...expenses];
    save(updated);
    setForm({ amount: "", category: "Food", note: "", date: new Date().toISOString().split("T")[0] });
    setShowForm(false);
    toast.success(`₹${form.amount} added! 💰`);
  };

  const handleDelete = (id) => {
    save(expenses.filter(e => e.id !== id));
    toast.success("Expense removed");
  };

  const getFiltered = () => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      if (period === "today") return e.date === now.toISOString().split("T")[0];
      if (period === "week") return (now - d) / 86400000 <= 7;
      if (period === "month") return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      return true;
    });
  };

  const filtered = getFiltered();
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);
  const budgetNum = parseFloat(budget) || 0;
  const budgetUsed = budgetNum > 0 ? Math.min((total / budgetNum) * 100, 100) : 0;
  const budgetColor = budgetUsed >= 90 ? "#ef4444" : budgetUsed >= 70 ? "#f59e0b" : "#22c55e";

  const pieData = CATEGORIES.map(cat => ({
    name: cat.label, icon: cat.icon, color: cat.color,
    value: filtered.filter(e => e.category === cat.label).reduce((s, e) => s + e.amount, 0),
  })).filter(d => d.value > 0);

  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", padding: "20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>💸 Expense Tracker</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>Track your spending habits</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: "8px 14px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          color: "white", fontSize: "12px", fontWeight: 700, cursor: "pointer",
        }}>+ Add</button>
      </div>

      {/* Period tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
        {["today", "week", "month"].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: "7px", borderRadius: "10px", border: "none",
            background: period === p ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
            color: period === p ? "#22c55e" : "var(--text-muted)",
            fontSize: "12px", fontWeight: 600, cursor: "pointer",
            border: `1px solid ${period === p ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`,
          }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
        ))}
      </div>

      {/* Total & Budget */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
        <div style={{ padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>SPENT</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: "#ef4444", fontFamily: "Syne, sans-serif" }}>₹{total.toFixed(0)}</p>
        </div>
        <div style={{ padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
          <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "1px", marginBottom: "4px" }}>BUDGET LEFT</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: budgetNum > 0 ? budgetColor : "var(--text-muted)", fontFamily: "Syne, sans-serif" }}>
            {budgetNum > 0 ? `₹${Math.max(budgetNum - total, 0).toFixed(0)}` : "—"}
          </p>
        </div>
      </div>

      {/* Budget bar */}
      {budgetNum > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Budget used</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: budgetColor }}>{budgetUsed.toFixed(0)}%</span>
          </div>
          <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${budgetUsed}%`, background: `linear-gradient(90deg, ${budgetColor}, ${budgetColor}cc)`, borderRadius: "3px", transition: "width 0.8s ease" }} />
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "16px", animation: "slideUp 0.3s ease" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>₹</span>
              <input type="number" className="input" placeholder="Amount" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} style={{ paddingLeft: "30px" }} />
            </div>
            <select className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c.label} value={c.label}>{c.icon} {c.label}</option>)}
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <input type="text" className="input" placeholder="Note (optional)" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })} />
            <input type="date" className="input" value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "14px" }}>🎯</span>
              <input type="number" className="input" placeholder="Monthly budget" value={budget}
                onChange={e => { setBudget(e.target.value); localStorage.setItem("ht_budget", e.target.value); }}
                style={{ paddingLeft: "34px" }} />
            </div>
            <button onClick={handleAdd} style={{
              padding: "11px", borderRadius: "12px", border: "none",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer",
            }}>Add Expense</button>
          </div>
        </div>
      )}

      {/* Pie chart */}
      {pieData.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "10px" }}>BY CATEGORY</p>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(val) => `₹${val.toFixed(0)}`} contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: d.color }} />
                    <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{d.icon} {d.name}</span>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: d.color }}>₹{d.value.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent expenses */}
      {filtered.length > 0 && (
        <div>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "8px" }}>RECENT</p>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filtered.slice(0, 10).map(e => {
              const cat = CATEGORIES.find(c => c.label === e.category) || CATEGORIES[7];
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{e.note || e.category}</p>
                      <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>{e.date}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>₹{e.amount.toFixed(0)}</span>
                    <button onClick={() => handleDelete(e.id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: "6px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", color: "#f87171" }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>💸</div>
          <p style={{ fontSize: "13px" }}>No expenses for this period</p>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
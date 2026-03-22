import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back! 🌱");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Animated background blobs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", top: "-200px", left: "-200px", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", bottom: "-150px", right: "-150px", animation: "float 10s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", top: "50%", right: "20%", animation: "float 6s ease-in-out infinite 2s" }} />
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px" }} className="animate-slide-up">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", margin: "0 auto 20px",
            boxShadow: "0 0 40px rgba(34,197,94,0.3)",
            animation: "glowPulse 2s ease-in-out infinite",
          }}>🌱</div>
          <h1 style={{
            fontFamily: "Syne, sans-serif", fontSize: "36px", fontWeight: 800,
            background: "linear-gradient(135deg, #22c55e, #4ade80, #86efac)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: "8px",
          }}>HabitFlow</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Sign in to continue your streak 🔥</p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label className="label">Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📧</span>
                <input
                  type="email" className="input" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: "44px" }} required />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔐</span>
                <input
                  type={showPass ? "text" : "password"} className="input" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: "44px", paddingRight: "44px" }} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px",
                borderRadius: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "rgba(34,197,94,0.5)" : "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white", fontSize: "15px", fontWeight: 700,
                boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                transform: loading ? "none" : "translateY(0)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={e => { if (!loading) e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px rgba(34,197,94,0.5)"; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(34,197,94,0.35)"; }}>
              {loading ? (
                <>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Signing in...
                </>
              ) : "Sign In ✨"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              Create one free →
            </Link>
          </p>
        </div>

        {/* Bottom stats */}
        <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "32px" }}>
          {[{ val: "10K+", label: "Users" }, { val: "500K+", label: "Habits" }, { val: "99%", label: "Uptime" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent)" }}>{s.val}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
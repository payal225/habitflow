import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState(1);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Welcome to HabitFlow! 🌱");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ["transparent", "#ef4444", "#f59e0b", "#22c55e"];
  const strengthLabels = ["", "Weak", "Good", "Strong 💪"];

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
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", top: "-200px", right: "-200px", animation: "float 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", bottom: "-150px", left: "-150px", animation: "float 10s ease-in-out infinite reverse" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px" }} className="animate-slide-up">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "72px", height: "72px", borderRadius: "20px",
            background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "36px", margin: "0 auto 20px",
            boxShadow: "0 0 40px rgba(139,92,246,0.35)",
            animation: "glowPulse 2s ease-in-out infinite",
          }}>🚀</div>
          <h1 style={{
            fontFamily: "Cormorant Garamond, sans-serif", fontSize: "36px", fontWeight: 800,
            background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f472b6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: "8px",
          }}>Join HabitFlow</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Start your habit journey today 🌱</p>
        </div>

        {/* Perks row */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", justifyContent: "center" }}>
          {["✅ Free forever", "🔒 Secure", "📊 Analytics"].map((p, i) => (
            <span key={i} style={{
              padding: "5px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600,
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--text-secondary)",
            }}>{p}</span>
          ))}
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
            <div style={{ marginBottom: "18px" }}>
              <label className="label">Full Name</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>👤</span>
                <input
                  type="text" className="input" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ paddingLeft: "44px" }} required />
              </div>
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label className="label">Email Address</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>📧</span>
                <input
                  type="email" className="input" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  style={{ paddingLeft: "44px" }} required />
              </div>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔐</span>
                <input
                  type={showPass ? "text" : "password"} className="input" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ paddingLeft: "44px", paddingRight: "44px" }} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {form.password.length > 0 && (
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      flex: 1, height: "3px", borderRadius: "2px",
                      background: i <= strength ? strengthColors[strength] : "rgba(255,255,255,0.1)",
                      transition: "all 0.3s ease",
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: strengthColors[strength], fontWeight: 600 }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px",
                borderRadius: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                background: loading ? "rgba(139,92,246,0.5)" : "linear-gradient(135deg, #8b5cf6, #6366f1)",
                color: "white", fontSize: "15px", fontWeight: 700,
                boxShadow: "0 4px 20px rgba(139,92,246,0.35)",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.5)"; }}}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(139,92,246,0.35)"; }}>
              {loading ? (
                <>
                  <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Creating account...
                </>
              ) : "Create Account 🚀"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

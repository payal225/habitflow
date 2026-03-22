import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🎯", title: "Smart Habit Tracking", desc: "Track daily & weekly habits with automatic streak calculation and completion rates", color: "#22c55e" },
  { icon: "🤖", title: "AI Suggestions", desc: "Get personalized habit recommendations based on your goals using AI", color: "#6366f1" },
  { icon: "📊", title: "Rich Analytics", desc: "Beautiful charts, GitHub-style heatmap and calendar view for your progress", color: "#3b82f6" },
  { icon: "🎮", title: "Gamification", desc: "Earn XP points, unlock achievements and compete with friends on leaderboard", color: "#f59e0b" },
  { icon: "🍅", title: "Pomodoro Timer", desc: "Built-in focus timer with 25/5/15 min modes linked directly to your habits", color: "#f97316" },
  { icon: "🌟", title: "Vision Board", desc: "Set life goals, track milestones and visualize your dream future", color: "#ec4899" },
  { icon: "💧", title: "Wellness Trackers", desc: "Track water intake, sleep quality, weight, expenses and study sessions", color: "#06b6d4" },
  { icon: "🏆", title: "Leaderboard", desc: "Add friends and compete to see who builds the best habits", color: "#8b5cf6" },
];

const STATS = [
  { value: "20+", label: "Features", icon: "⚡" },
  { value: "24", label: "Habit Templates", icon: "📋" },
  { value: "9", label: "Achievements", icon: "🏆" },
  { value: "100%", label: "Free Forever", icon: "💚" },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Student", text: "HabitFlow changed my life! I went from 0 to 45 day streak in just 2 months!", avatar: "P", color: "#22c55e" },
  { name: "Rahul M.", role: "Developer", text: "The AI suggestions are incredible. It recommended habits I never thought of!", avatar: "R", color: "#3b82f6" },
  { name: "Anjali K.", role: "Designer", text: "Beautiful UI and so many features. Best habit app I've ever used!", avatar: "A", color: "#ec4899" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Account", desc: "Sign up for free in seconds. No credit card required.", icon: "👤", color: "#22c55e" },
  { step: "02", title: "Add Habits", desc: "Choose from 24 templates or create your own custom habits.", icon: "✅", color: "#3b82f6" },
  { step: "03", title: "Track Daily", desc: "Check off habits every day and watch your streaks grow.", icon: "🔥", color: "#f97316" },
  { step: "04", title: "See Progress", desc: "Analyze your data with charts, heatmaps and insights.", icon: "📊", color: "#8b5cf6" },
];

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveFeature(prev => (prev + 1) % FEATURES.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", overflowX: "hidden" }}>

      {/* ── Navbar ────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(8,12,20,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", boxShadow: "0 0 15px rgba(34,197,94,0.3)",
          }}>🌱</div>
          <span style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "20px", fontWeight: 800, color: "white" }}>HabitFlow</span>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/login" style={{
            padding: "9px 20px", borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "white", fontSize: "14px", fontWeight: 600,
            textDecoration: "none", transition: "all 0.2s",
          }}>Sign In</Link>
          <Link to="/register" style={{
            padding: "9px 20px", borderRadius: "12px", border: "none",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            color: "white", fontSize: "14px", fontWeight: 700,
            textDecoration: "none",
            boxShadow: "0 4px 15px rgba(34,197,94,0.35)",
          }}>Get Started Free 🚀</Link>
        </div>
      </nav>

      {/* ── Hero Section ──────────────────────────── */}
      <section style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 32px 80px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Background blobs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
          <div style={{ position: "absolute", width: "800px", height: "800px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", top: "-300px", left: "-200px", animation: "float 10s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", bottom: "-200px", right: "-100px", animation: "float 8s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)", top: "40%", right: "20%", animation: "float 6s ease-in-out infinite 2s" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "8px 20px", borderRadius: "100px", marginBottom: "32px",
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
            animation: "fadeIn 0.6s ease",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", animation: "ping 1.5s infinite" }} />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#4ade80" }}>CSE Final Year Project 2024-25</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "Black Han Sans, sans-serif", fontWeight: 800, lineHeight: 1.05,
            marginBottom: "24px", animation: "slideUp 0.6s ease 0.1s both",
          }}>
            <span style={{ fontSize: "clamp(48px, 8vw, 88px)", color: "white", display: "block" }}>Build Habits.</span>
            <span style={{
              fontSize: "clamp(48px, 8vw, 88px)", display: "block",
              background: "linear-gradient(135deg, #22c55e, #4ade80, #86efac)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Transform Life.</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.55)",
            maxWidth: "600px", margin: "0 auto 48px", lineHeight: 1.7,
            animation: "slideUp 0.6s ease 0.2s both",
          }}>
            The most powerful habit tracking app with AI suggestions, gamification,
            analytics and 20+ features to help you become the best version of yourself.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "64px", animation: "slideUp 0.6s ease 0.3s both" }}>
            <Link to="/register" style={{
              padding: "16px 36px", borderRadius: "16px", border: "none",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              color: "white", fontSize: "16px", fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 8px 30px rgba(34,197,94,0.4)",
              transition: "all 0.3s",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>🚀 Start For Free</Link>
            <Link to="/login" style={{
              padding: "16px 36px", borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "white", fontSize: "16px", fontWeight: 600,
              textDecoration: "none", backdropFilter: "blur(10px)",
              display: "inline-flex", alignItems: "center", gap: "8px",
            }}>👤 Sign In</Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: "32px", justifyContent: "center", flexWrap: "wrap",
            animation: "slideUp 0.6s ease 0.4s both",
          }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "4px" }}>{stat.icon}</div>
                <div style={{
                  fontFamily: "Black Han Sans, sans-serif", fontSize: "28px", fontWeight: 800,
                  background: "linear-gradient(135deg, #22c55e, #4ade80)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ──────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#a78bfa", letterSpacing: "1px" }}>✨ FEATURES</span>
          </div>
          <h2 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white", marginBottom: "16px" }}>
            Everything You Need to<br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Build Better Habits</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto" }}>
            20+ powerful features designed to help you track, analyze and improve your daily habits
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              padding: "24px", borderRadius: "20px",
              background: activeFeature === i ? `${f.color}10` : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeFeature === i ? f.color + "35" : "rgba(255,255,255,0.07)"}`,
              transition: "all 0.4s ease", cursor: "pointer",
              transform: activeFeature === i ? "translateY(-4px)" : "translateY(0)",
              boxShadow: activeFeature === i ? `0 12px 30px ${f.color}20` : "none",
            }}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: `${f.color}15`, border: `1px solid ${f.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "24px", marginBottom: "14px",
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "16px", fontWeight: 700, color: "white", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#4ade80", letterSpacing: "1px" }}>🔄 HOW IT WORKS</span>
          </div>
          <h2 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white" }}>
            Get Started in <span style={{ background: "linear-gradient(135deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>4 Simple Steps</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} style={{ position: "relative" }}>
              {i < HOW_IT_WORKS.length - 1 && (
                <div style={{
                  position: "absolute", top: "40px", right: "-10px",
                  width: "20px", height: "2px",
                  background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)",
                  display: "none",
                }} className="md:block" />
              )}
              <div style={{
                padding: "28px 24px", borderRadius: "20px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                textAlign: "center",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${step.color}08`; e.currentTarget.style.borderColor = `${step.color}30`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{
                  fontFamily: "Black Han Sans, sans-serif", fontSize: "48px", fontWeight: 800,
                  color: `${step.color}30`, marginBottom: "8px", lineHeight: 1,
                }}>{step.step}</div>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "16px",
                  background: `${step.color}15`, border: `1px solid ${step.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", margin: "0 auto 16px",
                }}>{step.icon}</div>
                <h3 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "17px", fontWeight: 700, color: "white", marginBottom: "8px" }}>{step.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "100px", background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", marginBottom: "16px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#f472b6", letterSpacing: "1px" }}>💬 TESTIMONIALS</span>
          </div>
          <h2 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 800, color: "white" }}>
            Loved by <span style={{ background: "linear-gradient(135deg, #ec4899, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Users</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{
              padding: "28px", borderRadius: "20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ fontSize: "24px", marginBottom: "16px" }}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "20px", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "12px",
                  background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px", fontWeight: 700, color: "white",
                }}>{t.avatar}</div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>{t.name}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────── */}
      <section style={{ padding: "80px 32px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          padding: "60px 40px", borderRadius: "28px",
          background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(99,102,241,0.08), rgba(236,72,153,0.06))",
          border: "1px solid rgba(34,197,94,0.2)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "56px", marginBottom: "20px", animation: "float 3s ease-in-out infinite" }}>🌱</div>
            <h2 style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "white", marginBottom: "16px" }}>
              Ready to Transform<br />Your Life?
            </h2>
            <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", marginBottom: "36px", maxWidth: "400px", margin: "0 auto 36px" }}>
              Join thousands of people already building better habits with HabitFlow. It's completely free!
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/register" style={{
                padding: "16px 40px", borderRadius: "16px", border: "none",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "white", fontSize: "16px", fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 30px rgba(34,197,94,0.4)",
                display: "inline-flex", alignItems: "center", gap: "8px",
              }}>🚀 Get Started Free</Link>
              <Link to="/login" style={{
                padding: "16px 40px", borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.06)",
                color: "white", fontSize: "16px", fontWeight: 600,
                textDecoration: "none",
              }}>Sign In →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer style={{ padding: "40px 32px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🌱</div>
          <span style={{ fontFamily: "Black Han Sans, sans-serif", fontSize: "18px", fontWeight: 800, color: "white" }}>HabitFlow</span>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>
          Built with ❤️ 
        </p>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
          React • Node.js • MongoDB • Express • Tailwind CSS
        </p>
      </footer>
    </div>
  );
};

export default Home;

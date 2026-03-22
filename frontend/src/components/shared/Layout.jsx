import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const NAV = [
  { path: "/", label: "Dashboard", icon: "🏠", color: "#22c55e" },
  { path: "/habits", label: "My Habits", icon: "✅", color: "#3b82f6" },
  { path: "/analytics", label: "Analytics", icon: "📊", color: "#8b5cf6" },
  { path: "/pomodoro", label: "Focus Timer", icon: "🍅", color: "#f97316" },
  { path: "/profile", label: "Profile", icon: "👤", color: "#ec4899" },
];

const EXTRA_NAV = [
  { path: "/features", label: "AI Suggest", icon: "🤖", color: "#6366f1" },
  { path: "/features", label: "Leaderboard", icon: "🏆", color: "#f59e0b" },
  { path: "/features", label: "Trackers", icon: "⚡", color: "#22c55e" },
  { path: "/features", label: "Vision Board", icon: "🌟", color: "#ec4899" },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("See you soon! 👋");
    navigate("/login");
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link to={item.path} style={{ textDecoration: "none" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "11px 14px", borderRadius: "14px",
          background: isActive ? `${item.color}18` : "transparent",
          border: isActive ? `1px solid ${item.color}30` : "1px solid transparent",
          transition: "all 0.2s ease", cursor: "pointer",
          position: "relative", overflow: "hidden",
        }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
        >
          {isActive && (
            <div style={{
              position: "absolute", left: 0, top: "20%", bottom: "20%",
              width: "3px", borderRadius: "0 3px 3px 0",
              background: item.color, boxShadow: `0 0 8px ${item.color}`,
            }} />
          )}
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: isActive ? `${item.color}20` : "rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px", flexShrink: 0, transition: "all 0.2s",
          }}>{item.icon}</div>
          <span style={{
            fontSize: "14px", fontWeight: isActive ? 600 : 400,
            color: isActive ? item.color : "var(--text-secondary)",
          }}>{item.label}</span>
          {isActive && (
            <div style={{
              marginLeft: "auto", width: "6px", height: "6px",
              borderRadius: "50%", background: item.color,
              boxShadow: `0 0 6px ${item.color}`,
            }} />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* Desktop Sidebar */}
      <aside style={{
        width: "260px", position: "fixed", height: "100vh",
        left: 0, top: 0, display: "flex", flexDirection: "column",
        padding: "24px 16px",
        background: "rgba(13,19,33,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        zIndex: 50,
      }} className="hidden md:flex">

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", padding: "0 8px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            background: "linear-gradient(135deg, #22c55e, #4ade80)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", flexShrink: 0,
            boxShadow: "0 0 20px rgba(34,197,94,0.3)",
          }}>🌱</div>
          <div>
            <div style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>HabitFlow</div>
            <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "1px" }}>TRACK · GROW · WIN</div>
          </div>
        </div>

        {/* Main Nav */}
        <div style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", padding: "0 12px", marginBottom: "8px" }}>MAIN MENU</div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {NAV.map(item => <NavItem key={item.label} item={item} />)}
        </nav>

        {/* Extra Tools Section */}
        <div style={{ margin: "16px 0 8px", padding: "0 12px" }}>
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "12px" }} />
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px" }}>EXTRA TOOLS</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {EXTRA_NAV.map(item => (
            <Link key={item.label} to={item.path} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "9px 14px", borderRadius: "12px",
                border: "1px solid transparent",
                transition: "all 0.2s ease", cursor: "pointer",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = `${item.color}20`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <div style={{
                  width: "30px", height: "30px", borderRadius: "9px",
                  background: `${item.color}12`, border: `1px solid ${item.color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "14px", flexShrink: 0,
                }}>{item.icon}</div>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <button onClick={toggleDarkMode} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 14px", borderRadius: "14px",
            border: "1px solid transparent", background: "transparent",
            cursor: "pointer", width: "100%", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
              {darkMode ? "☀️" : "🌙"}
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>

          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "12px 14px", borderRadius: "14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "linear-gradient(135deg, #22c55e, #4ade80)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700, color: "white", flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "8px", padding: "6px 8px", cursor: "pointer",
              fontSize: "14px", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            >🚪</button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        background: "rgba(13,19,33,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }} className="md:hidden">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🌱</div>
          <span style={{ fontFamily: "Cormorant Garamond, sans-serif", fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>HabitFlow</span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
          color: "var(--text-primary)", fontSize: "18px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{menuOpen ? "✕" : "☰"}</button>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 90, paddingTop: "70px",
          background: "rgba(8,12,20,0.98)", backdropFilter: "blur(20px)",
        }} className="md:hidden animate-fade-in">
          <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[...NAV, ...EXTRA_NAV].map(item => (
              <Link key={item.label} to={item.path} style={{ textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}>
                <div style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "12px 16px", borderRadius: "14px",
                  background: location.pathname === item.path ? `${item.color}15` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${location.pathname === item.path ? item.color + "30" : "rgba(255,255,255,0.06)"}`,
                }}>
                  <span style={{ fontSize: "20px" }}>{item.icon}</span>
                  <span style={{ fontSize: "15px", fontWeight: 600, color: location.pathname === item.path ? item.color : "var(--text-secondary)" }}>{item.label}</span>
                </div>
              </Link>
            ))}
            <button onClick={toggleDarkMode} style={{
              display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px",
              borderRadius: "14px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", marginTop: "4px",
            }}>
              <span style={{ fontSize: "20px" }}>{darkMode ? "☀️" : "🌙"}</span>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-secondary)" }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button onClick={handleLogout} style={{
              display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px",
              borderRadius: "14px", background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer",
            }}>
              <span style={{ fontSize: "20px" }}>🚪</span>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#f87171" }}>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: "260px", minHeight: "100vh" }} className="md:ml-[260px] ml-0">
        <div style={{ paddingTop: "70px" }} className="md:pt-0">
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

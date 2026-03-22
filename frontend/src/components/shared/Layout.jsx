import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";
import {
  HiHome, HiCheckCircle, HiChartBar, HiClock,
  HiUser, HiLightningBolt, HiSun, HiMoon,
  HiLogout, HiMenu, HiX, HiSparkles,
  HiTrendingUp, HiBell, HiColorSwatch,
  HiUserGroup, HiStar
} from "react-icons/hi";

const NAV = [
  { path: "/dashboard", label: "Dashboard", icon: HiHome, color: "#22c55e" },
  { path: "/habits", label: "My Habits", icon: HiCheckCircle, color: "#3b82f6" },
  { path: "/analytics", label: "Analytics", icon: HiChartBar, color: "#8b5cf6" },
  { path: "/pomodoro", label: "Focus Timer", icon: HiClock, color: "#f97316" },
  { path: "/profile", label: "Profile", icon: HiUser, color: "#ec4899" },
];

const EXTRA_NAV = [
  { path: "/features", label: "AI Suggest", icon: HiSparkles, color: "#6366f1" },
  { path: "/features", label: "Leaderboard", icon: HiTrendingUp, color: "#f59e0b" },
  { path: "/features", label: "Trackers", icon: HiLightningBolt, color: "#22c55e" },
  { path: "/features", label: "Vision Board", icon: HiStar, color: "#ec4899" },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) setCollapsed(false);
      if (window.innerWidth >= 768 && window.innerWidth < 1024) setCollapsed(true);
      if (window.innerWidth >= 1024) setCollapsed(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("See you soon!");
    navigate("/login");
  };

  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const isMobile = windowWidth < 768;
  const sidebarWidth = collapsed ? "72px" : "260px";

  const NavItem = ({ item, isExtra = false }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;
    return (
      <Link to={item.path} style={{ textDecoration: "none" }} onClick={() => isMobile && setMenuOpen(false)}>
        <div style={{
          display: "flex", alignItems: "center",
          gap: collapsed ? "0" : "12px",
          padding: collapsed ? "12px" : isExtra ? "9px 14px" : "11px 14px",
          borderRadius: "14px", cursor: "pointer",
          justifyContent: collapsed ? "center" : "flex-start",
          background: isActive ? `${item.color}18` : "transparent",
          border: isActive ? `1px solid ${item.color}30` : "1px solid transparent",
          transition: "all 0.2s ease",
          position: "relative",
          marginBottom: "2px",
        }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          title={collapsed ? item.label : ""}
        >
          {isActive && !collapsed && (
            <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: "3px", borderRadius: "0 3px 3px 0", background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
          )}
          <div style={{
            width: isExtra ? "30px" : "34px",
            height: isExtra ? "30px" : "34px",
            borderRadius: "10px", flexShrink: 0,
            background: isActive ? `${item.color}20` : isExtra ? `${item.color}12` : "rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: isExtra ? `1px solid ${item.color}25` : "none",
            transition: "all 0.2s",
          }}>
            <Icon size={isExtra ? 14 : 17} color={isActive ? item.color : isExtra ? item.color : "var(--text-muted)"} />
          </div>
          {!collapsed && (
            <span style={{
              fontSize: isExtra ? "13px" : "14px",
              fontWeight: isActive ? 600 : isExtra ? 500 : 400,
              color: isActive ? item.color : "var(--text-secondary)",
              fontFamily: "var(--font-body)",
              transition: "color 0.2s",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}>{item.label}</span>
          )}
          {isActive && !collapsed && (
            <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: item.color, boxShadow: `0 0 6px ${item.color}`, flexShrink: 0 }} />
          )}
        </div>
      </Link>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside style={{
          width: sidebarWidth, minWidth: sidebarWidth,
          position: "fixed", height: "100vh", left: 0, top: 0,
          display: "flex", flexDirection: "column",
          padding: collapsed ? "20px 8px" : "24px 16px",
          background: "rgba(13,19,33,0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          zIndex: 50,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1), padding 0.3s ease",
          overflowX: "hidden",
        }}>

          {/* Logo + Collapse */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between", marginBottom: "28px", padding: collapsed ? "0" : "0 4px", flexShrink: 0 }}>
            {!collapsed && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 0 16px rgba(34,197,94,0.3)" }}>
                  <HiLightningBolt size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>HabitFlow</div>
                  <div style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "1.5px" }}>TRACK · GROW · WIN</div>
                </div>
              </div>
            )}
            {collapsed && (
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(34,197,94,0.3)" }}>
                <HiLightningBolt size={18} color="white" />
              </div>
            )}
            {!collapsed && (
              <button onClick={() => setCollapsed(true)} style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <HiMenu size={14} color="var(--text-muted)" />
              </button>
            )}
            {collapsed && (
              <button onClick={() => setCollapsed(false)} style={{ position: "absolute", top: "20px", right: "-12px", width: "24px", height: "24px", borderRadius: "50%", background: "rgba(34,197,94,0.9)", border: "2px solid rgba(13,19,33,0.9)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                <HiMenu size={11} color="white" />
              </button>
            )}
          </div>

          {/* Scrollable Nav */}
          <div style={{
            flex: 1, overflowY: "auto", overflowX: "hidden",
            paddingRight: collapsed ? "0" : "4px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}>
            {/* Main label */}
            {!collapsed && (
              <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", padding: "0 14px", marginBottom: "6px", fontFamily: "var(--font-body)", flexShrink: 0 }}>MAIN MENU</div>
            )}

            {/* Main Nav */}
            <nav style={{ display: "flex", flexDirection: "column" }}>
              {NAV.map(item => <NavItem key={item.label} item={item} />)}
            </nav>

            {/* Extra Tools */}
            {!collapsed && (
              <>
                <div style={{ margin: "14px 0 8px", padding: "0 12px" }}>
                  <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "10px" }} />
                  <span style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", fontFamily: "var(--font-body)" }}>EXTRA TOOLS</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {EXTRA_NAV.map(item => <NavItem key={item.label} item={item} isExtra />)}
                </div>
              </>
            )}

            {collapsed && (
              <>
                <div style={{ margin: "10px 0", height: "1px", background: "rgba(255,255,255,0.06)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {EXTRA_NAV.map(item => <NavItem key={item.label} item={item} isExtra />)}
                </div>
              </>
            )}
          </div>

          {/* Bottom Section */}
          <div style={{ flexShrink: 0, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <button onClick={toggleDarkMode} style={{
              display: "flex", alignItems: "center", gap: collapsed ? "0" : "12px",
              padding: collapsed ? "12px" : "10px 14px", borderRadius: "14px",
              border: "1px solid transparent", background: "transparent",
              cursor: "pointer", width: "100%", transition: "all 0.2s",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              title={collapsed ? (darkMode ? "Light Mode" : "Dark Mode") : ""}
            >
              <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {darkMode ? <HiSun size={17} color="#f59e0b" /> : <HiMoon size={17} color="#8b5cf6" />}
              </div>
              {!collapsed && <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
            </button>

            {!collapsed ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white", flexShrink: 0, fontFamily: "var(--font-body)" }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>{user?.name}</div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
                </div>
                <button onClick={handleLogout} title="Logout" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "8px", padding: "6px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                >
                  <HiLogout size={14} color="#f87171" />
                </button>
              </div>
            ) : (
              <button onClick={handleLogout} title="Logout" style={{ width: "100%", padding: "12px", borderRadius: "14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
              >
                <HiLogout size={17} color="#f87171" />
              </button>
            )}
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      {isMobile && (
        <header style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: "rgba(13,19,33,0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "linear-gradient(135deg, #22c55e, #4ade80)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HiLightningBolt size={16} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>HabitFlow</span>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {menuOpen ? <HiX size={18} color="var(--text-primary)" /> : <HiMenu size={18} color="var(--text-primary)" />}
          </button>
        </header>
      )}

      {/* Mobile Menu */}
      {isMobile && menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 90, paddingTop: "70px", background: "rgba(8,12,20,0.99)", backdropFilter: "blur(20px)", overflowY: "auto" }} className="animate-fade-in">
          <nav style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", padding: "4px 14px 8px", fontFamily: "var(--font-body)" }}>MAIN MENU</div>
            {NAV.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.label} to={item.path} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "14px", background: isActive ? `${item.color}15` : "rgba(255,255,255,0.03)", border: `1px solid ${isActive ? item.color + "30" : "rgba(255,255,255,0.06)"}`, marginBottom: "2px" }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: isActive ? `${item.color}20` : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={isActive ? item.color : "var(--text-muted)"} />
                    </div>
                    <span style={{ fontSize: "15px", fontWeight: 600, color: isActive ? item.color : "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1.5px", padding: "12px 14px 8px", fontFamily: "var(--font-body)" }}>EXTRA TOOLS</div>
            {EXTRA_NAV.map(item => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.path} style={{ textDecoration: "none" }} onClick={() => setMenuOpen(false)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "11px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: "2px" }}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: `${item.color}12`, border: `1px solid ${item.color}25`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={15} color={item.color} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "10px 0" }} />
            <button onClick={toggleDarkMode} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", marginBottom: "4px" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {darkMode ? <HiSun size={18} color="#f59e0b" /> : <HiMoon size={18} color="#8b5cf6" />}
              </div>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "14px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "11px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <HiLogout size={18} color="#f87171" />
              </div>
              <span style={{ fontSize: "15px", fontWeight: 600, color: "#f87171", fontFamily: "var(--font-body)" }}>Logout</span>
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: isMobile ? "0" : sidebarWidth, minHeight: "100vh", transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ paddingTop: isMobile ? "70px" : "0" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px" }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
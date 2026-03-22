import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const THEMES = [
  { id: "dark-green", name: "Forest", primary: "#0a0f1e", accent: "#22c55e", preview: ["#0a0f1e", "#22c55e", "#4ade80"] },
  { id: "dark-purple", name: "Galaxy", primary: "#0d0a1e", accent: "#8b5cf6", preview: ["#0d0a1e", "#8b5cf6", "#a78bfa"] },
  { id: "dark-blue", name: "Ocean", primary: "#0a0f1e", accent: "#3b82f6", preview: ["#0a0f1e", "#3b82f6", "#60a5fa"] },
  { id: "dark-pink", name: "Sakura", primary: "#1a0d14", accent: "#ec4899", preview: ["#1a0d14", "#ec4899", "#f472b6"] },
  { id: "dark-orange", name: "Sunset", primary: "#1a0f0a", accent: "#f97316", preview: ["#1a0f0a", "#f97316", "#fb923c"] },
  { id: "dark-cyan", name: "Arctic", primary: "#0a1a1a", accent: "#06b6d4", preview: ["#0a1a1a", "#06b6d4", "#22d3ee"] },
  { id: "light-green", name: "Nature", primary: "#f0fdf4", accent: "#16a34a", preview: ["#f0fdf4", "#16a34a", "#22c55e"] },
  { id: "light-purple", name: "Lavender", primary: "#faf5ff", accent: "#7c3aed", preview: ["#faf5ff", "#7c3aed", "#8b5cf6"] },
  { id: "light-blue", name: "Sky", primary: "#eff6ff", accent: "#2563eb", preview: ["#eff6ff", "#2563eb", "#3b82f6"] },
  { id: "light-pink", name: "Rose", primary: "#fff1f2", accent: "#e11d48", preview: ["#fff1f2", "#e11d48", "#f43f5e"] },
];

const FONT_SIZES = [
  { id: "sm", label: "Small", size: "13px" },
  { id: "md", label: "Medium", size: "15px" },
  { id: "lg", label: "Large", size: "17px" },
];

const BORDER_RADIUS = [
  { id: "sharp", label: "Sharp", radius: "8px" },
  { id: "rounded", label: "Rounded", radius: "16px" },
  { id: "pill", label: "Pill", radius: "24px" },
];

const ThemeCustomizer = ({ onClose }) => {
  const [activeTheme, setActiveTheme] = useState("dark-green");
  const [fontSize, setFontSize] = useState("md");
  const [borderRadius, setBorderRadius] = useState("rounded");
  const [customAccent, setCustomAccent] = useState("#22c55e");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("ht_theme_settings") || "{}");
    if (stored.theme) setActiveTheme(stored.theme);
    if (stored.fontSize) setFontSize(stored.fontSize);
    if (stored.borderRadius) setBorderRadius(stored.borderRadius);
    if (stored.customAccent) setCustomAccent(stored.customAccent);
  }, []);

  const applyTheme = (themeId, accent, fs, br) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;

    const isDark = themeId.startsWith("dark");
    const root = document.documentElement;
    const accentColor = accent || theme.accent;

    if (isDark) {
      root.style.setProperty("--bg-primary", theme.primary);
      root.style.setProperty("--bg-card", "#111827");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#94a3b8");
      root.style.setProperty("--text-muted", "#475569");
      root.style.setProperty("--border", "rgba(255,255,255,0.08)");
      root.style.setProperty("--accent-light", `${accentColor}18`);
      root.classList.add("dark");
    } else {
      root.style.setProperty("--bg-primary", theme.primary);
      root.style.setProperty("--bg-card", "#ffffff");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border", "#e2e8f0");
      root.style.setProperty("--accent-light", `${accentColor}18`);
      root.classList.remove("dark");
    }

    root.style.setProperty("--accent", accentColor);
    root.style.setProperty("--bg-body", isDark ? `radial-gradient(ellipse at 20% 50%, ${accentColor}06 0%, transparent 50%)` : "none");

    const fontSizeObj = FONT_SIZES.find(f => f.id === (fs || fontSize));
    if (fontSizeObj) root.style.setProperty("--font-size-base", fontSizeObj.size);

    const brObj = BORDER_RADIUS.find(b => b.id === (br || borderRadius));
    if (brObj) root.style.setProperty("--radius-card", brObj.radius);

    const settings = { theme: themeId, fontSize: fs || fontSize, borderRadius: br || borderRadius, customAccent: accentColor };
    localStorage.setItem("ht_theme_settings", JSON.stringify(settings));
  };

  const handleThemeSelect = (themeId) => {
    setActiveTheme(themeId);
    applyTheme(themeId, null, fontSize, borderRadius);
    toast.success(`${THEMES.find(t => t.id === themeId)?.name} theme applied! 🎨`);
  };

  const handleAccentChange = (color) => {
    setCustomAccent(color);
    applyTheme(activeTheme, color, fontSize, borderRadius);
  };

  const handleSave = () => {
    applyTheme(activeTheme, customAccent, fontSize, borderRadius);
    toast.success("Theme saved! 🎨");
    onClose?.();
  };

  const handleReset = () => {
    localStorage.removeItem("ht_theme_settings");
    document.documentElement.style.cssText = "";
    document.documentElement.classList.add("dark");
    setActiveTheme("dark-green");
    setFontSize("md");
    setBorderRadius("rounded");
    setCustomAccent("#22c55e");
    toast.success("Theme reset to default!");
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}>
      <div style={{ width: "100%", maxWidth: "520px", maxHeight: "88vh", background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", animation: "scaleIn 0.3s ease" }}>

        {/* Header */}
        <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.05))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>🎨 Theme Customizer</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Personalize your HabitFlow experience</p>
            </div>
            <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-primary)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

          {/* Theme Presets */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "12px" }}>THEME PRESETS</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
              {THEMES.map(theme => (
                <button key={theme.id} onClick={() => handleThemeSelect(theme.id)} style={{
                  padding: "10px 6px", borderRadius: "12px", border: `2px solid ${activeTheme === theme.id ? "var(--accent)" : "rgba(255,255,255,0.08)"}`,
                  background: activeTheme === theme.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
                  cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                }}>
                  <div style={{ display: "flex", gap: "2px", justifyContent: "center", marginBottom: "6px" }}>
                    {theme.preview.map((c, i) => (
                      <div key={i} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 600, color: activeTheme === theme.id ? "var(--accent)" : "var(--text-muted)" }}>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Accent Color */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "12px" }}>CUSTOM ACCENT COLOR</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input type="color" value={customAccent} onChange={e => handleAccentChange(e.target.value)}
                style={{ width: "52px", height: "52px", borderRadius: "12px", border: "none", cursor: "pointer", background: "none", padding: "2px" }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>Pick any color</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Current: {customAccent}</p>
              </div>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: customAccent, boxShadow: `0 0 20px ${customAccent}60` }} />
            </div>

            {/* Quick colors */}
            <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
              {["#22c55e", "#8b5cf6", "#3b82f6", "#ec4899", "#f97316", "#f59e0b", "#06b6d4", "#ef4444", "#10b981", "#6366f1"].map(c => (
                <button key={c} onClick={() => handleAccentChange(c)}
                  style={{ width: "28px", height: "28px", borderRadius: "8px", background: c, border: `2px solid ${customAccent === c ? "white" : "transparent"}`, cursor: "pointer", transition: "all 0.2s", transform: customAccent === c ? "scale(1.2)" : "scale(1)" }} />
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "12px" }}>FONT SIZE</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {FONT_SIZES.map(f => (
                <button key={f.id} onClick={() => { setFontSize(f.id); applyTheme(activeTheme, customAccent, f.id, borderRadius); }}
                  style={{ flex: 1, padding: "10px", borderRadius: "12px", border: `1px solid ${fontSize === f.id ? "var(--accent)" : "rgba(255,255,255,0.08)"}`, background: fontSize === f.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", color: fontSize === f.id ? "var(--accent)" : "var(--text-muted)", fontSize: f.size, fontWeight: 600, transition: "all 0.2s" }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "1px", display: "block", marginBottom: "12px" }}>CARD STYLE</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {BORDER_RADIUS.map(b => (
                <button key={b.id} onClick={() => { setBorderRadius(b.id); applyTheme(activeTheme, customAccent, fontSize, b.id); }}
                  style={{ flex: 1, padding: "12px", border: `1px solid ${borderRadius === b.id ? "var(--accent)" : "rgba(255,255,255,0.08)"}`, background: borderRadius === b.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", cursor: "pointer", color: borderRadius === b.id ? "var(--accent)" : "var(--text-muted)", fontSize: "12px", fontWeight: 600, transition: "all 0.2s", borderRadius: b.radius }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: "10px" }}>
          <button onClick={handleReset} style={{ flex: 1, padding: "11px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "var(--text-muted)", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>↺ Reset</button>
          <button onClick={handleSave} style={{ flex: 2, padding: "11px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--accent), var(--accent)cc)", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: 700, boxShadow: "0 4px 15px rgba(34,197,94,0.3)" }}>Save Theme 🎨</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomizer;
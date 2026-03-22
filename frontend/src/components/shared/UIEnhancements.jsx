import React, { useState, useEffect } from "react";

// ─── Skeleton Loader Component ─────────────────────────────────────────────
export const Skeleton = ({ width = "100%", height = "20px", rounded = false, className = "" }) => (
  <div style={{
    width, height,
    borderRadius: rounded ? "100px" : "8px",
    background: "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
  }} className={className} />
);

// ─── Skeleton Card ──────────────────────────────────────────────────────────
export const SkeletonCard = () => (
  <div className="card" style={{ animation: "fadeIn 0.3s ease" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
      <Skeleton width="40px" height="40px" rounded />
      <div style={{ flex: 1 }}>
        <Skeleton width="60%" height="16px" />
        <div style={{ marginTop: "6px" }}>
          <Skeleton width="40%" height="12px" />
        </div>
      </div>
    </div>
    <Skeleton width="100%" height="8px" />
    <div style={{ marginTop: "6px" }}>
      <Skeleton width="75%" height="8px" />
    </div>
    <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
      <Skeleton width="80px" height="24px" rounded />
      <Skeleton width="80px" height="24px" rounded />
    </div>
  </div>
);

// ─── Animated Button ────────────────────────────────────────────────────────
export const AnimatedButton = ({
  children, onClick, variant = "primary", loading = false,
  icon, gradient = false, className = "", disabled = false, ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
  };

  const gradientStyles = gradient ? {
    background: isHovered
      ? "linear-gradient(135deg, #8b5cf6, #3b82f6, #ec4899)"
      : "linear-gradient(135deg, #6366f1, #22c55e, #3b82f6)",
    backgroundSize: "200% 200%",
    animation: isHovered ? "gradientShift 2s ease infinite" : "none",
    border: "none",
    color: "white",
  } : {};

  const baseStyle = {
    position: "relative",
    overflow: "hidden",
    transform: isHovered && !disabled ? "translateY(-2px) scale(1.02)" : "translateY(0) scale(1)",
    boxShadow: isHovered && !disabled
      ? gradient
        ? "0 8px 30px rgba(99,102,241,0.4)"
        : "0 8px 25px rgba(34,197,94,0.3)"
      : "none",
    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...gradientStyles,
  };

  return (
    <button
      className={`btn${variant === "primary" ? "-primary" : variant === "danger" ? "-danger" : "-secondary"} ${className}`}
      style={baseStyle}
      onClick={(e) => { if (!disabled && !loading) { addRipple(e); onClick?.(e); } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || loading}
      {...props}
    >
      {ripples.map(r => (
        <span key={r.id} style={{
          position: "absolute",
          left: r.x - 15, top: r.y - 15,
          width: "30px", height: "30px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.3)",
          animation: "ripple 0.6s ease-out forwards",
          pointerEvents: "none",
        }} />
      ))}
      {loading ? (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            width: "14px", height: "14px",
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "white",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            display: "inline-block",
          }} />
          Loading...
        </span>
      ) : (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon && <span>{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
};

// ─── Gradient Badge ─────────────────────────────────────────────────────────
export const GradientBadge = ({ children, gradient = "green" }) => {
  const gradients = {
    green: "linear-gradient(135deg, #22c55e, #4ade80)",
    purple: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    pink: "linear-gradient(135deg, #ec4899, #f472b6)",
    blue: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    rainbow: "linear-gradient(135deg, #6366f1, #22c55e, #f59e0b)",
    sunset: "linear-gradient(135deg, #f59e0b, #ef4444, #8b5cf6)",
  };
  return (
    <span style={{
      padding: "4px 12px",
      borderRadius: "100px",
      fontSize: "11px",
      fontWeight: 700,
      background: gradients[gradient] || gradients.green,
      color: "white",
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    }}>
      {children}
    </span>
  );
};

// ─── Animated Progress Bar ──────────────────────────────────────────────────
export const AnimatedProgressBar = ({ value = 0, gradient = "green", showLabel = true, height = "10px" }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const gradients = {
    green: "linear-gradient(90deg, #22c55e, #4ade80, #86efac)",
    purple: "linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd)",
    rainbow: "linear-gradient(90deg, #6366f1, #22c55e, #f59e0b)",
    sunset: "linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)",
    blue: "linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)",
  };

  return (
    <div style={{ position: "relative" }}>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Progress</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>{Math.round(value)}%</span>
        </div>
      )}
      <div style={{
        width: "100%", height,
        borderRadius: "100px",
        background: "var(--border)",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{
          width: `${width}%`, height: "100%",
          borderRadius: "100px",
          background: gradients[gradient] || gradients.green,
          transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backgroundSize: "200% 100%",
          animation: "gradientShift 3s ease infinite",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
            animation: "shimmer 2s infinite",
            backgroundSize: "200% 100%",
          }} />
        </div>
      </div>
    </div>
  );
};

// ─── Floating Label Input ───────────────────────────────────────────────────
export const FloatingInput = ({ label, type = "text", value, onChange, icon, ...props }) => {
  const [focused, setIsFocused] = useState(false);
  const isActive = focused || value;

  return (
    <div style={{ position: "relative", marginBottom: "4px" }}>
      {icon && (
        <span style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "16px",
          zIndex: 1,
          transition: "all 0.3s",
          opacity: focused ? 1 : 0.5,
        }}>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="input"
        placeholder={label}
        style={{
          paddingLeft: icon ? "44px" : "16px",
          paddingTop: "12px",
          border: focused
            ? "2px solid var(--accent)"
            : "2px solid var(--border)",
          boxShadow: focused ? "0 0 0 4px rgba(34,197,94,0.1)" : "none",
          transition: "all 0.3s",
        }}
        {...props}
      />
    </div>
  );
};

// ─── Pulse Dot (for notifications) ─────────────────────────────────────────
export const PulseDot = ({ color = "#22c55e", size = 10 }) => (
  <span style={{ position: "relative", display: "inline-flex" }}>
    <span style={{
      width: size, height: size,
      borderRadius: "50%",
      background: color,
      display: "block",
    }} />
    <span style={{
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: color,
      animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      opacity: 0.75,
    }} />
  </span>
);

// ─── Tooltip ────────────────────────────────────────────────────────────────
export const Tooltip = ({ children, text, position = "top" }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute",
          [position === "top" ? "bottom" : "top"]: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "6px 12px",
          borderRadius: "8px",
          background: "rgba(0,0,0,0.85)",
          color: "white",
          fontSize: "12px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          zIndex: 100,
          animation: "scaleIn 0.15s ease",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          {text}
        </div>
      )}
    </div>
  );
};

// ─── Count Up Number ────────────────────────────────────────────────────────
export const CountUp = ({ end, duration = 1500, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{prefix}{count}{suffix}</span>;
};
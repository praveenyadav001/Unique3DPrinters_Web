import { Bell, Menu, ChevronDown, Clock } from "lucide-react";

interface WorkerTopBarProps {
  onMenuToggle: () => void;
}

export default function WorkerTopBar({ onMenuToggle }: WorkerTopBarProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <button className="dashboard-mobile-toggle" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>
        <div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>
            {greeting}, Rahul! 👋
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
            Here's your workspace overview.
          </div>
        </div>
      </div>

      <div className="dashboard-topbar-right">
        {/* Workshop selector */}
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#111", border: "1px solid #222", borderRadius: 8,
          padding: "8px 14px", color: "#ccc", cursor: "pointer",
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem",
        }}>
          Workshop A <ChevronDown size={14} style={{ color: "#555" }} />
        </button>

        {/* Notifications */}
        <button className="dashboard-icon-btn" title="Notifications" style={{ position: "relative" }}>
          <Bell size={16} />
          <span style={{
            position: "absolute", top: 5, right: 5, width: 7, height: 7,
            borderRadius: "50%", background: "#EF4444", border: "1.5px solid #111",
          }} />
        </button>

        {/* Current Shift */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#111", border: "1px solid #1a1a1a", borderRadius: 8,
          padding: "8px 14px",
        }}>
          <Clock size={14} style={{ color: "var(--accent)" }} />
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Current Shift
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff" }}>
              09:00 AM - 06:00 PM
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

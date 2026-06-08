import { Search, Bell, Menu, ChevronDown } from "lucide-react";

interface AdminTopBarProps {
  onMenuToggle: () => void;
}

export default function AdminTopBar({ onMenuToggle }: AdminTopBarProps) {
  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <button className="dashboard-mobile-toggle" onClick={onMenuToggle}><Menu size={20} /></button>
        <div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>Dashboard</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>Welcome back, Admin!</div>
        </div>
      </div>
      <div className="dashboard-topbar-right">
        <div className="dashboard-topbar-search" style={{ minWidth: 260 }}>
          <Search size={14} />
          <input type="text" placeholder="Search orders, users, designs..." />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#444", border: "1px solid #333", borderRadius: 4, padding: "1px 6px" }}>/</span>
        </div>
        <button className="dashboard-icon-btn" title="Notifications" style={{ position: "relative" }}>
          <Bell size={16} />
          <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: "1.5px solid #111" }} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #FF8A3D)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#000",
            border: "2px solid #222",
          }}>A</div>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", lineHeight: 1.2 }}>Admin</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555" }}>Super Admin</div>
          </div>
          <ChevronDown size={14} style={{ color: "#555" }} />
        </div>
      </div>
    </header>
  );
}

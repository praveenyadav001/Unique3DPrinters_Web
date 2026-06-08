import { Search, Bell, Menu } from "lucide-react";

interface TopBarProps {
  onMenuToggle: () => void;
  userName?: string;
  userInitials?: string;
}

export default function TopBar({ onMenuToggle, userName = "User", userInitials }: TopBarProps) {
  const initials = userInitials || userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="dashboard-topbar">
      <div className="dashboard-topbar-left">
        <button className="dashboard-mobile-toggle" onClick={onMenuToggle}>
          <Menu size={20} />
        </button>

        <div className="dashboard-topbar-search">
          <Search size={14} />
          <input type="text" placeholder="Search designs, orders..." />
        </div>
      </div>

      <div className="dashboard-topbar-right">
        {/* Notification bell */}
        <button className="dashboard-icon-btn" title="Notifications" style={{ position: "relative" }}>
          <Bell size={16} />
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#EF4444",
            }}
          />
        </button>

        {/* User avatar */}
        <div className="dashboard-avatar" title={userName}>
          {initials}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {userName}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              color: "#555",
            }}
          >
            Customer
          </span>
        </div>
      </div>
    </header>
  );
}

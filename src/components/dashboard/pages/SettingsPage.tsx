import { useState } from "react";
import { Moon, Sun, Bell, Shield, Globe, Palette } from "lucide-react";

const THEMES = [
  { name: "Amber", hex: "#FF5C00", rgb: "255, 92, 0", secondary: "#00E5FF" },
  { name: "Cyan", hex: "#00E5FF", rgb: "0, 229, 255", secondary: "#10B981" },
  { name: "Green", hex: "#10B981", rgb: "16, 185, 129", secondary: "#FF5C00" },
  { name: "Purple", hex: "#A855F7", rgb: "168, 85, 247", secondary: "#FF5C00" },
];

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoEmails, setPromoEmails] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);

  const applyTheme = (idx: number) => {
    setSelectedTheme(idx);
    const t = THEMES[idx];
    const root = document.documentElement;
    root.style.setProperty("--accent", t.hex);
    root.style.setProperty("--accent-rgb", t.rgb);
    root.style.setProperty("--accent-glow", `rgba(${t.rgb}, 0.15)`);
    root.style.setProperty("--accent-secondary", t.secondary);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "var(--accent)" : "#333",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s",
        }}
      />
    </button>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Settings</h2>
        <p>Manage your preferences.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>
        {/* Appearance */}
        <div className="dash-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Palette size={18} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Appearance
            </h3>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#ccc", fontSize: "0.9rem" }}>
                {darkMode ? "Dark Mode" : "Light Mode"}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
                Toggle between dark and light themes
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sun size={14} style={{ color: darkMode ? "#444" : "var(--accent)" }} />
              <Toggle checked={darkMode} onChange={setDarkMode} />
              <Moon size={14} style={{ color: darkMode ? "var(--accent)" : "#444" }} />
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#ccc", fontSize: "0.9rem", marginBottom: 4 }}>
              Accent Color
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", marginBottom: 12 }}>
              Choose your preferred accent color
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {THEMES.map((theme, idx) => (
                <button
                  key={theme.name}
                  onClick={() => applyTheme(idx)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: theme.hex,
                    border: selectedTheme === idx ? "3px solid #fff" : "2px solid #333",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: selectedTheme === idx ? `0 0 16px ${theme.hex}50` : "none",
                    transform: selectedTheme === idx ? "scale(1.1)" : "scale(1)",
                  }}
                  title={theme.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="dash-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Bell size={18} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Notifications
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                label: "Push Notifications",
                desc: "Receive push notifications for updates",
                checked: notifications,
                onChange: setNotifications,
              },
              {
                label: "Order Updates",
                desc: "Get notified when your order status changes",
                checked: orderUpdates,
                onChange: setOrderUpdates,
              },
              {
                label: "Promotional Emails",
                desc: "Receive offers and marketing emails",
                checked: promoEmails,
                onChange: setPromoEmails,
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#ccc", fontSize: "0.9rem" }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
                    {item.desc}
                  </div>
                </div>
                <Toggle checked={item.checked} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="dash-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Shield size={18} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Security
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="dash-label">Current Password</label>
              <input className="dash-input" type="password" placeholder="••••••••" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="dash-label">New Password</label>
                <input className="dash-input" type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="dash-label">Confirm Password</label>
                <input className="dash-input" type="password" placeholder="••••••••" />
              </div>
            </div>
            <button className="dash-btn-primary" style={{ width: "fit-content", marginTop: 4 }}>
              Update Password
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="dash-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Globe size={18} style={{ color: "var(--accent)" }} />
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Language & Region
            </h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label className="dash-label">Language</label>
              <select className="dash-select">
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
                <option>Kannada</option>
              </select>
            </div>
            <div>
              <label className="dash-label">Currency</label>
              <select className="dash-select">
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

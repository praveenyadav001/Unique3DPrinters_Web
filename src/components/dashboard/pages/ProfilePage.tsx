import { User, Mail, Phone, MapPin, Camera } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Profile</h2>
        <p>Manage your account information.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        {/* Left - Avatar & Quick Info */}
        <div className="dash-card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), #FF8A3D)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 800,
                fontSize: "2rem",
                color: "#000",
                border: "3px solid #222",
              }}
            >
              PY
            </div>
            <button
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "var(--accent)",
                border: "2px solid #111",
                color: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Camera size={13} />
            </button>
          </div>
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "#fff",
              margin: "0 0 4px",
            }}
          >
            Praveen Yadav
          </h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", margin: "0 0 20px" }}>
            Customer since May 2024
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: <Mail size={14} />, text: "praveen@email.com" },
              { icon: <Phone size={14} />, text: "+91 94943 88918" },
              { icon: <MapPin size={14} />, text: "Hyderabad, India" },
            ].map((info, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#666",
                }}
              >
                <span style={{ color: "var(--accent)" }}>{info.icon}</span>
                {info.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Profile Form */}
        <div className="dash-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <User size={18} style={{ color: "var(--accent)" }} />
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
              Personal Information
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label className="dash-label">First Name</label>
              <input className="dash-input" defaultValue="Praveen" />
            </div>
            <div>
              <label className="dash-label">Last Name</label>
              <input className="dash-input" defaultValue="Yadav" />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label className="dash-label">Email Address</label>
              <input className="dash-input" type="email" defaultValue="praveen@email.com" />
            </div>
            <div>
              <label className="dash-label">Phone Number</label>
              <input className="dash-input" defaultValue="+91 94943 88918" />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="dash-label">Address</label>
            <textarea
              className="dash-input"
              defaultValue="Hyderabad, Telangana, India"
              style={{ resize: "vertical", minHeight: 80 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label className="dash-label">City</label>
              <input className="dash-input" defaultValue="Hyderabad" />
            </div>
            <div>
              <label className="dash-label">Pincode</label>
              <input className="dash-input" defaultValue="500001" />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="dash-btn-primary">Save Changes</button>
            <button className="dash-btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginTop: 24,
        }}
      >
        {[
          { label: "Total Orders", value: "7", color: "var(--accent)" },
          { label: "Completed", value: "5", color: "#10B981" },
          { label: "In Progress", value: "2", color: "#EAB308" },
          { label: "Total Spent", value: "₹4,280", color: "#00E5FF" },
        ].map((stat, i) => (
          <div key={i} className="dash-stat-mini">
            <div style={{ flex: 1 }}>
              <div className="stat-value" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

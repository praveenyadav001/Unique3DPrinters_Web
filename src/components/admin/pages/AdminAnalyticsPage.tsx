import { Activity, Users, MousePointerClick, TrendingUp, DownloadCloud } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Website Analytics</h2>
          <p>Traffic, conversions, and user behavior metrics.</p>
        </div>
        <button className="dash-btn-secondary">
          <DownloadCloud size={16} /> Export CSV
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Page Views", value: "24.5K", diff: "+12%", icon: <Activity /> },
          { label: "Unique Visitors", value: "8.2K", diff: "+5%", icon: <Users /> },
          { label: "Conversion Rate", value: "3.4%", diff: "-1.2%", icon: <MousePointerClick />, negative: true },
          { label: "Avg Session", value: "4m 12s", diff: "+18s", icon: <TrendingUp /> },
        ].map((stat, i) => (
          <div key={i} className="dash-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc" }}>
                {stat.icon}
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: stat.negative ? "#EF4444" : "#10B981" }}>
                {stat.diff}
              </span>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666", textTransform: "uppercase", marginBottom: 4 }}>{stat.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="dash-card" style={{ minHeight: 350, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Activity size={40} style={{ color: "#333", marginBottom: 16 }} />
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#555" }}>Traffic Over Time</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444" }}>Chart component rendering goes here.</div>
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 0 16px" }}>
            Top Traffic Sources
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { source: "Google Organic", pct: 45, color: "#4285F4" },
              { source: "Direct", pct: 25, color: "#10B981" },
              { source: "Social Media", pct: 18, color: "#EAB308" },
              { source: "Referral", pct: 12, color: "#8B5CF6" },
            ].map((src, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#ccc" }}>{src.source}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888" }}>{src.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${src.pct}%`, height: "100%", background: src.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

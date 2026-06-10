import { Activity, Users, MousePointerClick, TrendingUp, DownloadCloud } from "lucide-react";

// SVG Traffic Chart
function TrafficChart() {
  const data = [1200, 1900, 1500, 2200, 1800, 2800, 2400, 3200, 3800, 3100, 4200, 4800, 4500, 5200];
  const w = 600, h = 250;
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.8; // Give some bottom padding
  const range = max - min;
  
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 30}`} width="100%" height="100%" preserveAspectRatio="none" style={{ minHeight: 250 }}>
      <defs>
        <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1="0" y1={h * p} x2={w} y2={h * p} stroke="#1a1a1a" strokeWidth="1" />
      ))}
      <polygon points={areaPoints} fill="url(#trafficGrad)" />
      <polyline points={points} fill="none" stroke="#8B5CF6" strokeWidth="3" />
      
      {/* Tooltip dot on highest point */}
      {(() => {
        const maxIdx = data.indexOf(max);
        const cx = (maxIdx / (data.length - 1)) * w;
        const cy = h - ((max - min) / range) * h;
        return (
          <g>
            <circle cx={cx} cy={cy} r="5" fill="#8B5CF6" stroke="#0A0A0A" strokeWidth="2" />
            <rect x={cx - 40} y={cy - 30} width="80" height="22" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
            <text x={cx} y={cy - 15} textAnchor="middle" fill="#fff" fontFamily="'DM Mono', monospace" fontSize="10">
              {max.toLocaleString()} visits
            </text>
          </g>
        );
      })()}
      
      {/* X axis labels */}
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((l, i) => (
        <text key={i} x={(i / 6) * w} y={h + 20} fill="#555" fontFamily="'DM Mono', monospace" fontSize="10" textAnchor="middle">
          {l}
        </text>
      ))}
    </svg>
  );
}

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
        <div className="dash-card" style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0 }}>
              Traffic Over Time
            </h3>
            <select className="dash-select" style={{ width: "auto", padding: "6px 30px 6px 12px", fontSize: "0.7rem" }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <TrafficChart />
          </div>
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

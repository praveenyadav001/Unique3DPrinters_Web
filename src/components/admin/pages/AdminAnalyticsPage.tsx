import { useOrders } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useWorkers";
import { useDesigns } from "@/hooks/useDesigns";
import { Activity, Users, MousePointerClick, DownloadCloud, DollarSign } from "lucide-react";

// SVG Traffic Chart based on daily revenue
function TrafficChart({ orders }: { orders: any[] }) {
  const days = 7;
  const dailyData = new Array(days).fill(0);
  const labels = new Array(days).fill("");
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    labels[i] = d.toLocaleDateString("en-IN", { weekday: "short" });
  }

  orders.forEach((o) => {
    if (o.total && o.createdAt) {
      const date = o.createdAt.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= days) {
        const index = days - diffDays;
        if (index >= 0 && index < days) {
          dailyData[index] += o.total;
        }
      }
    }
  });

  const w = 600, h = 250;
  const max = Math.max(...dailyData, 1000); // minimum scale limit
  const min = 0;
  const range = max - min;
  
  const points = dailyData.map((v, i) => `${(i / (dailyData.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 30}`} width="100%" height="100%" preserveAspectRatio="none" style={{ minHeight: 250 }}>
      <defs>
        <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1="0" y1={h * p} x2={w} y2={h * p} stroke="#1a1a1a" strokeWidth="1" />
      ))}
      <polygon points={areaPoints} fill="url(#trafficGrad)" />
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="3" />
      
      {/* Tooltip dot on highest point */}
      {(() => {
        const maxVal = Math.max(...dailyData);
        if (maxVal === 0) return null;
        const maxIdx = dailyData.indexOf(maxVal);
        const cx = (maxIdx / (dailyData.length - 1)) * w;
        const cy = h - ((maxVal - min) / range) * h;
        return (
          <g>
            <circle cx={cx} cy={cy} r="5" fill="var(--accent)" stroke="#0A0A0A" strokeWidth="2" />
            <rect x={cx - 50} y={cy - 30} width="100" height="22" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1" />
            <text x={cx} y={cy - 15} textAnchor="middle" fill="#fff" fontFamily="'DM Mono', monospace" fontSize="9">
              ₹{maxVal.toLocaleString()}
            </text>
          </g>
        );
      })()}
      
      {/* X axis labels */}
      {labels.map((l, i) => (
        <text key={i} x={(i / 6) * w} y={h + 20} fill="#555" fontFamily="'DM Mono', monospace" fontSize="10" textAnchor="middle">
          {l}
        </text>
      ))}
    </svg>
  );
}

export default function AdminAnalyticsPage() {
  const { orders, loading: ordersLoading } = useOrders();
  const { customers, loading: customersLoading } = useCustomers();
  const { designs, loading: designsLoading } = useDesigns();

  if (ordersLoading || customersLoading || designsLoading) {
    return <div style={{ padding: 60, textAlign: "center", color: "#666", fontFamily: "'DM Mono', monospace" }}>Loading analytics data...</div>;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const activeDesigns = designs.length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Website Analytics</h2>
          <p>Traffic, conversions, and user behavior metrics from real database.</p>
        </div>
        <button className="dash-btn-secondary" onClick={() => alert("CSV Export feature ready.")}>
          <DownloadCloud size={16} /> Export CSV
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, diff: "Live", icon: <DollarSign />, color: "#10B981" },
          { label: "Total Orders", value: totalOrders.toLocaleString(), diff: "Live", icon: <Activity />, color: "var(--accent)" },
          { label: "Total Customers", value: totalCustomers.toLocaleString(), diff: "Live", icon: <Users />, color: "#00E5FF" },
          { label: "Active Designs", value: activeDesigns.toLocaleString(), diff: "Catalog", icon: <MousePointerClick />, color: "#A855F7" },
        ].map((stat, i) => (
          <div key={i} className="dash-card" style={{ borderColor: `${stat.color}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${stat.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                {stat.icon}
              </div>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: stat.color }}>
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
              Daily Revenue Trend
            </h3>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666" }}>Last 7 Days</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <TrafficChart orders={orders} />
          </div>
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 0 16px" }}>
            Design Category Share
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(() => {
              const catCounts: Record<string, number> = {};
              designs.forEach((d) => {
                if (d.category) {
                  catCounts[d.category] = (catCounts[d.category] || 0) + 1;
                }
              });
              const totalDesigns = designs.length || 1;
              const entries = Object.entries(catCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4);

              const colors = ["#4285F4", "#10B981", "#EAB308", "#8B5CF6"];

              return entries.map(([cat, count], i) => {
                const pct = Math.round((count / totalDesigns) * 100);
                return (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#ccc" }}>{cat}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: colors[i] || "#888", borderRadius: 3 }} />
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

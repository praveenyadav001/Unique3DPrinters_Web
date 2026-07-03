import { BarChart3, TrendingUp, Users, Package, IndianRupee } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useWorkers";
import type { Timestamp } from "firebase/firestore";

function toDate(value: Timestamp | Date | string | number): Date {
  return value instanceof Date ? value : typeof value === "object" && "toDate" in value ? value.toDate() : new Date(value);
}

export default function AdminReportsPage() {
  const { orders } = useOrders();
  const { customers } = useCustomers();

  // Calculate stats
  const totalRevenue = orders.filter(o => o.status === "Shipped" || o.status === "Delivered" || o.status === "Processing" || o.status === "Printing")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  
  const totalOrders = orders.length;
  
  const completedOrders = orders.filter(o => o.status === "Shipped" || o.status === "Delivered").length;
  
  const newCustomers = customers.filter(c => {
    // customers created in last 30 days
    if (!c.createdAt) return false;
    const date = toDate(c.createdAt);
    return (new Date().getTime() - date.getTime()) / (1000 * 3600 * 24) < 30;
  }).length;

  // ─── Monthly revenue for the last 6 months ───
  const isRevenueStatus = (s: string) =>
    s === "Processing" || s === "Printing" || s === "Shipped" || s === "Delivered";

  const now = new Date();
  const months: { label: string; total: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleDateString("en-IN", { month: "short" }), total: 0 });
  }
  orders.forEach((o) => {
    if (!o.createdAt || !o.total || !isRevenueStatus(o.status)) return;
    const date = toDate(o.createdAt);
    const monthsAgo = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    if (monthsAgo >= 0 && monthsAgo < 6) months[5 - monthsAgo].total += o.total;
  });
  const maxMonth = Math.max(...months.map((m) => m.total), 1);

  // Real month-over-month revenue growth (current vs previous month).
  const curMonthRev = months[5].total;
  const prevMonthRev = months[4].total;
  const revenueGrowth = prevMonthRev > 0
    ? ((curMonthRev - prevMonthRev) / prevMonthRev) * 100
    : curMonthRev > 0 ? 100 : 0;

  // ─── Top selling designs (by quantity) from real order items ───
  const designStats: Record<string, { sales: number; rev: number }> = {};
  orders.forEach((o) => {
    (o.items || []).forEach((it) => {
      const key = it.designName || "Unknown";
      if (!designStats[key]) designStats[key] = { sales: 0, rev: 0 };
      designStats[key].sales += it.quantity || 0;
      designStats[key].rev += (it.price || 0) * (it.quantity || 0);
    });
  });
  const topDesigns = Object.entries(designStats)
    .map(([name, s]) => ({ name, ...s }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Business Reports</h2>
        <p>Analytics and insights on store performance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="dash-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00E5FF" }}>
              <IndianRupee size={18} />
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: revenueGrowth >= 0 ? "#10B981" : "#EF4444", display: "flex", alignItems: "center", gap: 2 }} title="Month-over-month revenue change">
              <TrendingUp size={10} style={{ transform: revenueGrowth < 0 ? "scaleY(-1)" : "none" }} /> {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth.toFixed(1)}%
            </span>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666", textTransform: "uppercase", marginBottom: 4 }}>Total Revenue</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff" }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <Package size={18} />
            </div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666", textTransform: "uppercase", marginBottom: 4 }}>Total Orders</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff" }}>
            {totalOrders}
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
              <BarChart3 size={18} />
            </div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666", textTransform: "uppercase", marginBottom: 4 }}>Completed Prints</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff" }}>
            {completedOrders}
          </div>
        </div>

        <div className="dash-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(234, 179, 8, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#EAB308" }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666", textTransform: "uppercase", marginBottom: 4 }}>New Customers (30d)</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff" }}>
            {newCustomers}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="dash-card" style={{ minHeight: 300, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0 }}>
              Revenue Trend
            </h3>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666" }}>Last 6 Months</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 14, padding: "12px 4px 0", minHeight: 220 }}>
            {months.map((m, i) => {
              const heightPct = (m.total / maxMonth) * 100;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: 200, justifyContent: "flex-end" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#888", whiteSpace: "nowrap" }}>
                    {m.total > 0 ? `₹${m.total.toLocaleString()}` : ""}
                  </div>
                  <div title={`₹${m.total.toLocaleString()}`} style={{ width: "100%", maxWidth: 46, height: `${Math.max(heightPct, 1.5)}%`, background: "linear-gradient(180deg, var(--accent), rgba(var(--accent-rgb), 0.25))", borderRadius: "6px 6px 0 0", minHeight: 4 }} />
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666" }}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 0 16px" }}>
            Top Selling Designs
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topDesigns.length === 0 && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", textAlign: "center", padding: "20px 0" }}>
                No sales data yet.
              </div>
            )}
            {topDesigns.map((d, i) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: i < topDesigns.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666" }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>{d.sales} sold</div>
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)" }}>
                  ₹{d.rev.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

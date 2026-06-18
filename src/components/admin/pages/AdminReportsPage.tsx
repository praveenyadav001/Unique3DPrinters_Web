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
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#10B981", display: "flex", alignItems: "center", gap: 2 }}>
              <TrendingUp size={10} /> +12.5%
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
        <div className="dash-card" style={{ minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <BarChart3 size={40} style={{ color: "#333", marginBottom: 16 }} />
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#555" }}>Revenue Chart Placeholder</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444" }}>A chart library like Recharts would be used here.</div>
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: "0 0 16px" }}>
            Top Selling Designs
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Mock data for top selling */}
            {[
              { name: "Articulated Dragon", sales: 42, rev: 42000 },
              { name: "Custom Lithophane", sales: 28, rev: 14000 },
              { name: "Controller Stand", sales: 15, rev: 7500 },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 12, borderBottom: i < 2 ? "1px solid #1a1a1a" : "none" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#111", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666" }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>{d.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>{d.sales} sales</div>
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

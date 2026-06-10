import { useState } from "react";
import { CheckCircle2, Package, Truck, Search, Loader } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

type CompletedFilter = "all" | "shipped" | "delivered";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function WorkerCompletedPage() {
  const { orders, loading } = useOrders();
  const [filter, setFilter] = useState<CompletedFilter>("all");
  const [search, setSearch] = useState("");

  const completed = orders
    .filter((o) => {
      if (filter === "shipped") return o.status === "Shipped";
      if (filter === "delivered") return o.status === "Delivered";
      return o.status === "Shipped" || o.status === "Delivered";
    })
    .filter((o) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return o.orderNumber.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s);
    });

  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Completed Jobs</h2>
        <p>History of shipped and delivered orders — {shippedCount + deliveredCount} total.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        <button onClick={() => setFilter("all")} className="dash-card" style={{
          padding: "14px 16px", cursor: "pointer", textAlign: "left",
          borderColor: filter === "all" ? "rgba(var(--accent-rgb), 0.3)" : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <CheckCircle2 size={14} style={{ color: "#10B981" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase" }}>Total Completed</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{shippedCount + deliveredCount}</div>
        </button>
        <button onClick={() => setFilter("shipped")} className="dash-card" style={{
          padding: "14px 16px", cursor: "pointer", textAlign: "left",
          borderColor: filter === "shipped" ? "rgba(0, 229, 255, 0.3)" : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Truck size={14} style={{ color: "#00E5FF" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase" }}>Shipped</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{shippedCount}</div>
        </button>
        <button onClick={() => setFilter("delivered")} className="dash-card" style={{
          padding: "14px 16px", cursor: "pointer", textAlign: "left",
          borderColor: filter === "delivered" ? "rgba(16, 185, 129, 0.3)" : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Package size={14} style={{ color: "#10B981" }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase" }}>Delivered</span>
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{deliveredCount}</div>
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 400 }}>
          <Search size={14} />
          <input placeholder="Search completed orders..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          </div>
        ) : completed.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#333" }}>No completed jobs yet</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444", marginTop: 4 }}>Completed orders will appear here.</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Order ID", "Design", "Customer", "Amount", "Completed On", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {completed.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>#{o.orderNumber}</td>
                  <td style={{ padding: "12px 16px", color: "#ccc" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle2 size={12} style={{ color: "#10B981" }} />
                      {o.items?.[0]?.designName || "Custom Design"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>{o.customerName}</td>
                  <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>₹{o.total?.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(o.updatedAt)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`dash-badge ${o.status === "Delivered" ? "dash-badge-green" : "dash-badge-blue"}`} style={{ fontSize: "0.5rem" }}>
                      {o.status === "Delivered" ? <><Package size={8} /> Delivered</> : <><Truck size={8} /> Shipped</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

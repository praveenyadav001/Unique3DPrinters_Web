import { useState } from "react";
import {
  ClipboardList, Loader, CheckCircle2, AlertCircle,
  Search, ArrowUpDown,
} from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/services/orders.service";

type TaskFilter = "all" | "pending" | "processing" | "completed";

const STATUS_BADGE: Record<string, string> = {
  Pending: "dash-badge-yellow",
  Confirmed: "dash-badge-blue",
  Processing: "dash-badge-accent",
  Printing: "dash-badge-accent",
  "Post Processing": "dash-badge-accent",
  Shipped: "dash-badge-green",
  Delivered: "dash-badge-green",
  Cancelled: "dash-badge-red",
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function WorkerTasksPage() {
  const { orders, loading } = useOrders();
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = orders
    .filter((o) => {
      if (filter === "pending") return o.status === "Pending" || o.status === "Confirmed";
      if (filter === "processing") return o.status === "Processing" || o.status === "Printing";
      if (filter === "completed") return o.status === "Shipped" || o.status === "Delivered";
      return true;
    })
    .filter((o) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s) ||
        o.items?.[0]?.designName?.toLowerCase().includes(s)
      );
    })
    .sort((a, b) => {
      const aT = a.createdAt?.toDate?.()?.getTime() || 0;
      const bT = b.createdAt?.toDate?.()?.getTime() || 0;
      return sortAsc ? aT - bT : bT - aT;
    });

  const pendingCount = orders.filter((o) => o.status === "Pending" || o.status === "Confirmed").length;
  const processingCount = orders.filter((o) => o.status === "Processing" || o.status === "Printing").length;
  const completedCount = orders.filter((o) => o.status === "Shipped" || o.status === "Delivered").length;

  const handleUpdateStatus = async (docId: string, newStatus: string) => {
    try { await updateOrderStatus(docId, newStatus as any); }
    catch { alert("Failed to update status."); }
  };

  const TABS: { key: TaskFilter; label: string; count: number; icon: React.ReactNode; color: string }[] = [
    { key: "all", label: "All Tasks", count: orders.length, icon: <ClipboardList size={14} />, color: "var(--accent)" },
    { key: "pending", label: "Pending", count: pendingCount, icon: <AlertCircle size={14} />, color: "#EAB308" },
    { key: "processing", label: "In Progress", count: processingCount, icon: <Loader size={14} />, color: "#00E5FF" },
    { key: "completed", label: "Completed", count: completedCount, icon: <CheckCircle2 size={14} />, color: "#10B981" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>My Tasks</h2>
          <p>Manage and update your assigned print orders.</p>
        </div>
      </div>

      {/* Stat Mini-Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className="dash-card" style={{
              padding: "14px 16px", cursor: "pointer", textAlign: "left",
              borderColor: filter === t.key ? `${t.color}40` : undefined,
              background: filter === t.key ? `${t.color}08` : undefined,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: t.color }}>{t.icon}</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>{t.label}</span>
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff", lineHeight: 1 }}>{t.count}</div>
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div className="dashboard-topbar-search" style={{ flex: 1, minWidth: 0 }}>
          <Search size={14} />
          <input placeholder="Search by order ID, customer, design..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className="dashboard-icon-btn" onClick={() => setSortAsc(!sortAsc)} title="Toggle sort order">
          <ArrowUpDown size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginTop: 12 }}>Loading tasks...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#333", marginBottom: 4 }}>No tasks found</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444" }}>
              {search ? "Try a different search term." : "No orders assigned to you yet."}
            </div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
              <thead>
                <tr>
                  {["Order ID", "Design", "Customer", "Date", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #111" }}>
                    <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>#{o.orderNumber}</td>
                    <td style={{ padding: "12px 16px", color: "#ccc" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: "1rem" }}>📦</span>
                        {o.items?.[0]?.designName || "Custom Design"}
                        {o.items.length > 1 && <span style={{ color: "#555" }}> +{o.items.length - 1}</span>}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>{o.customerName}</td>
                    <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(o.createdAt)}</td>
                    <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>₹{o.total?.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`dash-badge ${STATUS_BADGE[o.status] || "dash-badge-yellow"}`}>{o.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {(o.status === "Pending" || o.status === "Confirmed") && (
                          <button onClick={() => handleUpdateStatus(o.id, "Processing")} className="dash-btn-primary dash-btn-small" style={{ padding: "4px 10px", fontSize: "0.6rem" }}>Start</button>
                        )}
                        {o.status === "Processing" && (
                          <button onClick={() => handleUpdateStatus(o.id, "Printing")} className="dash-btn-primary dash-btn-small" style={{ padding: "4px 10px", fontSize: "0.6rem" }}>Print</button>
                        )}
                        {o.status === "Printing" && (
                          <button onClick={() => handleUpdateStatus(o.id, "Shipped")} className="dash-btn-primary dash-btn-small" style={{ padding: "4px 10px", fontSize: "0.6rem" }}>Ship</button>
                        )}
                        {(o.status === "Shipped" || o.status === "Delivered") && (
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#10B981" }}>✓ Done</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

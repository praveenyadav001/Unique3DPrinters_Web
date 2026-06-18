import { useState } from "react";
import { Search, Filter, UserPlus, Check, X, Mail } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useWorkers } from "@/hooks/useWorkers";
import { assignWorkerToOrder, unassignWorker, updateOrderStatus, triggerOrderEmail } from "@/services/orders.service";
import type { OrderDoc, OrderStatus, UserDoc } from "@/types/firebase.types";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#EAB308",
  Confirmed: "#10B981",
  Processing: "#EAB308",
  Printing: "#00E5FF",
  Shipped: "#00E5FF",
  Delivered: "#10B981",
  Cancelled: "#EF4444",
};

export default function AdminOrdersPage({ customOnly = false }: { customOnly?: boolean }) {
  const { orders, loading } = useOrders();
  const { workers } = useWorkers();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assignModal, setAssignModal] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) || o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesType = !customOnly || o.items?.some(i => !i.designId);
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAssignWorker = async (orderId: string, worker: UserDoc) => {
    try {
      await assignWorkerToOrder(orderId, worker.uid, worker.displayName);
      setAssignModal(null);
    } catch (err) {
      console.error("Assign failed:", err);
    }
  };

  const handleUnassign = async (orderId: string) => {
    try {
      await unassignWorker(orderId);
    } catch (err) {
      console.error("Unassign failed:", err);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const handleResendEmail = async (order: OrderDoc) => {
    if (!order.customerEmail) {
      alert("Customer email not available for this order.");
      return;
    }
    const confirm = window.confirm(`Resend email for status "${order.status}" to ${order.customerEmail}?`);
    if (confirm) {
      try {
        await triggerOrderEmail(order.orderNumber || order.id, order.status, order.customerEmail, order.customerName || "Customer");
        alert("Email resent successfully.");
      } catch (err) {
        console.error("Failed to resend email:", err);
        alert("Failed to resend email.");
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>{customOnly ? "Quotes & Custom Requests" : "Orders Management"}</h2>
        <p>{customOnly ? "Manage and price custom designs requested by customers." : "Manage all orders and assign workers to fulfill them."}</p>
      </div>

      {/* Filters Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 300 }}>
          <Search size={14} />
          <input type="text" placeholder="Search by order ID or customer..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          {["All", "Pending", "Processing", "Confirmed", "Printing", "Shipped", "Delivered"].map((f) => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              padding: "6px 14px", borderRadius: 6, border: `1px solid ${statusFilter === f ? "var(--accent)" : "#222"}`,
              background: statusFilter === f ? "rgba(var(--accent-rgb), 0.08)" : "#111",
              color: statusFilter === f ? "var(--accent)" : "#666",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>

        <div style={{ marginLeft: "auto", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
          <Filter size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          {filteredOrders.length} orders
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#555", fontFamily: "'DM Mono', monospace" }}>Loading orders...</div>
      )}

      {/* Orders Table */}
      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Items", "Date", "Amount", "Status", "Assigned Worker", "Actions"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a",
                    fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em",
                    background: "#0D0D0D",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o: OrderDoc) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #111", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#0D0D0D"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>#{o.orderNumber}</td>
                  <td style={{ padding: "12px 16px", color: "#ccc" }}>{o.customerName}</td>
                  <td style={{ padding: "12px 16px", color: "#999" }}>{o.items?.map((i) => i.designName).join(", ")}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(o.createdAt)}</td>
                  <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>₹{o.total?.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value as OrderStatus)}
                      style={{
                        background: "#0D0D0D", border: `1px solid ${STATUS_COLORS[o.status] || "#333"}`,
                        borderRadius: 4, color: STATUS_COLORS[o.status] || "#fff",
                        fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", padding: "4px 8px",
                        cursor: "pointer",
                      }}
                    >
                      {["Pending", "Confirmed", "Processing", "Printing", "Shipped", "Delivered", "Cancelled"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {o.assignedWorkerName ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: "rgba(var(--accent-rgb), 0.15)", display: "flex",
                          alignItems: "center", justifyContent: "center",
                          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.6rem",
                          color: "var(--accent)",
                        }}>
                          {o.assignedWorkerName.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span style={{ color: "#ccc", fontSize: "0.65rem" }}>{o.assignedWorkerName}</span>
                        <button
                          onClick={() => handleUnassign(o.id)}
                          style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 2 }}
                          title="Unassign"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: "#444", fontStyle: "italic", fontSize: "0.65rem" }}>Unassigned</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => setAssignModal(o.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "5px 12px", background: "rgba(var(--accent-rgb), 0.08)",
                        border: "1px solid rgba(var(--accent-rgb), 0.2)", borderRadius: 6,
                        color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                        cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "0.05em",
                      }}
                      title={o.assignedWorkerName ? "Reassign Worker" : "Assign Worker"}
                    >
                      <UserPlus size={11} />
                    </button>
                    <button
                      onClick={() => handleResendEmail(o)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4,
                        padding: "5px 12px", background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 6,
                        color: "#10B981", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                        cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "0.05em",
                      }}
                      title="Resend Email"
                    >
                      <Mail size={11} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#444", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Assign Worker Modal ─────────────────────────── */}
      {assignModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
          animation: "dashPageIn 0.2s ease forwards",
        }}
          onClick={() => setAssignModal(null)}
        >
          <div
            style={{
              background: "#111", border: "1px solid #1a1a1a", borderRadius: 16,
              padding: "28px", width: 420, maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
                  Assign Worker
                </h3>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", margin: "4px 0 0" }}>
                  Order #{orders.find((o) => o.id === assignModal)?.orderNumber}
                </p>
              </div>
              <button onClick={() => setAssignModal(null)} style={{
                background: "#0D0D0D", border: "1px solid #222", borderRadius: 8,
                color: "#666", width: 32, height: 32, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
              }}><X size={16} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {workers.length === 0 && (
                <div style={{ textAlign: "center", padding: 20, color: "#555", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
                  No workers registered yet
                </div>
              )}
              {workers.map((w) => {
                const currentOrder = orders.find((o) => o.id === assignModal);
                const isAssigned = currentOrder?.assignedWorkerId === w.uid;
                const isOffline = w.status === "Offline";

                return (
                  <button
                    key={w.uid}
                    onClick={() => handleAssignWorker(assignModal, w)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px", background: isAssigned ? "rgba(var(--accent-rgb), 0.06)" : "#0D0D0D",
                      border: `1px solid ${isAssigned ? "var(--accent)" : "#1a1a1a"}`,
                      borderRadius: 10, cursor: isOffline ? "not-allowed" : "pointer",
                      opacity: isOffline ? 0.4 : 1,
                      width: "100%", textAlign: "left", transition: "all 0.2s",
                    }}
                    disabled={isOffline}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "rgba(var(--accent-rgb), 0.12)", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem",
                      color: "var(--accent)", flexShrink: 0,
                    }}>
                      {w.displayName?.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>
                        {w.displayName}
                      </div>
                      <div style={{ display: "flex", gap: 12, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: w.status === "Online" ? "#10B981" : w.status === "Busy" ? "#EAB308" : "#EF4444",
                          }} />
                          {w.status || "Offline"}
                        </span>
                        <span>{w.activeTasks || 0} active tasks</span>
                      </div>
                    </div>
                    {isAssigned && <Check size={16} style={{ color: "var(--accent)" }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

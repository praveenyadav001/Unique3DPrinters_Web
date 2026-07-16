import { useState } from "react";
import { Search, Filter, UserPlus, Check, X, Mail, Download, IndianRupee, Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useWorkers } from "@/hooks/useWorkers";
import { assignWorkerToOrder, unassignWorker, updateOrderStatus, triggerOrderEmail, setOrderItemPrices } from "@/services/orders.service";
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
  const [priceModal, setPriceModal] = useState<OrderDoc | null>(null);
  const [priceInputs, setPriceInputs] = useState<string[]>([]);
  const [savingPrices, setSavingPrices] = useState(false);

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

  const openPriceModal = (order: OrderDoc) => {
    setPriceInputs(order.items.map((i) => (i.price > 0 ? String(i.price) : "")));
    setPriceModal(order);
  };

  const handleSavePrices = async () => {
    if (!priceModal) return;
    const prices = priceInputs.map((p) => parseFloat(p));
    if (prices.some((p) => isNaN(p) || p < 0)) {
      alert("Please enter a valid price for every item.");
      return;
    }
    setSavingPrices(true);
    try {
      await setOrderItemPrices(priceModal.id, prices);
      setPriceModal(null);
    } catch (err) {
      console.error("Failed to save prices:", err);
      alert("Failed to save prices. Please try again.");
    } finally {
      setSavingPrices(false);
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
                  <td style={{ padding: "12px 16px", color: "#999" }}>
                    {o.items?.map((i, idx) => (
                      <span key={idx}>
                        {idx > 0 && ", "}
                        {i.fileURL ? (
                          <a
                            href={i.fileURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Download uploaded design file"
                            style={{ color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                          >
                            {i.designName}
                            <Download size={10} />
                          </a>
                        ) : (
                          i.designName
                        )}
                      </span>
                    ))}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(o.createdAt)}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>
                    {o.items?.some((i) => !i.designId && i.price === 0) ? (
                      <span style={{ color: "#EAB308", fontSize: "0.6rem", textTransform: "uppercase" }}>Awaiting Quote</span>
                    ) : (
                      <span style={{ color: "#ccc" }}>₹{o.total?.toLocaleString()}</span>
                    )}
                  </td>
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
                    {o.items?.some((i) => !i.designId) && (
                      <button
                        onClick={() => openPriceModal(o)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          padding: "5px 12px",
                          background: o.items.some((i) => !i.designId && i.price === 0) ? "rgba(234, 179, 8, 0.12)" : "rgba(234, 179, 8, 0.05)",
                          border: "1px solid rgba(234, 179, 8, 0.3)", borderRadius: 6,
                          color: "#EAB308", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                          cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "0.05em",
                        }}
                        title={o.items.some((i) => !i.designId && i.price === 0) ? "Set Price" : "Edit Price"}
                      >
                        <IndianRupee size={11} />
                      </button>
                    )}
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

      {/* ── Set Price Modal ─────────────────────────────── */}
      {priceModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
          animation: "dashPageIn 0.2s ease forwards",
        }}
          onClick={() => setPriceModal(null)}
        >
          <div
            style={{
              background: "#111", border: "1px solid #1a1a1a", borderRadius: 16,
              padding: "28px", width: 480, maxWidth: "90vw",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
                  Set Price
                </h3>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", margin: "4px 0 0" }}>
                  Order #{priceModal.orderNumber} • {priceModal.customerName}
                </p>
              </div>
              <button onClick={() => setPriceModal(null)} style={{
                background: "#0D0D0D", border: "1px solid #222", borderRadius: 8,
                color: "#666", width: 32, height: 32, display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
              }}><X size={16} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {priceModal.items.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", background: "#0D0D0D",
                  border: "1px solid #1a1a1a", borderRadius: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {item.designName}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span>{item.material} • {item.color} • {item.size} • Qty {item.quantity}</span>
                      {item.fileURL && (
                        <a href={item.fileURL} target="_blank" rel="noopener noreferrer"
                          style={{ color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
                          File <Download size={9} />
                        </a>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span style={{ color: "#666", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>₹</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={priceInputs[i] ?? ""}
                      onChange={(e) => {
                        const next = [...priceInputs];
                        next[i] = e.target.value;
                        setPriceInputs(next);
                      }}
                      className="dash-input"
                      style={{ width: 100, textAlign: "right" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Live total preview */}
            {(() => {
              const prices = priceInputs.map((p) => parseFloat(p) || 0);
              const sub = priceModal.items.reduce((sum, item, i) => sum + prices[i] * item.quantity, 0);
              const ship = priceModal.shippingCost || 40;
              const tax = Math.floor(sub * 0.18);
              const total = sub + ship + tax - (priceModal.discount || 0);
              return (
                <div style={{ marginTop: 16, padding: "12px 14px", background: "#0D0D0D", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: 10, fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#888" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Subtotal</span><span>₹{sub.toLocaleString()}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Shipping</span><span>₹{ship}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Tax (18%)</span><span>₹{tax.toLocaleString()}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#EAB308", fontWeight: 700, fontSize: "0.75rem", borderTop: "1px solid #222", paddingTop: 6, marginTop: 6 }}>
                    <span>Total Quote</span><span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              );
            })()}

            <button
              onClick={handleSavePrices}
              disabled={savingPrices}
              className="dash-btn-primary"
              style={{ width: "100%", marginTop: 16, justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
            >
              {savingPrices && <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />}
              {savingPrices ? "Saving..." : "Save Quote"}
            </button>
          </div>
        </div>
      )}

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

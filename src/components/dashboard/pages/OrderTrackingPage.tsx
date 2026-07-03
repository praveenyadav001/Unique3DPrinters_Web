import {
  Package, CheckCircle2, Printer, Truck, MapPin, Clock, XCircle, MessageCircle, Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import type { OrderDoc } from "@/types/firebase.types";

// Support contact (WhatsApp + email) surfaced via the "Need Help?" actions.
const SUPPORT_PHONE = "918466800143";
const SUPPORT_EMAIL = "support@unique3dprinters.com";

const STATUS_STEPS = [
  { key: "Pending", label: "Order Placed", icon: <Package size={16} /> },
  { key: "Confirmed", label: "Confirmed", icon: <CheckCircle2 size={16} /> },
  { key: "Printing", label: "Printing", icon: <Printer size={16} /> },
  { key: "Shipped", label: "Shipping", icon: <Truck size={16} /> },
  { key: "Delivered", label: "Delivered", icon: <MapPin size={16} /> },
];

function normalizeTimelineStatus(orderStatus: string) {
  // "Processing" (worker assigned) reaches the Confirmed step; actual printing advances it further.
  if (orderStatus === "Processing") return "Confirmed";
  if (orderStatus === "Post Processing") return "Printing";
  return orderStatus;
}

function getStepState(orderStatus: string, stepKey: string) {
  const order = STATUS_STEPS.findIndex((s) => s.key === normalizeTimelineStatus(orderStatus));
  const current = STATUS_STEPS.findIndex((s) => s.key === stepKey);
  if (order < 0) return "pending";
  if (current < order) return "completed";
  if (current === order) return "active";
  return "pending";
}

function getStatusColor(status: string) {
  if (status === "Delivered") return "#10B981";
  if (status === "Shipped") return "#00E5FF";
  if (status === "Cancelled") return "#EF4444";
  if (status === "Printing" || status === "Processing" || status === "Post Processing") return "#EAB308";
  return "var(--accent)";
}

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function OrderTrackingPage() {
  const { orders, loading } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const selectedOrder: OrderDoc | null = orders.find((order) => order.id === selectedOrderId) || orders[0] || null;

  useEffect(() => {
    if (!selectedOrderId && orders[0]) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <h2>Order Tracking</h2>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <h2>Order Tracking</h2>
          <p>Track your orders and print progress.</p>
        </div>
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Package size={48} style={{ color: "#333", marginBottom: 16 }} />
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#555" }}>
            No orders yet. Place your first order!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Order Tracking</h2>
        <p>Track your orders and print progress.</p>
      </div>

      {/* Active Order */}
      <div className="dash-card" style={{ marginBottom: 28, borderColor: "rgba(var(--accent-rgb), 0.15)", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
                Order #{selectedOrder.orderNumber}
              </h3>
              <span className={`dash-badge ${selectedOrder.status === "Delivered" ? "dash-badge-green" : selectedOrder.status === "Cancelled" ? "dash-badge-red" : "dash-badge-yellow"}`}>
                {selectedOrder.status === "Cancelled" ? <XCircle size={10} /> : <Clock size={10} />} {selectedOrder.status}
              </span>
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", margin: 0 }}>
              Placed on {formatDate(selectedOrder.createdAt)} | Total ₹{selectedOrder.total?.toLocaleString()}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={`https://wa.me/${SUPPORT_PHONE}?text=${encodeURIComponent(`Hi, I need help with my order #${selectedOrder.orderNumber}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="dash-btn-secondary dash-btn-small"
              style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`Help with order #${selectedOrder.orderNumber}`)}&body=${encodeURIComponent(`Hi,\n\nI need help with my order #${selectedOrder.orderNumber}.\n\n`)}`}
              className="dash-btn-secondary dash-btn-small"
              style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
            >
              <Mail size={14} /> Email
            </a>
          </div>
        </div>

        {/* Timeline (or cancelled banner) */}
        {selectedOrder.status === "Cancelled" ? (
          <div style={{ margin: "24px 0", padding: "18px 20px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", display: "flex", alignItems: "center", gap: 12 }}>
            <XCircle size={22} style={{ color: "#EF4444", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#EF4444" }}>Order Cancelled</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#888", marginTop: 2 }}>
                This order has been cancelled. If a payment was made, any refund will be processed shortly.
              </div>
            </div>
          </div>
        ) : (
          <div className="dash-timeline" style={{ margin: "32px 0" }}>
            {STATUS_STEPS.map((s) => {
              const state = getStepState(selectedOrder.status, s.key);
              return (
                <div key={s.key} className={`dash-timeline-step ${state}`}>
                  <div className="dash-timeline-dot">{s.icon}</div>
                  <div className="dash-timeline-label">{s.label}</div>
                  <div className="dash-timeline-date">
                    {state === "completed" ? "Done" : state === "active" ? "In Progress" : "Pending"}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Items + Details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", textTransform: "uppercase", marginBottom: 16 }}>
            Order Items
          </h3>
          {selectedOrder.items?.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.06)", border: "1px solid #222", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
                📦
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>
                  {item.designName}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
                  {item.material} • {item.color} • Qty: {item.quantity}
                </div>
              </div>
              <span className="dash-cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", textTransform: "uppercase", marginBottom: 16 }}>
            Order Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="dash-price-row"><span className="label">Payment Method</span><span className="value">{selectedOrder.paymentMethod?.toUpperCase()}</span></div>
            <div className="dash-price-row"><span className="label">Shipping Address</span>
              <span className="value" style={{ textAlign: "right", maxWidth: 200 }}>
                {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.city} - {selectedOrder.shippingAddress?.pincode}
              </span>
            </div>
            <div className="dash-price-row"><span className="label">Phone</span><span className="value">{selectedOrder.shippingAddress?.phone}</span></div>
            {selectedOrder.assignedWorkerName && (
              <div className="dash-price-row"><span className="label">Assigned Worker</span><span className="value" style={{ color: "var(--accent)" }}>{selectedOrder.assignedWorkerName}</span></div>
            )}
          </div>
        </div>
      </div>

      {/* All Orders List */}
      <div className="dash-card">
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", marginBottom: 16 }}>
          All Orders
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
            <thead>
              <tr>
                {["Order ID", "Items", "Date", "Total", "Status"].map((header) => (
                  <th key={header} style={{ textAlign: "left", padding: "10px 14px", color: "#555", borderBottom: "1px solid #1a1a1a", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const rowColor = getStatusColor(order.status);
                const isSelected = selectedOrder.id === order.id;
                return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  style={{
                    borderBottom: "1px solid #111",
                    cursor: "pointer",
                    background: isSelected ? "rgba(var(--accent-rgb), 0.06)" : "transparent",
                  }}
                >
                  <td style={{ padding: "12px 14px", color: "var(--accent)", fontWeight: 600 }}>#{order.orderNumber}</td>
                  <td style={{ padding: "12px 14px", color: "#ccc" }}>{order.items?.map((i) => i.designName).join(", ")}</td>
                  <td style={{ padding: "12px 14px", color: "#666" }}>{formatDate(order.createdAt)}</td>
                  <td style={{ padding: "12px 14px", color: "#ccc" }}>₹{order.total?.toLocaleString()}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ color: rowColor, fontWeight: 600 }}>
                      {order.status === "Delivered" && <CheckCircle2 size={10} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />}
                      {order.status}
                    </span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

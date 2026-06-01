import {
  Package,
  CheckCircle2,
  Printer,
  Truck,
  MapPin,
  Clock,
  HelpCircle,
} from "lucide-react";

interface Order {
  id: string;
  item: string;
  date: string;
  total: string;
  status: "placed" | "confirmed" | "printing" | "shipping" | "delivered";
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "ORD12345",
    item: "Flip Name - Rahul ❤ Anjali",
    date: "20 May 2024",
    total: "₹627.64",
    status: "printing",
  },
  {
    id: "ORD12290",
    item: "Keychain - ROHIT",
    date: "18 May 2024",
    total: "₹299.00",
    status: "delivered",
  },
  {
    id: "ORD12186",
    item: "Bike Number Plate - KA 03 JH 1234",
    date: "10 May 2024",
    total: "₹449.00",
    status: "delivered",
  },
];

const STATUS_STEPS = [
  { key: "placed", label: "Order Placed", icon: <Package size={16} /> },
  { key: "confirmed", label: "Design Confirmed", icon: <CheckCircle2 size={16} /> },
  { key: "printing", label: "Printing", icon: <Printer size={16} /> },
  { key: "shipping", label: "Shipping", icon: <Truck size={16} /> },
  { key: "delivered", label: "Delivered", icon: <MapPin size={16} /> },
];

function getStepState(orderStatus: string, stepKey: string) {
  const order = STATUS_STEPS.findIndex((s) => s.key === orderStatus);
  const current = STATUS_STEPS.findIndex((s) => s.key === stepKey);
  if (current < order) return "completed";
  if (current === order) return "active";
  return "pending";
}

export default function OrderTrackingPage() {
  const selectedOrder = SAMPLE_ORDERS[0];

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Order Tracking</h2>
        <p>Track your orders and print progress.</p>
      </div>

      {/* Order Detail Card */}
      <div
        className="dash-card"
        style={{
          marginBottom: 28,
          borderColor: "rgba(var(--accent-rgb), 0.15)",
          padding: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#fff",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                Order #{selectedOrder.id}
              </h3>
              <span className="dash-badge dash-badge-yellow">
                <Clock size={10} /> In Progress
              </span>
            </div>
            <p
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "#555",
                margin: 0,
              }}
            >
              Placed on {selectedOrder.date} | Total {selectedOrder.total}
            </p>
          </div>
          <button
            className="dash-btn-secondary dash-btn-small"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <HelpCircle size={14} /> Need Help?
          </button>
        </div>

        {/* Timeline */}
        <div className="dash-timeline" style={{ margin: "32px 0" }}>
          {STATUS_STEPS.map((s) => {
            const state = getStepState(selectedOrder.status, s.key);
            return (
              <div
                key={s.key}
                className={`dash-timeline-step ${state}`}
              >
                <div className="dash-timeline-dot">{s.icon}</div>
                <div className="dash-timeline-label">{s.label}</div>
                <div className="dash-timeline-date">
                  {state === "completed"
                    ? selectedOrder.date
                    : state === "active"
                    ? "In Progress"
                    : "Pending"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Details Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Order Items */}
        <div className="dash-card">
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#fff",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Order Items
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                background: "rgba(var(--accent-rgb), 0.06)",
                border: "1px solid #222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "var(--accent)",
              }}
            >
              💫
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  color: "#fff",
                }}
              >
                {selectedOrder.item}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
                Material: PLA • Color: Black
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span className="dash-cart-item-price">₹299</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="dash-card">
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "0.9rem",
              color: "#fff",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Order Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="dash-price-row">
              <span className="label">Payment Method</span>
              <span className="value">UPI</span>
            </div>
            <div className="dash-price-row">
              <span className="label">Shipping Address</span>
              <span className="value" style={{ textAlign: "right", maxWidth: 200 }}>
                12, MG Road, Bengaluru, Karnataka - 560001
              </span>
            </div>
            <div className="dash-price-row">
              <span className="label">Phone Number</span>
              <span className="value">+91 9876543210</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Orders List */}
      <div className="dash-card">
        <h3
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: "1rem",
            color: "#fff",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          All Orders
        </h3>
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
            }}
          >
            <thead>
              <tr>
                {["Order ID", "Item", "Date", "Total", "Status"].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      color: "#555",
                      borderBottom: "1px solid #1a1a1a",
                      fontSize: "0.65rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ORDERS.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 14px", color: "var(--accent)", fontWeight: 600 }}>
                    #{order.id}
                  </td>
                  <td style={{ padding: "12px 14px", color: "#ccc" }}>{order.item}</td>
                  <td style={{ padding: "12px 14px", color: "#666" }}>{order.date}</td>
                  <td style={{ padding: "12px 14px", color: "#ccc" }}>{order.total}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      className={`dash-badge ${
                        order.status === "delivered"
                          ? "dash-badge-green"
                          : order.status === "printing"
                          ? "dash-badge-yellow"
                          : "dash-badge-blue"
                      }`}
                    >
                      {order.status === "delivered" && <CheckCircle2 size={10} />}
                      {order.status === "printing" && <Printer size={10} />}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { CreditCard, Download, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import type { OrderDoc } from "@/types/firebase.types";

function formatDate(ts: any): string {
  if (!ts) return "-";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(value = 0) {
  return `Rs. ${value.toLocaleString("en-IN")}`;
}

function gatewayName(method?: string) {
  const normalized = (method || "card").toLowerCase();
  if (normalized.includes("razorpay")) return "Razorpay";
  if (normalized.includes("stripe")) return "Stripe";
  if (normalized.includes("upi")) return "UPI";
  if (normalized.includes("cod")) return "COD";
  return method?.toUpperCase() || "CARD";
}

export default function AdminPaymentsPage() {
  const { orders, loading } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        order.orderNumber?.toLowerCase().includes(query) ||
        order.customerName?.toLowerCase().includes(query) ||
        order.customerEmail?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || order.paymentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const paidTotal = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingTotal = orders
    .filter((order) => order.paymentStatus === "Pending")
    .reduce((sum, order) => sum + (order.total || 0), 0);
  const refundedTotal = orders
    .filter((order) => order.paymentStatus === "Refunded")
    .reduce((sum, order) => sum + (order.total || 0), 0);

  const exportCsv = () => {
    const header = ["Order", "Customer", "Gateway", "Payment Status", "Order Status", "Amount", "Date"];
    const rows = filteredOrders.map((order: OrderDoc) => [
      order.orderNumber,
      order.customerName,
      gatewayName(order.paymentMethod),
      order.paymentStatus,
      order.status,
      String(order.total || 0),
      formatDate(order.createdAt),
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "payment-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Payment Transactions</h2>
        <p>Monitor customer checkout transactions, refunds, and gateway reconciliation.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Paid Revenue", value: formatCurrency(paidTotal), icon: <ShieldCheck size={18} />, color: "#10B981" },
          { label: "Pending Collection", value: formatCurrency(pendingTotal), icon: <RefreshCw size={18} />, color: "#EAB308" },
          { label: "Refunded", value: formatCurrency(refundedTotal), icon: <CreditCard size={18} />, color: "#EF4444" },
        ].map((stat) => (
          <div key={stat.label} className="dash-card" style={{ padding: 18, borderColor: `${stat.color}24` }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${stat.color}14`, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.12em" }}>{stat.label}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.35rem", color: "#fff" }}>{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 340 }}>
          <Search size={14} />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search payment, order, customer..." />
        </div>
        <select className="dash-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 170 }}>
          {["All", "Paid", "Pending", "Refunded"].map((status) => <option key={status}>{status}</option>)}
        </select>
        <button className="dash-btn-secondary dash-btn-small" onClick={exportCsv} style={{ marginLeft: "auto" }}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Transaction", "Customer", "Gateway", "Amount", "Payment", "Order Status", "Date"].map((header) => (
                  <th key={header} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", background: "#0D0D0D", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 700 }}>PAY-{order.orderNumber}</td>
                  <td style={{ padding: "12px 16px", color: "#ccc" }}>
                    <div>{order.customerName}</div>
                    <div style={{ color: "#555", fontSize: "0.6rem" }}>{order.customerEmail}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#aaa" }}>{gatewayName(order.paymentMethod)}</td>
                  <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 700 }}>{formatCurrency(order.total)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`dash-badge ${order.paymentStatus === "Paid" ? "dash-badge-green" : order.paymentStatus === "Refunded" ? "dash-badge-red" : "dash-badge-yellow"}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>{order.status}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
              {filteredOrders.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#555" }}>No payment records found.</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#555" }}>Loading payment records...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

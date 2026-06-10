import {
  Package, DollarSign, Users, Clock, CheckCircle2,
  TrendingUp, Plus, UserPlus, FileText, ShoppingBag,
  AlertTriangle, Grid3X3,
} from "lucide-react";
import type { AdminPage } from "../AdminSidebar";
import { useOrders } from "@/hooks/useOrders";
import { useCustomers } from "@/hooks/useWorkers";
import { useDesigns } from "@/hooks/useDesigns";

interface AdminHomePageProps {
  onNavigate: (page: AdminPage) => void;
}

// Hardcoded fallbacks for display - will be overridden by real data in component

const TOP_DESIGNS = [
  { rank: 1, name: "Personalized Name Plate", sales: 428, price: "₹299", emoji: "💫" },
  { rank: 2, name: "Keychain - Custom Name", sales: 356, price: "₹199", emoji: "🔑" },
  { rank: 3, name: "3D Miniature House", sales: 289, price: "₹499", emoji: "🏠" },
  { rank: 4, name: "Flower Vase", sales: 245, price: "₹349", emoji: "🌹" },
  { rank: 5, name: "Bike Number Plate", sales: 198, price: "₹249", emoji: "🏍️" },
];

const LOW_STOCK = [
  { name: "3D Elephant Figurine", stock: 5, emoji: "🐘" },
  { name: "Pen Holder", stock: 4, emoji: "🖊️" },
  { name: "Miniature Car", stock: 3, emoji: "🚗" },
  { name: "Desk Organizer", stock: 2, emoji: "📦" },
];

const ORDER_STATUS_FALLBACK = [
  { label: "Processing", count: 0, pct: 0, color: "#EAB308" },
  { label: "Confirmed", count: 0, pct: 0, color: "#10B981" },
  { label: "Shipped", count: 0, pct: 0, color: "#00E5FF" },
  { label: "Delivered", count: 0, pct: 0, color: "var(--accent)" },
  { label: "Cancelled", count: 0, pct: 0, color: "#EF4444" },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "#EAB308", Confirmed: "#10B981", Processing: "#EAB308",
  Printing: "#00E5FF", Shipped: "#00E5FF", Delivered: "#10B981", Cancelled: "#EF4444",
};

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// SVG donut chart helper
function DonutChart({ statusData }: { statusData: typeof ORDER_STATUS_FALLBACK }) {
  const total = statusData.reduce((s, o) => s + o.count, 0) || 1;
  let cumulative = 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg viewBox="0 0 200 200" width="180" height="180">
      {statusData.map((seg, i) => {
        const pct = seg.count / total;
        const dashArray = `${pct * circumference} ${circumference}`;
        const dashOffset = -(cumulative / total) * circumference;
        cumulative += seg.count;
        return (
          <circle key={i} cx="100" cy="100" r={radius} fill="none"
            stroke={seg.color} strokeWidth="20" strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dasharray 0.5s" }}
          />
        );
      })}
      <text x="100" y="92" textAnchor="middle" fill="#fff" fontFamily="'Rajdhani', sans-serif" fontWeight="800" fontSize="28">
        {total.toLocaleString()}
      </text>
      <text x="100" y="112" textAnchor="middle" fill="#555" fontFamily="'DM Mono', monospace" fontSize="10">
        Total
      </text>
    </svg>
  );
}

// SVG bar chart for revenue
function RevenueChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = [8, 6, 10, 7, 14, 11, 9, 12, 15, 18, 13, 16];
  const max = Math.max(...values);
  const barW = 24;
  const gap = 10;
  const chartH = 120;

  return (
    <svg viewBox={`0 0 ${months.length * (barW + gap) + 10} ${chartH + 30}`} width="100%" height={chartH + 30}>
      {values.map((v, i) => {
        const h = (v / max) * chartH;
        const x = i * (barW + gap) + 10;
        return (
          <g key={i}>
            <rect x={x} y={chartH - h} width={barW} height={h} rx={3}
              fill="var(--accent)" opacity={0.75 + (v / max) * 0.25}
            />
            <text x={x + barW / 2} y={chartH + 16} textAnchor="middle"
              fill="#555" fontFamily="'DM Mono', monospace" fontSize="7">{months[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// SVG sales line chart
function SalesChart() {
  const data = [30, 45, 35, 60, 50, 70, 55, 80, 90, 75, 100, 120, 95, 145];
  const w = 500, h = 140;
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} width="100%" height={h + 20} preserveAspectRatio="none">
      <defs>
        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1="0" y1={h * p} x2={w} y2={h * p} stroke="#1a1a1a" strokeWidth="0.5" />
      ))}
      <polygon points={areaPoints} fill="url(#salesGrad)" />
      <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" />
      {/* Tooltip dot on highest */}
      {(() => {
        const maxIdx = data.indexOf(max);
        const cx = (maxIdx / (data.length - 1)) * w;
        const cy = h - (max / max) * h;
        return (
          <>
            <circle cx={cx} cy={cy} r="4" fill="var(--accent)" stroke="#0A0A0A" strokeWidth="2" />
            <rect x={cx - 35} y={cy - 28} width="70" height="20" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
            <text x={cx} y={cy - 14} textAnchor="middle" fill="#fff" fontFamily="'DM Mono', monospace" fontSize="8">
              ₹1,45,230
            </text>
          </>
        );
      })()}
      {/* X axis labels */}
      {["01 May", "05 May", "10 May", "15 May", "20 May", "25 May", "31 May"].map((l, i) => (
        <text key={i} x={(i / 6) * w} y={h + 14} fill="#444" fontFamily="'DM Mono', monospace" fontSize="7">{l}</text>
      ))}
    </svg>
  );
}

export default function AdminHomePage({ onNavigate }: AdminHomePageProps) {
  const { orders, loading: ordersLoading } = useOrders();
  const { customers, loading: customersLoading } = useCustomers();
  const { designs, loading: designsLoading } = useDesigns();

  if (ordersLoading || customersLoading || designsLoading) {
    return <div style={{ padding: 60, textAlign: "center", color: "#666" }}>Loading dashboard data...</div>;
  }

  // Computed real stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCustomers = customers.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;

  const realTopDesigns = [...designs]
    .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
    .slice(0, 5)
    .map((d, i) => ({
      rank: i + 1,
      name: d.name,
      sales: d.salesCount || 0,
      price: `₹${d.price}`,
      emoji: d.emoji || "📦",
    }));

  const realLowStock = [...designs]
    .sort((a, b) => (a.stock || 0) - (b.stock || 0))
    .slice(0, 4)
    .map((d) => ({
      name: d.name,
      stock: d.stock || 0,
      emoji: d.emoji || "📦",
    }));

  const STATS = [
    { label: "Total Orders", value: totalOrders.toLocaleString(), change: "Real-time data", icon: <Package size={18} />, color: "var(--accent)" },
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "Real-time data", icon: <DollarSign size={18} />, color: "#10B981" },
    { label: "Total Customers", value: totalCustomers.toLocaleString(), change: "Real-time data", icon: <Users size={18} />, color: "#00E5FF" },
    { label: "Pending Orders", value: pendingOrders.toLocaleString(), change: "Real-time data", icon: <Clock size={18} />, color: "#EAB308" },
    { label: "Completed Orders", value: completedOrders.toLocaleString(), change: "Real-time data", icon: <CheckCircle2 size={18} />, color: "#10B981" },
  ];

  // Compute order status breakdown
  const ORDER_STATUS = ORDER_STATUS_FALLBACK.map((s) => {
    const count = orders.filter((o) => o.status === s.label).length;
    return { ...s, count, pct: totalOrders > 0 ? (count / totalOrders) * 100 : 0 };
  });

  // Recent orders (first 5)
  const RECENT_ORDERS = orders.slice(0, 5).map((o) => ({
    id: o.orderNumber,
    customer: o.customerName,
    date: formatDate(o.createdAt),
    amount: `₹${o.total?.toLocaleString()}`,
    status: o.status,
    color: STATUS_COLORS[o.status] || "#EAB308",
  }));

  // Recent customers (first 5)
  const RECENT_CUSTOMERS = customers.slice(0, 5).map((c) => ({
    name: c.displayName,
    email: c.email,
    joined: formatDate(c.createdAt),
  }));

  return (
    <div className="dashboard-page">
      {/* ── Stats Row ────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {STATS.map((s, i) => (
          <div key={i} className="dash-card" style={{ padding: "18px 20px", borderColor: `${s.color}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${s.color}12`, display: "flex", alignItems: "center",
                justifyContent: "center", color: s.color,
              }}>{s.icon}</div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: s.color, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <TrendingUp size={10} /> {s.change}
            </div>
          </div>
        ))}
      </div>

      {/* ── Sales Chart + Recent Orders ──────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div className="dash-card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Sales Overview
            </h3>
            <select className="dash-select" style={{ width: "auto", padding: "6px 30px 6px 10px", fontSize: "0.65rem" }}>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <SalesChart />
        </div>

        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Recent Orders
            </h3>
            <span onClick={() => onNavigate("orders")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Date", "Amount", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 14px", color: "#444", borderBottom: "1px solid #1a1a1a", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "10px 14px", color: "var(--accent)", fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ padding: "10px 14px", color: "#ccc" }}>{o.customer}</td>
                  <td style={{ padding: "10px 14px", color: "#666" }}>{o.date}</td>
                  <td style={{ padding: "10px 14px", color: "#ccc", fontWeight: 600 }}>{o.amount}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ color: o.color, fontWeight: 600 }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Order Status Donut + Top Designs + Revenue ──── */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {/* Donut */}
        <div className="dash-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: "0 0 16px", textTransform: "uppercase" }}>
            Orders Status
          </h3>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <DonutChart statusData={ORDER_STATUS} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {ORDER_STATUS.map((s) => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
                <span style={{ color: "#888", flex: 1 }}>{s.label}</span>
                <span style={{ color: "#ccc", fontWeight: 600 }}>{s.count}</span>
                <span style={{ color: "#555" }}>({s.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Designs */}
        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Top Selling Designs
            </h3>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
          </div>
          {realTopDesigns.length > 0 ? realTopDesigns.map((d) => (
            <div key={d.rank} style={{
              padding: "12px 20px", borderBottom: "1px solid #111",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{
                width: 24, height: 24, borderRadius: 6,
                background: d.rank <= 3 ? "rgba(var(--accent-rgb), 0.1)" : "#111",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.75rem",
                color: d.rank <= 3 ? "var(--accent)" : "#555",
              }}>{d.rank}</span>
              <span style={{ fontSize: "1.2rem" }}>{d.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#fff" }}>{d.name}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>Sales: {d.sales}</div>
              </div>
              <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)" }}>{d.price}</span>
            </div>
          )) : <div style={{ padding: 20, textAlign: "center", color: "#666" }}>No designs yet.</div>}
        </div>

        {/* Revenue Overview */}
        <div className="dash-card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Revenue Overview
            </h3>
            <select className="dash-select" style={{ width: "auto", padding: "6px 30px 6px 10px", fontSize: "0.6rem" }}>
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <RevenueChart />
        </div>
      </div>

      {/* ── Bottom: Customers + Low Stock + Quick Actions ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Recent Customers */}
        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Recent Customers
            </h3>
            <span onClick={() => onNavigate("customers")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
            <thead>
              <tr>
                {["Customer", "Email", "Joined On"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_CUSTOMERS.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "10px 16px", color: "#ccc" }}>{c.name}</td>
                  <td style={{ padding: "10px 16px", color: "#666" }}>{c.email}</td>
                  <td style={{ padding: "10px 16px", color: "#666" }}>{c.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock */}
        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Low Stock Designs
            </h3>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem" }}>
            <thead>
              <tr>
                {["Design", "Stock", "Status"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {realLowStock.length > 0 ? realLowStock.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "10px 16px", color: "#ccc" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "1rem" }}>{d.emoji}</span> {d.name}
                    </span>
                  </td>
                  <td style={{ padding: "10px 16px", color: "#EF4444", fontWeight: 600 }}>{d.stock}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span className="dash-badge dash-badge-red" style={{ fontSize: "0.5rem" }}>
                      <AlertTriangle size={8} /> Low Stock
                    </span>
                  </td>
                </tr>
              )) : <tr><td colSpan={3} style={{ padding: 20, textAlign: "center", color: "#666" }}>Stock levels are good.</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="dash-card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "#fff", margin: "0 0 16px", textTransform: "uppercase" }}>
            Quick Actions
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { icon: <Plus size={18} />, label: "Add New Design", page: "designs" as AdminPage },
              { icon: <ShoppingBag size={18} />, label: "Add New Product", page: "products" as AdminPage },
              { icon: <Grid3X3 size={18} />, label: "Create New Category", page: "categories" as AdminPage },
              { icon: <UserPlus size={18} />, label: "Add New User", page: "users" as AdminPage },
              { icon: <Package size={18} />, label: "Manage Orders", page: "orders" as AdminPage },
              { icon: <FileText size={18} />, label: "Generate Report", page: "reports" as AdminPage },
            ].map((a, i) => (
              <div key={i} className="dash-quick-action" onClick={() => onNavigate(a.page)} style={{ padding: "16px 10px" }}>
                <div className="icon-wrap" style={{ width: 36, height: 36, borderRadius: 8 }}>{a.icon}</div>
                <span className="label" style={{ fontSize: "0.65rem" }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

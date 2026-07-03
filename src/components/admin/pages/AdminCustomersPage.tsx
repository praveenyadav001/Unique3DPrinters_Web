import { useState } from "react";
import { Search, Mail, Phone, MapPin, ShoppingBag, X } from "lucide-react";
import { useCustomers } from "@/hooks/useWorkers";
import { useOrders } from "@/hooks/useOrders";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminCustomersPage() {
  const { customers, loading } = useCustomers();
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewCustomerId, setViewCustomerId] = useState<string | null>(null);

  // Enrich customers with order data
  const enrichedCustomers = customers.map((c) => {
    const customerOrders = orders.filter((o) => o.customerId === c.uid);
    const totalSpent = customerOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      ...c,
      orderCount: customerOrders.length,
      totalSpent,
    };
  });

  const filtered = enrichedCustomers.filter((c) =>
    c.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgOrders = enrichedCustomers.length > 0
    ? (enrichedCustomers.reduce((sum, c) => sum + c.orderCount, 0) / enrichedCustomers.length).toFixed(1)
    : "0";

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Customers</h2>
        <p>View and manage all registered customers.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Customers", value: customers.length.toLocaleString(), color: "var(--accent)" },
          { label: "With Orders", value: enrichedCustomers.filter((c) => c.orderCount > 0).length.toLocaleString(), color: "#10B981" },
          { label: "Active Buyers", value: enrichedCustomers.filter((c) => c.orderCount > 2).length.toLocaleString(), color: "#00E5FF" },
          { label: "Avg. Orders/Customer", value: avgOrders, color: "#A855F7" },
        ].map((s, i) => (
          <div key={i} className="dash-stat-mini">
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 360 }}>
          <Search size={14} />
          <input type="text" placeholder="Search customers by name, email, or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#555", fontFamily: "'DM Mono', monospace" }}>Loading customers...</div>
      )}

      {/* Customers Table */}
      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Customer", "Contact", "City", "Orders", "Total Spent", "Joined", "Actions"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a",
                    fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", background: "#0D0D0D",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.uid} style={{ borderBottom: "1px solid #111" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#0D0D0D"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: "50%",
                        background: "rgba(var(--accent-rgb), 0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.7rem",
                        color: "var(--accent)",
                      }}>
                        {c.displayName?.split(" ").map((n) => n[0]).join("") || "?"}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#fff" }}>{c.displayName}</div>
                        <div style={{ fontSize: "0.6rem", color: "#555" }}>{c.uid.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#888" }}>
                        <Mail size={10} /> {c.email}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#666" }}>
                        <Phone size={10} /> {c.phone || "—"}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {c.city || "—"}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ShoppingBag size={10} /> {c.orderCount}</span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>₹{c.totalSpent.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", color: "#666" }}>{formatDate(c.createdAt)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => setViewCustomerId(c.uid)}
                      style={{
                        padding: "4px 10px", background: "rgba(var(--accent-rgb), 0.08)",
                        border: "1px solid rgba(var(--accent-rgb), 0.2)", borderRadius: 6,
                        color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem",
                        cursor: "pointer", textTransform: "uppercase",
                      }}>View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#444", fontFamily: "'DM Mono', monospace" }}>
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Customer Detail Modal ─────────────────────────── */}
      {viewCustomerId && (() => {
        const c = enrichedCustomers.find((x) => x.uid === viewCustomerId);
        if (!c) return null;
        const customerOrders = orders
          .filter((o) => o.customerId === c.uid)
          .sort((a, b) => {
            const da = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
            const db = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
            return db - da;
          });
        return (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
              animation: "dashPageIn 0.2s ease forwards", padding: 20,
            }}
            onClick={() => setViewCustomerId(null)}
          >
            <div
              style={{
                background: "#111", border: "1px solid #1a1a1a", borderRadius: 16,
                padding: 28, width: 520, maxWidth: "90vw", maxHeight: "85vh", overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: "50%", background: "rgba(var(--accent-rgb), 0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--accent)",
                  }}>
                    {c.displayName?.split(" ").map((n) => n[0]).join("") || "?"}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: 0 }}>{c.displayName}</h3>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", margin: "2px 0 0" }}>ID: {c.uid}</p>
                  </div>
                </div>
                <button onClick={() => setViewCustomerId(null)} style={{
                  background: "#0D0D0D", border: "1px solid #222", borderRadius: 8,
                  color: "#666", width: 32, height: 32, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer",
                }}><X size={16} /></button>
              </div>

              {/* Contact + stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { icon: <Mail size={12} />, label: "Email", value: c.email || "—" },
                  { icon: <Phone size={12} />, label: "Phone", value: c.phone || "—" },
                  { icon: <MapPin size={12} />, label: "City", value: c.city || "—" },
                  { icon: <ShoppingBag size={12} />, label: "Joined", value: formatDate(c.createdAt) },
                ].map((f, i) => (
                  <div key={i} style={{ background: "#0D0D0D", border: "1px solid #1a1a1a", borderRadius: 8, padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>
                      {f.icon} {f.label}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#ccc", wordBreak: "break-word" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, background: "rgba(var(--accent-rgb), 0.06)", border: "1px solid rgba(var(--accent-rgb), 0.15)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)" }}>{c.orderCount}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666", textTransform: "uppercase" }}>Total Orders</div>
                </div>
                <div style={{ flex: 1, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#10B981" }}>₹{c.totalSpent.toLocaleString()}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666", textTransform: "uppercase" }}>Total Spent</div>
                </div>
              </div>

              {/* Order history */}
              <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: "0 0 12px", textTransform: "uppercase" }}>
                Order History
              </h4>
              {customerOrders.length === 0 ? (
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", textAlign: "center", padding: "16px 0" }}>
                  No orders placed yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {customerOrders.map((o) => (
                    <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0D0D0D", border: "1px solid #1a1a1a", borderRadius: 8, padding: "10px 14px" }}>
                      <div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--accent)", fontWeight: 600 }}>#{o.orderNumber}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#555" }}>{formatDate(o.createdAt)}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#888" }}>{o.status}</span>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#ccc" }}>₹{o.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

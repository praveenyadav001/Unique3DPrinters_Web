import { useMemo, useState } from "react";
import { Copy, Percent, Plus, Search, Ticket, Trash2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";

type Coupon = {
  code: string;
  type: "Percent" | "Flat";
  value: number;
  minOrder: number;
  usage: number;
  limit: number;
  status: "Active" | "Scheduled" | "Paused";
  expires: string;
};

const INITIAL_COUPONS: Coupon[] = [
  { code: "FIRSTPRINT10", type: "Percent", value: 10, minOrder: 999, usage: 18, limit: 100, status: "Active", expires: "30 Jun 2026" },
  { code: "RAPID250", type: "Flat", value: 250, minOrder: 2499, usage: 7, limit: 40, status: "Scheduled", expires: "15 Jul 2026" },
];

export default function AdminDiscountsPage({ mode = "discounts" }: { mode?: "discounts" | "coupons" }) {
  const { orders } = useOrders();
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    type: "Percent" as Coupon["type"],
    value: "10",
    minOrder: "999",
    limit: "50",
    expires: "31 Jul 2026",
  });

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => coupon.code.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [coupons, searchQuery]);

  const totalDiscountGiven = orders.reduce((sum, order) => sum + (order.discount || 0), 0);
  const discountedOrders = orders.filter((order) => (order.discount || 0) > 0).length;
  const redemptionRate = orders.length ? Math.round((discountedOrders / orders.length) * 100) : 0;

  const createCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = formData.code.trim().toUpperCase();
    if (!code) return;
    setCoupons((current) => [
      {
        code,
        type: formData.type,
        value: Number(formData.value) || 0,
        minOrder: Number(formData.minOrder) || 0,
        usage: 0,
        limit: Number(formData.limit) || 1,
        status: "Active",
        expires: formData.expires,
      },
      ...current.filter((coupon) => coupon.code !== code),
    ]);
    setFormData((current) => ({ ...current, code: "" }));
  };

  const toggleStatus = (code: string) => {
    setCoupons((current) => current.map((coupon) => {
      if (coupon.code !== code) return coupon;
      return { ...coupon, status: coupon.status === "Paused" ? "Active" : "Paused" };
    }));
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>{mode === "coupons" ? "Coupons" : "Discounts & Coupons"}</h2>
        <p>Create promo campaigns and monitor discount performance across paid orders.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Active Coupons", value: String(coupons.filter((c) => c.status === "Active").length), icon: <Ticket size={18} />, color: "var(--accent)" },
          { label: "Discount Given", value: `Rs. ${totalDiscountGiven.toLocaleString("en-IN")}`, icon: <Percent size={18} />, color: "#EAB308" },
          { label: "Redemption Rate", value: `${redemptionRate}%`, icon: <Copy size={18} />, color: "#10B981" },
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

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, alignItems: "start" }}>
        <form className="dash-card" onSubmit={createCoupon}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, color: "#fff", margin: "0 0 18px", textTransform: "uppercase" }}>
            New Campaign
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="dash-label">Coupon Code</label>
              <input className="dash-input" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="SUMMER15" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="dash-label">Discount Type</label>
                <select className="dash-select" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Coupon["type"] })}>
                  <option>Percent</option>
                  <option>Flat</option>
                </select>
              </div>
              <div>
                <label className="dash-label">Value</label>
                <input className="dash-input" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label className="dash-label">Min Order</label>
                <input className="dash-input" value={formData.minOrder} onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })} />
              </div>
              <div>
                <label className="dash-label">Usage Limit</label>
                <input className="dash-input" value={formData.limit} onChange={(e) => setFormData({ ...formData, limit: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="dash-label">Expires</label>
              <input className="dash-input" value={formData.expires} onChange={(e) => setFormData({ ...formData, expires: e.target.value })} />
            </div>
            <button className="dash-btn-primary" type="submit">
              <Plus size={16} /> Create Coupon
            </button>
          </div>
        </form>

        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: 18, display: "flex", gap: 12, alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Campaigns
            </h3>
            <div className="dashboard-topbar-search" style={{ maxWidth: 260, marginLeft: "auto" }}>
              <Search size={14} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search code..." />
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
              <thead>
                <tr>
                  {["Code", "Discount", "Min Order", "Usage", "Expires", "Status", "Actions"].map((header) => (
                    <th key={header} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", background: "#0D0D0D", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.code} style={{ borderBottom: "1px solid #111" }}>
                    <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 700 }}>{coupon.code}</td>
                    <td style={{ padding: "12px 16px", color: "#fff" }}>{coupon.type === "Percent" ? `${coupon.value}%` : `Rs. ${coupon.value}`}</td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>Rs. {coupon.minOrder.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>{coupon.usage}/{coupon.limit}</td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>{coupon.expires}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`dash-badge ${coupon.status === "Active" ? "dash-badge-green" : coupon.status === "Paused" ? "dash-badge-red" : "dash-badge-yellow"}`}>
                        {coupon.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                      <button type="button" className="dash-btn-secondary dash-btn-small" onClick={() => toggleStatus(coupon.code)}>
                        {coupon.status === "Paused" ? "Resume" : "Pause"}
                      </button>
                      <button type="button" className="dashboard-icon-btn" onClick={() => setCoupons((current) => current.filter((item) => item.code !== coupon.code))} title="Delete coupon">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCoupons.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#555" }}>No matching coupons found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

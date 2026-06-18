import { useState } from "react";
import { Edit2, Eye, Loader, Package, Plus, Search, Trash2 } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";

export default function AdminProductsPage() {
  const { designs, categories, loading } = useDesigns();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filtered = designs.filter((design) => {
    if (selectedCategory !== "All" && design.category !== selectedCategory) return false;
    if (search && !design.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const published = designs.filter((design) => design.isActive).length;
  const inventoryValue = designs.reduce((sum, design) => sum + (design.price || 0) * (design.stock || 0), 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h2>Product Catalog</h2>
          <p>Review sellable designs, prices, stock, and storefront visibility.</p>
        </div>
        <button className="dash-btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Total Products", value: designs.length.toLocaleString(), color: "var(--accent)" },
          { label: "Published", value: published.toLocaleString(), color: "#10B981" },
          { label: "Drafts", value: (designs.length - published).toLocaleString(), color: "#EAB308" },
          { label: "Inventory Value", value: `₹${inventoryValue.toLocaleString()}`, color: "#00E5FF" },
        ].map((stat) => (
          <div key={stat.label} className="dash-card" style={{ padding: "16px 18px", borderColor: `${stat.color}22` }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666", textTransform: "uppercase" }}>{stat.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <div className="dashboard-topbar-search" style={{ flex: "1 1 260px", maxWidth: 460 }}>
          <Search size={14} />
          <input placeholder="Search products..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <select className="dash-select" style={{ width: 220 }} value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Package size={32} style={{ color: "#333", marginBottom: 12 }} />
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#444" }}>No products found</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                {["Product", "Category", "Stock", "Price", "Sales", "Status", ""].map((header) => (
                  <th key={header} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((design) => (
                <tr key={design.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, background: design.imageURL ? `url(${design.imageURL}) center/cover` : "#141414", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #222", flexShrink: 0 }}>
                        {!design.imageURL && <span style={{ fontSize: "1.35rem" }}>{design.emoji || "📦"}</span>}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "0.98rem", color: "#fff" }}>{design.name}</div>
                        <div style={{ color: "#555", marginTop: 2 }}>{design.materials?.slice(0, 2).join(" / ") || "No material set"}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", color: "#aaa" }}>{design.category}</td>
                  <td style={{ padding: "14px 16px", color: design.stock <= 3 ? "#EF4444" : "#ccc" }}>{design.stock ?? 0}</td>
                  <td style={{ padding: "14px 16px", color: "var(--accent)", fontWeight: 700 }}>₹{design.price?.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px", color: "#ccc" }}>{design.salesCount ?? 0}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span className={`dash-badge ${design.isActive ? "dash-badge-green" : "dash-badge-red"}`}>
                      {design.isActive ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button className="dashboard-icon-btn" title="Preview"><Eye size={13} /></button>
                      <button className="dashboard-icon-btn" title="Edit"><Edit2 size={13} /></button>
                      <button className="dashboard-icon-btn" title="Delete" style={{ color: "#EF4444" }}><Trash2 size={13} /></button>
                    </div>
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

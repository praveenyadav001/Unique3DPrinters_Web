import { useState } from "react";
import { Plus, Search, Loader, Edit2, Trash2, Package } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";

export default function AdminProductsPage() {
  const { designs, categories, loading } = useDesigns();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filtered = designs.filter(d => {
    if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Products Catalog</h2>
          <p>Manage store inventory, prices, and visibility.</p>
        </div>
        <button className="dash-btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
        <div className="dashboard-topbar-search" style={{ flex: 1, maxWidth: 400 }}>
          <Search size={14} />
          <input 
            placeholder="Search products..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
        <select 
          className="dash-select" 
          style={{ width: 200 }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
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
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#333" }}>No products found</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                <th style={{ width: 60, padding: "12px 16px" }}></th>
                {["Product Name", "Category", "Base Price", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 6, background: d.imageURL ? `url(${d.imageURL}) center/cover` : "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {!d.imageURL && <span style={{ fontSize: "1.2rem" }}>{d.emoji || "📦"}</span>}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem" }}>
                    {d.name}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>{d.category}</td>
                  <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>₹{d.price}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`dash-badge ${d.isActive ? "dash-badge-green" : "dash-badge-red"}`}>
                      {d.isActive ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="dashboard-icon-btn" style={{ width: 28, height: 28 }} title="Edit">
                        <Edit2 size={12} />
                      </button>
                      <button className="dashboard-icon-btn" style={{ width: 28, height: 28, color: "#EF4444" }} title="Delete">
                        <Trash2 size={12} />
                      </button>
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

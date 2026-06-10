import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Loader, GripVertical } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";

export default function AdminCategoriesPage() {
  const { categories, loading } = useDesigns();
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Categories</h2>
          <p>Manage product categories and collections.</p>
        </div>
        <button className="dash-btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 400 }}>
          <Search size={14} />
          <input 
            placeholder="Search categories..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#333" }}>No categories found</div>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                {["Category", "Type", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #111" }}>
                  <td style={{ padding: "12px 16px", color: "#333", cursor: "grab" }}>
                    <GripVertical size={14} />
                  </td>
                  <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.95rem" }}>
                    {c.emoji && <span style={{ marginRight: 8 }}>{c.emoji}</span>}
                    {c.name}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#888" }}>{c.type}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className={`dash-badge ${c.isActive ? "dash-badge-green" : "dash-badge-red"}`}>
                      {c.isActive ? "Active" : "Inactive"}
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

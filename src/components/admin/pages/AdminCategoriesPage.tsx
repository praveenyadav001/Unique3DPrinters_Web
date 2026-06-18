import { useState } from "react";
import { FolderTree, Grid3X3, Loader, Plus, Search, ToggleLeft, ToggleRight } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";

export default function AdminCategoriesPage() {
  const { categories, designs, loading } = useDesigns();
  const [search, setSearch] = useState("");

  const filtered = categories.filter((category) =>
    [category.name, category.type].some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );

  const totalDesigns = designs.length;
  const activeCategories = categories.filter((category) => category.isActive).length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h2>Category Collections</h2>
          <p>Organize storefront browsing groups and catalog navigation.</p>
        </div>
        <button className="dash-btn-primary">
          <Plus size={16} /> New Collection
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Collections", value: categories.length, icon: <FolderTree size={18} />, color: "var(--accent)" },
          { label: "Active", value: activeCategories, icon: <ToggleRight size={18} />, color: "#10B981" },
          { label: "Inactive", value: categories.length - activeCategories, icon: <ToggleLeft size={18} />, color: "#EAB308" },
          { label: "Linked Designs", value: totalDesigns, icon: <Grid3X3 size={18} />, color: "#00E5FF" },
        ].map((stat) => (
          <div key={stat.label} className="dash-card" style={{ padding: "16px 18px", borderColor: `${stat.color}22` }}>
            <div style={{ color: stat.color, marginBottom: 10 }}>{stat.icon}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666", textTransform: "uppercase" }}>{stat.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-topbar-search" style={{ maxWidth: 420, marginBottom: 18 }}>
        <Search size={14} />
        <input placeholder="Search collections..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {loading ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center", color: "#666", fontFamily: "'DM Mono', monospace" }}>
          No category collections found.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
          {filtered.map((category) => {
            const designCount = designs.filter((design) => design.category === category.name).length;
            return (
              <div key={category.id} className="dash-card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                      {category.emoji || "📁"}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1rem", color: "#fff" }}>{category.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666" }}>{category.type}</div>
                    </div>
                  </div>
                  <span className={`dash-badge ${category.isActive ? "dash-badge-green" : "dash-badge-red"}`}>
                    {category.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                <div style={{ marginTop: 18, padding: "12px 0", borderTop: "1px solid #161616", borderBottom: "1px solid #161616", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#555", textTransform: "uppercase" }}>Designs</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "var(--accent)" }}>{designCount}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#555", textTransform: "uppercase" }}>Sort order</div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#ccc" }}>{category.order ?? 0}</div>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <button className="dash-btn-secondary dash-btn-small">Edit Collection</button>
                  <button className="dashboard-icon-btn" title={category.isActive ? "Deactivate" : "Activate"}>
                    {category.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

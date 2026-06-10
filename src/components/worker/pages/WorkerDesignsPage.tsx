import { useState } from "react";
import { Search, Loader, Filter, Package } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";

export default function WorkerDesignsPage() {
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
          <h2>Design Catalog</h2>
          <p>Browse available designs and their requirements.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <div className="dashboard-topbar-search" style={{ flex: 1, maxWidth: 400 }}>
          <Search size={14} />
          <input 
            placeholder="Search designs..." 
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

      {loading ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginTop: 12 }}>Loading designs...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <Package size={32} style={{ color: "#333", marginBottom: 12 }} />
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: 4 }}>No designs found</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555" }}>Try adjusting your search or filters.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {filtered.map(d => (
            <div key={d.id} className="dash-featured-card">
              <div style={{ 
                height: 140, 
                background: d.imageURL ? `url(${d.imageURL}) center/cover` : "#1a1a1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                borderBottom: "1px solid #222"
              }}>
                {!d.imageURL && <span style={{ fontSize: "3rem" }}>{d.emoji || "📦"}</span>}
              </div>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <h3 className="card-title">{d.name}</h3>
                    <div className="card-meta">{d.category}</div>
                  </div>
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase" }}>Materials</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#ccc" }}>
                      {d.materials?.join(", ") || "Any"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase" }}>Colors</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#ccc" }}>
                      {d.colors?.length > 0 ? d.colors.length + " options" : "Standard"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

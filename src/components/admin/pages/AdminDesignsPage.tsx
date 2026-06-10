import { useState } from "react";
import { Plus, Edit2, Trash2, Search, UploadCloud, Loader } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";
import { createDesign, deleteDesign } from "@/services/designs.service";
import { useAuth } from "@/hooks/useAuth";

export default function AdminDesignsPage() {
  const { designs, categories, loading } = useDesigns();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("Home Decor");
  const [newPrice, setNewPrice] = useState("");

  const filtered = designs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const handleSave = async () => {
    if (!newName || !newPrice) return;
    try {
      await createDesign({
        name: newName,
        category: newCat,
        price: Number(newPrice),
        emoji: "📦",
        imageURL: "",
        description: "",
        materials: [],
        colors: [],
        isActive: true,
        stock: 10,
        createdBy: user?.uid || "admin",
      });
      setShowModal(false);
      setNewName("");
      setNewPrice("");
    } catch (error) {
      console.error("Failed to create design", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this design?")) {
      try {
        await deleteDesign(id);
      } catch (error) {
        console.error("Failed to delete design", error);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h2>Product Catalog (Designs)</h2>
          <p>Manage the 3D designs available on the store.</p>
        </div>
        <button className="dash-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} style={{ marginRight: 6 }} /> Add Design
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div className="dashboard-topbar-search" style={{ maxWidth: 300 }}>
          <Search size={14} />
          <input type="text" placeholder="Search designs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Design Name", "Category", "Base Price", "Total Sales", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "#666" }}><Loader size={20} style={{ animation: "spin 1s linear infinite" }} /> Loading designs...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "#666" }}>No designs found.</td></tr>
            ) : filtered.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem" }}>{d.name}</td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{d.category}</td>
                <td style={{ padding: "12px 16px", color: "var(--accent)" }}>₹{d.price}</td>
                <td style={{ padding: "12px 16px", color: "#ccc" }}>{d.salesCount || 0}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><Edit2 size={14} /></button>
                    <button style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }} onClick={() => handleDelete(d.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="dash-card" style={{ width: 400, maxWidth: "90vw", padding: 24 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", fontSize: "1.2rem", marginBottom: 16 }}>Add New Design</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="dash-label">Design Name</label>
                <input type="text" className="dash-input" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              
              <div>
                <label className="dash-label">Category</label>
                <select className="dash-select" value={newCat} onChange={e => setNewCat(e.target.value)}>
                  <option>Home Decor</option>
                  <option>Toys</option>
                  <option>Accessories</option>
                  <option>Miniatures</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="dash-label">Base Price (₹)</label>
                <input type="number" className="dash-input" value={newPrice} onChange={e => setNewPrice(e.target.value)} />
              </div>

              <div>
                <label className="dash-label">STL File</label>
                <button className="dash-btn-primary dash-btn-small" style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 6, background: "#222", border: "1px dashed #444", color: "#ccc" }}>
                  <UploadCloud size={14} /> Upload STL
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="dash-btn-primary" style={{ flex: 1, background: "transparent", border: "1px solid #333", color: "#ccc" }} onClick={() => setShowModal(false)}>Cancel</button>
              <button className="dash-btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={handleSave}>Save Design</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

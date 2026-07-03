import { useState } from "react";
import { Plus, Edit2, Trash2, Search, UploadCloud, Loader, Loader2 } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";
import { createDesign, deleteDesign, updateDesign } from "@/services/designs.service";
import { uploadDesignModel } from "@/services/storage.service";
import { useAuth } from "@/hooks/useAuth";
import type { DesignDoc } from "@/types/firebase.types";

export default function AdminDesignsPage() {
  const { designs, categories, loading } = useDesigns();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("Home Decor");
  const [newPrice, setNewPrice] = useState("");
  const [modelFile, setModelFile] = useState<File | null>(null);

  const filtered = designs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditId(null); setNewName(""); setNewCat("Home Decor"); setNewPrice(""); setModelFile(null); setShowModal(true);
  };

  const openEdit = (d: DesignDoc) => {
    setEditId(d.id); setNewName(d.name); setNewCat(d.category); setNewPrice(String(d.price)); setModelFile(null); setShowModal(true);
  };

  const handleSave = async () => {
    if (!newName || !newPrice) return;
    setSaving(true);
    try {
      let modelURL: string | undefined;
      if (modelFile) {
        modelURL = await uploadDesignModel(user?.uid || "admin", modelFile);
      }

      if (editId) {
        await updateDesign(editId, {
          name: newName,
          category: newCat,
          price: Number(newPrice),
          ...(modelURL ? { modelURL } : {}),
        });
      } else {
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
          ...(modelURL ? { modelURL } : {}),
        });
      }

      setShowModal(false);
      setNewName("");
      setNewPrice("");
      setModelFile(null);
      setEditId(null);
    } catch (error) {
      console.error("Failed to save design", error);
      alert("Failed to save design. Please try again.");
    } finally {
      setSaving(false);
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
        <button className="dash-btn-primary" onClick={openAdd}>
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
                    <button style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }} onClick={() => openEdit(d)} title="Edit design"><Edit2 size={14} /></button>
                    <button style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }} onClick={() => handleDelete(d.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }}>
          <div className="glass-card animate-scaleIn" style={{ width: 440, maxWidth: "90vw", padding: 32, position: "relative", overflow: "hidden", border: "1px solid rgba(255, 92, 0, 0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 92, 0, 0.1)" }}>
            
            {/* Decorative background glow */}
            <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "var(--accent)", filter: "blur(80px)", opacity: 0.3, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.15)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {editId ? <Edit2 size={18} /> : <Plus size={18} />}
              </div>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", fontSize: "1.4rem", margin: 0, fontWeight: 700 }}>{editId ? "Edit Design" : "Add New Design"}</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  Design Name <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input type="text" className="dash-input" placeholder="e.g. Articulated Dragon" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: "12px 16px", fontSize: "0.9rem", background: "rgba(0,0,0,0.4)" }} />
              </div>
              
              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8 }}>Category</label>
                <select className="dash-select" value={newCat} onChange={e => setNewCat(e.target.value)} style={{ padding: "12px 16px", fontSize: "0.9rem", background: "rgba(0,0,0,0.4)" }}>
                  <option>Home Decor</option>
                  <option>Toys</option>
                  <option>Accessories</option>
                  <option>Miniatures</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8 }}>Base Price (₹)</label>
                <input type="number" className="dash-input" placeholder="0.00" value={newPrice} onChange={e => setNewPrice(e.target.value)} style={{ padding: "12px 16px", fontSize: "0.9rem", background: "rgba(0,0,0,0.4)" }} />
              </div>

              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8 }}>STL File {editId && <span style={{ color: "#555" }}>(optional — leave empty to keep current)</span>}</label>
                <input id="admin-stl-input" type="file" accept=".stl,.obj,.3mf" style={{ display: "none" }} onChange={(e) => setModelFile(e.target.files?.[0] || null)} />
                <button type="button" onClick={() => document.getElementById("admin-stl-input")?.click()} className="dash-upload-zone" style={{ width: "100%", padding: "24px", display: "flex", flexDirection: "row", alignItems: "center", gap: 16, background: "rgba(0,0,0,0.4)", border: `1px dashed ${modelFile ? "var(--accent)" : "rgba(255,255,255,0.2)"}` }}>
                  <div className="upload-icon" style={{ width: 40, height: 40, borderRadius: 10 }}><UploadCloud size={18} /></div>
                  <div style={{ textAlign: "left", minWidth: 0 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem", color: "#fff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {modelFile ? modelFile.name : "Click to upload STL"}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#777", marginTop: 4 }}>
                      {modelFile ? `${(modelFile.size / 1024 / 1024).toFixed(2)} MB selected` : "Maximum file size: 50MB"}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button className="dash-btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "0.9rem" }} onClick={() => setShowModal(false)} disabled={saving}>Cancel</button>
              <button className="dash-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 8 }} onClick={handleSave} disabled={saving}>
                {saving && <Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} />}
                {saving ? "Saving..." : editId ? "Update Design" : "Save Design"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

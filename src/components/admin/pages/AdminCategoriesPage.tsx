import { useState } from "react";
import { FolderTree, Grid3X3, Loader, Plus, Search, ToggleLeft, ToggleRight, Edit2 } from "lucide-react";
import { useDesigns } from "@/hooks/useDesigns";
import { createCategory, updateCategory } from "@/services/designs.service";
import type { CategoryDoc } from "@/types/firebase.types";

export default function AdminCategoriesPage() {
  const { categories, designs, loading } = useDesigns();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Products");
  const [newEmoji, setNewEmoji] = useState("📁");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = categories.filter((category) =>
    [category.name, category.type].some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );

  const totalDesigns = designs.length;
  const activeCategories = categories.filter((category) => category.isActive).length;

  const openAdd = () => {
    setEditId(null); setNewName(""); setNewType("Products"); setNewEmoji("📁"); setShowModal(true);
  };

  const openEdit = (c: CategoryDoc) => {
    setEditId(c.id); setNewName(c.name); setNewType(c.type); setNewEmoji(c.emoji || "📁"); setShowModal(true);
  };

  const handleSave = async () => {
    if (!newName) return;
    setIsSaving(true);
    try {
      if (editId) {
        await updateCategory(editId, { name: newName, type: newType, emoji: newEmoji });
      } else {
        await createCategory({
          name: newName,
          type: newType,
          emoji: newEmoji,
          order: categories.length + 1,
          isActive: true,
        });
      }
      setShowModal(false);
      setNewName("");
      setNewEmoji("📁");
      setEditId(null);
    } catch (error) {
      console.error("Failed to save category", error);
      alert("Failed to save collection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategoryStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateCategory(id, { isActive: !currentStatus });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
        <div>
          <h2>Category Collections</h2>
          <p>Organize storefront browsing groups and catalog navigation.</p>
        </div>
        <button className="dash-btn-primary" onClick={openAdd}>
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
                  <span className={`dash-badge ${category.isActive ? "dash-badge-green" : "dash-badge-red"}`} style={{ fontSize: "0.65rem", padding: "4px 8px", borderRadius: 4, background: category.isActive ? "rgba(16, 185, 129, 0.1)" : "rgba(234, 179, 8, 0.1)", color: category.isActive ? "#10B981" : "#EAB308" }}>
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
                  <button className="dash-btn-secondary dash-btn-small" style={{ fontSize: "0.7rem", padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }} onClick={() => openEdit(category)}><Edit2 size={12} /> Edit Collection</button>
                  <button className="dashboard-icon-btn" title={category.isActive ? "Deactivate" : "Activate"} onClick={() => toggleCategoryStatus(category.id, category.isActive)}>
                    {category.isActive ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }}>
          <div className="glass-card animate-scaleIn" style={{ width: 400, maxWidth: "90vw", padding: 32, position: "relative", overflow: "hidden", border: "1px solid rgba(255, 92, 0, 0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 92, 0, 0.1)" }}>
            
            <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "var(--accent)", filter: "blur(80px)", opacity: 0.3, pointerEvents: "none" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.15)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {editId ? <Edit2 size={18} /> : <Plus size={18} />}
              </div>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", fontSize: "1.4rem", margin: 0, fontWeight: 700 }}>{editId ? "Edit Collection" : "Add Collection"}</h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  Collection Name <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <input type="text" className="dash-input" placeholder="e.g. Home Decor" value={newName} onChange={e => setNewName(e.target.value)} style={{ padding: "12px 16px", fontSize: "0.9rem", background: "rgba(0,0,0,0.4)" }} />
              </div>
              
              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8 }}>Collection Type</label>
                <select className="dash-select" value={newType} onChange={e => setNewType(e.target.value)} style={{ padding: "12px 16px", fontSize: "0.9rem", background: "rgba(0,0,0,0.4)" }}>
                  <option>Products</option>
                  <option>Themes</option>
                  <option>Seasonal</option>
                  <option>Utility</option>
                </select>
              </div>

              <div>
                <label className="dash-label" style={{ color: "#aaa", fontSize: "0.75rem", marginBottom: 8 }}>Emoji / Icon</label>
                <input type="text" className="dash-input" placeholder="📁" maxLength={2} value={newEmoji} onChange={e => setNewEmoji(e.target.value)} style={{ padding: "12px 16px", fontSize: "1.2rem", background: "rgba(0,0,0,0.4)", textAlign: "center", width: "60px" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button className="dash-btn-secondary" style={{ flex: 1, padding: "12px", fontSize: "0.9rem" }} onClick={() => setShowModal(false)} disabled={isSaving}>Cancel</button>
              <button className="dash-btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px", fontSize: "0.9rem", opacity: isSaving ? 0.7 : 1 }} onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : editId ? "Update Collection" : "Save Collection"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

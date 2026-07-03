import { useState } from "react";
import { AlertTriangle, Boxes, Plus, Search, ToggleLeft, ToggleRight, Trash2, X, Loader2 } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { createMaterial, deleteMaterial, updateMaterial } from "@/services/materials.service";

const EMPTY_MATERIAL = { name: "", type: "PLA", color: "#00E5FF", pricePerUnit: "", stock: "", unit: "kg" };

export default function AdminMaterialsPage() {
  const { materials, loading } = useMaterials();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_MATERIAL);
  const [saving, setSaving] = useState(false);

  const filtered = materials.filter((material) =>
    [material.name, material.type, material.color].some((value) => value.toLowerCase().includes(search.toLowerCase()))
  );
  const lowStock = materials.filter((material) => material.stock <= 2).length;
  const totalStock = materials.reduce((sum, material) => sum + (material.stock || 0), 0);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this material from inventory?")) {
      await deleteMaterial(id);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.type.trim()) {
      alert("Please enter a material name and type.");
      return;
    }
    setSaving(true);
    try {
      await createMaterial({
        name: form.name.trim(),
        type: form.type.trim(),
        color: form.color,
        pricePerUnit: parseFloat(form.pricePerUnit) || 0,
        stock: parseFloat(form.stock) || 0,
        unit: form.unit,
        isActive: true,
      });
      setShowAdd(false);
      setForm(EMPTY_MATERIAL);
    } catch (err) {
      console.error("Failed to create material", err);
      alert("Failed to create material. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Materials & Inventory</h2>
          <p>Track stock levels and pricing per material.</p>
        </div>
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} style={{ marginRight: 6 }} /> Add Material</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Materials", value: materials.length, icon: <Boxes size={18} />, color: "var(--accent)" },
          { label: "Total Stock", value: `${totalStock.toFixed(1)} units`, icon: <Boxes size={18} />, color: "#10B981" },
          { label: "Low Stock", value: lowStock, icon: <AlertTriangle size={18} />, color: "#EF4444" },
        ].map((stat) => (
          <div key={stat.label} className="dash-card" style={{ padding: "16px 18px", borderColor: `${stat.color}22` }}>
            <div style={{ color: stat.color, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666", textTransform: "uppercase" }}>{stat.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.45rem", color: "#fff" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-topbar-search" style={{ maxWidth: 420, marginBottom: 18 }}>
        <Search size={14} />
        <input placeholder="Search materials, type, color..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Material Name", "Type", "Stock (kg)", "Price/Gram (₹)", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading materials...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "16px", textAlign: "center", color: "#666" }}>No materials found.</td></tr>
            ) : filtered.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem" }}>
                  <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: m.color || "#888", marginRight: 8, border: "1px solid #333" }} />
                  {m.name}
                </td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{m.type}</td>
                <td style={{ padding: "12px 16px", color: m.stock < 1 ? "#EF4444" : "#ccc" }}>{m.stock} {m.unit}</td>
                <td style={{ padding: "12px 16px", color: "var(--accent)" }}>₹{m.pricePerUnit?.toFixed(2) || "0.00"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`dash-badge ${m.isActive && m.stock > 0 ? "dash-badge-green" : "dash-badge-red"}`}>
                    {m.isActive && m.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="dashboard-icon-btn" title={m.isActive ? "Disable" : "Enable"} onClick={() => updateMaterial(m.id, { isActive: !m.isActive })}>
                      {m.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                    </button>
                    <button className="dashboard-icon-btn" title="Delete" onClick={() => handleDelete(m.id)} style={{ color: "#EF4444" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add Material Modal ─────────────────────────── */}
      {showAdd && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setShowAdd(false)}
        >
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, width: 440, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>Add Material</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "#0D0D0D", border: "1px solid #222", borderRadius: 8, color: "#666", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="dash-label">Material Name</label>
                <input className="dash-input" placeholder="e.g. PolyTerra PLA" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="dash-label">Type</label>
                  <input className="dash-input" placeholder="PLA / ABS / Resin" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
                </div>
                <div>
                  <label className="dash-label">Color</label>
                  <input type="color" className="dash-input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ height: 42, padding: 4 }} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <label className="dash-label">Price/Unit (₹)</label>
                  <input className="dash-input" type="number" placeholder="2.50" value={form.pricePerUnit} onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} />
                </div>
                <div>
                  <label className="dash-label">Stock</label>
                  <input className="dash-input" type="number" placeholder="5" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div>
                  <label className="dash-label">Unit</label>
                  <input className="dash-input" placeholder="kg" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                </div>
              </div>
              <button className="dash-btn-primary" onClick={handleCreate} disabled={saving} style={{ justifyContent: "center", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> : <Plus size={16} />}
                {saving ? "Adding..." : "Add Material"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

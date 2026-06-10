import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";
import { deleteMaterial } from "@/services/materials.service";

export default function AdminMaterialsPage() {
  const { materials, loading } = useMaterials();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Materials & Inventory</h2>
          <p>Track stock levels and pricing per material.</p>
        </div>
        <button className="dash-btn-primary"><Plus size={16} style={{ marginRight: 6 }} /> Add Material</button>
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
            ) : materials.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "16px", textAlign: "center", color: "#666" }}>No materials found.</td></tr>
            ) : materials.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem" }}>{m.name}</td>
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
                    <button style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><Edit2 size={14} /></button>
                    <button onClick={() => deleteMaterial(m.id)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

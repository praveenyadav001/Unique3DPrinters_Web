import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

const INITIAL_MATERIALS = [
  { id: "M1", name: "PLA - Black", type: "PLA", stockKg: 4.5, pricePerGram: 3.5, inStock: true },
  { id: "M2", name: "PLA - White", type: "PLA", stockKg: 2.1, pricePerGram: 3.5, inStock: true },
  { id: "M3", name: "PETG - Transparent", type: "PETG", stockKg: 0.8, pricePerGram: 4.2, inStock: false },
  { id: "M4", name: "Resin - Grey", type: "Resin", stockKg: 1.5, pricePerGram: 8.0, inStock: true },
];

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);

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
            {materials.map((m) => (
              <tr key={m.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem" }}>{m.name}</td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{m.type}</td>
                <td style={{ padding: "12px 16px", color: m.stockKg < 1 ? "#EF4444" : "#ccc" }}>{m.stockKg} kg</td>
                <td style={{ padding: "12px 16px", color: "var(--accent)" }}>₹{m.pricePerGram.toFixed(2)}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`dash-badge ${m.inStock ? "dash-badge-green" : "dash-badge-red"}`}>
                    {m.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><Edit2 size={14} /></button>
                    <button style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer" }}><Trash2 size={14} /></button>
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

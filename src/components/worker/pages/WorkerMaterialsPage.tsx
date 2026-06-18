import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMaterials } from "@/hooks/useMaterials";

export default function WorkerMaterialsPage() {
  const { materials, loading } = useMaterials();
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Materials Status</h2>
          <p>Monitor filament and resin stock levels.</p>
        </div>
        <button className="dash-btn-primary">Request Restock</button>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Material", "Type", "Current Stock", "Capacity Level", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading materials...</td></tr>
            ) : materials.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "16px", textAlign: "center", color: "#666" }}>No materials found.</td></tr>
            ) : materials.map((m) => {
              const pct = Math.min(100, Math.round((m.stock / 10) * 100));
              const color = pct > 40 ? "#10B981" : pct > 25 ? "#EAB308" : "#EF4444";
              return (
              <tr key={m.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "#fff", fontWeight: 600, fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                    {m.name}
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{m.type}</td>
                <td style={{ padding: "12px 16px", color: "#ccc", fontWeight: 600 }}>{m.stock} {m.unit}</td>
                <td style={{ padding: "12px 16px", width: "30%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
                    </div>
                    <span style={{ color: color, width: "30px", textAlign: "right" }}>{pct}%</span>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  {pct > 25 ? (
                    <span className="dash-badge dash-badge-green"><CheckCircle2 size={10} style={{ marginRight: 4 }} /> OK</span>
                  ) : (
                    <span className="dash-badge dash-badge-red"><AlertTriangle size={10} style={{ marginRight: 4 }} /> Low</span>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

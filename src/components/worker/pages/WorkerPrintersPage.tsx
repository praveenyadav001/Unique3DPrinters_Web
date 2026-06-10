import { Printer, Settings2, ShieldCheck, AlertCircle, Thermometer } from "lucide-react";
import { usePrinters } from "@/hooks/usePrinters";

export default function WorkerPrintersPage() {
  const { printers, loading } = usePrinters();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Printers Status</h2>
        <p>Monitor assigned printers and active print jobs.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {loading ? (
          <div style={{ color: "#666" }}>Loading printers...</div>
        ) : printers.length === 0 ? (
          <div style={{ color: "#666" }}>No printers assigned to you.</div>
        ) : printers.map((p) => {
          const isPrinting = p.status === "Printing";
          const isIdle = p.status === "Idle";
          const color = isPrinting ? "#00E5FF" : isIdle ? "#10B981" : "#EF4444";
          
          return (
            <div key={p.id} className="dash-card" style={{ borderColor: `${color}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 4px" }}>
                    {p.name}
                  </h3>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666" }}>
                    {p.id} • {p.type}
                  </div>
                </div>
                <span className={`dash-badge ${isPrinting ? "dash-badge-accent" : isIdle ? "dash-badge-green" : "dash-badge-red"}`}>
                  {isPrinting ? <Printer size={10} style={{ marginRight: 4 }} /> : 
                   isIdle ? <ShieldCheck size={10} style={{ marginRight: 4 }} /> : 
                   <AlertCircle size={10} style={{ marginRight: 4 }} />}
                  {p.status}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, padding: "12px", background: "#0a0a0a", borderRadius: 8, border: "1px solid #1a1a1a" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>
                    <Thermometer size={10} /> Nozzle
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: isPrinting ? "#fff" : "#555" }}>
                    {p.currentTemp || "—"}
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", marginBottom: 4 }}>
                    <Thermometer size={10} /> Bed
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.85rem", color: isPrinting ? "#fff" : "#555" }}>
                    {p.currentBedTemp || "—"}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase" }}>Current Job</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: isPrinting ? "var(--accent)" : "#666", fontWeight: 600 }}>
                    {p.currentJobName || "None"}
                  </div>
                </div>
                <button className="dash-btn-secondary dash-btn-small" style={{ padding: "6px 10px" }}>
                  <Settings2 size={12} style={{ marginRight: 4 }} /> Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

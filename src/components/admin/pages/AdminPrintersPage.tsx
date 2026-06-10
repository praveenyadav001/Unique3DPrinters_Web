import { useState } from "react";
import { Plus, Settings2, ShieldCheck, AlertCircle } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import { usePrinters } from "@/hooks/usePrinters";
import { updatePrinter } from "@/services/printers.service";

export default function AdminPrintersPage() {
  const { workers } = useWorkers();
  const { printers, loading } = usePrinters();

  const handleAssignWorker = async (printerId: string, workerId: string) => {
    try {
      await updatePrinter(printerId, { assignedWorkerId: workerId || null });
    } catch (err) {
      console.error("Failed to assign worker", err);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Printers & Workers</h2>
          <p>Manage physical 3D printers and assign workers to them.</p>
        </div>
        <button className="dash-btn-primary"><Plus size={16} style={{ marginRight: 6 }} /> Add Printer</button>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Printer ID", "Model", "Type", "Status", "Assigned Worker", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading printers...</td></tr>
            ) : printers.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "16px", textAlign: "center", color: "#666" }}>No printers found.</td></tr>
            ) : printers.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>{p.id}</td>
                <td style={{ padding: "12px 16px", color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.9rem", fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{p.type}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`dash-badge ${p.status === "Active" ? "dash-badge-green" : "dash-badge-red"}`}>
                    {p.status === "Active" ? <ShieldCheck size={10} style={{ marginRight: 4 }} /> : <AlertCircle size={10} style={{ marginRight: 4 }} />}
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <select 
                    className="dash-select" 
                    value={p.assignedWorkerId || ""} 
                    onChange={(e) => handleAssignWorker(p.id, e.target.value)}
                    style={{ padding: "4px 8px", fontSize: "0.6rem", height: "auto" }}
                  >
                    <option value="">-- Unassigned --</option>
                    {workers.map(w => (
                      <option key={w.uid} value={w.uid}>{w.displayName}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><Settings2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

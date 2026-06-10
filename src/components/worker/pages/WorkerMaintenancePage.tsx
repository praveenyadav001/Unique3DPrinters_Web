import { Wrench, Plus, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useMaintenance } from "@/hooks/useMaintenance";

export default function WorkerMaintenancePage() {
  const { logs, loading } = useMaintenance();

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Maintenance Logs</h2>
          <p>Track repairs, calibration, and routine printer maintenance.</p>
        </div>
        <button className="dash-btn-primary">
          <Plus size={16} style={{ marginRight: 6 }} /> Log Issue
        </button>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Ticket", "Printer", "Issue", "Priority", "Date", "Status", "Actions"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#444", borderBottom: "1px solid #1a1a1a", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading maintenance logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: "16px", textAlign: "center", color: "#666" }}>No maintenance logs found.</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id} style={{ borderBottom: "1px solid #111" }}>
                <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>{log.id.slice(0,8)}</td>
                <td style={{ padding: "12px 16px", color: "#ccc", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.85rem", fontWeight: 600 }}>{log.printerName}</td>
                <td style={{ padding: "12px 16px", color: "#888" }}>{log.issue}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ 
                    color: log.priority === "High" ? "#EF4444" : log.priority === "Medium" ? "#EAB308" : "#10B981",
                    fontWeight: 600
                  }}>
                    {log.priority}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#666" }}>
                  {log.createdAt?.toDate().toLocaleDateString() || "Unknown"}
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`dash-badge ${log.status === "Completed" ? "dash-badge-green" : log.status === "In Progress" ? "dash-badge-yellow" : "dash-badge-blue"}`}>
                    {log.status === "Completed" ? <CheckCircle2 size={10} style={{ marginRight: 4 }} /> : 
                     log.status === "In Progress" ? <Wrench size={10} style={{ marginRight: 4 }} /> : 
                     <Clock size={10} style={{ marginRight: 4 }} />}
                    {log.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <button className="dash-btn-secondary dash-btn-small" style={{ padding: "4px 8px", fontSize: "0.6rem" }}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

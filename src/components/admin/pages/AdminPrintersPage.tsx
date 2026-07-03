import { useState } from "react";
import { AlertCircle, Cpu, Plus, Printer, ShieldCheck, Trash2, X, Loader2 } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";
import { usePrinters } from "@/hooks/usePrinters";
import { createPrinter, deletePrinter, updatePrinter } from "@/services/printers.service";

const STATUS_CLASS: Record<string, string> = {
  Active: "dash-badge-green",
  Idle: "dash-badge-blue",
  Printing: "dash-badge-green",
  Maintenance: "dash-badge-yellow",
  Offline: "dash-badge-red",
};

const EMPTY_PRINTER = { name: "", type: "FDM", status: "Idle" as const };

export default function AdminPrintersPage() {
  const { workers } = useWorkers();
  const { printers, loading } = usePrinters();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<{ name: string; type: string; status: string }>(EMPTY_PRINTER);
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert("Please enter a printer name.");
      return;
    }
    setSaving(true);
    try {
      await createPrinter({
        name: form.name.trim(),
        type: form.type,
        status: form.status as any,
        assignedWorkerId: null,
        assignedWorkerName: null,
        currentJobId: null,
      });
      setShowAdd(false);
      setForm(EMPTY_PRINTER);
    } catch (err) {
      console.error("Failed to create printer", err);
      alert("Failed to add printer. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignWorker = async (printerId: string, workerId: string) => {
    try {
      const worker = workers.find((item) => item.uid === workerId);
      await updatePrinter(printerId, {
        assignedWorkerId: workerId || null,
        assignedWorkerName: worker?.displayName || null,
      });
    } catch (err) {
      console.error("Failed to assign worker", err);
    }
  };

  const handleDelete = async (printerId: string) => {
    if (confirm("Delete this printer from the dashboard?")) {
      await deletePrinter(printerId);
    }
  };

  const activePrinters = printers.filter((printer) => printer.status === "Active" || printer.status === "Printing").length;
  const maintenancePrinters = printers.filter((printer) => printer.status === "Maintenance" || printer.status === "Offline").length;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Printers & Workers</h2>
          <p>Manage physical 3D printers and assign workers to them.</p>
        </div>
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}><Plus size={16} style={{ marginRight: 6 }} /> Add Printer</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Printers", value: printers.length, icon: <Printer size={18} />, color: "var(--accent)" },
          { label: "Operational", value: activePrinters, icon: <ShieldCheck size={18} />, color: "#10B981" },
          { label: "Needs Attention", value: maintenancePrinters, icon: <AlertCircle size={18} />, color: "#EF4444" },
        ].map((stat) => (
          <div key={stat.label} className="dash-card" style={{ padding: "16px 18px", borderColor: `${stat.color}22` }}>
            <div style={{ color: stat.color, marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666", textTransform: "uppercase" }}>{stat.label}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.45rem", color: "#fff" }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
          <thead>
            <tr>
              {["Printer", "Type", "Status", "Current Job", "Assigned Worker", "Actions"].map((h) => (
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
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                      <Cpu size={16} />
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontSize: "0.92rem", fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: "#555", fontSize: "0.58rem" }}>{p.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{p.type}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span className={`dash-badge ${STATUS_CLASS[p.status] || "dash-badge-red"}`}>
                    {p.status === "Active" || p.status === "Printing" ? <ShieldCheck size={10} style={{ marginRight: 4 }} /> : <AlertCircle size={10} style={{ marginRight: 4 }} />}
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: "12px 16px", color: "#aaa" }}>{p.currentJobName || "No active job"}</td>
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
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    <select className="dash-select" value={p.status} onChange={(e) => updatePrinter(p.id, { status: e.target.value as any })} style={{ padding: "4px 8px", fontSize: "0.6rem", height: "auto", width: 120 }}>
                      <option>Active</option>
                      <option>Idle</option>
                      <option>Printing</option>
                      <option>Maintenance</option>
                      <option>Offline</option>
                    </select>
                    <button className="dashboard-icon-btn" title="Delete" onClick={() => handleDelete(p.id)} style={{ color: "#EF4444" }}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Add Printer Modal ─────────────────────────── */}
      {showAdd && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={() => setShowAdd(false)}
        >
          <div style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, width: 420, maxWidth: "90vw" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>Add Printer</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "#0D0D0D", border: "1px solid #222", borderRadius: 8, color: "#666", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="dash-label">Printer Name</label>
                <input className="dash-input" placeholder="e.g. Bambu Lab X1-C #2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="dash-label">Type</label>
                  <select className="dash-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="FDM">FDM</option>
                    <option value="Resin">Resin</option>
                    <option value="SLA">SLA</option>
                  </select>
                </div>
                <div>
                  <label className="dash-label">Status</label>
                  <select className="dash-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {["Idle", "Active", "Printing", "Maintenance", "Offline"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button className="dash-btn-primary" onClick={handleCreate} disabled={saving} style={{ justifyContent: "center", marginTop: 6, display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> : <Plus size={16} />}
                {saving ? "Adding..." : "Add Printer"}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

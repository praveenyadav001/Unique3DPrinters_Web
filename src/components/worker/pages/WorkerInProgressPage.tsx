import { useState } from "react";
import { Loader, Printer, ArrowRight, Clock } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus, updateOrderProgress } from "@/services/orders.service";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + " " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function WorkerInProgressPage() {
  const { orders, loading } = useOrders();
  const inProgress = orders.filter((o) => o.status === "Processing" || o.status === "Printing");

  const [localProgress, setLocalProgress] = useState<Record<string, number>>({});

  const handleAdvance = async (docId: string, currentStatus: string) => {
    const next = currentStatus === "Processing" ? "Printing" : "Shipped";
    try { await updateOrderStatus(docId, next as any); }
    catch { alert("Failed to update status."); }
  };

  const handleProgressChange = (orderId: string, value: number) => {
    setLocalProgress((prev) => ({ ...prev, [orderId]: value }));
  };

  const handleProgressSave = async (orderId: string) => {
    const val = localProgress[orderId];
    if (val === undefined) return;
    try {
      await updateOrderProgress(orderId, val);
      alert("Progress saved.");
    } catch {
      alert("Failed to save progress.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>In Progress</h2>
          <p>Currently processing and printing — {inProgress.length} active jobs.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Loader size={16} style={{ color: "#EAB308" }} />
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#EAB308" }}>{inProgress.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginTop: 12 }}>Loading...</div>
        </div>
      ) : inProgress.length === 0 ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>☕</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: 4 }}>No active jobs</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555" }}>Start items from the Print Queue to see them here.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
          {inProgress.map((o) => {
            const isPrinting = o.status === "Printing";
            const statusColor = isPrinting ? "#00E5FF" : "#EAB308";
            const currentProgress = localProgress[o.id] !== undefined ? localProgress[o.id] : (o.printProgress || 0);

            return (
              <div key={o.id} className="dash-card" style={{ padding: 0, overflow: "hidden", borderColor: `${statusColor}20` }}>
                {/* Header */}
                <div style={{ padding: "16px 20px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: statusColor, fontWeight: 600 }}>#{o.orderNumber}</span>
                    <span className={`dash-badge ${isPrinting ? "dash-badge-accent" : "dash-badge-yellow"}`} style={{ marginLeft: 8, fontSize: "0.5rem" }}>
                      {isPrinting ? "🖨️ Printing" : "⚙️ Processing"}
                    </span>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555" }}>
                    <Clock size={10} style={{ marginRight: 4, verticalAlign: "middle" }} />{formatDate(o.createdAt)}
                  </span>
                </div>

                {/* Body */}
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: 4 }}>
                    📦 {o.items?.[0]?.designName || "Custom Design"}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", marginBottom: 12 }}>
                    Customer: <span style={{ color: "#999" }}>{o.customerName}</span>
                    {o.items?.[0]?.material && <> • Material: <span style={{ color: "#999" }}>{o.items[0].material}</span></>}
                    {o.assignedPrinterName && <> • Printer: <span style={{ color: "var(--accent)" }}>{o.assignedPrinterName}</span></>}
                  </div>

                  {/* Progress bar */}
                  {isPrinting && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase" }}>Print Progress</span>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: statusColor }}>{currentProgress}%</span>
                      </div>
                      
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={currentProgress} 
                        onChange={(e) => handleProgressChange(o.id, Number(e.target.value))}
                        onMouseUp={() => handleProgressSave(o.id)}
                        onTouchEnd={() => handleProgressSave(o.id)}
                        style={{ width: "100%", accentColor: statusColor, cursor: "pointer", marginBottom: 4 }}
                      />
                      
                      <div style={{ height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{
                          width: `${currentProgress}%`, height: "100%", borderRadius: 3,
                          background: `linear-gradient(90deg, ${statusColor}, var(--accent))`,
                          transition: "width 0.2s",
                        }} />
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "var(--accent)" }}>
                      ₹{o.total?.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => handleAdvance(o.id, o.status)} 
                      className="dash-btn-primary dash-btn-small"
                      disabled={isPrinting && currentProgress < 100}
                      style={{ opacity: isPrinting && currentProgress < 100 ? 0.5 : 1 }}
                    >
                      {isPrinting ? "Mark Shipped" : "Start Print"} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

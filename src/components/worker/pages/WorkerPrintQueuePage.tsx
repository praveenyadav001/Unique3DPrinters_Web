import { useState } from "react";
import { ListOrdered, Clock, ArrowRight, Loader, Printer, X } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus, assignPrinterToOrder } from "@/services/orders.service";
import { usePrinters } from "@/hooks/usePrinters";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + " " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function WorkerPrintQueuePage() {
  const { orders, loading } = useOrders();
  const { printers } = usePrinters();
  const queue = orders.filter((o) => o.status === "Pending" || o.status === "Confirmed" || o.status === "Processing");

  const [selectingPrinterForOrder, setSelectingPrinterForOrder] = useState<string | null>(null);

  const handleStartProcessing = async (docId: string) => {
    try { await updateOrderStatus(docId, "Processing"); }
    catch { alert("Failed to update status."); }
  };

  const handleAssignPrinter = async (printerId: string, printerName: string) => {
    if (!selectingPrinterForOrder) return;
    try {
      await assignPrinterToOrder(selectingPrinterForOrder, printerId, printerName);
      setSelectingPrinterForOrder(null);
    } catch {
      alert("Failed to assign printer.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Print Queue</h2>
          <p>Orders waiting to be printed — {queue.length} in queue.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ListOrdered size={16} style={{ color: "var(--accent)" }} />
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)" }}>{queue.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <Loader size={20} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginTop: 12 }}>Loading queue...</div>
        </div>
      ) : queue.length === 0 ? (
        <div className="dash-card" style={{ padding: 60, textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✨</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", marginBottom: 4 }}>Queue is empty!</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555" }}>All caught up. No pending print jobs.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {queue.map((o, idx) => (
            <div key={o.id} className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "stretch" }}>
                {/* Queue position */}
                <div style={{
                  width: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  background: "rgba(var(--accent-rgb), 0.04)", borderRight: "1px solid #1a1a1a",
                }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "#555", textTransform: "uppercase" }}>Queue</span>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--accent)" }}>#{idx + 1}</span>
                </div>

                {/* Order details */}
                <div style={{ flex: 1, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "var(--accent)", fontWeight: 600 }}>#{o.orderNumber}</span>
                      <span className={`dash-badge ${o.status === "Confirmed" ? "dash-badge-blue" : o.status === "Processing" ? "dash-badge-accent" : "dash-badge-yellow"}`} style={{ marginLeft: 8, fontSize: "0.5rem" }}>
                        {o.status}
                      </span>
                    </div>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                      <Clock size={10} style={{ marginRight: 4, verticalAlign: "middle" }} />{formatDate(o.createdAt)}
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", marginBottom: 2 }}>Design</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>
                        📦 {o.items?.[0]?.designName || "Custom Design"}
                        {o.items.length > 1 && <span style={{ color: "#555", fontSize: "0.75rem" }}> +{o.items.length - 1} more</span>}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", marginBottom: 2 }}>Customer</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#ccc" }}>{o.customerName}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", textTransform: "uppercase", marginBottom: 2 }}>Amount</div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "var(--accent)" }}>₹{o.total?.toLocaleString()}</div>
                    </div>
                  </div>

                  {o.items?.[0] && (
                    <div style={{ display: "flex", gap: 16, marginTop: 8, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                      {o.items[0].material && <span>Material: <span style={{ color: "#999" }}>{o.items[0].material}</span></span>}
                      {o.items[0].color && <span>Color: <span style={{ color: "#999" }}>{o.items[0].color}</span></span>}
                      {o.items[0].size && <span>Size: <span style={{ color: "#999" }}>{o.items[0].size}</span></span>}
                      <span>Qty: <span style={{ color: "#999" }}>{o.items.reduce((s, i) => s + i.quantity, 0)}</span></span>
                    </div>
                  )}
                </div>

                {/* Action */}
                <div style={{
                  display: "flex", flexDirection: "column", justifyContent: "center", gap: 8, padding: "0 20px",
                  borderLeft: "1px solid #1a1a1a",
                }}>
                  {o.status === "Pending" || o.status === "Confirmed" ? (
                    <button onClick={() => handleStartProcessing(o.id)} className="dash-btn-primary" style={{ whiteSpace: "nowrap" }}>
                      Start Processing <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button onClick={() => setSelectingPrinterForOrder(o.id)} className="dash-btn-secondary" style={{ whiteSpace: "nowrap", borderColor: "var(--accent)", color: "var(--accent)" }}>
                      <Printer size={14} style={{ marginRight: 6 }} /> Assign Printer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Select Printer Modal */}
      {selectingPrinterForOrder && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="dash-card" style={{ width: 500, maxWidth: "90vw", padding: 24, maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", color: "#fff", fontSize: "1.2rem", margin: 0 }}>Select Printer</h3>
              <button onClick={() => setSelectingPrinterForOrder(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><X size={18} /></button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {printers.length === 0 ? (
                <div style={{ color: "#888", textAlign: "center", padding: 20 }}>No printers found.</div>
              ) : printers.map(p => {
                const isIdle = p.status === "Idle";
                return (
                  <button 
                    key={p.id}
                    onClick={() => handleAssignPrinter(p.id, p.name)}
                    disabled={!isIdle}
                    className="dash-card"
                    style={{ 
                      padding: "16px", 
                      textAlign: "left", 
                      cursor: isIdle ? "pointer" : "not-allowed",
                      borderColor: isIdle ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
                      opacity: isIdle ? 1 : 0.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fff" }}>{p.name}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#888" }}>{p.type}</div>
                    </div>
                    <span className={`dash-badge ${isIdle ? "dash-badge-green" : "dash-badge-red"}`}>
                      {p.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

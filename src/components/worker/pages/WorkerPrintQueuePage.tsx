import { ListOrdered, Clock, Package, ArrowRight, Loader } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/services/orders.service";

function formatDate(ts: any): string {
  if (!ts) return "—";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) + " " + date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function WorkerPrintQueuePage() {
  const { orders, loading } = useOrders();
  const queue = orders.filter((o) => o.status === "Pending" || o.status === "Confirmed");

  const handleStart = async (docId: string) => {
    try { await updateOrderStatus(docId, "Processing"); }
    catch { alert("Failed to update status."); }
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
                      <span className={`dash-badge ${o.status === "Confirmed" ? "dash-badge-blue" : "dash-badge-yellow"}`} style={{ marginLeft: 8, fontSize: "0.5rem" }}>
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
                  display: "flex", alignItems: "center", padding: "0 20px",
                  borderLeft: "1px solid #1a1a1a",
                }}>
                  <button onClick={() => handleStart(o.id)} className="dash-btn-primary" style={{ whiteSpace: "nowrap" }}>
                    Start Processing <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

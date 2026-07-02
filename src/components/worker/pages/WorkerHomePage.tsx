import { useState } from "react";
import {
  ClipboardList, Loader, CheckCircle2, AlertCircle, TrendingUp,
  ArrowRight, Thermometer, Package, ChevronRight,
} from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { updateOrderStatus } from "@/services/orders.service";
import type { OrderStatus } from "@/types/firebase.types";

import { usePrinters } from "@/hooks/usePrinters";
import { useMaterials } from "@/hooks/useMaterials";

export default function WorkerHomePage() {
  const { userProfile } = useAuth();
  const { orders: assignedOrders } = useOrders();
  const { printers } = usePrinters();
  const { materials } = useMaterials();
  const [taskTab, setTaskTab] = useState("All");

  // Dynamic Data
  const shiftStart = userProfile?.shift?.start || "09:00 AM";
  const shiftEnd = userProfile?.shift?.end || "06:00 PM";
  const todaySchedule = [
    { time: shiftStart, label: "Shift Start" },
    { time: "11:00 AM", label: "Break" },
    { time: "01:00 PM", label: "Lunch Break" },
    { time: shiftEnd, label: "Shift End" },
  ];


  // Compute real stats from assigned orders
  const totalTasks = assignedOrders.length;
  const pendingTasks = assignedOrders.filter((o) => o.status === "Pending" || o.status === "Confirmed").length;
  const inProgressOrders = assignedOrders.filter((o) => o.status === "Processing" || o.status === "Printing");
  const inProgressTasks = inProgressOrders.length;
  const completedOrders = assignedOrders.filter((o) => o.status === "Delivered" || o.status === "Shipped");
  const completedTasks = completedOrders.length;

  // Dynamic IN_PROGRESS data
  const IN_PROGRESS = inProgressOrders.map(o => ({
    id: o.orderNumber,
    name: o.items?.[0]?.designName || "Custom Design",
    printer: "—", // This would normally map to actual printer assignments
    material: "—",
    layer: "—",
    progress: o.status === "Printing" ? 50 : 20,
    timeLeft: "—"
  }));

  // Dynamic COMPLETED data
  const COMPLETED = completedOrders.map(o => {
    const time = o.updatedAt ? (o.updatedAt as any).toDate?.() : new Date();
    return {
      id: o.orderNumber,
      name: o.items?.[0]?.designName || "Custom Design",
      emoji: "📦",
      time: time ? (time as Date).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "—"
    };
  }).slice(0, 5);

  // Dynamic NOTIFICATIONS data (simulate based on recent assignments)
  const NOTIFICATIONS = assignedOrders.slice(0, 5).map(o => ({
    icon: <Package size={14} />,
    text: `Order #${o.orderNumber} is currently ${o.status}.`,
    time: "Recently",
    color: o.status === "Pending" ? "#EF4444" : o.status === "Delivered" ? "#10B981" : "#00E5FF"
  }));

  const STATS = [
    { label: "Total Tasks", value: String(totalTasks), sub: `${pendingTasks} Pending • ${completedTasks} Completed`, icon: <ClipboardList size={18} />, color: "var(--accent)" },
    { label: "In Progress", value: String(inProgressTasks), sub: "Assigned to you", icon: <Loader size={18} />, color: "#EAB308" },
    { label: "Completed", value: String(completedTasks), sub: "Real-time data", icon: <CheckCircle2 size={18} />, color: "#10B981" },
    { label: "Pending", value: String(pendingTasks), sub: "Requires your attention", icon: <AlertCircle size={18} />, color: "#EF4444" },
    { label: "Status", value: userProfile?.status || "Online", sub: "Your status", icon: <TrendingUp size={18} />, color: "#10B981" },
  ];

  // Build tasks from real orders
  const TASKS = assignedOrders.map((o) => ({
    id: o.orderNumber,
    docId: o.id,
    task: o.status,
    design: o.items?.[0]?.designName || "Custom Design",
    emoji: "📦",
    printer: "—",
    due: "—",
    status: o.status,
  }));

  const handleUpdateStatus = async (docId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(docId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status.");
    }
  };

  const getTaskActions = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return [{ label: "Confirm", nextStatus: "Confirmed" as OrderStatus, tone: "primary" }];
      case "Confirmed":
        return [{ label: "Start Prep", nextStatus: "Processing" as OrderStatus, tone: "primary" }];
      case "Processing":
        return [{ label: "Start Print", nextStatus: "Printing" as OrderStatus, tone: "primary" }];
      case "Printing":
        return [{ label: "Finish Print", nextStatus: "Post Processing" as OrderStatus, tone: "primary" }];
      case "Post Processing":
        return [{ label: "Ship", nextStatus: "Shipped" as OrderStatus, tone: "primary" }];
      case "Shipped":
        return [{ label: "Deliver", nextStatus: "Delivered" as OrderStatus, tone: "primary" }];
      default:
        return [];
    }
  };

  const visibleTasks = TASKS.filter((task) => {
    if (taskTab === "All") return true;
    if (taskTab === "Pending") return task.status === "Pending" || task.status === "Confirmed";
    if (taskTab === "In") return task.status === "Processing" || task.status === "Printing" || task.status === "Post Processing";
    if (taskTab === "Completed") return task.status === "Delivered" || task.status === "Shipped";
    return true;
  });

  const tabs = [`All (${totalTasks})`, `Pending (${pendingTasks})`, `In Progress (${inProgressTasks})`, `Completed (${completedTasks})`];

  return (
    <div className="dashboard-page">
      {/* ── Stat Cards Row ───────────────────────────────── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12, marginBottom: 24,
      }}>
        {STATS.map((s, i) => (
          <div key={i} className="dash-card" style={{ padding: "18px 20px", borderColor: `${s.color}15` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${s.color}12`, display: "flex", alignItems: "center",
                justifyContent: "center", color: s.color,
              }}>{s.icon}</div>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.8rem", color: "#fff", lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: s.color, marginTop: 6 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid: Tasks + In Progress + Notifications ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px 280px", gap: 16, marginBottom: 24 }}>
        {/* Today's Tasks Table */}
        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Today's Tasks
            </h3>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "12px 20px 0", borderBottom: "1px solid #1a1a1a" }}>
            {tabs.map((t) => {
              const isActive = taskTab === t.split(" ")[0] || (taskTab === "All" && t.startsWith("All"));
              return (
                <button key={t} onClick={() => setTaskTab(t.split(" ")[0])}
                  style={{
                    padding: "8px 14px", background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: isActive ? "var(--accent)" : "#555",
                    borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                    transition: "all 0.2s", textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{t}</button>
              );
            })}
          </div>
          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>
              <thead>
                <tr>
                  {["Order ID", "Task", "Design", "Printer", "Due Time", "Status", "Actions"].map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "10px 16px", color: "#444", borderBottom: "1px solid #1a1a1a",
                      fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleTasks.map((t) => {
                  const actions = getTaskActions(t.status as OrderStatus);
                  const canCancel = !["Cancelled", "Delivered", "Shipped"].includes(t.status);
                  return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #111" }}>
                    <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 600 }}>#{t.id}</td>
                    <td style={{ padding: "12px 16px", color: "#ccc" }}>{t.task}</td>
                    <td style={{ padding: "12px 16px", color: "#ccc" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "1rem" }}>{t.emoji}</span> {t.design}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>{t.printer}</td>
                    <td style={{ padding: "12px 16px", color: "#888" }}>{t.due}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={`dash-badge ${t.status === "Processing" || t.status === "Printing" ? "dash-badge-accent" : "dash-badge-yellow"}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 170 }}>
                        {actions.map((action) => (
                          <button
                            key={action.nextStatus}
                            onClick={() => handleUpdateStatus(t.docId, action.nextStatus)}
                            className="dash-btn-primary dash-btn-small"
                            style={{ padding: "5px 10px", fontSize: "0.6rem" }}
                          >
                            {action.label}
                          </button>
                        ))}
                        {canCancel && (
                          <button
                            onClick={() => handleUpdateStatus(t.docId, "Cancelled")}
                            className="dash-btn-secondary dash-btn-small"
                            style={{ padding: "5px 10px", fontSize: "0.6rem", color: "#EF4444", borderColor: "rgba(239,68,68,0.35)" }}
                          >
                            Cancel
                          </button>
                        )}
                        {actions.length === 0 && !canCancel && (
                          <span style={{ color: "#555", fontSize: "0.6rem" }}>No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 20px", textAlign: "center" }}>
            <button style={{
              background: "none", border: "none", color: "var(--accent)",
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>View All Tasks <ArrowRight size={12} /></button>
          </div>
        </div>

        {/* Currently In Progress */}
        <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Currently In Progress
            </h3>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
          </div>

          {IN_PROGRESS.length > 0 ? (
            <>
              {/* Featured item */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #111" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "var(--accent)" }}>#{IN_PROGRESS[0].id}</span>
                </div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "#fff", marginBottom: 4 }}>
                  {IN_PROGRESS[0].name}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", marginBottom: 12 }}>
                  <span>Printer: <span style={{ color: "#ccc" }}>{IN_PROGRESS[0].printer}</span></span>
                  <span>Material: <span style={{ color: "#ccc" }}>{IN_PROGRESS[0].material}</span></span>
                  <span>Layer: <span style={{ color: "#ccc" }}>{IN_PROGRESS[0].layer}</span></span>
                  <span>Time Left: <span style={{ color: "var(--accent)" }}>{IN_PROGRESS[0].timeLeft}</span></span>
                </div>
                {/* Progress bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 6, background: "#1a1a1a", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${IN_PROGRESS[0].progress}%`, height: "100%", background: "var(--accent)", borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "var(--accent)" }}>
                    {IN_PROGRESS[0].progress}%
                  </span>
                </div>
              </div>

              {/* Other items */}
              {inProgressOrders.slice(1).map((item) => (
                <div key={item.id} style={{ padding: "12px 20px", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "var(--accent)" }}>#{item.orderNumber}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>{item.assignedPrinterName || "—"}</span>
                    </div>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#ccc", margin: "4px 0" }}>
                      {item.items?.[0]?.designName || "Custom Design"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 4, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${item.printProgress || 0}%`, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#888" }}>{item.printProgress || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "#555", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
              No items currently in progress.
            </div>
          )}
      </div>

      {/* Notifications */}
      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
            Notifications
          </h3>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
        </div>
        {NOTIFICATIONS.length > 0 ? (
          NOTIFICATIONS.map((n, i) => (
            <div key={i} style={{
              padding: "12px 20px", borderBottom: "1px solid #111",
              display: "flex", gap: 10, alignItems: "flex-start",
            }}>
              <div style={{ color: n.color, marginTop: 2, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#ccc", lineHeight: 1.5 }}>
                  {n.text}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#444", marginTop: 4 }}>
                  {n.time}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "20px", textAlign: "center", color: "#555", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
            No recent notifications.
          </div>
        )}
      </div>
    </div>

      {/* ── Bottom Grid: Schedule + Completed + Printers ──── */ }
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
    {/* My Schedule */}
    <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
        <div>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
            My Schedule
          </h3>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>20 May 2024 — Tuesday</span>
        </div>
      </div>
      <div style={{ padding: "12px 20px" }}>
        {todaySchedule.map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, position: "relative",
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: i === 0 || i === todaySchedule.length - 1 ? "var(--accent)" : "#333",
              marginTop: 4, flexShrink: 0, position: "relative", zIndex: 2,
            }} />
            {i < todaySchedule.length - 1 && (
              <div style={{ position: "absolute", left: 3.5, top: 14, width: 1, height: 20, background: "#222" }} />
            )}
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)" }}>{s.time}</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#ccc" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 20px 16px", textAlign: "center" }}>
        <button style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
          View Full Schedule <ArrowRight size={12} />
        </button>
      </div>
    </div>

    {/* Recently Completed */}
    <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
          Recently Completed
        </h3>
      </div>
      {COMPLETED.map((c) => (
        <div key={c.id} style={{
          padding: "12px 20px", borderBottom: "1px solid #111",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: "1.2rem" }}>{c.emoji}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)" }}>#{c.id}</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#ccc" }}>{c.name}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555" }}>Completed at</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#ccc" }}>{c.time}</div>
          </div>
          <span className="dash-badge dash-badge-green" style={{ fontSize: "0.5rem" }}>
            <CheckCircle2 size={8} /> Completed
          </span>
        </div>
      ))}
    </div>

    {/* Active Printers */}
    <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
        <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
          Active Printers
        </h3>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
      </div>
      {printers.slice(0, 4).map((p) => (
        <div key={p.id} style={{
          padding: "12px 20px", borderBottom: "1px solid #111",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>{p.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>{p.type}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            {p.currentTemp && p.currentTemp !== "—" && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#888" }}>
                <Thermometer size={10} /> {p.currentTemp}
              </span>
            )}
            <span className={`dash-badge ${p.status === "Printing" ? "dash-badge-green" : p.status === "Idle" ? "dash-badge-blue" : "dash-badge-red"}`}
              style={{ fontSize: "0.5rem" }}>
              {p.status}
            </span>
          </div>
        </div>
      ))}
      <div style={{ padding: "12px 20px", textAlign: "center" }}>
        <button style={{ background: "none", border: "none", color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", cursor: "pointer" }}>
          Printer Management <ChevronRight size={12} />
        </button>
      </div>
    </div>
  </div>

  {/* ── Materials Status ─────────────────────────────── */ }
  <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
    <div style={{ padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a" }}>
      <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
        Materials Status
      </h3>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--accent)", cursor: "pointer" }}>View All</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 0 }}>
      {materials.slice(0, 5).map((m) => {
        const pct = Math.min(100, Math.round((m.stock / 10) * 100)); // Assuming 10 is max capacity for percentage display
        return (
          <div key={m.id} style={{ padding: "14px 20px", borderRight: "1px solid #111", borderBottom: "1px solid #111", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: pct > 40 ? "var(--accent)" : pct > 25 ? "#EAB308" : "#EF4444" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#ccc" }}>{m.name}</div>
            </div>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#888" }}>{m.stock} {m.unit}</span>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: pct > 40 ? "#ccc" : pct > 25 ? "#EAB308" : "#EF4444", width: 36, textAlign: "right" }}>
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
    <div style={{ padding: "12px 20px", textAlign: "right" }}>
      <button className="dash-btn-primary dash-btn-small">Request Material</button>
    </div>
  </div>
    </div >
  );
}

import {
  LayoutDashboard, ClipboardList, ListOrdered, Loader, CheckCircle2,
  Package, Palette, Boxes, Printer, Wrench as WrenchIcon,
  User, CalendarClock, HelpCircle, LogOut, X
} from "lucide-react";

export type WorkerPage =
  | "dashboard" | "tasks" | "print-queue" | "in-progress" | "completed"
  | "orders" | "designs" | "materials"
  | "printers" | "maintenance"
  | "profile" | "schedule" | "support";

interface WorkerSidebarProps {
  activePage: WorkerPage;
  onNavigate: (page: WorkerPage) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const WORK_ITEMS: { page: WorkerPage; label: string; icon: React.ReactNode }[] = [
  { page: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { page: "tasks", label: "My Tasks", icon: <ClipboardList size={18} /> },
  { page: "print-queue", label: "Print Queue", icon: <ListOrdered size={18} /> },
  { page: "in-progress", label: "In Progress", icon: <Loader size={18} /> },
  { page: "completed", label: "Completed", icon: <CheckCircle2 size={18} /> },
];

const MANAGE_ITEMS: { page: WorkerPage; label: string; icon: React.ReactNode }[] = [
  { page: "orders", label: "Orders", icon: <Package size={18} /> },
  { page: "designs", label: "Designs", icon: <Palette size={18} /> },
  { page: "materials", label: "Materials", icon: <Boxes size={18} /> },
];

const TOOL_ITEMS: { page: WorkerPage; label: string; icon: React.ReactNode }[] = [
  { page: "printers", label: "Printers", icon: <Printer size={18} /> },
  { page: "maintenance", label: "Maintenance", icon: <WrenchIcon size={18} /> },
];

const ACCOUNT_ITEMS: { page: WorkerPage; label: string; icon: React.ReactNode }[] = [
  { page: "profile", label: "Profile", icon: <User size={18} /> },
  { page: "schedule", label: "Shift & Schedule", icon: <CalendarClock size={18} /> },
  { page: "support", label: "Support", icon: <HelpCircle size={18} /> },
];

export default function WorkerSidebar({ activePage, onNavigate, isOpen, onClose, onLogout }: WorkerSidebarProps) {
  const nav = (page: WorkerPage) => { onNavigate(page); onClose(); };

  const renderSection = (label: string, items: { page: WorkerPage; label: string; icon: React.ReactNode }[]) => (
    <>
      <div className="dashboard-sidebar-section-label">{label}</div>
      {items.map((item) => (
        <button
          key={item.page}
          className={`dashboard-sidebar-link ${activePage === item.page ? "active" : ""}`}
          onClick={() => nav(item.page)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </>
  );

  return (
    <>
      <div className={`dashboard-sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="dashboard-sidebar-logo">
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
              <span style={{ color: "var(--accent)" }}>UNIQUE</span>
              <span style={{ color: "#fff" }}>3D</span>
              <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
            </h1>
          </div>
          <button className="dashboard-mobile-toggle" onClick={onClose} style={{ padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <nav className="dashboard-sidebar-nav">
          {renderSection("Work", WORK_ITEMS)}
          {renderSection("Manage", MANAGE_ITEMS)}
          {renderSection("Tools", TOOL_ITEMS)}
          {renderSection("Account", ACCOUNT_ITEMS)}
        </nav>

        {/* Worker info footer */}
        <div className="dashboard-sidebar-footer" style={{ padding: "16px 14px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #FF8A3D)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#000",
              border: "2px solid #222",
            }}>RV</div>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#ccc" }}>
                Rahul Verma
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#10B981" }}>Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              width: "100%", padding: "9px 0", background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8,
              color: "#EF4444", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
              fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8, transition: "all 0.2s",
            }}
          >
            <LogOut size={14} /> End Shift
          </button>
        </div>
      </aside>
    </>
  );
}

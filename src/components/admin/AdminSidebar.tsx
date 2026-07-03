import {
  LayoutDashboard, Package, Users, Palette, UploadCloud, Grid3X3, ShoppingBag,
  FileText, CreditCard, Percent, Ticket,
  UserCog, Shield, Settings, Globe,
  BarChart3, PieChart, LogOut, X, ChevronRight,
} from "lucide-react";

export type AdminPage =
  | "dashboard" | "orders" | "customers" | "designs" | "upload-designs" | "categories" | "products"
  | "materials" | "printers"
  | "quotes" | "payments" | "discounts" | "coupons"
  | "users" | "roles" | "settings" | "website-settings"
  | "reports" | "analytics";

interface AdminSidebarProps {
  activePage: AdminPage;
  onNavigate: (page: AdminPage) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MANAGE: { page: AdminPage; label: string; icon: React.ReactNode }[] = [
  { page: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { page: "orders", label: "Orders", icon: <Package size={18} /> },
  { page: "customers", label: "Customers", icon: <Users size={18} /> },
  { page: "designs", label: "Designs", icon: <Palette size={18} /> },
  { page: "upload-designs", label: "Upload Designs", icon: <UploadCloud size={18} /> },
  { page: "categories", label: "Categories", icon: <Grid3X3 size={18} /> },
  { page: "products", label: "Products", icon: <ShoppingBag size={18} /> },
  { page: "materials", label: "Materials", icon: <Palette size={18} /> },
  { page: "printers", label: "Printers", icon: <Grid3X3 size={18} /> },
];

const BUSINESS: { page: AdminPage; label: string; icon: React.ReactNode }[] = [
  { page: "quotes", label: "Quotes", icon: <FileText size={18} /> },
  { page: "payments", label: "Payments", icon: <CreditCard size={18} /> },
  { page: "discounts", label: "Discounts", icon: <Percent size={18} /> },
  { page: "coupons", label: "Coupons", icon: <Ticket size={18} /> },
];

const SETTINGS_ITEMS: { page: AdminPage; label: string; icon: React.ReactNode }[] = [
  { page: "users", label: "Users", icon: <UserCog size={18} /> },
  { page: "roles", label: "Roles & Permissions", icon: <Shield size={18} /> },
  { page: "settings", label: "Settings", icon: <Settings size={18} /> },
  { page: "website-settings", label: "Website Settings", icon: <Globe size={18} /> },
];

const REPORTS: { page: AdminPage; label: string; icon: React.ReactNode }[] = [
  { page: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
  { page: "analytics", label: "Analytics", icon: <PieChart size={18} /> },
];

export default function AdminSidebar({ activePage, onNavigate, isOpen, onClose, onLogout }: AdminSidebarProps) {
  const nav = (page: AdminPage) => { onNavigate(page); onClose(); };

  const renderSection = (label: string, items: { page: AdminPage; label: string; icon: React.ReactNode }[]) => (
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
          {item.page === "reports" && <ChevronRight size={12} style={{ marginLeft: "auto", color: "#444" }} />}
        </button>
      ))}
    </>
  );

  return (
    <>
      <div className={`dashboard-sidebar-overlay ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
        <div className="dashboard-sidebar-logo">
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>
              <span style={{ color: "var(--accent)" }}>UNIQUE</span>
              <span style={{ color: "#fff" }}>3D</span>
              <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
            </h1>
          </div>
          <button className="dashboard-mobile-toggle" onClick={onClose} style={{ padding: 4 }}><X size={18} /></button>
        </div>

        <nav className="dashboard-sidebar-nav">
          {renderSection("Manage", MANAGE)}
          {renderSection("Business", BUSINESS)}
          {renderSection("Settings", SETTINGS_ITEMS)}
          {renderSection("Reports", REPORTS)}
        </nav>

        <div className="dashboard-sidebar-footer" style={{ padding: "16px 14px" }}>
          <div style={{
            padding: "14px", background: "rgba(var(--accent-rgb), 0.04)", border: "1px solid rgba(var(--accent-rgb), 0.1)",
            borderRadius: 10, marginBottom: 12,
          }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>Need Help?</div>
            <button
              onClick={() => window.open(`https://wa.me/918466800143?text=${encodeURIComponent("Hi, I need help with the Unique3DPrinters admin dashboard.")}`, "_blank", "noopener,noreferrer")}
              style={{
                background: "none", border: "none", color: "var(--accent)", fontFamily: "'DM Mono', monospace",
                fontSize: "0.65rem", cursor: "pointer", padding: 0, marginTop: 4,
              }}>Contact Support</button>
          </div>
          <button
            onClick={onLogout}
            className="dashboard-sidebar-link" style={{ color: "#EF4444" }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

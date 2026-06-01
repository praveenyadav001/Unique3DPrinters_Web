import {
  Home,
  Palette,
  UploadCloud,
  Grid3X3,
  ShoppingCart,
  Package,
  User,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

export type DashboardPage =
  | "home"
  | "design"
  | "upload"
  | "our-designs"
  | "customize"
  | "cart"
  | "orders"
  | "profile"
  | "settings";

interface SidebarProps {
  activePage: DashboardPage;
  onNavigate: (page: DashboardPage) => void;
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

const NAV_ITEMS: { page: DashboardPage; label: string; icon: React.ReactNode }[] = [
  { page: "home", label: "Home", icon: <Home size={18} /> },
  { page: "design", label: "Design", icon: <Palette size={18} /> },
  { page: "upload", label: "Upload Design", icon: <UploadCloud size={18} /> },
  { page: "our-designs", label: "Our Designs", icon: <Grid3X3 size={18} /> },
  { page: "orders", label: "Orders", icon: <Package size={18} /> },
];

const ACCOUNT_ITEMS: { page: DashboardPage; label: string; icon: React.ReactNode }[] = [
  { page: "profile", label: "Profile", icon: <User size={18} /> },
  { page: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose, cartCount = 0 }: SidebarProps) {
  const handleNav = (page: DashboardPage) => {
    onNavigate(page);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`dashboard-sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`dashboard-sidebar ${isOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="dashboard-sidebar-logo">
          <div style={{ flex: 1 }}>
            <h1>
              <span style={{ color: "var(--accent)" }}>UNIQUE</span>
              <span style={{ color: "#fff" }}>3D</span>
              <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
            </h1>
          </div>
          <button
            className="dashboard-mobile-toggle"
            onClick={onClose}
            style={{ padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="dashboard-sidebar-nav">
          <div className="dashboard-sidebar-section-label">Main Menu</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.page}
              className={`dashboard-sidebar-link ${activePage === item.page ? "active" : ""}`}
              onClick={() => handleNav(item.page)}
            >
              {item.icon}
              {item.label}
              {item.page === "our-designs" && (
                <span
                  className="dash-badge dash-badge-accent"
                  style={{ marginLeft: "auto", padding: "2px 6px", fontSize: "0.5rem" }}
                >
                  <Sparkles size={8} /> New
                </span>
              )}
            </button>
          ))}

          {/* Cart with badge */}
          <button
            className={`dashboard-sidebar-link ${activePage === "cart" ? "active" : ""}`}
            onClick={() => handleNav("cart")}
          >
            <ShoppingCart size={18} />
            Cart
            {cartCount > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  background: "var(--accent)",
                  color: "#000",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.7rem",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          <div className="dashboard-sidebar-section-label" style={{ marginTop: 12 }}>
            Account
          </div>
          {ACCOUNT_ITEMS.map((item) => (
            <button
              key={item.page}
              className={`dashboard-sidebar-link ${activePage === item.page ? "active" : ""}`}
              onClick={() => handleNav(item.page)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer - Logout */}
        <div className="dashboard-sidebar-footer">
          <button
            className="dashboard-sidebar-link"
            style={{ color: "#EF4444" }}
            onClick={() => alert("Logout clicked")}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

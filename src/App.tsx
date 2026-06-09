import { useState, useCallback, useEffect } from "react";
import "./App.css";
import "./dashboard.css";
import "./landing.css";

// ─── Auth ────────────────────────────────────────────────────
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import LoginPage from "@/components/auth/LoginPage";
import SignupPage from "@/components/auth/SignupPage";

// ─── Landing ─────────────────────────────────────────────────
import LandingPage from "@/components/landing/LandingPage";

// ─── Customer Dashboard ──────────────────────────────────────
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import type { DashboardPage } from "@/components/dashboard/Sidebar";
import HomePage from "@/components/dashboard/pages/HomePage";
import DesignPage from "@/components/dashboard/pages/DesignPage";
import UploadDesignPage from "@/components/dashboard/pages/UploadDesignPage";
import OurDesignsPage from "@/components/dashboard/pages/OurDesignsPage";
import CustomizeDesignPage from "@/components/dashboard/pages/CustomizeDesignPage";
import CartPage from "@/components/dashboard/pages/CartPage";
import OrderTrackingPage from "@/components/dashboard/pages/OrderTrackingPage";
import ProfilePage from "@/components/dashboard/pages/ProfilePage";
import SettingsPage from "@/components/dashboard/pages/SettingsPage";

// ─── Worker Dashboard ────────────────────────────────────────
import WorkerSidebar from "@/components/worker/WorkerSidebar";
import WorkerTopBar from "@/components/worker/WorkerTopBar";
import type { WorkerPage } from "@/components/worker/WorkerSidebar";
import WorkerHomePage from "@/components/worker/pages/WorkerHomePage";
import WorkerTasksPage from "@/components/worker/pages/WorkerTasksPage";
import WorkerPrintQueuePage from "@/components/worker/pages/WorkerPrintQueuePage";
import WorkerInProgressPage from "@/components/worker/pages/WorkerInProgressPage";
import WorkerCompletedPage from "@/components/worker/pages/WorkerCompletedPage";
import WorkerDesignsPage from "@/components/worker/pages/WorkerDesignsPage";
import WorkerMaterialsPage from "@/components/worker/pages/WorkerMaterialsPage";
import WorkerPrintersPage from "@/components/worker/pages/WorkerPrintersPage";
import WorkerMaintenancePage from "@/components/worker/pages/WorkerMaintenancePage";
import WorkerProfilePage from "@/components/worker/pages/WorkerProfilePage";
import WorkerSchedulePage from "@/components/worker/pages/WorkerSchedulePage";
import WorkerSupportPage from "@/components/worker/pages/WorkerSupportPage";

// ─── Admin Dashboard ─────────────────────────────────────────
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import type { AdminPage } from "@/components/admin/AdminSidebar";
import AdminHomePage from "@/components/admin/pages/AdminHomePage";
import AdminOrdersPage from "@/components/admin/pages/AdminOrdersPage";
import AdminCustomersPage from "@/components/admin/pages/AdminCustomersPage";
import AdminDesignsPage from "@/components/admin/pages/AdminDesignsPage";
import AdminProductsPage from "@/components/admin/pages/AdminProductsPage";
import AdminCategoriesPage from "@/components/admin/pages/AdminCategoriesPage";
import AdminUsersPage from "@/components/admin/pages/AdminUsersPage";
import AdminReportsPage from "@/components/admin/pages/AdminReportsPage";
import AdminMaterialsPage from "@/components/admin/pages/AdminMaterialsPage";
import AdminPrintersPage from "@/components/admin/pages/AdminPrintersPage";

// ─── Splash Screen ──────────────────────────────────────────
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(() => onComplete(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);
  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-logo" style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "0.08em" }}>
          <span style={{ color: "var(--accent)" }}>UNIQUE</span>
          <span style={{ color: "#fff" }}>3D</span>
          <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 }}>
          Loading...
        </div>
      </div>
      <div className="splash-bar-track">
        <div className="splash-bar-fill" />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Customer Dashboard
// ──────────────────────────────────────────────────────────────
function CustomerDashboard({ onLogout }: { onLogout: () => void }) {
  const { userProfile } = useAuth();
  const [activePage, setActivePage] = useState<DashboardPage>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: DashboardPage) => { setActivePage(page); setSidebarOpen(false); window.scrollTo({ top: 0 }); };

  const renderPage = () => {
    switch (activePage) {
      case "home": return <HomePage onNavigate={handleNavigate} />;
      case "design": return <DesignPage onNavigate={handleNavigate} />;
      case "upload": return <UploadDesignPage />;
      case "our-designs": return <OurDesignsPage onNavigate={handleNavigate} />;
      case "customize": return <CustomizeDesignPage onNavigate={handleNavigate} />;
      case "cart": return <CartPage onNavigate={handleNavigate} />;
      case "orders": return <OrderTrackingPage />;
      case "profile": return <ProfilePage />;
      case "settings": return <SettingsPage />;
      default: return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <main className="dashboard-main">
        <TopBar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          userName={userProfile?.displayName || "User"}
          userInitials={userProfile ? `${userProfile.firstName?.[0] || ""}${userProfile.lastName?.[0] || ""}` : "U"}
        />
        <div key={activePage}>{renderPage()}</div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Worker Dashboard
// ──────────────────────────────────────────────────────────────
function WorkerDashboard({ onLogout }: { onLogout: () => void }) {
  const [activePage, setActivePage] = useState<WorkerPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: WorkerPage) => { setActivePage(page); setSidebarOpen(false); window.scrollTo({ top: 0 }); };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <WorkerHomePage />;
      case "tasks": return <WorkerTasksPage />;
      case "print-queue": return <WorkerPrintQueuePage />;
      case "in-progress": return <WorkerInProgressPage />;
      case "completed": return <WorkerCompletedPage />;
      case "designs": return <WorkerDesignsPage />;
      case "materials": return <WorkerMaterialsPage />;
      case "printers": return <WorkerPrintersPage />;
      case "maintenance": return <WorkerMaintenancePage />;
      case "profile": return <WorkerProfilePage />;
      case "schedule": return <WorkerSchedulePage />;
      case "support": return <WorkerSupportPage />;
      default: return (
        <div className="dashboard-page">
          <div className="dashboard-page-header">
            <h2>{activePage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h2>
            <p>This section is under development.</p>
          </div>
          <div className="dash-card" style={{ padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#333", marginBottom: 8 }}>
              🚧 Coming Soon
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444" }}>
              This page is being built. Check back soon!
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-layout">
      <WorkerSidebar activePage={activePage} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <main className="dashboard-main">
        <WorkerTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div key={activePage}>{renderPage()}</div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Admin Dashboard
// ──────────────────────────────────────────────────────────────
function AdminDashboardView({ onLogout }: { onLogout: () => void }) {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigate = (page: AdminPage) => { setActivePage(page); setSidebarOpen(false); window.scrollTo({ top: 0 }); };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <AdminHomePage onNavigate={handleNavigate} />;
      case "orders": return <AdminOrdersPage />;
      case "customers": return <AdminCustomersPage />;
      case "designs": return <AdminDesignsPage />;
      case "products": return <AdminProductsPage />;
      case "categories": return <AdminCategoriesPage />;
      case "materials": return <AdminMaterialsPage />;
      case "printers": return <AdminPrintersPage />;
      case "users": return <AdminUsersPage />;
      case "reports": return <AdminReportsPage />;
      default: return (
        <div className="dashboard-page">
          <div className="dashboard-page-header">
            <h2>{activePage.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h2>
            <p>This section is under development.</p>
          </div>
          <div className="dash-card" style={{ padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#333", marginBottom: 8 }}>
              🚧 Coming Soon
            </div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444" }}>
              This page is being built. Check back soon!
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="dashboard-layout">
      <AdminSidebar activePage={activePage} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onLogout={onLogout} />
      <main className="dashboard-main">
        <AdminTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div key={activePage}>{renderPage()}</div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// App Router (Auth-Driven)
// ──────────────────────────────────────────────────────────────
type AuthView = "landing" | "login" | "signup";

function AppRouter() {
  const { user, role, loading, logout } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("landing");
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  const handleLogout = async () => {
    await logout();
    setAuthView("landing");
  };

  const handleGoToLogin = () => {
    setAuthView("login");
    window.scrollTo({ top: 0 });
  };

  const handleGoToSignup = () => {
    setAuthView("signup");
    window.scrollTo({ top: 0 });
  };

  const handleGoToLanding = () => {
    setAuthView("landing");
    window.scrollTo({ top: 0 });
  };

  // Show splash screen
  if (!splashDone) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Show loading while Firebase checks auth
  if (loading) {
    return (
      <div style={{
        background: "#0A0A0A", minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "3px solid #222",
            borderTopColor: "var(--accent)", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444" }}>
            Authenticating...
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If user is logged in, show their dashboard
  if (user && role) {
    switch (role) {
      case "customer": return <CustomerDashboard onLogout={handleLogout} />;
      case "worker": return <WorkerDashboard onLogout={handleLogout} />;
      case "admin": return <AdminDashboardView onLogout={handleLogout} />;
    }
  }

  // Not logged in — show landing / login / signup
  switch (authView) {
    case "landing":
      return <LandingPage onLoginClick={handleGoToLogin} />;
    case "login":
      return <LoginPage onGoToSignup={handleGoToSignup} onGoToLanding={handleGoToLanding} />;
    case "signup":
      return <SignupPage onGoToLogin={handleGoToLogin} onGoToLanding={handleGoToLanding} />;
    default:
      return <LandingPage onLoginClick={handleGoToLogin} />;
  }
}

// ──────────────────────────────────────────────────────────────
// Root App Component (wraps everything in AuthProvider)
// ──────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <AppRouter />
      </div>
    </AuthProvider>
  );
}

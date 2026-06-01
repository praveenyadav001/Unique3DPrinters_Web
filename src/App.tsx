import { useState, useCallback } from "react";
import "./App.css";
import "./dashboard.css";

// Dashboard Components
import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import type { DashboardPage } from "@/components/dashboard/Sidebar";

// Dashboard Pages
import HomePage from "@/components/dashboard/pages/HomePage";
import DesignPage from "@/components/dashboard/pages/DesignPage";
import UploadDesignPage from "@/components/dashboard/pages/UploadDesignPage";
import OurDesignsPage from "@/components/dashboard/pages/OurDesignsPage";
import CustomizeDesignPage from "@/components/dashboard/pages/CustomizeDesignPage";
import CartPage from "@/components/dashboard/pages/CartPage";
import OrderTrackingPage from "@/components/dashboard/pages/OrderTrackingPage";
import ProfilePage from "@/components/dashboard/pages/ProfilePage";
import SettingsPage from "@/components/dashboard/pages/SettingsPage";

import type { CartItem } from "@/components/dashboard/pages/UploadDesignPage";

// ─── Splash Screen Component ──────────────────────────────────────
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  useState(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(() => onComplete(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  });
  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-logo" style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "0.08em" }}>
          <span style={{ color: "var(--accent)" }}>UNIQUE</span>
          <span style={{ color: "#fff" }}>3D</span>
          <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 }}>
          Initializing Dashboard...
        </div>
      </div>
      <div className="splash-bar-track">
        <div className="splash-bar-fill" />
      </div>
    </div>
  );
}

export default function App() {
  // Splash Screen
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  // Navigation state
  const [activePage, setActivePage] = useState<DashboardPage>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleNavigate = (page: DashboardPage) => {
    setActivePage(page);
    setSidebarOpen(false);
    // Scroll to top on page change
    window.scrollTo({ top: 0 });
  };

  // Render the active page
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return (
          <HomePage
            onNavigate={handleNavigate}
            cartCount={cartItems.length}
            ordersCount={3}
          />
        );
      case "design":
        return <DesignPage onNavigate={handleNavigate} />;
      case "upload":
        return <UploadDesignPage onAddToCart={handleAddToCart} />;
      case "our-designs":
        return (
          <OurDesignsPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        );
      case "customize":
        return (
          <CustomizeDesignPage
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        );
      case "cart":
        return (
          <CartPage
            cartItems={cartItems}
            onUpdateCart={setCartItems}
            onNavigate={handleNavigate}
          />
        );
      case "orders":
        return <OrderTrackingPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return (
          <HomePage
            onNavigate={handleNavigate}
            cartCount={cartItems.length}
            ordersCount={3}
          />
        );
    }
  };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Splash Screen */}
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Dashboard Layout */}
      <div className="dashboard-layout">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          cartCount={cartItems.length}
        />

        {/* Main Content */}
        <main className="dashboard-main">
          <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          {/* Page Content - keyed to force re-render animation */}
          <div key={activePage}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

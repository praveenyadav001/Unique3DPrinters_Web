import {
  Palette,
  UploadCloud,
  Grid3X3,
  Package,
  ArrowRight,
  TrendingUp,
  Clock,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import type { DashboardPage } from "../Sidebar";

import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";

interface HomePageProps {
  onNavigate: (page: DashboardPage) => void;
}

const FEATURED_DESIGNS = [
  {
    id: 1,
    name: "Rocket Model",
    material: "PLA",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=400&q=80",
    price: "₹299",
  },
  {
    id: 2,
    name: "Gear Assembly",
    material: "ABS",
    image: "https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?auto=format&fit=crop&w=400&q=80",
    price: "₹499",
  },
  {
    id: 3,
    name: "Organic Sculpture",
    material: "Resin",
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=400&q=80",
    price: "₹349",
  },
  {
    id: 4,
    name: "Custom Keychain",
    material: "PETG",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
    price: "₹149",
  },
  {
    id: 5,
    name: "Drone Arm",
    material: "Carbon PLA",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80",
    price: "₹399",
  },
  {
    id: 6,
    name: "Jewelry Mold",
    material: "Castable Resin",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    price: "₹249",
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { cartCount } = useCart();
  const { orders } = useOrders();
  const { userProfile } = useAuth();
  
  const ordersCount = orders.length;
  
  return (
    <div className="dashboard-page">
      {/* Hero Banner */}
      <div
        className="dash-card dash-hero-animate"
        style={{
          padding: "40px 36px",
          marginBottom: 28,
          background: "linear-gradient(135deg, #111 0%, #0D0D0D 50%, rgba(var(--accent-rgb), 0.05) 100%)",
          borderColor: "rgba(var(--accent-rgb), 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(#161616 1px, transparent 1px), linear-gradient(90deg, #161616 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(var(--accent-rgb), 0.08)",
              border: "1px solid rgba(var(--accent-rgb), 0.2)",
              borderRadius: 999,
              padding: "5px 14px",
              marginBottom: 16,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
                animation: "pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                color: "var(--accent)",
                fontSize: "0.65rem",
                letterSpacing: "0.12em",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
              }}
            >
              Welcome Back{userProfile?.firstName ? `, ${userProfile.firstName}` : ""}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.2,
            }}
          >
            BRING YOUR IDEAS
            <br />
            <span style={{ color: "var(--accent)" }}>TO LIFE WITH 3D PRINTING</span>
          </h2>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              color: "#666",
              maxWidth: 480,
              margin: "0 0 24px",
              lineHeight: 1.6,
            }}
          >
            Design, customize, and order high quality 3D printed products easily.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="dash-btn-primary" onClick={() => onNavigate("design")}>
              Start Designing
            </button>
            <button className="dash-btn-secondary" onClick={() => onNavigate("upload")}>
              Upload Design
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className="dash-hero-animate dash-hero-animate-delay-1"
        style={{ marginBottom: 28 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#fff",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Quick Actions
          </h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          <div className="dash-quick-action" onClick={() => onNavigate("design")}>
            <div className="icon-wrap">
              <Palette size={20} />
            </div>
            <span className="label">Create Design</span>
            <span className="sublabel">Start from scratch</span>
          </div>
          <div className="dash-quick-action" onClick={() => onNavigate("upload")}>
            <div className="icon-wrap">
              <UploadCloud size={20} />
            </div>
            <span className="label">Upload STL File</span>
            <span className="sublabel">Upload and preview</span>
          </div>
          <div className="dash-quick-action" onClick={() => onNavigate("our-designs")}>
            <div className="icon-wrap">
              <Grid3X3 size={20} />
            </div>
            <span className="label">Browse Templates</span>
            <span className="sublabel">Explore our collection</span>
          </div>
          <div className="dash-quick-action" onClick={() => onNavigate("orders")}>
            <div className="icon-wrap">
              <Package size={20} />
            </div>
            <span className="label">Track Orders</span>
            <span className="sublabel">Check order status</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className="dash-hero-animate dash-hero-animate-delay-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <div className="dash-stat-mini">
          <div
            className="stat-icon"
            style={{ background: "rgba(var(--accent-rgb), 0.08)", color: "var(--accent)" }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">12</div>
            <div className="stat-label">Total Designs</div>
          </div>
        </div>
        <div className="dash-stat-mini">
          <div
            className="stat-icon"
            style={{ background: "rgba(0, 229, 255, 0.08)", color: "#00E5FF" }}
          >
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-value">{ordersCount}</div>
            <div className="stat-label">Active Orders</div>
          </div>
        </div>
        <div className="dash-stat-mini">
          <div
            className="stat-icon"
            style={{ background: "rgba(16, 185, 129, 0.08)", color: "#10B981" }}
          >
            <ShoppingCart size={20} />
          </div>
          <div>
            <div className="stat-value">{cartCount}</div>
            <div className="stat-label">Items in Cart</div>
          </div>
        </div>
        <div className="dash-stat-mini">
          <div
            className="stat-icon"
            style={{ background: "rgba(168, 85, 247, 0.08)", color: "#A855F7" }}
          >
            <Sparkles size={20} />
          </div>
          <div>
            <div className="stat-value">3</div>
            <div className="stat-label">Saved Templates</div>
          </div>
        </div>
      </div>

      {/* Featured Designs */}
      <div className="dash-hero-animate dash-hero-animate-delay-3">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#fff",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Featured Designs
          </h3>
          <button
            onClick={() => onNavigate("our-designs")}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            View all <ArrowRight size={12} />
          </button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          {FEATURED_DESIGNS.map((d) => (
            <div
              key={d.id}
              className="dash-featured-card"
              onClick={() => onNavigate("our-designs")}
            >
              <div style={{ overflow: "hidden", height: 140 }}>
                <img
                  src={d.image}
                  alt={d.name}
                  className="card-image"
                  style={{ height: 140, width: "100%" }}
                />
              </div>
              <div className="card-body">
                <div className="card-title">{d.name}</div>
                <div
                  className="card-meta"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{d.material}</span>
                  <span style={{ color: "var(--accent)", fontWeight: 600 }}>{d.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

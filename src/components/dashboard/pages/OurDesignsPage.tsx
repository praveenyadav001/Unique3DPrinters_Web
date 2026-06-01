import { useState } from "react";
import { Search } from "lucide-react";
import type { DashboardPage } from "../Sidebar";
import type { CartItem } from "./UploadDesignPage";

interface OurDesignsPageProps {
  onNavigate: (page: DashboardPage) => void;
  onAddToCart: (item: CartItem) => void;
}

const CATEGORIES = [
  "All Designs",
  "Flip Name",
  "Keychain",
  "Flower Design",
  "Letter Name",
  "Bike Number Plate",
  "Home Decor",
  "Toys & Models",
];

const DESIGNS = [
  { id: "d1", name: "Flip Name", category: "Flip Name", price: 299, emoji: "💫", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=300&q=80" },
  { id: "d2", name: "Keychain", category: "Keychain", price: 199, emoji: "🔑", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80" },
  { id: "d3", name: "Flower Design", category: "Flower Design", price: 249, emoji: "🌹", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80" },
  { id: "d4", name: "Letter Name", category: "Letter Name", price: 249, emoji: "🔤", image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=300&q=80" },
  { id: "d5", name: "Bike Number Plate", category: "Bike Number Plate", price: 349, emoji: "🏍️", image: "https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?auto=format&fit=crop&w=300&q=80" },
  { id: "d6", name: "Pen Holder", category: "Home Decor", price: 249, emoji: "🖊️", image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=300&q=80" },
  { id: "d7", name: "Miniature House", category: "Toys & Models", price: 499, emoji: "🏠", image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=300&q=80" },
  { id: "d8", name: "Animal Figurine", category: "Toys & Models", price: 399, emoji: "🦁", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=300&q=80" },
];

export default function OurDesignsPage({ onNavigate, onAddToCart }: OurDesignsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Designs");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDesigns = DESIGNS.filter((d) => {
    const matchesCategory = selectedCategory === "All Designs" || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCustomize = (_design: typeof DESIGNS[0]) => {
    // Navigate to customize page — in a real app, we'd pass the design data
    onNavigate("customize");
  };

  const handleAddToCart = (design: typeof DESIGNS[0]) => {
    onAddToCart({
      id: `design-${design.id}-${Date.now()}`,
      name: design.name,
      material: "PLA",
      color: "Black",
      quantity: 1,
      price: design.price,
      image: design.image,
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Our Customized Designs</h2>
        <p>Personalize it the way you like.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
        {/* Left - Categories */}
        <div>
          <div
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Categories
          </div>
          <div className="dash-category-list">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`dash-category-item ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right - Grid */}
        <div>
          {/* Search bar */}
          <div style={{ marginBottom: 20 }}>
            <div className="dashboard-topbar-search" style={{ maxWidth: 320 }}>
              <Search size={14} />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="dash-catalog-grid">
            {filteredDesigns.map((design) => (
              <div key={design.id} className="dash-catalog-item">
                <div
                  className="item-image"
                  style={{
                    backgroundImage: `url(${design.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span style={{ fontSize: "2.5rem", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>
                    {design.emoji}
                  </span>
                </div>
                <div className="item-info">
                  <div className="item-name">{design.name}</div>
                  <div className="item-price">₹{design.price}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button
                      className="item-customize-btn"
                      onClick={() => handleCustomize(design)}
                    >
                      Customize
                    </button>
                    <button
                      className="item-customize-btn"
                      style={{
                        background: "var(--accent)",
                        color: "#000",
                        borderColor: "var(--accent)",
                      }}
                      onClick={() => handleAddToCart(design)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredDesigns.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 48,
                color: "#444",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.8rem",
              }}
            >
              No designs found for "{searchQuery}" in {selectedCategory}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

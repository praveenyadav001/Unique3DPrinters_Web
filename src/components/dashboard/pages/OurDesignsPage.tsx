import { useState } from "react";
import { Search } from "lucide-react";
import type { DashboardPage } from "../Sidebar";
import { useDesigns } from "@/hooks/useDesigns";
import { useCart } from "@/hooks/useCart";

// Fallback designs for when Firestore is empty
const FALLBACK_DESIGNS = [
  { id: "d1", name: "Flip Name", category: "Flip Name", price: 299, emoji: "💫", imageURL: "" },
  { id: "d2", name: "Keychain", category: "Keychain", price: 199, emoji: "🔑", imageURL: "" },
  { id: "d3", name: "Flower Design", category: "Flower Design", price: 249, emoji: "🌹", imageURL: "" },
  { id: "d4", name: "Letter Name", category: "Letter Name", price: 249, emoji: "🔤", imageURL: "" },
  { id: "d5", name: "Bike Number Plate", category: "Bike Number Plate", price: 349, emoji: "🏍️", imageURL: "" },
  { id: "d6", name: "Pen Holder", category: "Home Decor", price: 249, emoji: "🖊️", imageURL: "" },
  { id: "d7", name: "Miniature House", category: "Toys & Models", price: 499, emoji: "🏠", imageURL: "" },
  { id: "d8", name: "Animal Figurine", category: "Toys & Models", price: 399, emoji: "🦁", imageURL: "" },
];

const CATEGORIES = [
  "All Designs", "Flip Name", "Keychain", "Flower Design",
  "Letter Name", "Bike Number Plate", "Home Decor", "Toys & Models",
];

interface OurDesignsPageProps {
  onNavigate: (page: DashboardPage) => void;
}

export default function OurDesignsPage({ onNavigate }: OurDesignsPageProps) {
  const { designs: firestoreDesigns, loading } = useDesigns();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All Designs");
  const [searchQuery, setSearchQuery] = useState("");

  // Use Firestore designs if available, otherwise fallback
  const designsToShow = firestoreDesigns.length > 0 ? firestoreDesigns : FALLBACK_DESIGNS;

  const filteredDesigns = designsToShow.filter((d) => {
    const matchesCategory = selectedCategory === "All Designs" || d.category === selectedCategory;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCustomize = () => {
    onNavigate("customize");
  };

  const handleAddToCart = async (design: typeof designsToShow[0]) => {
    await addItem({
      designId: design.id,
      name: design.name,
      material: "PLA",
      color: "Black",
      size: "100%",
      quantity: 1,
      price: design.price,
      imageURL: design.imageURL || "",
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Our Customized Designs</h2>
        <p>Personalize it the way you like.</p>
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: 40, color: "#555", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem" }}>
          Loading designs...
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
        {/* Left - Categories */}
        <div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
            Categories
          </div>
          <div className="dash-category-list">
            {CATEGORIES.map((cat) => (
              <button key={cat} className={`dash-category-item ${selectedCategory === cat ? "active" : ""}`} onClick={() => setSelectedCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Right - Grid */}
        <div>
          <div style={{ marginBottom: 20 }}>
            <div className="dashboard-topbar-search" style={{ maxWidth: 320 }}>
              <Search size={14} />
              <input type="text" placeholder="Search designs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>

          <div className="dash-catalog-grid">
            {filteredDesigns.map((design) => (
              <div key={design.id} className="dash-catalog-item">
                <div className="item-image" style={{
                  backgroundImage: design.imageURL ? `url(${design.imageURL})` : undefined,
                  backgroundSize: "cover", backgroundPosition: "center",
                }}>
                  <span style={{ fontSize: "2.5rem", filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.5))" }}>
                    {("emoji" in design) ? (design as any).emoji : "🎨"}
                  </span>
                </div>
                <div className="item-info">
                  <div className="item-name">{design.name}</div>
                  <div className="item-price">₹{design.price}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button className="item-customize-btn" onClick={() => handleCustomize()}>
                      Customize
                    </button>
                    <button
                      className="item-customize-btn"
                      style={{ background: "var(--accent)", color: "#000", borderColor: "var(--accent)" }}
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
            <div style={{ textAlign: "center", padding: 48, color: "#444", fontFamily: "'DM Mono', monospace", fontSize: "0.8rem" }}>
              No designs found for "{searchQuery}" in {selectedCategory}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

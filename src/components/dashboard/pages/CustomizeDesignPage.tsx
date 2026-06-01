import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import type { DashboardPage } from "../Sidebar";
import type { CartItem } from "./UploadDesignPage";

interface CustomizeDesignPageProps {
  onNavigate: (page: DashboardPage) => void;
  onAddToCart: (item: CartItem) => void;
}

export default function CustomizeDesignPage({ onNavigate, onAddToCart }: CustomizeDesignPageProps) {
  const [step, setStep] = useState(1);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("Black");
  const [quantity, setQuantity] = useState(1);

  const steps = [
    { num: 1, label: "Enter Names" },
    { num: 2, label: "Preview" },
    { num: 3, label: "Contact Details" },
    { num: 4, label: "Add to Cart" },
  ];

  const price = 299 * quantity;

  const handleAddToCart = () => {
    onAddToCart({
      id: `custom-flip-${Date.now()}`,
      name: `Flip Name: ${name1} ❤ ${name2}`,
      material,
      color,
      quantity,
      price,
      image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=200&q=80",
    });
    setStep(5); // success step
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Customize Design (Flip Name Example)</h2>
        <p>Follow the steps to personalize your design.</p>
      </div>

      {/* Step Indicators */}
      <div className="dash-steps">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`dash-step ${step === s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}
          >
            <div className="dash-step-circle">
              {step > s.num ? <Check size={14} /> : s.num}
            </div>
            <span className="dash-step-label">
              Step {s.num}: {s.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
        {/* Left - Form */}
        <div className="dash-card" style={{ padding: 28 }}>
          {step === 1 && (
            <div>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#fff",
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                Enter Names
              </h3>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginBottom: 20 }}>
                Enter the names you want on the design.
              </p>
              <div style={{ marginBottom: 16 }}>
                <label className="dash-label">Name 1</label>
                <input
                  className="dash-input"
                  placeholder="e.g. Rahul"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                />
              </div>
              <div>
                <label className="dash-label">Name 2</label>
                <input
                  className="dash-input"
                  placeholder="e.g. Anjali"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#fff",
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                Preview
              </h3>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginBottom: 20 }}>
                Preview your design in 3D. You can rotate and zoom.
              </p>
              {/* 3D preview area */}
              <div
                style={{
                  background: "#0A0A0A",
                  border: "1px solid #1a1a1a",
                  borderRadius: 12,
                  padding: 40,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "var(--accent)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {name1 || "Name1"}{" "}
                  <span style={{ color: "#EF4444", fontSize: "1.6rem" }}>❤</span>{" "}
                  {name2 || "Name2"}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    color: "#444",
                    marginTop: 12,
                  }}
                >
                  3D Flip Name Preview • Rotate with mouse
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#fff",
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                Contact Details
              </h3>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginBottom: 20 }}>
                Enter your contact details for delivery.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label className="dash-label">Full Name</label>
                  <input
                    className="dash-input"
                    placeholder="Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Email</label>
                  <input
                    className="dash-input"
                    type="email"
                    placeholder="rahul@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Phone Number</label>
                  <input
                    className="dash-input"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="dash-label">Address</label>
                  <textarea
                    className="dash-input"
                    placeholder="12, MG Road, Bengaluru, Karnataka - 560001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ resize: "vertical", minHeight: 80 }}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#fff",
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                Add to Cart
              </h3>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", marginBottom: 20 }}>
                Review and add to cart.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label className="dash-label">Material</label>
                  <select
                    className="dash-select"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    <option>PLA</option>
                    <option>ABS</option>
                    <option>PETG</option>
                    <option>Resin</option>
                  </select>
                </div>
                <div>
                  <label className="dash-label">Color</label>
                  <select
                    className="dash-select"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  >
                    <option>Black</option>
                    <option>White</option>
                    <option>Red</option>
                    <option>Orange</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label className="dash-label">Quantity</label>
                <div className="dash-qty-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "2px solid #10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Check size={28} style={{ color: "#10B981" }} />
              </div>
              <h3
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Added to Cart!
              </h3>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem",
                  color: "#555",
                  marginBottom: 24,
                }}
              >
                Your custom Flip Name has been added to your cart.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="dash-btn-secondary dash-btn-small" onClick={() => onNavigate("our-designs")}>
                  Continue Shopping
                </button>
                <button className="dash-btn-primary dash-btn-small" onClick={() => onNavigate("cart")}>
                  View Cart
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28 }}>
              <button
                className="dash-btn-secondary dash-btn-small"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                style={{ opacity: step === 1 ? 0.4 : 1 }}
              >
                <ArrowLeft size={14} /> Back
              </button>
              {step < 4 ? (
                <button className="dash-btn-primary dash-btn-small" onClick={() => setStep(step + 1)}>
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button className="dash-btn-primary dash-btn-small" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right - Live Preview */}
        <div>
          <div
            className="dash-card"
            style={{
              padding: 32,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              background: "radial-gradient(ellipse at center, rgba(var(--accent-rgb), 0.04) 0%, #111 70%)",
            }}
          >
            <div
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                color: "var(--accent)",
                textAlign: "center",
                letterSpacing: "0.05em",
                marginBottom: 16,
              }}
            >
              {name1 || "Name1"}{" "}
              <span style={{ color: "#EF4444" }}>❤</span>{" "}
              {name2 || "Name2"}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
              <span className="dash-badge dash-badge-accent">{material}</span>
              <span className="dash-badge dash-badge-blue">{color}</span>
              <span className="dash-badge dash-badge-green">Qty: {quantity}</span>
            </div>
            {step >= 4 && (
              <div
                style={{
                  marginTop: 24,
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  color: "var(--accent)",
                }}
              >
                ₹{price}
              </div>
            )}
          </div>

          {/* Summary card */}
          {step >= 3 && fullName && (
            <div className="dash-card" style={{ marginTop: 16, padding: 20 }}>
              <div
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#fff",
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                Delivery To
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#777", lineHeight: 1.8 }}>
                {fullName && <div>{fullName}</div>}
                {email && <div>{email}</div>}
                {phone && <div>{phone}</div>}
                {address && <div>{address}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

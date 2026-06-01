import { useState } from "react";
import { Trash2, ShoppingCart, ArrowRight, Check } from "lucide-react";
import type { DashboardPage } from "../Sidebar";
import type { CartItem } from "./UploadDesignPage";

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateCart: (items: CartItem[]) => void;
  onNavigate: (page: DashboardPage) => void;
}

export default function CartPage({ cartItems, onUpdateCart, onNavigate }: CartPageProps) {
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // Delivery form
  const [deliveryForm, setDeliveryForm] = useState({
    fullName: "",
    address: "",
    phone: "",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 0 ? 40 : 0;
  const tax = Math.floor(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    onUpdateCart(
      cartItems.map((item) =>
        item.id === id
          ? { ...item, quantity: newQty, price: (item.price / item.quantity) * newQty }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    onUpdateCart(cartItems.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    setCheckoutStep("success");
    setTimeout(() => {
      onUpdateCart([]);
    }, 500);
  };

  if (cartItems.length === 0 && checkoutStep !== "success") {
    return (
      <div className="dashboard-page">
        <div className="dashboard-page-header">
          <h2>My Cart</h2>
          <p>Your cart is empty.</p>
        </div>
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <ShoppingCart size={48} style={{ color: "#333", marginBottom: 16 }} />
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#555", marginBottom: 24 }}>
            You haven't added any items yet.
          </p>
          <button className="dash-btn-primary" onClick={() => onNavigate("our-designs")}>
            Browse Designs
          </button>
        </div>
      </div>
    );
  }

  if (checkoutStep === "success") {
    return (
      <div className="dashboard-page">
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "rgba(16, 185, 129, 0.1)",
              border: "2px solid #10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Check size={32} style={{ color: "#10B981" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
              color: "#fff",
              marginBottom: 8,
            }}
          >
            Order Placed Successfully!
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#555", marginBottom: 8 }}>
            Order ID: <span style={{ color: "var(--accent)" }}>ORD-{Math.floor(Math.random() * 9000) + 1000}</span>
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#444", marginBottom: 32 }}>
            Total Paid: <span style={{ color: "var(--accent)", fontWeight: 700 }}>₹{total.toLocaleString()}</span>
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="dash-btn-secondary" onClick={() => { setCheckoutStep("cart"); onNavigate("our-designs"); }}>
              Continue Shopping
            </button>
            <button className="dash-btn-primary" onClick={() => { setCheckoutStep("cart"); onNavigate("orders"); }}>
              Track Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>{checkoutStep === "cart" ? `My Cart (${cartItems.length} Items)` : "Checkout"}</h2>
        <p>{checkoutStep === "cart" ? "Review your items before checkout." : "Complete your order."}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        {/* Left - Cart Items / Checkout Form */}
        <div>
          {checkoutStep === "cart" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cartItems.map((item) => (
                <div key={item.id} className="dash-cart-item">
                  <img src={item.image} alt={item.name} className="dash-cart-item-image" />
                  <div className="dash-cart-item-info">
                    <div className="dash-cart-item-title">{item.name}</div>
                    <div className="dash-cart-item-meta">
                      Material: {item.material} • Color: {item.color}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <div className="dash-qty-control">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div className="dash-cart-item-price">₹{item.price}</div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none",
                        border: "1px solid #333",
                        borderRadius: 6,
                        color: "#666",
                        cursor: "pointer",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {checkoutStep === "checkout" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Delivery Address */}
              <div className="dash-card">
                <h3
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#fff",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Delivery Address
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label className="dash-label">Full Name</label>
                    <input
                      className="dash-input"
                      placeholder="Rahul Sharma"
                      value={deliveryForm.fullName}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="dash-label">Address</label>
                    <textarea
                      className="dash-input"
                      placeholder="12, MG Road, Bengaluru, Karnataka - 560001"
                      value={deliveryForm.address}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                      style={{ resize: "vertical", minHeight: 72 }}
                    />
                  </div>
                  <div>
                    <label className="dash-label">Phone Number</label>
                    <input
                      className="dash-input"
                      placeholder="+91 9876543210"
                      value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="dash-card">
                <h3
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#fff",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Payment Method
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { value: "upi", label: "UPI / QR", icons: "GPay • PhonePe • PayTM" },
                    { value: "card", label: "Credit / Debit Card", icons: "" },
                    { value: "netbanking", label: "Net Banking", icons: "" },
                    { value: "cod", label: "Cash on Delivery", icons: "" },
                  ].map((opt) => (
                    <div
                      key={opt.value}
                      className={`dash-payment-option ${paymentMethod === opt.value ? "selected" : ""}`}
                      onClick={() => setPaymentMethod(opt.value)}
                    >
                      <div className="dash-payment-radio" />
                      <div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#fff", fontSize: "0.85rem" }}>
                          {opt.label}
                        </div>
                        {opt.icons && (
                          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                            {opt.icons}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="dash-price-panel" style={{ height: "fit-content", position: "sticky", top: 92 }}>
          <h3
            style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: "1rem",
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 16,
            }}
          >
            Order Summary
          </h3>

          <div className="dash-price-row">
            <span className="label">Subtotal</span>
            <span className="value">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="dash-price-row">
            <span className="label">Shipping</span>
            <span className="value">₹{shipping}</span>
          </div>
          <div className="dash-price-row">
            <span className="label">Tax (18%)</span>
            <span className="value">₹{tax.toLocaleString()}</span>
          </div>

          <div className="dash-price-total">
            <span className="label">Total</span>
            <span className="value">₹{total.toLocaleString()}</span>
          </div>

          {checkoutStep === "cart" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <button
                className="dash-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setCheckoutStep("checkout")}
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>
              <button
                className="dash-btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => onNavigate("our-designs")}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <button
                className="dash-btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  background: "#10B981",
                }}
                onClick={handlePlaceOrder}
              >
                Pay ₹{total.toLocaleString()}
              </button>
              <button
                className="dash-btn-secondary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setCheckoutStep("cart")}
              >
                Back to Cart
              </button>
            </div>
          )}

          {/* Cart items summary in checkout */}
          {checkoutStep === "checkout" && (
            <div style={{ marginTop: 20, borderTop: "1px solid #222", paddingTop: 16 }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.65rem",
                  color: "#555",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                }}
              >
                Items ({cartItems.length})
              </div>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      objectFit: "cover",
                      border: "1px solid #222",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#ccc" }}>
                      {item.name}
                    </div>
                  </div>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "var(--accent)" }}>
                    ₹{item.price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

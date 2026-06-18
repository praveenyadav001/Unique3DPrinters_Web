import { useState, useEffect } from "react";
import { Trash2, ShoppingCart, ArrowRight, Check, Loader2, PackageCheck, MapPin, CreditCard, Minus, Plus } from "lucide-react";
import type { DashboardPage } from "../Sidebar";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { createOrder } from "@/services/orders.service";
import { processPayment } from "@/services/payment.service";

interface CartPageProps {
  onNavigate: (page: DashboardPage) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { user, userProfile } = useAuth();
  const { cartItems, cartCount, removeItem, updateQuantity, clearAll } = useCart();
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState("");

  const [deliveryForm, setDeliveryForm] = useState({
    fullName: userProfile?.displayName || "",
    address: userProfile?.address || "",
    city: userProfile?.city || "",
    pincode: userProfile?.pincode || "",
    phone: userProfile?.phone || "",
  });

  useEffect(() => {
    if (userProfile && !deliveryForm.fullName && !deliveryForm.address) {
      setDeliveryForm({
        fullName: userProfile.displayName || "",
        address: userProfile.address || "",
        city: userProfile.city || "",
        pincode: userProfile.pincode || "",
        phone: userProfile.phone || "",
      });
    }
  }, [userProfile]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 40 : 0;
  const tax = Math.floor(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  const checkoutSteps = [
    { key: "cart", label: "Cart", icon: <ShoppingCart size={14} /> },
    { key: "checkout", label: "Address & Payment", icon: <CreditCard size={14} /> },
    { key: "success", label: "Placed", icon: <PackageCheck size={14} /> },
  ];

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    if (newQty < 1) return;
    await updateQuantity(id, newQty);
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const handlePlaceOrder = async () => {
    if (!user || !userProfile) return;
    
    if (!deliveryForm.fullName.trim() || !deliveryForm.address.trim() || !deliveryForm.city.trim() || !deliveryForm.pincode.trim() || !deliveryForm.phone.trim()) {
      alert("Please fill out all delivery address fields.");
      return;
    }

    setPlacingOrder(true);
    
    // Process Payment
    const paymentResult = await processPayment(total, "INR");
    if (!paymentResult.success) {
      setPlacingOrder(false);
      alert(paymentResult.error || "Payment failed.");
      return;
    }

    try {
      const newOrderId = await createOrder({
        customerId: user.uid,
        customerName: deliveryForm.fullName || "Customer",
        customerEmail: userProfile.email || "",
        items: cartItems.map((item) => ({
          designId: item.designId || "",
          designName: item.name,
          material: item.material,
          color: item.color,
          size: item.size || "100%",
          quantity: item.quantity,
          price: item.price,
          imageURL: item.imageURL || "",
          fileURL: item.fileURL || "",
        })),
        shippingAddress: {
          street: deliveryForm.address,
          city: deliveryForm.city,
          state: "",
          pincode: deliveryForm.pincode,
          phone: deliveryForm.phone,
        },
        paymentMethod,
        subtotal,
        shippingCost: shipping,
        discount: 0,
        total,
      });
      setOrderId(newOrderId);
      setCheckoutStep("success");
      await clearAll();
    } catch (err) {
      console.error("Order failed:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartCount === 0 && checkoutStep !== "success") {
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
          <div style={{
            width: 70, height: 70, borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.1)", border: "2px solid #10B981",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Check size={32} style={{ color: "#10B981" }} />
          </div>
          <h2 style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 800,
            fontSize: "1.6rem", color: "#fff", marginBottom: 8,
          }}>
            Order Placed Successfully!
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#555", marginBottom: 8 }}>
            Order ID: <span style={{ color: "var(--accent)" }}>{orderId.slice(0, 12).toUpperCase()}</span>
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
        <h2>{checkoutStep === "cart" ? `My Cart (${cartCount} Items)` : "Checkout"}</h2>
        <p>{checkoutStep === "cart" ? "Review your items before checkout." : "Complete your order."}</p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 22, flexWrap: "wrap" }}>
        {checkoutSteps.slice(0, 2).map((step, index) => {
          const isActive = checkoutStep === step.key;
          const isDone = checkoutStep === "checkout" && step.key === "cart";
          return (
            <div key={step.key} style={{
              display: "flex", alignItems: "center", gap: 8, minHeight: 36,
              padding: "8px 12px", borderRadius: 8,
              border: `1px solid ${isActive || isDone ? "rgba(var(--accent-rgb), 0.35)" : "#222"}`,
              background: isActive || isDone ? "rgba(var(--accent-rgb), 0.07)" : "#0d0d0d",
              color: isActive || isDone ? "var(--accent)" : "#666",
              fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", textTransform: "uppercase",
            }}>
              {isDone ? <Check size={14} /> : step.icon}
              {index + 1}. {step.label}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 24, alignItems: "start" }}>
        {/* Left - Cart Items / Checkout Form */}
        <div>
          {checkoutStep === "cart" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {cartItems.map((item) => (
                <div key={item.id} className="dash-card" style={{ padding: 0, overflow: "hidden", display: "grid", gridTemplateColumns: "128px minmax(0, 1fr) auto", alignItems: "stretch" }}>
                  <div className="dash-cart-item-image" style={{
                    backgroundImage: item.imageURL ? `url(${item.imageURL})` : undefined,
                    backgroundSize: "cover", backgroundPosition: "center",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.8rem", width: "100%", height: "100%", minHeight: 128,
                    borderRadius: 0, border: "none", borderRight: "1px solid #1a1a1a",
                  }}>
                    {!item.imageURL && "📦"}
                  </div>
                  <div className="dash-cart-item-info" style={{ padding: "18px 20px" }}>
                    <div className="dash-cart-item-title">{item.name}</div>
                    <div className="dash-cart-item-meta" style={{ marginTop: 6 }}>
                      {item.material} • {item.color} • {item.size || "100%"}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                      <span className="dash-badge dash-badge-blue">Unit ₹{item.price.toLocaleString()}</span>
                      {item.fileURL && <span className="dash-badge dash-badge-green">Custom file</span>}
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <div className="dash-qty-control" style={{ width: "fit-content" }}>
                        <button aria-label="Decrease quantity" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}><Minus size={12} /></button>
                        <span>{item.quantity}</span>
                        <button aria-label="Increase quantity" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}><Plus size={12} /></button>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 16, borderLeft: "1px solid #111" }}>
                    <div className="dash-cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                    <button onClick={() => handleRemoveItem(item.id)} style={{
                      background: "none", border: "1px solid #333", borderRadius: 6,
                      color: "#666", cursor: "pointer", width: 28, height: 28,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
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
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", marginBottom: 16 }}>
                  <MapPin size={16} style={{ color: "var(--accent)", verticalAlign: "middle", marginRight: 8 }} /> Delivery Address
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div>
                    <label className="dash-label">Full Name</label>
                    <input className="dash-input" placeholder="Your name" value={deliveryForm.fullName}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label className="dash-label">Address</label>
                    <textarea className="dash-input" placeholder="Street address" value={deliveryForm.address}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                      style={{ resize: "vertical", minHeight: 72 }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label className="dash-label">City</label>
                      <input className="dash-input" placeholder="City" value={deliveryForm.city}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, city: e.target.value })} />
                    </div>
                    <div>
                      <label className="dash-label">Pincode</label>
                      <input className="dash-input" placeholder="560001" value={deliveryForm.pincode}
                        onChange={(e) => setDeliveryForm({ ...deliveryForm, pincode: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="dash-label">Phone Number</label>
                    <input className="dash-input" placeholder="+91 9876543210" value={deliveryForm.phone}
                      onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="dash-card">
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", marginBottom: 16 }}>
                  <CreditCard size={16} style={{ color: "var(--accent)", verticalAlign: "middle", marginRight: 8 }} /> Payment Method
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { value: "upi", label: "UPI / QR", icons: "GPay • PhonePe • PayTM" },
                    { value: "card", label: "Credit / Debit Card", icons: "" },
                    { value: "netbanking", label: "Net Banking", icons: "" },
                    { value: "cod", label: "Cash on Delivery", icons: "" },
                  ].map((opt) => (
                    <div key={opt.value}
                      className={`dash-payment-option ${paymentMethod === opt.value ? "selected" : ""}`}
                      onClick={() => setPaymentMethod(opt.value)}>
                      <div className="dash-payment-radio" />
                      <div>
                        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#fff", fontSize: "0.85rem" }}>
                          {opt.label}
                        </div>
                        {opt.icons && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>{opt.icons}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right - Order Summary */}
        <div className="dash-price-panel" style={{ height: "fit-content", position: "sticky", top: 92, borderColor: "rgba(var(--accent-rgb), 0.22)" }}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
            Order Summary
          </h3>
          <div style={{ padding: "12px", border: "1px solid #1f1f1f", borderRadius: 8, marginBottom: 14, background: "#0d0d0d" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666", textTransform: "uppercase", marginBottom: 6 }}>
              Items selected
            </div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.7rem", color: "var(--accent)", lineHeight: 1 }}>
              {cartCount}
            </div>
          </div>
          <div className="dash-price-row"><span className="label">Subtotal</span><span className="value">₹{subtotal.toLocaleString()}</span></div>
          <div className="dash-price-row"><span className="label">Shipping</span><span className="value">₹{shipping}</span></div>
          <div className="dash-price-row"><span className="label">Tax (18%)</span><span className="value">₹{tax.toLocaleString()}</span></div>
          <div className="dash-price-total"><span className="label">Total</span><span className="value">₹{total.toLocaleString()}</span></div>

          {checkoutStep === "cart" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <button className="dash-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setCheckoutStep("checkout")}>
                Proceed to Checkout <ArrowRight size={14} />
              </button>
              <button className="dash-btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => onNavigate("our-designs")}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <button className="dash-btn-primary" disabled={placingOrder}
                style={{ width: "100%", justifyContent: "center", background: "#10B981", display: "flex", alignItems: "center", gap: 8 }}
                onClick={handlePlaceOrder}>
                {placingOrder && <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />}
                {placingOrder ? "Processing Payment..." : `Pay ₹${total.toLocaleString()}`}
              </button>
              <button className="dash-btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setCheckoutStep("cart")}>
                Back to Cart
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

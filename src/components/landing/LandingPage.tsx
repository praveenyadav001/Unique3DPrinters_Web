import {
  Search, ShoppingCart, User, ArrowRight,
  CheckCircle2, Shield, Truck, Headphones, Award,
  PenTool, UploadCloud, Settings2, Package,
  MapPin, Phone, Mail, Send, ChevronRight, Star,
} from "lucide-react";

interface LandingPageProps {
  onLoginClick: () => void;
}

const CATEGORIES = [
  { name: "Flip Name", type: "Personalized", emoji: "💫" },
  { name: "Keychain", type: "Customize", emoji: "🔑" },
  { name: "Flower Design", type: "Decorative", emoji: "🌹" },
  { name: "Letter Name", type: "Personalized", emoji: "🔤" },
  { name: "Bike Number Plate", type: "Customize", emoji: "🏍️" },
  { name: "Home Decor", type: "Stylish", emoji: "🏠" },
  { name: "Toys & Models", type: "Fun & Creative", emoji: "🐘" },
  { name: "More Categories", type: "Explore all", emoji: "➕" },
];

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* ═══ NAVBAR ═══════════════════════════════════════ */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          {/* SVG Logo icon */}
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect x="4" y="20" width="24" height="3" rx="1.5" fill="var(--accent)" opacity="0.4" />
            <path d="M16 4 L26 16 L6 16 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <rect x="10" y="12" width="12" height="10" rx="1" fill="#111" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.6" />
            <circle cx="16" cy="17" r="2" fill="var(--accent)" opacity="0.7" />
          </svg>
          <span>
            <span style={{ color: "var(--accent)" }}>UNIQUE</span>
            <span style={{ color: "#fff" }}>3D</span>
            <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
          </span>
        </div>

        <div className="landing-nav-links">
          {["Home", "Design", "Upload Design", "Our Designs", "Orders", "Pricing", "Contact"].map((link, i) => (
            <button key={link} className={`landing-nav-link ${i === 0 ? "active" : ""}`}>
              {link}
            </button>
          ))}
        </div>

        <div className="landing-nav-right">
          <div className="landing-nav-search">
            <Search size={14} style={{ color: "#555", flexShrink: 0 }} />
            <input type="text" placeholder="Search designs, products..." />
          </div>

          <button className="dashboard-icon-btn" style={{ position: "relative" }}>
            <ShoppingCart size={16} />
            <span style={{
              position: "absolute", top: -2, right: -2, width: 16, height: 16,
              borderRadius: "50%", background: "var(--accent)", color: "#000",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.55rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid #0A0A0A",
            }}>3</span>
          </button>

          <button
            onClick={onLoginClick}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(var(--accent-rgb), 0.1)", border: "1.5px solid #333",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#888",
            }}>
              <User size={14} />
            </div>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.85rem",
              color: "#ccc",
            }}>Login</span>
          </button>
        </div>
      </nav>

      {/* ═══ HERO ════════════════════════════════════════ */}
      <section className="landing-hero">
        <div className="landing-hero-grid" />
        <div className="landing-hero-content landing-animate">
          <h1 style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.1,
            color: "#fff", margin: "0 0 16px",
          }}>
            BRING YOUR IDEAS<br />
            <span style={{ color: "var(--accent)" }}>TO LIFE WITH 3D PRINTING</span>
          </h1>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.8rem",
            color: "#666", maxWidth: 400, lineHeight: 1.7, margin: "0 0 32px",
          }}>
            Design, customize and order high quality<br />
            3D printed products easily.
          </p>

          <div style={{ display: "flex", gap: 14, marginBottom: 0 }}>
            <button className="dash-btn-primary" onClick={onLoginClick} style={{ padding: "13px 28px" }}>
              Start Designing <PenTool size={14} />
            </button>
            <button className="dash-btn-secondary" onClick={onLoginClick} style={{ padding: "13px 28px" }}>
              Upload Design <UploadCloud size={14} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="landing-trust-bar landing-animate-d2">
            {[
              { icon: <CheckCircle2 size={14} />, label: "High Quality", sub: "Premium Materials" },
              { icon: <Truck size={14} />, label: "Fast Delivery", sub: "On-time Guarantee" },
              { icon: <Shield size={14} />, label: "Secure Payments", sub: "100% Protected" },
              { icon: <Headphones size={14} />, label: "24/7 Support", sub: "We're here to help" },
            ].map((t, i) => (
              <div key={i} className="landing-trust-item">
                <span className="trust-icon">{t.icon}</span>
                <div>
                  <div className="trust-label">{t.label}</div>
                  <div className="trust-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero visual — Immersive Floating 3D Graphic */}
        <div className="landing-hero-visual landing-animate-d1 animate-floating" style={{ position: "relative" }}>
          {/* Glowing backdrop */}
          <div style={{
            position: "absolute", inset: 20,
            background: "radial-gradient(circle, rgba(var(--accent-rgb), 0.4) 0%, transparent 70%)",
            filter: "blur(40px)", zIndex: 0
          }} />
          
          <img 
            src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=600&q=80" 
            alt="3D Printed object floating" 
            style={{
              width: "100%", maxWidth: 450,
              borderRadius: 24,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
              position: "relative", zIndex: 1,
              filter: "brightness(0.9) contrast(1.1)"
            }} 
          />
          
          {/* Floating UI Elements */}
          <div className="glass-card" style={{
            position: "absolute", bottom: 40, left: -20, zIndex: 2,
            padding: "12px 16px", borderRadius: 12,
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>
              <CheckCircle2 size={16} />
            </div>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem", color: "#fff" }}>Ready to Print</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#888" }}>High precision guaranteed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS + WHY CHOOSE US ════════════════ */}
      <section className="landing-section">
        <div className="landing-how-grid">
          <div>
            <div className="landing-section-title">How It Works</div>
            <div className="landing-steps">
              {[
                { num: "1", icon: <PenTool size={18} />, title: "Design", desc: "Create your design or choose a template." },
                { num: "2", icon: <UploadCloud size={18} />, title: "Upload", desc: "Upload your 3D file (STL, OBJ, 3MF)." },
                { num: "3", icon: <Settings2 size={18} />, title: "Customize", desc: "Select material, size, color and quantity." },
                { num: "4", icon: <Package size={18} />, title: "Order", desc: "Review and place your order." },
              ].map((step, i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div className="landing-step">
                    <div className="landing-step-icon">{step.icon}</div>
                    <div className="landing-step-content">
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div className="landing-step-num"><span>{step.num}</span></div>
                        <div className="landing-step-title">{step.title}</div>
                      </div>
                      <div className="landing-step-desc">{step.desc}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight size={14} className="landing-step-arrow" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="landing-why-card">
            <div className="landing-section-title" style={{ marginBottom: 16 }}>Why Choose Us?</div>
            {[
              "Advanced 3D Printing Technology",
              "Wide Range of Materials",
              "Precision & Quality Assurance",
              "Affordable Pricing",
              "Fast & Reliable Delivery",
            ].map((text, i) => (
              <div key={i} className="landing-why-item">
                <div className="landing-why-check"><CheckCircle2 size={10} /></div>
                <span className="landing-why-text">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPLORE CATEGORIES ═══════════════════════════ */}
      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div className="landing-section-title" style={{ margin: 0, flex: "none" }}>
            Explore Our Top Categories
          </div>
          <button style={{
            background: "none", border: "none", color: "var(--accent)",
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          }}>
            View All Categories <ArrowRight size={12} />
          </button>
        </div>

        <div className="landing-categories-grid">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="landing-category-card glass-card" onClick={onLoginClick}>
              <div className="cat-image">{cat.emoji}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-type">{cat.type}</div>
              <div className="cat-link">
                Explore <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS MARQUEE ═════════════════════════ */}
      <section style={{ padding: "40px 0" }}>
        <div className="marquee-container">
          <div className="marquee-content">
            {/* Duplicate list to make infinite scroll smooth */}
            {[...Array(2)].map((_, loopIdx) => (
              <div key={loopIdx} style={{ display: "flex", gap: 30 }}>
                {[
                  { name: "Rahul S.", rating: 5, text: "The print quality is absolutely stunning. Received my custom gear assembly ahead of schedule." },
                  { name: "Priya M.", rating: 5, text: "Highly recommend! The UI is so sleek and uploading my own STL files was seamless." },
                  { name: "Vikram R.", rating: 4, text: "Great pricing for Carbon PLA prints. The structural integrity is top notch." },
                  { name: "Anjali K.", rating: 5, text: "Beautiful personalized name plates. They make perfect gifts for my colleagues!" },
                ].map((review, i) => (
                  <div key={i} className="testimonial-card glass-card">
                    <div style={{ display: "flex", gap: 4, color: "var(--accent)", marginBottom: 12 }}>
                      {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#ccc", lineHeight: 1.6, flex: 1, margin: "0 0 16px" }}>
                      "{review.text}"
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(var(--accent-rgb), 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.8rem" }}>
                        {review.name[0]}
                      </div>
                      <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>{review.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══════════════════════════════════ */}
      <div className="landing-stats-bar">
        {[
          { icon: <Package size={20} />, value: "10K+", label: "Orders Delivered" },
          { icon: <User size={20} />, value: "5K+", label: "Happy Customers" },
          { icon: <Award size={20} />, value: "98%", label: "Satisfaction Rate" },
          { icon: <Truck size={20} />, value: "24-48 Hrs", label: "Fast Delivery" },
        ].map((s, i) => (
          <div key={i} className="landing-stat">
            <div className="landing-stat-icon">{s.icon}</div>
            <div>
              <div className="landing-stat-value">{s.value}</div>
              <div className="landing-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ TRUST STRIP ═════════════════════════════════ */}
      <div className="landing-trust-strip">
        {[
          { icon: <Shield size={20} />, label: "Secure Payments", sub: "100% safe & protected" },
          { icon: <Award size={20} />, label: "Premium Quality", sub: "High quality materials" },
          { icon: <Truck size={20} />, label: "Fast Delivery", sub: "On-time, every time" },
          { icon: <Headphones size={20} />, label: "24/7 Support", sub: "We're here to help" },
          { icon: <CheckCircle2 size={20} />, label: "Satisfaction Guaranteed", sub: "100% satisfaction promise" },
        ].map((t, i) => (
          <div key={i} className="landing-trust-strip-item">
            <div className="landing-trust-strip-icon">{t.icon}</div>
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff" }}>
                {t.label}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                {t.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ FOOTER ══════════════════════════════════════ */}
      <footer className="landing-footer">
        <div className="landing-footer-grid">
          {/* Brand */}
          <div className="landing-footer-brand">
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.3rem", letterSpacing: "0.05em" }}>
              <span style={{ color: "var(--accent)" }}>UNIQUE</span>
              <span style={{ color: "#fff" }}>3D</span>
              <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
            </div>
            <p>
              Your trusted partner for high quality 3D printing. Design, customize and order unique 3D products with ease.
            </p>
            <div className="landing-footer-contact">
              <div className="landing-footer-contact-item">
                <MapPin size={14} />
                <span>123 Maker Street, Tech City,<br />Bangalore, India - 560001</span>
              </div>
              <div className="landing-footer-contact-item">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </div>
              <div className="landing-footer-contact-item">
                <Mail size={14} />
                <span>support@unique3dprinters.com</span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div>
            <div className="landing-footer-section-title">Explore</div>
            <div className="landing-footer-links">
              {["Home", "Design", "Upload Design", "Our Designs", "Categories", "Pricing", "Gallery"].map((l) => (
                <span key={l} className="landing-footer-link">
                  <ChevronRight size={10} /> {l}
                </span>
              ))}
            </div>
          </div>

          {/* Orders & Support */}
          <div>
            <div className="landing-footer-section-title">Orders & Support</div>
            <div className="landing-footer-links">
              {["Orders", "Track Order", "Returns & Refunds", "Shipping Policy", "FAQs", "Help Center", "Contact Us"].map((l) => (
                <span key={l} className="landing-footer-link">
                  <ChevronRight size={10} /> {l}
                </span>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="landing-footer-section-title">Company</div>
            <div className="landing-footer-links">
              {["About Us", "How It Works", "Materials", "Blog", "Careers", "Terms & Conditions", "Privacy Policy"].map((l) => (
                <span key={l} className="landing-footer-link">
                  <ChevronRight size={10} /> {l}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <div className="landing-footer-section-title">Stay Updated</div>
            <div className="landing-footer-newsletter">
              <p>Subscribe to our newsletter and get updates on offers and new products.</p>
              <div className="landing-footer-newsletter-input">
                <input type="email" placeholder="Enter your email address" />
                <button title="Subscribe"><Send size={16} /></button>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#666" }}>
                  I agree to receive updates & offers
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="landing-footer-bottom">
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444" }}>
            © 2024 <span style={{ color: "var(--accent)" }}>Unique3DPrinters</span>. All rights reserved.
          </div>

          <div className="landing-footer-social">
            <span className="landing-footer-social-label">Follow Us</span>
            {["f", "📷", "▶", "in", "📌"].map((s, i) => (
              <div key={i} className="landing-social-icon">{s}</div>
            ))}
          </div>

          <div className="landing-footer-payments">
            <span className="landing-footer-payments-label">We Accept</span>
            {["VISA", "MC", "UPI", "PayTM", "GPay"].map((p) => (
              <span key={p} className="landing-payment-badge">{p}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

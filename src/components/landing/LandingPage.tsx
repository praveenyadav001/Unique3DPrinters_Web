import React, { useEffect } from "react";
import {
  Search, ShoppingCart, User, ArrowRight,
  CheckCircle2, Shield, Truck, Headphones, Award,
  PenTool, UploadCloud, Settings2, Package,
  MapPin, Phone, Mail, Send, ChevronRight, Star,
} from "lucide-react";
import { CardStack, CardStackItem } from "../ui/card-stack";
import { ParticleTextEffect } from "../ui/particle-text-effect";
import { HowItWorksSection } from "./HowItWorksSection";
import heroVideo from "@/assets/background video/slight_motion_effect_video_for.mp4";

interface LandingPageProps {
  onLoginClick: () => void;
}

const CATEGORIES = [
  { name: "Prototyping", type: "FDM & SLA", emoji: "⚙️", image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80" },
  { name: "Miniatures", type: "High-Res Resin", emoji: "🧙‍♂️", image: "https://images.unsplash.com/photo-1622322306912-7013ba0c6c84?auto=format&fit=crop&w=800&q=80" },
  { name: "Architecture", type: "Detailed Models", emoji: "🏢", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" },
  { name: "Jewelry", type: "Castable Wax", emoji: "💎", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80" },
  { name: "Automotive", type: "Strong & Heat Resistant", emoji: "🏎️", image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" },
];

const CARD_STACK_ITEMS: CardStackItem[] = CATEGORIES.map((cat, i) => ({
  id: i,
  title: cat.name,
  description: `Professional ${cat.type} printing for your unique requirements.`,
  imageSrc: cat.image,
  tag: cat.emoji,
}));

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll(".reveal-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh", "--accent": "#00E5FF", "--accent-rgb": "0, 229, 255", "--accent-secondary": "#ffffff" } as any}>
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
      <section className="hero-centered relative">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ opacity: 0.3 }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero-mesh-bg z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] z-0 pointer-events-none" />
        
        <div className="hero-pill-badge z-10">
          <span>✨ The Future of 3D Printing</span>
        </div>
        <div className="z-10 -mt-8 -mb-4 w-full flex justify-center relative">
          <ParticleTextEffect words={["BRING YOUR IDEAS\nTO LIFE"]} />
        </div>
        <p className="hero-subtitle z-10 relative">
          Design, customize, and order high quality 3D printed products easily. Upload your STL, OBJ, or 3MF files and get them delivered to your doorstep.
        </p>
        <div style={{ display: "flex", gap: 14, marginBottom: 0 }} className="z-10 relative">
          <button className="dash-btn-primary" onClick={onLoginClick} style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Start Designing <PenTool size={16} />
          </button>
          <button className="dash-btn-secondary" onClick={onLoginClick} style={{ padding: "14px 32px", fontSize: "1rem" }}>
            Upload Design <UploadCloud size={16} />
          </button>
        </div>

      </section>

      {/* ═══ CONSOLIDATED TRUST & STATS STRIP ════════════ */}
      <section className="consolidated-strip reveal-on-scroll">
        {[
          { val: "10K+", label: "Orders Delivered" },
          { val: "98%", label: "Satisfaction Rate" },
          { val: "24/7", label: "Expert Support" },
          { val: "100%", label: "Secure Payments" },
        ].map((s, i) => (
          <div key={i} className="strip-item">
            <div className="strip-val">{s.val}</div>
            <div className="strip-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ═══ HOW IT WORKS REDESIGN ═════════════════════ */}
      <HowItWorksSection />

      {/* ═══ EXPLORE CATEGORIES ═══════════════════════════ */}
      <section className="landing-section reveal-on-scroll" style={{ paddingTop: 80, overflow: "hidden" }}>
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

        <div className="w-full py-12 flex justify-center">
          <CardStack
            items={CARD_STACK_ITEMS}
            initialIndex={0}
            autoAdvance
            intervalMs={2500}
            pauseOnHover
            showDots
          />
        </div>
      </section>

      {/* ═══ TESTIMONIALS MARQUEE ═════════════════════════ */}
      <section style={{ padding: "60px 0", textAlign: "center" }} className="reveal-on-scroll">
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

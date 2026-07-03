import { useEffect, useState } from "react";
import {
  Search, ShoppingCart, User, ArrowRight,
  PenTool, UploadCloud, Box, CreditCard, Home,
  MapPin, Phone, Mail, Send, ChevronRight, Star, Loader2, CheckCircle2
} from "lucide-react";
import { AnimeNavBar } from "../ui/anime-navbar";
import { CardStack, CardStackItem } from "../ui/card-stack";
import { HowItWorksSection } from "./HowItWorksSection";
import { motion } from "framer-motion";
import { STLUploader } from "./STLUploader";
import heroVideo from "@/assets/background video/slight_motion_effect_video_for.mp4";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const NAV_ITEMS = [
  { name: "Home", url: "#", icon: Home },
  { name: "Design", url: "#", icon: PenTool },
  { name: "Upload Design", url: "#", icon: UploadCloud },
  { name: "Our Designs", url: "#", icon: Box },
  { name: "Orders", url: "#", icon: ShoppingCart },
  { name: "Pricing", url: "#", icon: CreditCard },
  { name: "Contact", url: "#", icon: Mail },
];

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [agreed, setAgreed] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@") || !agreed) return;
    setSubStatus("loading");
    try {
      await addDoc(collection(db, "subscribers"), {
        email,
        subscribedAt: new Date(),
      });
      setSubStatus("success");
      setEmail("");
      setTimeout(() => setSubStatus("idle"), 3000);
    } catch (e) {
      console.error("Subscription error:", e);
      setSubStatus("error");
      setTimeout(() => setSubStatus("idle"), 3000);
    }
  };

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
    <div style={{ background: "#0A0A0A", minHeight: "100vh", "--accent": "#00E5FF", "--accent-rgb": "0, 229, 255", "--accent-secondary": "#ffffff" } as any} className="flex w-full">
      {/* ═══ NAVBAR ═══════════════════════════════════════ */}
      <AnimeNavBar 
        items={NAV_ITEMS}
        defaultActive="Home"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        logo={(isCollapsed) => (
          <div className="landing-nav-logo" style={{ cursor: "pointer", gap: isCollapsed ? 0 : 8, justifyContent: "center" }}>
            <svg viewBox="0 0 32 32" width="28" height="28" style={{ flexShrink: 0 }}>
              <rect x="4" y="20" width="24" height="3" rx="1.5" fill="var(--accent)" opacity="0.4" />
              <path d="M16 4 L26 16 L6 16 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
              <rect x="10" y="12" width="12" height="10" rx="1" fill="#111" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="16" cy="17" r="2" fill="var(--accent)" opacity="0.7" />
            </svg>
            {!isCollapsed && (
              <span className="trade-winds-regular" style={{ fontSize: "1.4rem", letterSpacing: "1px", whiteSpace: "nowrap" }}>
                <span style={{ color: "var(--accent)" }}>UNIQUE</span>
                <span style={{ color: "#fff" }}>3D</span>
                <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
              </span>
            )}
          </div>
        )}
        rightContent={(isCollapsed) => (
          <div className={`landing-nav-right ${isCollapsed ? 'flex-col gap-6' : 'flex-col gap-4'} w-full items-center`}>
            {/* Search */}
            <div className={`landing-nav-search ${isCollapsed ? 'w-10 h-10 p-0 justify-center rounded-full bg-white/5 border-white/10 mx-auto' : 'w-full'}`} style={isCollapsed ? { background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" } : {}}>
              <Search size={16} style={{ color: "#aaa", flexShrink: 0 }} />
              {!isCollapsed && <input type="text" placeholder="Search..." style={{ width: "100%", background: "transparent", border: "none", color: "#fff", outline: "none", fontSize: "0.85rem" }} />}
            </div>

            {/* Cart & Login row */}
            <div className={`flex ${isCollapsed ? 'flex-col gap-6' : 'flex-row gap-4 justify-between w-full'}`}>
              <button className="dashboard-icon-btn" style={{ position: "relative", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", margin: isCollapsed ? "0 auto" : 0 }}>
                <ShoppingCart size={18} color="#fff" />
                <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "var(--accent)", color: "#000", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #0A0A0A" }}>3</span>
              </button>

              <button onClick={onLoginClick} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", justifyContent: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(var(--accent-rgb), 0.1)", border: "1.5px solid #333", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", margin: isCollapsed ? "0 auto" : 0 }}>
                  <User size={16} />
                </div>
                {!isCollapsed && (
                  <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#ccc" }}>Login</span>
                )}
              </button>
            </div>
          </div>
        )}
      />

      <div className={`flex-1 transition-all duration-500 ease-in-out w-full overflow-x-hidden ${isSidebarCollapsed ? 'ml-0' : 'ml-0 md:ml-72'}`}>
        {/* ═══ HERO ════════════════════════════════════════ */}
        <section className="hero-centered relative">
          
          {/* Top Left Logo (Visible when sidebar is collapsed) */}
          <div className={`absolute top-8 left-20 z-[99] transition-opacity duration-300 ${!isSidebarCollapsed ? 'md:opacity-0 pointer-events-none' : ''}`}>
            <div className="landing-nav-logo" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <svg viewBox="0 0 32 32" width="28" height="28" style={{ flexShrink: 0 }}>
                <rect x="4" y="20" width="24" height="3" rx="1.5" fill="var(--accent)" opacity="0.4" />
                <path d="M16 4 L26 16 L6 16 Z" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
                <rect x="10" y="12" width="12" height="10" rx="1" fill="#111" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.6" />
                <circle cx="16" cy="17" r="2" fill="var(--accent)" opacity="0.7" />
              </svg>
              <span className="trade-winds-regular" style={{ fontSize: "1.4rem", letterSpacing: "1px", whiteSpace: "nowrap" }}>
                <span style={{ color: "var(--accent)" }}>UNIQUE</span>
                <span style={{ color: "#fff" }}>3D</span>
                <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
              </span>
            </div>
          </div>

          {/* Top Right Login Button */}
          <div className="absolute top-6 right-8 z-[99]">
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 hover:bg-white/10 transition-colors px-4 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md cursor-pointer shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-[rgba(var(--accent-rgb),0.2)] border border-[#333] flex items-center justify-center text-[var(--accent)]">
                <User size={16} />
              </div>
              <span className="font-semibold text-sm text-[#ccc] hidden sm:block" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Login</span>
            </button>
          </div>
          
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-0" style={{ background: "rgba(0,0,0,0.6)" }} />
        <div className="hero-mesh-bg z-0" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-pill-badge z-10"
        >
          <span>✨ The Future of 3D Printing</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="z-10 w-full flex justify-center relative mb-4"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white text-center tracking-tight drop-shadow-2xl" style={{ fontFamily: "'Rajdhani', sans-serif", margin: "0 0 24px" }}>
            PRECISION <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#007BFF]">3D PRINTING</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <p className="hero-subtitle z-10 relative text-lg md:text-xl text-zinc-300 max-w-2xl text-center" style={{ margin: "0 auto 40px" }}>
            From concept to creation — fast, accurate, reliable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginBottom: 0 }}
          className="z-10 relative mt-4"
        >
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary-glow" onClick={onLoginClick}>
            Upload Model <UploadCloud size={18} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary-glow" onClick={onLoginClick}>
            Get Quote <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </section>

      {/* ═══ STL UPLOADER ════════════════════════════════ */}
      <STLUploader />

      {/* ═══ HOW IT WORKS REDESIGN ═════════════════════ */}
      <HowItWorksSection />

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
        <div className="landing-footer-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {/* Brand */}
          <div className="landing-footer-brand">
            <div className="trade-winds-regular" style={{ fontSize: "1.4rem", letterSpacing: "1px" }}>
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

          {/* Quick Links */}
          <div>
            <div className="landing-footer-section-title">Quick Links</div>
            <div className="landing-footer-links">
              {["Home", "Our Designs", "Categories", "Pricing", "About Us", "Contact Us"].map((l) => (
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
              {["Track Order", "Returns & Refunds", "Shipping Policy", "FAQs", "Help Center"].map((l) => (
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
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subStatus === "loading" || subStatus === "success"}
                />
                <button 
                  title="Subscribe" 
                  onClick={handleSubscribe}
                  disabled={subStatus === "loading" || subStatus === "success" || !email}
                >
                  {subStatus === "loading" ? <Loader2 size={16} className="animate-spin" /> : 
                   subStatus === "success" ? <CheckCircle2 size={16} /> : 
                   <Send size={16} />}
                </button>
              </div>
              {subStatus === "success" && (
                <div style={{ color: "#10B981", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                  Successfully subscribed! 🎉
                </div>
              )}
              {subStatus === "error" && (
                <div style={{ color: "#EF4444", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", marginTop: 4 }}>
                  Something went wrong. Try again.
                </div>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 8 }}>
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ accentColor: "var(--accent)" }} 
                />
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
            © 2026 <span style={{ color: "var(--accent)" }}>Unique3DPrinters</span>. All rights reserved.
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
    </div>
  );
}

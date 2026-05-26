import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Icons
import {
  UploadCloud,
  Maximize2,
  Minimize2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Activity,
  CheckCircle2,
  Menu,
  X,
  ChevronUp,
  Shield,
  Clock,
  Award,
  Mail,
  Phone,
  MapPin,
  Send
} from "lucide-react";

// Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadialOrbitalTimelineDemo } from "@/components/ui/demo";
import Testimonials from "@/components/ui/testimonials";
import FaqAccordion from "@/components/ui/faq-accordion";
import OrderStatusTracker from "@/components/ui/order-tracker";
import ParticleBackground from "@/components/ui/particle-background";
import ModelViewer from "@/components/ui/model-viewer";

// ─── Scroll Reveal Hook ────────────────────────────────────────────
function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

// ─── Splash Screen Component ──────────────────────────────────────
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1600);
    const t2 = setTimeout(() => onComplete(), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);
  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="splash-logo" style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "0.08em" }}>
          <span style={{ color: "var(--accent)" }}>UNIQUE</span>
          <span style={{ color: "#fff" }}>3D</span>
          <span style={{ color: "var(--accent-secondary)" }}>PRINTERS</span>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 8 }}>
          Initializing Print Engine...
        </div>
      </div>
      <div className="splash-bar-track">
        <div className="splash-bar-fill" />
      </div>
    </div>
  );
}

const NAV_LINKS = ["Services", "Gallery", "Process", "Contact"];

const SERVICES = [
  { icon: "⬡", title: "Rapid Prototyping", desc: "From concept to physical model in under 24 hours. High-detail FDM & resin prints.", tag: "Fast" },
  { icon: "◈", title: "Custom Parts", desc: "Functional components for engineering, automotive, aerospace. Tight tolerances.", tag: "Precise" },
  { icon: "◉", title: "Miniatures & Art", desc: "Ultra-fine detail resin printing for figurines, jewelry, and art pieces.", tag: "Detailed" },
  { icon: "⬢", title: "Bulk Production", desc: "Scalable runs with consistent quality. Multi-machine parallel printing.", tag: "Scalable" },
  { icon: "◇", title: "Material Consulting", desc: "PLA, ABS, PETG, TPU, Resin — we guide you to the perfect material.", tag: "Expert" },
  { icon: "◎", title: "Post-Processing", desc: "Sanding, painting, coating, and assembly. Delivery-ready finish.", tag: "Polished" },
];

interface GalleryItem {
  id: string;
  label: string;
  mat: string;
  color: string;
  h: number;
  image: string;
  desc: string;
  infill: string;
  resolution: string;
  weight: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    label: "Industrial Bracket",
    mat: "PETG",
    color: "var(--accent)",
    h: 300,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    desc: "Heavy-duty machinery mounting bracket with high shear-stress resistance.",
    infill: "40% Gyroid",
    resolution: "0.2mm Layer",
    weight: "142g"
  },
  {
    id: "gal-2",
    label: "Organic Sculpture",
    mat: "Resin",
    color: "#00E5FF",
    h: 220,
    image: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=600&q=80",
    desc: "Detailed architectural presentation sculpture with a glossy clear finish.",
    infill: "Solid (100%)",
    resolution: "0.05mm Layer (50um)",
    weight: "89g"
  },
  {
    id: "gal-3",
    label: "Mechanical Gear Assembly",
    mat: "ABS Tough",
    color: "#FF3E6C",
    h: 340,
    image: "https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?auto=format&fit=crop&w=600&q=80",
    desc: "Double herringbone gear reduction assembly designed for high torque transmission.",
    infill: "60% Grid",
    resolution: "0.15mm Layer",
    weight: "260g"
  },
  {
    id: "gal-4",
    label: "Flexible Gasket Ring",
    mat: "TPU Flex",
    color: "#A855F7",
    h: 260,
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=600&q=80",
    desc: "Compression gasket rings showing off high elasticity and fatigue durability.",
    infill: "20% Concentric",
    resolution: "0.2mm Layer",
    weight: "45g"
  },
  {
    id: "gal-5",
    label: "Carbon Drone Arm",
    mat: "Carbon PLA",
    color: "var(--accent)",
    h: 280,
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80",
    desc: "Reinforced drone arms featuring carbon fiber filaments for supreme stiffness.",
    infill: "50% Grid",
    resolution: "0.15mm Layer",
    weight: "68g"
  },
  {
    id: "gal-6",
    label: "Jewelry Mold Frame",
    mat: "Castable Resin",
    color: "#10B981",
    h: 320,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    desc: "Micro-casting mold framework for precise precious metal casting projects.",
    infill: "Solid (100%)",
    resolution: "0.025mm Layer (25um)",
    weight: "12g"
  }
];


const STATS = [
  { val: 1200, label: "Prints Delivered", suffix: "+" },
  { val: 98, label: "Satisfaction Rate", suffix: "%" },
  { val: 24, label: "Hour Turnaround", suffix: "hr" },
  { val: 15, label: "Materials Available", suffix: "" },
];

function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return count;
}

interface StatCardProps {
  val: number;
  label: string;
  suffix: string;
  trigger: boolean;
}

function StatCard({ val, label, suffix, trigger }: StatCardProps) {
  const count = useCountUp(val, 1800, trigger);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, fontFamily: "'Rajdhani', sans-serif", color: "var(--accent)", lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "0.85rem", color: "#888", marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

interface TiltCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function TiltCard({ children, style }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    ref.current.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  };
  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
  };
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: "transform 0.15s ease", willChange: "transform", ...style }}>
      {children}
    </div>
  );
}

function Printer3D() {
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAngle(a => (a + 0.5) % 360), 16);
    return () => clearInterval(id);
  }, []);
  const rad = (a: number) => (a * Math.PI) / 180;
  const r = 80;
  const points = 8;
  const hexPoints = Array.from({ length: points }, (_, i) => {
    const a = rad((360 / points) * i + angle);
    return `${120 + r * Math.cos(a)},${120 + r * Math.sin(a) * 0.4}`;
  }).join(" ");
  const printY = 90 + 30 * Math.sin(rad(angle * 2));
  return (
    <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ filter: "drop-shadow(0 0 30px rgba(var(--accent-rgb), 0.35))" }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="200" rx="90" ry="15" fill="url(#glow)" />
      <polygon points={hexPoints} fill="none" stroke="rgba(var(--accent-rgb), 0.4)" strokeWidth="1" />
      {Array.from({ length: points }, (_, i) => {
        const a = rad((360 / points) * i + angle);
        const x = 120 + r * Math.cos(a);
        const y = 120 + r * Math.sin(a) * 0.4;
        return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="rgba(var(--accent-rgb), 0.2)" strokeWidth="0.5" />;
      })}
      <rect x="80" y="150" width="80" height="50" rx="4" fill="#111" stroke="#333" strokeWidth="1" />
      <rect x="88" y="158" width="64" height="34" rx="2" fill="#0A0A0A" stroke="rgba(var(--accent-rgb), 0.3)" strokeWidth="0.5" />
      <rect x="110" y="140" width="4" height="30" fill="#222" />
      <rect x="126" y="140" width="4" height="30" fill="#222" />
      <rect x="100" y="138" width="40" height="5" rx="2" fill="#1A1A1A" stroke="#444" strokeWidth="0.5" />
      <rect x="108" y={printY} width="24" height="3" rx="1" fill="var(--accent-secondary, #00E5FF)" opacity="0.8" />
      <circle cx="120" cy={printY + 1.5} r="2" fill="var(--accent)" />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={92 + i * 16} y={165 + i * 6} width="12" height="2" rx="1"
          fill="var(--accent)" opacity={0.3 + i * 0.15} />
      ))}
      <circle cx="120" cy="120" r="5" fill="var(--accent)" opacity="0.6" />
      <circle cx="120" cy="120" r="10" fill="none" stroke="rgba(var(--accent-rgb), 0.2)" strokeWidth="1" />
    </svg>
  );
}

interface NavBarProps {
  active?: string;
  onStartProject: () => void;
}

function NavBar({ active, onStartProject }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMobileOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #1a1a1a" : "none",
        transition: "all 0.4s ease",
        padding: "0 5%",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--accent)", letterSpacing: "0.05em" }}>
            UNIQUE<span style={{ color: "#fff" }}>3D</span>PRINTERS
          </div>

          {/* Desktop links */}
          <div className="nav-links-desktop" style={{ gap: 32, alignItems: "center" }}>
            {NAV_LINKS.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: active === l ? "var(--accent)" : "#aaa", textDecoration: "none",
                fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase",
                transition: "color 0.2s",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
              }}
              >{l}</a>
            ))}
            <a href="#contact" onClick={(e) => { e.preventDefault(); onStartProject(); }} style={{
              background: "var(--accent)", color: "#fff", padding: "8px 20px",
              borderRadius: 4, fontSize: "0.8rem", textDecoration: "none",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = "#fff"; (e.target as HTMLAnchorElement).style.color = "var(--accent)"; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = "var(--accent)"; (e.target as HTMLAnchorElement).style.color = "#fff"; }}
            >Get Quote</a>
          </div>

          {/* Mobile hamburger button */}
          <button
            className="nav-hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none", border: "none", color: "#fff", cursor: "pointer",
              padding: 8, alignItems: "center", justifyContent: "center",
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mobile-nav-drawer ${mobileOpen ? "open" : ""}`}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--accent)" }}>
            UNIQUE<span style={{ color: "#fff" }}>3D</span>
          </div>
          <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: 4 }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_LINKS.map(l => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMobileOpen(false)}
              style={{
                color: "#ccc", textDecoration: "none", padding: "14px 0",
                borderBottom: "1px solid #1a1a1a",
                fontSize: "0.9rem", letterSpacing: "0.12em", textTransform: "uppercase",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
                transition: "color 0.2s",
              }}
            >{l}</a>
          ))}
        </div>
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); setMobileOpen(false); onStartProject(); }}
          style={{
            background: "var(--accent)", color: "#fff", padding: "14px 24px",
            borderRadius: 4, textDecoration: "none", textAlign: "center",
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem",
            letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 32,
            display: "block",
          }}
        >Get Quote</a>
      </div>
    </>
  );
}

function Hero({ onStartProject }: { onStartProject: () => void }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 150); }, 4000);
    return () => clearInterval(id);
  }, []);
  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 15, y: (e.clientY / window.innerHeight - 0.5) * 8 });
  };
  return (
    <section onMouseMove={handleMouse} style={{
      minHeight: "100vh", background: "#0A0A0A", display: "flex",
      alignItems: "center", position: "relative", overflow: "hidden",
      padding: "0 5%",
    }}>
      {/* Floating Canvas Particles */}
      <ParticleBackground />

      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 70% 50%, rgba(var(--accent-rgb), 0.08) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(var(--accent-rgb), 0.03) 0%, transparent 50%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#161616 1px, transparent 1px), linear-gradient(90deg, #161616 1px, transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.3,
        pointerEvents: "none"
      }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, var(--accent), transparent)", animation: "scanline 6s linear infinite", opacity: 0.3, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, paddingTop: 64, position: "relative", zIndex: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(var(--accent-rgb), 0.06)", border: "1px solid rgba(var(--accent-rgb), 0.2)", borderRadius: 999,
            padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            <span style={{ color: "var(--accent)", fontSize: "0.75rem", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
              Now Accepting Orders
            </span>
          </div>
          <div className="hero-title" style={{ position: "relative" }}>
            <h1 style={{ margin: 0 }}>
              <span className={glitch ? "glitch-text" : ""} data-text="PRINT" style={{
                display: "block",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, lineHeight: 0.95,
                fontSize: "clamp(3rem, 8vw, 6rem)", color: "#fff", margin: "0 0 8px",
                position: "relative",
              }}>PRINT</span>
              <span style={{
                display: "block",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, lineHeight: 0.95,
                fontSize: "clamp(3rem, 8vw, 6rem)", color: "var(--accent)", margin: "0 0 8px"
              }}>
                THE FUTURE
              </span>
              <span style={{
                display: "block",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, lineHeight: 0.95,
                fontSize: "clamp(3rem, 8vw, 6rem)", color: "#fff", margin: 0, WebkitTextStroke: "1px #333"
              }}>
                IN 3D
              </span>
            </h1>
          </div>
          <p className="hero-sub" style={{ color: "#666", fontSize: "1rem", maxWidth: 480, margin: "24px 0 36px", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
            Professional FDM & resin printing for makers, engineers, and artists. Precision parts, prototypes, and art pieces — delivered.
          </p>
          <div className="hero-ctas" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#contact" onClick={(e) => { e.preventDefault(); onStartProject(); }} style={{
              background: "var(--accent)", color: "#fff", padding: "14px 32px",
              borderRadius: 4, textDecoration: "none", fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = "#fff"; (e.target as HTMLAnchorElement).style.color = "var(--accent)"; (e.target as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = "var(--accent)"; (e.target as HTMLAnchorElement).style.color = "#fff"; (e.target as HTMLAnchorElement).style.transform = ""; }}
            >Start a Project</a>
            <a href="#gallery" style={{
              background: "transparent", color: "#fff", padding: "14px 32px",
              border: "1px solid #333", borderRadius: 4, textDecoration: "none",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "1rem",
              letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.borderColor = "var(--accent)"; (e.target as HTMLAnchorElement).style.color = "var(--accent)"; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.borderColor = "#333"; (e.target as HTMLAnchorElement).style.color = "#fff"; }}
            >View Gallery</a>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
            {[["1200+", "Prints"], ["24hr", "Turnaround"], ["15+", "Materials"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: "var(--accent)", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.4rem" }}>{v}</div>
                <div style={{ color: "#555", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-3d" style={{
          flex: "0 0 clamp(240px, 40vw, 380px)",
          maxWidth: 380,
          width: "100%",
          transform: `perspective(800px) rotateY(${mouse.x}deg) rotateX(${-mouse.y}deg)`,
          transition: "transform 0.1s ease",
          animation: "float 4s ease-in-out infinite",
        }}>
          <Printer3D />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" }}>
        <span style={{ color: "#444", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(var(--accent), transparent)" }} />
      </div>
    </section>
  );
}

function Services() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section id="services" style={{ background: "#0D0D0D", padding: "100px 5%" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`} style={{ marginBottom: 64 }}>
          <div style={{ color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— What We Do</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Our Services</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, background: "#1a1a1a" }}>
          {SERVICES.map((s, i) => (
            <TiltCard key={i}>
              <div style={{
                background: "#0D0D0D", padding: "36px 32px", height: "100%",
                borderBottom: "none", cursor: "default", position: "relative", overflow: "hidden",
                transition: "background 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#111"}
                onMouseLeave={e => e.currentTarget.style.background = "#0D0D0D"}
              >
                <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 2, background: "var(--accent)", transition: "width 0.4s ease" }}
                  onMouseEnter={e => (e.target as HTMLDivElement).style.width = "100%"}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: "2rem", color: "var(--accent)" }}>{s.icon}</span>
                  <span style={{ background: "rgba(var(--accent-rgb), 0.08)", color: "var(--accent)", fontSize: "0.65rem", padding: "4px 10px", borderRadius: 2, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>{s.tag}</span>
                </div>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: 1.65, margin: 0, fontFamily: "'DM Mono', monospace" }}>{s.desc}</p>
                <div style={{ marginTop: 24, color: "var(--accent)", fontSize: "0.8rem", fontFamily: "'DM Mono', monospace", opacity: 0.7 }}>→ Learn more</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("unique3d_gallery");
    return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
  });
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("unique3d_gallery", JSON.stringify(galleryItems));
  }, [galleryItems]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Ask for description details
      const label = prompt("Enter Print Title:") || "User Print Upload";
      const material = prompt("Enter Material (e.g. PLA, Resin, TPU):") || "PLA";

      const newImg: GalleryItem = {
        id: `user-${Date.now()}`,
        label,
        mat: material,
        color: material.toLowerCase().includes("resin") ? "var(--accent-secondary)" : "var(--accent)",
        h: Math.floor(Math.random() * 100) + 240, // variable random height for masonry
        image: dataUrl,
        desc: "Custom client print uploaded dynamically to showcase print bed precision.",
        infill: "30% Infill",
        resolution: "0.2mm Resolution",
        weight: "74g"
      };

      setGalleryItems([newImg, ...galleryItems]);
    };
    reader.readAsDataURL(file);
  };

  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.mat.toUpperCase().includes(activeFilter);
  });

  const openLightbox = (id: string) => {
    const index = galleryItems.findIndex((x) => x.id === id);
    setLightboxIndex(index);
    setZoomScale(1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex === 0 ? galleryItems.length - 1 : lightboxIndex - 1);
    setZoomScale(1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
    setZoomScale(1);
  };

  return (
    <section id="gallery" style={{ background: "#0A0A0A", padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div style={{ color: "var(--accent-secondary)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Our Work</div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Print Gallery</h2>
          </div>

          {/* Action and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {["ALL", "PLA", "RESIN", "PETG", "TPU"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`text-[10px] font-mono px-3 py-1.5 rounded transition-all uppercase tracking-wider border ${activeFilter === filter
                  ? "bg-[#00e5ff] text-black border-[#00e5ff] font-bold"
                  : "bg-black border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
              >
                {filter}
              </button>
            ))}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-neutral-900 border border-neutral-800 hover:border-[#ff5c00] hover:text-[#ff5c00] text-white px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus size={11} /> Add Photo
            </button>
          </div>
        </div>

        {/* Masonry Grid Layout */}
        <div className="masonry-grid">
          {filteredItems.map((g) => (
            <div
              key={g.id}
              onClick={() => openLightbox(g.id)}
              className="masonry-item relative group overflow-hidden cursor-pointer bg-[#0d0d0d] border border-neutral-950 rounded hover:border-neutral-800 transition-colors"
              style={{ height: g.h }}
            >
              <img
                src={g.image}
                alt={g.label}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between">
                {/* Top Badge */}
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <span
                    className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 rounded border"
                    style={{
                      borderColor: `${g.color}33`,
                      backgroundColor: `${g.color}15`,
                      color: g.color
                    }}
                  >
                    {g.mat}
                  </span>
                </div>

                {/* Bottom details */}
                <div>
                  <h3 className="text-sm font-bold font-sans text-white leading-tight translate-y-2 group-hover:translate-y-0 transition-transform">
                    {g.label}
                  </h3>
                  <div className="text-[10px] font-mono text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Layer: {g.resolution} • Infill: {g.infill}
                  </div>
                </div>
              </div>

              {/* View Overlay Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ff5c00]/90 text-black font-bold uppercase tracking-widest font-mono text-[9px] px-3.5 py-1.5 rounded flex items-center gap-1">
                <Maximize2 size={9} /> Inspect
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Top Bar controls */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-50">
            <span className="font-mono text-xs text-neutral-400">
              INSPECTING PRINT {lightboxIndex + 1} / {galleryItems.length}
            </span>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomScale(zoomScale === 1 ? 1.6 : 1);
                }}
                className="bg-neutral-900 border border-neutral-800 hover:border-white p-2 rounded text-neutral-400 hover:text-white"
              >
                {zoomScale > 1 ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setLightboxIndex(null)}
                className="bg-neutral-900 border border-neutral-800 hover:border-[#ff5c00] hover:text-[#ff5c00] px-3 py-1.5 rounded font-mono text-xs uppercase"
              >
                Close (ESC)
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-neutral-900/60 border border-neutral-800 hover:border-[#ff5c00] text-white p-3 rounded-full hover:scale-110 transition-all"
          >
            <ArrowLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-neutral-900/60 border border-neutral-800 hover:border-[#ff5c00] text-white p-3 rounded-full hover:scale-110 transition-all"
          >
            <ArrowRight size={20} />
          </button>

          {/* Core Image Viewer */}
          <div className="relative w-full max-w-4xl h-full max-h-[70vh] flex items-center justify-center pointer-events-none">
            <img
              src={galleryItems[lightboxIndex].image}
              alt={galleryItems[lightboxIndex].label}
              className="max-w-full max-h-full object-contain transition-transform duration-300 pointer-events-auto cursor-zoom-in"
              style={{ transform: `scale(${zoomScale})` }}
              onClick={(e) => {
                e.stopPropagation();
                setZoomScale(zoomScale === 1 ? 1.6 : 1);
              }}
            />
          </div>

          {/* Footer Metadata Drawer */}
          <div
            className="w-full max-w-3xl bg-[#0a0a0a] border border-neutral-900 p-6 rounded mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-white text-left z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="md:col-span-2">
              <h3 className="text-lg font-bold font-sans flex items-center gap-2">
                {galleryItems[lightboxIndex].label}
                <Badge
                  style={{
                    backgroundColor: `${galleryItems[lightboxIndex].color}15`,
                    borderColor: `${galleryItems[lightboxIndex].color}44`,
                    color: galleryItems[lightboxIndex].color
                  }}
                  className="font-mono text-[9px]"
                >
                  {galleryItems[lightboxIndex].mat}
                </Badge>
              </h3>
              <p className="text-xs font-mono text-neutral-400 mt-2 leading-relaxed">
                {galleryItems[lightboxIndex].desc}
              </p>
            </div>
            <div className="border-t md:border-t-0 md:border-l border-neutral-900 pt-4 md:pt-0 md:pl-6 space-y-2 font-mono text-[10px] md:text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Infill Inlay:</span>
                <span className="text-white">{galleryItems[lightboxIndex].infill}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Layer Height:</span>
                <span className="text-white">{galleryItems[lightboxIndex].resolution}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Estimated Weight:</span>
                <span className="text-white">{galleryItems[lightboxIndex].weight}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}



function ProcessSection() {
  return <RadialOrbitalTimelineDemo />;
}

function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} style={{ background: "#0A0A0A", padding: "80px 5%", borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40 }}>
        {STATS.map((s, i) => <StatCard key={i} {...s} trigger={triggered} />)}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const { ref, isVisible } = useScrollReveal(0.15);
  const items = [
    {
      icon: <Shield size={28} />,
      title: "Precision Engineering",
      desc: "±0.1mm accuracy on FDM, ±0.025mm on resin. Every print undergoes quality inspection with digital calipers and mesh analysis.",
      stat: "±0.025mm",
      statLabel: "Resin Accuracy"
    },
    {
      icon: <Clock size={28} />,
      title: "24/7 Production Floor",
      desc: "12 printers running round-the-clock across FDM, SLA, and multi-material setups. Your order never waits in queue.",
      stat: "12",
      statLabel: "Active Printers"
    },
    {
      icon: <Award size={28} />,
      title: "Certified Materials",
      desc: "ISO-grade filaments and resins with full traceability. Food-safe PLA, UV-resistant ASA, and engineering-grade Nylon.",
      stat: "ISO",
      statLabel: "Certified"
    }
  ];

  return (
    <section style={{ background: "#0A0A0A", padding: "100px 5%", position: "relative", overflow: "hidden" }}>
      <div className="gradient-divider" style={{ position: "absolute", top: 0, left: 0, right: 0 }} />
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className={`reveal-up ${isVisible ? "revealed" : ""}`} style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Why Us</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Built for Precision</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {items.map((item, i) => (
            <div
              key={i}
              className={`glass-card glass-card-hover reveal-up ${isVisible ? "revealed" : ""}`}
              style={{
                padding: "36px 32px",
                cursor: "default",
                transition: "all 0.4s ease",
                position: "relative",
                overflow: "hidden",
                animationDelay: `${(i + 1) * 0.15}s`,
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, var(--accent), transparent)", opacity: 0.5 }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ color: "var(--accent)", opacity: 0.8 }}>{item.icon}</div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--accent)", lineHeight: 1 }}>{item.stat}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.statLabel}</div>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#fff", margin: "0 0 10px" }}>{item.title}</h3>
              <p style={{ color: "#555", fontSize: "0.85rem", lineHeight: 1.7, margin: 0, fontFamily: "'DM Mono', monospace" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqAndReviews() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section style={{ background: "#0A0A0A", padding: "100px 5%", borderTop: "1px solid #1a1a1a" }}>
      <div ref={ref} style={{ maxWidth: 1200, margin: "0 auto" }} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 reveal-up ${isVisible ? "revealed" : ""}`}>
        {/* Testimonials */}
        <div>
          <div style={{ marginBottom: 40 }}>
            <div style={{ color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Client Success</div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3rem, 3.5rem)", color: "#fff", margin: 0 }}>Reviews</h2>
          </div>
          <Testimonials />
        </div>

        {/* FAQs */}
        <div>
          <div style={{ marginBottom: 40 }}>
            <div style={{ color: "var(--accent-secondary)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Support</div>
            <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3rem, 3.5rem)", color: "#fff", margin: 0 }}>FAQ</h2>
          </div>
          <FaqAccordion />
        </div>
      </div>
    </section>
  );
}

function OrderTrackerSection() {
  const { ref, isVisible } = useScrollReveal(0.1);
  return (
    <section style={{ background: "#0D0D0D", padding: "100px 5%", borderTop: "1px solid #1a1a1a" }}>
      <div ref={ref} className={`reveal-up ${isVisible ? "revealed" : ""}`} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ color: "var(--accent)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Operations</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 3rem, 3.5rem)", color: "#fff", margin: 0 }}>Track Print Progress</h2>
        </div>
        <OrderStatusTracker />
      </div>
    </section>
  );
}

interface ContactProps {
  accentColor: string;
  onStartProject: (name: string, email: string, service: string, file: File | null) => void;
}

function Contact({ accentColor, onStartProject }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "", service: "Rapid Prototyping" });
  const [stlFile, setStlFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setStlFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStlFile(file);
    }
  };

  return (
    <section id="contact" style={{ background: "#0A0A0A", padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ color: "var(--accent-secondary)", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Get In Touch</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Start a Project</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Form Fields */}
          <div className="lg:col-span-3 border border-neutral-900 p-8 bg-[#0d0d0d] rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[["Name", "name", "text", "Your name"], ["Email", "email", "email", "your@email.com"]].map(([l, k, t, ph]) => (
                <div key={k}>
                  <label className="block text-[#444] text-[10px] uppercase font-mono tracking-widest mb-2">{l}</label>
                  <input
                    type={t}
                    placeholder={ph}
                    value={form[k as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    className="w-full bg-[#050505] border border-neutral-800 rounded px-4 py-3 text-xs md:text-sm font-mono text-white outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="mb-6">
              <label className="block text-[#444] text-[10px] uppercase font-mono tracking-widest mb-2">Service</label>
              <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                className="w-full bg-[#050505] border border-neutral-800 rounded px-4 py-3 text-xs md:text-sm font-mono text-white outline-none">
                {SERVICES.map(s => <option key={s.title}>{s.title}</option>)}
              </select>
            </div>
            <div className="mb-8">
              <label className="block text-[#444] text-[10px] uppercase font-mono tracking-widest mb-2">Message</label>
              <textarea rows={5} placeholder="Describe your project specification..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full bg-[#050505] border border-neutral-800 rounded px-4 py-3 text-xs md:text-sm font-mono text-white outline-none resize-vertical focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <button onClick={() => onStartProject(form.name, form.email, form.service, stlFile)}
              className="bg-[var(--accent)] text-black border-none py-3 px-8 font-sans font-bold uppercase tracking-wider text-xs transition-colors hover:bg-white cursor-pointer"
            >Send Project Intake →</button>
          </div>

            {/* Drag & Drop STL Uploader with 3D model viewer */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-neutral-800 bg-[#0d0d0d] p-6 rounded flex flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--accent)] transition-colors relative"
              >
                <input
                  type="file"
                  accept=".stl,.obj"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <UploadCloud size={32} className="text-neutral-500 mb-3" />
                <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider">Drag &amp; Drop 3D Model</h4>
                <p className="text-[10px] text-neutral-500 font-mono mt-1">Supports STL or OBJ format (max 50MB)</p>
              </div>

              {/* 3D STL/OBJ Model Viewer Canvas */}
              <div className="flex-1 min-h-[350px]">
                <ModelViewer file={stlFile} accentColor={accentColor} />
              </div>
            </div>

          </div>
      </div>
    </section>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.includes("@")) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer style={{ background: "#080808", position: "relative" }}>
      {/* Top gradient divider */}
      <div className="gradient-divider" />

      {/* Main footer content */}
      <div style={{ padding: "64px 5% 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48 }}>
            {/* Column 1: Brand */}
            <div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--accent)", letterSpacing: "0.05em", marginBottom: 16 }}>
                UNIQUE<span style={{ color: "#fff" }}>3D</span>PRINTERS
              </div>
              <p style={{ color: "#555", fontSize: "0.8rem", lineHeight: 1.7, fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>
                Professional 3D printing services for makers, engineers, and artists. Precision-engineered parts delivered worldwide.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { name: "Instagram", icon: "📷" },
                  { name: "Twitter/X", icon: "𝕏" },
                  { name: "WhatsApp", icon: "💬" },
                  { name: "LinkedIn", icon: "🔗" },
                ].map(s => (
                  <a key={s.name} href="#" title={s.name} style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(var(--accent-rgb), 0.08)",
                    border: "1px solid rgba(var(--accent-rgb), 0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                    onMouseEnter={e => { (e.currentTarget).style.background = "var(--accent)"; (e.currentTarget).style.borderColor = "var(--accent)"; }}
                    onMouseLeave={e => { (e.currentTarget).style.background = "rgba(var(--accent-rgb), 0.08)"; (e.currentTarget).style.borderColor = "rgba(var(--accent-rgb), 0.15)"; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Quick Links</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Services", "Gallery", "Process", "Contact", "Track Order"].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`} style={{
                    color: "#555", fontSize: "0.78rem", textDecoration: "none",
                    fontFamily: "'DM Mono', monospace", transition: "color 0.2s", letterSpacing: "0.05em",
                  }}
                    onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = "var(--accent)"}
                    onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = "#555"}
                  >{l}</a>
                ))}
              </div>
            </div>

            {/* Column 3: Materials */}
            <div>
              <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Materials</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["PLA (Standard)", "ABS (Heat-Resistant)", "PETG (Durable)", "TPU (Flexible)", "Resin (Ultra-Detail)", "Carbon Fiber PLA"].map(m => (
                  <span key={m} style={{ color: "#555", fontSize: "0.78rem", fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Column 4: Contact & Newsletter */}
            <div>
              <h4 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>Contact</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#555", fontSize: "0.78rem", fontFamily: "'DM Mono', monospace" }}>
                  <Mail size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>hello@unique3dprinters.com</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#555", fontSize: "0.78rem", fontFamily: "'DM Mono', monospace" }}>
                  <Phone size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>+91 846 680 0143</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#555", fontSize: "0.78rem", fontFamily: "'DM Mono', monospace" }}>
                  <MapPin size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                  <span>Hyderabad, India</span>
                </div>
              </div>

              {/* Newsletter */}
              <div style={{ marginTop: 8 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Newsletter</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      flex: 1, background: "#111", border: "1px solid #222",
                      borderRadius: 4, padding: "8px 12px", fontSize: "0.75rem",
                      fontFamily: "'DM Mono', monospace", color: "#fff", outline: "none",
                      transition: "border-color 0.3s",
                    }}
                    onFocus={e => e.target.style.borderColor = "var(--accent)"}
                    onBlur={e => e.target.style.borderColor = "#222"}
                  />
                  <button
                    onClick={handleSubscribe}
                    style={{
                      background: "var(--accent)", border: "none", borderRadius: 4,
                      padding: "8px 12px", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--accent)"}
                  >
                    <Send size={14} style={{ color: "#000" }} />
                  </button>
                </div>
                {subscribed && (
                  <div style={{ color: "var(--accent-secondary)", fontSize: "0.65rem", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>
                    ✓ Subscribed successfully!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid #1a1a1a", padding: "20px 5%" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ color: "#333", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace" }}>
            © 2025 Unique3dPrinters. All rights reserved.
          </div>
          <div style={{ color: "#333", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace" }}>
            Built with ❤️ in Hyderabad
          </div>
        </div>
      </div>
    </footer>
  );
}

const THEMES = [
  { name: "Amber", hex: "#FF5C00", rgb: "255, 92, 0", secondary: "#00E5FF" },
  { name: "Cyan", hex: "#00E5FF", rgb: "0, 229, 255", secondary: "#10B981" },
  { name: "Green", hex: "#10B981", rgb: "16, 185, 129", secondary: "#FF5C00" }
];

export default function App() {
  const [themeIdx, setThemeIdx] = useState(() => {
    const saved = localStorage.getItem("unique3d_theme_idx");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("unique3d_theme_idx", themeIdx.toString());
    const t = THEMES[themeIdx];
    const root = document.documentElement;
    root.style.setProperty('--accent', t.hex);
    root.style.setProperty('--accent-rgb', t.rgb);
    root.style.setProperty('--accent-glow', `rgba(${t.rgb}, 0.15)`);
    root.style.setProperty('--accent-secondary', t.secondary);
  }, [themeIdx]);

  // Custom trailing cursor coordinates
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Splash Screen
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashComplete = useCallback(() => setSplashDone(true), []);

  // Back-to-top visibility
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    shippingMethod: "standard", // standard, express, teleport
    cardNum: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    material: "PLA",
    infill: 20,
    qty: 1,
    modelTemplate: "Mechanical Gear Assembly",
    fileName: ""
  });
  const [cvvFocused, setCvvFocused] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentLogs, setPaymentLogs] = useState<string[]>([]);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  const openCheckout = (name = "", email = "", service = "Rapid Prototyping", file: File | null = null) => {
    setCheckoutForm(prev => ({
      ...prev,
      name: name || prev.name,
      email: email || prev.email,
      modelTemplate: service.toLowerCase().includes("miniature") ? "Organic Desk Planter" : "Mechanical Gear Assembly",
      fileName: file ? file.name : ""
    }));
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
    setCvvFocused(false);
    setPaymentProcessing(false);
    setPaymentLogs([]);
  };

  const calculateWeight = () => {
    const volumeMap: Record<string, number> = {
      "Mechanical Gear Assembly": 120,
      "Industrial Bracket": 150,
      "Organic Desk Planter": 90
    };
    const densityMap: Record<string, number> = {
      PLA: 1.24,
      ABS: 1.05,
      PETG: 1.27,
      TPU: 1.21,
      Resin: 1.12
    };

    const vol = volumeMap[checkoutForm.modelTemplate] || 100;
    const dens = densityMap[checkoutForm.material] || 1.2;
    const baseWeight = vol * (0.2 + (checkoutForm.infill / 100) * 0.8) * dens;
    return Math.floor(baseWeight * checkoutForm.qty);
  };

  const calculateTime = () => {
    const volumeMap: Record<string, number> = {
      "Mechanical Gear Assembly": 120,
      "Industrial Bracket": 150,
      "Organic Desk Planter": 90
    };
    const vol = volumeMap[checkoutForm.modelTemplate] || 100;
    const baseTime = vol * (0.05 + (checkoutForm.infill / 100) * 0.05);
    return parseFloat((baseTime * checkoutForm.qty).toFixed(1));
  };

  const calculatePrice = () => {
    const weight = calculateWeight();
    const time = calculateTime();
    const basePrice = 300 + weight * 2.5 + time * 45;
    return Math.floor(basePrice);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.cardNum || !checkoutForm.cardName || !checkoutForm.cardExpiry || !checkoutForm.cardCvv) {
      alert("Please fill in all credit card details.");
      return;
    }

    setPaymentProcessing(true);
    setPaymentLogs(["[SYS] ESTABLISHING SECURE PORTAL CHANNEL..."]);

    const logs = [
      "[SYS] CONNECTING TO AGENTIC BLOCKCHAIN LEDGER...",
      "[GATEWAY] AUTHORIZING TRANSACTION WITH DECENTRALIZED BANK...",
      "[LEDGER] CRYPTO HASH CONFIRMED. COMPUTE STABILITY: 99.8%",
      "[SYS] SETTLING INVOICE AMOUNT...",
      "[SYS] TRANSACTION COMPLETE. INVOICE GENERATED SUCCESSFULLY."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setPaymentLogs(prev => [...prev, log]);
      }, (index + 1) * 800);
    });

    setTimeout(() => {
      const newOrderId = `ORD-${Math.floor(Math.random() * 900) + 1000}`;
      const newOrder = {
        id: newOrderId,
        client: checkoutForm.name || "Default Customer",
        item: checkoutForm.fileName || checkoutForm.modelTemplate,
        material: checkoutForm.material,
        qty: checkoutForm.qty,
        progress: 0,
        printerId: checkoutForm.material.toLowerCase().includes("resin") ? "PRINTER-03" : Math.random() > 0.5 ? "PRINTER-01" : "PRINTER-02",
        stages: [
          { label: "Received", desc: "File verified & scheduled", status: "current" },
          { label: "Slicing", desc: "Not started", status: "pending" },
          { label: "Printing", desc: "Queued", status: "pending" },
          { label: "Post-Processing", desc: "Not started", status: "pending" },
          { label: "Shipped", desc: "Awaiting dispatch", status: "pending" }
        ]
      };

      const stored = localStorage.getItem("unique3d_orders");
      const customOrders = stored ? JSON.parse(stored) : {};
      customOrders[newOrderId] = newOrder;
      localStorage.setItem("unique3d_orders", JSON.stringify(customOrders));

      setGeneratedOrderId(newOrderId);
      setCheckoutStep(4);
      setPaymentProcessing(false);
    }, 4800);
  };

  const downloadInvoice = () => {
    const subtotal = calculatePrice();
    const shippingFee = checkoutForm.shippingMethod === "express" ? 450 : checkoutForm.shippingMethod === "teleport" ? 950 : 0;
    const gst = Math.floor((subtotal + shippingFee) * 0.18);
    const total = subtotal + shippingFee + gst;

    const invoiceText = `=========================================
      UNIQUE3DPRINTERS INVOICE RECEIPT   
=========================================
Order ID: ${generatedOrderId}
Date: ${new Date().toLocaleDateString()}
Client Name: ${checkoutForm.name}
Client Email: ${checkoutForm.email}
Address: ${checkoutForm.address}, ${checkoutForm.city} - ${checkoutForm.zip}

-----------------------------------------
Specifications:
-----------------------------------------
Model Job: ${checkoutForm.fileName || checkoutForm.modelTemplate}
Material: ${checkoutForm.material}
Infill Density: ${checkoutForm.infill}%
Quantity: ${checkoutForm.qty} units
Calculated Part Weight: ${calculateWeight()}g (total)
Est. Print Time: ${calculateTime()} hrs

-----------------------------------------
Pricing Breakdown:
-----------------------------------------
Subtotal: Rs. ${subtotal.toLocaleString()}
Shipping Option: ${checkoutForm.shippingMethod.toUpperCase()} (Rs. ${shippingFee})
GST (18%): Rs. ${gst.toLocaleString()}
Total Amount Paid: Rs. ${total.toLocaleString()}

=========================================
    SATELLITE TELEMETRY ACTIVATED        
    TRACK YOUR ORDER WITH ID: ${generatedOrderId}
=========================================`;

    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_${generatedOrderId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Scroll Progress
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Detect touchscreen to disable trailing custom cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
    }

    const onMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update hover listeners on interactives for custom cursor crosshair morphing
  useEffect(() => {
    if (isTouch) return;
    const addHover = () => setIsHovering(true);
    const removeHover = () => setIsHovering(false);

    const interactives = document.querySelectorAll("a, button, [role='button'], input, select, textarea, input[type='range']");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  });

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Splash Screen */}
      {!splashDone && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Trailing Custom Cursor */}
      {!isTouch && (
        <div
          className={`custom-cursor ${isHovering ? "custom-cursor-hover" : ""}`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`
          }}
        />
      )}

      {/* WhatsApp float button */}
      <a
        href="https://wa.me/918466800143?text=Hi%20Unique3DPrinters%2C%20I%20would%20like%20to%20get%20a%20price%20quote%20on%20a%203D%20print."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[999] bg-[#25d366] hover:bg-[#128c7e] text-white p-3.5 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center animate-bounce duration-1000"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top"
      >
        <ChevronUp size={20} />
      </button>

      <NavBar onStartProject={() => openCheckout()} />
      <Hero onStartProject={() => openCheckout()} />
      <StatsSection />
      <WhyChooseUs />
      <Services />
      <Gallery />
      <ProcessSection />
      <FaqAndReviews />
      <OrderTrackerSection />
      <Contact accentColor={THEMES[themeIdx].hex} onStartProject={openCheckout} />
      <Footer />

      {/* Premium Intake Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#0b0b0b] border border-neutral-900 w-full max-w-3xl rounded shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-neutral-900 p-5">
              <div>
                <h3 className="text-sm font-sans font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-ping" />
                  Project Intake Portal
                </h3>
                <p className="text-[9px] font-mono text-neutral-500 mt-1 uppercase tracking-wider">
                  Secure Order Provisioning System v3.2
                </p>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-red-800 text-neutral-400 hover:text-red-500 px-3 py-1 rounded font-mono text-[9px] uppercase tracking-wider transition-colors"
              >
                Close (ESC)
              </button>
            </div>

            {/* Step Indicators */}
            <div className="bg-[#050505] px-6 py-3 border-b border-neutral-900 flex justify-between items-center text-[8px] font-mono tracking-widest text-neutral-500 uppercase">
              {[
                { step: 1, label: "01 / SPECIFICATIONS" },
                { step: 2, label: "02 / SHIPPING" },
                { step: 3, label: "03 / SECURE PAYMENT" },
                { step: 4, label: "04 / PORTAL RECEIPT" }
              ].map((s) => {
                const isActive = checkoutStep === s.step;
                const isPassed = checkoutStep > s.step;
                return (
                  <div key={s.step} className="flex items-center gap-1.5">
                    <span 
                      style={isActive ? { color: "var(--accent)", fontWeight: "bold" } : isPassed ? { color: "var(--accent-secondary)" } : {}}
                      className="transition-colors"
                    >
                      {s.label}
                    </span>
                    {s.step < 4 && <span className="text-neutral-800 font-normal">➔</span>}
                  </div>
                );
              })}
            </div>

            {/* Scrollable Body Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Step 1: Specs Review */}
              {checkoutStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
                  {/* Left Specs controls */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                      Customize Fabrication Job
                    </div>

                    {/* Model template choice */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-mono text-neutral-500 mb-2">Model Template</label>
                      {checkoutForm.fileName ? (
                        <div className="w-full bg-neutral-950 border border-neutral-850 rounded px-4 py-3 text-xs font-mono text-[var(--accent-secondary)]">
                          📂 Uploaded File: {checkoutForm.fileName}
                        </div>
                      ) : (
                        <select 
                          value={checkoutForm.modelTemplate}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, modelTemplate: e.target.value })}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-4 py-3 text-xs md:text-sm font-mono text-white outline-none focus:border-[var(--accent)]"
                        >
                          <option>Mechanical Gear Assembly</option>
                          <option>Industrial Bracket</option>
                          <option>Organic Desk Planter</option>
                        </select>
                      )}
                    </div>

                    {/* Material */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-mono text-neutral-500 mb-2">Material Compound</label>
                      <select 
                        value={checkoutForm.material}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, material: e.target.value })}
                        className="w-full bg-[#050505] border border-neutral-800 rounded px-4 py-3 text-xs md:text-sm font-mono text-white outline-none focus:border-[var(--accent)]"
                      >
                        <option>PLA</option>
                        <option>ABS</option>
                        <option>PETG</option>
                        <option>TPU</option>
                        <option>Resin</option>
                      </select>
                    </div>

                    {/* Infill Density Slider */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-2">
                        <span>Infill Density</span>
                        <span className="text-[var(--accent)] font-bold">{checkoutForm.infill}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={checkoutForm.infill}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, infill: parseInt(e.target.value) })}
                        className="w-full accent-[var(--accent)] bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Qty Counter */}
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-mono text-neutral-500 mb-2">Print Quantity</label>
                      <div className="flex items-center gap-3">
                        <button 
                          type="button"
                          onClick={() => setCheckoutForm({ ...checkoutForm, qty: Math.max(1, checkoutForm.qty - 1) })}
                          className="w-9 h-9 bg-neutral-950 border border-neutral-800 hover:border-white text-white rounded flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm text-white font-bold w-12 text-center">{checkoutForm.qty}</span>
                        <button 
                          type="button"
                          onClick={() => setCheckoutForm({ ...checkoutForm, qty: checkoutForm.qty + 1 })}
                          className="w-9 h-9 bg-neutral-950 border border-neutral-800 hover:border-white text-white rounded flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Specs Live Readout */}
                  <div className="md:col-span-2 space-y-4 bg-neutral-950/40 border border-neutral-900 p-5 rounded flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                        Telemetry Estimates
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                          <span>Fab Weight:</span>
                          <span className="text-white font-bold">{calculateWeight()}g</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                          <span>Build Time:</span>
                          <span className="text-white font-bold">{calculateTime()} hrs</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                          <span>Rate Base:</span>
                          <span className="text-white font-bold">PLA 1.24g/cc</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-900">
                      <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Base Fabrication Price</div>
                      <div className="text-xl font-mono font-bold text-[var(--accent)] mt-1">
                        ₹{calculatePrice().toLocaleString()}
                      </div>
                      <div className="text-[8px] font-mono text-neutral-500 mt-1 uppercase">Excl. Shipping & Taxes</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping details */}
              {checkoutStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left">
                  {/* Left Shipping Fields */}
                  <div className="md:col-span-3 space-y-4">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                      Shipping Destination
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">Recipient Name</label>
                        <input
                          type="text"
                          placeholder="Your full name"
                          value={checkoutForm.name}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">Satellite Email</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">Street Address</label>
                      <input
                        type="text"
                        placeholder="Unit, street, colony name"
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={checkoutForm.city}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">ZIP Code</label>
                        <input
                          type="text"
                          placeholder="500081"
                          value={checkoutForm.zip}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, zip: e.target.value })}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Shipping Selection list */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                      Courier Dispatch Class
                    </div>

                    <div className="space-y-2">
                      {[
                        { id: "standard", name: "Standard Cargo", price: 0, desc: "3 - 5 days, economy queue" },
                        { id: "express", name: "Cyber-Express Jet", price: 450, desc: "Next-Day Air priority queue" },
                        { id: "teleport", name: "Quantum Same-Day", price: 950, desc: "Immediate print & courier teleport" }
                      ].map((ship) => (
                        <div
                          key={ship.id}
                          onClick={() => setCheckoutForm({ ...checkoutForm, shippingMethod: ship.id })}
                          style={{
                            borderColor: checkoutForm.shippingMethod === ship.id ? "var(--accent)" : "rgb(23, 23, 23)",
                            backgroundColor: checkoutForm.shippingMethod === ship.id ? "rgba(var(--accent-rgb), 0.03)" : "transparent"
                          }}
                          className="border rounded p-3 text-left cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-white">
                            <span>{ship.name}</span>
                            <span className="text-[var(--accent-secondary)]">
                              {ship.price === 0 ? "FREE" : `+₹${ship.price}`}
                            </span>
                          </div>
                          <div className="text-[8px] font-mono text-neutral-600 mt-1">{ship.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Secure Card Payment */}
              {checkoutStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-left relative min-h-[300px]">
                  
                  {/* Processing Overlay Screen */}
                  {paymentProcessing && (
                    <div className="absolute inset-0 bg-[#0A0A0A]/95 z-30 flex flex-col justify-center p-6 space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-[var(--accent)] animate-spin" />
                        <span className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                          Securing Terminal Ledger...
                        </span>
                      </div>
                      
                      {/* Interactive scrolling logs */}
                      <div className="bg-[#030303] border border-neutral-900 rounded p-4 h-48 font-mono text-[9px] text-green-500 overflow-y-auto space-y-2">
                        {paymentLogs.map((log, i) => (
                          <div key={i} className="animate-fadeIn">{log}</div>
                        ))}
                        <div className="w-2 h-3.5 bg-green-500 animate-blink inline-block" />
                      </div>
                    </div>
                  )}

                  {/* Left 3D Credit Card Panel */}
                  <div className="md:col-span-2 flex items-center justify-center p-4">
                    <div className="w-[300px] h-[190px] perspective-1000">
                      {/* Inner flipped container */}
                      <div 
                        style={{
                          transform: cvvFocused ? "rotateY(180deg)" : "rotateY(0deg)"
                        }}
                        className="w-full h-full rounded-xl transition-transform duration-700 preserve-3d relative cursor-pointer"
                      >
                        {/* CARD FRONT */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-neutral-900 to-neutral-950 border border-white/10 rounded-xl p-5 flex flex-col justify-between backface-hidden shadow-2xl">
                          <div className="flex justify-between items-start">
                            {/* Gold chip */}
                            <div className="w-9 h-7 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md opacity-75 shadow-md" />
                            {/* Neon network indicator */}
                            <span style={{ color: "var(--accent)" }} className="font-sans font-bold italic text-sm tracking-tighter">
                              VISA
                            </span>
                          </div>
                          
                          {/* Card Number display */}
                          <div className="font-mono text-sm text-neutral-300 tracking-[0.2em] font-bold text-center py-2">
                            {checkoutForm.cardNum || "•••• •••• •••• ••••"}
                          </div>

                          <div className="flex justify-between items-end">
                            <div className="text-left font-mono">
                              <span className="text-[6px] text-neutral-600 uppercase block tracking-wider">Card Holder</span>
                              <span className="text-[10px] text-neutral-300 font-bold tracking-wide uppercase truncate max-w-[120px] block">
                                {checkoutForm.cardName || "YOUR NAME"}
                              </span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-[6px] text-neutral-600 uppercase block tracking-wider">Expires</span>
                              <span className="text-[10px] text-neutral-300 font-bold block">
                                {checkoutForm.cardExpiry || "MM/YY"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CARD BACK */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/10 rounded-xl p-5 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl">
                          <div className="w-full h-8 bg-neutral-800 -mx-5 mt-1" />
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-7 bg-white/20 rounded flex items-center justify-end px-3 font-mono text-xs italic text-white/50 tracking-wider">
                              Signature Strip
                            </div>
                            <div className="w-12 h-7 bg-white text-black font-mono text-xs font-bold flex items-center justify-center italic">
                              {checkoutForm.cardCvv || "•••"}
                            </div>
                          </div>

                          <div className="text-[6px] font-mono text-neutral-600 text-left">
                            This card is linked to Decentralized Cryptographic Ledger. Authorizations bypass standard clearing houses.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Card Payment Form Fields */}
                  <form onSubmit={processPayment} className="md:col-span-3 space-y-4">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                      Card Billing details
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">Card Number</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4111 2222 3333 4444"
                        value={checkoutForm.cardNum}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardNum: formatCardNumber(e.target.value) })}
                        className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={checkoutForm.cardName}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, cardName: e.target.value })}
                        className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">Expiry Date</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={checkoutForm.cardExpiry}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, cardExpiry: formatExpiry(e.target.value) })}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase font-mono tracking-widest text-neutral-500 mb-1.5">CVV Code</label>
                        <input
                          type="text"
                          maxLength={3}
                          placeholder="123"
                          value={checkoutForm.cardCvv}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, cardCvv: e.target.value.replace(/[^0-9]/g, "") })}
                          onFocus={() => setCvvFocused(true)}
                          onBlur={() => setCvvFocused(false)}
                          className="w-full bg-[#050505] border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 4: Success Receipt */}
              {checkoutStep === 4 && (
                <div className="space-y-6 text-center py-4">
                  <div className="relative w-14 h-14 mx-auto flex items-center justify-center rounded-full border border-green-800 bg-[#050505]">
                    <CheckCircle2 className="w-7 h-7 text-green-400 animate-scaleIn" />
                    <div className="absolute inset-0 rounded-full border border-green-400 opacity-20 scale-110 animate-ping" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-sans font-bold text-white uppercase tracking-widest">
                      Provisioning Socket Connected!
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-mono leading-relaxed max-w-md mx-auto">
                      Order successfully processed. Telemetry satellite link generated with reference key:
                      <span className="text-[var(--accent)] block text-xs font-bold mt-1 font-mono tracking-widest">
                        {generatedOrderId}
                      </span>
                    </p>
                  </div>

                  {/* Pricing breakout summary */}
                  <div className="max-w-md mx-auto bg-neutral-950 p-4 border border-neutral-900 rounded text-left text-[10px] font-mono space-y-2 text-neutral-400">
                    <div className="flex justify-between border-b border-neutral-900 pb-2">
                      <span>Item: {checkoutForm.fileName || checkoutForm.modelTemplate}</span>
                      <span className="text-white">Qty: {checkoutForm.qty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-white">Rs. {calculatePrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Option ({checkoutForm.shippingMethod.toUpperCase()}):</span>
                      <span className="text-white">
                        Rs. {(checkoutForm.shippingMethod === "express" ? 450 : checkoutForm.shippingMethod === "teleport" ? 950 : 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span className="text-white">
                        Rs. {Math.floor((calculatePrice() + (checkoutForm.shippingMethod === "express" ? 450 : checkoutForm.shippingMethod === "teleport" ? 950 : 0)) * 0.18).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-900 pt-2 text-xs font-bold text-[var(--accent-secondary)]">
                      <span>Total Invoice Paid:</span>
                      <span>
                        Rs. {(
                          calculatePrice() + 
                          (checkoutForm.shippingMethod === "express" ? 450 : checkoutForm.shippingMethod === "teleport" ? 950 : 0) +
                          Math.floor((calculatePrice() + (checkoutForm.shippingMethod === "express" ? 450 : checkoutForm.shippingMethod === "teleport" ? 950 : 0)) * 0.18)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center max-w-sm mx-auto pt-2">
                    <Button 
                      onClick={downloadInvoice}
                      className="flex-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-white text-white font-mono text-[9px] uppercase tracking-wider h-9"
                    >
                      Download Receipt
                    </Button>
                    <Button 
                      onClick={() => setIsCheckoutOpen(false)}
                      className="flex-1 bg-[var(--accent)] hover:bg-white text-black font-bold font-mono text-[9px] uppercase tracking-wider h-9"
                    >
                      Close Portal
                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Navigation Controls */}
            {checkoutStep < 4 && (
              <div className="bg-[#050505] p-4 border-t border-neutral-900 flex justify-between">
                <Button
                  disabled={checkoutStep === 1 || paymentProcessing}
                  onClick={() => setCheckoutStep(checkoutStep - 1)}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-white text-white font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 px-4"
                >
                  Back
                </Button>

                {checkoutStep < 3 ? (
                  <Button
                    onClick={() => {
                      if (checkoutStep === 2 && (!checkoutForm.name || !checkoutForm.email || !checkoutForm.address || !checkoutForm.city || !checkoutForm.zip)) {
                        alert("Please fill in all shipping fields before continuing.");
                        return;
                      }
                      setCheckoutStep(checkoutStep + 1);
                    }}
                    className="bg-[var(--accent)] hover:bg-white text-black font-bold font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 px-4"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={processPayment}
                    disabled={paymentProcessing}
                    className="bg-[var(--accent)] hover:bg-white text-black font-bold font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 px-4"
                  >
                    {paymentProcessing ? "Processing..." : "Authorize Secure Payment"}
                  </Button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Theme Customizer */}
      <div style={{
        position: "fixed", bottom: "24px", left: "24px", zIndex: 999,
        background: "rgba(10, 10, 10, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "8px",
        padding: "8px 12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
      }}>
        <span style={{ fontSize: "9px", fontFamily: "'DM Mono', monospace", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Accent Theme
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          {THEMES.map((theme, idx) => (
            <button
              key={theme.name}
              onClick={() => setThemeIdx(idx)}
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: theme.hex,
                border: themeIdx === idx ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                cursor: "pointer",
                padding: 0,
                transform: themeIdx === idx ? "scale(1.1)" : "scale(1)",
                boxShadow: themeIdx === idx ? `0 0 10px ${theme.hex}` : "none",
                transition: "all 0.2s ease"
              }}
              title={`${theme.name} Theme`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import "./App.css";
import { RadialOrbitalTimelineDemo } from "@/components/ui/demo";

const NAV_LINKS = ["Services", "Gallery", "Process", "Pricing", "Contact"];

const SERVICES = [
  { icon: "⬡", title: "Rapid Prototyping", desc: "From concept to physical model in under 24 hours. High-detail FDM & resin prints.", tag: "Fast" },
  { icon: "◈", title: "Custom Parts", desc: "Functional components for engineering, automotive, aerospace. Tight tolerances.", tag: "Precise" },
  { icon: "◉", title: "Miniatures & Art", desc: "Ultra-fine detail resin printing for figurines, jewelry, and art pieces.", tag: "Detailed" },
  { icon: "⬢", title: "Bulk Production", desc: "Scalable runs with consistent quality. Multi-machine parallel printing.", tag: "Scalable" },
  { icon: "◇", title: "Material Consulting", desc: "PLA, ABS, PETG, TPU, Resin — we guide you to the perfect material.", tag: "Expert" },
  { icon: "◎", title: "Post-Processing", desc: "Sanding, painting, coating, and assembly. Delivery-ready finish.", tag: "Polished" },
];

const GALLERY = [
  { label: "Industrial Bracket", mat: "PETG", color: "#FF5C00", h: 220 },
  { label: "Organic Sculpture", mat: "Resin", color: "#00E5FF", h: 180 },
  { label: "Gear Assembly", mat: "ABS", color: "#FF5C00", h: 200 },
  { label: "Miniature City", mat: "Resin", color: "#00E5FF", h: 240 },
  { label: "Drone Frame", mat: "Carbon PLA", color: "#FF5C00", h: 190 },
  { label: "Jewelry Mold", mat: "Castable Resin", color: "#00E5FF", h: 210 },
];

const PLANS = [
  { name: "Maker", price: "₹499", per: "per item", feats: ["Up to 10×10×10 cm", "PLA / PETG only", "48hr turnaround", "1 revision"], accent: false },
  { name: "Pro", price: "₹1,299", per: "per item", feats: ["Up to 20×20×20 cm", "All materials", "24hr turnaround", "3 revisions", "Post-processing"], accent: true },
  { name: "Enterprise", price: "Custom", per: "quote", feats: ["Unlimited size", "All materials", "Priority queue", "Unlimited revisions", "Dedicated manager"], accent: false },
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
      <div style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, fontFamily: "'Rajdhani', sans-serif", color: "#FF5C00", lineHeight: 1 }}>
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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    ref.current.style.transform = `perspective(600px) rotateX(${y}deg) rotateY(${x}deg) scale(1.04)`;
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
    <svg viewBox="0 0 240 240" width="100%" height="100%" style={{ filter: "drop-shadow(0 0 30px #FF5C0055)" }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF5C00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF5C00" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="200" rx="90" ry="15" fill="url(#glow)" />
      <polygon points={hexPoints} fill="none" stroke="#FF5C0066" strokeWidth="1" />
      {Array.from({ length: points }, (_, i) => {
        const a = rad((360 / points) * i + angle);
        const x = 120 + r * Math.cos(a);
        const y = 120 + r * Math.sin(a) * 0.4;
        return <line key={i} x1="120" y1="120" x2={x} y2={y} stroke="#FF5C0033" strokeWidth="0.5" />;
      })}
      <rect x="80" y="150" width="80" height="50" rx="4" fill="#111" stroke="#333" strokeWidth="1" />
      <rect x="88" y="158" width="64" height="34" rx="2" fill="#0A0A0A" stroke="#FF5C0055" strokeWidth="0.5" />
      <rect x="110" y="140" width="4" height="30" fill="#222" />
      <rect x="126" y="140" width="4" height="30" fill="#222" />
      <rect x="100" y="138" width="40" height="5" rx="2" fill="#1A1A1A" stroke="#444" strokeWidth="0.5" />
      <rect x="108" y={printY} width="24" height="3" rx="1" fill="#00E5FF" opacity="0.8" />
      <circle cx="120" cy={printY + 1.5} r="2" fill="#FF5C00" />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={92 + i * 16} y={165 + i * 6} width="12" height="2" rx="1"
          fill="#FF5C00" opacity={0.3 + i * 0.15} />
      ))}
      <circle cx="120" cy="120" r="5" fill="#FF5C00" opacity="0.6" />
      <circle cx="120" cy="120" r="10" fill="none" stroke="#FF5C0033" strokeWidth="1" />
    </svg>
  );
}

interface NavBarProps {
  active?: string;
}

function NavBar({ active }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(10,10,10,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #1a1a1a" : "none",
      transition: "all 0.4s ease",
      padding: "0 5%",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#FF5C00", letterSpacing: "0.05em" }}>
          UNIQUE<span style={{ color: "#fff" }}>3D</span>PRINTERS
        </div>
        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              color: active === l ? "#FF5C00" : "#aaa", textDecoration: "none",
              fontSize: "0.85rem", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "color 0.2s",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600,
            }}
              onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = "#FF5C00"}
              onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = active === l ? "#FF5C00" : "#aaa"}
            >{l}</a>
          ))}
          <a href="#contact" style={{
            background: "#FF5C00", color: "#fff", padding: "8px 20px",
            borderRadius: 4, fontSize: "0.8rem", textDecoration: "none",
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", transition: "all 0.2s",
          }}
            onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = "#fff"; (e.target as HTMLAnchorElement).style.color = "#FF5C00"; }}
            onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = "#FF5C00"; (e.target as HTMLAnchorElement).style.color = "#fff"; }}
          >Get Quote</a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 150); }, 4000);
    return () => clearInterval(id);
  }, []);
  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 10 });
  };
  return (
    <section onMouseMove={handleMouse} style={{
      minHeight: "100vh", background: "#0A0A0A", display: "flex",
      alignItems: "center", position: "relative", overflow: "hidden",
      padding: "0 5%",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 70% 50%, #FF5C0015 0%, transparent 60%), radial-gradient(circle at 10% 80%, #00E5FF08 0%, transparent 50%)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)",
        backgroundSize: "60px 60px", opacity: 0.3,
      }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #FF5C00, transparent)", animation: "scanline 6s linear infinite", opacity: 0.5 }} />
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40, paddingTop: 64 }}>
        <div style={{ flex: 1 }}>
          <div className="hero-badge" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#FF5C0015", border: "1px solid #FF5C0044", borderRadius: 999,
            padding: "6px 16px", marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF5C00", display: "inline-block", animation: "pulse 1.5s infinite" }} />
            <span style={{ color: "#FF5C00", fontSize: "0.75rem", letterSpacing: "0.12em", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
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
                fontSize: "clamp(3rem, 8vw, 6rem)", color: "#FF5C00", margin: "0 0 8px"
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
            <a href="#contact" style={{
              background: "#FF5C00", color: "#fff", padding: "14px 32px",
              borderRadius: 4, textDecoration: "none", fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em", textTransform: "uppercase",
              transition: "all 0.2s", display: "inline-block",
            }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = "#fff"; (e.target as HTMLAnchorElement).style.color = "#FF5C00"; (e.target as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = "#FF5C00"; (e.target as HTMLAnchorElement).style.color = "#fff"; (e.target as HTMLAnchorElement).style.transform = ""; }}
            >Start a Project</a>
            <a href="#gallery" style={{
              background: "transparent", color: "#fff", padding: "14px 32px",
              border: "1px solid #333", borderRadius: 4, textDecoration: "none",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "1rem",
              letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.2s",
            }}
              onMouseEnter={e => { (e.target as HTMLAnchorElement).style.borderColor = "#FF5C00"; (e.target as HTMLAnchorElement).style.color = "#FF5C00"; }}
              onMouseLeave={e => { (e.target as HTMLAnchorElement).style.borderColor = "#333"; (e.target as HTMLAnchorElement).style.color = "#fff"; }}
            >View Gallery</a>
          </div>
          <div style={{ display: "flex", gap: 32, marginTop: 48, flexWrap: "wrap" }}>
            {[["1200+", "Prints"], ["24hr", "Turnaround"], ["15+", "Materials"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: "#FF5C00", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.4rem" }}>{v}</div>
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
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#444", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>scroll</span>
        <div style={{ width: 1, height: 40, background: "linear-gradient(#FF5C00, transparent)" }} />
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" style={{ background: "#0D0D0D", padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ color: "#FF5C00", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— What We Do</div>
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
                <div style={{ position: "absolute", top: 0, left: 0, width: 0, height: 2, background: "#FF5C00", transition: "width 0.4s ease" }}
                  onMouseEnter={e => (e.target as HTMLDivElement).style.width = "100%"}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: "2rem", color: "#FF5C00" }}>{s.icon}</span>
                  <span style={{ background: "#FF5C0015", color: "#FF5C00", fontSize: "0.65rem", padding: "4px 10px", borderRadius: 2, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>{s.tag}</span>
                </div>
                <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#fff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ color: "#555", fontSize: "0.9rem", lineHeight: 1.65, margin: 0, fontFamily: "'DM Mono', monospace" }}>{s.desc}</p>
                <div style={{ marginTop: 24, color: "#FF5C00", fontSize: "0.8rem", fontFamily: "'DM Mono', monospace", opacity: 0.7 }}>→ Learn more</div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="gallery" style={{ background: "#0A0A0A", padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <div style={{ color: "#00E5FF", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Our Work</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Print Gallery</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
          {GALLERY.map((g, i) => (
            <div key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative", overflow: "hidden", cursor: "pointer",
                height: g.h, background: "#111",
                transform: hovered === i ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
              }}>
              <div style={{
                position: "absolute", inset: 0,
                background: hovered === i
                  ? `linear-gradient(135deg, ${g.color}22, #0A0A0A)`
                  : "linear-gradient(135deg, #1a1a1a, #0A0A0A)",
                transition: "background 0.4s ease",
              }} />
              <svg viewBox="0 0 280 240" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: hovered === i ? 0.15 : 0.05, transition: "opacity 0.4s" }}>
                {Array.from({ length: 5 }, (_, r) => (
                  Array.from({ length: 5 }, (_, c) => (
                    <rect key={`${r}-${c}`} x={20 + c * 50} y={20 + r * 44} width={40} height={34} rx="2" fill="none" stroke={g.color} strokeWidth="0.5" />
                  ))
                ))}
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                justifyContent: "center", alignItems: "center",
              }}>
                <div style={{ width: 60, height: 60, border: `1px solid ${g.color}44`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, transition: "all 0.3s", transform: hovered === i ? "rotate(45deg) scale(1.1)" : "rotate(0deg)" }}>
                  <div style={{ width: 20, height: 20, background: g.color, opacity: 0.6, borderRadius: 2 }} />
                </div>
                <div style={{ color: "#fff", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", textAlign: "center" }}>{g.label}</div>
                <div style={{ color: g.color, fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", marginTop: 4, letterSpacing: "0.1em" }}>{g.mat}</div>
              </div>
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: hovered === i ? "100%" : "0%",
                background: `${g.color}11`, transition: "height 0.4s ease",
                borderTop: `1px solid ${g.color}33`,
              }} />
              {hovered === i && (
                <div style={{ position: "absolute", top: 12, right: 12, background: g.color, color: "#fff", fontSize: "0.65rem", padding: "4px 10px", borderRadius: 2, fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>VIEW</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" style={{ background: "#000000", padding: "100px 0", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 5%", marginBottom: 32 }}>
        <div>
          <div style={{ color: "#FF5C00", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Interactive Roadmap</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Our 3D Printing Process</h2>
        </div>
      </div>
      <div style={{ width: "100%", height: "80vh", minHeight: "650px", position: "relative" }}>
        <RadialOrbitalTimelineDemo />
      </div>
    </section>
  );
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

function Pricing() {
  return (
    <section id="pricing" style={{ background: "#0D0D0D", padding: "100px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ color: "#FF5C00", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Investment</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Pricing Plans</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
          {PLANS.map((p, i) => (
            <TiltCard key={i}>
              <div style={{
                padding: "48px 36px", border: p.accent ? "1px solid #FF5C00" : "1px solid #1a1a1a",
                background: p.accent ? "#110800" : "#0A0A0A", position: "relative", overflow: "hidden",
                transition: "transform 0.3s",
              }}>
                {p.accent && <div style={{ position: "absolute", top: 16, right: 16, background: "#FF5C00", color: "#fff", fontSize: "0.65rem", padding: "4px 10px", fontFamily: "'DM Mono', monospace", letterSpacing: "0.1em" }}>POPULAR</div>}
                {p.accent && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "#FF5C00" }} />}
                <div style={{ color: "#555", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>{p.name}</div>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "3rem", color: p.accent ? "#FF5C00" : "#fff", lineHeight: 1 }}>{p.price}</div>
                <div style={{ color: "#444", fontSize: "0.75rem", fontFamily: "'DM Mono', monospace", marginBottom: 32 }}>{p.per}</div>
                <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
                  {p.feats.map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ color: p.accent ? "#FF5C00" : "#444", fontSize: "0.8rem" }}>✓</span>
                      <span style={{ color: "#888", fontSize: "0.85rem", fontFamily: "'DM Mono', monospace" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" style={{
                  display: "block", marginTop: 36, textAlign: "center",
                  padding: "14px", background: p.accent ? "#FF5C00" : "transparent",
                  border: `1px solid ${p.accent ? "#FF5C00" : "#333"}`,
                  color: p.accent ? "#fff" : "#888",
                  textDecoration: "none", fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700, letterSpacing: "0.08em", fontSize: "0.9rem", textTransform: "uppercase",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = "#FF5C00"; (e.target as HTMLAnchorElement).style.borderColor = "#FF5C00"; (e.target as HTMLAnchorElement).style.color = "#fff"; }}
                  onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = p.accent ? "#FF5C00" : "transparent"; (e.target as HTMLAnchorElement).style.borderColor = p.accent ? "#FF5C00" : "#333"; (e.target as HTMLAnchorElement).style.color = p.accent ? "#fff" : "#888"; }}
                >Get Started</a>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "", service: "Rapid Prototyping" });
  return (
    <section id="contact" style={{ background: "#0A0A0A", padding: "100px 5%" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 64, textAlign: "center" }}>
          <div style={{ color: "#00E5FF", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>— Get In Touch</div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: 0 }}>Start a Project</h2>
        </div>
        {sent ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 24 }}>◈</div>
            <div style={{ color: "#FF5C00", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "2rem" }}>Message Sent!</div>
            <div style={{ color: "#555", fontFamily: "'DM Mono', monospace", marginTop: 12 }}>We'll reach out within 24 hours.</div>
          </div>
        ) : (
          <div style={{ border: "1px solid #1a1a1a", padding: "48px", background: "#0D0D0D" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              {[["Name", "name", "text", "Your name"], ["Email", "email", "email", "your@email.com"]].map(([l, k, t, ph]) => (
                <div key={k}>
                  <label style={{ display: "block", color: "#444", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>{l}</label>
                  <input type={t} placeholder={ph} value={form[k as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                    style={{ width: "100%", background: "#0A0A0A", border: "1px solid #1a1a1a", borderRadius: 2, padding: "12px 16px", color: "#fff", fontSize: "0.9rem", fontFamily: "'DM Mono', monospace", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = "#FF5C00"}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = "#1a1a1a"}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", color: "#444", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Service</label>
              <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                style={{ width: "100%", background: "#0A0A0A", border: "1px solid #1a1a1a", borderRadius: 2, padding: "12px 16px", color: "#fff", fontSize: "0.9rem", fontFamily: "'DM Mono', monospace", outline: "none" }}>
                {SERVICES.map(s => <option key={s.title}>{s.title}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", color: "#444", fontSize: "0.7rem", fontFamily: "'DM Mono', monospace", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Message</label>
              <textarea rows={5} placeholder="Describe your project..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ width: "100%", background: "#0A0A0A", border: "1px solid #1a1a1a", borderRadius: 2, padding: "12px 16px", color: "#fff", fontSize: "0.9rem", fontFamily: "'DM Mono', monospace", resize: "vertical", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" }}
                onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "#FF5C00"}
                onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "#1a1a1a"}
              />
            </div>
            <button onClick={() => setSent(true)}
              style={{
                background: "#FF5C00", color: "#fff", border: "none", padding: "16px 48px",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem",
                letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = "#fff"; (e.target as HTMLButtonElement).style.color = "#FF5C00"; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "#FF5C00"; (e.target as HTMLButtonElement).style.color = "#fff"; }}
            >Send Message →</button>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0D0D0D", borderTop: "1px solid #1a1a1a", padding: "48px 5%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#FF5C00" }}>
          UNIQUE<span style={{ color: "#444" }}>3D</span>PRINTERS
        </div>
        <div style={{ color: "#333", fontSize: "0.75rem", fontFamily: "'DM Mono', monospace" }}>© 2025 Unique3dPrinters. All rights reserved.</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Instagram", "Twitter", "WhatsApp"].map(s => (
            <a key={s} href="#" style={{ color: "#333", fontSize: "0.75rem", fontFamily: "'DM Mono', monospace", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.target as HTMLAnchorElement).style.color = "#FF5C00"}
              onMouseLeave={e => (e.target as HTMLAnchorElement).style.color = "#333"}
            >{s}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <NavBar />
      <Hero />
      <StatsSection />
      <Services />
      <Gallery />
      <Process />
      <Pricing />
      <Contact />
      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  printName: string;
  material: string;
  rating: number;
  text: string;
}

const REVIEWS: Testimonial[] = [
  {
    name: "Rahul S.",
    role: "Robotics Engineer",
    printName: "Industrial Bracket",
    material: "PETG / ABS",
    rating: 5,
    text: "The mechanical brackets were printed to exact specifications. Tolerances are tight, and structural stability is outstanding for our robotic arms."
  },
  {
    name: "Priya K.",
    role: "Jewelry Designer",
    printName: "Mold Cast",
    material: "Castable Resin",
    rating: 5,
    text: "The microscopic details in the castable resin prints were jaw-dropping. Highly recommend for designers needing flawless finishes."
  },
  {
    name: "Amit P.",
    role: "Drone Pilot & Maker",
    printName: "Drone Quad Frame",
    material: "Carbon PLA",
    rating: 5,
    text: "Printed a custom frame in carbon fiber PLA. The weight-to-strength ratio is superb and turnaround was well under 24 hours!"
  },
  {
    name: "Vikram M.",
    role: "Lead Architect",
    printName: "Micro City Tower",
    material: "Resin Art",
    rating: 5,
    text: "Stunning model prints for our client presentation. The assembly fits perfectly and the double-padded shipping box kept everything intact."
  }
];

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx((prev) => (prev + 1) % REVIEWS.length);
        setIsTransitioning(false);
      }, 300);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="relative w-full overflow-hidden min-h-[180px] glass-card p-6 md:p-8 flex flex-col justify-between">
        <MessageSquare className="absolute right-6 top-6 w-16 h-16 text-neutral-900 pointer-events-none" />
        
        {/* Active Testimonial */}
        <div
          className="relative z-10 transition-all duration-500 ease-in-out"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(12px)" : "translateY(0)",
          }}
        >
          <div className="flex gap-1 mb-4">
            {Array.from({ length: REVIEWS[activeIdx].rating }).map((_, i) => (
              <Star key={i} size={14} style={{ color: "var(--accent)" }} fill="var(--accent)" />
            ))}
          </div>

          <p className="text-xs md:text-sm font-mono text-neutral-300 leading-relaxed mb-6 italic">
            "{REVIEWS[activeIdx].text}"
          </p>

          <div className="flex justify-between items-end border-t border-neutral-900 pt-4">
            <div>
              <div className="text-xs md:text-sm font-bold text-white font-sans">{REVIEWS[activeIdx].name}</div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono mt-0.5">{REVIEWS[activeIdx].role}</div>
            </div>
            <div className="text-right">
              <span
                className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-semibold"
                style={{
                  backgroundColor: "rgba(var(--accent-rgb), 0.08)",
                  borderColor: "rgba(var(--accent-rgb), 0.2)",
                  color: "var(--accent)",
                  border: "1px solid rgba(var(--accent-rgb), 0.2)"
                }}
              >
                Ordered: {REVIEWS[activeIdx].printName} ({REVIEWS[activeIdx].material})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Dots */}
      <div className="flex gap-2 mt-6">
        {REVIEWS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActiveIdx(idx);
                setIsTransitioning(false);
              }, 300);
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: activeIdx === idx ? 24 : 8,
              height: 8,
              background: activeIdx === idx ? "var(--accent)" : "#1a1a1a",
            }}
          />
        ))}
      </div>
    </div>
  );
}

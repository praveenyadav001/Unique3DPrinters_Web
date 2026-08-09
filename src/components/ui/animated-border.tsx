"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  /** Border colors (CSS gradient stops) */
  colors?: string[];
  /** Border width in pixels */
  thickness?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Border radius */
  roundness?: number;
  /** Intensity/opacity of the glow */
  intensity?: number;
  /** Whether the border is active/featured */
  active?: boolean;
  /** Custom className */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

export function AnimatedBorder({
  colors = ["#00E5FF", "#FF5C00"],
  thickness = 1,
  speed = 1,
  roundness = 12,
  intensity = 0.5,
  active = false,
  className,
  style,
}: AnimatedBorderProps) {
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Generate CSS gradient string
  const gradientStops = colors.length > 1
    ? colors.map((c, i) => `${c} ${(i / (colors.length - 1)) * 100}%`).join(", ")
    : colors[0];

  // CSS-only animated border using conic-gradient + rotation
  // This avoids WebGL entirely and runs on GPU via CSS
  const borderStyle = {
    position: "absolute",
    inset: -thickness,
    borderRadius: roundness,
    padding: thickness,
    background: `conic-gradient(from 0deg, ${gradientStops}, ${colors[0]})`,
    WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
    WebkitMaskComposite: "xor",
    maskComposite: "exclude",
    opacity: intensity,
    animation: mounted ? `border-rotate ${8 / speed}s linear infinite` : "none",
    pointerEvents: "none",
    zIndex: 1,
    ...style,
  };

  // Inject keyframes once
  useEffect(() => {
    if (!mounted) return;
    const styleEl = document.getElementById("animated-border-keyframes");
    if (!styleEl) {
      const sheet = document.createElement("style");
      sheet.id = "animated-border-keyframes";
      sheet.textContent = `
        @keyframes border-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes border-pulse {
          0%, 100% { opacity: 0.4; filter: brightness(1); }
          50% { opacity: 1; filter: brightness(1.3); }
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 0 transparent; }
          50% { box-shadow: 0 0 20px var(--accent), inset 0 0 20px var(--accent); }
        }
      `;
      document.head.appendChild(sheet);
    }
  }, [mounted]);

  return (
    <div
      className={cn("animated-border", className)}
      style={borderStyle as React.CSSProperties}
      aria-hidden="true"
    />
  );
}

// Simpler variant: just a glowing border without rotation
export function GlowBorder({
  color = "var(--accent)",
  thickness = 1,
  roundness = 12,
  intensity = 0.5,
  pulse = false,
  active = false,
  className,
  style,
}: {
  color?: string;
  thickness?: number;
  roundness?: number;
  intensity?: number;
  pulse?: boolean;
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn("glow-border", className)}
      style={{
        position: "absolute",
        inset: -thickness,
        borderRadius: roundness,
        border: `${thickness}px solid ${color}`,
        opacity: intensity,
        boxShadow: `0 0 ${active ? 20 : 10}px ${color}`,
        animation: pulse ? "border-pulse 3s ease-in-out infinite" : "none",
        pointerEvents: "none",
        zIndex: 1,
        ...style,
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
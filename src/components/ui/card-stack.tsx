"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatedBorder } from "@/components/ui/animated-border";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card sizing */
  cardWidth?: number;
  cardHeight?: number;

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number;

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number;

  /** 3D / depth feel */
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;

  /** Active emphasis */
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;

  /** Motion */
  springStiffness?: number;
  springDamping?: number;

  /** Behavior */
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;

  /** UI */
  showDots?: boolean;
  className?: string;

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 5,

  cardWidth = 480,
  cardHeight = 280,

  overlap = 0.45,
  spreadDeg = 40,

  perspectivePx = 1000,
  depthPx = 120,
  tiltXDeg = 10,

  activeLiftPx = 18,
  activeScale = 1.02,
  inactiveScale = 0.95,

  springStiffness = 200,
  springDamping = 25,

  loop = true,
  autoAdvance = false,
  intervalMs = 4000,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next();
      },
      Math.max(700, intervalMs),
    );

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full max-w-full", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full max-w-full group/stage"
        style={{ height: Math.max(380, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <button onClick={prev} className="absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-[150] p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover/stage:opacity-100 hidden md:block">
          <ChevronLeft size={36} />
        </button>
        <button onClick={next} className="absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-[150] p-3 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all opacity-0 group-hover/stage:opacity-100 hidden md:block">
          <ChevronRight size={36} />
        </button>
        {/* background wash / spotlight (unique feel) */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-black/5 blur-3xl dark:bg-white/5"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/10 blur-3xl dark:bg-black/30"
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-end justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              // hide far-away cards cleanly
              if (!visible) return null;

              // fan geometry
              // Responsively reduce spacing if window is small, though we use hardcoded widths mostly
              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10; // subtle arc-down feel
              const z = -abs * depthPx;

              const isActive = off === 0;

              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;

              const rotateX = isActive ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: any,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);

                      // swipe logic
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-0 rounded-2xl border-[2px] overflow-hidden max-w-[90vw] group",
                    "will-change-transform select-none transition-shadow duration-500",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                    borderColor: isActive ? "var(--accent)" : "rgba(255, 92, 0, 0.3)",
                    boxShadow: isActive 
                      ? "0 0 15px rgba(255, 92, 0, 0.4), inset 0 0 8px rgba(255, 92, 0, 0.2)" 
                      : "0 0 15px rgba(255, 92, 0, 0.15)",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          y: y + 40,
                          x,
                          rotateZ,
                          rotateX,
                          scale,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: isActive ? [y + lift, y + lift - 8, y + lift] : y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                    y: isActive ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : undefined
                  }}
                  whileHover={{
                    scale: isActive ? activeScale : inactiveScale * 1.04,
                    rotateZ: isActive ? 0 : rotateZ + (off > 0 ? 2 : -2),
                    boxShadow: isActive 
                      ? "0 0 20px rgba(255, 92, 0, 0.6), inset 0 0 10px rgba(255, 92, 0, 0.3)" 
                      : "0 0 25px rgba(255, 92, 0, 0.3)"
                  }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation centered at bottom */}
      {showDots ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center">
            {items.map((it, idx) => {
              const on = idx === active;
              const isLast = idx === items.length - 1;
              return (
                <React.Fragment key={it.id}>
                  <button
                    onClick={() => setActive(idx)}
                    className="relative flex items-center justify-center h-6 w-6 group/dot"
                    aria-label={`Go to ${it.title}`}
                  >
                    <div className={cn(
                      "rounded-full transition-all duration-300",
                      on ? "h-2.5 w-2.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "h-1.5 w-1.5 bg-zinc-600 group-hover/dot:bg-zinc-400 group-hover/dot:scale-150"
                    )} />
                    {on && <div className="absolute inset-0 rounded-full border border-cyan-400/40 scale-150 animate-pulse" />}
                  </button>
                  {!isLast && (
                    <div className="w-8 sm:w-12 h-[1px] bg-zinc-800" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item, active }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full">
      <AnimatedBorder
        colors={active ? ["#00E5FF", "#FFFFFF", "#FF5C00"] : ["#00E5FF", "#FF5C00"]}
        thickness={active ? 2 : 1}
        roundness={16}
        intensity={active ? 0.7 : 0.4}
        speed={active ? 1.2 : 0.6}
        active={active}
      />
      {/* image */}
      <div className="absolute inset-0 bg-[#0A0A0A] overflow-hidden rounded-2xl">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-sm text-zinc-500">
            No image
          </div>
        )}
      </div>

      {/* subtle gradient overlay at bottom for text readability */}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        {item.tag && (
          <div className="text-xs uppercase tracking-wider text-cyan-400 font-mono mb-2">
            {item.tag}
          </div>
        )}
        <div className="truncate text-2xl font-bold text-white tracking-tight font-['Rajdhani']">
          {item.title}
        </div>
        {item.description ? (
          <div className="mt-2 line-clamp-2 text-sm text-zinc-300 font-mono">
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}

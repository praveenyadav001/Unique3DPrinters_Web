"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, MapPin, Quote, Star } from "lucide-react";
import { AnimatedBorder } from "@/components/ui/animated-border";

export interface TestimonialItem {
  text: string;
  name: string;
  role: string;
  location?: string;
  rating?: number;
  image?: string;
  featured?: boolean;
}

export interface TestimonialStat {
  value: string;
  label: string;
}

const TestimonialCard = ({ text, image, name, role, location, rating, featured }: TestimonialItem) => (
  <div className={`tcard font-clean w-full ${featured ? "featured" : ""}`}>
    <AnimatedBorder
      colors={featured ? ["#00E5FF", "#FFFFFF", "#FF5C00"] : ["#00E5FF", "#FF5C00"]}
      thickness={featured ? 2 : 1}
      roundness={20}
      intensity={featured ? 0.5 : 0.3}
      speed={featured ? 0.8 : 0.5}
      active={featured}
    />

    {rating != null && (
      <div className="tcard-rating">
        <div className="tcard-stars">
          {[...Array(5)].map((_, s) => (
            <Star
              key={s}
              size={featured ? 14 : 12}
              fill={s < rating ? "currentColor" : "none"}
              style={s < rating ? undefined : { opacity: 0.25 }}
            />
          ))}
        </div>
        <span className="tcard-score">{rating.toFixed(1)}</span>
        <span className="tcard-verified">
          <BadgeCheck size={11} /> Verified
        </span>
      </div>
    )}

    <Quote className="tcard-quote-mark" size={featured ? 34 : 28} />

    <div className="tcard-text">{text}</div>

    <div className="tcard-profile">
      {image ? (
        <img width={40} height={40} src={image} alt={name} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <div className={`testi-avatar ${featured ? "h-11 w-11 text-sm" : "h-10 w-10 text-xs"}`}>
          {name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          <span className="verified-dot p-[1px]">
            <BadgeCheck size={13} className="text-cyan-400" />
          </span>
        </div>
      )}
      <div className="flex min-w-0 flex-col">
        <div className="tcard-name">{name}</div>
        <div className="tcard-role">{role}</div>
        {location && (
          <div className="tcard-location">
            <MapPin size={9} /> {location}
          </div>
        )}
      </div>
    </div>
  </div>
);

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
  direction?: "up" | "down";
}) => (
  <div className={props.className}>
    <div
      className={`testi-scroll-col ${props.direction === "down" ? "down" : ""}`}
      style={{ "--scroll-duration": `${props.duration || 30}s` } as React.CSSProperties}
    >
      {[...new Array(2)].map((_, loop) => (
        <React.Fragment key={loop}>
          {props.testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export const TestimonialsSection = (props: {
  testimonials: TestimonialItem[];
  stats?: TestimonialStat[];
  trustedBy?: string[];
  onReadMore?: () => void;
}) => {
  const { testimonials, stats, trustedBy, onReadMore } = props;
  const colA = testimonials.filter((_, i) => i % 3 === 0);
  const colB = testimonials.filter((_, i) => i % 3 === 1);
  const colC = testimonials.filter((_, i) => i % 3 === 2);

  return (
    <section className="testimonials-premium reveal-on-scroll relative">
      <div className="testimonials-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="testimonials-header"
        >
          <div className="testimonials-eyebrow">Testimonials</div>
          <h2>What our customers say</h2>
          <p>Real feedback from makers, engineers and designers who print with us.</p>
        </motion.div>

        {trustedBy && trustedBy.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="trusted-row"
          >
            <span>Trusted by</span>
            {trustedBy.map((brand) => (
              <strong key={brand}>{brand}</strong>
            ))}
          </motion.div>
        )}

        {stats && stats.length > 0 && (
          <div className="testi-stats-grid">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                viewport={{ once: true }}
                className="testi-stat-tile"
              >
                <span className="testi-stat-value">{s.value}</span>
                <span className="testi-stat-label">{s.label}</span>
              </motion.div>
            ))}
          </div>
        )}

        <div className="testimonials-showcase">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="testi-hero-panel"
          >
            <div className="testi-hero-rating">
              <span className="testi-hero-star">
                <Star size={18} fill="currentColor" />
              </span>
              <span>4.9/5 Rating</span>
            </div>

            <div className="testi-hero-number">
              <strong>2,500+</strong>
              <span>Orders Completed</span>
            </div>

            <div className="testi-hero-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
            </div>

            <p>Trusted by engineers, students, product teams and growing print shops.</p>

            <button className="testi-read-btn" onClick={onReadMore}>
              Read More Reviews <ArrowRight size={15} />
            </button>
          </motion.div>

          <div className="testi-scroller">
            <TestimonialsColumn testimonials={colA} duration={34} direction="up" className="w-full" />
            <TestimonialsColumn testimonials={colB} duration={40} direction="down" className="w-full hidden md:block" />
            <TestimonialsColumn testimonials={colC} duration={37} direction="up" className="w-full hidden lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

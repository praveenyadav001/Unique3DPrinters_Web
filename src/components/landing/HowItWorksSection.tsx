import {
  UploadCloud, SearchCheck, Printer, Truck,
  Crosshair, CircleDollarSign, Zap, Wrench,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload STL File",
    desc: "Drag and drop your 3D models securely into our platform.",
    icon: <UploadCloud size={38} />,
    tone: "cyan",
  },
  {
    number: "02",
    title: "We Analyze",
    desc: "Our system instantly checks printability, structure, and quote accuracy.",
    icon: <SearchCheck size={38} />,
    tone: "blue",
  },
  {
    number: "03",
    title: "Printing Starts",
    desc: "Your order is sent to high-precision machines within 12 hours.",
    icon: <Printer size={38} />,
    tone: "pink",
  },
  {
    number: "04",
    title: "Delivery",
    desc: "Track your status live until your freshly printed part arrives.",
    icon: <Truck size={38} />,
    tone: "violet",
  },
];

const perks = [
  { title: "High Precision", desc: "State of the art machines.", icon: <Crosshair size={28} />, tone: "cyan" },
  { title: "Affordable Pricing", desc: "Transparent AI quoting.", icon: <CircleDollarSign size={28} />, tone: "blue" },
  { title: "Fast Turnaround", desc: "Printed in 12 hours.", icon: <Zap size={28} />, tone: "pink" },
  { title: "Custom Designs", desc: "Made exactly to spec.", icon: <Wrench size={28} />, tone: "violet" },
];

export function HowItWorksSection() {
  return (
    <section className="how-neon-section">
      <div className="how-neon-header">
        <br /><br /><br /><br />
        <h2>How It Works</h2>
        <p>From upload to your doorstep in 4 easy steps</p>
        <br /><br />
      </div>

      <div className="how-step-grid">
        {steps.map((step, index) => (
          <div className={`how-step-card how-tone-${step.tone}`} key={step.number}>
            <div className="how-step-number">{step.number}</div>
            <div className="how-step-icon">{step.icon}</div>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            {index < steps.length - 1 && (
              <ChevronRight className="how-step-arrow" size={26} aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="how-perk-grid">
        {perks.map((perk) => (
          <div className={`how-perk-card how-tone-${perk.tone}`} key={perk.title}>
            <div className="how-perk-icon">{perk.icon}</div>
            <div>
              <h3>{perk.title}</h3>
              <p>{perk.desc}</p>
            </div>
          </div>
        ))}
        <br /><br /><br /><br /><br /><br /><br />
      </div>
    </section>
  );
}

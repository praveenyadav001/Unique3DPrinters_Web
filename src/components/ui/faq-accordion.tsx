import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  { q: "What 3D file formats do you accept?", a: "We primarily accept STL, OBJ, and 3MF files. If you don't have a 3D model yet, you can upload sketches or details in our contact form, and we can model it for you." },
  { q: "What is your standard turnaround time?", a: "Standard parts are printed and dispatched within 24 hours. Bulk production runs or parts requiring advanced post-processing (sanding, painting, assembly) typically take 2-4 business days." },
  { q: "How do I choose the right printing material?", a: "PLA is best for prototypes and visual models. PETG and ABS are ideal for functional parts needing durability or heat resistance. TPU is flexible (rubber-like). Resin is perfect for ultra-high detail miniatures or jewelry molds." },
  { q: "What are your shipping rates and packaging methods?", a: "We ship worldwide using express courier services. Every print is bubble-wrapped, boxed with cushioning, and packed securely. Shipping rates are calculated based on your destination at checkout." },
  { q: "Do you inspect models before printing?", a: "Yes. Our engineering team slices every model and runs a mesh analysis to verify wall thickness, support placement, and manifold geometry. If we spot issues, we notify you before starting the run." }
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = activeIndex === idx;
        return (
          <div key={idx} className="border border-neutral-800 rounded bg-[#0d0d0d] overflow-hidden transition-all duration-300">
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full py-4 px-6 flex justify-between items-center text-left hover:bg-neutral-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle
                  size={16}
                  style={{ color: isOpen ? "var(--accent)" : "#737373" }}
                />
                <span className="font-mono text-xs md:text-sm font-semibold tracking-wide text-white">{faq.q}</span>
              </div>
              <div>
                {isOpen ? (
                  <ChevronUp size={16} style={{ color: "var(--accent)" }} />
                ) : (
                  <ChevronDown size={16} className="text-neutral-500" />
                )}
              </div>
            </button>

            {/* Collapsible Answer */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? "max-h-40 border-t border-neutral-900" : "max-h-0"
              }`}
            >
              <div className="p-5 text-xs md:text-sm text-neutral-400 font-mono leading-relaxed bg-black/40">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

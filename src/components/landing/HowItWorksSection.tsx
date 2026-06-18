import {
  UploadCloud, Settings2, CreditCard,
  Rocket, Award, Headphones, Shield, Cpu
} from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center" style={{ background: "#0A0A0A", fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Centered Container with Rigid Gap Spacing */}
      <div className="w-full max-w-[1100px] mx-auto px-6 flex flex-col items-center gap-24">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center w-full">
          <div className="text-[var(--accent)] font-bold tracking-wider uppercase mb-3 text-xs md:text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>
            SIMPLE. FAST. INTELLIGENT.
          </div>
          <h2 className="font-extrabold text-white mb-4 text-4xl md:text-5xl lg:text-6xl">
            How It Works
          </h2>
          <p className="text-zinc-400 font-medium text-sm md:text-base lg:text-lg">
            From upload to your doorstep in 4 easy steps
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative w-full">
          
          {/* Horizontal Track (Desktop only) */}
          <div className="hidden lg:block absolute top-[40px] left-[12.5%] right-[12.5%] h-1 bg-[#222222] rounded-full z-0">
            <div className="absolute top-0 left-0 h-full w-0 rounded-full" style={{ background: "var(--accent)" }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-6 relative z-10 w-full justify-items-center">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative group w-full max-w-[280px]">
              {/* Vertical Track (Mobile only) */}
              <div className="lg:hidden absolute top-20 bottom-[-64px] left-1/2 -translate-x-1/2 w-1 bg-[#222222] rounded-full -z-10" />
              
              {/* Node */}
              <div className="w-[80px] h-[80px] rounded-2xl bg-[#111111] border-2 flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] shrink-0" style={{ borderColor: "var(--accent)" }}>
                <UploadCloud size={36} style={{ color: "var(--accent)" }} />
              </div>
              
              {/* Content */}
              <div className="text-[var(--accent)] font-extrabold mb-2 text-xs md:text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>STEP 01</div>
              <h3 className="text-white font-bold mb-3 text-xl md:text-2xl">Upload & Preview</h3>
              <p className="text-zinc-400 font-medium leading-relaxed w-full text-sm md:text-base">
                Drag and drop your 3D models. Our viewer analyzes printability and detects structural issues instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative group w-full max-w-[280px]">
              {/* Vertical Track (Mobile only) */}
              <div className="lg:hidden absolute top-20 bottom-[-64px] left-1/2 -translate-x-1/2 w-1 bg-[#222222] rounded-full -z-10" />
              
              {/* Node */}
              <div className="w-[80px] h-[80px] rounded-2xl bg-[#111111] border-2 border-[#222222] flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] shrink-0">
                <Settings2 size={36} className="text-zinc-500 group-hover:text-[var(--accent)] transition-colors" />
              </div>
              
              {/* Content */}
              <div className="text-zinc-600 font-extrabold mb-2 group-hover:text-[var(--accent)] transition-colors text-xs md:text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>STEP 02</div>
              <h3 className="text-white font-bold mb-3 text-xl md:text-2xl">Customize</h3>
              <p className="text-zinc-400 font-medium leading-relaxed w-full text-sm md:text-base">
                Select from premium materials, choose colors, adjust infill density, and scale to match your project exactly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative group w-full max-w-[280px]">
              {/* Vertical Track (Mobile only) */}
              <div className="lg:hidden absolute top-20 bottom-[-64px] left-1/2 -translate-x-1/2 w-1 bg-[#222222] rounded-full -z-10" />
              
              {/* Node */}
              <div className="w-[80px] h-[80px] rounded-2xl bg-[#111111] border-2 border-[#222222] flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] shrink-0">
                <CreditCard size={36} className="text-zinc-500 group-hover:text-[var(--accent)] transition-colors" />
              </div>
              
              {/* Content */}
              <div className="text-zinc-600 font-extrabold mb-2 group-hover:text-[var(--accent)] transition-colors text-xs md:text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>STEP 03</div>
              <h3 className="text-white font-bold mb-3 text-xl md:text-2xl">Order</h3>
              <p className="text-zinc-400 font-medium leading-relaxed w-full text-sm md:text-base">
                Get instant AI-driven pricing and exact lead times. Checkout securely with our encrypted portal.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative group w-full max-w-[280px]">
              {/* Node */}
              <div className="w-[80px] h-[80px] rounded-2xl bg-[#111111] border-2 border-[#222222] flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:border-[var(--accent)] group-hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] shrink-0">
                <Rocket size={36} className="text-zinc-500 group-hover:text-[var(--accent)] transition-colors" />
              </div>
              
              {/* Content */}
              <div className="text-zinc-600 font-extrabold mb-2 group-hover:text-[var(--accent)] transition-colors text-xs md:text-sm" style={{ fontFamily: "'DM Mono', monospace" }}>STEP 04</div>
              <h3 className="text-white font-bold mb-3 text-xl md:text-2xl">Fast Delivery</h3>
              <p className="text-zinc-400 font-medium leading-relaxed w-full text-sm md:text-base">
                Our automated farm starts printing within 12 hours. Track your status live until it arrives at your doorstep.
              </p>
            </div>

          </div>
        </div>

        {/* Feature Strip */}
        <div className="w-full border-t border-[#222222] pt-12 grid grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          <div className="flex flex-col items-center text-center gap-4 max-w-[200px]">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" style={{ color: "var(--accent)" }}>
              <Shield size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-base md:text-lg leading-tight mb-1">Secure & Private</div>
              <div className="text-zinc-500 font-medium text-xs md:text-sm">Models are encrypted.</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 max-w-[200px]">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" style={{ color: "var(--accent)" }}>
              <Cpu size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-base md:text-lg leading-tight mb-1">AI-Powered</div>
              <div className="text-zinc-500 font-medium text-xs md:text-sm">Advanced algorithms.</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 max-w-[200px]">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" style={{ color: "var(--accent)" }}>
              <Award size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-base md:text-lg leading-tight mb-1">Premium Quality</div>
              <div className="text-zinc-500 font-medium text-xs md:text-sm">Industrial-grade materials.</div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-4 max-w-[200px]">
            <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" style={{ color: "var(--accent)" }}>
              <Headphones size={24} />
            </div>
            <div>
              <div className="font-bold text-white text-base md:text-lg leading-tight mb-1">24/7 Support</div>
              <div className="text-zinc-500 font-medium text-xs md:text-sm">Team is here to help.</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

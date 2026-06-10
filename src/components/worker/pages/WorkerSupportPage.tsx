import { HelpCircle, MessageSquare, FileText, ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  { q: "How do I log a maintenance issue?", a: "Navigate to the Maintenance page and click 'Log Issue'. Select the printer, describe the problem, and set the priority. A notification will be sent to the admin team." },
  { q: "What should I do if a print fails midway?", a: "Stop the print from the Printers page, clean the build plate, and log a maintenance issue if it's a hardware fault. Then update the task status back to 'Processing' and add a note about the failure." },
  { q: "How do I request more filament?", a: "Go to the Materials page and click 'Request Restock'. Select the material type and amount needed." },
  { q: "Who do I contact for payroll questions?", a: "Please submit a support ticket using the form on this page, selecting 'HR / Payroll' as the category." }
];

export default function WorkerSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Support & Help Center</h2>
        <p>Find answers to common questions or contact the admin team.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 24, alignItems: "start" }}>
        
        {/* FAQs */}
        <div>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <HelpCircle size={18} style={{ color: "var(--accent)" }} /> Frequently Asked Questions
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} className="dash-card" style={{ padding: "0" }}>
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ 
                    width: "100%", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "1rem", color: openFaq === i ? "var(--accent)" : "#ccc"
                  }}
                >
                  {faq.q}
                  <ChevronDown size={16} style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 16px", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#888", lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "32px 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={18} style={{ color: "var(--accent)" }} /> Resources & Manuals
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {["Ender 5 Pro Operation Manual", "Prusa Slicer Guidelines", "Resin Handling Safety", "Standard Operating Procedures"].map((doc, i) => (
              <a key={i} href="#" className="dash-card" style={{ padding: "16px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(var(--accent-rgb), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  <FileText size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#fff" }}>{doc}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>PDF Document</div>
                </div>
                <ExternalLink size={14} color="#666" />
              </a>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <MessageSquare size={18} style={{ color: "var(--accent)" }} /> Contact Admin
          </h3>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Ticket submitted successfully!"); }}>
            <div style={{ marginBottom: 16 }}>
              <label className="dash-label">Category</label>
              <select className="dash-select">
                <option>Technical Issue</option>
                <option>Material Request</option>
                <option>HR / Payroll</option>
                <option>Schedule Change</option>
                <option>Other</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label className="dash-label">Subject</label>
              <input className="dash-input" placeholder="Brief summary of the issue" required />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label className="dash-label">Description</label>
              <textarea 
                className="dash-input" 
                placeholder="Provide detailed information..." 
                rows={5} 
                style={{ resize: "vertical" }}
                required 
              />
            </div>
            
            <button type="submit" className="dash-btn-primary" style={{ width: "100%" }}>
              Submit Support Ticket
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

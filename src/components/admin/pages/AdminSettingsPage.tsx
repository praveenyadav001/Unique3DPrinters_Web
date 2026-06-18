import { useState, useEffect } from "react";
import { Save, Globe, Mail, Bell } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { updateSystemSettings } from "@/services/settings.service";

export default function AdminSettingsPage() {
  const { systemSettings, loading } = useSettings();
  const [activeTab, setActiveTab] = useState<"general" | "email" | "notifications">("general");
  const [formData, setFormData] = useState({
    companyName: "",
    supportEmail: "",
    defaultCurrency: "INR (₹)",
    orderPrefix: "ORD",
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPass: "",
    notifyOnNewOrder: true,
    notifyOnLowStock: true,
    notifyOnPrinterError: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      setFormData({
        companyName: systemSettings.companyName || "",
        supportEmail: systemSettings.supportEmail || "",
        defaultCurrency: systemSettings.defaultCurrency || "INR (₹)",
        orderPrefix: systemSettings.orderPrefix || "ORD",
        smtpHost: systemSettings.smtpHost || "",
        smtpPort: systemSettings.smtpPort || "",
        smtpUser: systemSettings.smtpUser || "",
        smtpPass: systemSettings.smtpPass || "",
        notifyOnNewOrder: systemSettings.notifyOnNewOrder ?? true,
        notifyOnLowStock: systemSettings.notifyOnLowStock ?? true,
        notifyOnPrinterError: systemSettings.notifyOnPrinterError ?? true,
      });
    }
  }, [systemSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSystemSettings(formData);
      alert("Settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40, color: "#666" }}>Loading settings...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>System Settings</h2>
        <p>Configure core application settings and integrations.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: 32 }}>
        
        {/* Settings Navigation */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button 
            onClick={() => setActiveTab("general")}
            className="dash-card" 
            style={{ padding: "12px 16px", textAlign: "left", borderColor: activeTab === "general" ? "var(--accent)" : "transparent", background: activeTab === "general" ? "rgba(var(--accent-rgb), 0.05)" : "transparent", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}
          >
            <Globe size={16} style={{ color: activeTab === "general" ? "var(--accent)" : "#666" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: activeTab === "general" ? 700 : 600, color: activeTab === "general" ? "#fff" : "#888" }}>General</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("email")}
            className="dash-card" 
            style={{ padding: "12px 16px", textAlign: "left", borderColor: activeTab === "email" ? "var(--accent)" : "transparent", background: activeTab === "email" ? "rgba(var(--accent-rgb), 0.05)" : "transparent", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}
          >
            <Mail size={16} style={{ color: activeTab === "email" ? "var(--accent)" : "#666" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: activeTab === "email" ? 700 : 600, color: activeTab === "email" ? "#fff" : "#888" }}>Email Servers</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("notifications")}
            className="dash-card" 
            style={{ padding: "12px 16px", textAlign: "left", borderColor: activeTab === "notifications" ? "var(--accent)" : "transparent", background: activeTab === "notifications" ? "rgba(var(--accent-rgb), 0.05)" : "transparent", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "all 0.2s" }}
          >
            <Bell size={16} style={{ color: activeTab === "notifications" ? "var(--accent)" : "#666" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: activeTab === "notifications" ? 700 : 600, color: activeTab === "notifications" ? "#fff" : "#888" }}>Notifications</span>
          </button>
        </div>

        {/* Settings Form */}
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px" }}>
            {activeTab === "general" && "General Configuration"}
            {activeTab === "email" && "Email Server (SMTP)"}
            {activeTab === "notifications" && "Notification Preferences"}
          </h3>
          
          <form onSubmit={handleSave}>
            
            {activeTab === "general" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label className="dash-label">Company Name</label>
                    <input className="dash-input" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  </div>
                  <div>
                    <label className="dash-label">Support Email</label>
                    <input className="dash-input" value={formData.supportEmail} onChange={e => setFormData({...formData, supportEmail: e.target.value})} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="dash-label">Default Currency</label>
                  <select className="dash-select" style={{ maxWidth: 200 }} value={formData.defaultCurrency} onChange={e => setFormData({...formData, defaultCurrency: e.target.value})}>
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="dash-label">Order Prefix</label>
                  <input className="dash-input" value={formData.orderPrefix} onChange={e => setFormData({...formData, orderPrefix: e.target.value})} style={{ maxWidth: 200 }} />
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", marginTop: 6 }}>
                    Orders will look like: {formData.orderPrefix}-12345
                  </p>
                </div>
              </>
            )}

            {activeTab === "email" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label className="dash-label">SMTP Host</label>
                    <input className="dash-input" placeholder="smtp.gmail.com" value={formData.smtpHost} onChange={e => setFormData({...formData, smtpHost: e.target.value})} />
                  </div>
                  <div>
                    <label className="dash-label">SMTP Port</label>
                    <input className="dash-input" placeholder="587" value={formData.smtpPort} onChange={e => setFormData({...formData, smtpPort: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  <div>
                    <label className="dash-label">SMTP Username</label>
                    <input className="dash-input" placeholder="admin@example.com" value={formData.smtpUser} onChange={e => setFormData({...formData, smtpUser: e.target.value})} />
                  </div>
                  <div>
                    <label className="dash-label">SMTP Password</label>
                    <input type="password" className="dash-input" placeholder="••••••••" value={formData.smtpPass} onChange={e => setFormData({...formData, smtpPass: e.target.value})} />
                  </div>
                </div>
                <div style={{ padding: "12px 16px", background: "rgba(var(--accent-rgb), 0.1)", border: "1px solid var(--accent)", borderRadius: 8, marginBottom: 24 }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#fff", margin: 0 }}>
                    Note: For Resend, these settings are bypassed since we use the Vercel Serverless Function directly with the API key in <code style={{ color: "var(--accent)" }}>.env</code>.
                  </p>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.notifyOnNewOrder} onChange={e => setFormData({...formData, notifyOnNewOrder: e.target.checked})} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#ccc" }}>Notify admins on new order placement</span>
                </label>
                
                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.notifyOnLowStock} onChange={e => setFormData({...formData, notifyOnLowStock: e.target.checked})} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#ccc" }}>Alert when material stock drops below 10%</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" checked={formData.notifyOnPrinterError} onChange={e => setFormData({...formData, notifyOnPrinterError: e.target.checked})} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "#ccc" }}>Alert on critical printer failure or disconnect</span>
                </label>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #1a1a1a", paddingTop: 20 }}>
              <button type="submit" className="dash-btn-primary" disabled={saving}>
                <Save size={16} /> {saving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

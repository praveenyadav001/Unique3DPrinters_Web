import { useState, useEffect } from "react";
import { Save, Globe, Mail, Bell } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { updateSystemSettings } from "@/services/settings.service";

export default function AdminSettingsPage() {
  const { systemSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    companyName: "",
    supportEmail: "",
    defaultCurrency: "INR (₹)",
    orderPrefix: "ORD"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      setFormData({
        companyName: systemSettings.companyName || "",
        supportEmail: systemSettings.supportEmail || "",
        defaultCurrency: systemSettings.defaultCurrency || "INR (₹)",
        orderPrefix: systemSettings.orderPrefix || "ORD"
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
          <button className="dash-card" style={{ padding: "12px 16px", textAlign: "left", borderColor: "var(--accent)", background: "rgba(var(--accent-rgb), 0.05)", display: "flex", alignItems: "center", gap: 12 }}>
            <Globe size={16} style={{ color: "var(--accent)" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, color: "#fff" }}>General</span>
          </button>
          <button className="dash-card" style={{ padding: "12px 16px", textAlign: "left", border: "1px solid transparent", background: "transparent", display: "flex", alignItems: "center", gap: 12 }}>
            <Mail size={16} style={{ color: "#666" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#888" }}>Email Servers</span>
          </button>
          <button className="dash-card" style={{ padding: "12px 16px", textAlign: "left", border: "1px solid transparent", background: "transparent", display: "flex", alignItems: "center", gap: 12 }}>
            <Bell size={16} style={{ color: "#666" }} />
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, color: "#888" }}>Notifications</span>
          </button>
        </div>

        {/* Settings Form */}
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px" }}>
            General Configuration
          </h3>
          
          <form onSubmit={handleSave}>
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

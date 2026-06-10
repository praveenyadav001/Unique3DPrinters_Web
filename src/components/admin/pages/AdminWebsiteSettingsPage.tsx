import { useState, useEffect } from "react";
import { Layout, Image, Palette, Save } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { updateSystemSettings } from "@/services/settings.service";

export default function AdminWebsiteSettingsPage() {
  const { systemSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    heroHeadline: "",
    heroSubheadline: "",
    primaryAccentColor: "#FF5722",
    secondaryAccentColor: "#00E5FF"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      setFormData({
        heroHeadline: systemSettings.heroHeadline || "Bring Your Ideas To Life",
        heroSubheadline: systemSettings.heroSubheadline || "Professional 3D printing services for rapid prototyping and custom manufacturing.",
        primaryAccentColor: systemSettings.primaryAccentColor || "#FF5722",
        secondaryAccentColor: systemSettings.secondaryAccentColor || "#00E5FF"
      });
    }
  }, [systemSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSystemSettings(formData);
      alert("Website appearance settings saved successfully.");
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
        <h2>Website Settings</h2>
        <p>Manage homepage content, banners, and store appearance.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Layout size={18} style={{ color: "var(--accent)" }} /> Hero Section
          </h3>
          
          <div style={{ marginBottom: 16 }}>
            <label className="dash-label">Headline</label>
            <input className="dash-input" value={formData.heroHeadline} onChange={e => setFormData({...formData, heroHeadline: e.target.value})} />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label className="dash-label">Sub-headline</label>
            <textarea className="dash-input" rows={3} style={{ resize: "vertical" }} value={formData.heroSubheadline} onChange={e => setFormData({...formData, heroSubheadline: e.target.value})} />
          </div>

          <button onClick={handleSave} disabled={saving} className="dash-btn-secondary dash-btn-small">{saving ? "Saving..." : "Update Hero Copy"}</button>
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Image size={18} style={{ color: "var(--accent)" }} /> Banners & Media
          </h3>
          
          <div className="dash-upload-zone" style={{ padding: "24px 16px", marginBottom: 20 }}>
            <Image size={24} style={{ color: "#666", marginBottom: 8 }} />
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#ccc" }}>
              Upload New Banner
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
              1920x1080px recommended. Max 2MB.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#111", border: "1px solid #222", borderRadius: 8 }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888" }}>banner-spring-promo.jpg</span>
            <span className="dash-badge dash-badge-green">Active</span>
          </div>
        </div>

        <div className="dash-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Palette size={18} style={{ color: "var(--accent)" }} /> Theme Colors
          </h3>
          
          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div>
              <label className="dash-label">Primary Accent</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: formData.primaryAccentColor, border: "2px solid #222" }} />
                <input className="dash-input" style={{ width: 120 }} value={formData.primaryAccentColor} onChange={e => setFormData({...formData, primaryAccentColor: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="dash-label">Secondary Accent</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: formData.secondaryAccentColor, border: "2px solid #222" }} />
                <input className="dash-input" style={{ width: 120 }} value={formData.secondaryAccentColor} onChange={e => setFormData({...formData, secondaryAccentColor: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, textAlign: "right" }}>
            <button onClick={handleSave} disabled={saving} className="dash-btn-primary">
              <Save size={16} /> {saving ? "Saving..." : "Save Appearance Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

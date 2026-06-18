import { useState, useEffect, useRef } from "react";
import { Layout, Image as ImageIcon, Palette, Save, UploadCloud, X, Loader2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { updateWebsiteSettings } from "@/services/settings.service";
import { uploadBannerImage } from "@/services/storage.service";

export default function AdminWebsiteSettingsPage() {
  const { websiteSettings, loading } = useSettings();
  const [formData, setFormData] = useState({
    heroHeadline: "",
    heroSubheadline: "",
    primaryAccentColor: "#FF5722",
    secondaryAccentColor: "#00E5FF",
    activeBannerURL: null as string | null
  });
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (websiteSettings) {
      setFormData({
        heroHeadline: websiteSettings.heroHeadline || "Bring Your Ideas To Life",
        heroSubheadline: websiteSettings.heroSubheadline || "Professional 3D printing services for rapid prototyping and custom manufacturing.",
        primaryAccentColor: websiteSettings.primaryAccent || "#FF5722",
        secondaryAccentColor: websiteSettings.secondaryAccent || "#00E5FF",
        activeBannerURL: websiteSettings.activeBannerURL || null
      });
    }
  }, [websiteSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWebsiteSettings({
        heroHeadline: formData.heroHeadline,
        heroSubheadline: formData.heroSubheadline,
        primaryAccent: formData.primaryAccentColor,
        secondaryAccent: formData.secondaryAccentColor,
        activeBannerURL: formData.activeBannerURL
      });
      alert("Website appearance settings saved successfully.");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadBannerImage(file);
      setFormData(prev => ({ ...prev, activeBannerURL: url }));
    } catch (err) {
      console.error("Banner upload failed:", err);
      alert("Failed to upload banner image.");
    } finally {
      setUploading(false);
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
        </div>

        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <ImageIcon size={18} style={{ color: "var(--accent)" }} /> Banners & Media
          </h3>
          
          {!formData.activeBannerURL ? (
            <div 
              className="dash-upload-zone" 
              style={{ padding: "24px 16px", marginBottom: 20, cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.5 : 1 }}
              onClick={() => !uploading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 size={24} style={{ color: "var(--accent)", marginBottom: 8, animation: "spin 1s linear infinite" }} />
              ) : (
                <UploadCloud size={24} style={{ color: "#666", marginBottom: 8 }} />
              )}
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#ccc" }}>
                {uploading ? "Uploading..." : "Upload New Banner"}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                1920x1080px recommended. Max 2MB.
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 20 }}>
              <div style={{ position: "relative", width: "100%", height: 120, borderRadius: 8, overflow: "hidden", border: "1px solid #222" }}>
                <img src={formData.activeBannerURL} alt="Hero Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, activeBannerURL: null }))}
                  style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", color: "#fff", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}
          
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileSelect} />

          {formData.activeBannerURL && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "#111", border: "1px solid #222", borderRadius: 8 }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                Current Banner Image
              </span>
              <span className="dash-badge dash-badge-green">Active</span>
            </div>
          )}
        </div>

        <div className="dash-card" style={{ gridColumn: "1 / -1" }}>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8 }}>
            <Palette size={18} style={{ color: "var(--accent)" }} /> Theme Colors
          </h3>
          
          <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
            <div>
              <label className="dash-label">Primary Accent</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: formData.primaryAccentColor, border: "2px solid #222", cursor: "pointer" }}>
                  <input type="color" value={formData.primaryAccentColor} onChange={e => setFormData({...formData, primaryAccentColor: e.target.value})} style={{ opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                </div>
                <input className="dash-input" style={{ width: 120, fontFamily: "'DM Mono', monospace" }} value={formData.primaryAccentColor} onChange={e => setFormData({...formData, primaryAccentColor: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="dash-label">Secondary Accent</label>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: formData.secondaryAccentColor, border: "2px solid #222", cursor: "pointer" }}>
                  <input type="color" value={formData.secondaryAccentColor} onChange={e => setFormData({...formData, secondaryAccentColor: e.target.value})} style={{ opacity: 0, width: "100%", height: "100%", cursor: "pointer" }} />
                </div>
                <input className="dash-input" style={{ width: 120, fontFamily: "'DM Mono', monospace" }} value={formData.secondaryAccentColor} onChange={e => setFormData({...formData, secondaryAccentColor: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ padding: "12px 16px", background: "rgba(var(--accent-rgb), 0.1)", border: "1px solid var(--accent)", borderRadius: 8, marginBottom: 24 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#fff", margin: 0 }}>
              Note: Changing theme colors here will dynamically update the <code style={{ color: "var(--accent)" }}>--accent</code> CSS variables across the store.
            </p>
          </div>

          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={handleSave} disabled={saving} className="dash-btn-primary">
              <Save size={16} /> {saving ? "Saving..." : "Save All Website Settings"}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

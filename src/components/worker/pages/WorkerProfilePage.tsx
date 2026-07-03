import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/services/auth.service";

export default function WorkerProfilePage() {
  const { user, userProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  // Local state for the form, initialized from profile
  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    city: userProfile?.city || "",
    pincode: userProfile?.pincode || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
      alert("Please enter at least your first name, last name, and phone number.");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      });
      alert("Profile updated!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>My Profile</h2>
        <p>Manage your personal information and preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}>
        
        {/* Profile Card */}
        <div className="dash-card" style={{ textAlign: "center", padding: "32px 24px" }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 16 }}>
            <div style={{
              width: 100, height: 100, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), #FF8A3D)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "2.5rem", color: "#000",
              border: "4px solid #1a1a1a", margin: "0 auto"
            }}>
              {userProfile.firstName?.[0]}{userProfile.lastName?.[0]}
            </div>
            <button style={{
              position: "absolute", bottom: 0, right: 0,
              width: 32, height: 32, borderRadius: "50%",
              background: "#222", border: "2px solid #111",
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer"
            }}>
              <Camera size={14} />
            </button>
          </div>
          
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#fff", margin: "0 0 4px" }}>
            {userProfile.displayName}
          </h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "var(--accent)", margin: "0 0 16px", textTransform: "uppercase" }}>
            {userProfile.role}
          </p>
          
          <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, border: "1px solid #1a1a1a", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Mail size={16} color="#555" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#ccc" }}>{userProfile.email}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Briefcase size={16} color="#555" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#ccc" }}>Shift: {userProfile.shift?.start || "09:00"} - {userProfile.shift?.end || "18:00"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <User size={16} color="#555" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#ccc" }}>Status: <span style={{ color: "#10B981" }}>{userProfile.status || "Online"}</span></span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="dash-card">
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px" }}>
            Personal Information
          </h3>
          
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="dash-label">First Name</label>
                <input name="firstName" className="dash-input" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div>
                <label className="dash-label">Last Name</label>
                <input name="lastName" className="dash-input" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label className="dash-label">Phone Number</label>
                <div style={{ position: "relative" }}>
                  <Phone size={14} style={{ position: "absolute", left: 14, top: 13, color: "#666" }} />
                  <input name="phone" className="dash-input" style={{ paddingLeft: 40 }} value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              <div>
                <label className="dash-label">Email Address (Read Only)</label>
                <input className="dash-input" value={userProfile.email} disabled style={{ opacity: 0.6, cursor: "not-allowed" }} />
              </div>
            </div>

            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 20px" }}>
              Address
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label className="dash-label">Street Address</label>
              <div style={{ position: "relative" }}>
                <MapPin size={14} style={{ position: "absolute", left: 14, top: 13, color: "#666" }} />
                <input name="address" className="dash-input" style={{ paddingLeft: 40 }} value={formData.address} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <label className="dash-label">City</label>
                <input name="city" className="dash-input" value={formData.city} onChange={handleChange} required />
              </div>
              <div>
                <label className="dash-label">Pincode</label>
                <input name="pincode" className="dash-input" value={formData.pincode} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #1a1a1a", paddingTop: 20 }}>
              <button type="submit" className="dash-btn-primary" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {saving ? <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

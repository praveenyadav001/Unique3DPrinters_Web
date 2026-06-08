import { useState } from "react";
import { User, Mail, Phone, MapPin, Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { updateUserProfile } from "@/services/auth.service";
import { uploadProfilePhoto } from "@/services/storage.service";

export default function ProfilePage() {
  const { user, userProfile } = useAuth();
  const { orders } = useOrders();
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [form, setForm] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    city: userProfile?.city || "",
    pincode: userProfile?.pincode || "",
  });

  const initials = `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() || "U";

  // Compute real stats
  const totalOrders = orders.length;
  const completed = orders.filter((o) => o.status === "Delivered").length;
  const inProgress = orders.filter((o) => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        firstName: form.firstName,
        lastName: form.lastName,
        displayName: `${form.firstName} ${form.lastName}`,
        phone: form.phone,
        address: form.address,
        city: form.city,
        pincode: form.pincode,
      });
      alert("Profile updated!");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!user) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploadingPhoto(true);
      try {
        const url = await uploadProfilePhoto(user.uid, file);
        await updateUserProfile(user.uid, { photoURL: url });
      } catch (err) {
        console.error("Photo upload failed:", err);
      } finally {
        setUploadingPhoto(false);
      }
    };
    input.click();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Profile</h2>
        <p>Manage your account information.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
        {/* Left - Avatar & Quick Info */}
        <div className="dash-card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ position: "relative", display: "inline-block", marginBottom: 20 }}>
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Avatar" style={{
                width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: "3px solid #222",
              }} />
            ) : (
              <div style={{
                width: 100, height: 100, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), #FF8A3D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "2rem",
                color: "#000", border: "3px solid #222",
              }}>
                {initials}
              </div>
            )}
            <button onClick={handlePhotoUpload} disabled={uploadingPhoto} style={{
              position: "absolute", bottom: 0, right: 0, width: 30, height: 30,
              borderRadius: "50%", background: "var(--accent)", border: "2px solid #111",
              color: "#000", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              {uploadingPhoto ? <Loader2 size={13} style={{ animation: "spin 0.8s linear infinite" }} /> : <Camera size={13} />}
            </button>
          </div>
          <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#fff", margin: "0 0 4px" }}>
            {form.firstName} {form.lastName}
          </h3>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", margin: "0 0 4px" }}>
            {userProfile?.role?.toUpperCase() || "CUSTOMER"}
          </p>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#444", margin: "0 0 20px" }}>
            {form.email}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: <Mail size={14} />, text: form.email || "—" },
              { icon: <Phone size={14} />, text: form.phone || "Not set" },
              { icon: <MapPin size={14} />, text: form.city || "Not set" },
            ].map((info, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#666" }}>
                <span style={{ color: "var(--accent)" }}>{info.icon}</span>
                {info.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right - Profile Form */}
        <div className="dash-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <User size={18} style={{ color: "var(--accent)" }} />
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: 0, textTransform: "uppercase" }}>
              Personal Information
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label className="dash-label">First Name</label>
              <input className="dash-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="dash-label">Last Name</label>
              <input className="dash-input" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
            <div>
              <label className="dash-label">Email Address</label>
              <input className="dash-input" type="email" value={form.email} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
            </div>
            <div>
              <label className="dash-label">Phone Number</label>
              <input className="dash-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="dash-label">Address</label>
            <textarea className="dash-input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={{ resize: "vertical", minHeight: 80 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <label className="dash-label">City</label>
              <input className="dash-input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className="dash-label">Pincode</label>
              <input className="dash-input" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="dash-btn-primary" onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {saving && <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />}
              Save Changes
            </button>
            <button className="dash-btn-secondary" onClick={() => setForm({
              firstName: userProfile?.firstName || "", lastName: userProfile?.lastName || "",
              email: userProfile?.email || "", phone: userProfile?.phone || "",
              address: userProfile?.address || "", city: userProfile?.city || "", pincode: userProfile?.pincode || "",
            })}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 24 }}>
        {[
          { label: "Total Orders", value: String(totalOrders), color: "var(--accent)" },
          { label: "Completed", value: String(completed), color: "#10B981" },
          { label: "In Progress", value: String(inProgress), color: "#EAB308" },
          { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "#00E5FF" },
        ].map((stat, i) => (
          <div key={i} className="dash-stat-mini">
            <div style={{ flex: 1 }}>
              <div className="stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

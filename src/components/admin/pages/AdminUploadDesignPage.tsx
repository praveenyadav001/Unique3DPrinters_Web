import { useState, useRef } from "react";
import { UploadCloud, Image, File, X, Check, Loader2, Plus } from "lucide-react";
import { createDesign } from "@/services/designs.service";
import { uploadDesignImage, uploadDesignModel } from "@/services/cloudinary.service";
import { useAuth } from "@/hooks/useAuth";
import { useDesigns } from "@/hooks/useDesigns";

export default function AdminUploadDesignPage() {
  const { user } = useAuth();
  const { categories } = useDesigns();

  // Form fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Home Decor");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [materials, setMaterials] = useState<string[]>(["PLA"]);
  const [colors, setColors] = useState<string[]>(["Black"]);
  const [emoji, setEmoji] = useState("📦");

  // File state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [modelFile, setModelFile] = useState<File | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);

  const AVAILABLE_MATERIALS = ["PLA", "ABS", "PETG", "TPU", "Resin"];
  const AVAILABLE_COLORS = ["Black", "White", "Red", "Blue", "Green", "Orange", "Yellow", "Gray", "Transparent"];
  const EMOJIS = ["📦", "🏠", "🔑", "🎭", "🚀", "💎", "🎨", "⚙️", "🌸", "🏆"];

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleModelSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModelFile(file);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !price) {
      setError("Design name and price are required.");
      return;
    }
    if (!user) {
      setError("You must be logged in as admin.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let imageURL = "";
      let modelURL = "";

      // Upload image if selected
      if (imageFile) {
        imageURL = await uploadDesignImage(user.uid, imageFile);
      }

      // Upload model if selected
      if (modelFile) {
        modelURL = await uploadDesignModel(user.uid, modelFile);
      }

      await createDesign({
        name: name.trim(),
        category,
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        emoji,
        imageURL,
        modelURL,
        materials,
        colors,
        isActive: true,
        createdBy: user.uid,
      });

      setSuccess(true);
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setStock("10");
      setMaterials(["PLA"]);
      setColors(["Black"]);
      setEmoji("📦");
      setImageFile(null);
      setImagePreview(null);
      setModelFile(null);
    } catch (err: any) {
      console.error("Failed to upload design:", err);
      setError(err?.message || "Failed to upload design. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="dashboard-page">
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.1)", border: "2px solid #10B981",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Check size={32} style={{ color: "#10B981" }} />
          </div>
          <h2 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff", marginBottom: 8 }}>
            Design Uploaded Successfully!
          </h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#555", marginBottom: 32 }}>
            The design is now live in your catalog and visible to customers.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="dash-btn-secondary" onClick={() => setSuccess(false)}>
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Upload New Design</h2>
        <p>Add a new 3D design to the store catalog with image, model file, and pricing.</p>
      </div>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid #EF4444",
          borderRadius: 8, padding: "12px 16px", marginBottom: 20,
          fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#EF4444",
        }}>
          ⚠ {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
        {/* Left - Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Basic Info */}
          <div className="dash-card">
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 20 }}>
              Design Info
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="dash-label">Design Name *</label>
                <input className="dash-input" placeholder="e.g. Personalized Name Plate" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="dash-label">Category</label>
                <select className="dash-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Home Decor</option>
                  <option>Accessories</option>
                  <option>Toys</option>
                  <option>Miniatures</option>
                  <option>Industrial</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="dash-label">Description</label>
              <textarea
                className="dash-input"
                placeholder="Describe the design, use case, dimensions, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: "vertical", minHeight: 80 }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <label className="dash-label">Base Price (₹) *</label>
                <input className="dash-input" type="number" placeholder="299" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div>
                <label className="dash-label">Initial Stock</label>
                <input className="dash-input" type="number" placeholder="10" value={stock} onChange={(e) => setStock(e.target.value)} />
              </div>
              <div>
                <label className="dash-label">Emoji Icon</label>
                <select className="dash-select" value={emoji} onChange={(e) => setEmoji(e.target.value)}>
                  {EMOJIS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="dash-card">
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              Available Materials
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {AVAILABLE_MATERIALS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleItem(materials, setMaterials, m)}
                  style={{
                    padding: "6px 14px", borderRadius: 6, border: "1px solid",
                    borderColor: materials.includes(m) ? "var(--accent)" : "#333",
                    background: materials.includes(m) ? "rgba(var(--accent-rgb),0.12)" : "transparent",
                    color: materials.includes(m) ? "var(--accent)" : "#666",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {materials.includes(m) && <Check size={10} style={{ marginRight: 4 }} />}{m}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="dash-card">
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              Available Colors
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleItem(colors, setColors, c)}
                  style={{
                    padding: "6px 14px", borderRadius: 6, border: "1px solid",
                    borderColor: colors.includes(c) ? "var(--accent)" : "#333",
                    background: colors.includes(c) ? "rgba(var(--accent-rgb),0.12)" : "transparent",
                    color: colors.includes(c) ? "var(--accent)" : "#666",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  {colors.includes(c) && <Check size={10} style={{ marginRight: 4 }} />}{c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Uploads + Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Design Image */}
          <div className="dash-card">
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Image size={16} style={{ color: "var(--accent)" }} /> Product Image
            </h3>

            {imagePreview ? (
              <div style={{ position: "relative" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, border: "1px solid #222" }}
                />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.7)", border: "1px solid #444",
                    borderRadius: "50%", color: "#fff", cursor: "pointer",
                    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <X size={14} />
                </button>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555", marginTop: 8 }}>
                  {imageFile?.name}
                </div>
              </div>
            ) : (
              <div
                className="dash-upload-zone"
                style={{ padding: "24px 16px", cursor: "pointer" }}
                onClick={() => imageInputRef.current?.click()}
              >
                <UploadCloud size={24} style={{ color: "#444", marginBottom: 8 }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666" }}>
                  Click to upload product image
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#444", marginTop: 4 }}>
                  JPG, PNG, WebP • Max 5MB
                </div>
              </div>
            )}
            <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
          </div>

          {/* STL/3D Model */}
          <div className="dash-card">
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <File size={16} style={{ color: "var(--accent)" }} /> 3D Model File
            </h3>

            {modelFile ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "#111", borderRadius: 8, border: "1px solid #222" }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(var(--accent-rgb),0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                  <File size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#ccc" }}>{modelFile.name}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#555" }}>
                    {(modelFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <button onClick={() => setModelFile(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                className="dash-upload-zone"
                style={{ padding: "24px 16px", cursor: "pointer" }}
                onClick={() => modelInputRef.current?.click()}
              >
                <UploadCloud size={24} style={{ color: "#444", marginBottom: 8 }} />
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666" }}>
                  Click to upload 3D model (optional)
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#444", marginTop: 4 }}>
                  STL, OBJ, 3MF • Max 50MB
                </div>
              </div>
            )}
            <input ref={modelInputRef} type="file" accept=".stl,.obj,.3mf" style={{ display: "none" }} onChange={handleModelSelect} />
          </div>

          {/* Preview Summary */}
          <div className="dash-card" style={{ background: "rgba(var(--accent-rgb),0.03)", borderColor: "rgba(var(--accent-rgb),0.15)" }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#fff", textTransform: "uppercase", marginBottom: 12 }}>
              Summary
            </h3>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#666", lineHeight: 2 }}>
              <div>Name: <span style={{ color: "#ccc" }}>{name || "—"}</span></div>
              <div>Category: <span style={{ color: "#ccc" }}>{category}</span></div>
              <div>Price: <span style={{ color: "var(--accent)" }}>₹{price || "—"}</span></div>
              <div>Materials: <span style={{ color: "#ccc" }}>{materials.join(", ") || "—"}</span></div>
              <div>Colors: <span style={{ color: "#ccc" }}>{colors.join(", ") || "—"}</span></div>
            </div>
          </div>

          {/* Submit */}
          <button
            className="dash-btn-primary"
            style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8, padding: "14px" }}
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />
                Uploading...
              </>
            ) : (
              <>
                <Plus size={16} />
                Publish Design to Store
              </>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

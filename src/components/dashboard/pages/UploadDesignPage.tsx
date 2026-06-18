import { useState, useRef } from "react";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { upload3DFile, type UploadProgress } from "@/services/storage.service";
import ModelViewer from "@/components/ui/model-viewer";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

export default function UploadDesignPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; file: File } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Print settings
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("100%");
  const [quantity, setQuantity] = useState(1);

  const [volumeCm3, setVolumeCm3] = useState<number>(0);
  const [estimatedWeightGrams, setEstimatedWeightGrams] = useState<number>(0);

  // Material Densities (g/cm³)
  const materialDensities: Record<string, number> = {
    PLA: 1.24, ABS: 1.04, PETG: 1.27, TPU: 1.21, Resin: 1.1,
  };

  // Base price per gram (INR)
  const materialPricePerGram: Record<string, number> = {
    PLA: 3.5, ABS: 3.8, PETG: 4.2, TPU: 5.5, Resin: 8.0,
  };

  const calculatePrice = () => {
    if (!volumeCm3) return 0;
    const density = materialDensities[material] || 1.24;
    const ppg = materialPricePerGram[material] || 3.5;
    const weight = volumeCm3 * density;
    
    // Scale factor based on chosen size (50% = 0.5 length, so volume scales by 0.5^3)
    const scaleMap: Record<string, number> = { "50%": 0.5, "75%": 0.75, "100%": 1, "125%": 1.25, "150%": 1.5 };
    const linearScale = scaleMap[size] || 1;
    const volumeScale = Math.pow(linearScale, 3);
    
    const scaledWeight = weight * volumeScale;
    
    // Minimum price of ₹50
    return Math.max(50, scaledWeight * ppg);
  };

  const basePrice = calculatePrice();
  const totalPrice = basePrice * quantity;
  
  // Rough print time estimation (1.5 hours per 50g)
  const calculatePrintTime = () => {
    if (!volumeCm3) return "0h 0m";
    const density = materialDensities[material] || 1.24;
    const scaleMap: Record<string, number> = { "50%": 0.5, "75%": 0.75, "100%": 1, "125%": 1.25, "150%": 1.5 };
    const scaledWeight = volumeCm3 * density * Math.pow(scaleMap[size] || 1, 3);
    
    const hoursBase = (scaledWeight / 50) * 1.5 * quantity;
    const hours = Math.floor(hoursBase);
    const mins = Math.floor((hoursBase - hours) * 60);
    return `${hours}h ${mins}m`;
  };
  const printTime = calculatePrintTime();

  const getGeometryVolume = (geometry: THREE.BufferGeometry): number => {
    let position = geometry.attributes.position;
    let volume = 0;
    let p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3();
    const faces = position.count / 3;

    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);
      volume += p1.dot(p2.cross(p3)) / 6.0;
    }
    return Math.abs(volume);
  };

  const processFile = async (file: File) => {
    setUploadedFile({
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      file,
    });

    // Parse STL to calculate volume
    if (file.name.toLowerCase().endsWith(".stl")) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loader = new STLLoader();
        const geometry = loader.parse(arrayBuffer);
        const volumeMm3 = getGeometryVolume(geometry);
        const cm3 = volumeMm3 / 1000;
        setVolumeCm3(cm3);
        setEstimatedWeightGrams(cm3 * 1.24); // default PLA density
      } catch (err) {
        console.error("Failed to parse STL for volume:", err);
      }
    }

    // Upload to Firebase Storage
    if (user) {
      setUploading(true);
      try {
        const url = await upload3DFile(user.uid, file, (p) => setUploadProgress(p));
        setFileURL(url);
      } catch (err) {
        console.error("Upload failed:", err);
        alert("File upload failed. Please try again.");
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAddToCart = async () => {
    if (!uploadedFile) return;
    setAddingToCart(true);
    try {
      await addItem({
        designId: "",
        name: uploadedFile.name,
        material,
        color,
        size,
        quantity,
        price: basePrice,
        imageURL: "",
        fileURL: fileURL || "",
      });
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header">
        <h2>Upload Your Design</h2>
        <p>Upload your 3D model file to preview and customize.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Left Column - Upload + 3D Preview */}
        <div>
          {!uploadedFile ? (
            <div
              className={`dash-upload-zone ${dragOver ? "dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon"><UploadCloud size={28} /></div>
              <div>
                <p style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: "0 0 4px" }}>
                  DRAG & DROP YOUR FILE HERE
                </p>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#555", margin: 0 }}>
                  or click to browse
                </p>
              </div>
              <button className="dash-btn-primary dash-btn-small" style={{ marginTop: 8 }}>Browse File</button>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#444", margin: "8px 0 0" }}>
                Supported files: STL, OBJ, 3MF • Max file size: 50MB
              </p>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".stl,.obj,.3mf" style={{ display: "none" }} />
            </div>
          ) : (
            <div className="dash-card" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, borderColor: "rgba(var(--accent-rgb), 0.2)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(var(--accent-rgb), 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                <File size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>
                  {uploadedFile.name}
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555" }}>
                  {uploadedFile.size}
                  {uploading && " • Uploading..."}
                  {fileURL && " • ✓ Uploaded"}
                </div>
                {/* Upload progress bar */}
                {uploading && uploadProgress && (
                  <div style={{ marginTop: 6, height: 3, background: "#222", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${uploadProgress.progress}%`, height: "100%", background: "var(--accent)", borderRadius: 2, transition: "width 0.3s" }} />
                  </div>
                )}
              </div>
              <button onClick={() => { setUploadedFile(null); setFileURL(null); }}
                style={{ background: "none", border: "1px solid #333", borderRadius: 6, color: "#666", cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* 3D Preview Area */}
          <div style={{ marginTop: uploadedFile ? 0 : 16, height: 400, borderRadius: 12, overflow: "hidden" }}>
            <ModelViewer file={uploadedFile?.file || null} accentColor="var(--accent)" />
          </div>
        </div>

        {/* Right Column - Print Settings + Price */}
        <div>
          <div className="dash-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 20 }}>
              Print Settings
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="dash-label">Material</label>
                <select className="dash-select" value={material} onChange={(e) => setMaterial(e.target.value)}>
                  <option>PLA</option><option>ABS</option><option>PETG</option><option>TPU</option><option>Resin</option>
                </select>
              </div>
              <div>
                <label className="dash-label">Color</label>
                <select className="dash-select" value={color} onChange={(e) => setColor(e.target.value)}>
                  <option>Black</option><option>White</option><option>Red</option><option>Blue</option><option>Orange</option><option>Green</option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="dash-label">Size (mm)</label>
                <select className="dash-select" value={size} onChange={(e) => setSize(e.target.value)}>
                  <option>50%</option><option>75%</option><option>100%</option><option>125%</option><option>150%</option>
                </select>
              </div>
              <div>
                <label className="dash-label">Quantity</label>
                <div className="dash-qty-control" style={{ marginTop: 0 }}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-price-panel">
            <h3 style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              Price Estimate
            </h3>
            <div className="dash-price-row"><span className="label">Material:</span><span className="value">₹{basePrice.toFixed(2)}</span></div>
            <div className="dash-price-row"><span className="label">Print Time:</span><span className="value">{printTime}</span></div>
            {volumeCm3 > 0 && (
              <div className="dash-price-row"><span className="label">Est. Weight (1x):</span><span className="value">{estimatedWeightGrams.toFixed(1)}g</span></div>
            )}
            <div className="dash-price-row"><span className="label">Quantity:</span><span className="value">{quantity}</span></div>
            <div className="dash-price-total"><span className="label">Total</span><span className="value">₹{totalPrice.toFixed(2)}</span></div>
            <button
              className="dash-btn-primary"
              style={{ width: "100%", marginTop: 20, justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}
              onClick={handleAddToCart}
              disabled={!uploadedFile || uploading || addingToCart}
            >
              {addingToCart && <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />}
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

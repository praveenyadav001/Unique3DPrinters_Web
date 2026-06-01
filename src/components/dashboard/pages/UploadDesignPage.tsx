import { useState, useRef } from "react";
import { UploadCloud, File, X } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  material: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface UploadDesignPageProps {
  onAddToCart: (item: CartItem) => void;
}

export default function UploadDesignPage({ onAddToCart }: UploadDesignPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);

  // Print settings
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("100%");
  const [quantity, setQuantity] = useState(1);

  const materialPrices: Record<string, number> = {
    PLA: 120,
    ABS: 150,
    PETG: 180,
    TPU: 200,
    Resin: 250,
  };

  const basePrice = materialPrices[material] || 120;
  const totalPrice = basePrice * quantity;
  const printTime = `${Math.floor(1.5 * quantity)}h ${Math.floor(Math.random() * 50 + 10)}m`;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: `upload-${Date.now()}`,
      name: uploadedFile?.name || "Custom Upload",
      material,
      color,
      quantity,
      price: totalPrice,
      image: "https://images.unsplash.com/photo-1615840287214-7fe58a8b668f?auto=format&fit=crop&w=200&q=80",
    });
    alert("Added to cart!");
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
          {/* Upload Zone */}
          {!uploadedFile ? (
            <div
              className={`dash-upload-zone ${dragOver ? "dragover" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <UploadCloud size={28} />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#fff",
                    margin: "0 0 4px",
                  }}
                >
                  DRAG & DROP YOUR FILE HERE
                </p>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    color: "#555",
                    margin: 0,
                  }}
                >
                  or click to browse
                </p>
              </div>
              <button className="dash-btn-primary dash-btn-small" style={{ marginTop: 8 }}>
                Browse File
              </button>
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  color: "#444",
                  margin: "8px 0 0",
                }}
              >
                Supported files: STL, OBJ, 3MF • Max file size: 50MB
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".stl,.obj,.3mf"
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <div
              className="dash-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
                borderColor: "rgba(var(--accent-rgb), 0.2)",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: "rgba(var(--accent-rgb), 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  flexShrink: 0,
                }}
              >
                <File size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#fff",
                  }}
                >
                  {uploadedFile.name}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#555",
                  }}
                >
                  {uploadedFile.size}
                </div>
              </div>
              <button
                onClick={() => setUploadedFile(null)}
                style={{
                  background: "none",
                  border: "1px solid #333",
                  borderRadius: 6,
                  color: "#666",
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* 3D Preview Area */}
          <div
            className="dash-3d-preview"
            style={{
              marginTop: uploadedFile ? 0 : 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              aspectRatio: "4/3",
              background:
                "radial-gradient(ellipse at center, rgba(var(--accent-rgb), 0.04) 0%, #0A0A0A 70%)",
            }}
          >
            {/* SVG Gear preview */}
            <svg viewBox="0 0 200 200" width="160" height="160" style={{ filter: "drop-shadow(0 0 15px rgba(var(--accent-rgb), 0.25))" }}>
              <defs>
                <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#333" />
                  <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
              </defs>
              {/* Outer gear teeth */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = 100 + 80 * Math.cos(angle);
                const y = 100 + 80 * Math.sin(angle);
                return (
                  <rect
                    key={i}
                    x={x - 8}
                    y={y - 8}
                    width={16}
                    height={16}
                    rx={2}
                    fill="url(#gearGrad)"
                    stroke="var(--accent)"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                    transform={`rotate(${i * 30}, ${x}, ${y})`}
                  />
                );
              })}
              {/* Main circle */}
              <circle cx="100" cy="100" r="65" fill="url(#gearGrad)" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.3" />
              <circle cx="100" cy="100" r="55" fill="#0D0D0D" stroke="#333" strokeWidth="0.5" />
              {/* Spokes */}
              {[0, 60, 120, 180, 240, 300].map((a) => {
                const rad = (a * Math.PI) / 180;
                return (
                  <line
                    key={a}
                    x1={100 + 20 * Math.cos(rad)}
                    y1={100 + 20 * Math.sin(rad)}
                    x2={100 + 50 * Math.cos(rad)}
                    y2={100 + 50 * Math.sin(rad)}
                    stroke="var(--accent)"
                    strokeWidth="3"
                    strokeOpacity="0.15"
                    strokeLinecap="round"
                  />
                );
              })}
              {/* Center hub */}
              <circle cx="100" cy="100" r="18" fill="#111" stroke="var(--accent)" strokeWidth="1" strokeOpacity="0.4" />
              <circle cx="100" cy="100" r="8" fill="#0A0A0A" stroke="#333" strokeWidth="1" />
              {/* Bolt holes */}
              {[45, 135, 225, 315].map((a) => {
                const rad = (a * Math.PI) / 180;
                return <circle key={a} cx={100 + 38 * Math.cos(rad)} cy={100 + 38 * Math.sin(rad)} r="4" fill="#0A0A0A" stroke="#333" strokeWidth="0.5" />;
              })}
            </svg>

            <div className="dash-3d-controls">
              <button title="Rotate Left">↺</button>
              <button title="Zoom In">+</button>
              <button title="Zoom Out">−</button>
              <button title="Rotate Right">↻</button>
            </div>
          </div>
        </div>

        {/* Right Column - Print Settings + Price */}
        <div>
          <div className="dash-card" style={{ marginBottom: 16 }}>
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 20,
              }}
            >
              Print Settings
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label className="dash-label">Material</label>
                <select
                  className="dash-select"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  <option>PLA</option>
                  <option>ABS</option>
                  <option>PETG</option>
                  <option>TPU</option>
                  <option>Resin</option>
                </select>
              </div>
              <div>
                <label className="dash-label">Color</label>
                <select
                  className="dash-select"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option>Black</option>
                  <option>White</option>
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Orange</option>
                  <option>Green</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label className="dash-label">Size (mm)</label>
                <select
                  className="dash-select"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                >
                  <option>50%</option>
                  <option>75%</option>
                  <option>100%</option>
                  <option>125%</option>
                  <option>150%</option>
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

          {/* Price Estimate */}
          <div className="dash-price-panel">
            <h3
              style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 16,
              }}
            >
              Price Estimate
            </h3>

            <div className="dash-price-row">
              <span className="label">Material:</span>
              <span className="value">₹{basePrice.toFixed(2)}</span>
            </div>
            <div className="dash-price-row">
              <span className="label">Print Time:</span>
              <span className="value">{printTime}</span>
            </div>
            <div className="dash-price-row">
              <span className="label">Quantity:</span>
              <span className="value">{quantity}</span>
            </div>

            <div className="dash-price-total">
              <span className="label">Total</span>
              <span className="value">₹{totalPrice.toFixed(2)}</span>
            </div>

            <button
              className="dash-btn-primary"
              style={{ width: "100%", marginTop: 20, justifyContent: "center" }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud, FileBox, CheckCircle, ArrowRight,
  Box, Headphones, ShieldCheck, Smile,
} from "lucide-react";

export function STLUploader() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith(".stl") || file.name.toLowerCase().endsWith(".obj") || file.name.toLowerCase().endsWith(".3mf")) {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid 3D model file (.stl, .obj, .3mf)");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const stats = [
    { value: "10K+", label: "Orders Delivered", icon: <Box size={23} />, tone: "cyan" },
    { value: "98%", label: "Satisfaction Rate", icon: <Smile size={23} />, tone: "cyan" },
    { value: "24/7", label: "Expert Support", icon: <Headphones size={23} />, tone: "pink" },
    { value: "100%", label: "Secure Payments", icon: <ShieldCheck size={23} />, tone: "violet" },
  ];

  return (
    <section className="quote-print-section">
      <div className="quote-print-grid" aria-hidden="true" />
      <div className="quote-print-art quote-print-art-left" aria-hidden="true">
        <div className="quote-grid-floor" />
        <div className="quote-vase">
          <div className="quote-vase-rim" />
          <div className="quote-vase-body" />
        </div>
      </div>
      <div className="quote-print-art quote-print-art-right" aria-hidden="true">
        <div className="quote-grid-floor" />
        <div className="quote-printer">
          <div className="quote-printer-gantry" />
          <div className="quote-printer-bed" />
          <div className="quote-printer-model" />
          <div className="quote-printer-nozzle" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="quote-print-content"
      >
        <div className="quote-print-header">
          <h2>
            Instant <span>Quote & Print</span>
          </h2>
          <p>Upload your STL, OBJ, or 3MF file to get started immediately.</p>
        </div>

        <motion.div
          className={`quote-upload-zone ${dragActive ? "is-dragging" : ""} ${selectedFile ? "has-file" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
        >
          <input
            type="file"
            accept=".stl,.obj,.3mf"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />

          {!selectedFile ? (
            <>
              <div className="quote-upload-icon">
                <UploadCloud size={32} />
              </div>
              <h3>Drag & Drop your 3D Model</h3>
              <p>Supported formats: STL, OBJ, 3MF (Max 50MB)</p>
              <button className="quote-browse-btn z-20 pointer-events-none">
                Browse Files
              </button>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center w-full z-20"
            >
              <div className="quote-upload-icon">
                <FileBox size={32} />
              </div>
              <h3 className="flex items-center gap-2">
                {selectedFile.name} <CheckCircle size={20} className="text-green-400" />
              </h3>
              <p>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB - Ready for analysis</p>

              <div className="quote-file-actions">
                <button
                  className="btn-primary-glow"
                  onClick={(e) => { e.stopPropagation(); }}
                  style={{ zIndex: 30 }}
                >
                  Request Quote <ArrowRight size={18} />
                </button>
                <button
                  className="quote-browse-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  style={{ zIndex: 30 }}
                >
                  Replace File
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <div className="quote-stats-panel">
          {stats.map((stat) => (
            <div className={`quote-stat quote-stat-${stat.tone}`} key={stat.label}>
              <div className="quote-stat-icon">{stat.icon}</div>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

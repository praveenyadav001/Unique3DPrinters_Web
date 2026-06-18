import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Zap, Loader2, Scissors, Settings, Eye, EyeOff } from "lucide-react";

interface ModelViewerProps {
  file: File | null;
  accentColor?: string;
}

export default function ModelViewer({ file, accentColor = "#ff5c00" }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slicer States
  const [sliceHeight, setSliceHeight] = useState(100); // 0 to 100%
  const [infillDensity, setInfillDensity] = useState(30); // 0 to 100%
  const [infillPattern, setInfillPattern] = useState<"Grid" | "Concentric" | "Wave">("Grid");
  const [showHologram, setShowHologram] = useState(true);

  // ThreeJS Refs for persistence across renders
  const clippingPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), -60));
  const activeGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const printMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wireframeMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  
  const infillGroupRef = useRef<THREE.Group | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  const resolveColor = useCallback((value: string) => {
    if (!value.startsWith("var(")) return value;
    const variableName = value.slice(4, -1).trim();
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || "#ff5c00";
  }, []);

  // Helper to rebuild infill wireframes dynamically
  const rebuildInfill = () => {
    const geometry = activeGeometryRef.current;
    const infillGroup = infillGroupRef.current;
    if (!geometry || !infillGroup) return;

    // Clear old infill geometry
    while (infillGroup.children.length > 0) {
      const child = infillGroup.children[0];
      if (child instanceof THREE.LineSegments) {
        child.geometry.dispose();
      }
      infillGroup.remove(child);
    }

    if (infillDensity <= 0) return;

    // Secondary color from document styles or fallback
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim() || "#00E5FF";
    const infillMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(secondaryColor),
      transparent: true,
      opacity: 0.25,
      clippingPlanes: [clippingPlaneRef.current]
    });

    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);

    if (infillPattern === "Concentric") {
      const shells = Math.max(1, Math.floor(infillDensity / 25));
      for (let s = 1; s <= shells; s++) {
        const scale = 1 - (s * 0.15);
        if (scale <= 0.1) break;
        const wireGeo = geometry.clone();
        wireGeo.scale(scale, scale, scale);
        const segments = new THREE.WireframeGeometry(wireGeo);
        const line = new THREE.LineSegments(segments, infillMaterial);
        infillGroup.add(line);
      }
    } else if (infillPattern === "Grid") {
      const spacing = 15 - (infillDensity / 100) * 11;
      const gridGeo = new THREE.BufferGeometry();
      const vertices: number[] = [];

      for (let x = box.min.x; x <= box.max.x; x += spacing) {
        for (let z = box.min.z; z <= box.max.z; z += spacing) {
          vertices.push(x, box.min.y, z);
          vertices.push(x, box.max.y, z);
        }
      }
      for (let y = box.min.y; y <= box.max.y; y += spacing) {
        for (let x = box.min.x; x <= box.max.x; x += spacing) {
          vertices.push(x, y, box.min.z);
          vertices.push(x, y, box.max.z);
        }
      }

      gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const lines = new THREE.LineSegments(gridGeo, infillMaterial);
      infillGroup.add(lines);
    } else { // Wave / Gyroid Infill
      const spacing = 12 - (infillDensity / 100) * 8;
      const gridGeo = new THREE.BufferGeometry();
      const vertices: number[] = [];

      for (let x = box.min.x; x <= box.max.x; x += spacing) {
        for (let z = box.min.z; z <= box.max.z; z += spacing) {
          let prevY = box.min.y;
          for (let y = box.min.y + 2; y <= box.max.y; y += 2) {
            const offsetX = Math.sin(y * 0.2) * 3;
            vertices.push(x + offsetX, prevY, z);
            vertices.push(x + Math.sin(y * 0.2) * 3, y, z);
            prevY = y;
          }
        }
      }

      gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      const lines = new THREE.LineSegments(gridGeo, infillMaterial);
      infillGroup.add(lines);
    }
  };

  // 1. Update Slicing, Infill, and Accent Theme dynamically
  useEffect(() => {
    // Model height ranges relative to gridbed (usually sits between y = -60 and y = 60)
    const threshold = -60 + (sliceHeight / 100) * 120;
    clippingPlaneRef.current.normal.set(0, 1, 0);
    clippingPlaneRef.current.constant = -threshold;

    if (printMaterialRef.current) {
      printMaterialRef.current.color.set(resolveColor(accentColor));
      printMaterialRef.current.clippingPlanes = [clippingPlaneRef.current];
      printMaterialRef.current.needsUpdate = true;
    }

    rebuildInfill();
  }, [sliceHeight, infillDensity, infillPattern, accentColor, resolveColor]);

  // 2. Toggle Hologram Skeleton Visibility
  useEffect(() => {
    if (wireframeMaterialRef.current) {
      wireframeMaterialRef.current.visible = showHologram;
    }
  }, [showHologram]);

  // 5. Core ThreeJS setup
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneRef.current = scene;

    // Grid Bed helper
    const gridHelper = new THREE.GridHelper(300, 30, 0x444444, 0x222222);
    gridHelper.position.y = -60;
    scene.add(gridHelper);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 80, 250);

    // WebGLRenderer with Local Clipping Enabled
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.localClippingEnabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight1.position.set(100, 100, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-100, 100, -100);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 0.3, 300);
    pointLight.position.set(0, 150, 0);
    scene.add(pointLight);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 30;
    controls.maxDistance = 600;

    let isInteracting = false;
    controls.addEventListener('start', () => { isInteracting = true; });
    controls.addEventListener('end', () => { isInteracting = false; });

    // Groups
    const group = new THREE.Group();
    scene.add(group);
    mainGroupRef.current = group;

    const infillGroup = new THREE.Group();
    group.add(infillGroup);
    infillGroupRef.current = infillGroup;

    let activeMesh: THREE.Mesh | THREE.Group | null = null;

    // Materials (utilizing clipping plane ref)
    const printMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(resolveColor(accentColor)),
      roughness: 0.25,
      metalness: 0.8,
      flatShading: true,
      side: THREE.DoubleSide,
      clippingPlanes: [clippingPlaneRef.current]
    });
    printMaterialRef.current = printMaterial;

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(resolveColor(accentColor)),
      wireframe: true,
      transparent: true,
      opacity: 0.08,
      visible: showHologram
    });
    wireframeMaterialRef.current = wireframeMaterial;

    const loadDefaultGeometry = () => {
      const geometry = new THREE.TorusKnotGeometry(32, 10, 150, 20);
      activeGeometryRef.current = geometry;

      const mesh = new THREE.Mesh(geometry, printMaterial);
      const wire = new THREE.Mesh(geometry, wireframeMaterial);

      const meshGroup = new THREE.Group();
      meshGroup.add(mesh);
      meshGroup.add(wire);
      meshGroup.position.set(0, 0, 0);
      group.add(meshGroup);
      activeMesh = meshGroup;

      rebuildInfill();
    };

    if (file) {
      setLoading(true);
      setError(null);
      const reader = new FileReader();
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension === "stl") {
        reader.readAsArrayBuffer(file);
      } else if (extension === "obj") {
        reader.readAsText(file);
      } else {
        setError("Unsupported file format. Please upload STL or OBJ files.");
        setLoading(false);
        loadDefaultGeometry();
      }

      reader.onload = (e) => {
        try {
          const result = e.target?.result;
          if (!result) throw new Error("Could not read file data.");

          if (extension === "stl") {
            const loader = new STLLoader();
            const geometry = loader.parse(result as ArrayBuffer);
            geometry.computeVertexNormals();
            activeGeometryRef.current = geometry;

            const mesh = new THREE.Mesh(geometry, printMaterial);
            const wire = new THREE.Mesh(geometry, wireframeMaterial);

            const meshGroup = new THREE.Group();
            meshGroup.add(mesh);
            meshGroup.add(wire);

            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox!;
            const center = new THREE.Vector3();
            boundingBox.getCenter(center);
            meshGroup.position.sub(center);

            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? 110 / maxDim : 1;
            group.scale.set(scale, scale, scale);
            group.position.y = -60 + (size.y * scale) / 2;

            group.add(meshGroup);
            activeMesh = meshGroup;

            rebuildInfill();
          } else if (extension === "obj") {
            const loader = new OBJLoader();
            const objGroup = loader.parse(result as string);

            // Fetch first available mesh geometry for infill calculations
            const meshes: THREE.Mesh[] = [];
            objGroup.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                meshes.push(child);
              }
            });

            meshes.forEach((mesh) => {
              mesh.material = printMaterial;
              activeGeometryRef.current = mesh.geometry;

              const wire = new THREE.Mesh(mesh.geometry, wireframeMaterial);
              mesh.add(wire);
            });

            const box = new THREE.Box3().setFromObject(objGroup);
            const center = new THREE.Vector3();
            box.getCenter(center);
            objGroup.position.sub(center);

            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? 110 / maxDim : 1;
            group.scale.set(scale, scale, scale);
            group.position.y = -60 + (size.y * scale) / 2;

            group.add(objGroup);
            activeMesh = objGroup;

            rebuildInfill();
          }
        } catch (err: any) {
          console.error(err);
          setError("Failed to parse 3D file. Ensure the file is not corrupted.");
          loadDefaultGeometry();
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError("Error reading file.");
        setLoading(false);
        loadDefaultGeometry();
      };
    } else {
      loadDefaultGeometry();
    }

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (activeMesh && !isInteracting) {
        activeMesh.rotation.y += 0.003;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      controls.dispose();
      
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      });

      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [file, accentColor, resolveColor, showHologram]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#050505] border border-neutral-800 rounded-lg overflow-hidden flex flex-col md:flex-row items-stretch">
      {/* 3D View Container */}
      <div className="flex-1 relative min-h-[280px]">
        <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />
        
        {loading && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 gap-3">
            <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            <span className="text-xs uppercase tracking-widest text-[var(--accent)] font-mono">Parsing 3D Mesh...</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded border border-neutral-800 text-[9px] uppercase font-mono tracking-wider text-neutral-400 flex items-center gap-2 pointer-events-none">
          <Zap size={10} className="text-[var(--accent)]" />
          Drag to rotate • Scroll to zoom
        </div>

        {error && (
          <div className="absolute top-4 left-4 right-4 z-10 bg-red-950/80 backdrop-blur-md px-3 py-2 rounded border border-red-800 text-xs font-mono text-red-200">
            ⚠️ {error}
          </div>
        )}

        {file && !loading && !error && (
          <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1 rounded border border-neutral-800 text-[9px] uppercase font-mono tracking-wider text-[var(--accent-secondary)]">
            Loaded: {file.name.substring(0, 15)}{file.name.length > 15 ? "..." : ""}
          </div>
        )}
      </div>

      {/* Slicing Controls Panel */}
      <div className="w-full md:w-64 bg-[#0a0a0a]/90 backdrop-blur-md border-t md:border-t-0 md:border-l border-neutral-800 p-5 flex flex-col gap-5 z-10 select-none">
        <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
          <Settings size={14} className="text-[var(--accent)]" />
          <h4 className="text-xs uppercase font-mono font-bold text-white tracking-widest">Slicer Simulator</h4>
        </div>

        {/* 1. Slicing Layer Height */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Scissors size={10} className="text-[var(--accent)]" /> Layer Height
            </span>
            <span className="text-[var(--accent)] font-bold">{sliceHeight}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliceHeight}
            onChange={(e) => setSliceHeight(parseInt(e.target.value))}
            className="w-full accent-[var(--accent)] bg-neutral-900 h-1 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 2. Infill Density */}
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Zap size={10} className="text-[var(--accent-secondary)]" /> Infill Density
            </span>
            <span className="text-[var(--accent-secondary)] font-bold">{infillDensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={infillDensity}
            onChange={(e) => setInfillDensity(parseInt(e.target.value))}
            className="w-full accent-[var(--accent-secondary)] bg-neutral-900 h-1.5 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* 3. Infill Pattern Selection */}
        <div>
          <label className="block text-[9px] uppercase tracking-widest font-mono text-neutral-500 mb-2">Infill Pattern</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(["Grid", "Concentric", "Wave"] as const).map((pattern) => (
              <button
                key={pattern}
                onClick={() => setInfillPattern(pattern)}
                className={`text-[9px] font-mono py-1.5 rounded transition-all border ${
                  infillPattern === pattern
                    ? "bg-[var(--accent)] text-black border-[var(--accent)] font-bold"
                    : "bg-black border-neutral-900 text-neutral-400 hover:text-white"
                }`}
              >
                {pattern}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Skeleton Hologram Overlay toggle */}
        <div className="flex items-center justify-between border-t border-neutral-900 pt-4 mt-auto">
          <span className="text-[9px] uppercase tracking-widest font-mono text-neutral-500 flex items-center gap-1.5">
            {showHologram ? <Eye size={12} className="text-[var(--accent)]" /> : <EyeOff size={12} />} Ghost Outline
          </span>
          <button
            onClick={() => setShowHologram(!showHologram)}
            className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 ${
              showHologram ? "bg-[var(--accent)]" : "bg-neutral-800"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-black transition-all ${
                showHologram ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

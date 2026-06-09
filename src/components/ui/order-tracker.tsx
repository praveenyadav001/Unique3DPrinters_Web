import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Cpu, 
  Video, 
  Activity, 
  Fan, 
  Lightbulb, 
  AlertTriangle, 
  Play, 
  Pause, 
  CheckCircle2, 
  Zap 
} from "lucide-react";
import { Card, CardContent } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";
import { getOrderByNumber } from "@/services/orders.service";

interface OrderStage {
  label: string;
  desc: string;
  status: "done" | "current" | "pending";
}

interface OrderData {
  id: string;
  client: string;
  item: string;
  material: string;
  qty: number;
  progress: number;
  printerId: string;
  stages: OrderStage[];
}

const MOCK_ORDERS: Record<string, OrderData> = {
  "ORD-1001": {
    id: "ORD-1001",
    client: "Acme Corp",
    item: "Industrial Robotic Brackets",
    material: "ABS Tough (Black)",
    qty: 12,
    progress: 100,
    printerId: "PRINTER-03",
    stages: [
      { label: "Received", desc: "File verified & scheduled", status: "done" },
      { label: "Slicing", desc: "Optimizing print structures", status: "done" },
      { label: "Printing", desc: "Completed on Formlabs Form 4", status: "done" },
      { label: "Post-Processing", desc: "Sanding & structural inspection", status: "done" },
      { label: "Shipped", desc: "Tracking ID: DHL-9021841", status: "done" }
    ]
  },
  "ORD-1002": {
    id: "ORD-1002",
    client: "Sarah Jenkins",
    item: "Geometric Desk Planters",
    material: "PLA Matte (Terracotta)",
    qty: 3,
    progress: 65,
    printerId: "PRINTER-01",
    stages: [
      { label: "Received", desc: "File verified & scheduled", status: "done" },
      { label: "Slicing", desc: "Optimizing print structures", status: "done" },
      { label: "Printing", desc: "Active on Bambu Lab X1C (65% complete)", status: "current" },
      { label: "Post-Processing", desc: "Removal of support structures", status: "pending" },
      { label: "Shipped", desc: "Awaiting dispatch", status: "pending" }
    ]
  },
  "ORD-1003": {
    id: "ORD-1003",
    client: "TechStudio",
    item: "Mechanical Gear Assembly",
    material: "PETG Durable (Cyan)",
    qty: 1,
    progress: 35,
    printerId: "PRINTER-02",
    stages: [
      { label: "Received", desc: "File verified & scheduled", status: "done" },
      { label: "Slicing", desc: "Supports generated & layers sliced", status: "current" },
      { label: "Printing", desc: "Active on Creality K1 Max", status: "pending" },
      { label: "Post-Processing", desc: "Not started", status: "pending" },
      { label: "Shipped", desc: "Awaiting dispatch", status: "pending" }
    ]
  },
  "ORD-1004": {
    id: "ORD-1004",
    client: "DesignWorks",
    item: "Architectural Tower Maquette",
    material: "High-Detail Resin (Clear)",
    qty: 2,
    progress: 10,
    printerId: "PRINTER-04",
    stages: [
      { label: "Received", desc: "STL file analyzed, awaiting mesh fixes", status: "current" },
      { label: "Slicing", desc: "Not started", status: "pending" },
      { label: "Printing", desc: "Queued on Prusa XL", status: "pending" },
      { label: "Post-Processing", desc: "Not started", status: "pending" },
      { label: "Shipped", desc: "Awaiting dispatch", status: "pending" }
    ]
  }
};

interface PrinterStatus {
  id: string;
  name: string;
  status: "PRINTING" | "CALIBRATING" | "IDLE" | "PAUSED" | "ABORTED";
  jobName: string;
  linkedOrderId: string | null;
  targetNozzle: number;
  targetBed: number;
  maxLayers: number;
}

const INITIAL_PRINTERS: Record<string, PrinterStatus> = {
  "PRINTER-01": {
    id: "PRINTER-01",
    name: "Bambu Lab X1C #01",
    status: "PRINTING",
    jobName: "Planters_Tray_v3.gcode",
    linkedOrderId: "ORD-1002",
    targetNozzle: 220,
    targetBed: 60,
    maxLayers: 480
  },
  "PRINTER-02": {
    id: "PRINTER-02",
    name: "Creality K1 Max #02",
    status: "PRINTING",
    jobName: "Gearbox_Spur_x4.gcode",
    linkedOrderId: "ORD-1003",
    targetNozzle: 245,
    targetBed: 80,
    maxLayers: 320
  },
  "PRINTER-03": {
    id: "PRINTER-03",
    name: "Formlabs Form 4 #03",
    status: "IDLE",
    jobName: "Awaiting Job Queue...",
    linkedOrderId: null,
    targetNozzle: 35,
    targetBed: 35,
    maxLayers: 0
  },
  "PRINTER-04": {
    id: "PRINTER-04",
    name: "Prusa XL #04",
    status: "CALIBRATING",
    jobName: "Mesh_Bed_Leveling.gcode",
    linkedOrderId: "ORD-1004",
    targetNozzle: 170,
    targetBed: 60,
    maxLayers: 100
  }
};

export default function OrderStatusTracker() {
  const [activeTab, setActiveTab] = useState<"fleet" | "track">("fleet");
  const [searchId, setSearchId] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<OrderData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Printer Farm Dynamic Telemetry State
  const [printers, setPrinters] = useState<Record<string, PrinterStatus>>(INITIAL_PRINTERS);
  
  // Realtime Live Tracker Metrics
  const [liveNozzleTemp, setLiveNozzleTemp] = useState(0);
  const [liveBedTemp, setLiveBedTemp] = useState(0);
  const [liveFanRPM, setLiveFanRPM] = useState(4200);
  const [fanBoostActive, setFanBoostActive] = useState(false);
  const [chamberLight, setChamberLight] = useState(true);
  const [printStateOverride, setPrintStateOverride] = useState<string | null>(null);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Temperature history tracking for Sparkline graph
  const [tempHistory, setTempHistory] = useState<Record<string, number[]>>({
    "PRINTER-01": Array(12).fill(220),
    "PRINTER-02": Array(12).fill(245),
    "PRINTER-03": Array(12).fill(35),
    "PRINTER-04": Array(12).fill(170)
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Simulating Telemetry stream
  useEffect(() => {
    timerRef.current = setInterval(() => {
      // 1. Update printer farm temperatures and states
      setPrinters((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const printer = next[key];
          if (printer.status === "PRINTING") {
            // Nozzle fluctuation
            const drift = (Math.random() - 0.5) * 3;
            printer.targetNozzle = Math.max(200, Math.min(260, printer.targetNozzle + drift));
            // Bed fluctuation
            const bedDrift = (Math.random() - 0.5) * 0.8;
            printer.targetBed = Math.max(55, Math.min(85, printer.targetBed + bedDrift));
          } else if (printer.status === "CALIBRATING") {
            const drift = (Math.random() - 0.5) * 4;
            printer.targetNozzle = Math.max(150, Math.min(185, printer.targetNozzle + drift));
          } else {
            // Cool down to ambient
            printer.targetNozzle = Math.max(25, printer.targetNozzle - 1);
            printer.targetBed = Math.max(25, printer.targetBed - 0.5);
          }
        });
        return next;
      });

      // Update temperature history arrays
      setTempHistory((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const currentList = [...next[key]];
          const currentVal = printers[key]?.targetNozzle || 25;
          currentList.push(currentVal);
          if (currentList.length > 12) currentList.shift();
          next[key] = currentList;
        });
        return next;
      });

      // 2. Update active tracking values
      if (searchedOrder && printStateOverride !== "PAUSED" && printStateOverride !== "ABORTED") {
        const assignedPrinter = printers[searchedOrder.printerId];
        if (assignedPrinter && assignedPrinter.status === "PRINTING") {
          // Sync live temperatures
          setLiveNozzleTemp(assignedPrinter.targetNozzle);
          setLiveBedTemp(assignedPrinter.targetBed);

          // Fan RPM fluctuation
          setLiveFanRPM(() => {
            const base = fanBoostActive ? 7400 : 4200;
            const drift = Math.floor((Math.random() - 0.5) * 120);
            return Math.max(1000, base + drift);
          });

          // Layer counter incrementing
          setCurrentLayer((prev) => {
            const totalLayers = assignedPrinter.maxLayers;
            const layerPct = (searchedOrder.progress / 100) * totalLayers;
            const newLayer = Math.min(totalLayers, prev + (Math.random() > 0.7 ? 1 : 0));
            return newLayer === 0 ? Math.floor(layerPct) : newLayer;
          });

          // Countdown time remaining
          setTimeRemaining((prev) => Math.max(0, prev - 1));
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [searchedOrder, printers, fanBoostActive, printStateOverride]);

  // Decaying Fan Boost state
  useEffect(() => {
    if (fanBoostActive) {
      const decay = setTimeout(() => {
        setFanBoostActive(false);
      }, 6000);
      return () => clearTimeout(decay);
    }
  }, [fanBoostActive]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = searchId.trim().toUpperCase();
    if (!id) return;

    try {
      const orderDoc = await getOrderByNumber(id);
      
      if (orderDoc) {
        const statusProgressMap: Record<string, number> = {
          Pending: 10,
          Confirmed: 20,
          Processing: 30,
          Printing: 50,
          "Post Processing": 80,
          Shipped: 95,
          Delivered: 100,
          Cancelled: 0,
        };

        const progress = statusProgressMap[orderDoc.status] || 10;
        const itemName = orderDoc.items[0]?.designName || "Custom Part";
        const itemQty = orderDoc.items[0]?.quantity || 1;
        const material = orderDoc.items[0]?.material || "Standard PLA";

        const mappedOrder: OrderData = {
          id: orderDoc.orderNumber,
          client: orderDoc.customerName,
          item: itemName,
          material: material,
          qty: itemQty,
          progress: progress,
          printerId: "PRINTER-01", // Mapped statically for telemetry demo
          stages: [
            { label: "Received", desc: "Order placed & confirmed", status: progress >= 20 ? "done" : progress >= 10 ? "current" : "pending" },
            { label: "Processing", desc: "Worker assigned & slicing", status: progress >= 30 ? "done" : progress >= 20 ? "current" : "pending" },
            { label: "Printing", desc: "Active on printer", status: progress >= 80 ? "done" : progress >= 30 ? "current" : "pending" },
            { label: "Post-Processing", desc: "QC & Finishing", status: progress >= 95 ? "done" : progress >= 80 ? "current" : "pending" },
            { label: "Shipped", desc: orderDoc.trackingNumber ? `Tracking: ${orderDoc.trackingNumber}` : "Awaiting dispatch", status: progress >= 100 ? "done" : progress >= 95 ? "current" : "pending" }
          ]
        };

        setSearchedOrder(mappedOrder);
        setErrorMsg(null);
        setPrintStateOverride(orderDoc.status === "Cancelled" ? "ABORTED" : null);

        // Initialize live tracker values
        const printer = INITIAL_PRINTERS["PRINTER-01"];
        if (printer) {
          setLiveNozzleTemp(printer.targetNozzle);
          setLiveBedTemp(printer.targetBed);
          setCurrentLayer(Math.floor((progress / 100) * printer.maxLayers));
          setTimeRemaining(Math.floor((100 - progress) * 85)); // seconds estimate
          setLiveFanRPM(printer.status === "PRINTING" ? 4200 : 0);
        }
      } else {
        setSearchedOrder(null);
        setErrorMsg("Order not found. Please verify the ID.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch order.");
    }
  };

  const handleFanBoost = () => {
    if (printStateOverride === "PAUSED" || printStateOverride === "ABORTED") return;
    setFanBoostActive(true);
    setLiveFanRPM(7800);
  };

  const handleToggleLight = () => {
    setChamberLight(!chamberLight);
  };

  const handleEmergencyStop = () => {
    if (printStateOverride === "ABORTED") return;
    if (printStateOverride === "PAUSED") {
      // Resume
      setPrintStateOverride("PRINTING");
      const printer = printers[searchedOrder!.printerId];
      setLiveFanRPM(printer.status === "PRINTING" ? 4200 : 0);
    } else {
      // Pause
      setPrintStateOverride("PAUSED");
      setLiveFanRPM(0);
      setLiveNozzleTemp(75);
      setLiveBedTemp(40);
    }
  };

  const handleAbort = () => {
    setPrintStateOverride("ABORTED");
    setLiveFanRPM(0);
    setLiveNozzleTemp(25);
    setLiveBedTemp(25);
    setTimeRemaining(0);
  };

  // Helper to render temperature sparkline svg
  const renderSparkline = (data: number[]) => {
    if (data.length < 2) return null;
    const max = Math.max(...data, 260);
    const min = Math.min(...data, 20);
    const range = max - min || 1;
    const width = 80;
    const height = 18;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          points={points}
        />
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="2"
          fill="var(--accent-secondary)"
          className="animate-pulse"
        />
      </svg>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 select-none">
      
      {/* Dynamic Tab Switcher */}
      <div className="flex justify-center border-b border-neutral-900 pb-px">
        <div className="flex gap-2 p-1 bg-black/60 border border-neutral-900 rounded-md backdrop-blur-md">
          <button
            onClick={() => setActiveTab("fleet")}
            className={`flex items-center gap-2 px-5 py-2 font-mono text-[10px] md:text-xs uppercase tracking-widest rounded transition-all ${
              activeTab === "fleet"
                ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.3)]"
                : "text-neutral-500 hover:text-white border border-transparent"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> Fleet Status
          </button>
          <button
            onClick={() => setActiveTab("track")}
            className={`flex items-center gap-2 px-5 py-2 font-mono text-[10px] md:text-xs uppercase tracking-widest rounded transition-all ${
              activeTab === "track"
                ? "bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.3)]"
                : "text-neutral-500 hover:text-white border border-transparent"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Track Live Order
          </button>
        </div>
      </div>

      {activeTab === "fleet" ? (
        /* Fleet Status Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {Object.values(printers).map((prn) => {
            const isPrinting = prn.status === "PRINTING";
            const isCalibrating = prn.status === "CALIBRATING";
            const history = tempHistory[prn.id] || [];

            return (
              <Card key={prn.id} className="bg-[#0b0b0b] border-neutral-900 hover:border-neutral-800 transition-colors shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 group-hover:bg-[var(--accent)] transition-colors" />
                <CardContent className="p-5 space-y-4">
                  {/* Title & Status */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs uppercase font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                        {prn.name}
                      </h4>
                      <div className="text-[9px] font-mono text-neutral-600 mt-0.5 font-bold">
                        UNIT ID: {prn.id}
                      </div>
                    </div>

                    <Badge
                      className={`text-[8px] font-mono py-0.5 px-2 ${
                        isPrinting
                          ? "bg-green-950/40 text-green-400 border border-green-800/50"
                          : isCalibrating
                          ? "bg-blue-950/40 text-blue-400 border border-blue-800/50"
                          : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full mr-1.5 inline-block ${
                          isPrinting
                            ? "bg-green-400 animate-pulse"
                            : isCalibrating
                            ? "bg-blue-400 animate-ping"
                            : "bg-neutral-500"
                        }`}
                      />
                      {prn.status}
                    </Badge>
                  </div>

                  {/* Active Job */}
                  <div className="bg-[#050505] p-3 rounded border border-neutral-950 space-y-2">
                    <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                      <span>Active File:</span>
                      <span className="text-neutral-300 font-bold truncate max-w-[150px]">{prn.jobName}</span>
                    </div>

                    {isPrinting && prn.linkedOrderId && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                          <span>Link Order:</span>
                          <span className="text-[var(--accent-secondary)] font-bold">{prn.linkedOrderId}</span>
                        </div>
                        <div className="w-full h-1 bg-neutral-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                            style={{
                              width: `${MOCK_ORDERS[prn.linkedOrderId]?.progress || 0}%`
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Realtime Thermals Grid */}
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div>
                      <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Nozzle Temp</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">
                        {Math.floor(prn.targetNozzle)}°C
                      </div>
                    </div>
                    <div>
                      <div className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest">Bed Temp</div>
                      <div className="text-xs font-mono font-bold text-white mt-0.5">
                        {Math.floor(prn.targetBed)}°C
                      </div>
                    </div>
                    <div className="flex justify-end pr-1">
                      {renderSparkline(history)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Track Live Order Detail View */
        <div className="space-y-6 animate-fadeIn">
          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ORD-1002)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full bg-[#050505] border border-neutral-800 rounded px-4 py-3 pl-10 text-xs md:text-sm font-mono text-white outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <Button type="submit" className="bg-[var(--accent)] hover:bg-white text-black font-bold uppercase tracking-wider text-xs font-mono h-11 px-5">
              Connect Telemetry
            </Button>
          </form>

          {errorMsg && (
            <p className="text-center font-mono text-[10px] md:text-xs text-neutral-500">
              ⚠️ {errorMsg}
            </p>
          )}

          {searchedOrder ? (
            /* Live Dashboard view */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Column: Details & Checklists */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-[#0b0b0b] border-neutral-900 text-white shadow-xl">
                  <CardContent className="p-5 space-y-4">
                    <div className="border-b border-neutral-900 pb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-neutral-500">Order Ref:</span>
                        <Badge className="bg-[rgba(var(--accent-rgb),0.08)] border-[rgba(var(--accent-rgb),0.2)] text-[var(--accent)] hover:bg-[rgba(var(--accent-rgb),0.08)] text-[8px] font-mono py-0.5">
                          {printStateOverride || (searchedOrder.progress === 100 ? "COMPLETED" : "PRINTING")}
                        </Badge>
                      </div>
                      <div className="text-sm font-sans font-bold mt-1 text-white">{searchedOrder.id}</div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-1">{searchedOrder.item}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-neutral-400">
                        <span>Physical Progress:</span>
                        <span className="text-[var(--accent-secondary)] font-bold">
                          {printStateOverride === "ABORTED" ? 0 : searchedOrder.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            printStateOverride === "ABORTED"
                              ? "bg-red-800 w-0"
                              : printStateOverride === "PAUSED"
                              ? "bg-amber-600"
                              : "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
                          }`}
                          style={{
                            width: printStateOverride === "ABORTED" ? "0%" : `${searchedOrder.progress}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-500 bg-[#050505] p-3 rounded border border-neutral-950">
                      <div>
                        <span>Material:</span>
                        <div className="text-white font-bold mt-0.5">{searchedOrder.material}</div>
                      </div>
                      <div>
                        <span>Work Unit:</span>
                        <div className="text-[var(--accent)] font-bold mt-0.5">
                          {INITIAL_PRINTERS[searchedOrder.printerId]?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Checkpoints */}
                <Card className="bg-[#0b0b0b] border-neutral-900 text-white shadow-xl">
                  <CardContent className="p-5 space-y-4">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest border-b border-neutral-900 pb-2">
                      Operation Stages
                    </div>
                    <div className="relative pl-4 space-y-4 border-l border-neutral-900 ml-2">
                      {searchedOrder.stages.map((stg, i) => {
                        const isDone = stg.status === "done";
                        const isCurrent = stg.status === "current";

                        return (
                          <div key={i} className="relative flex gap-3 items-start text-left">
                            <span
                              style={isDone ? {
                                backgroundColor: "var(--accent)",
                                borderColor: "var(--accent)",
                              } : isCurrent ? {
                                backgroundColor: "black",
                                borderColor: "var(--accent-secondary)"
                              } : {
                                backgroundColor: "black",
                                borderColor: "rgb(38, 38, 38)"
                              }}
                              className={`absolute -left-[21px] top-1 w-2 h-2 rounded-full border-2 transition-all ${
                                isCurrent ? "animate-pulse" : ""
                              }`}
                            />
                            <div>
                              <div
                                className={`text-[10px] font-semibold font-mono uppercase tracking-wider ${
                                  isDone ? "text-white" : isCurrent ? "text-[var(--accent-secondary)]" : "text-neutral-600"
                                }`}
                              >
                                {stg.label}
                              </div>
                              <div className="text-[9px] text-neutral-500 font-mono mt-0.5">{stg.desc}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Telemetry & Dials & Live Camera View */}
              <div className="lg:col-span-3 space-y-4">
                
                {/* Simulated Camera Feed Grid */}
                <Card className="bg-[#0b0b0b] border-neutral-900 overflow-hidden shadow-2xl relative">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono border-b border-neutral-900 pb-2">
                      <span className="flex items-center gap-1.5 text-neutral-400">
                        <Video className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                        LIVE_FEED_SYS_{searchedOrder.printerId.replace("-", "")}
                      </span>
                      <span className="text-neutral-500">FPS: 29.97</span>
                    </div>

                    {/* Camera Feed Visual Canvas Box */}
                    <div 
                      style={{
                        backgroundColor: chamberLight ? "rgba(var(--accent-rgb), 0.03)" : "#020403",
                        borderColor: chamberLight ? "rgba(var(--accent-rgb), 0.15)" : "#0f2010"
                      }}
                      className="relative aspect-video rounded border flex items-center justify-center overflow-hidden transition-all duration-500"
                    >
                      {/* Scanline CRT overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10 opacity-70" />
                      
                      {/* Grid overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                      {/* Video crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-6 h-6 border border-white/5 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                        </div>
                      </div>

                      {/* Rec blinker */}
                      {printStateOverride !== "PAUSED" && printStateOverride !== "ABORTED" && searchedOrder.progress < 100 && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20 bg-black/60 px-2 py-0.5 rounded border border-neutral-900 font-mono text-[8px] text-red-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          REC
                        </div>
                      )}

                      {/* Aborted screen indicator */}
                      {printStateOverride === "ABORTED" && (
                        <div className="absolute inset-0 bg-red-950/90 z-20 flex flex-col items-center justify-center gap-2">
                          <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
                          <div className="font-mono text-xs uppercase font-bold text-red-500 tracking-widest">PRINT_JOB_ABORTED</div>
                          <div className="font-mono text-[9px] text-red-400/70">EMERGENCY SHUTDOWN INITIATED</div>
                        </div>
                      )}

                      {/* Paused screen indicator */}
                      {printStateOverride === "PAUSED" && (
                        <div className="absolute inset-0 bg-black/85 z-20 flex flex-col items-center justify-center gap-2">
                          <Pause className="w-6 h-6 text-amber-500 animate-pulse" />
                          <div className="font-mono text-xs uppercase font-bold text-amber-500 tracking-widest">FEED_SUSPENDED</div>
                          <div className="font-mono text-[9px] text-neutral-400">TELEMETRY PAUSED</div>
                        </div>
                      )}

                      {/* Completed screen indicator */}
                      {searchedOrder.progress === 100 && printStateOverride !== "ABORTED" && (
                        <div className="absolute inset-0 bg-black/90 z-20 flex flex-col items-center justify-center gap-2">
                          <CheckCircle2 className="w-8 h-8 text-green-400 animate-scaleIn" />
                          <div className="font-mono text-xs uppercase font-bold text-green-400 tracking-widest">PRINT_COMPLETE</div>
                          <div className="font-mono text-[9px] text-neutral-400">READY FOR EXTRACTION</div>
                        </div>
                      )}

                      {/* Scanning laser line */}
                      {printStateOverride !== "PAUSED" && printStateOverride !== "ABORTED" && searchedOrder.progress < 100 && (
                        <div 
                          className="absolute w-full h-[2px] left-0 pointer-events-none z-10 opacity-60"
                          style={{
                            background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
                            boxShadow: "0 0 10px var(--accent)",
                            animation: "scanline 2s ease-in-out infinite"
                          }}
                        />
                      )}

                      {/* Core Vector Simulation SVG (representing the drawing structure) */}
                      <svg 
                        viewBox="0 0 100 100" 
                        className="w-24 h-24 overflow-visible"
                        style={{
                          filter: `drop-shadow(0 0 8px ${chamberLight ? "var(--accent)" : "rgba(255,255,255,0.05)"})`
                        }}
                      >
                        {/* Static outline wireframe */}
                        <path 
                          d="M 50 15 L 85 35 L 85 75 L 50 95 L 15 75 L 15 35 Z" 
                          fill="none" 
                          stroke={chamberLight ? "rgba(var(--accent-rgb), 0.1)" : "rgba(255,255,255,0.02)"} 
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                        
                        {/* Realtime growing solid path */}
                        <path 
                          d="M 50 15 L 85 35 L 85 75 L 50 95 L 15 75 L 15 35 Z" 
                          fill="none" 
                          stroke="var(--accent)" 
                          strokeWidth="2.5"
                          strokeDasharray="300"
                          strokeDashoffset={300 - (300 * (searchedOrder.progress / 100))}
                          className="transition-all duration-1000 ease-out"
                        />

                        {/* Internal Gyroid/Cross hatch drawing effect */}
                        {searchedOrder.progress < 100 && printStateOverride !== "PAUSED" && printStateOverride !== "ABORTED" && (
                          <g stroke="var(--accent-secondary)" strokeWidth="0.5" opacity="0.35">
                            <line x1="25" y1="38" x2="75" y2="38" className="animate-pulse" />
                            <line x1="20" y1="50" x2="80" y2="50" className="animate-pulse" style={{ animationDelay: "0.3s" }} />
                            <line x1="25" y1="62" x2="75" y2="62" className="animate-pulse" style={{ animationDelay: "0.6s" }} />
                            <line x1="35" y1="74" x2="65" y2="74" className="animate-pulse" style={{ animationDelay: "0.9s" }} />
                          </g>
                        )}
                      </svg>

                      {/* HUD Overlays */}
                      <div className="absolute bottom-3 left-3 text-left font-mono text-[8px] text-neutral-400 space-y-0.5">
                        <div>JOB: {INITIAL_PRINTERS[searchedOrder.printerId]?.jobName || "CAL.gcode"}</div>
                        <div>RES: {searchedOrder.progress < 100 ? "0.15mm (FINE)" : "N/A"}</div>
                        <div>FAN: {liveFanRPM} RPM</div>
                      </div>

                      <div className="absolute bottom-3 right-3 text-right font-mono text-[8px] text-neutral-400 space-y-0.5">
                        <div>LYR: {searchedOrder.progress === 100 ? "COMPLETE" : `${currentLayer} / ${INITIAL_PRINTERS[searchedOrder.printerId]?.maxLayers || 100}`}</div>
                        <div>REM: {searchedOrder.progress === 100 ? "READY" : timeRemaining > 0 ? `${Math.floor(timeRemaining / 60)}m ${timeRemaining % 60}s` : "0s"}</div>
                      </div>
                    </div>

                    {/* Circular Dials/Gauges Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Nozzle Temp Circular Gauge */}
                      <div className="flex flex-col items-center p-3 bg-[#050505] rounded border border-neutral-950">
                        <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Zap size={8} className="text-[var(--accent)]" /> Nozzle Temp
                        </span>
                        
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          {/* Circular Gauge SVG */}
                          <svg className="absolute w-full h-full -rotate-90">
                            {/* Track */}
                            <circle
                              cx="40"
                              cy="40"
                              r="32"
                              fill="none"
                              stroke="#111"
                              strokeWidth="4"
                            />
                            {/* Progress Fill */}
                            <circle
                              cx="40"
                              cy="40"
                              r="32"
                              fill="none"
                              stroke="var(--accent)"
                              strokeWidth="4.5"
                              strokeDasharray="201"
                              strokeDashoffset={201 - (201 * (liveNozzleTemp / 300))}
                              className="transition-all duration-500 ease-out"
                            />
                          </svg>
                          <div className="text-center font-mono">
                            <span className="text-xs font-bold text-white">{Math.floor(liveNozzleTemp)}</span>
                            <span className="text-[8px] text-neutral-600 block">/ 300°C</span>
                          </div>
                        </div>
                      </div>

                      {/* Bed Temp Circular Gauge */}
                      <div className="flex flex-col items-center p-3 bg-[#050505] rounded border border-neutral-950">
                        <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Zap size={8} className="text-[var(--accent-secondary)]" /> Bed Temp
                        </span>

                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <svg className="absolute w-full h-full -rotate-90">
                            <circle
                              cx="40"
                              cy="40"
                              r="32"
                              fill="none"
                              stroke="#111"
                              strokeWidth="4"
                            />
                            <circle
                              cx="40"
                              cy="40"
                              r="32"
                              fill="none"
                              stroke="var(--accent-secondary)"
                              strokeWidth="4.5"
                              strokeDasharray="201"
                              strokeDashoffset={201 - (201 * (liveBedTemp / 120))}
                              className="transition-all duration-500 ease-out"
                            />
                          </svg>
                          <div className="text-center font-mono">
                            <span className="text-xs font-bold text-white">{Math.floor(liveBedTemp)}</span>
                            <span className="text-[8px] text-neutral-600 block">/ 120°C</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Operational Controls panel */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-900">
                      <Button
                        onClick={handleFanBoost}
                        disabled={searchedOrder.progress === 100 || printStateOverride === "PAUSED" || printStateOverride === "ABORTED"}
                        className="flex-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-white text-white font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 flex items-center justify-center gap-1.5"
                      >
                        <Fan size={11} className={fanBoostActive ? "animate-spin" : ""} />
                        {fanBoostActive ? "Turbo Active" : "Request Fan Boost"}
                      </Button>

                      <Button
                        onClick={handleToggleLight}
                        className="flex-1 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-white text-white font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 flex items-center justify-center gap-1.5"
                      >
                        <Lightbulb size={11} className={chamberLight ? "text-yellow-400" : ""} />
                        Light: {chamberLight ? "ON" : "OFF"}
                      </Button>

                      <Button
                        onClick={handleEmergencyStop}
                        disabled={searchedOrder.progress === 100 || printStateOverride === "ABORTED"}
                        className={`flex-1 font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 flex items-center justify-center gap-1.5 ${
                          printStateOverride === "PAUSED"
                            ? "bg-green-600 hover:bg-green-700 text-black font-bold"
                            : "bg-amber-600/10 hover:bg-amber-600/20 border border-amber-800 text-amber-500"
                        }`}
                      >
                        {printStateOverride === "PAUSED" ? (
                          <>
                            <Play size={11} /> Resume Print
                          </>
                        ) : (
                          <>
                            <Pause size={11} /> Pause Print
                          </>
                        )}
                      </Button>

                      {printStateOverride === "PAUSED" && (
                        <Button
                          onClick={handleAbort}
                          className="bg-red-950/20 hover:bg-red-950/40 border border-red-800 text-red-500 font-mono text-[9px] uppercase tracking-wider py-1.5 h-8 px-4 flex items-center justify-center gap-1.5"
                        >
                          <AlertTriangle size={11} /> Abort Job
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

              </div>

            </div>
          ) : (
            /* Placeholder state awaiting tracking ID */
            <Card className="bg-[#0b0b0b]/60 border-neutral-900 text-center py-16 px-6 max-w-lg mx-auto shadow-2xl backdrop-blur-md">
              <CardContent className="space-y-4">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-full border border-neutral-800 bg-[#050505]">
                  <Activity className="w-8 h-8 text-[var(--accent)] animate-pulse" />
                  <div className="absolute inset-0 rounded-full border border-[var(--accent)] opacity-20 scale-110 animate-ping" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-mono font-bold text-white tracking-widest">
                    Awaiting Connection Link
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-mono mt-2 leading-relaxed">
                    Provide a valid client order reference key (e.g. <span className="text-white">ORD-1002</span>) to establish a satellite link to the assigned 3D printing module.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      )}

    </div>
  );
}

// ─── Firebase Type Definitions ──────────────────────────────
// Shared interfaces for all Firestore documents

import type { Timestamp } from "firebase/firestore";

// ─── User ────────────────────────────────────────────────────
export type UserRole = "admin" | "worker" | "customer";

export interface UserDoc {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  photoURL: string | null;
  role: UserRole;
  // Worker-specific
  status?: "Online" | "Busy" | "Offline";
  activeTasks?: number;
  shift?: { start: string; end: string };
  // Metadata
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Design ──────────────────────────────────────────────────
export interface DesignDoc {
  id: string;
  name: string;
  category: string;
  price: number;
  emoji: string;
  imageURL: string;
  modelURL?: string;
  description: string;
  materials: string[];
  colors: string[];
  isActive: boolean;
  salesCount: number;
  stock: number;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Category ────────────────────────────────────────────────
export interface CategoryDoc {
  id: string;
  name: string;
  type: string;
  emoji: string;
  designCount: number;
  order: number;
  isActive: boolean;
}

// ─── Order ───────────────────────────────────────────────────
export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Printing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  designId: string;
  designName: string;
  material: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  imageURL: string;
  fileURL?: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: Timestamp;
  note?: string;
}

export interface OrderDoc {
  id: string;
  orderNumber: string;
  // Customer
  customerId: string;
  customerName: string;
  customerEmail: string;
  // Items
  items: OrderItem[];
  // Status
  status: OrderStatus;
  // Worker assignment
  assignedWorkerId: string | null;
  assignedWorkerName: string | null;
  // Financial
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Refunded";
  // Shipping
  shippingAddress: ShippingAddress;
  // Tracking
  statusHistory: StatusHistoryEntry[];
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deliveredAt?: Timestamp;
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItemDoc {
  id: string;
  designId?: string;
  name: string;
  material: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  imageURL: string;
  fileURL?: string;
  addedAt: Timestamp;
}

// ─── Material ────────────────────────────────────────────────
export interface MaterialDoc {
  id: string;
  name: string;
  type: string;
  color: string;
  pricePerUnit: number;
  stock: number;
  unit: string;
  isActive: boolean;
}

// ─── Printer ────────────────────────────────────────────────
export interface PrinterDoc {
  id: string;
  name: string;
  type: "FDM" | "Resin" | "SLA" | string;
  status: "Active" | "Idle" | "Printing" | "Maintenance" | "Offline";
  assignedWorkerId: string | null;
  currentJobId: string | null;
  currentJobName?: string;
  currentTemp?: string;
  currentBedTemp?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Maintenance Log ────────────────────────────────────────
export interface MaintenanceLogDoc {
  id: string;
  printerId: string;
  printerName: string;
  issue: string;
  priority: "Low" | "Medium" | "High";
  status: "Scheduled" | "In Progress" | "Completed";
  reportedBy: string; // Worker ID
  reportedByName?: string;
  resolvedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Settings ───────────────────────────────────────────────
export interface SystemSettingsDoc {
  companyName: string;
  supportEmail: string;
  defaultCurrency: string;
  orderPrefix: string;
  updatedAt: Timestamp;
}

export interface WebsiteSettingsDoc {
  heroHeadline: string;
  heroSubheadline: string;
  primaryAccent: string;
  secondaryAccent: string;
  activeBannerURL: string | null;
  updatedAt: Timestamp;
}

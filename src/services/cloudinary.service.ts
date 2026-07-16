// ─── Cloudinary Service ──────────────────────────────────────
// Upload files (3D models, design images, photos) to Cloudinary
// Uses an unsigned upload preset — no API secret in the browser.

export interface UploadProgress {
  progress: number; // 0-100
  state: "running" | "paused" | "success" | "error";
}

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME";
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unique3d_uploads";

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

// ─── Core Unsigned Upload ────────────────────────────────────
// resourceType "auto" lets Cloudinary handle images and raw files
// (STL/OBJ/3MF models are stored as "raw" resources).
function uploadToCloudinary(
  file: File,
  folder: string,
  onProgress?: (p: UploadProgress) => void
): Promise<CloudinaryUploadResult> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.({
          progress: (event.loaded / event.total) * 100,
          state: "running",
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const res = JSON.parse(xhr.responseText);
        onProgress?.({ progress: 100, state: "success" });
        resolve({
          secureUrl: res.secure_url,
          publicId: res.public_id,
          format: res.format,
          bytes: res.bytes,
          width: res.width,
          height: res.height,
        });
      } else {
        onProgress?.({ progress: 0, state: "error" });
        reject(new Error(`Cloudinary upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      onProgress?.({ progress: 0, state: "error" });
      reject(new Error("Cloudinary upload failed: network error"));
    };

    xhr.send(formData);
  });
}

// ─── Upload 3D File (Customer) ───────────────────────────────
export async function upload3DFile(
  userId: string,
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const res = await uploadToCloudinary(file, `unique3d/uploads/${userId}`, onProgress);
  return res.secureUrl;
}

// ─── Upload Design Image (Admin) ─────────────────────────────
export async function uploadDesignImage(
  designId: string,
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const res = await uploadToCloudinary(file, `unique3d/designs/${designId}`, onProgress);
  // f_auto,q_auto — serve the best format/quality per browser automatically
  return optimizedUrl(res.secureUrl);
}

// ─── Upload Design Model (Admin) ─────────────────────────────
export async function uploadDesignModel(
  userId: string,
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const res = await uploadToCloudinary(file, `unique3d/designs/models/${userId}`, onProgress);
  return res.secureUrl;
}

// ─── Upload Profile Photo ────────────────────────────────────
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  const res = await uploadToCloudinary(file, `unique3d/profiles/${userId}`);
  return optimizedUrl(res.secureUrl);
}

// ─── Upload Banner Image (Admin) ─────────────────────────────
export async function uploadBannerImage(
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const res = await uploadToCloudinary(file, "unique3d/website", onProgress);
  return optimizedUrl(res.secureUrl);
}

// ─── Optimized Delivery URL ──────────────────────────────────
// Injects f_auto (best format for the browser) and q_auto (auto
// quality/compression) into a Cloudinary image delivery URL.
export function optimizedUrl(secureUrl: string): string {
  return secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

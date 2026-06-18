// ─── Storage Service ─────────────────────────────────────────
// Upload files (3D models, images, profile photos) to Firebase Storage

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadProgress {
  progress: number; // 0-100
  state: "running" | "paused" | "success" | "error";
}

// ─── Upload 3D File ─────────────────────────────────────────
export function upload3DFile(
  userId: string,
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `uploads/${userId}/${fileName}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({
          progress,
          state: snapshot.state as UploadProgress["state"],
        });
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── Upload Design Image (Admin) ────────────────────────────
export function uploadDesignImage(
  designId: string,
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `designs/${designId}/${fileName}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({
          progress,
          state: snapshot.state as UploadProgress["state"],
        });
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── Upload Profile Photo ───────────────────────────────────
export async function uploadProfilePhoto(
  userId: string,
  file: File
): Promise<string> {
  const fileName = `avatar_${Date.now()}.${file.name.split(".").pop()}`;
  const storageRef = ref(storage, `profiles/${userId}/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      null,
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── Upload Design Model (Admin) ─────────────────────────────
export function uploadDesignModel(
  userId: string,
  file: File,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `designs/models/${userId}/${fileName}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({
          progress,
          state: snapshot.state as UploadProgress["state"],
        });
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─── Delete File ────────────────────────────────────────────
export async function deleteFile(filePath: string): Promise<void> {
  const storageRef = ref(storage, filePath);
  await deleteObject(storageRef);
}

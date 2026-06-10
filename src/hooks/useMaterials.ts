import { useState, useEffect } from "react";
import type { MaterialDoc } from "@/types/firebase.types";
import { subscribeToMaterials } from "@/services/materials.service";

export function useMaterials() {
  const [materials, setMaterials] = useState<MaterialDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMaterials((data) => {
      setMaterials(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { materials, loading };
}

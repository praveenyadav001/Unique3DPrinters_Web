// ─── useDesigns Hook ─────────────────────────────────────────
// Real-time design catalog with optional category filter

import { useState, useEffect } from "react";
import type { DesignDoc, CategoryDoc } from "@/types/firebase.types";
import { subscribeToDesigns, subscribeToCategories } from "@/services/designs.service";

export function useDesigns() {
  const [designs, setDesigns] = useState<DesignDoc[]>([]);
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubDesigns = subscribeToDesigns((data) => {
      setDesigns(data);
      setLoading(false);
    });

    const unsubCats = subscribeToCategories((data) => {
      setCategories(data);
    });

    return () => {
      unsubDesigns();
      unsubCats();
    };
  }, []);

  return { designs, categories, loading };
}

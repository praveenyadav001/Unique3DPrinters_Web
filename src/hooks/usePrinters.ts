import { useState, useEffect } from "react";
import type { PrinterDoc } from "@/types/firebase.types";
import { subscribeToPrinters } from "@/services/printers.service";

export function usePrinters() {
  const [printers, setPrinters] = useState<PrinterDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPrinters((data) => {
      setPrinters(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { printers, loading };
}

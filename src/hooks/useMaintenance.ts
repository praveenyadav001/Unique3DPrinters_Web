import { useState, useEffect } from "react";
import type { MaintenanceLogDoc } from "@/types/firebase.types";
import { subscribeToMaintenanceLogs } from "@/services/maintenance.service";

export function useMaintenance() {
  const [logs, setLogs] = useState<MaintenanceLogDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToMaintenanceLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { logs, loading };
}

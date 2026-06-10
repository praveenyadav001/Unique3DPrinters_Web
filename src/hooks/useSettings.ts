import { useState, useEffect } from "react";
import type { SystemSettingsDoc, WebsiteSettingsDoc } from "@/types/firebase.types";
import { subscribeToSystemSettings, subscribeToWebsiteSettings } from "@/services/settings.service";

export function useSettings() {
  const [systemSettings, setSystemSettings] = useState<SystemSettingsDoc | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sysLoaded = false;
    let webLoaded = false;

    const checkLoaded = () => {
      if (sysLoaded && webLoaded) setLoading(false);
    };

    const unsubSys = subscribeToSystemSettings((data) => {
      setSystemSettings(data);
      sysLoaded = true;
      checkLoaded();
    });

    const unsubWeb = subscribeToWebsiteSettings((data) => {
      setWebsiteSettings(data);
      webLoaded = true;
      checkLoaded();
    });

    return () => {
      unsubSys();
      unsubWeb();
    };
  }, []);

  return { systemSettings, websiteSettings, loading };
}

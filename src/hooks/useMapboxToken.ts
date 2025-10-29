import { useEffect, useState } from "react";
import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox-config";

export function useMapboxToken() {
  const [token, setToken] = useState<string>(MAPBOX_PUBLIC_TOKEN || "");
  const [loading, setLoading] = useState<boolean>(!Boolean(MAPBOX_PUBLIC_TOKEN));

  useEffect(() => {
    if (MAPBOX_PUBLIC_TOKEN) return; // Already provided at build time

    const fetchToken = async () => {
      try {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-mapbox-token`;
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.token) {
          setToken(data.token as string);
        } else {
          console.error("Failed to retrieve Mapbox token", data);
        }
      } catch (err) {
        console.error("Error fetching Mapbox token", err);
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return { token, loading };
}

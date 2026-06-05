import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
    __initRutaMap?: () => void;
  }
}

type Stop = {
  id: string;
  lat: number;
  lng: number;
  label: string;
};

interface Props {
  stops: Stop[];
  polyline?: string | null;
}

let loaderPromise: Promise<void> | null = null;
function loadGmaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
    if (!key) {
      reject(new Error("Falta API key de Google Maps"));
      return;
    }
    window.__initRutaMap = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__initRutaMap${channel ? `&channel=${channel}` : ""}`;
    s.async = true;
    s.onerror = () => reject(new Error("No se pudo cargar Google Maps"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

function decodePolyline(encoded: string): { lat: number; lng: number }[] {
  const points: { lat: number; lng: number }[] = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }
  return points;
}

export function RutaMap({ stops, polyline }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadGmaps()
      .then(() => {
        if (cancelled || !ref.current) return;
        if (!mapRef.current) {
          mapRef.current = new window.google.maps.Map(ref.current, {
            zoom: 12,
            center: stops[0] ?? { lat: 40.4168, lng: -3.7038 },
            disableDefaultUI: true,
            zoomControl: true,
          });
        }
        // Clear previous
        overlaysRef.current.forEach((o) => o.setMap(null));
        overlaysRef.current = [];

        const bounds = new window.google.maps.LatLngBounds();
        stops.forEach((s, i) => {
          const m = new window.google.maps.Marker({
            position: { lat: s.lat, lng: s.lng },
            map: mapRef.current,
            label: { text: String(i + 1), color: "#fff", fontWeight: "600" },
            title: s.label,
          });
          overlaysRef.current.push(m);
          bounds.extend({ lat: s.lat, lng: s.lng });
        });

        if (polyline) {
          const path = decodePolyline(polyline);
          const line = new window.google.maps.Polyline({
            path,
            map: mapRef.current,
            strokeColor: "#2563eb",
            strokeOpacity: 0.85,
            strokeWeight: 4,
          });
          overlaysRef.current.push(line);
          path.forEach((p) => bounds.extend(p));
        }

        if (stops.length) mapRef.current.fitBounds(bounds, 48);
      })
      .catch((err) => console.error("Map load error", err));
    return () => { cancelled = true; };
  }, [stops, polyline]);

  if (!stops.length) return null;
  return <div ref={ref} className="w-full h-72 rounded-lg border border-border" />;
}

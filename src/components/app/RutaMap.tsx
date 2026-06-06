/// <reference types="google.maps" />
import { useEffect, useMemo, useRef, useState } from "react";
import {
  APIProvider,
  Map as GMap,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
  Pin,
} from "@vis.gl/react-google-maps";
import { useServerFn } from "@tanstack/react-start";
import { setPiscinaCoords } from "@/lib/rutas.functions";

export type RutaMapStop = {
  paradaId: string;
  piscinaId: string;
  alias: string;
  cliente: string;
  direccion: string | null;
  lat: number | null;
  lng: number | null;
};

interface Props {
  stops: RutaMapStop[];
  polyline?: string | null;
}

const API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ??
  "AIzaSyCZeOylI9EuakATmwExXB8c8YV9hmKweio";

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

type Resolved = RutaMapStop & { lat: number; lng: number };

function MapContent({
  resolved,
  polyline,
}: {
  resolved: Resolved[];
  polyline?: string | null;
}) {
  const map = useMap();
  const [openId, setOpenId] = useState<string | null>(null);
  const polyRef = useRef<google.maps.Polyline | null>(null);

  // Fit bounds whenever the set of points changes
  useEffect(() => {
    if (!map || resolved.length === 0) return;
    const bounds = new google.maps.LatLngBounds();
    resolved.forEach((s) => bounds.extend({ lat: s.lat, lng: s.lng }));
    if (polyline) decodePolyline(polyline).forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 48);
  }, [map, resolved, polyline]);

  // Draw polyline
  useEffect(() => {
    if (!map) return;
    polyRef.current?.setMap(null);
    polyRef.current = null;
    const path = polyline
      ? decodePolyline(polyline)
      : resolved.map((s) => ({ lat: s.lat, lng: s.lng }));
    if (path.length < 2) return;
    polyRef.current = new google.maps.Polyline({
      path,
      map,
      strokeColor: "#2563eb",
      strokeOpacity: 0.85,
      strokeWeight: 4,
    });
    return () => {
      polyRef.current?.setMap(null);
      polyRef.current = null;
    };
  }, [map, resolved, polyline]);

  return (
    <>
      {resolved.map((s, i) => (
        <AdvancedMarker
          key={s.paradaId}
          position={{ lat: s.lat, lng: s.lng }}
          onClick={() => setOpenId(s.paradaId)}
        >
          <Pin background="#2563eb" borderColor="#1e40af" glyphColor="#fff">
            <span style={{ fontWeight: 600 }}>{i + 1}</span>
          </Pin>
        </AdvancedMarker>
      ))}
      {openId &&
        (() => {
          const s = resolved.find((r) => r.paradaId === openId);
          if (!s) return null;
          return (
            <InfoWindow
              position={{ lat: s.lat, lng: s.lng }}
              onCloseClick={() => setOpenId(null)}
            >
              <div style={{ minWidth: 160 }}>
                <div style={{ fontWeight: 600 }}>{s.alias}</div>
                <div style={{ fontSize: 12, color: "#555" }}>{s.cliente}</div>
              </div>
            </InfoWindow>
          );
        })()}
    </>
  );
}

function Geocoder({
  stops,
  onResolved,
}: {
  stops: RutaMapStop[];
  onResolved: (resolved: Resolved[]) => void;
}) {
  const geocodingLib = useMapsLibrary("geocoding");
  const persistFn = useServerFn(setPiscinaCoords);
  // Stable key for the input set
  const key = useMemo(
    () =>
      stops
        .map((s) => `${s.paradaId}:${s.lat ?? ""}:${s.lng ?? ""}:${s.direccion ?? ""}`)
        .join("|"),
    [stops],
  );

  useEffect(() => {
    let cancelled = false;
    const ready: Resolved[] = stops
      .filter((s) => s.lat != null && s.lng != null)
      .map((s) => ({ ...s, lat: s.lat as number, lng: s.lng as number }));
    const needs = stops.filter(
      (s) => (s.lat == null || s.lng == null) && s.direccion && s.direccion.trim().length > 0,
    );

    if (!geocodingLib || needs.length === 0) {
      // Emit in original order
      const byId = new Map(ready.map((r) => [r.paradaId, r]));
      onResolved(
        stops
          .map((s) => byId.get(s.paradaId))
          .filter((r): r is Resolved => Boolean(r)),
      );
      return;
    }

    const geocoder = new geocodingLib.Geocoder();
    (async () => {
      const results: Resolved[] = [...ready];
      for (const s of needs) {
        try {
          const { results: r } = await geocoder.geocode({ address: s.direccion! });
          const hit = r?.[0]?.geometry?.location;
          if (hit) {
            const lat = hit.lat();
            const lng = hit.lng();
            results.push({ ...s, lat, lng });
            // Persist for future loads (don't block UI on failure)
            persistFn({ data: { id: s.piscinaId, lat, lng } }).catch(() => {});
          }
        } catch {
          // ignore individual failures
        }
        if (cancelled) return;
      }
      if (cancelled) return;
      const byId = new Map(results.map((r) => [r.paradaId, r]));
      onResolved(
        stops
          .map((s) => byId.get(s.paradaId))
          .filter((r): r is Resolved => Boolean(r)),
      );
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, geocodingLib]);

  return null;
}

export function RutaMap({ stops, polyline }: Props) {
  const [resolved, setResolved] = useState<Resolved[]>([]);

  if (!stops.length) return null;

  return (
    <div className="w-full rounded-lg border border-border overflow-hidden" style={{ height: 400 }}>
      <APIProvider apiKey={API_KEY}>
        <GMap
          mapId="cloro-ruta-map"
          defaultCenter={{ lat: 40.4168, lng: -3.7038 }}
          defaultZoom={6}
          disableDefaultUI
          zoomControl
          gestureHandling="greedy"
        >
          <Geocoder stops={stops} onResolved={setResolved} />
          {resolved.length > 0 && <MapContent resolved={resolved} polyline={polyline} />}
        </Map>
      </APIProvider>
    </div>
  );
}

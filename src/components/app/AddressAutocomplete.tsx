/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

const BROWSER_KEY = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string;
const CHANNEL = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string;

let loaderPromise: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.maps?.places) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise<void>((resolve, reject) => {
    (window as any).__initMapsAutocomplete = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${BROWSER_KEY}&libraries=places&loading=async&callback=__initMapsAutocomplete&channel=${CHANNEL}`;
    s.async = true;
    s.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(s);
  });
  return loaderPromise;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export function AddressAutocomplete({ value, onChange, placeholder, required, id }: Props) {
  const [suggestions, setSuggestions] = useState<Array<{ id: string; text: string }>>([]);
  const [open, setOpen] = useState(false);
  const sessionRef = useRef<any>(null);
  const tRef = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMaps().catch(() => {});
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function fetchSuggestions(input: string) {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(async () => {
      try {
        await loadMaps();
        const places = (window as any).google?.maps?.places;
        if (!places?.AutocompleteSuggestion) return;
        if (!sessionRef.current) sessionRef.current = new places.AutocompleteSessionToken();
        const { suggestions: s } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input,
          sessionToken: sessionRef.current,
          language: "es",
          region: "es",
        });
        const list = (s ?? [])
          .map((sug: any) => {
            const p = sug.placePrediction;
            if (!p) return null;
            return { id: p.placeId, text: p.text?.toString() ?? "" };
          })
          .filter(Boolean) as Array<{ id: string; text: string }>;
        setSuggestions(list);
        setOpen(list.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 220);
  }

  return (
    <div ref={wrapRef} className="relative">
      <Input
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v);
          if (v.trim().length >= 3) fetchSuggestions(v);
          else { setSuggestions([]); setOpen(false); }
        }}
        onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
        autoComplete="off"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md max-h-64 overflow-auto">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                onChange(s.text);
                setOpen(false);
                setSuggestions([]);
                sessionRef.current = null;
              }}
            >
              {s.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

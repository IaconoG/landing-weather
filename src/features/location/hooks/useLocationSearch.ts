import { useCallback, useState } from "react";
import type { LocationSuggestion } from "../../../types/location.types";

type UseLocationSearchResult = {
  suggestions: LocationSuggestion[];
  error: string | null;
  isLoading: boolean;
  searchLocation: (query: string) => Promise<void>;
  clearSearch: () => void;
};

type ProviderItem = {
  id?: string | number;
  name?: string;
  city?: string;
  region?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lon?: number;
};

type ProviderResponse = {
  results?: ProviderItem[];
  items?: ProviderItem[];
  data?: ProviderItem[];
};

const parseCoordinatesQuery = (query: string): LocationSuggestion | null => {
  const parts = query.split(",").map((item) => item.trim());
  if (parts.length !== 2) return null;

  const latitude = Number(parts[0]);
  const longitude = Number(parts[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90) return null;
  if (longitude < -180 || longitude > 180) return null;

  return {
    id: `coords-${latitude}-${longitude}`,
    latitude,
    longitude,
    displayName: `Coordenadas (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
  };
};

const mapItemToSuggestion = (item: ProviderItem): LocationSuggestion | null => {
  const latitude = item.latitude ?? item.lat;
  const longitude = item.longitude ?? item.lon;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }

  const title = item.name ?? item.city ?? "Ubicación";
  const subtitle = [item.region ?? item.state, item.country].filter(Boolean).join(", ");
  const displayName = subtitle ? `${title}, ${subtitle}` : title;

  return {
    id: String(item.id ?? `${title}-${latitude}-${longitude}`),
    latitude,
    longitude,
    displayName,
  };
};

const useLocationSearch = (): UseLocationSearchResult => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearSearch = useCallback(() => {
    setSuggestions([]);
    setError(null);
    setIsLoading(false);
  }, []);

  const searchLocation = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const coordinateSuggestion = parseCoordinatesQuery(trimmedQuery);
    if (coordinateSuggestion) {
      setSuggestions([coordinateSuggestion]);
      setError(null);
      setIsLoading(false);
      return;
    }

    const providerUrl = import.meta.env.VITE_LOCATION_SEARCH_URL as string | undefined;

    if (!providerUrl) {
      setSuggestions([]);
      setError("Búsqueda por nombre pendiente de proveedor. Usa formato lat,lon por ahora.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${providerUrl}?q=${encodeURIComponent(trimmedQuery)}&limit=6`
      );

      if (!response.ok) {
        throw new Error("No se pudo buscar la ubicación.");
      }

      const data = (await response.json()) as ProviderResponse;
      const raw = data.results ?? data.items ?? data.data ?? [];
      const mapped = raw
        .map(mapItemToSuggestion)
        .filter((item): item is LocationSuggestion => item !== null);

      setSuggestions(mapped);

      if (mapped.length === 0) {
        setError("No encontramos resultados para esa búsqueda.");
      }
    } catch (err: unknown) {
      setSuggestions([]);
      setError(err instanceof Error ? err.message : "Error al buscar ubicación.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { suggestions, error, isLoading, searchLocation, clearSearch };
};

export default useLocationSearch;
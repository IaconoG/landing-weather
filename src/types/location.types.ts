export type LocationResponse = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
  timezone?: string;
};

export type LocationSearchInput = {
  query: string;
};

export type LocationState = {
  location?: LocationResponse;
  loading: boolean;
  success: boolean;
  error?: string | null;
};

export type LocationSource = "geolocation" | "search";

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: LocationSource;
};

export type LocationSuggestion = {
  id: string;
  latitude: number;
  longitude: number;
  displayName: string;
};
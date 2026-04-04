/**
 * Ubicacion con coordenadas.
 */
export type LocationResponse = {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
  timezone?: string;
}

/**
 * Parametros de busqueda de ubicacion.
 */
export type LocationSearchInput = {
  query: string;
}

/**
 * Resultado de busqueda de ubicacion.
 */
export type LocationState = {
  location?: LocationResponse;
  loading: boolean;
  success: boolean;
  error?: string | null;
}

/**
 * Fuente de la ubicacion.
 */
export type LocationSource = 'geolocation' | 'search';

export type SelectedLocation = {
  latitude: number;
  longitude: number;
  label: string;
  source: LocationSource;
}
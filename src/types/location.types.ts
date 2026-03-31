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
 * Prametors de busqueda de ubicacion.
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
  errors?: string[] | null;
}

/**
 * Fuente de la ubicacion.
 */
export type LocationSource = 'geolocation' | 'search';

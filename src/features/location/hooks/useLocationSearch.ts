import { useCallback, useState } from 'react'

// Resultado normalizado para la UI (dropdown de sugerencias).
// Si cambias el proveedor, intenta mantener este contrato para no romper componentes.
type LocationSuggestion = {
  id: string
  latitude: number
  longitude: number
  displayName: string
}

// Contrato publico del hook.
// Si cambias nombres de funciones/props, actualiza tambien LocationInput.tsx.
type UseLocationSearchResult = {
  suggestions: LocationSuggestion[]
  error: string | null
  isLoading: boolean
  searchLocation: (query: string) => Promise<void>
  clearSearch: () => void
}

// Shape esperado del proveedor externo (ejemplo).
// ADAPTAR estos campos al proveedor real que elijas.
type LocationApiItem = {
  id?: string
  latitude: number
  longitude: number
  name: string
  region?: string
  country?: string
}

// Si tu API responde en otro contenedor (p.ej. items, data, suggestions), modificar aqui.
type LocationApiResponse = {
  results?: LocationApiItem[]
}

// Punto de mapeo principal.
// MODIFICAR esta funcion cuando cambie la forma de respuesta del proveedor.
const mapApiItemToSuggestion = (item: LocationApiItem): LocationSuggestion => {
  const displayName = [item.name, item.region, item.country].filter(Boolean).join(', ')

  return {
    id: item.id ?? `${item.name}-${item.latitude}-${item.longitude}`,
    latitude: item.latitude,
    longitude: item.longitude,
    displayName,
  }
}

const useLocationSearch = (): UseLocationSearchResult => {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const clearSearch = useCallback(() => {
    setSuggestions([])
    setError(null)
    setIsLoading(false)
  }, [])

  const searchLocation = useCallback(async (query: string) => {
    const trimmedQuery = query.trim()

    // Regla UX minima para no saturar requests con 1 caracter.
    if (trimmedQuery.length < 2) {
      setSuggestions([])
      setError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // INTEGRACION DE EJEMPLO (no acoplada a proveedor especifico).
      // MODIFICAR endpoint, query params y headers segun tu API real.
      // Ejemplo de cambios comunes:
      // - /api/location-search -> /api/geocode
      // - q -> query
      // - limit=6 -> maxResults=10
      const response = await fetch(
        `/api/location-search?q=${encodeURIComponent(trimmedQuery)}&limit=6`
      )

      if (!response.ok) {
        // Si tu API devuelve estructura de error propia, mapearla aqui.
        throw new Error('No se pudo buscar la ubicación.')
      }

      const data = (await response.json()) as LocationApiResponse

      // Si tu API devuelve resultados en otra propiedad, ajustar aqui.
      // p.ej.: const mappedSuggestions = (data.items ?? []).map(mapApiItemToSuggestion)
      const mappedSuggestions = (data.results ?? []).map(mapApiItemToSuggestion)

      setSuggestions(mappedSuggestions)

      if (mappedSuggestions.length === 0) {
        // Mensaje editable para UX.
        setError('No encontramos resultados para esa búsqueda.')
      }
    } catch (err: unknown) {
      setSuggestions([])
      // Personalizar traduccion/mensajes segun tu estrategia de errores.
      setError(err instanceof Error ? err.message : 'Error al buscar ubicación.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { suggestions, error, isLoading, searchLocation, clearSearch }
}

export default useLocationSearch
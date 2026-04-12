import { useCallback, useEffect, useState } from "react";
/* components */
import LocationInput from "../components/LocationInput";
import UseMyLocationButton from "../components/UseMyLocationButton";
import LocationActionButton from "../components/LocationActionButton";
/* store */
import { useWeatherStore } from "../../../store/weather.store";
/* hooks */
import useLocationSearch from "../hooks/useLocationSearch";
import useLocation from "../hooks/useLocation";
/* types */
import type { SelectedLocation } from "../../../types/location.types";
/* styles */
import "./LocationSection.css";

const LocationControlsSection: React.FC = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const locationLabel = useWeatherStore((state) => state.locationLabel);
  const locationSource = useWeatherStore((state) => state.locationSource);
  const recentLocations = useWeatherStore((state) => state.recentLocations);
  const isCurrentLoading = useWeatherStore((state) => state.isCurrentLoading);
  const setLocation = useWeatherStore((state) => state.setLocation);
  const clearLocation = useWeatherStore((state) => state.clearLocation);

  const [query, setQuery] = useState("");

  const {
    suggestions,
    error: searchError,
    isLoading: isSearchLoading,
    searchLocation,
    clearSearch,
  } = useLocationSearch();

  const {
    location: browserLocation,
    error: geolocationError,
    isLoading: isGeolocationLoading,
    requestLocation,
    clearLocationError,
  } = useLocation();

  const handleLocationFound = useCallback(
    (location: SelectedLocation) => {
      if (latitude === location.latitude && longitude === location.longitude)
        return;
      setLocation(location);
    },
    [latitude, longitude, setLocation],
  );

  useEffect(() => {
    if (!browserLocation) return;

    handleLocationFound({
      latitude: browserLocation.latitude,
      longitude: browserLocation.longitude,
      label: `Mi ubicación (${browserLocation.latitude.toFixed(2)}, ${browserLocation.longitude.toFixed(2)})`,
      source: "geolocation",
    });
  }, [browserLocation, handleLocationFound]);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      clearSearch();
      return;
    }

    const timerId = window.setTimeout(() => {
      void searchLocation(trimmed);
    }, 350);

    return () => window.clearTimeout(timerId);
  }, [query, searchLocation, clearSearch]);

  const handleSearch = useCallback(async () => {
    await searchLocation(query);
  }, [query, searchLocation]);

  const handleRequestGeolocation = useCallback(() => {
    clearLocationError();
    requestLocation();
  }, [clearLocationError, requestLocation]);

  const handleClearLocation = useCallback(() => {
    setQuery("");
    clearSearch();
    clearLocationError();
    clearLocation();
  }, [clearLocation, clearLocationError, clearSearch]);

  const hasLocation = latitude !== null && longitude !== null;

  return (
    <section
      className="location-controls-section"
      aria-label="Controles de ubicación"
    >
      <header className="location-controls-section__header">
        <div>
          <h3 className="location-controls-section__title">
            Elegi desde donde ver el clima
          </h3>
        </div>
        {isCurrentLoading && (
          <span className="location-controls-section__loading">
            Actualizando...
          </span>
        )}
      </header>
      <div className="location-controls-section__summary">
        {hasLocation ? (
          <>
            <p className="location-controls-section__summary-label">Actual</p>
            <p className="location-controls-section__summary-value">
              {locationLabel ?? "Ubicacion guardada"}
            </p>
            {locationSource !== "search" && (
              <div className="location-controls-section__meta">
                <span className="location-controls-section__coords">
                  {latitude?.toFixed(2)}, {longitude?.toFixed(3)}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="location-controls-section__summary-label">
              Sin ubicacion activa
            </p>
            <p className="location-controls-section__summary-value">
              Busca una ciudad o usa tu ubicacion para cargar el clima actual.
            </p>
          </>
        )}
        {recentLocations.length > 0 && (
          <div
            className="location-controls-section__history"
            aria-label="Ultimas ubicaciones"
          >
            <p className="location-controls-section__history-label">
              Recientes
            </p>
            <div className="location-controls-section__history-list">
              {recentLocations.map((location) => {
                const isCurrent =
                  latitude === location.latitude &&
                  longitude === location.longitude;

                return (
                  <button
                    key={`${location.latitude}-${location.longitude}`}
                    type="button"
                    className={`location-controls-section__history-item${
                      isCurrent
                        ? " location-controls-section__history-item--current"
                        : ""
                    }`}
                    onClick={() => handleLocationFound(location)}
                    disabled={isCurrent}
                  >
                    <span className="location-controls-section__history-name">
                      {location.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="location-controls-section__actions--input">
        <LocationInput
          query={query}
          isLoading={isSearchLoading}
          error={searchError}
          suggestions={suggestions}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onLocationSelect={handleLocationFound}
        />
      </div>
      {/* estilo solo para boton de request geolocation */}
      <div className="location-controls-section__actions--geolocation">
        <UseMyLocationButton
          isLoading={isGeolocationLoading}
          error={geolocationError}
          onRequestLocation={handleRequestGeolocation}
        />
      </div>
      {/* estilo solo par aboton de clear */}
      <div className="location-controls-section__actions--clear">
        <LocationActionButton
          onClick={handleClearLocation}
          disabled={!hasLocation}
          loading={false}
          label={
            recentLocations.length > 0
              ? "Limpiar ubicaciónes"
              : "Limpiar ubicación"
          }
          variant="secondary"
        />
      </div>

      <p className="location-controls-section__hint">
        Tip: tambien podes escribir coordenadas en formato lat,lon. Ejemplo:
        -34.60,-58.38
      </p>
    </section>
  );
};

export default LocationControlsSection;

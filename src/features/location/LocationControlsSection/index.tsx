import { memo, useCallback, useEffect, useState } from "react";
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

const LocationLoadingBadge = memo(() => {
  const isCurrentLoading = useWeatherStore((state) => state.current.isLoading);

  if (!isCurrentLoading) return null;

  return (
    <span className="location-controls-section__loading">Actualizando...</span>
  );
});

const LocationCurrentSummary = memo(() => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const locationLabel = useWeatherStore((state) => state.locationLabel);
  const locationSource = useWeatherStore((state) => state.locationSource);

  const hasLocation = latitude !== null && longitude !== null;

  return hasLocation ? (
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
  );
});

const LocationRecentHistory = memo(() => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const recentLocations = useWeatherStore((state) => state.recentLocations);
  const setLocation = useWeatherStore((state) => state.setLocation);

  const handleLocationFound = useCallback(
    (location: SelectedLocation) => {
      if (latitude === location.latitude && longitude === location.longitude) {
        return;
      }

      setLocation(location);
    },
    [latitude, longitude, setLocation],
  );

  if (recentLocations.length === 0) return null;

  return (
    <div
      className="location-controls-section__history"
      aria-label="Ultimas ubicaciones"
    >
      <p className="location-controls-section__history-label">Recientes</p>
      <div className="location-controls-section__history-list">
        {recentLocations.map((location) => {
          const isCurrent =
            latitude === location.latitude && longitude === location.longitude;

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
  );
});

type ClearLocationActionProps = {
  onClear: () => void;
};

const ClearLocationAction = memo(({ onClear }: ClearLocationActionProps) => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const recentLocations = useWeatherStore((state) => state.recentLocations);

  const hasLocation = latitude !== null && longitude !== null;

  return (
    <LocationActionButton
      onClick={onClear}
      disabled={!hasLocation}
      loading={false}
      label={
        recentLocations.length > 0 ? "Limpiar ubicaciónes" : "Limpiar ubicación"
      }
      variant="secondary"
    />
  );
});

const LocationControlsSection: React.FC = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const setLocation = useWeatherStore((state) => state.setLocation);
  const clearLocations = useWeatherStore((state) => state.clearLocations);

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

  useEffect(() => {
    if (!browserLocation) return;

    if (
      latitude === browserLocation.latitude &&
      longitude === browserLocation.longitude
    ) {
      return;
    }

    setLocation({
      latitude: browserLocation.latitude,
      longitude: browserLocation.longitude,
      label: `Mi ubicación (${browserLocation.latitude.toFixed(2)}, ${browserLocation.longitude.toFixed(2)})`,
      source: "geolocation",
    });
  }, [browserLocation, latitude, longitude, setLocation]);

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

  const handleSearchLocationSelect = useCallback(
    (location: SelectedLocation) => {
      if (latitude === location.latitude && longitude === location.longitude) {
        return;
      }

      setLocation(location);
    },
    [latitude, longitude, setLocation],
  );

  const handleRequestGeolocation = useCallback(() => {
    clearLocationError();
    requestLocation();
  }, [clearLocationError, requestLocation]);

  const handleClearLocations = useCallback(() => {
    setQuery("");
    clearSearch();
    clearLocationError();
    clearLocations();
  }, [clearLocations, clearLocationError, clearSearch]);

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
        <LocationLoadingBadge />
      </header>
      <div className="location-controls-section__summary">
        <LocationCurrentSummary />
        <LocationRecentHistory />
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
          onLocationSelect={handleSearchLocationSelect}
        />
      </div>
      <div className="location-controls-section__actions--geolocation">
        <UseMyLocationButton
          isLoading={isGeolocationLoading}
          error={geolocationError}
          onRequestLocation={handleRequestGeolocation}
        />
      </div>
      <div className="location-controls-section__actions--clear">
        <ClearLocationAction onClear={handleClearLocations} />
      </div>

      <p className="location-controls-section__hint">
        Tip: tambien podes escribir coordenadas en formato lat,lon. Ejemplo:
        40.7127,-74.0059
      </p>
    </section>
  );
};

export default LocationControlsSection;

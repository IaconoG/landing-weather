import { useCallback, useEffect, useState } from "react";
/* components */
import LocationInput from "../components/LocationInput";
import UseMyLocationButton from "../components/UseMyLocationButton";
import LocationLoadingBadge from "./LocationLoadingBadge";
import LocationRecentHistory from "./LocationRecentHistory";
import ClearLocationAction from "./ClearLocationAction";
import ThemePlaceholderButton from "./ThemePlaceholderButton";
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
  const currentIsLoading = useWeatherStore((state) => state.current.isLoading);
  const recentLocations = useWeatherStore((state) => state.recentLocations);
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

  const hasLocation = latitude !== null && longitude !== null;

  return (
    <section
      className="location-controls-section"
      aria-label="Controles de ubicación"
    >
      <header className="location-controls-section__header">
        <div className="location-controls-section__actions">
          <div className="location-controls-section__actions-left">
            <UseMyLocationButton
              isLoading={isGeolocationLoading}
              error={geolocationError}
              onRequestLocation={handleRequestGeolocation}
            />
            <ClearLocationAction
              onClear={handleClearLocations}
              hasLocation={hasLocation}
              hasRecentLocations={recentLocations.length > 0}
            />
          </div>
          <div className="location-controls-section__actions-right">
            <ThemePlaceholderButton />
          </div>
        </div>
      </header>

      <div className="location-controls-section__body">
        <div className="location-controls-section__search">
          <div className="location-controls-section__search-header">
            <h3 className="location-controls-section__title">
              Elegi desde donde ver el clima
            </h3>
            <LocationLoadingBadge isCurrentLoading={currentIsLoading} />
          </div>
          <div className="location-controls-section__search-input">
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
          <p className="location-controls-section__search-hint">
            Tip: tambien podes escribir coordenadas en formato lat,lon. Ejemplo:
            40.7127,-74.0059
          </p>
        </div>

        <div className="location-controls-section__locations">
          <LocationRecentHistory
            latitude={latitude}
            longitude={longitude}
            recentLocations={recentLocations}
            onLocationSelect={handleSearchLocationSelect}
          />
        </div>
      </div>
    </section>
  );
};

export default LocationControlsSection;

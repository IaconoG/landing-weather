import { useCallback, useEffect, useState } from "react";
/* components */
import LocationActions from "./LocationActionsSection";
import LocationSearchSection from "./LocationSearchSection";
import RecentLocationsSection from "./RecentLocationsSection";
/* store */
import { useWeatherStore } from "../../../store/weather.store";
/* hooks */
import useLocationSearch from "../hooks/useLocationSearch";
import useBrowserGeolocation from "../hooks/useBrowserGeolocation";
/* types */
import type { SelectedLocation } from "../../../types/location.types";
/* styles */
import "./LocationControls.css";

const LocationControls: React.FC = () => {
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
    clearLocation,
  } = useBrowserGeolocation();

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
      label: `Mi ubicación (${browserLocation.latitude.toFixed(4)}, ${browserLocation.longitude.toFixed(4)})`,
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
    clearLocations();
    clearLocation();
  }, [clearSearch, clearLocations, clearLocation]);

  const hasLocation = latitude !== null && longitude !== null;
  const hasRecentLocations = recentLocations.length > 0;

  return (
    <div
      className="location-controls-section"
      aria-label="Controles de ubicación"
    >
      <LocationActions
        isGeolocationLoading={isGeolocationLoading}
        geolocationError={geolocationError}
        onRequestGeolocation={handleRequestGeolocation}
        onClearLocations={handleClearLocations}
        hasLocation={hasLocation}
        hasRecentLocations={hasRecentLocations}
      />
      <LocationSearchSection
        isCurrentLoading={currentIsLoading}
        query={query}
        setQuery={setQuery}
        searchError={searchError}
        isSearchLoading={isSearchLoading}
        suggestions={suggestions}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        handleSearchLocationSelect={handleSearchLocationSelect}
      />
      <RecentLocationsSection
        latitude={latitude}
        longitude={longitude}
        recentLocations={recentLocations}
        handleSearchLocationSelect={handleSearchLocationSelect}
      />
    </div>
  );
};

export default LocationControls;

import { useCallback, useEffect, useState } from "react";
import LocationInput from "../components/LocationInput";
import UseMyLocationButton from "../components/UseMyLocationButton";
import { useWeatherStore } from "../../weather/store/weather.store";
import useLocationSearch from "../hooks/useLocationSearch";
import useLocation from "../hooks/useLocation";
import type { SelectedLocation } from "../../../types/location.types";
import "./LocationSection.css";

const LocationControlsSection: React.FC = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const setLocation = useWeatherStore((state) => state.setLocation);

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
      if (latitude === location.latitude && longitude === location.longitude) return;
      setLocation(location);
    },
    [latitude, longitude, setLocation]
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

  return (
    <section className="location-controls-section" aria-label="Controles de ubicación">
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

      <UseMyLocationButton
        isLoading={isGeolocationLoading}
        error={geolocationError}
        onRequestLocation={handleRequestGeolocation}
      />
    </section>
  );
};

export default LocationControlsSection;
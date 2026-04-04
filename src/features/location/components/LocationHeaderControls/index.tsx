import { useCallback } from "react";
import LocationInput from "../LocationInput";
import UseMyLocationButton from "../UseMyLocationButton";
import { useWeatherStore } from "../../../weather/store/weather.store";
import type { SelectedLocation  } from "../../../../types/location.types";
import "./LocationHeaderControls.css";

const LocationHeaderControls: React.FC = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const setLocation = useWeatherStore((state) => state.setLocation);

  const handleLocationFound = useCallback(
    (location: SelectedLocation) => {
      if (latitude === location.latitude && longitude === location.longitude) {
        return;
      }
      setLocation(location);
    },
    [latitude, longitude, setLocation]
  );

  return (
    <div className="location-header-controls">
      <LocationInput onLocationSelect={handleLocationFound} />
      <UseMyLocationButton onLocationFound={handleLocationFound} />
    </div>
  );
};

export default LocationHeaderControls;
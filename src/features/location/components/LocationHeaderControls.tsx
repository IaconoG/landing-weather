import { useCallback } from "react";
import LocationInput from "./LocationInput";
import UseMyLocationButton from "./UseMyLocationButton";
import { useWeatherStore } from "../../weather/store/weather.store";
import "./LocationHeaderControls.css";

const LocationHeaderControls: React.FC = () => {
  const latitude = useWeatherStore((state) => state.latitude);
  const longitude = useWeatherStore((state) => state.longitude);
  const setLocation = useWeatherStore((state) => state.setLocation);

  const handleLocationFound = useCallback(
    (location: { latitude: number; longitude: number }) => {
      console.log("Ubicación encontrada:", location);
      if (latitude === location.latitude && longitude === location.longitude) {
        console.log("La ubicación encontrada es la misma que la actual.");
        return;
      }
      setLocation(location.latitude, location.longitude);
  }, [latitude, longitude, setLocation]);

  return (
    <div className="location-header-controls">
      <LocationInput onLocationSelect={handleLocationFound} />
      <UseMyLocationButton onLocationFound={handleLocationFound} />
    </div>
  );
};

export default LocationHeaderControls;
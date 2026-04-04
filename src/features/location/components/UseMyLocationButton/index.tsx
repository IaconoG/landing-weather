import { useEffect } from "react";
import useLocation from "../../hooks/useLocation";
import "./UseMyLocationButton.css";
import type { SelectedLocation } from "../../../../types/location.types";

type UseMyLocationButtonProps = {
  onLocationFound: (location: SelectedLocation ) => void
}

const UseMyLocationButton: React.FC<UseMyLocationButtonProps> = ({ onLocationFound }) => {
  const { location, requestLocation, isLoading, error } = useLocation();

  useEffect(() => {
    if (!location) return;
    onLocationFound({
      latitude: location.latitude,
      longitude: location.longitude,
      label: `Mi ubicación (${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)})`,
      source: 'geolocation',
    });
  }, [location, onLocationFound]);


  return (
    <div className="use-my-location-button">
      <button
        onClick={requestLocation}
        disabled={isLoading}
        className="use-my-location-button__button"
      >
        {isLoading ? "Obteniendo ubicación..." : "Usar mi ubicación"}
      </button>
      {error && <p className="use-my-location-button__error">{error}</p>}
    </div>
  );
}


export default UseMyLocationButton;
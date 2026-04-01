import { useEffect } from "react";
import useLocation from "../hooks/useLocation";
import "./UseMyLocationButton.css";

type UseMyLocationButtonProps = {
  onLocationFound: (location: { latitude: number; longitude: number }) => void;
}



const UseMyLocationButton: React.FC<UseMyLocationButtonProps> = ({ onLocationFound }) => {
  const { location, requestLocation, isLoading, error } = useLocation();

  useEffect(() => {
    if (!location) return;
    onLocationFound(location);
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
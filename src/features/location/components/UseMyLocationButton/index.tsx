import "./UseMyLocationButton.css";
import LocationActionButton from "../LocationActionButton";

type UseMyLocationButtonProps = {
  isLoading: boolean;
  error: string | null;
  onRequestLocation: () => void;
};

const UseMyLocationButton: React.FC<UseMyLocationButtonProps> = ({
  isLoading,
  error,
  onRequestLocation,
}) => {
  return (
    <div className="use-my-location-button">
      <LocationActionButton
        onClick={onRequestLocation}
        disabled={false}
        loading={isLoading}
        loadingLabel="Obteniendo ubicación..."
        label="Usar mi ubicación"
        variant="secondary"
      />
      {error && <p className="use-my-location-button__error">{error}</p>}
    </div>
  );
};

export default UseMyLocationButton;

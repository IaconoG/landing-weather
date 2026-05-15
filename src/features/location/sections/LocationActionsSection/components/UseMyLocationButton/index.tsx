import LocationActionButton from "../../../../components/LocationActionButton";

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
  console.log("error:", error); // Log the error to see if it's being set correctly
  return (
    <LocationActionButton
      onClick={onRequestLocation}
      disabled={false}
      loading={isLoading}
      loadingLabel="Obteniendo ubicación..."
      label="Usar mi ubicación"
      variant="secondary"
    />
  );
};

export default UseMyLocationButton;

/* IMPLMENT ERROR ON TOAST */

/* {error && <p className="use-my-location-button__error">{error}</p>} */

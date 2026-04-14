import LocationActionButton from "../components/LocationActionButton";

type ClearLocationActionProps = {
  onClear: () => void;
  hasLocation: boolean;
  hasRecentLocations: boolean;
};

const ClearLocationsButton: React.FC<ClearLocationActionProps> = ({
  onClear,
  hasLocation,
  hasRecentLocations,
}) => {
  return (
    <LocationActionButton
      onClick={onClear}
      disabled={!hasLocation}
      loading={false}
      label={hasRecentLocations ? "Limpiar ubicaciones" : "Limpiar ubicación"}
      variant="secondary"
    />
  );
};

export default ClearLocationsButton;

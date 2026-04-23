import ThemeButtonEmpty from "./components/ThemeButtonEmpty";
import UseMyLocationButton from "./components/UseMyLocationButton";
import ClearLocationsButton from "./components/ClearLocationsButton";
import "./LocationActionsSection.css";

type LocationActionsProps = {
  isGeolocationLoading: boolean;
  geolocationError: string | null;
  onRequestGeolocation: () => void;
  onClearLocations: () => void;
  hasLocation: boolean;
  hasRecentLocations: boolean;
};

const LocationActionsSection = ({
  isGeolocationLoading,
  geolocationError,
  onRequestGeolocation,
  onClearLocations,
  hasLocation,
  hasRecentLocations,
}: LocationActionsProps) => {
  return (
    <div className="location-controls-section__actions">
      <div className="location-controls-section__actions-left">
        <UseMyLocationButton
          isLoading={isGeolocationLoading}
          error={geolocationError}
          onRequestLocation={onRequestGeolocation}
        />
        <ClearLocationsButton
          onClear={onClearLocations}
          hasLocation={hasLocation}
          hasRecentLocations={hasRecentLocations}
        />
      </div>
      <div className="location-controls-section__actions-right">
        <ThemeButtonEmpty />
      </div>
    </div>
  );
};

export default LocationActionsSection;

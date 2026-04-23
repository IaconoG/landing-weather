import type { SelectedLocation } from "../../../../types/location.types";
import RecentLocationsList from "./components/RecentLocationsList";

type RecentLocationsSectionProps = {
  latitude: number | null;
  longitude: number | null;
  recentLocations: SelectedLocation[];
  handleSearchLocationSelect: (location: SelectedLocation) => void;
};

const RecentLocationsSection = ({
  latitude,
  longitude,
  recentLocations,
  handleSearchLocationSelect,
}: RecentLocationsSectionProps) => {
  return (
    <div className="location-controls-section__locations">
      <RecentLocationsList
        latitude={latitude}
        longitude={longitude}
        recentLocations={recentLocations}
        onLocationSelect={handleSearchLocationSelect}
      />
    </div>
  );
};

export default RecentLocationsSection;

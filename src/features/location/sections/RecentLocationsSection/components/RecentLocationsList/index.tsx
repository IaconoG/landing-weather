import { useMemo } from "react";
import type { SelectedLocation } from "../../../../../../types/location.types";
import "./RecentLocationsList.css";

type LocationRecentHistoryProps = {
  latitude: number | null;
  longitude: number | null;
  recentLocations: SelectedLocation[];
  onLocationSelect: (location: SelectedLocation) => void;
};

const RecentLocationsList: React.FC<LocationRecentHistoryProps> = ({
  latitude,
  longitude,
  recentLocations,
  onLocationSelect,
}) => {
  const orderedLocations = useMemo(() => {
    return [...recentLocations].sort((a, b) => {
      const isCurrentA = latitude === a.latitude && longitude === a.longitude;
      const isCurrentB = latitude === b.latitude && longitude === b.longitude;

      if (isCurrentA === isCurrentB) return 0;
      return isCurrentA ? -1 : 1;
    });
  }, [recentLocations, latitude, longitude]);

  if (orderedLocations.length === 0) {
    return null;
  }

  return (
    <div
      className="location-controls-section__history"
      aria-label="Ultimas ubicaciones"
    >
      <div className="location-controls-section__history-list">
        {orderedLocations.map((location) => {
          const isCurrent =
            latitude === location.latitude && longitude === location.longitude;

          return (
            <button
              key={`${location.latitude}-${location.longitude}`}
              type="button"
              className={`location-controls-section__history-item${
                isCurrent
                  ? " location-controls-section__history-item--current"
                  : ""
              }`}
              onClick={() => onLocationSelect(location)}
              disabled={isCurrent}
            >
              <span className="location-controls-section__history-name">
                {location.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RecentLocationsList;

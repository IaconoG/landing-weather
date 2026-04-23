import LocationInput from "./components/LocationInput";
import LocationLoadingBadge from "./components/LocationLoadingBadge";
import type {
  LocationSuggestion,
  SelectedLocation,
} from "../../../../types/location.types";
import "./LocationSearchSection.css";

type LocationSearchSectionProps = {
  isCurrentLoading: boolean;
  query: string;
  setQuery: (query: string) => void;
  searchError: string | null;
  isSearchLoading: boolean;
  suggestions: LocationSuggestion[];
  handleSearch: () => Promise<void>;
  clearSearch: () => void;
  handleSearchLocationSelect: (location: SelectedLocation) => void;
};

const LocationSearchSection = ({
  isCurrentLoading,
  query,
  setQuery,
  searchError,
  isSearchLoading,
  suggestions,
  handleSearch,
  clearSearch,
  handleSearchLocationSelect,
}: LocationSearchSectionProps) => {
  return (
    <div className="location-controls-section__search">
      <div className="location-controls-section__search-header">
        <h3 className="location-controls-section__title">
          Elegi desde donde ver el clima
        </h3>
        <LocationLoadingBadge isCurrentLoading={isCurrentLoading} />
      </div>
      <div className="location-controls-section__search-input">
        <LocationInput
          query={query}
          isLoading={isSearchLoading}
          error={searchError}
          suggestions={suggestions}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onClearSearch={clearSearch}
          onLocationSelect={handleSearchLocationSelect}
        />
      </div>
    </div>
  );
};

export default LocationSearchSection;

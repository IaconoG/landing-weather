import type { LocationSuggestion, SelectedLocation } from "../../../../types/location.types";
import "./LocationInput.css";

type LocationInputProps = {
  query: string;
  isLoading: boolean;
  error: string | null;
  suggestions: LocationSuggestion[];
  onQueryChange: (value: string) => void;
  onSearch: () => Promise<void>;
  onClearSearch: () => void;
  onLocationSelect: (location: SelectedLocation) => void;
};

const LocationInput: React.FC<LocationInputProps> = ({
  query,
  isLoading,
  error,
  suggestions,
  onQueryChange,
  onSearch,
  onClearSearch,
  onLocationSelect,
}) => {
  const handleSelectResult = (option: LocationSuggestion) => {
    onLocationSelect({
      latitude: option.latitude,
      longitude: option.longitude,
      label: option.displayName,
      source: "search",
    });
    onQueryChange(option.displayName);
    onClearSearch();
  };

  return (
    <div className="location-input">
      <input
        type="text"
        className="location-input__input"
        placeholder="Busca tu ciudad o coordenadas (lat,lon)"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") void onSearch();
        }}
        disabled={isLoading}
      />

      {error && <p className="location-input__error">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="location-input__results" role="listbox">
          {suggestions.map((option) => (
            <li key={option.id} className="location-input__result-item">
              <button
                type="button"
                className="location-input__select-button"
                onClick={() => handleSelectResult(option)}
              >
                {option.displayName}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
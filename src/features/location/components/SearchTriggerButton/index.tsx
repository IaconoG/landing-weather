import LocationActionButton from "../LocationActionButton";
import "./SearchTriggerButton.css";

type SearchTriggerButtonProps = {
  isLoading: boolean;
  query: string;
  onSearch: () => void;
};

const SearchTriggerButton: React.FC<SearchTriggerButtonProps> = ({
  isLoading,
  query,
  onSearch,
}) => {
  return (
    <div className="search-trigger-button">
      <LocationActionButton
        onClick={onSearch}
        disabled={!query.trim()}
        loading={isLoading}
        loadingLabel="Buscando..."
        label="Buscar"
        variant="primary"
      />
    </div>
  );
};

export default SearchTriggerButton;
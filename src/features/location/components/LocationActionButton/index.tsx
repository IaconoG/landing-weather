import "./LocationActionButton.css";

type LocationActionButtonProps = {
  loading: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  label: string;
  loadingLabel?: string;
  onClick: () => void;
};

const LocationActionButton: React.FC<LocationActionButtonProps> = ({
  loading,
  disabled = false,
  variant = "secondary",
  label,
  loadingLabel,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={`location-action-button location-action-button--${variant}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (loadingLabel ?? "Cargando...") : label}
    </button>
  );
};

export default LocationActionButton;

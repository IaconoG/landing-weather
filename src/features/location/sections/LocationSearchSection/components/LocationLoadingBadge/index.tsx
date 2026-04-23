type LocationLoadingBadgeProps = {
  isCurrentLoading: boolean;
};

const LocationLoadingBadge: React.FC<LocationLoadingBadgeProps> = ({
  isCurrentLoading,
}) => {
  if (!isCurrentLoading) return null;

  return (
    <span className="location-controls-section__loading">Actualizando...</span>
  );
};

export default LocationLoadingBadge;

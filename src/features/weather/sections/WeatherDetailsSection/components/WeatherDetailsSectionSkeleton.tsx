import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherDetailsSectionSkeleton: React.FC = () => {
  return (
    <div className="weather-details-section weather-details-section--skeleton">
      <BaseSkeleton
        className="weather-details-section__skeleton-title"
        variant="text"
        height={24}
        width={400}
      />
      <div className="weather-details-section__skeleton-metrics">
        <BaseSkeleton variant="card" height={250} width={300} />
        <BaseSkeleton variant="card" height={250} width={300} />
        <BaseSkeleton variant="card" height={250} width={300} />
        <BaseSkeleton variant="card" height={250} width={300} />
      </div>
    </div>
  );
};

export default WeatherDetailsSectionSkeleton;
import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherMonthlySectionSkeleton: React.FC = () => {
  return (
    <div className="weather-monthly-section weather-monthly-section--skeleton">
      <BaseSkeleton
        className="weather-monthly-section__skeleton-title"
        variant="text"
        height={24}
        width={400}
      />
      <BaseSkeleton variant="card" height={280} width={960} />
    </div>
  );
};

export default WeatherMonthlySectionSkeleton;

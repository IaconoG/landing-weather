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
    </div>
  );
};

export default WeatherMonthlySectionSkeleton;

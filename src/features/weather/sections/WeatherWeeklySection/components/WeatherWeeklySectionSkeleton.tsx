import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherWeeklySectionSkeleton: React.FC = () => {
  return (
    <div className="weather-weekly-section weather-weekly-section--skeleton">
      <BaseSkeleton
        className="weather-weekly-section__skeleton-title"
        variant="text"
        height={24}
        width={400}
      />
    </div>
  );
};

export default WeatherWeeklySectionSkeleton;

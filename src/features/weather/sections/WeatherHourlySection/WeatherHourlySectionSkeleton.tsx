import BaseSkeleton from "../../../../shared/components/BaseSkeleton";

const WeatherHourlySectionSkeleton: React.FC = () => {
  return (
    <div className="weather-hourly-section weather-hourly-section--skeleton">
      <BaseSkeleton className="weather-hourly-section__skeleton-title" variant="text" height={24} width={400}/>
      <BaseSkeleton variant="text" height={16} width={100} />
      <BaseSkeleton variant="text" height={16} width={100} />
    </div>
  );
};

export default WeatherHourlySectionSkeleton;
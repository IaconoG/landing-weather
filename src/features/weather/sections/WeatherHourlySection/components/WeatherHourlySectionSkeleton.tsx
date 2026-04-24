import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherHourlySectionSkeleton: React.FC = () => {
  return (
    <section className="weather-hourly-section weather-hourly-section--skeleton">
      <BaseSkeleton
        className="weather-hourly-section__skeleton-title"
        variant="text"
        height={24}
        width={280}
      />
      <div className="weather-hourly-section__skeleton-content">
        <BaseSkeleton variant="card" height={260} width={960} />
      </div>
    </section>
  );
};

export default WeatherHourlySectionSkeleton;

import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherMonthlySectionSkeleton: React.FC = () => {
  return (
    <section className="weather-monthly-section weather-monthly-section--skeleton">
      <div className="weather-monthly-section__title">
        <BaseSkeleton
          className="weather-monthly-section__skeleton-title"
          variant="text"
          height={24}
          width={400}
        />
      </div>
      <div className="weather-monthly-section__content weather-monthly-section__content--skeleton">
        <BaseSkeleton variant="card" height={300} width={960} />
      </div>
    </section>
  );
};

export default WeatherMonthlySectionSkeleton;

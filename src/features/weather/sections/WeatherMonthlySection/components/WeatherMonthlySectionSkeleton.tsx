import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherMonthlySectionSkeleton: React.FC = () => {
  return (
    <section className="weather-monthly-section">
      <BaseSkeleton
        className="weather-monthly-section__title"
        variant="text"
        height={24}
        width={400}
      />

      <BaseSkeleton
        className="weather-monthly-section__container"
        variant="card"
        height={480}
        width={960}
      />
    </section>
  );
};

export default WeatherMonthlySectionSkeleton;

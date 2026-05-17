import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherDetailsSectionSkeleton: React.FC = () => {
  return (
    <section className="weather-details-section">
      <BaseSkeleton
        className="weather-details-section__title"
        variant="text"
        height={24}
        width={400}
      />
      <div className="weather-details-section__metrics">
        <BaseSkeleton variant="card" height={200} width={225} />
        <BaseSkeleton variant="card" height={200} width={225} />
        <BaseSkeleton variant="card" height={200} width={225} />
        <BaseSkeleton variant="card" height={200} width={225} />
        <BaseSkeleton variant="card" height={200} width={225} />
        <BaseSkeleton variant="card" height={200} width={225} />
        <BaseSkeleton variant="card" height={200} width={225} />
      </div>
    </section>
  );
};

export default WeatherDetailsSectionSkeleton;

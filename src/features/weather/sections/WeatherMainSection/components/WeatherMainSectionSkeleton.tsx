import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherMainSectionSkeleton: React.FC = () => {
  return (
    <section className="weather-main-section">
      <BaseSkeleton
        className="weather-main-section__title"
        variant="text"
        width={300}
        height={24}
      />
      <BaseSkeleton
        variant="block"
        className="weather-main-section__container"
        width={960}
        height={100}
      />
    </section>
  );
};

export default WeatherMainSectionSkeleton;

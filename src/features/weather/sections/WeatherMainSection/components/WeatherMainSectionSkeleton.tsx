import BaseSkeleton from "../../../../../shared/components/BaseSkeleton";

const WeatherMainSectionSkeleton: React.FC = () => {
  return (
    <div className="weather-main-section weather-main-section--skeleton">
      <BaseSkeleton
        className="weather-main-section__skeleton-title"
        variant="text"
        width={300}
        height={24}
      />
      <BaseSkeleton
        className="weather-main-section__skeleton-temperature"
        variant="block"
        width={100}
        height={74}
      />
      <BaseSkeleton
        className="weather-main-section__skeleton-description"
        variant="text"
        width={210}
        height={50}
      />
      <div className="weather-main-section__skeleton-metrics">
        <BaseSkeleton variant="block" width={100} height={50} />
        <BaseSkeleton variant="block" width={100} height={50} />
        <BaseSkeleton variant="block" width={100} height={50} />
        <BaseSkeleton variant="block" width={100} height={50} />
      </div>
    </div>
  );
};

export default WeatherMainSectionSkeleton;

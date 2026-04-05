import BaseSkeleton from "../../../../shared/components/BaseSkeleton";

const WeatherMainSectionSkeleton: React.FC = () => {
  return (
    <div className="weather-main-section-content weather-main-section-content--skeleton">
      <BaseSkeleton className="weather-main-section-content__skeleton-title" variant="text" width={180} height={24}/>
      <BaseSkeleton className="weather-main-section-content__skeleton-temperature" variant="block" width={140} height={"100%"}/>
      <BaseSkeleton className="weather-main-section-content__skeleton-description" variant="text" width={220} height={36}/>
      <div className="weather-main-section-content__skeleton-metrics">
        <BaseSkeleton variant="block" width={80} height={40}/>
        <BaseSkeleton variant="block" width={80} height={40}/>
        <BaseSkeleton variant="block" width={80} height={40}/>
        <BaseSkeleton variant="block" width={80} height={40}/>
      </div>
    </div>
  );
};

export default WeatherMainSectionSkeleton;
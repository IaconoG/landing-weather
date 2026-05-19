/* store */
import { useWeatherStore } from "../store/weather.store";
/* hooks */
import useWeatherController from "../features/weather/hooks/useWeatherController";
import useWeatherGlobalBanner from "../hooks/useWeatherGlobalBanner";
/* components */
import WeatherPageHeader from "../shared/components/WeatherPageHeader";
import WeatherPageFooter from "../shared/components/WeatherPageFooter";

import WeatherMainSection from "../features/weather/sections/WeatherMainSection";
import WeatherDetailsSection from "../features/weather/sections/WeatherDetailsSection";
// import WeatherHourlySection from "../features/weather/sections/WeatherHourlySection";
import WeatherMonthlySection from "../features/weather/sections/WeatherMonthlySection";

/* styles */
import "./WeatherPage.css";
import SectionBanner from "../shared/components/SectionBanner/SectionBanner";

const WeatherCurrentMainContainer: React.FC = () => {
  const current = useWeatherStore((state) => state.current);

  return (
    <div className="weather-page__main-section">
      <WeatherMainSection
        data={current.data}
        error={current.error}
        isLoading={current.isLoading}
      />
    </div>
  );
};

const WeatherDetailsContainer: React.FC = () => {
  const weekly = useWeatherStore((state) => state.weekly);

  return (
    <WeatherDetailsSection
      data={weekly?.data?.[0] || null}
      error={weekly.error}
      isLoading={weekly.isLoading}
    />
  );
};

// const WeatherHourlyContainer: React.FC = () => {
//   const hourly = useWeatherStore((state) => state.hourly);

//   return (
//     <WeatherHourlySection
//       data={hourly.data}
//       error={hourly.error}
//       isLoading={hourly.isLoading}
//     />
//   );
// };

const WeatherMonthlyContainer: React.FC = () => {
  const monthly = useWeatherStore((state) => state.monthly);

  return (
    <WeatherMonthlySection
      data={monthly.data}
      error={monthly.error}
      isLoading={monthly.isLoading}
    />
  );
};

const WeatherPage: React.FC = () => {
  useWeatherController();
  const { bannerState, onActionClick } = useWeatherGlobalBanner();

  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-page__content">
        {bannerState ? (
          <SectionBanner
            type={bannerState.type}
            message={bannerState.message}
            actionLabel={bannerState.actionLabel}
            onActionClick={onActionClick}
          />
        ) : null}

        <WeatherCurrentMainContainer />
        <WeatherDetailsContainer />
        {/* <WeatherHourlyContainer /> */}
        <WeatherMonthlyContainer />
        {/* <WeatherGraphSection /> */}
        {/* <WeatherMapSection /> */}
        {/* <WeatherAlertsSection /> */}
        {/* <WeatherHistoricalSection /> */}
      </main>

      <WeatherPageFooter />
    </div>
  );
};

export default WeatherPage;

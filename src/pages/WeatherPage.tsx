/* store */
import { useWeatherStore } from "../store/weather.store";
/* hooks */
import useWeatherController from "../features/weather/hooks/useWeatherController";
import useForecastController from "../features/weather/hooks/useForecastController";
/* components */
import WeatherPageHeader from "../shared/components/WeatherPageHeader";
import WeatherPageFooter from "../shared/components/WeatherPageFooter";

import WeatherMainSection from "../features/weather/sections/WeatherMainSection";
import WeatherHourlySection from "../features/weather/sections/WeatherHourlySection";
import WeatherDetailsSection from "../features/weather/sections/WeatherDetailsSection";
import WeatherMonthlySection from "../features/weather/sections/WeatherMonthlySection";

/* styles */
import "./WeatherPage.css";

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

const WeatherCurrentDetailsContainer: React.FC = () => {
  const current = useWeatherStore((state) => state.current);

  return (
    <WeatherDetailsSection
      data={current.data}
      error={current.error}
      isLoading={current.isLoading}
    />
  );
};

const WeatherHourlyContainer: React.FC = () => {
  const hourly = useWeatherStore((state) => state.hourly);

  return (
    <WeatherHourlySection
      data={hourly.data}
      error={hourly.error}
      isLoading={hourly.isLoading}
    />
  );
};

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
  useForecastController();

  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-page__content">
        <WeatherCurrentMainContainer />
        <WeatherCurrentDetailsContainer />
        <WeatherHourlyContainer />
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

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
import WeatherWeeklySection from "../features/weather/sections/WeatherWeeklySection";

/* styles */
import "./WeatherPage.css";

const WeatherCurrentMainContainer: React.FC = () => {
  const current = useWeatherStore((state) => state.current);

  return (
    <div className="weather-main-section">
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

const WeatherWeeklyContainer: React.FC = () => {
  const weekly = useWeatherStore((state) => state.weekly);

  return (
    <WeatherWeeklySection
      data={weekly.data}
      error={weekly.error}
      isLoading={weekly.isLoading}
    />
  );
};

const WeatherPage: React.FC = () => {
  useWeatherController();
  useForecastController();

  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-content">
        <WeatherCurrentMainContainer />
        <WeatherCurrentDetailsContainer />
        <WeatherHourlyContainer />
        <WeatherWeeklyContainer />
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

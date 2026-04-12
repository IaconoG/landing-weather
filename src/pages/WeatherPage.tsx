/* hooks */
import useWeatherController from "../features/weather/hooks/useWeatherController";
/* store */
import { useWeatherStore } from "../store/weather.store";
/* components */
import WeatherPageHeader from "../shared/components/WeatherPageHeader";
import WeatherPageFooter from "../shared/components/WeatherPageFooter";

import WeatherMainSection from "../features/weather/sections/WeatherMainSection";
import WeatherHourlySection from "../features/weather/sections/WeatherHourlySection";
import WeatherDetailsSection from "../features/weather/sections/WeatherDetailsSection";
/* styles */
import "./WeatherPage.css";

const WeatherPage: React.FC = () => {
  useWeatherController();

  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const currentError = useWeatherStore((state) => state.currentError);
  const isCurrentLoading = useWeatherStore((state) => state.isCurrentLoading);

  const hourlyForecast = useWeatherStore((state) => state.hourlyForecast);
  const hourlyError = useWeatherStore((state) => state.hourlyError);
  const isHourlyLoading = useWeatherStore((state) => state.isHourlyLoading);

  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-content">
        <div className="weather-main-section">
          <WeatherMainSection
            data={currentWeather}
            error={currentError}
            isLoading={isCurrentLoading}
          />
        </div>
        <WeatherDetailsSection
          data={currentWeather}
          error={currentError}
          isLoading={isCurrentLoading}
        />
        <WeatherHourlySection
          data={hourlyForecast}
          error={hourlyError}
          isLoading={isHourlyLoading}
        />
        {/* <WeatherForecastSection /> */}
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

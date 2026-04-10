/* hooks */
import useWeatherController from "../features/weather/hooks/useWeatherController";
/* store */
import {useWeatherStore} from "../features/weather/store/weather.store";
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
  const weatherError = useWeatherStore((state) => state.weatherError);
  const isWeatherLoading = useWeatherStore((state) => state.isWeatherLoading);
  
  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-content">
        <div className="weather-main-section">
          <WeatherMainSection 
            data={currentWeather} error={weatherError} isLoading={isWeatherLoading}
          />
        </div>
        <WeatherDetailsSection 
          data={currentWeather} error={weatherError} isLoading={isWeatherLoading}
        />
        <WeatherHourlySection
          data={currentWeather} error={weatherError} isLoading={isWeatherLoading}
        />
          {/* <WeatherGraphSection /> */}
        {/* <WeatherMapSection /> */}
        {/* <WeatherAlertsSection /> */}
        {/* <WeatherForecastSection /> */}
        {/* <WeatherHistoricalSection /> */}
      </main>
      
      <WeatherPageFooter />
    </div>
  )
}


export default WeatherPage;
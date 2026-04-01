import WeatherPageHeader from "../shared/components/WeatherPageHeader";
import WeatherPageFooter from "../shared/components/WeatherPageFooter";
import WeatherCurrentCard from "../features/weather/components/WeatherCurrentCard";
import useWeatherController from "../features/weather/hooks/useWeatherController";
import {useWeatherStore} from "../features/weather/store/weather.store";

const WeatherPage: React.FC = () => {
  useWeatherController();

  const currentWeather = useWeatherStore((state) => state.currentWeather);
  const weatherError = useWeatherStore((state) => state.weatherError);
  const isWeatherLoading = useWeatherStore((state) => state.isWeatherLoading);
  
  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-content">
        <WeatherCurrentCard
          data={currentWeather}
          error={weatherError}
          isLoading={isWeatherLoading}
        />
      </main>
      
      <WeatherPageFooter />
    </div>
  )
}


export default WeatherPage;
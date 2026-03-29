import WeatherPageHeader from "../shared/components/WeatherPageHeader";
import WeatherPageFooter from "../shared/components/WeatherPageFooter";
import WeatherSectionPlaceholder  from "../features/weather/components/WeatherSectionPlaceholder";

const WeatherPage: React.FC = () => {
  return (
    <div className="weather-page">
      <WeatherPageHeader />

      <main className="weather-content">
        <WeatherSectionPlaceholder
          title="Current Weather"
          description="Current conditions and temperature."
          variant="current"
        />
        <WeatherSectionPlaceholder
          title="Weather Metrics"
          description="Feels like, humidity, wind, pressure, UV and AQI."
          variant="metrics"
        />
        <WeatherSectionPlaceholder
          title="Hourly Forecast (24h)"
          description="Weather trend for the next 24 hours."
          variant="hourly"
        />
        <WeatherSectionPlaceholder
          title="Weekly Forecast (7-10 days)"
          description="Daily min/max and outlook."
          variant="weekly"
        />
        <WeatherSectionPlaceholder
          title="Historical Chart"
          description="Recent weather history visualized."
          variant="chart"
        />
      </main>
      
      <WeatherPageFooter />
    </div>
  )
}


export default WeatherPage;
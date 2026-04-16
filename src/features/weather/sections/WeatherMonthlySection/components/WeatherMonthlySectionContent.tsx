import type { WeeklyForecastItem } from "../../../../../types/weather.types";

type WeatherMonthlySectionProps = {
  _data: WeeklyForecastItem[] | null;
};

const WeatherMonthlySectionContent: React.FC<WeatherMonthlySectionProps> = ({
  _data,
}) => {
  console.log("Monthly data:", _data); // Log para verificar los datos recibidos
  return (
    <div className="weather-monthly-section">
      <p className="weather-monthly-section__title">Pronóstico mensual</p>
      <div className="weather-monthly-section__content">
        <div className="weather-monthly-section__calendar">
          <div className="weather-monthly-section__week">
            <div className="weather-monthly-section__weekday">Dom</div>
            <div className="weather-monthly-section__weekday">Lun</div>
            <div className="weather-monthly-section__weekday">Mar</div>
            <div className="weather-monthly-section__weekday">Mie</div>
            <div className="weather-monthly-section__weekday">Jue</div>
            <div className="weather-monthly-section__weekday">Vie</div>
            <div className="weather-monthly-section__weekday">Sab</div>
          </div>
          <div className="weather-monthly-section__month">
            {Array.from({ length: 35 }).map((_, index) => (
              <div className="weather-monthly-section__month-day" key={index}>
                <button className="weather-monthly-section__month-day-button">
                  <div className="weather-monthly-section__month-day-number">
                    {index}
                  </div>
                  <div className="weather-monthly-section__month-day-icon">
                    sun
                  </div>

                  <div className="weather-monthly-section__month-day-temperatures">
                    <div className="weather-monthly-section__month-day-maxtemp">
                      {index}°
                    </div>
                    <div className="weather-monthly-section__month-day-mintemp">
                      {-index}°
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMonthlySectionContent;

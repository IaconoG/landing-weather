import type { MonthlySectionViewModel } from "../view-model/weatherMonthly.types";

type WeatherMonthlySectionContentProps = {
  data: MonthlySectionViewModel;
  isPlaceholder: boolean;
};

const WeatherMonthlySectionContent: React.FC<
  WeatherMonthlySectionContentProps
> = ({ data, isPlaceholder }) => {
  return (
    <section
      className={`weather-monthly-section ${isPlaceholder ? "weather-monthly-section--placeholder" : ""}`.trim()}
    >
      <p className="weather-monthly-section__title">Pronostico mensual</p>
      <div className="weather-monthly-section__container">
        <div
          className={`weather-monthly-section__content ${isPlaceholder ? "weather-monthly-section__content--placeholder" : ""}`.trim()}
        >
          <div
            className="weather-monthly-section__weekdays"
            role="list"
            aria-label="Dias de la semana del pronostico mensual"
          >
            <p className="weather-monthly-section__weekday">Dom</p>
            <p className="weather-monthly-section__weekday">Lun</p>
            <p className="weather-monthly-section__weekday">Mar</p>
            <p className="weather-monthly-section__weekday">Mie</p>
            <p className="weather-monthly-section__weekday">Jue</p>
            <p className="weather-monthly-section__weekday">Vie</p>
            <p className="weather-monthly-section__weekday">Sab</p>
          </div>
          <div
            className="weather-monthly-section__grid"
            role="list"
            aria-label="Dias del pronostico mensual"
          >
            {data.days.map((day) => (
              <div
                className={`weather-monthly-section__day ${day.isOutsideCurrentMonth ? "weather-monthly-section__day--outside" : ""} ${day.isToday ? "weather-monthly-section__day--today" : ""} ${!day.hasData ? "weather-monthly-section__day--placeholder" : ""}`.trim()}
                key={day.id}
              >
                <button
                  className={`weather-monthly-section__day-button ${!day.hasData ? "weather-monthly-section__day--placeholder" : ""} `.trim()}
                  type="button"
                  disabled={!day.hasData}
                >
                  <p className="weather-monthly-section__day-date">
                    {day.dateLabel}
                  </p>
                  <p className="weather-monthly-section__day-day">
                    {day.dayLabel}
                  </p>

                  <img
                    className="weather-monthly-section__day-icon"
                    src={day.iconUrl}
                    aria-label={day.description || "--"}
                    alt={day.description || "--"}
                    title={day.description}
                  />

                  <p className="weather-monthly-section__day-range">
                    <span className="weather-monthly-section__day-max">
                      {day.maxTemperatureLabel}
                    </span>
                    <span className="weather-monthly-section__day-min">
                      {day.minTemperatureLabel}
                    </span>
                  </p>
                </button>
              </div>
            ))}
          </div>
          <div className="weather-monthly-section__summary">
            <span className="weather-monthly-section__summary-text">
              Esta vista muestra un resumen del pronostico mensual, con la
              temperatura maxima y minima de cada dia, junto con un icono
              representativo del clima.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherMonthlySectionContent;

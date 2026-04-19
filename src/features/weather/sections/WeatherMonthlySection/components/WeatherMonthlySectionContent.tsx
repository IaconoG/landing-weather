import { useMemo } from "react";
import type { MonthlyForecastItem } from "../../../../../types/weather.types";
import { buildMonthlySectionViewModel } from "../view-model/buildMonthlySectionViewModel";

type WeatherMonthlySectionContentProps = {
  data: MonthlyForecastItem[];
};

const WeatherMonthlySectionContent: React.FC<
  WeatherMonthlySectionContentProps
> = ({ data }) => {
  const viewModel = useMemo(() => buildMonthlySectionViewModel(data), [data]);
  console.log(viewModel);

  return (
    <section className="weather-monthly-section">
      <p className="weather-monthly-section__title">{viewModel.title}</p>
      <div className="weather-monthly-section__content">
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
          {viewModel.days.map((day) => (
            <button
              className={`weather-monthly-section__day ${day.isOutsideCurrentMonth ? "weather-monthly-section__day--outside" : ""} ${day.isToday ? "weather-monthly-section__day--today" : ""}`}
              key={day.id}
              type="button"
            >
              <p className="weather-monthly-section__day-date">
                {day.dateLabel}
              </p>
              <p className="weather-monthly-section__day-day">{day.dayLabel}</p>
              <img
                className="weather-monthly-section__day-icon"
                src={day.iconUrl}
                alt={day.description}
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
          ))}
        </div>
        <div className="weather-monthly-section__summary">
          <span className="weather-monthly-section__summary-text">
            Esta vista muestra un resumen del pronostico mensual, con la
            temperatura máxima y mínima de cada día, junto con un ícono
            representativo del clima esperado.
          </span>
        </div>
      </div>
    </section>
  );
};

export default WeatherMonthlySectionContent;

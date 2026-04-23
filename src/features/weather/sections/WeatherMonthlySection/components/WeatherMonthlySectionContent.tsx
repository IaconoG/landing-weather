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

  console.log("ViewModel days:", viewModel);

  return (
    <>
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
            className={`weather-monthly-section__day ${day.isOutsideCurrentMonth ? "weather-monthly-section__day--outside" : ""} ${day.isToday ? "weather-monthly-section__day--today" : ""} ${!day.hasData ? "weather-monthly-section__day--placeholder" : ""}`}
            key={day.id}
            type="button"
            disabled={!day.hasData}
          >
            <p className="weather-monthly-section__day-date">{day.dateLabel}</p>
            <p className="weather-monthly-section__day-day">{day.dayLabel}</p>

            <img
              className={`weather-monthly-section__day-icon ${!day.hasData ? "weather-monthly-section__day-icon--placeholder" : ""}`}
              src={day.iconUrl}
              alt={day.hasData ? day.description : "Sin datos"}
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
          temperatura maxima y minima de cada dia, junto con un icono
          representativo del clima esperado.
        </span>
      </div>
    </>
  );
};

export default WeatherMonthlySectionContent;

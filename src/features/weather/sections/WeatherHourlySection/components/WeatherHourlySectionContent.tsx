import { useMemo, useState } from "react";
import type { HourlyForecastItem } from "../../../../../types/weather.types";
import { buildHourlySectionViewModel } from "../view-model/buildHourlySectionViewModel";

type WeatherHourlySectionContentProps = {
  data: HourlyForecastItem[];
  sectionStateClass?: string;
  contentStateClass?: string;
};

const WeatherHourlySectionContent: React.FC<
  WeatherHourlySectionContentProps
> = ({ data, sectionStateClass, contentStateClass }) => {
  const viewModel = useMemo(() => buildHourlySectionViewModel(data), [data]);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);

  const activeDay = useMemo(() => {
    if (!viewModel.days.length) return null;

    if (selectedDayId) {
      const selectedDay = viewModel.days.find(
        (day) => day.id === selectedDayId,
      );
      if (selectedDay) return selectedDay;
    }
    return viewModel.days[0];
  }, [selectedDayId, viewModel.days]);

  if (!activeDay) return null;

  console.log("ViewModel days:", viewModel.days);

  return (
    <section
      className={`weather-hourly-section ${sectionStateClass ?? ""}`.trim()}
      aria-label="Seccion de pronostico por horas"
    >
      <p className="weather-hourly-section__title">Pronostico por horas</p>

      <div
        className={`weather-hourly-section__content ${contentStateClass ?? ""}`.trim()}
      >
        <div
          className="weather-hourly-section__day-carousel"
          role="list"
          aria-label="Dias del pronostico horario"
        >
          {viewModel.days.map((day) => {
            const isActive = day.id === activeDay.id;

            return (
              <button
                key={day.id}
                type="button"
                role="listitem"
                className={`weather-hourly-section__day-card${isActive ? " weather-hourly-section__day-card--active" : ""}${!day.hasData ? " weather-hourly-section__day-card--placeholder" : ""}`}
                onClick={() => setSelectedDayId(day.id)}
                aria-pressed={isActive}
              >
                <span className="weather-hourly-section__day-card-name">
                  {day.displayDayLabel !== "none"
                    ? day.displayDayLabel
                    : day.weekdayLabel}
                </span>
                <span className="weather-hourly-section__day-card-date">
                  {day.dateLabel}
                </span>
                <span
                  className={`weather-hourly-section__day-card-icon ${!day.hasData ? "weather-hourly-section__day-card-icon--placeholder" : ""}`}
                  aria-label={day.hasData ? day.iconLabel : "Sin datos"}
                  title={day.hasData ? day.iconLabel : "Sin datos"}
                >
                  {day.hasData ? day.iconLabel : "--"}
                </span>
                <p className="weather-hourly-section__day-card-range">
                  <span className="weather-hourly-section__day-card-range-max">
                    {day.maxTemperatureLabel}{" "}
                  </span>
                  <span className="weather-hourly-section__day-card-range-min">
                    {day.minTemperatureLabel}
                  </span>
                </p>
              </button>
            );
          })}
        </div>

        <div className="weather-hourly-section__detail">
          <div className="weather-hourly-section__detail-header">
            <div className="weather-hourly-section__detail-title-group">
              <p className="weather-hourly-section__detail-title">
                Detalle Horario
              </p>
              <p className="weather-hourly-section__detail-subtitle">
                Proximas 12 horas
              </p>
            </div>

            <div className="weather-hourly-section__detail-summary">
              <span className="weather-hourly-section__detail-summary-value">
                {activeDay.maxTemperatureLabel} /{" "}
                {activeDay.minTemperatureLabel}
              </span>
              <span className="weather-hourly-section__detail-summary-label">
                Maxima / minima
              </span>
            </div>
          </div>

          <div
            className={`weather-hourly-section__detail-body ${!activeDay.hasData ? "weather-hourly-section__detail-body--placeholder" : ""}`}
          >
            <div
              className="weather-hourly-section__chart weather-hourly-section__chart--placeholder"
              aria-label={`Grafico horario para ${activeDay.ariaDayLabel}`}
            >
              {/* Implement chart details for each hour here */}
              {/* {activeDay.hours.map((hour) => {
                const chartPointStyle = {
                  "--temperature-offset": `${hour.temperatureOffset}%`,
                  "--feels-like-offset": `${hour.feelsLikeOffset}%`,
                } as CSSProperties;

                return (
                  <div
                    key={hour.id}
                    className="weather-hourly-section__chart-point"
                    style={chartPointStyle}
                  >
                    <span className="weather-hourly-section__chart-time">
                      {hour.timeLabel}
                    </span>

                    <div className="weather-hourly-section__chart-track">
                      <div className="weather-hourly-section__chart-temperature-bar" />
                      <div className="weather-hourly-section__chart-feels-line" />
                    </div>

                    <span className="weather-hourly-section__chart-temperature-value">
                      {hour.temperatureLabel}
                    </span>
                    <span className="weather-hourly-section__chart-feels-value">
                      ST {hour.feelsLikeLabel}
                    </span>
                  </div>
                );
              })} */}
            </div>

            <div className="weather-hourly-section__precipitation">
              <div className="weather-hourly-section__precipitation-header">
                <p className="weather-hourly-section__precipitation-title">
                  Precipitacion
                </p>
                <span className="weather-hourly-section__precipitation-summary">
                  {activeDay.precipitationSummary}
                </span>
              </div>

              <div className="weather-hourly-section__precipitation-list weather-hourly-section__precipitation-list--placeholder">
                {/* Implement precipitation details for each hour here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherHourlySectionContent;

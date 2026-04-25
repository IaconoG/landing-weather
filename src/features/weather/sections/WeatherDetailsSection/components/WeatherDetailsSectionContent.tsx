import React, { useMemo } from "react";
import type { WeatherDetailsSourceDay } from "../view-model/weatherDetails.source.types";
import { buildWeatherDetailsViewModel } from "../view-model/buildWeatherDetailsViewModel";

type WeatherDetailsSectionContentProps = {
  data: WeatherDetailsSourceDay;
  sectionStateClass?: string;
  contentStateClass?: string;
};

type WeatherDetailsMetric = {
  id: string;
  label: string;
  description: string;
  value: string;
  graph?: React.ReactNode;
};

const WeatherDetailsSectionContent: React.FC<
  WeatherDetailsSectionContentProps
> = ({ data, sectionStateClass, contentStateClass }) => {
  const viewModel = useMemo(() => buildWeatherDetailsViewModel(data), [data]);
  const day = viewModel.day;

  const hasNoData = !day.temperature.points.length;

  const cards: WeatherDetailsMetric[] = [
    {
      id: "temperature",
      label: "Temperatura",
      description: hasNoData
        ? "Min - / Max -"
        : `Min ${Math.round(day.temperature.min)}°C / Max ${Math.round(day.temperature.max)}°C`,
      value: hasNoData ? "-" : `${Math.round(day.temperature.current)}°C`,
    },
    {
      id: "feels-like",
      label: "Sensacion termica",
      description: hasNoData
        ? "Min - / Max -"
        : `Min ${Math.round(day.feelsLike.min)}°C / Max ${Math.round(
            day.feelsLike.max,
          )}°C`,
      value: hasNoData ? "-" : `${Math.round(day.feelsLike.current)}°C`,
    },
    {
      id: "pressure",
      label: "Presion",
      description: hasNoData
        ? "Rango -"
        : `Rango ${Math.round(day.pressure.min)} - ${Math.round(
            day.pressure.max,
          )} hPa`,
      value: hasNoData ? "-" : `${Math.round(day.pressure.current)} hPa`,
    },
    {
      id: "humidity",
      label: "Humedad",
      description:
        day.humidity.dewPoint !== undefined
          ? `Punto de rocio ${Math.round(day.humidity.dewPoint)}°C`
          : "Punto de rocio sin dato",
      value: hasNoData
        ? "- %"
        : `${Math.round(day.humidity.relativeHumidity)}%`,
    },
    {
      id: "pressure",
      label: "Presion",
      description: hasNoData
        ? "Rango"
        : `Rango ${Math.round(day.pressure.min)} - ${Math.round(
            day.pressure.max,
          )} hPa / Tendencia ${day.pressure.trend === "steady" ? "estable" : day.pressure.trend === "rising" ? "subiendo" : "bajando"}`,
      value: hasNoData
        ? "-"
        : day.pressure.trend === "steady"
          ? `${Math.round(day.pressure.current)} hPa Estable`
          : day.pressure.trend === "rising"
            ? `${Math.round(day.pressure.current)} hPa Subiendo`
            : `${Math.round(day.pressure.current)} hPa Bajando`,
    },
    {
      id: "visibility",
      label: "Visibilidad",
      description: hasNoData
        ? "Sin datos"
        : `Visibilidad de ${Math.round(day.visibility.current / 1000)} km`,
      value: hasNoData
        ? "-"
        : `${Math.round(day.visibility.current / 1000)} km`,
    },
    {
      id: "precipitation",
      label: "Probabilidad de precipitacion",
      description: day.precipitation.hasData
        ? `Probabilidad de precipitacion ${Math.round(
            day.precipitation.maxProbability ?? 0,
          )}%`
        : "Sin datos",
      value: day.precipitation.hasData
        ? `${Math.round(day.precipitation.probability ?? 0)}%`
        : "-",
    },
    {
      id: "wind",
      label: "Viento",
      description:
        day.wind.gustSpeed !== undefined
          ? `${day.wind.directionLabel} / Rafagas ${Math.round(
              day.wind.gustSpeed,
            )} km/h`
          : `${day.wind.directionLabel} / Sin rafagas`,
      value: hasNoData ? "- km/h" : `${Math.round(day.wind.speed)} km/h`,
    },
    {
      id: "uv",
      label: "Indice UV",
      description: hasNoData
        ? "Sin datos"
        : `Indice UV ${day.uv.value} (${day.uv.severity.replace("_", " ")})`,
      value: hasNoData ? "-" : `${day.uv.value}`,
    },
    {
      id: "sun",
      label: "Sol",
      description: hasNoData
        ? "Sin datos"
        : `Salida del sol a las ${day.sun.sunriseLabel} / Puesta del sol a las ${day.sun.sunsetLabel}`,
      value: hasNoData ? "-" : `Duracion de luz ${day.sun.daylightLabel}`,
    },
    {
      id: "moon",
      label: "Luna",
      description: day.moon.hasData
        ? `Fase lunar: ${day.moon.phaseLabel} (${day.moon.illuminationPercentage}%)`
        : "Sin datos",
      value: hasNoData
        ? "-"
        : `Salida de la luna a las ${day.moon.moonriseLabel ?? "sin dato"} / Puesta de la luna a las ${day.moon.moonsetLabel ?? "sin dato"}`,
    },
  ];

  return (
    <section
      className={`weather-details-section ${sectionStateClass ?? ""}`.trim()}
    >
      <p className="weather-details-section__title">
        Detalles del tiempo sobre el dia
      </p>
      <div
        className={`weather-details-section__metrics ${contentStateClass ?? ""}`.trim()}
      >
        {cards.map((metric) => (
          <article key={metric.id} className="weather-details-section__metric">
            <span className="weather-details-section__metric-label">
              {metric.label}
            </span>
            <div className="weather-details-section__metric-graph">
              {metric.graph}
            </div>
            <div className="weather-details-section__metric-description">
              <span className="weather-details-section__metric-text">
                {metric.description}
              </span>
              <span className="weather-details-section__metric-value">
                {metric.value}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default WeatherDetailsSectionContent;

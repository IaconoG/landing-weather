import type {
  WeatherDetailsCardViewModel,
  WeatherDetailsDayViewModel,
} from "./weatherDetails.types";
import { PLACEHOLDER_DETAILS_VIEW_MODEL } from "./weatherDetails.placeholder";

const toRounded = (value: number, digits: number = 0): string => {
  const factor = 10 ** digits;
  return String(Math.round(value * factor) / factor);
};

const buildGraphs = () => {
  return undefined; // Placeholder for future graph implementation
};

export const buildDetailsCards = (
  day: WeatherDetailsDayViewModel,
  isPlaceholder: boolean,
): WeatherDetailsCardViewModel[] => {
  if (isPlaceholder) {
    return PLACEHOLDER_DETAILS_VIEW_MODEL.map((card) => ({
      ...card,
      graph: buildGraphs(), // Placeholder cards don't have graphs
    }));
  }

  return [
    {
      id: "temperature",
      label: "Temperatura",
      description: `Min ${toRounded(day.temperature.min)}°C / Max ${toRounded(day.temperature.max)}°C`,
      value: `${toRounded(day.temperature.currentValue)}°C`,
      graph: buildGraphs(),
    },
    {
      id: "feels-like",
      label: "Sensacion termica",
      description: `Min ${toRounded(day.feelsLike.min)}°C / Max ${toRounded(day.feelsLike.max)}°C`,
      value: `${toRounded(day.feelsLike.currentValue)}°C`,
      graph: buildGraphs(),
    },
    {
      id: "humidity",
      label: "Humedad",
      description:
        day.humidity.dewPoint?.currentValue !== undefined
          ? `Punto de rocio ${toRounded(day.humidity.dewPoint.currentValue)}°C`
          : "Punto de rocio sin dato",
      value: `${toRounded(day.humidity.currentValue)}%`,
      graph: buildGraphs(),
    },
    {
      id: "pressure",
      label: "Presion",
      description: `Min ${toRounded(day.pressure.min)} / Max ${toRounded(day.pressure.max)}`,
      value: `${toRounded(day.pressure.currentValue)} hPa`,
      moreInfo:
        day.pressure.trend === "steady"
          ? "Tendencia: Estable"
          : day.pressure.trend === "rising"
            ? "Tendencia: Subiendo"
            : day.pressure.trend === "falling"
              ? "Tendencia: Bajando"
              : undefined,
      graph: buildGraphs(),
    },
    {
      id: "visibility",
      label: "Visibilidad",
      description: `Min ${toRounded(day.visibility.min / 1000, 1)} km / Max ${toRounded(day.visibility.max / 1000, 1)} km`,
      value: `${toRounded(day.visibility.currentValue / 1000, 1)} km`,
      graph: buildGraphs(),
    },
    {
      id: "precipitation",
      label: "Probabilidad de precipitacion",
      description: `Maximo diario ${toRounded(day.precipitation.max)}%`,
      value: `${toRounded(day.precipitation.currentValue)}%`,
      graph: buildGraphs(),
    },
    {
      id: "wind",
      label: "Viento",
      description: `El viento viene del ${day.wind.direction.currentDirectionSymbol}`,
      value: `${toRounded(day.wind.speed.currentValue)} km/h`,
      graph: buildGraphs(),
    },
    {
      id: "uv",
      label: "Indice UV",
      description: `Nivel de riesgo UV: ${day.uv.currentSeverity?.replace("_", " ").toLocaleUpperCase() ?? "Desconocido"}`,
      value: toRounded(day.uv.currentValue, 1),
      graph: buildGraphs(),
    },
    {
      id: "sun",
      label: "Sol",
      description: `Salida ${day.sun.sunriseTimestamp} / Puesta ${day.sun.sunsetTimestamp}`,
      value: `${day.sun.daylightDurationSeconds} horas de luz`,
      graph: buildGraphs(),
    },
    {
      id: "moon",
      label: "Luna",
      description:
        day.moon?.moonriseTimestamp && day.moon?.moonsetTimestamp
          ? `Salida ${day.moon.moonriseTimestamp} / Puesta ${day.moon.moonsetTimestamp}`
          : "Horario lunar sin dato",
      value:
        day.moon?.illuminationPercentage !== undefined
          ? `${day.moon.illuminationPercentage}% iluminada`
          : "--",

      graph: buildGraphs(),
    },
  ];
};

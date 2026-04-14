import type { CurrentWeather } from "../../../../../types/weather.types";

export type MetricKey = Exclude<
  keyof CurrentWeather,
  "timestamp" | "weatherDescription"
>;

export type Metric = {
  id: string;
  label: string;
  value: string;
  description: string;
};

type MetricConfig = {
  label: string;
  description: string;
  format: (value: CurrentWeather[MetricKey]) => string;
};

export const METRIC_CONFIG: Record<MetricKey, MetricConfig> = {
  temperature: {
    label: "Temperatura",
    description: "Temperatura actual medida",
    format: (value) => `${Math.round(Number(value))}°C`,
  },
  feelsLike: {
    label: "Sensación térmica",
    description: "Temperatura percibida",
    format: (value) => `${Math.round(Number(value))}°C`,
  },
  humidity: {
    label: "Humedad",
    description: "Humedad relativa del aire",
    format: (value) => `${Math.round(Number(value))}%`,
  },
  windSpeed: {
    label: "Viento",
    description: "Velocidad del viento",
    format: (value) => `${Math.round(Number(value))} km/h`,
  },
  pressure: {
    label: "Presión",
    description: "Presión atmosférica",
    format: (value) => `${Math.round(Number(value))} hPa`,
  },
  visibility: {
    label: "Visibilidad",
    description: "Alcance visual estimado",
    format: (value) => `${Number(value).toFixed(2)} km`,
  },
  uv: {
    label: "Índice UV",
    description: "Nivel de radiación UV",
    format: (value) => `${Number(value)}`,
  },
};

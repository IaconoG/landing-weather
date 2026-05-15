import type { WeatherDetailsCardViewModel } from "./weatherDetails.types";

export const PLACEHOLDER_DETAILS_VIEW_MODEL: WeatherDetailsCardViewModel[] = [
  {
    id: "temperature",
    label: "Temperatura",
    description: "Min - / Max -",
    value: "- °C",
  },
  {
    id: "feels-like",
    label: "Sensacion termica",
    description: "Min - / Max -",
    value: "- °C",
  },
  {
    id: "humidity",
    label: "Humedad",
    description: "Punto de rocio -- °C",
    value: "- %",
  },
  {
    id: "pressure",
    label: "Presion",
    description: "Min - / Max -",
    value: "- hPa",
  },
  {
    id: "visibility",
    label: "Visibilidad",
    description: "Min - / Max -",
    value: "- km",
  },
  {
    id: "precipitation",
    label: "Probabilidad de precipitacion",
    description: "Maximo diario -%",
    value: "- %",
  },
  {
    id: "wind",
    label: "Viento",
    description: "El viento viene del --",
    value: "- km/h",
  },
  {
    id: "uv",
    label: "Indice UV",
    description: "Nivel de riesgo UV: --",
    value: "-",
  },
  {
    id: "sun",
    label: "Sol",
    description: "Salida --:-- / Puesta --:--",
    value: "ilum. --",
  },
  {
    id: "moon",
    label: "Luna",
    description: "Salida --:-- / Puesta  --:--",
    value: "-- %",
  },
];

import type { MainSectionViewModel } from "./weatherMain.types";

export const PLACEHOLDER_VIEW_MODEL: MainSectionViewModel = {
  title: "Clima actual",
  temperatureLabel: "--°C",
  description: "Cargando...",
  feelsLikeLabel: "Sensacion termica: --°C",
  metrics: [
    {
      id: "humidity",
      label: "Humedad",
      value: "--%",
    },
    {
      id: "precipitationProbability",
      label: "Probabilidad de precipitación",
      value: "-- %",
    },
    {
      id: "wind",
      label: "Viento",
      value: "-- km/h",
    },
    {
      id: "pressure",
      label: "Presion",
      value: "-- hPa",
    },
    {
      id: "visibility",
      label: "Visibilidad",
      value: "-- m",
    },
  ],
};

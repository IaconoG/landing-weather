import type { CurrentWeather } from "../../../../../types/weather.types";

type MainMetricViewModel = {
  id: "humidity" | "wind" | "pressure" | "visibility";
  label: string;
  value: string;
};

type MainSectionViewModel = {
  title: string;
  temperatureLabel: string;
  description: string;
  sensationLabel: string;
  metrics: MainMetricViewModel[];
};

export const buildMainSectionViewModel = (
  data: CurrentWeather,
): MainSectionViewModel => {
  return {
    title: "Clima actual",
    temperatureLabel: `${Math.round(data.temperature)}°C`,
    description: data.weatherDescription,
    sensationLabel: `Sensacion termica: ${Math.round(data.feelsLike)}°C`,
    metrics: [
      {
        id: "humidity",
        label: "Humedad",
        value: `${Math.round(data.humidity)}%`,
      },
      {
        id: "wind",
        label: "Viento",
        value: `${Math.round(data.windSpeed)} km/h`,
      },
      {
        id: "pressure",
        label: "Presion",
        value: `${Math.round(data.pressure)} hPa`,
      },
      {
        id: "visibility",
        label: "Visibilidad",
        value: `${Math.round(data.visibility)} m`,
      },
    ],
  };
};

export type { MainMetricViewModel, MainSectionViewModel };

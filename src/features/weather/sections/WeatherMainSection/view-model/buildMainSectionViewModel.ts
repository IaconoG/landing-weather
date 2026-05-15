import type { CurrentWeather } from "../../../../../types/weather.types";
import { PLACEHOLDER_VIEW_MODEL } from "./weatherMain.placeholder";
import type { MainSectionViewModel } from "./weatherMain.types";

const formatValue = (value: number | undefined, unit?: string): string => {
  if (value === undefined || Number.isNaN(value))
    return unit ? `-- ${unit}` : "--";
  return unit ? `${Math.round(value)} ${unit}` : `${Math.round(value)}`;
};

export const buildMainSectionViewModel = (
  data: CurrentWeather,
): MainSectionViewModel => {
  const {
    temperature,
    feelsLike,
    weatherDescription,
    humidity,
    wind,
    pressure,
    visibility,
    precipitationProbability,
  } = data;

  const temperatureLabel = formatValue(temperature.value, temperature.unit);
  const feelsLikeLabel = `Sensacion termica: ${formatValue(feelsLike.value, feelsLike.unit)}`;
  const description = weatherDescription;
  const humidityLabel = formatValue(humidity.value, humidity.unit);
  const windLabel = formatValue(wind.speed.value, wind.speed.unit);
  const pressureLabel = formatValue(pressure.value, pressure.unit);
  const visibilityLabel = formatValue(visibility.value, visibility.unit);
  const precipitationProbabilityLabel = formatValue(
    precipitationProbability.value,
    precipitationProbability.unit,
  );

  return {
    ...PLACEHOLDER_VIEW_MODEL,
    temperatureLabel,
    description,
    feelsLikeLabel,
    metrics: [
      {
        id: "humidity",
        label: "Humedad",
        value: humidityLabel,
      },
      {
        id: "wind",
        label: "Viento",
        value: windLabel,
      },
      {
        id: "pressure",
        label: "Presión",
        value: pressureLabel,
      },
      {
        id: "visibility",
        label: "Visibilidad",
        value: visibilityLabel,
      },
      {
        id: "precipitationProbability",
        label: "Probabilidad de Precipitación",
        value: precipitationProbabilityLabel,
      },
    ],
  };
};

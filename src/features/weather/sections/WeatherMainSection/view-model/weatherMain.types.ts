export type MetricId =
  | "humidity"
  | "wind"
  | "pressure"
  | "visibility"
  | "precipitationProbability";

export type MainMetricViewModel = {
  id: MetricId;
  label: string;
  value: string;
};

export type MainSectionViewModel = {
  title: string;
  temperatureLabel: string;
  description: string;
  feelsLikeLabel: string;
  metrics: MainMetricViewModel[];
};

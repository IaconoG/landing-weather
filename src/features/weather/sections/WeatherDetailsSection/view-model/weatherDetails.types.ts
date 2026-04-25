export type WeatherDetailsSeriesPoint = {
  timestamp: number;
  value: number;
};

export type WeatherDetailsRangeMetric = {
  current: number;
  min: number;
  max: number;
  points: WeatherDetailsSeriesPoint[];
};

export type WeatherDetailsWindMetric = {
  directionDegrees?: number;
  directionLabel: string;
  speed: number;
  gustSpeed?: number;
  points: WeatherDetailsSeriesPoint[];
};

export type WeatherDetailsHumidityMetric = {
  relativeHumidity: number;
  dewPoint?: number;
  points: WeatherDetailsSeriesPoint[];
};

export type WeatherDetailSeverity =
  | "low"
  | "moderate"
  | "high"
  | "very_high"
  | "extreme";

export type WeatherDetailsUvMetric = {
  value: number;
  severity: WeatherDetailSeverity;
  colorToken: string;
};

export type PressureTrend = "rising" | "falling" | "steady";

export type WeatherDetailsPressureMetric = WeatherDetailsRangeMetric & {
  trend: PressureTrend;
};

export type WeatherDetailsPrecipitationMetric = {
  probability: number;
  maxProbability: number;
  points: WeatherDetailsSeriesPoint[];
  hasData: boolean;
};

export type WeatherDetailsSunMetric = {
  sunriseTimestamp: number;
  sunsetTimestamp: number;
  daylightDurationSeconds: number;
  sunriseLabel: string;
  sunsetLabel: string;
  daylightLabel: string;
};

export type WeatherDetailsMoonMetric = {
  phaseLabel: string;
  illuminationPercentage: number;
  moonriseTimestamp?: number;
  moonsetTimestamp?: number;
  moonriseLabel?: string;
  moonsetLabel?: string;
  hasData: boolean;
};

/* List of all the data needed to render the details section for a given day */
export type WeatherDetailsDayViewModel = {
  dateTimestamp: number; // epoch ms
  isToday: boolean;
  sun: WeatherDetailsSunMetric;
  moon: WeatherDetailsMoonMetric;
  temperature: WeatherDetailsRangeMetric;
  feelsLike: WeatherDetailsRangeMetric;
  visibility: WeatherDetailsRangeMetric;
  humidity: WeatherDetailsHumidityMetric;
  wind: WeatherDetailsWindMetric;
  uv: WeatherDetailsUvMetric;
  precipitation: WeatherDetailsPrecipitationMetric;
  pressure: WeatherDetailsPressureMetric;
};

/* Wrapper for the details section */
export type WeatherDetailsViewModel = {
  day: WeatherDetailsDayViewModel;
};

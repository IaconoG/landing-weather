export type WeatherDetailsSeriesPoint = {
  timestamp: number;
  value: number;
};
// TODO: This is not implemented yet,
export type WeatherDetailsSparklinePalette = {
  stroke: string;
  fill: string;
  marker: string;
};
// TODO: This is not implemented yet,
export type WeatherDetailsSparklineViewModel = {
  points: WeatherDetailsSeriesPoint[];
  currentPointIndex: number;
  palette?: WeatherDetailsSparklinePalette;
  ariaLabel?: string;
};

export type WeatherDetailsRangeMetric = {
  currentValue: number;
  currentPointIndex: number;
  min: number;
  max: number;
  points: WeatherDetailsSeriesPoint[];
};

type WeatherDeatilWindDirectionRangeMetric = WeatherDetailsRangeMetric & {
  currentDirectionSymbol?: string; // "N", "NE", "E", "SE", "S", "SW", "W", "NW"
  directionSimbols?: string[]; // ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
};

export type WeatherDetailsWindMetric = {
  speed: WeatherDetailsRangeMetric;
  direction: WeatherDeatilWindDirectionRangeMetric;
  gustSpeed?: WeatherDetailsRangeMetric;
};

export type WeatherDetailsHumidityMetric = WeatherDetailsRangeMetric & {
  dewPoint?: WeatherDetailsRangeMetric;
};

export type WeatherDetailSeverity =
  | "low"
  | "moderate"
  | "high"
  | "very_high"
  | "extreme";

export type WeatherDetailsUvMetric = WeatherDetailsRangeMetric & {
  severitys?: WeatherDetailSeverity[];
  currentSeverity?: WeatherDetailSeverity;
  colorTokens?: string[];
  currentColorToken?: string;
};

export type PressureTrend = "rising" | "falling" | "steady";

export type WeatherDetailsPressureMetric = WeatherDetailsRangeMetric & {
  trend: PressureTrend;
};

export type WeatherDetailsSunMetric = {
  sunriseTimestamp: string;
  sunsetTimestamp: string;
  daylightDurationSeconds: string;
};

export type WeatherDetailsMoonMetric = {
  moonriseTimestamp: string;
  moonsetTimestamp: string;
  illuminationPercentage: number | undefined;
  phaseLabel: string;
};

/* List of all the data needed to render the details section for a given day */
export type WeatherDetailsDayViewModel = {
  dateTimestamp: number; // epoch ms
  isToday: boolean;
  sun: WeatherDetailsSunMetric;
  moon?: WeatherDetailsMoonMetric; // FIX: Moon data is not always available, so it's optional
  temperature: WeatherDetailsRangeMetric;
  feelsLike: WeatherDetailsRangeMetric;
  visibility: WeatherDetailsRangeMetric;
  humidity: WeatherDetailsHumidityMetric;
  wind: WeatherDetailsWindMetric;
  uv: WeatherDetailsUvMetric;
  precipitation: WeatherDetailsRangeMetric;
  pressure: WeatherDetailsPressureMetric;
};

/* */
export type WeatherDetailsCardViewModel = {
  id: string;
  label: string;
  description: string;
  value: string;
  moreInfo?: string;
  graph?: WeatherDetailsSparklineViewModel;
};

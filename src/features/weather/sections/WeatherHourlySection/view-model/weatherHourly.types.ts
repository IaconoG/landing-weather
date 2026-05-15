import type { RelativeDayLabel } from "../../../utils/date";

export type HourHourlySection = {
  id: string;
  timeLabel: string;
  temperatureLabel: string;
  feelsLikeLabel: string;
  temperatureOffset: number;
  feelsLikeOffset: number;
  precipitationLabel: string;
  hasPrecipitationData: boolean;
  hasData: boolean;
};

type DayHourlySection = {
  id: string;
  weekdayLabel: string;
  dateLabel: string;
  ariaDayLabel: string;
  relativeDayLabel: RelativeDayLabel;
  displayDayLabel: string;
  iconLabel: string;
  minTemperatureLabel: string;
  maxTemperatureLabel: string;
  precipitationSummary: string;
  hasData: boolean;
  hours: HourlyForecastItem[];
};

export type HourlySectionViewModel = {
  days: DayHourlySection[];
};

export const HOURLY_DISPLAY_LIMIT = 12;
export const HOURLY_GRID_DAYS = 7;

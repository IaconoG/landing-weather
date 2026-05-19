import type { WeatherDescription } from "../../../../../types/weather.types";
import type { RelativeDayLabel } from "../../../utils/date";

export type MonthlyDayViewModel = {
  id: string;
  dateLabel: string;
  dayLabel: string;
  relativeDayLabel?: RelativeDayLabel;
  maxTemperatureLabel: string;
  minTemperatureLabel: string;
  isToday: boolean;
  isOutsideCurrentMonth: boolean;
  hasData: boolean;
  description: WeatherDescription | undefined;
  iconUrl?: string;
};

export type MonthlySectionViewModel = {
  days: MonthlyDayViewModel[];
};

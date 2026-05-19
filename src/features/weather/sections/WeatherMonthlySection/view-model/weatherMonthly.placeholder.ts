import {
  type MonthlySectionViewModel,
  type MonthlyDayViewModel,
} from "./weatherMonthly.types";

/* Default values for a single day (used when no real data exists) */
export const DEFAULT_MONTHLY_DAY_VIEW_MODEL: MonthlyDayViewModel = {
  id: "",
  dateLabel: "--",
  dayLabel: "--",
  maxTemperatureLabel: "--",
  minTemperatureLabel: "--",
  isToday: false,
  isOutsideCurrentMonth: false,
  description: undefined,
  iconUrl: undefined,
  hasData: false,
};

/* Grid structure: 35 cell representing the calendar view */
/* Last 3 cells and first 2 cells are considered outside the current month */
const buildGridStructure = (): Array<{
  index: number;
  isOutsideCurrentMonth: boolean;
}> => {
  const MONTHLY_GRID_DAYS: number = 42; // 6 weeks * 7 days

  return Array.from({ length: MONTHLY_GRID_DAYS }, (_, index) => ({
    index,
    isOutsideCurrentMonth: index < 2 || index >= 32,
  }));
};

/* Build placeholder labels for a specific day index */
const buildDayLabelPlaceholder = (
  index: number,
): { id: string; dateLabel: string; dayLabel: string } => {
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return {
    id: `placeholder-${index}`,
    dateLabel: index < 30 ? `${index + 1}` : `${index + 1 - 30}`,
    dayLabel: dayNames[index % 7] || "",
  };
};

/* Build the complete placeholder view model */
export const PLACEHOLDER_MONTHLY_VIEW_MODEL: MonthlySectionViewModel = {
  days: buildGridStructure().map((grid) => ({
    ...DEFAULT_MONTHLY_DAY_VIEW_MODEL,
    ...buildDayLabelPlaceholder(grid.index),
    isOutsideCurrentMonth: grid.isOutsideCurrentMonth,
  })),
};

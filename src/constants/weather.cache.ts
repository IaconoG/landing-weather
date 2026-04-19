const EXPIRED_TIMES = {
  current: 60 * 60 * 1000, // 1 hour
  hourly: 60 * 60 * 1000, // 1 hour
  weekly: 3 * 60 * 60 * 1000, // 3 hours
  monthly: 6 * 60 * 60 * 1000, // 6 hours
};

export const CURRENT_WEATHER_TTL_MS = EXPIRED_TIMES.current;
export const HOURLY_FORECAST_TTL_MS = EXPIRED_TIMES.hourly;
export const WEEKLY_FORECAST_TTL_MS = EXPIRED_TIMES.weekly;
export const MONTHLY_FORECAST_TTL_MS = EXPIRED_TIMES.monthly;

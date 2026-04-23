import type {
  WeatherError,
  MonthlyForecastItem,
} from "../../../../types/weather.types";
import BaseSkeleton from "../../../../shared/components/BaseSkeleton";
import {
  WeatherMonthlySectionContent,
  WeatherMonthlySectionSkeleton,
} from "./components";
import "./WeatherMonthlySection.css";

type WeatherMonthlySectionProps = {
  data: MonthlyForecastItem[] | null;
  error: WeatherError | null;
  isLoading: boolean;
};

const MONTHLY_SECTION_TITLE = "Pronostico mensual";

const WeatherMonthlySection: React.FC<WeatherMonthlySectionProps> = ({
  data,
  error,
  isLoading,
}) => {
  let sectionStateClass = "";
  let contentStateClass = "";
  let bodyComponent: React.ReactNode;

  if (isLoading) {
    sectionStateClass = "weather-monthly-section--skeleton";
    contentStateClass = "weather-monthly-section__content--skeleton";
    bodyComponent = <WeatherMonthlySectionSkeleton />;
  } else if (error || !data || data.length === 0) {
    bodyComponent = <WeatherMonthlySectionContent data={[]} />;
  } else {
    bodyComponent = <WeatherMonthlySectionContent data={data} />;
  }

  return (
    <>
      <section
        className={`weather-monthly-section ${sectionStateClass}`.trim()}
      >
        {isLoading ? (
          <div className="weather-monthly-section__title">
            <BaseSkeleton
              className="weather-monthly-section__skeleton-title"
              variant="text"
              height={24}
              width={400}
            />
          </div>
        ) : (
          <p className="weather-monthly-section__title">
            {MONTHLY_SECTION_TITLE}
          </p>
        )}
        <div
          className={`weather-monthly-section__content ${contentStateClass}`.trim()}
        >
          {bodyComponent}
        </div>
      </section>
    </>
  );
};

export default WeatherMonthlySection;

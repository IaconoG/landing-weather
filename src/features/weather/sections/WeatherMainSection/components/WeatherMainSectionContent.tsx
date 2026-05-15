import type { MainSectionViewModel } from "../view-model/weatherMain.types";

type WeatherMainSectionContentProps = {
  data: MainSectionViewModel;
};

const WeatherMainSectionContent: React.FC<WeatherMainSectionContentProps> = ({
  data,
}) => {
  return (
    <section className={"weather-main-section"}>
      <p className="weather-main-section__title">{data.title}</p>
      <div className={"weather-main-section__container"}>
        <div className={"weather-main-section__content"}>
          <div className="weather-main-section__temperature">
            <span className="weather-main-section__temperature-value">
              {data.temperatureLabel}
            </span>
          </div>
          <div className="weather-main-section__description">
            <span className="weather-main-section__description-value">
              {data.description}
            </span>
            <span className="weather-main-section__sensation">
              {data.feelsLikeLabel}
            </span>
          </div>
          <div className="weather-main-section__metrics">
            {data.metrics.map((metric) => (
              <div className="weather-main-section__metric" key={metric.id}>
                <span className="weather-main-section__metric-label">
                  {metric.label}
                </span>
                <span className="weather-main-section__metric-value">
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherMainSectionContent;

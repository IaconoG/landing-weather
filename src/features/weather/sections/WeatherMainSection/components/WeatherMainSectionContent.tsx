import type { MainSectionViewModel } from "../view-model/buildMainSectionViewModel";

type WeatherMainSectionContentProps = {
  viewModel: MainSectionViewModel;
};

const WeatherMainSectionContent: React.FC<WeatherMainSectionContentProps> = ({
  viewModel,
}) => {
  return (
    <div className="weather-main-section">
      <p className="weather-main-section__title">{viewModel.title}</p>
      <div className="weather-main-section__temperature">
        <span className="weather-main-section__temperature-value">
          {viewModel.temperatureLabel}
        </span>
      </div>
      <div className="weather-main-section__description">
        <span className="weather-main-section__description-value">
          {viewModel.description}
        </span>
        <span className="weather-main-section__sensation">
          {viewModel.sensationLabel}
        </span>
      </div>
      <div className="weather-main-section__metrics">
        {viewModel.metrics.map((metric) => (
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
  );
};

export default WeatherMainSectionContent;

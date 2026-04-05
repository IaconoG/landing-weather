
type WeatherMainSectionErrorProps = {
  message: string;
}

const WeatherMainSectionError: React.FC<WeatherMainSectionErrorProps> = ({ message }) => {
  return <p className="weather-main-section-error">{message}</p>;
};

export default WeatherMainSectionError;

type WeatherSectionPlaceholderProps = {
  title: string;
  description?: string;
  variant: "current" | "metrics" | "hourly" | "weekly" | "chart" | "historical";
}

const WeatherSectionPlaceholder: React.FC<WeatherSectionPlaceholderProps> = ({ title, description, variant }) => {
  return (
    <section className={`weather-section-placeholder ${variant}`}>
      <h2 className="weather-section-placeholder-title">{title}</h2>
      <p className="weather-section-placeholder-text">{description || "Placeholder"}</p>
    </section>
  )

}

export default WeatherSectionPlaceholder;
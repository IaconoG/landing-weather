const ThemeButtonEmpty: React.FC = () => {
  return (
    <button
      type="button"
      className="location-controls-section__theme-empty"
      aria-label="Tema no disponible"
      disabled
    >
      Tema no disponible
    </button>
  );
};

export default ThemeButtonEmpty;
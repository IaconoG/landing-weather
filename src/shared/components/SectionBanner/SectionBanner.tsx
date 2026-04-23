import "./SectionBanner.css";

type SectionBannerProps = {
  type: "error" | "info" | "warning" | "success";
  message: string;
  actionLabel?: string;
  onActionClick?: () => void;
};

const SectionBanner: React.FC<SectionBannerProps> = ({
  type,
  message,
  actionLabel,
  onActionClick,
}) => {
  return (
    <div
      className={`section-banner section-banner--${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <p className="section-banner__text">{message}</p>

      {actionLabel && onActionClick ? (
        <button
          type="button"
          className={`section-banner__action section-banner__action--${type}`}
          onClick={onActionClick}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
};

export default SectionBanner;

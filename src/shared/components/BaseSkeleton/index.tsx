import "./BaseSkeleton.css";

export type BaseSkeletonVariant = "text" | "circle" | "block" | "card" | "title" | "subtitle";

type BaseSkeletonProps = {
  variant?: BaseSkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
};

const BaseSkeleton: React.FC<BaseSkeletonProps> = ({ 
  variant = "block",
  width,
  height,
  className = ""
}) => {
  return (
    <div
      className={`base-skeleton base-skeleton--${variant} ${className}`.trim()}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
  
};

export default BaseSkeleton;
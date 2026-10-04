const Card = ({
  children,
  title,
  subtitle,
  padding = "md",
  className = "",
}) => {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        w-full rounded-xl border border-[#DCE3E8] bg-white shadow-sm
        ${paddings[padding]}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title && (
            <h2 className="text-base font-semibold text-[#25364A] sm:text-lg">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-xs leading-5 text-[#68798A] sm:text-sm sm:leading-6">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;

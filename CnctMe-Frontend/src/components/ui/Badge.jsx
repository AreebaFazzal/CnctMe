const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-[#F8F9FA] text-[#68798A] border-[#DCE3E8]",

    primary: "bg-[#EEF6FB] text-[#0A66C2] border-[#B9D8F0]",

    success: "bg-green-50 text-green-600 border-green-200",

    warning: "bg-yellow-50 text-yellow-600 border-yellow-200",

    danger: "bg-red-50 text-red-600 border-red-200",

    info: "bg-cyan-50 text-cyan-600 border-cyan-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        font-medium
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;

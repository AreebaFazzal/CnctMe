const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  loadingColor = "currentColor",
  fullWidth = false,
  onClick,
  className = "",
}) => {
  const variants = {
    primary:
      "bg-[#0A66C2] text-white hover:bg-[#0859A8] focus:ring-[#0A66C2]/30",

    secondary:
      "bg-[#35698D] text-white hover:bg-[#244F70] focus:ring-[#35698D]/30",

    outline:
      "border border-[#0A66C2] text-[#0A66C2] hover:bg-[#EEF6FB] focus:ring-[#0A66C2]/30",

    light:
      "bg-[#EEF6FB] text-[#0A66C2] hover:bg-[#E2F0FA] focus:ring-[#0A66C2]/20",

    danger: "bg-[#CF0007] text-white hover:bg-red-700 focus:ring-red-500/30",

    ghost:
      "text-[#25364A] hover:bg-[#EEF6FB] hover:text-[#0A66C2] focus:ring-[#0A66C2]/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={loading ? { opacity: 1 } : undefined}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-lg
        font-medium
        transition-all
        duration-200
        focus:outline-none
        focus:ring-4
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2"
          style={{
            borderColor: loadingColor,
            borderTopColor: "transparent",
          }}
        />
      )}

      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;

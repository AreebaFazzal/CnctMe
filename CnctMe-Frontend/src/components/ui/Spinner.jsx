//Use when you're waiting for an action
const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
    xl: "h-10 w-10 border-4",
  };

  return (
    <span
      className={`
        inline-block
        animate-spin
        rounded-full
        border-[#DCE3E8]
        border-t-[#0A66C2]
        ${sizes[size]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;

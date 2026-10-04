//Use when you're loading content, it blur the content space
const Skeleton = ({
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
  className = "",
}) => {
  return (
    <div
      className={`
        ${width}
        ${height}
        ${rounded}
        animate-pulse
        bg-[#DCE3E8]
        ${className}
      `}
    />
  );
};

export default Skeleton;

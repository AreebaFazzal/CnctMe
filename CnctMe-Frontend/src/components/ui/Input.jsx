const Input = ({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  id,
  error = "",
  disabled = false,
  required = false,
  className = "",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="mb-2 block text-sm font-medium text-[#25364A]"
        >
          {label}
          {required && <span className="ml-1 text-[#CF0007]">*</span>}
        </label>
      )}

      <input
        id={id || name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-sm
          text-[#25364A]
          outline-none
          transition-all
          duration-200
          placeholder:text-[#8998A6]
          disabled:cursor-not-allowed
          disabled:bg-[#F8F9FA]
          disabled:opacity-60

          ${
            error
              ? "border-[#CF0007] focus:border-[#CF0007] focus:ring-4 focus:ring-[#CF0007]/10"
              : "border-[#DCE3E8] focus:border-[#0A66C2] focus:ring-4 focus:ring-[#0A66C2]/10"
          }

          ${className}
        `}
      />

      {error && <p className="mt-1.5 text-sm text-[#CF0007]">{error}</p>}
    </div>
  );
};

export default Input;

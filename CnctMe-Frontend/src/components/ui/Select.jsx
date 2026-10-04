import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const Select = ({
  label,
  options = [],
  value,
  onChange,
  name,
  id,
  placeholder = "Select an option",
  error = "",
  disabled = false,
  required = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    const dropdownMaxHeight = 240;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldOpenUp =
      spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;

    const availableHeight = shouldOpenUp
      ? Math.max(spaceAbove - 8, 100)
      : Math.max(spaceBelow - 8, 100);

    setPosition({
      left: rect.left,
      width: rect.width,
      top: shouldOpenUp ? undefined : rect.bottom + 4,
      bottom: shouldOpenUp ? viewportHeight - rect.top + 4 : undefined,
      maxHeight: Math.min(dropdownMaxHeight, availableHeight),
      openUp: shouldOpenUp,
    });
  };

  const handleToggle = () => {
    if (disabled) return;

    if (!isOpen) {
      updatePosition();
    }

    setIsOpen((prev) => !prev);
  };

  const handleSelect = (optionValue) => {
    onChange({
      target: {
        name,
        id: id || name,
        value: optionValue,
      },
    });

    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleResize = () => {
      updatePosition();
    };

    const handleScroll = () => {
      updatePosition();
    };

    window.addEventListener("resize", handleResize);

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const clickedButton = buttonRef.current?.contains(event.target);

      const dropdown = document.getElementById(
        `custom-select-dropdown-${id || name}`,
      );

      const clickedDropdown = dropdown?.contains(event.target);

      if (!clickedButton && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, id, name]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {label && (
        <label
          htmlFor={id || name}
          className="mb-2 block text-sm font-medium text-[#25364A]"
        >
          {label}

          {required && <span className="ml-1 text-[#CF0007]">*</span>}
        </label>
      )}

      {/* Select Button */}
      <button
        ref={buttonRef}
        type="button"
        id={id || name}
        name={name}
        disabled={disabled}
        onClick={handleToggle}
        className={`
          flex
          w-full
          items-center
          justify-between
          rounded-lg
          border
          bg-white
          px-4
          py-2.5
          text-left
          text-sm
          text-[#25364A]
          outline-none
          transition-all
          duration-200
          disabled:cursor-not-allowed
          disabled:bg-[#F8F9FA]
          disabled:opacity-60

          ${
            error
              ? "border-[#CF0007] focus:border-[#CF0007] focus:ring-4 focus:ring-red-500/10"
              : "border-[#DCE3E8] hover:border-[#B9C7D3] focus:border-[#0859A8] focus:ring-4 focus:ring-[#0859A8]/10"
          }

          ${className}
        `}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>

        <ChevronDown
          size={18}
          className={`
            ml-2
            shrink-0
            text-[#25364A]
            transition-transform
            duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown rendered outside parent */}
      {isOpen &&
        position &&
        createPortal(
          <div
            id={`custom-select-dropdown-${id || name}`}
            style={{
              position: "fixed",
              left: `${position.left}px`,
              width: `${position.width}px`,
              top: position.top !== undefined ? `${position.top}px` : "auto",
              bottom:
                position.bottom !== undefined ? `${position.bottom}px` : "auto",
              maxHeight: `${position.maxHeight}px`,
            }}
            className="
              z-999999
              overflow-y-auto
              rounded-lg
              border
              border-[#DCE3E8]
              bg-white
              py-1
              shadow-lg
            "
          >
            {/* Placeholder */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`
                block
                w-full
                px-4
                py-2.5
                text-left
                text-sm
                transition-colors

                ${
                  value === ""
                    ? "bg-[#E6EFF8] font-medium text-[#0859A8]"
                    : "text-[#25364A] hover:bg-[#F8FAFC]"
                }
              `}
            >
              {placeholder}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  block
                  w-full
                  px-4
                  py-2.5
                  text-left
                  text-sm
                  transition-colors

                  ${
                    value === option.value
                      ? "bg-[#E6EFF8] font-medium text-[#0859A8]"
                      : "text-[#25364A] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {error && <p className="mt-1.5 text-sm text-[#CF0007]">{error}</p>}
    </div>
  );
};

export default Select;

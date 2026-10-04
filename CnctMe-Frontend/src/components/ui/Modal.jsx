const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) {
    return null;
  }

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className={`w-full ${sizes[size]} rounded-xl bg-white shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#DCE3E8] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#25364A]">{title}</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-[#68798A] transition-colors hover:text-[#0A66C2]"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

// So: e.stopPropagation()
// means: Stop this click from reaching the parent if click is inside the modal.
// Now: Click inside modal
//  ↓Modal stays open
//&times; displays: ×

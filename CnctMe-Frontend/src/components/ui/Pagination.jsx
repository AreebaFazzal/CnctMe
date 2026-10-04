const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div
      className={`
        flex
        items-center
        justify-center
        gap-2
        ${className}
      `}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          rounded-lg
          border
          border-[#DCE3E8]
          bg-white
          px-3
          py-2
          text-sm
          text-[#25364A]
          transition-colors
          hover:bg-[#EEF6FB]
          hover:text-[#0A66C2]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`
            h-9
            min-w-9
            rounded-lg
            px-3
            text-sm
            font-medium
            transition-colors

            ${
              currentPage === page
                ? "bg-[#0A66C2] text-white"
                : "border border-[#DCE3E8] bg-white text-[#25364A] hover:bg-[#EEF6FB] hover:text-[#0A66C2]"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          rounded-lg
          border
          border-[#DCE3E8]
          bg-white
          px-3
          py-2
          text-sm
          text-[#25364A]
          transition-colors
          hover:bg-[#EEF6FB]
          hover:text-[#0A66C2]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

import { useDispatch, useSelector } from "react-redux";

import {
  fetchJobs,
  selectCurrentPage,
  selectTotalPages,
  setCurrentPage,
} from "../../features/jobs/jobsSlice";

const Pagination = () => {
  const dispatch = useDispatch();

  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    dispatch(setCurrentPage(page));

    dispatch(
      fetchJobs({
        currentPage: page,
      }),
    );
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {/* PREVIOUS */}

      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="rounded-lg border border-[#DCE3E8] bg-white px-4 py-2 text-sm font-medium text-[#25364A] transition hover:border-[#0A66C2] hover:text-[#0A66C2] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {/* PAGE NUMBERS */}

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            onClick={() => handlePageChange(page)}
            className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold transition ${
              currentPage === page
                ? "bg-[#0A66C2] text-white"
                : "border border-[#DCE3E8] bg-white text-[#25364A] hover:border-[#0A66C2] hover:text-[#0A66C2]"
            }`}
          >
            {page}
          </button>
        ),
      )}

      {/* NEXT */}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="rounded-lg border border-[#DCE3E8] bg-white px-4 py-2 text-sm font-medium text-[#25364A] transition hover:border-[#0A66C2] hover:text-[#0A66C2] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

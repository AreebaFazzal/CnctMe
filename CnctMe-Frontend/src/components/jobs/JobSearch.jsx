import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Input from "../ui/Input";
import Button from "../ui/Button";

import {
  fetchJobs,
  selectJobFilters,
  setSearch,
  setLocation,
  setCurrentPage,
} from "../../features/jobs/jobsSlice";

const JobSearch = () => {
  const dispatch = useDispatch();

  const filters = useSelector(selectJobFilters);

  const [searchParams] = useSearchParams();

  // READ SEARCH VALUES FROM URL
  useEffect(() => {
    const searchFromUrl = searchParams.get("search") || "";
    const locationFromUrl = searchParams.get("location") || "";

    if (searchFromUrl !== filters.search) {
      dispatch(setSearch(searchFromUrl));
    }

    if (locationFromUrl !== filters.location) {
      dispatch(setLocation(locationFromUrl));
    }

    dispatch(setCurrentPage(1));

    dispatch(
      fetchJobs({
        currentPage: 1,
        filters: {
          ...filters,
          search: searchFromUrl,
          location: locationFromUrl,
        },
      }),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // SEARCH INPUT
  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  // LOCATION INPUT
  const handleLocationChange = (e) => {
    dispatch(setLocation(e.target.value));
  };

  // SEARCH BUTTON
  const handleSearchJobs = () => {
    const trimmedSearch = filters.search.trim();
    const trimmedLocation = filters.location.trim();

    dispatch(setCurrentPage(1));

    dispatch(
      fetchJobs({
        currentPage: 1,
        filters: {
          ...filters,
          search: trimmedSearch,
          location: trimmedLocation,
        },
      }),
    );
  };

  // ENTER KEY
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchJobs();
    }
  };

  return (
    <section className="relative z-0 border-b border-[#DCE3E8] bg-[#F3F2F0]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#0859A8]" />

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[#16212B]">
              Find your next opportunity
            </h1>

            <p className="mt-0.5 text-sm text-[#697586]">
              Search jobs by title, skills, keywords, or location
            </p>
          </div>
        </div>

        {/* =================================================
            SEARCH AREA
        ================================================= */}

        <div className="flex flex-col gap-3 md:flex-row">
          {/* =================================================
              JOB SEARCH
          ================================================= */}

          <div className="group relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <svg
                className="h-5 w-5 text-[#8998A6] transition-colors group-focus-within:text-[#0A66C2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>
            </div>

            <Input
              value={filters.search}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              placeholder="Search jobs, skills, or keywords..."
              className="pl-11"
            />
          </div>

          {/* =================================================
              LOCATION
          ================================================= */}

          <div className="group relative md:w-64">
            <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
              <svg
                className="h-5 w-5 text-[#8998A6] transition-colors group-focus-within:text-[#0A66C2]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                />

                <circle cx="12" cy="9" r="2.5" strokeWidth={2} />
              </svg>
            </div>

            <Input
              value={filters.location}
              onChange={handleLocationChange}
              onKeyDown={handleKeyDown}
              placeholder="Location"
              className="pl-11"
            />
          </div>

          {/* =================================================
              SEARCH BUTTON
          ================================================= */}

          <Button type="button" onClick={handleSearchJobs}>
            <span className="inline-flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>
              Search Jobs
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobSearch;

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchJobs,
  selectJobLoading,
  selectJobError,
} from "../features/jobs/jobsSlice";

import MainNavbar from "../components/layout/MainNavbar";

import JobSearch from "../components/jobs/JobSearch";
import JobFilters from "../components/jobs/JobFilters";
import JobList from "../components/jobs/JobList";
import Pagination from "../components/jobs/Pagination";

import MainFooter from "../components/layout/MainFooter";

const Jobs = () => {
  const dispatch = useDispatch();

  const loading = useSelector(selectJobLoading);
  const error = useSelector(selectJobError);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <MainNavbar />

      <main className="flex-1 pt-16">
        <JobSearch />

        <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr] lg:gap-8">
            {/* =========================
                MOBILE FILTERS
            ========================= */}

            <div className="block lg:hidden">
              <div className="rounded-xl border border-[#DCE3E8] bg-white shadow-sm">
                <JobFilters />
              </div>
            </div>

            {/* =========================
                DESKTOP FILTER SIDEBAR
            ========================= */}

            <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
              <JobFilters />
            </aside>

            <div className="min-w-0">
              {loading ? (
                /* =========================
                   LOADING SKELETON
                ========================= */

                <div
                  className="space-y-4"
                  aria-label="Loading jobs"
                  aria-busy="true"
                >
                  {/* Result Header Skeleton */}
                  <div className="rounded-xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-5">
                    <div className="h-4 w-32 animate-pulse rounded bg-[#E6EFF8]" />

                    <div className="mt-2 h-3 w-48 animate-pulse rounded bg-[#EEF2F6]" />
                  </div>

                  {/* Job Card Skeletons */}
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex min-w-0 gap-4">
                        {/* Company Logo */}
                        <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-[#E6EFF8] sm:h-14 sm:w-14" />

                        <div className="min-w-0 flex-1">
                          {/* Job Title */}
                          <div className="h-5 w-3/4 animate-pulse rounded bg-[#E6EFF8] sm:w-2/3" />

                          {/* Company */}
                          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-[#EEF2F6]" />

                          {/* Location / Job Type */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="h-3 w-24 animate-pulse rounded bg-[#EEF2F6]" />
                            <div className="h-3 w-20 animate-pulse rounded bg-[#EEF2F6]" />
                            <div className="h-3 w-24 animate-pulse rounded bg-[#EEF2F6]" />
                          </div>
                        </div>

                        {/* Save Button */}
                        <div className="hidden h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#EEF2F6] sm:block" />
                      </div>

                      {/* Job Details */}
                      <div className="mt-5 space-y-2">
                        <div className="h-3 w-full animate-pulse rounded bg-[#EEF2F6]" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-[#EEF2F6]" />
                      </div>

                      {/* Tags */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="h-7 w-16 animate-pulse rounded-md bg-[#E6EFF8]" />
                        <div className="h-7 w-20 animate-pulse rounded-md bg-[#E6EFF8]" />
                        <div className="h-7 w-24 animate-pulse rounded-md bg-[#E6EFF8]" />
                      </div>

                      {/* Bottom Row */}
                      <div className="mt-5 flex items-center justify-between border-t border-[#EEF2F6] pt-4">
                        <div className="h-3 w-24 animate-pulse rounded bg-[#EEF2F6]" />

                        <div className="h-8 w-20 animate-pulse rounded-lg bg-[#E6EFF8]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                /* =========================
                   ERROR
                ========================= */

                <div className="flex min-h-100 items-center justify-center px-2">
                  <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50 px-5 py-5 text-center sm:px-6">
                    <p className="text-sm font-medium text-red-600 sm:text-base">
                      {error.general || "Unable to load jobs."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <JobList />
                  <Pagination />
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <MainFooter />
    </div>
  );
};

export default Jobs;

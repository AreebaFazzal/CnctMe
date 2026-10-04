import CompanyCard from "../companies/CompaniesCard";
import { Building2 } from "lucide-react";

const CompaniesList = ({ companies = [], loading = false, error = null }) => {
  // Loading
  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Top Accent */}

            <div className="h-1.5 animate-pulse bg-slate-200" />

            <div className="p-4 sm:p-5">
              {/* Header */}

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-slate-200 sm:h-18 sm:w-18" />

                <div className="min-w-0 flex-1 pt-1">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="mt-2 h-5 w-24 max-w-full animate-pulse rounded-full bg-slate-100" />
                </div>
              </div>

              {/* Description */}

              <div className="mt-5 space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />

                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />

                <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
              </div>

              {/* Company Info */}

              <div className="mt-5 rounded-xl bg-slate-50 px-3.5 py-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  {/* Location */}

                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 animate-pulse rounded-lg bg-slate-200" />

                    <div className="min-w-0 flex-1">
                      <div className="h-2.5 w-16 animate-pulse rounded bg-slate-200" />

                      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>

                  {/* Size */}

                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 animate-pulse rounded-lg bg-slate-200" />

                    <div className="min-w-0">
                      <div className="h-2.5 w-10 animate-pulse rounded bg-slate-200" />

                      <div className="mt-2 h-3 w-16 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Website */}

              <div className="mt-3 h-3 w-32 max-w-full animate-pulse rounded bg-slate-100" />

              {/* Divider */}

              <div className="mt-4 border-t border-slate-100" />

              {/* Button */}

              <div className="mt-4 h-10 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex min-h-95 items-center justify-center px-2">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-5 text-center shadow-sm sm:p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v4m0 4h.01M10.3 3.8 2.9 17a2 2 0 0 0 1.75 3L13.7 3.8a2 2 0 0 0-3.4 0Z"
              />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load companies
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error.general ||
              error.message ||
              "Something went wrong while loading companies. Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Empty
  if (companies.length === 0) {
    return (
      <div className="flex min-h-95 items-center justify-center px-2">
        <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6EFF8] text-[#0A66C2]">
            <Building2 size={28} strokeWidth={1.8} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No companies found
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            We couldn't find any companies matching your search. Try another
            company name, industry, or location.
          </p>
        </div>
      </div>
    );
  }

  // Companies
  return (
    <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard key={company._id} company={company} />
      ))}
    </div>
  );
};

export default CompaniesList;

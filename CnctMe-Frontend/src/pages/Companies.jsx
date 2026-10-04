import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Building2 } from "lucide-react";

import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

import CompaniesSearch from "../components/companies/CompaniesSearch";
import CompaniesList from "../components/companies/CompaniesList";
import Pagination from "../components/companies/Pagination";

import {
  fetchCompanies,
  selectCompanies,
  selectCompanyLoading,
  selectCompanyError,
  selectTotalCompanies,
} from "../features/companies/companiesSlice";

const Companies = () => {
  const dispatch = useDispatch();

  const companies = useSelector(selectCompanies);
  const loading = useSelector(selectCompanyLoading);
  const error = useSelector(selectCompanyError);
  const totalCompanies = useSelector(selectTotalCompanies);

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // Fetch Companies
  useEffect(() => {
    dispatch(
      fetchCompanies({
        page: 1,
        search: appliedSearch,
      }),
    );
  }, [dispatch, appliedSearch]);

  // Search
  const handleSearch = () => {
    setAppliedSearch(search.trim());
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MainNavbar />

      <main className="pt-16">
        {/* =========================
            HERO / SEARCH SECTION
        ========================== */}

        <section className="relative overflow-hidden border-b border-[#DCE3E8] bg-[#F3F2F0]">
          {/* Decorative background */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#0A66C2]/5 blur-3xl sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-56 w-56 rounded-full bg-[#38BDF8]/5 blur-3xl sm:h-72 sm:w-72" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            {/* Heading */}

            <div className="mb-6 flex items-start gap-3 sm:mb-7 sm:gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0A66C2] shadow-sm sm:h-11 sm:w-11">
                <Building2 size={21} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="h-7 w-1 shrink-0 rounded-full bg-[#0A66C2] sm:h-8" />

                  <h1 className="text-xl font-bold tracking-tight text-[#16212B] sm:text-2xl">
                    Companies
                  </h1>
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#697586]">
                  Explore companies, discover their culture, and find
                  opportunities that match your career goals.
                </p>
              </div>
            </div>

            {/* Search */}

            <CompaniesSearch
              search={search}
              setSearch={setSearch}
              onSearch={handleSearch}
            />
          </div>
        </section>

        {/* =========================
            COMPANIES SECTION
        ========================== */}

        <section className="bg-[#F8FAFC] py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* =========================
                LOADING STATE
            ========================== */}

            {loading ? (
              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="Loading companies"
                aria-busy="true"
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#DCE3E8] bg-white p-5 shadow-sm sm:p-6"
                  >
                    {/* Company Header */}

                    <div className="flex items-start gap-4">
                      {/* Logo */}

                      <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EFF8] sm:h-16 sm:w-16" />

                      {/* Company Name / Industry */}

                      <div className="min-w-0 flex-1">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-[#E6EFF8]" />

                        <div className="mt-2 h-3.5 w-1/2 animate-pulse rounded bg-[#EEF2F6]" />

                        <div className="mt-2 h-3.5 w-2/3 animate-pulse rounded bg-[#EEF2F6]" />
                      </div>
                    </div>

                    {/* Description */}

                    <div className="mt-5 space-y-2">
                      <div className="h-3.5 w-full animate-pulse rounded bg-[#EEF2F6]" />

                      <div className="h-3.5 w-11/12 animate-pulse rounded bg-[#EEF2F6]" />

                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#EEF2F6]" />
                    </div>

                    {/* Company Details */}

                    <div className="mt-5 space-y-3 border-t border-[#EEF2F6] pt-4">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-[#E6EFF8]" />

                        <div className="h-3.5 w-32 animate-pulse rounded bg-[#EEF2F6]" />
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-[#E6EFF8]" />

                        <div className="h-3.5 w-40 animate-pulse rounded bg-[#EEF2F6]" />
                      </div>
                    </div>

                    {/* Button */}

                    <div className="mt-5 h-10 w-full animate-pulse rounded-lg bg-[#E6EFF8]" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* =========================
                    Results Header
                ========================== */}

                {!error && companies.length > 0 && (
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-[#16212B]">
                        Explore Companies
                      </h2>

                      <p className="mt-1 text-sm leading-5 text-[#697586]">
                        {appliedSearch
                          ? `Showing results for "${appliedSearch}"`
                          : "Discover companies and explore new opportunities."}
                      </p>
                    </div>

                    <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#DCE3E8] bg-white px-4 py-2 text-sm font-medium text-[#526273] shadow-sm">
                      <Building2
                        size={15}
                        className="shrink-0 text-[#0A66C2]"
                      />

                      <span className="truncate">
                        {totalCompanies}{" "}
                        {totalCompanies === 1 ? "Company" : "Companies"}
                      </span>
                    </div>
                  </div>
                )}

                {/* =========================
                    Companies
                ========================== */}

                <CompaniesList
                  companies={companies}
                  loading={loading}
                  error={error}
                />

                {/* =========================
                    Pagination
                ========================== */}

                {!error && <Pagination search={appliedSearch} />}
              </>
            )}
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default Companies;

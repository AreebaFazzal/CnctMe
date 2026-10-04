import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  Building2,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  fetchAdminCompanies,
  deleteAdminCompany,
  selectAdminCompanies,
  selectAdminCompaniesPagination,
} from "../../features/admin/adminSlice";

import getLogoSrc from "../../utils/logo";

const AdminCompanies = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // REDUX
  const companies = useSelector(selectAdminCompanies);
  const pagination = useSelector(selectAdminCompaniesPagination);

  const { companiesLoading, companyActionLoading, companiesError } =
    useSelector((state) => state.admin);

  //  LOCAL STATE

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // LOAD COMPANIES
  const loadCompanies = useCallback(
    (targetPage) => {
      dispatch(
        fetchAdminCompanies({
          search,
          page: targetPage,
          limit: 10,
          sort: "createdAt",
          order: "desc",
        }),
      );
    },
    [dispatch, search],
  );

  useEffect(() => {
    loadCompanies(page);
  }, [loadCompanies, page]);

  // SEARCH
  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  // RESET SEARCH
  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  //VIEW COMPANY
  const handleView = (companyId) => {
    navigate(`/companies/${companyId}`);
  };

  // DELETE COMPANY
  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }

    const result = await dispatch(deleteAdminCompany(deleteId));

    if (!result.error) {
      setDeleteId(null);

      if (companies.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        loadCompanies(page);
      }
    }
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* =====================================================
            HEADER
            ===================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#0859A8]" />

              <h1 className="text-2xl font-bold text-[#25364A]">Companies</h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Review and manage companies registered on CnctMe.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadCompanies(page)}
            disabled={companiesLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#25364A] shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* =====================================================
            SEARCH
            ===================================================== */}

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search companies..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-[#25364A] outline-none transition placeholder:text-slate-400 focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-[#0859A8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064b91]"
            >
              Search
            </button>
          </form>

          {search && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 text-sm font-medium text-[#0859A8] hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* =====================================================
            ERROR
            ===================================================== */}

        {companiesError?.general && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {companiesError.general}
          </div>
        )}

        {/* =====================================================
            TABLE
            ===================================================== */}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-212.5 w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Website
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {/* =================================================
                    SKELETON LOADING
                    ================================================= */}

                {companiesLoading ? (
                  <>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <tr key={index}>
                        {/* COMPANY */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />

                            <div className="min-w-0 space-y-2">
                              <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                              <div className="h-3 w-44 animate-pulse rounded bg-slate-100" />
                            </div>
                          </div>
                        </td>

                        {/* LOCATION */}

                        <td className="px-5 py-4">
                          <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                        </td>

                        {/* WEBSITE */}

                        <td className="px-5 py-4">
                          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                        </td>

                        {/* CREATED */}

                        <td className="px-5 py-4">
                          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />

                            <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-200" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : companies.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => {
                    const companyLogo = getLogoSrc(company.logo);

                    return (
                      <tr
                        key={company._id}
                        className="transition hover:bg-slate-50/70"
                      >
                        {/* =================================================
                            COMPANY
                            ================================================= */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {/* CIRCULAR COMPANY LOGO */}

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-[#E6EFF8] text-[#0859A8]">
                              {companyLogo ? (
                                <img
                                  src={companyLogo}
                                  alt={`${
                                    company.companyName || "Company"
                                  } logo`}
                                  className="h-full w-full rounded-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <Building2 className="h-5 w-5" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-[#25364A]">
                                {company.companyName || "Unnamed Company"}
                              </p>

                              {company.description && (
                                <p className="max-w-xs truncate text-xs text-slate-500">
                                  {company.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* =================================================
                            LOCATION
                            ================================================= */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {company.location || "Not provided"}
                        </td>

                        {/* =================================================
                            WEBSITE
                            ================================================= */}

                        <td className="px-5 py-4 text-sm">
                          {company.website ? (
                            <a
                              href={
                                /^https?:\/\//i.test(company.website)
                                  ? company.website
                                  : `https://${company.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              onClick={(event) => event.stopPropagation()}
                              className="text-[#0859A8] hover:underline"
                            >
                              Visit website
                            </a>
                          ) : (
                            <span className="text-slate-400">Not provided</span>
                          )}
                        </td>

                        {/* =================================================
                            CREATED
                            ================================================= */}

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {company.createdAt
                            ? new Date(company.createdAt).toLocaleDateString()
                            : "—"}
                        </td>

                        {/* =================================================
                            ACTIONS
                            ================================================= */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* VIEW */}

                            <button
                              type="button"
                              onClick={() => handleView(company._id)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-[#0859A8]/30 hover:bg-[#E6EFF8] hover:text-[#0859A8]"
                              title="View company"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() => setDeleteId(company._id)}
                              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                              title="Delete company"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* =====================================================
              PAGINATION
              ===================================================== */}

          {pagination.totalPages > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>

              <div className="flex items-center gap-2">
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={pagination.currentPage <= 1 || companiesLoading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* CURRENT PAGE */}

                <span className="rounded-lg bg-[#E6EFF8] px-3 py-2 text-sm font-semibold text-[#0859A8]">
                  {pagination.currentPage}
                </span>

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    pagination.currentPage >= pagination.totalPages ||
                    companiesLoading
                  }
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 p-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  title="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          DELETE MODAL
          ========================================================= */}

      {deleteId && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-[#25364A]/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <Trash2 className="mb-4 h-8 w-8 text-red-600" />

            <h3 className="text-lg font-bold text-[#25364A]">
              Delete Company?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This action will permanently delete the company record.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              {/* CANCEL */}

              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={companyActionLoading}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={handleDelete}
                disabled={companyActionLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {companyActionLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanies;

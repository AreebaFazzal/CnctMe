import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";

import {
  clearSelectedReport,
  fetchAdminReportById,
  fetchAdminReports,
  selectAdminReportDetailsLoading,
  selectAdminReportUpdateLoading,
  selectAdminReports,
  selectAdminReportsError,
  selectAdminPagination,
  selectSelectedAdminReport,
  updateAdminReportStatus,
} from "../../features/admin/adminSlice";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";

const AdminReports = () => {
  const dispatch = useDispatch();

  const reports = useSelector(selectAdminReports);
  const pagination = useSelector(selectAdminPagination);
  const selectedReport = useSelector(selectSelectedAdminReport);

  const reportsLoading = useSelector((state) => state.admin.reportsLoading);

  const detailsLoading = useSelector(selectAdminReportDetailsLoading);

  const updateLoading = useSelector(selectAdminReportUpdateLoading);

  const reportsError = useSelector(selectAdminReportsError);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [selectedReportId, setSelectedReportId] = useState(null);

  // FETCH REPORTS
  useEffect(() => {
    dispatch(
      fetchAdminReports({
        status,
        search,
        page: 1,
        limit: 10,
        sort,
        order,
      }),
    );
  }, [dispatch, status, search, sort, order]);

  // SEARCH
  const handleSearchSubmit = (event) => {
    event.preventDefault();

    setSearch(searchInput.trim());
  };

  // STATUS FILTER
  const handleStatusChange = (value) => {
    setStatus(value);
  };

  // REFRESH
  const handleRefresh = () => {
    dispatch(
      fetchAdminReports({
        status,
        search,
        page: pagination.currentPage || 1,
        limit: 10,
        sort,
        order,
      }),
    );
  };

  // PAGINATION
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages || reportsLoading) {
      return;
    }

    dispatch(
      fetchAdminReports({
        status,
        search,
        page,
        limit: 10,
        sort,
        order,
      }),
    );
  };

  // OPEN REPORT
  const handleOpenReport = (reportId) => {
    setSelectedReportId(reportId);

    dispatch(fetchAdminReportById(reportId));
  };

  // CLOSE REPORT
  const handleCloseReport = () => {
    setSelectedReportId(null);

    dispatch(clearSelectedReport());
  };

  // SORT
  const handleSort = (field) => {
    if (sort === field) {
      setOrder((previous) => (previous === "asc" ? "desc" : "asc"));
    } else {
      setSort(field);
      setOrder("desc");
    }
  };

  // UPDATE REPORT STATUS
  const handleStatusUpdate = async (newStatus) => {
    if (!selectedReport?._id || updateLoading) {
      return;
    }

    await dispatch(
      updateAdminReportStatus({
        reportId: selectedReport._id,
        status: newStatus,
      }),
    );

    dispatch(
      fetchAdminReports({
        status,
        search,
        page: pagination.currentPage || 1,
        limit: 10,
        sort,
        order,
      }),
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-1 text-sm font-medium text-[#0859A8]">
              Administration
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
              Reports
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Review and manage reports submitted on CnctMe.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={reportsLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E6EFF8] bg-white px-4 py-2.5 text-sm font-semibold text-[#25364A] shadow-sm transition hover:bg-[#F3F6FA] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={reportsLoading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* ======================================================
            FILTERS
        ====================================================== */}

        <div className="mb-5 rounded-2xl border border-[#E6EFF8] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* SEARCH */}

            <form onSubmit={handleSearchSubmit} className="flex min-w-0 flex-1">
              <div className="relative w-full">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search reports..."
                  className="h-11 w-full rounded-xl border border-[#DCE6F0] bg-white pl-10 pr-24 text-sm text-[#25364A] outline-none transition placeholder:text-gray-400 focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
                />

                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-[#0859A8] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#064A8F]"
                >
                  Search
                </button>
              </div>
            </form>

            {/* STATUS */}

            <select
              value={status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="h-11 rounded-xl border border-[#DCE6F0] bg-white px-3 text-sm font-medium text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* ACTIVE FILTERS */}

          {(search || status) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {search && (
                <span className="rounded-full bg-[#E6EFF8] px-3 py-1 text-xs font-medium text-[#0859A8]">
                  Search: {search}
                </span>
              )}

              {status && (
                <span className="rounded-full bg-[#E6EFF8] px-3 py-1 text-xs font-medium capitalize text-[#0859A8]">
                  Status: {status}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setStatus("");
                }}
                className="text-xs font-medium text-gray-500 transition hover:text-[#0859A8]"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {reportsError && (
          <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              {reportsError.general || "Unable to load reports."}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#E6EFF8] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E6EFF8] px-5 py-4">
            <div>
              <h2 className="font-bold text-[#25364A]">All Reports</h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {pagination.totalReports || 0} total report
                {(pagination.totalReports || 0) === 1 ? "" : "s"}
              </p>
            </div>

            {reportsLoading && (
              <Loader2 size={19} className="animate-spin text-[#0859A8]" />
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-190">
              <thead>
                <tr className="border-b border-[#E6EFF8] bg-[#F8FAFC] text-left">
                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Report
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Reporter
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Reported Item
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="inline-flex items-center gap-1 transition hover:text-[#0859A8]"
                    >
                      Created
                      <SortIcon active={sort === "createdAt"} order={order} />
                    </button>
                  </th>

                  <th className="px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-bold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {reportsLoading && reports.length === 0 ? (
                  <TableSkeleton />
                ) : reports.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-5 py-16 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E6EFF8] text-[#0859A8]">
                        <FileText size={22} />
                      </div>

                      <h3 className="mt-4 font-semibold text-[#25364A]">
                        No reports found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  reports.map((report) => (
                    <ReportRow
                      key={report._id}
                      report={report}
                      onView={() => handleOpenReport(report._id)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ======================================================
              PAGINATION
          ====================================================== */}

          {pagination.totalPages > 0 && (
            <div className="flex flex-col gap-3 border-t border-[#E6EFF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-[#25364A]">
                  {pagination.currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#25364A]">
                  {pagination.totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {/* PREVIOUS */}

                <button
                  type="button"
                  disabled={pagination.currentPage <= 1 || reportsLoading}
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE6F0] text-[#25364A] transition hover:bg-[#F3F6FA] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                </button>

                {/* PAGE NUMBERS */}

                <div className="flex items-center gap-1">
                  {getPageNumbers(
                    pagination.currentPage,
                    pagination.totalPages,
                  ).map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="px-1 text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        disabled={reportsLoading}
                        className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                          page === pagination.currentPage
                            ? "bg-[#0859A8] text-white"
                            : "text-[#25364A] hover:bg-[#E6EFF8] hover:text-[#0859A8]"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  disabled={
                    pagination.currentPage >= pagination.totalPages ||
                    reportsLoading
                  }
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE6F0] text-[#25364A] transition hover:bg-[#F3F6FA] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================
          REPORT MODAL
      ====================================================== */}

      {selectedReportId && (
        <ReportDetailsModal
          report={selectedReport}
          loading={detailsLoading}
          updateLoading={updateLoading}
          onClose={handleCloseReport}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

// ======================================================
// REPORT ROW
// ======================================================

const ReportRow = ({ report, onView }) => {
  const reporter = report.reporter;

  let reportedItem = "General report";

  if (report.job) {
    reportedItem = report.job.title || "Job";
  } else if (report.company) {
    reportedItem = report.company.companyName || "Company";
  } else if (report.reportedUser) {
    reportedItem =
      `${report.reportedUser.firstName || ""} ${
        report.reportedUser.lastName || ""
      }`.trim() || "User";
  }

  const createdDate = report.createdAt
    ? new Date(report.createdAt).toLocaleDateString()
    : "—";

  return (
    <tr className="border-b border-[#E6EFF8] last:border-b-0 hover:bg-[#FAFCFE]">
      <td className="px-5 py-4">
        <div className="max-w-65">
          <p className="truncate text-sm font-semibold text-[#25364A]">
            {report.reason}
          </p>

          <p className="mt-1 truncate text-xs text-gray-500">
            {report.description}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <UserAvatar user={reporter} size="sm" />

          <div>
            <p className="max-w-35 truncate text-sm font-medium text-[#25364A]">
              {`${reporter?.firstName || ""} ${
                reporter?.lastName || ""
              }`.trim() || "Unknown"}
            </p>

            <p className="max-w-35 truncate text-xs text-gray-500">
              {reporter?.email || ""}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="max-w-40 truncate text-sm text-[#25364A]">
          {reportedItem}
        </p>

        <p className="mt-1 text-xs capitalize text-gray-500">
          {report.job
            ? "Job"
            : report.company
              ? "Company"
              : report.reportedUser
                ? "User"
                : "General"}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarDays size={15} />

          {createdDate}
        </div>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={report.status} />
      </td>

      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-2 rounded-lg border border-[#DCE6F0] px-3 py-2 text-xs font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#E6EFF8] hover:text-[#0859A8]"
        >
          <Eye size={15} />
          View
        </button>
      </td>
    </tr>
  );
};

// USER AVATAR
const UserAvatar = ({ user, size = "sm" }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const userId = user?._id;

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;

    const loadProfilePicture = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await api.get(`/users/${userId}/profile-picture`, {
          responseType: "blob",
        });

        if (cancelled) {
          return;
        }

        if (response.data && response.data.size > 0) {
          objectUrl = URL.createObjectURL(response.data);
          setImageUrl(objectUrl);
          setImageFailed(false);
        }
      } catch (error) {
        if (!cancelled) {
          setImageUrl("");
          setImageFailed(true);
          getApiError(error);
        }
      }
    };

    loadProfilePicture();

    return () => {
      cancelled = true;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [userId]);

  const sizeClasses = size === "lg" ? "h-11 w-11" : "h-8 w-8";

  const iconSize = size === "lg" ? 20 : 15;

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
        className={`${sizeClasses} shrink-0 rounded-full object-cover`}
        onError={() => {
          setImageUrl("");
          setImageFailed(true);
        }}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClasses} shrink-0 items-center justify-center rounded-full bg-[#E6EFF8] text-[#0859A8]`}
    >
      <User size={iconSize} />
    </div>
  );
};

// REPORT MODAL
const ReportDetailsModal = ({
  report,
  loading,
  updateLoading,
  onClose,
  onStatusUpdate,
}) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#E6EFF8] px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0859A8]">
              Report Details
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#25364A]">
              Review Report
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-[#F3F6FA] hover:text-[#25364A]"
          >
            <X size={19} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="max-h-[calc(90vh-150px)] overflow-y-auto p-5">
          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <Loader2 size={28} className="animate-spin text-[#0859A8]" />
            </div>
          ) : !report ? (
            <div className="py-12 text-center text-sm text-gray-500">
              Unable to load report details.
            </div>
          ) : (
            <div className="space-y-5">
              {/* REASON */}

              <div className="rounded-xl border border-[#E6EFF8] bg-[#F8FAFC] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                    <AlertTriangle size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Reason
                    </p>

                    <p className="mt-1 text-base font-semibold text-[#25364A]">
                      {report.reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div>
                <p className="mb-2 text-sm font-semibold text-[#25364A]">
                  Description
                </p>

                <div className="rounded-xl border border-[#E6EFF8] bg-white p-4">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* REPORTER */}

              <div>
                <p className="mb-2 text-sm font-semibold text-[#25364A]">
                  Reporter
                </p>

                <PersonCard user={report.reporter} />
              </div>

              {/* REPORTED USER */}

              {report.reportedUser && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#25364A]">
                    Reported User
                  </p>

                  <PersonCard user={report.reportedUser} />
                </div>
              )}

              {/* JOB */}

              {report.job && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#25364A]">
                    Reported Job
                  </p>

                  <div className="rounded-xl border border-[#E6EFF8] p-4">
                    <p className="font-semibold text-[#25364A]">
                      {report.job.title || "Untitled job"}
                    </p>

                    {report.job.location && (
                      <p className="mt-1 text-sm text-gray-500">
                        {report.job.location}
                      </p>
                    )}

                    {report.job.description && (
                      <p className="mt-3 line-clamp-4 text-sm leading-6 text-gray-600">
                        {report.job.description}
                      </p>
                    )}

                    <div className="mt-3">
                      <StatusBadge status={report.job.status} />
                    </div>
                  </div>
                </div>
              )}

              {/* COMPANY */}

              {report.company && (
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#25364A]">
                    Reported Company
                  </p>

                  <div className="rounded-xl border border-[#E6EFF8] p-4">
                    <p className="font-semibold text-[#25364A]">
                      {report.company.companyName || "Unnamed company"}
                    </p>

                    {report.company.location && (
                      <p className="mt-1 text-sm text-gray-500">
                        {report.company.location}
                      </p>
                    )}

                    {report.company.website && (
                      <p className="mt-2 text-sm text-[#0859A8]">
                        {report.company.website}
                      </p>
                    )}

                    {report.company.description && (
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {report.company.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* CREATED */}

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CalendarDays size={14} />
                Created{" "}
                {report.createdAt
                  ? new Date(report.createdAt).toLocaleString()
                  : "—"}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}

        {report && !loading && (
          <div className="flex flex-col gap-3 border-t border-[#E6EFF8] bg-[#F8FAFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                Current status:
              </span>

              <StatusBadge status={report.status} />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* PENDING */}

              <button
                type="button"
                disabled={updateLoading}
                onClick={() => onStatusUpdate("pending")}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Pending
              </button>

              {/* REVIEWED */}

              <button
                type="button"
                disabled={updateLoading}
                onClick={() => onStatusUpdate("reviewed")}
                className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
              >
                Reviewed
              </button>

              {/* RESOLVED */}

              <button
                type="button"
                disabled={updateLoading}
                onClick={() => onStatusUpdate("resolved")}
                className="rounded-lg bg-[#0859A8] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#064A8F] disabled:opacity-50"
              >
                {updateLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    Updating
                  </span>
                ) : (
                  "Resolve"
                )}
              </button>

              {/* REJECTED */}

              <button
                type="button"
                disabled={updateLoading}
                onClick={() => onStatusUpdate("rejected")}
                className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PERSON CARD
const PersonCard = ({ user }) => {
  if (!user) {
    return null;
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown user";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E6EFF8] p-4">
      <UserAvatar user={user} size="lg" />

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[#25364A]">
          {fullName}
        </p>

        <p className="truncate text-xs text-gray-500">{user.email || ""}</p>

        {user.role && (
          <p className="mt-1 text-xs capitalize text-[#0859A8]">{user.role}</p>
        )}
      </div>
    </div>
  );
};

// STATUS BADGE
const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-700 border-amber-100",

    reviewed: "bg-blue-50 text-blue-700 border-blue-100",

    resolved: "bg-green-50 text-green-700 border-green-100",

    rejected: "bg-red-50 text-red-700 border-red-100",

    active: "bg-green-50 text-green-700 border-green-100",

    closed: "bg-gray-100 text-gray-600 border-gray-200",
  };

  const style = styles[status] || "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${style}`}
    >
      {status || "Unknown"}
    </span>
  );
};

// SORT ICON
const SortIcon = ({ active, order }) => {
  if (!active) {
    return (
      <span className="text-gray-300">
        <ArrowDown size={13} />
      </span>
    );
  }

  return order === "asc" ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
};

// TABLE SKELETON
const TableSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((item) => (
        <tr key={item} className="animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((cell) => (
            <td key={cell} className="px-5 py-5">
              <div className="h-4 rounded bg-gray-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// PAGINATION
const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export default AdminReports;

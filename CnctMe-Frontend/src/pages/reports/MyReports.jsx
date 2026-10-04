import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileWarning,
  RefreshCw,
  XCircle,
  Flag,
} from "lucide-react";

import {
  fetchMyReports,
  selectReports,
  selectReportsLoading,
  selectReportsError,
} from "../../features/reports/reportsSlice";

const STATUS_CONFIG = {
  pending: {
    label: "Under Review",
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  reviewed: {
    label: "Reviewed",
    icon: FileWarning,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
  },
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTargetName = (report) => {
  if (report?.job?.title) {
    return report.job.title;
  }

  if (report?.company?.companyName) {
    return report.company.companyName;
  }

  if (report?.reportedUser) {
    const fullName = [
      report.reportedUser.firstName,
      report.reportedUser.lastName,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    if (fullName) return fullName;

    if (report.reportedUser.email) {
      return report.reportedUser.email;
    }
  }

  return "Reported item";
};

const getTargetType = (report) => {
  if (report?.job) return "Job";
  if (report?.company) return "Company";
  if (report?.reportedUser) return "User";

  return "Report";
};

const MyReports = () => {
  const dispatch = useDispatch();

  const reports = useSelector(selectReports);
  const loading = useSelector(selectReportsLoading);
  const error = useSelector(selectReportsError);

  useEffect(() => {
    dispatch(fetchMyReports());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-medium text-[#0859A8]">
              <Flag className="h-3.5 w-3.5" />
              Report Center
            </div>

            <h1 className="text-xl font-bold text-[#25364A] sm:text-2xl">
              My Reports
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-gray-500 sm:text-sm">
              Track the reports you have submitted and their current status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => dispatch(fetchMyReports())}
            disabled={loading}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#25364A] shadow-sm transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* SUMMARY */}

        {!loading && !error && reports.length > 0 && (
          <div className="mb-6 flex min-w-0 flex-col gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500 sm:text-sm">
              You have
              <span className="font-semibold text-[#25364A]">
                {reports.length}
              </span>
              {reports.length === 1 ? "report" : "reports"} submitted.
            </p>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-[#E6EFF8] px-2.5 py-1 text-xs font-medium text-[#0859A8]">
              <FileWarning className="h-3.5 w-3.5" />
              {reports.length} Total
            </span>
          </div>
        )}

        {/* ERROR */}

        {error && !loading && (
          <div className="mb-5 flex min-w-0 flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-2.5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  Unable to load reports
                </p>

                <p className="mt-0.5 text-xs leading-5 text-red-700">
                  {typeof error === "string"
                    ? error
                    : "Something went wrong while loading your reports."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dispatch(fetchMyReports())}
              className="shrink-0 text-sm font-medium text-red-700 transition hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING SKELETON */}

        {loading && (
          <div className="min-w-0 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="h-5 w-20 rounded-full bg-[#E2E8F0]" />

                    <div className="mt-3 h-5 w-48 max-w-full rounded bg-[#E2E8F0]" />

                    <div className="mt-2 h-3.5 w-64 max-w-full rounded bg-[#EEF2F6]" />
                  </div>

                  <div className="h-7 w-24 rounded-full bg-[#E2E8F0]" />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                  <div>
                    <div className="h-3 w-20 rounded bg-[#EEF2F6]" />
                    <div className="mt-2 h-4 w-32 rounded bg-[#E2E8F0]" />
                  </div>

                  <div>
                    <div className="h-3 w-24 rounded bg-[#EEF2F6]" />
                    <div className="mt-2 h-4 w-28 rounded bg-[#E2E8F0]" />
                  </div>
                </div>

                <div className="mt-3 rounded-lg bg-gray-50 p-3">
                  <div className="h-3 w-16 rounded bg-[#EEF2F6]" />
                  <div className="mt-2 h-3.5 w-full rounded bg-[#EEF2F6]" />
                  <div className="mt-2 h-3.5 w-3/4 rounded bg-[#EEF2F6]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}

        {!loading && !error && reports.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white px-5 py-10 text-center shadow-sm sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8] text-[#526170]">
              <Flag size={26} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-[#25364A]">
              No reports yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-gray-500 sm:text-sm">
              Reports you submit about jobs, companies, or users will appear
              here so you can follow their progress.
            </p>
          </div>
        )}

        {/* REPORTS */}

        {!loading && !error && reports.length > 0 && (
          <div className="min-w-0 space-y-4">
            {reports.map((report) => {
              const status =
                STATUS_CONFIG[report?.status?.toLowerCase()] ||
                STATUS_CONFIG.pending;

              const StatusIcon = status.icon;

              return (
                <div
                  key={report._id}
                  className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  {/* TOP */}

                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#E6EFF8] px-2 py-1 text-[11px] font-medium text-[#0859A8] sm:text-xs">
                          <Flag className="h-3 w-3" />
                          {getTargetType(report)}
                        </span>
                      </div>

                      <h2 className="mt-2 wrap-break-words text-sm font-semibold text-[#25364A] sm:text-base">
                        {getTargetName(report)}
                      </h2>
                    </div>

                    {/* STATUS */}

                    <div
                      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium sm:text-xs ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </div>
                  </div>

                  {/* REPORT INFO */}

                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Reason
                      </p>

                      <p className="mt-1 wrap-break-words text-xs font-medium text-gray-500 sm:text-sm">
                        {report.reason || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Submitted
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gray-500 sm:text-sm">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        {formatDate(report.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPTION */}

                  <div className="mt-3 rounded-lg bg-gray-50 px-3.5 py-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Description
                    </p>

                    <p className="mt-1.5 whitespace-pre-wrap wrap-break-words text-xs leading-relaxed text-gray-500 sm:text-sm">
                      {report.description || "No description provided."}
                    </p>
                  </div>

                  {/* STATUS MESSAGE */}

                  <div className="mt-3 flex min-w-0 items-start gap-2.5 border-t border-gray-100 pt-4">
                    <StatusIcon
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        status.className
                          .split(" ")
                          .find((item) => item.startsWith("text-")) ||
                        "text-gray-500"
                      }`}
                    />

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#25364A]">
                        Status: {status.label}
                      </p>

                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        {report?.status?.toLowerCase() === "pending"
                          ? "Your report has been submitted and is waiting for review."
                          : report?.status?.toLowerCase() === "reviewed"
                            ? "Your report has been reviewed by the admin team."
                            : report?.status?.toLowerCase() === "resolved"
                              ? "The admin team has marked this report as resolved."
                              : report?.status?.toLowerCase() === "rejected"
                                ? "The admin team reviewed this report and marked it as rejected."
                                : "Your report is being processed by the admin team."}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;

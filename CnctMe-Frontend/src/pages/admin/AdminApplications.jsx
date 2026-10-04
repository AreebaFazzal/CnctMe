import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FileText,
  RefreshCw,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import getLogoSrc from "../../utils/logo";
import Select from "../../components/ui/Select";

import {
  fetchAdminApplications,
  selectAdminApplications,
  selectAdminApplicationsPagination,
  selectAdminApplicationsLoading,
  selectAdminApplicationsError,
} from "../../features/admin/adminSlice";

// ==================================================
// HELPERS
// ==================================================

const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || "";
  const last = lastName?.charAt(0)?.toUpperCase() || "";

  return `${first}${last}` || "U";
};

const getProfileImage = (user) => {
  if (!user) {
    return null;
  }

  const image =
    user.profilePicture ||
    user.profileImage ||
    user.avatar ||
    user.photo ||
    null;

  if (!image) {
    return null;
  }

  try {
    return getLogoSrc(image);
  } catch (error) {
    console.error("Failed to convert profile image:", error);
    return null;
  }
};

const STATUS_OPTIONS = [
  {
    label: "Applied",
    value: "Applied",
  },
  {
    label: "Under Review",
    value: "Under Review",
  },
  {
    label: "Shortlisted",
    value: "Shortlisted",
  },
  {
    label: "Interview",
    value: "Interview",
  },
  {
    label: "Selected",
    value: "Selected",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
];

const getStatusClasses = (status) => {
  switch (status) {
    case "Applied":
      return "border-[#DDE7EF] bg-[#F8FAFC] text-[#526170]";

    case "Under Review":
      return "border-[#BFD5E5] bg-[#E6EFF8] text-[#0859A8]";

    case "Shortlisted":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";

    case "Interview":
      return "border-purple-200 bg-purple-50 text-purple-700";

    case "Selected":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#DDE7EF] bg-[#F8FAFC] text-[#526170]";
  }
};

// ==================================================
// COMPONENT
// ==================================================

const AdminApplications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // REDUX
  const applications = useSelector(selectAdminApplications);
  const pagination = useSelector(selectAdminApplicationsPagination);
  const loading = useSelector(selectAdminApplicationsLoading);
  const error = useSelector(selectAdminApplicationsError);

  // LOCAL STATE
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  // LOAD APPLICATIONS
  useEffect(() => {
    dispatch(
      fetchAdminApplications({
        status: statusFilter,
        page,
        limit: 10,
        sort: "createdAt",
        order: "desc",
      }),
    );
  }, [dispatch, statusFilter, page]);

  // REFRESH
  const handleRefresh = () => {
    dispatch(
      fetchAdminApplications({
        status: statusFilter,
        page,
        limit: 10,
        sort: "createdAt",
        order: "desc",
      }),
    );
  };

  // STATUS FILTER
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(1);
  };

  // PAGINATION
  const handlePageChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > (pagination?.totalPages || 1) ||
      newPage === page
    ) {
      return;
    }

    setPage(newPage);
  };

  // VIEW APPLICATION
  const handleViewApplication = (applicationId) => {
    if (!applicationId) {
      return;
    }

    navigate(`/admin/applications/${applicationId}`);
  };

  // ERROR
  const errorMessage =
    error?.general ||
    error?.message ||
    (typeof error === "string" ? error : null);

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <div className="mx-auto min-w-0 max-w-7xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0859A8]">
                <FileText size={21} />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
                  Applications
                </h1>

                <p className="mt-0.5 text-xs text-[#8998A6] sm:text-sm">
                  Review job applications submitted by candidates.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D5E1EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#25364A] shadow-sm transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="mb-5 min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:mb-6 sm:p-5">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 w-full sm:w-56">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#526170]">
                Application Status
              </label>

              <div className="min-w-0 w-full">
                <Select
                  id="application-status"
                  name="applicationStatus"
                  value={statusFilter}
                  onChange={handleStatusChange}
                  options={STATUS_OPTIONS}
                  placeholder="All Applications"
                  className="w-full rounded-lg py-2.5 font-medium"
                />
              </div>
            </div>

            <div className="text-xs font-medium text-[#8998A6]">
              {pagination?.totalApplications || 0} total applications
            </div>
          </div>
        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {errorMessage && (
          <div className="mb-5 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm sm:mb-6">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 sm:p-5">
              <p className="text-sm font-semibold text-red-800">
                Unable to load applications.
              </p>

              <p className="mt-1 text-xs leading-6 text-red-700 sm:text-sm">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D7E4ED] bg-white shadow-sm">
            <div className="hidden md:block">
              <div className="grid grid-cols-[2fr_2fr_1.3fr_1fr_0.7fr] gap-4 border-b border-[#DDE7EF] bg-[#F8FAFC] px-5 py-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-3 animate-pulse rounded-md bg-[#E6EFF8]"
                  />
                ))}
              </div>

              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="grid grid-cols-[2fr_2fr_1.3fr_1fr_0.7fr] gap-4 border-b border-[#EEF3F7] px-5 py-5 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-[#E6EFF8]" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3.5 w-28 animate-pulse rounded-md bg-[#E6EFF8]" />
                      <div className="h-3 w-40 animate-pulse rounded-md bg-[#F1F5F9]" />
                    </div>
                  </div>

                  {[1, 2, 3, 4].map((column) => (
                    <div key={column} className="flex items-center">
                      <div className="h-4 w-24 animate-pulse rounded-md bg-[#E6EFF8]" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="space-y-3 p-3 md:hidden">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-[#DDE7EF] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-[#E6EFF8]" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-32 animate-pulse rounded-md bg-[#E6EFF8]" />
                      <div className="h-3 w-44 animate-pulse rounded-md bg-[#F1F5F9]" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-36 animate-pulse rounded-md bg-[#E6EFF8]" />
                    <div className="h-4 w-24 animate-pulse rounded-md bg-[#E6EFF8]" />
                    <div className="h-9 w-full animate-pulse rounded-lg bg-[#E6EFF8]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {!loading && applications.length === 0 && (
          <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8] text-[#0859A8]">
              <FileText size={24} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#25364A]">
              No applications found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#8998A6]">
              There are no applications matching the selected status.
            </p>
          </div>
        )}

        {/* ==================================================
            APPLICATIONS TABLE
        ================================================== */}

        {!loading && applications.length > 0 && (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D7E4ED] bg-white shadow-sm">
            {/* DESKTOP */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-255">
                <thead>
                  <tr className="border-b border-[#DDE7EF] bg-[#F8FAFC]">
                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#68798A]">
                      Applicant
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#68798A]">
                      Job
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#68798A]">
                      Applied
                    </th>

                    <th className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-[#68798A]">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-[#68798A]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {applications.map((application) => {
                    const user = application?.user || {};

                    const firstName = user?.firstName || "";
                    const lastName = user?.lastName || "";

                    const fullName =
                      `${firstName} ${lastName}`.trim() || "Unknown User";

                    const imageSrc = getProfileImage(user);

                    return (
                      <tr
                        key={application._id}
                        className="border-b border-[#EEF3F7] transition hover:bg-[#FBFDFF] last:border-b-0"
                      >
                        {/* APPLICANT */}

                        <td className="px-5 py-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D7E4ED] bg-[#E6EFF8]">
                              {imageSrc ? (
                                <img
                                  src={imageSrc}
                                  alt={fullName}
                                  className="h-full w-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = "none";
                                    event.currentTarget.nextElementSibling?.classList.remove(
                                      "hidden",
                                    );
                                  }}
                                />
                              ) : null}

                              <div
                                className={`${
                                  imageSrc ? "hidden" : "flex"
                                } h-full w-full items-center justify-center text-sm font-bold text-[#0859A8]`}
                              >
                                {imageSrc ? (
                                  <User size={18} />
                                ) : (
                                  getInitials(firstName, lastName)
                                )}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#25364A]">
                                {fullName}
                              </p>

                              <p className="mt-0.5 truncate text-xs text-[#8998A6]">
                                {user?.email || "Email not available"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* JOB */}

                        <td className="px-5 py-4">
                          <p className="max-w-57.5 truncate text-sm font-semibold text-[#25364A]">
                            {application?.job?.title || "Job not available"}
                          </p>

                          <p className="mt-1 max-w-57.5 truncate text-xs text-[#8998A6]">
                            {application?.job?.location ||
                              "Location not available"}
                          </p>
                        </td>

                        {/* DATE */}

                        <td className="px-5 py-4">
                          <span className="text-sm text-[#526170]">
                            {application?.createdAt
                              ? new Date(
                                  application.createdAt,
                                ).toLocaleDateString()
                              : "Not available"}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                              application?.status,
                            )}`}
                          >
                            {application?.status || "Applied"}
                          </span>
                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleViewApplication(application._id)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-[#BFD5E5] bg-[#E6EFF8] px-3.5 py-2 text-xs font-semibold text-[#0859A8] transition hover:border-[#0859A8] hover:bg-[#DCEAF5]"
                          >
                            <Eye size={15} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}

            <div className="space-y-3 p-3 md:hidden">
              {applications.map((application) => {
                const user = application?.user || {};

                const firstName = user?.firstName || "";
                const lastName = user?.lastName || "";

                const fullName =
                  `${firstName} ${lastName}`.trim() || "Unknown User";

                const imageSrc = getProfileImage(user);

                return (
                  <div
                    key={application._id}
                    className="rounded-xl border border-[#DDE7EF] bg-white p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D7E4ED] bg-[#E6EFF8]">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={fullName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-[#0859A8]">
                            {getInitials(firstName, lastName)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#25364A]">
                          {fullName}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-[#8998A6]">
                          {user?.email || "Email not available"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 border-t border-[#EEF3F7] pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8998A6]">
                          Job
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#25364A]">
                          {application?.job?.title || "Job not available"}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                            application?.status,
                          )}`}
                        >
                          {application?.status || "Applied"}
                        </span>

                        <span className="text-xs text-[#8998A6]">
                          {application?.createdAt
                            ? new Date(
                                application.createdAt,
                              ).toLocaleDateString()
                            : "Not available"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewApplication(application._id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985]"
                      >
                        <Eye size={16} />
                        View Application
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================
            PAGINATION
        ================================================== */}

        {!loading && applications.length > 0 && (
          <div className="mt-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#8998A6] sm:text-sm">
              Page {page} of {pagination?.totalPages || 1}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={loading || page <= 1}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D5E1EB] bg-white px-3 py-2 text-xs font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={loading || page >= (pagination?.totalPages || 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#D5E1EB] bg-white px-3 py-2 text-xs font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplications;

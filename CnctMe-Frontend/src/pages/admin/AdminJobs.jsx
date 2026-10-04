import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  MapPin,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Select from "../../components/ui/Select";

import {
  fetchAdminJobs,
  removeAdminJob,
  selectAdminJobs,
  selectAdminJobsPagination,
} from "../../features/admin/adminSlice";

const STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Closed",
    value: "closed",
  },
];

const JOB_TYPE_OPTIONS = [
  {
    label: "Full Time",
    value: "full-time",
  },
  {
    label: "Part Time",
    value: "part-time",
  },
  {
    label: "Contract",
    value: "contract",
  },
  {
    label: "Internship",
    value: "internship",
  },
];

const WORK_MODE_OPTIONS = [
  {
    label: "On Site",
    value: "on-site",
  },
  {
    label: "Remote",
    value: "remote",
  },
  {
    label: "Hybrid",
    value: "hybrid",
  },
];

const getStatusClasses = (status) => {
  return status === "active"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-slate-100 text-slate-600 border-slate-200";
};

const AdminJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const jobs = useSelector(selectAdminJobs);
  const pagination = useSelector(selectAdminJobsPagination);

  const { jobsLoading, jobActionLoading, jobsError } = useSelector(
    (state) => state.admin,
  );

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");

  const [page, setPage] = useState(1);

  const [removeId, setRemoveId] = useState(null);

  const loadJobs = useCallback(
    (targetPage) => {
      dispatch(
        fetchAdminJobs({
          search,
          status,
          jobType,
          workMode,
          page: targetPage,
          limit: 10,
          sort: "createdAt",
          order: "desc",
        }),
      );
    },
    [dispatch, search, status, jobType, workMode],
  );

  useEffect(() => {
    loadJobs(page);
  }, [loadJobs, page]);

  const handleSearch = (event) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setJobType("");
    setWorkMode("");
    setPage(1);
  };

  const handleView = (id) => {
    navigate(`/jobs/${id}`);
  };

  const handleRemove = async () => {
    if (!removeId) {
      return;
    }

    await dispatch(removeAdminJob(removeId));

    setRemoveId(null);
    loadJobs(page);
  };

  return (
    <div className="min-h-full bg-[#F8FAFC] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BriefcaseBusiness className="h-6 w-6 text-[#0859A8]" />

              <h1 className="text-2xl font-bold text-[#25364A]">Jobs</h1>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Review job postings and manage their availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadJobs(page)}
            disabled={jobsLoading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-[#25364A] shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* FILTERS */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <form onSubmit={handleSearch}>
            <div
              className="
                grid
                grid-cols-1
                gap-3
                lg:grid-cols-[minmax(0,1fr)_minmax(0,180px)_minmax(0,180px)_minmax(0,180px)_auto]
              "
            >
              {/* SEARCH */}
              <div className="relative min-w-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search jobs..."
                  className="
                    w-full
                    min-w-0
                    rounded-lg
                    border
                    border-slate-200
                    py-2.5
                    pl-10
                    pr-3
                    text-sm
                    outline-none
                    focus:border-[#0859A8]
                    focus:ring-2
                    focus:ring-[#0859A8]/10
                  "
                />
              </div>

              {/* STATUS */}
              <div className="min-w-0">
                <Select
                  id="admin-job-status"
                  name="status"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value);
                    setPage(1);
                  }}
                  options={STATUS_OPTIONS}
                  placeholder="All Status"
                  className="w-full min-w-0 rounded-lg py-2.5 font-medium"
                />
              </div>

              {/* JOB TYPE */}
              <div className="min-w-0">
                <Select
                  id="admin-job-type"
                  name="jobType"
                  value={jobType}
                  onChange={(event) => {
                    setJobType(event.target.value);
                    setPage(1);
                  }}
                  options={JOB_TYPE_OPTIONS}
                  placeholder="All Job Types"
                  className="w-full min-w-0 rounded-lg py-2.5 font-medium"
                />
              </div>

              {/* WORK MODE */}
              <div className="min-w-0">
                <Select
                  id="admin-work-mode"
                  name="workMode"
                  value={workMode}
                  onChange={(event) => {
                    setWorkMode(event.target.value);
                    setPage(1);
                  }}
                  options={WORK_MODE_OPTIONS}
                  placeholder="All Work Modes"
                  className="w-full min-w-0 rounded-lg py-2.5 font-medium"
                />
              </div>

              {/* SEARCH BUTTON */}
              <button
                type="submit"
                className="
                  w-full
                  rounded-lg
                  bg-[#0859A8]
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-[#064b91]
                  lg:w-auto
                "
              >
                Search
              </button>
            </div>
          </form>

          {(search || status || jobType || workMode) && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-3 text-sm font-medium text-[#0859A8] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ERROR */}
        {jobsError?.general && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {jobsError.general}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-237.5 w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Job
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Company
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Work Mode
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {jobsLoading ? (
                  Array.from({ length: 7 }).map((_, index) => (
                    <tr key={`job-skeleton-${index}`}>
                      {/* JOB */}
                      <td className="px-5 py-4">
                        <div className="animate-pulse">
                          <div className="h-4 w-48 rounded bg-slate-200" />

                          <div className="mt-2 flex items-center gap-2">
                            <div className="h-3.5 w-3.5 rounded-full bg-slate-200" />
                            <div className="h-3 w-32 rounded bg-slate-200" />
                          </div>
                        </div>
                      </td>

                      {/* COMPANY */}
                      <td className="px-5 py-4">
                        <div className="flex animate-pulse items-center gap-2">
                          <div className="h-4 w-4 rounded bg-slate-200" />
                          <div className="h-4 w-28 rounded bg-slate-200" />
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-4">
                        <div className="animate-pulse">
                          <div className="h-4 w-20 rounded bg-slate-200" />
                        </div>
                      </td>

                      {/* WORK MODE */}
                      <td className="px-5 py-4">
                        <div className="animate-pulse">
                          <div className="h-4 w-20 rounded bg-slate-200" />
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <div className="animate-pulse">
                          <div className="h-6 w-16 rounded-full bg-slate-200" />
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex animate-pulse justify-end gap-2">
                          <div className="h-8 w-8 rounded-lg bg-slate-200" />
                          <div className="h-8 w-8 rounded-lg bg-slate-200" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-slate-500"
                    >
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/70">
                      {/* JOB */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-[#25364A]">
                            {job.title || "Untitled Job"}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />

                            {job.location || "Location not provided"}
                          </div>
                        </div>
                      </td>

                      {/* COMPANY */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-slate-400" />

                          <span className="text-sm text-slate-600">
                            {job.company?.companyName || "No company"}
                          </span>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-4 text-sm capitalize text-slate-600">
                        {job.jobType?.replace("-", " ") || "—"}
                      </td>

                      {/* WORK MODE */}
                      <td className="px-5 py-4 text-sm capitalize text-slate-600">
                        {job.workMode?.replace("-", " ") || "—"}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                            job.status,
                          )}`}
                        >
                          {job.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {/* VIEW ACTUAL JOB */}
                          <button
                            type="button"
                            onClick={() => handleView(job._id)}
                            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-[#0859A8]/30 hover:bg-[#E6EFF8] hover:text-[#0859A8]"
                            title="View job"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* CLOSE JOB */}
                          {job.status === "active" && (
                            <button
                              type="button"
                              onClick={() => setRemoveId(job._id)}
                              className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50"
                              title="Close job"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pagination.totalPages > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.currentPage <= 1 || jobsLoading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="rounded-lg bg-[#E6EFF8] px-3 py-2 text-sm font-semibold text-[#0859A8]">
                  {pagination.currentPage}
                </span>

                <button
                  type="button"
                  disabled={
                    pagination.currentPage >= pagination.totalPages ||
                    jobsLoading
                  }
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CLOSE JOB CONFIRMATION */}
      {removeId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#25364A]/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <Trash2 className="mb-4 h-8 w-8 text-red-600" />

            <h3 className="text-lg font-bold text-[#25364A]">Close Job?</h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This will change the job status from active to closed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRemoveId(null)}
                disabled={jobActionLoading}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleRemove}
                disabled={jobActionLoading}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {jobActionLoading ? "Closing..." : "Close Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;

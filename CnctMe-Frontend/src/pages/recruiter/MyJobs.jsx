import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  BriefcaseBusiness,
  MapPin,
  Users,
  Clock3,
  Plus,
  Eye,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  LockKeyhole,
} from "lucide-react";

import {
  getMyJobs,
  closeJob,
  deleteJob,
  selectMyJobs,
  selectMyJobsLoading,
  selectMyJobsError,
  selectCloseJobLoading,
} from "../../features/recruiter/recruiterSlice";

import {
  formatJobDate,
  formatSalary,
  formatJobType,
  formatWorkMode,
} from "../../utils/jobUtils";

const MyJobs = () => {
  const dispatch = useDispatch();

  const jobs = useSelector(selectMyJobs);
  const loading = useSelector(selectMyJobsLoading);
  const error = useSelector(selectMyJobsError);
  const closeJobLoading = useSelector(selectCloseJobLoading);

  const [deletingJobId, setDeletingJobId] = useState(null);
  const [closingJobId, setClosingJobId] = useState(null);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: "",
  });

  // Close modal
  const [closeModal, setCloseModal] = useState({
    isOpen: false,
    jobId: null,
    jobTitle: "",
  });

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  // DELETE MODAL
  const openDeleteModal = (jobId, jobTitle) => {
    setDeleteModal({
      isOpen: true,
      jobId,
      jobTitle,
    });
  };

  const closeDeleteModal = () => {
    if (deletingJobId) return;

    setDeleteModal({
      isOpen: false,
      jobId: null,
      jobTitle: "",
    });
  };

  // CLOSE JOB MODAL
  const openCloseModal = (jobId, jobTitle) => {
    setCloseModal({
      isOpen: true,
      jobId,
      jobTitle,
    });
  };

  const closeCloseModal = () => {
    if (closingJobId) return;

    setCloseModal({
      isOpen: false,
      jobId: null,
      jobTitle: "",
    });
  };

  // CLOSE JOB
  const handleCloseJob = async () => {
    const { jobId } = closeModal;

    if (!jobId) return;

    try {
      setClosingJobId(jobId);

      await dispatch(closeJob(jobId)).unwrap();

      setCloseModal({
        isOpen: false,
        jobId: null,
        jobTitle: "",
      });
    } catch (error) {
      console.error("Close Job Error:", error);
    } finally {
      setClosingJobId(null);
    }
  };

  // DELETE JOB
  const handleDelete = async () => {
    const { jobId } = deleteModal;

    if (!jobId) return;

    try {
      setDeletingJobId(jobId);

      await dispatch(deleteJob(jobId)).unwrap();

      setDeleteModal({
        isOpen: false,
        jobId: null,
        jobTitle: "",
      });
    } catch (error) {
      console.error("Delete Job Error:", error);
    } finally {
      setDeletingJobId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
        {/* PAGE HEADER */}
        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#0859A8] sm:text-sm">
              Job Management
            </p>

            <h1 className="mt-1 text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
              My Jobs
            </h1>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#8998A6] sm:text-sm">
              Manage the jobs you have posted and track their performance.
            </p>
          </div>

          <Link
            to="/recruiter/jobs/create"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 text-sm font-semibold text-white transition hover:bg-[#064A8D] sm:w-auto"
          >
            <Plus size={17} />
            Post New Job
          </Link>
        </div>

        {/* ERROR */}
        {error?.general && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-600 sm:mb-6 sm:text-sm">
            {error.general}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="min-w-0 animate-pulse rounded-xl border border-[#E6EFF8] bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex min-w-0 gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-[#E6EFF8]" />

                  <div className="min-w-0 flex-1">
                    <div className="h-4 w-2/3 max-w-full rounded bg-[#E6EFF8]" />
                    <div className="mt-2 h-3 w-1/3 max-w-full rounded bg-[#F3F2F0]" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="h-3 w-3/4 max-w-full rounded bg-[#F3F2F0]" />
                  <div className="h-3 w-1/2 max-w-full rounded bg-[#F3F2F0]" />
                  <div className="h-3 w-2/3 max-w-full rounded bg-[#F3F2F0]" />
                </div>

                <div className="mt-4 h-9 rounded-lg bg-[#F3F2F0]" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          /* EMPTY STATE */
          <div className="min-w-0 rounded-xl border border-[#E6EFF8] bg-white px-4 py-10 text-center shadow-sm sm:px-6 sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8]">
              <BriefcaseBusiness size={25} className="text-[#0859A8]" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#25364A]">
              No jobs posted yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#8998A6] sm:text-sm">
              You haven't posted any jobs yet. Create your first job listing to
              start receiving applications.
            </p>

            <Link
              to="/recruiter/jobs/create"
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 text-sm font-semibold text-white transition hover:bg-[#064A8D] sm:w-auto"
            >
              <Plus size={17} />
              Post Your First Job
            </Link>
          </div>
        ) : (
          /* JOB CARDS */
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            {jobs.map((job) => {
              const isActive = job.status === "active";
              const isClosing = closingJobId === job._id;
              const isDeleting = deletingJobId === job._id;

              return (
                <div
                  key={job._id}
                  className="min-w-0 overflow-hidden rounded-xl border border-[#E6EFF8] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* TOP */}
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                        <BriefcaseBusiness
                          size={18}
                          className="text-[#0859A8]"
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-[#25364A]">
                          {job.title}
                        </h2>

                        <p className="mt-1 truncate text-xs text-[#8998A6]">
                          {job.company?.companyName || "Your Company"}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        isActive
                          ? "bg-[#EAF7EF] text-[#267A4A]"
                          : "bg-[#F3F2F0] text-[#68798A]"
                      }`}
                    >
                      {isActive ? "Active" : "Closed"}
                    </span>
                  </div>

                  {/* JOB INFO */}
                  <div className="mt-4 grid min-w-0 grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-4">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#68798A]">
                      <MapPin size={14} className="shrink-0 text-[#8998A6]" />

                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#68798A]">
                      <BriefcaseBusiness
                        size={14}
                        className="shrink-0 text-[#8998A6]"
                      />

                      <span className="truncate">
                        {formatJobType(job.jobType)}
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#68798A]">
                      <Users size={14} className="shrink-0 text-[#8998A6]" />

                      <span className="truncate">
                        {job.applicantCount || 0} Applicants
                      </span>
                    </div>

                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-[#68798A]">
                      <Clock3 size={14} className="shrink-0 text-[#8998A6]" />

                      <span className="truncate">
                        {formatWorkMode(job.workMode)}
                      </span>
                    </div>
                  </div>

                  {/* SALARY */}
                  <div className="mt-4 rounded-lg bg-[#F8FAFC] px-3 py-2.5">
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8998A6]">
                          Salary Range
                        </p>

                        <p className="mt-0.5 truncate text-xs font-semibold text-[#25364A]">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </p>
                      </div>

                      <div className="shrink-0 text-left sm:text-right">
                        <p className="text-[11px] text-[#8998A6]">Posted</p>

                        <p className="mt-0.5 text-[11px] font-medium text-[#68798A]">
                          {formatJobDate(job.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-4 flex min-w-0 flex-col gap-3 border-t border-[#EEF1F4] pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[#0859A8] transition hover:text-[#064A8D]"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    <div className="flex min-w-0 flex-wrap items-center justify-start gap-1.5 sm:justify-end">
                      {/* EDIT */}
                      <Link
                        to={`/recruiter/jobs/${job._id}/edit`}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#DCE3E8] px-2.5 text-[11px] font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#EEF6FB] hover:text-[#0859A8]"
                      >
                        <Pencil size={13} />
                        Edit
                      </Link>

                      {/* CLOSE JOB */}
                      {isActive && (
                        <button
                          type="button"
                          onClick={() => openCloseModal(job._id, job.title)}
                          disabled={isClosing || isDeleting || closeJobLoading}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#DCE3E8] px-2.5 text-[11px] font-semibold text-[#52606D] transition hover:border-[#68798A] hover:bg-[#F3F2F0] hover:text-[#25364A] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <LockKeyhole size={13} />

                          {isClosing ? "Closing..." : "Close"}
                        </button>
                      )}

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() => openDeleteModal(job._id, job.title)}
                        disabled={isDeleting || isClosing}
                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-red-200 px-2.5 text-[11px] font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={13} />

                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =====================================================
          CLOSE JOB CONFIRMATION MODAL
      ====================================================== */}

      {closeModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 backdrop-blur-[2px] sm:px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeCloseModal();
            }
          }}
        >
          <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex min-w-0 items-start justify-between gap-3 border-b border-[#EEF1F4] px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F2F0]">
                  <LockKeyhole size={20} className="text-[#52606D]" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[#25364A]">
                    Close Job?
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
                    The job will no longer appear in public job listings.
                  </p>
                </div>
              </div>

              {/* CLOSE MODAL */}
              <button
                type="button"
                onClick={closeCloseModal}
                disabled={Boolean(closingJobId)}
                className="shrink-0 rounded-lg p-1.5 text-[#8998A6] transition hover:bg-[#F3F2F0] hover:text-[#25364A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <p className="wrap-break-words text-sm leading-6 text-[#68798A]">
                Are you sure you want to close{" "}
                <span className="font-semibold text-[#25364A]">
                  "{closeModal.jobTitle}"
                </span>
                ?
              </p>

              <p className="mt-2 text-xs leading-5 text-[#8998A6]">
                The job will remain in your My Jobs page, but candidates will no
                longer be able to find it through active job listings.
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-col-reverse gap-2.5 border-t border-[#EEF1F4] bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
              <button
                type="button"
                onClick={closeCloseModal}
                disabled={Boolean(closingJobId)}
                className="h-10 w-full rounded-lg border border-[#DCE3E8] bg-white px-4 text-sm font-semibold text-[#25364A] transition hover:bg-[#F3F2F0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCloseJob}
                disabled={Boolean(closingJobId)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#25364A] px-4 text-sm font-semibold text-white transition hover:bg-[#1D2A3A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <LockKeyhole size={16} />

                {closingJobId ? "Closing..." : "Close Job"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

      {deleteModal.isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 backdrop-blur-[2px] sm:px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="my-auto w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex min-w-0 items-start justify-between gap-3 border-b border-[#EEF1F4] px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <AlertTriangle size={20} className="text-red-600" />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-[#25364A]">
                    Delete Job?
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* CLOSE */}
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingJobId)}
                className="shrink-0 rounded-lg p-1.5 text-[#8998A6] transition hover:bg-[#F3F2F0] hover:text-[#25364A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="px-4 py-4 sm:px-6 sm:py-5">
              <p className="wrap-break-words text-sm leading-6 text-[#68798A]">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#25364A]">
                  "{deleteModal.jobTitle}"
                </span>
                ?
              </p>

              <p className="mt-2 text-xs leading-5 text-[#8998A6]">
                The job listing and its associated data will be permanently
                removed.
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex flex-col-reverse gap-2.5 border-t border-[#EEF1F4] bg-[#F8FAFC] px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={Boolean(deletingJobId)}
                className="h-10 w-full rounded-lg border border-[#DCE3E8] bg-white px-4 text-sm font-semibold text-[#25364A] transition hover:bg-[#F3F2F0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={Boolean(deletingJobId)}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Trash2 size={16} />

                {deletingJobId ? "Deleting..." : "Delete Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyJobs;

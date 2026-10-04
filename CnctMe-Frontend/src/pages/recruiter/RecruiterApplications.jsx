import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  FileText,
  MapPin,
  Users,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import {
  getMyJobs,
  getJobApplicants,
  selectJobApplicants,
  selectApplicationsLoading,
  selectApplicationsError,
} from "../../features/recruiter/recruiterSlice";

import getLogoSrc from "../../utils/logo";

const RecruiterApplications = () => {
  const dispatch = useDispatch();

  const applicants = useSelector(selectJobApplicants);
  const loading = useSelector(selectApplicationsLoading);
  const error = useSelector(selectApplicationsError);

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      setJobsError(null);

      try {
        const result = await dispatch(
          getMyJobs({
            page: currentPage,
            limit,
          }),
        ).unwrap();

        setJobs(result?.jobs || []);
        setTotalPages(result?.pagination?.totalPages || 1);
      } catch (err) {
        setJobsError(err?.message || "Failed to load jobs.");
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [dispatch, currentPage]);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    dispatch(getJobApplicants(job._id));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setSelectedJob(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setSelectedJob(null);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Applied":
        return "bg-[#E6EFF8] text-[#0859A8]";

      case "Under Review":
        return "bg-[#FFF7E6] text-[#9A6700]";

      case "Shortlisted":
        return "bg-[#EEF8F1] text-[#2E8B57]";

      case "Interview":
        return "bg-[#F3EEFF] text-[#7655B5]";

      case "Selected":
        return "bg-[#E8F7F0] text-[#16805C]";

      case "Rejected":
        return "bg-[#FBECEE] text-[#C0394B]";

      default:
        return "bg-[#F1F5F9] text-[#64748B]";
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <div className="flex min-h-[calc(100vh-73px)] min-w-0 flex-col lg:h-[calc(100vh-73px)] lg:flex-row">
        {/* Jobs Section */}
        <section className="flex w-full shrink-0 flex-col border-b border-[#E2E8F0] bg-white lg:h-full lg:w-95 lg:border-b-0 lg:border-r">
          {/* Header */}
          <div className="border-b border-[#E2E8F0] px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8]">
                <BriefcaseBusiness size={20} className="text-[#0859A8]" />
              </div>

              <div className="min-w-0">
                <h1 className="text-lg font-bold text-[#25364A]">
                  Applications
                </h1>

                <p className="text-xs text-[#8998A6] sm:text-sm">
                  Select a job to view applicants
                </p>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="h-[42vh] min-h-60 max-h-105 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4 lg:h-auto lg:min-h-0 lg:max-h-none lg:flex-1">
            {jobsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="h-4 w-3/5 animate-pulse rounded-md bg-[#E6EFF8]" />

                        <div className="flex items-center gap-2">
                          <div className="h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-[#E6EFF8]" />
                          <div className="h-3 w-3/4 animate-pulse rounded-md bg-[#E6EFF8]" />
                        </div>
                      </div>

                      <div className="h-6 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EFF8]" />
                    </div>

                    <div className="mt-3 flex gap-4">
                      <div className="h-3 w-16 animate-pulse rounded-md bg-[#E6EFF8]" />
                      <div className="h-3 w-16 animate-pulse rounded-md bg-[#E6EFF8]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobsError ? (
              <div className="rounded-xl border border-[#F3C6CB] bg-[#FBECEE] px-4 py-3">
                <p className="text-sm text-[#C0394B]">{jobsError}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center sm:py-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF6FB]">
                  <BriefcaseBusiness size={22} className="text-[#0859A8]" />
                </div>

                <p className="text-sm font-semibold text-[#25364A]">
                  No jobs found
                </p>

                <p className="mt-1 text-xs text-[#8998A6]">
                  Create a job to start receiving applications.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {jobs.map((job) => {
                  const isSelected = selectedJob?._id === job._id;

                  return (
                    <button
                      key={job._id}
                      type="button"
                      onClick={() => handleJobSelect(job)}
                      className={`w-full min-w-0 rounded-xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#B8D2EA] bg-[#E6EFF8]"
                          : "border-[#E2E8F0] bg-white hover:border-[#C9D8E5] hover:bg-[#EEF6FB]"
                      }`}
                    >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-sm font-semibold text-[#25364A]">
                            {job.title}
                          </h2>

                          <div className="mt-2 flex min-w-0 items-start gap-1.5 text-xs text-[#8998A6]">
                            <MapPin size={14} className="mt-0.5 shrink-0" />

                            <span className="truncate">
                              {job.location || "Location not specified"}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            job.status === "active"
                              ? "bg-[#EEF8F1] text-[#2E8B57]"
                              : "bg-[#F1F5F9] text-[#64748B]"
                          }`}
                        >
                          {job.status === "active" ? "Active" : "Closed"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8998A6]">
                        <span>{job.jobType || "Full-time"}</span>

                        <span>{job.workMode || "On-site"}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-[#E2E8F0] px-3 py-3 sm:px-4">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-[#52606D] transition hover:bg-[#EEF6FB] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <span className="shrink-0 text-[11px] font-medium text-[#8998A6] sm:text-xs">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-[#52606D] transition hover:bg-[#EEF6FB] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-40 sm:px-3 sm:text-sm"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Applicants Section */}
        <section className="flex min-h-[58vh] min-w-0 flex-1 flex-col bg-[#F8FAFC] lg:h-full lg:min-h-0">
          {/* Header */}
          <div className="border-b border-[#E2E8F0] bg-white px-4 py-4 sm:px-6 sm:py-5">
            {selectedJob ? (
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-[#25364A]">
                    {selectedJob.title}
                  </h2>

                  <p className="mt-1 text-xs text-[#8998A6] sm:text-sm">
                    Applicants for this position
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 rounded-lg bg-[#EEF6FB] px-3 py-2">
                  <Users size={16} className="text-[#0859A8]" />

                  <span className="text-sm font-semibold text-[#0859A8]">
                    {applicants?.length || 0}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold text-[#25364A]">Applicants</h2>

                <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
                  Select a job from the left to view its applicants.
                </p>
              </div>
            )}
          </div>

          {/* Applicants */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5 md:p-6">
            {!selectedJob ? (
              <div className="flex min-h-80 items-center justify-center">
                <div className="max-w-sm text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8]">
                    <FileText size={25} className="text-[#0859A8]" />
                  </div>

                  <h3 className="text-base font-semibold text-[#25364A]">
                    Select a job
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-[#8998A6] sm:text-sm">
                    Choose one of your jobs to see all candidates who applied.
                  </p>
                </div>
              </div>
            ) : loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white p-4"
                  >
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EFF8] max-sm:h-12 max-sm:w-12" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-4 w-32 animate-pulse rounded-md bg-[#E6EFF8]" />

                          <div className="h-3 w-48 max-w-full animate-pulse rounded-md bg-[#E6EFF8]" />

                          <div className="h-3 w-24 animate-pulse rounded-md bg-[#E6EFF8]" />
                        </div>
                      </div>

                      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <div className="h-7 w-20 animate-pulse rounded-full bg-[#E6EFF8]" />

                        <div className="h-9 w-full animate-pulse rounded-lg bg-[#E6EFF8] sm:w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-[#F3C6CB] bg-[#FBECEE] px-4 py-4">
                <p className="text-sm text-[#C0394B]">{error}</p>
              </div>
            ) : !applicants || applicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <Users size={25} className="text-[#8998A6]" />
                </div>

                <h3 className="text-base font-semibold text-[#25364A]">
                  No applications yet
                </h3>

                <p className="mt-1 text-xs text-[#8998A6] sm:text-sm">
                  No candidates have applied for this job yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applicants.map((application) => {
                  const candidate = application.user || application.candidate;

                  const candidateName =
                    candidate?.firstName && candidate?.lastName
                      ? `${candidate.firstName} ${candidate.lastName}`
                      : candidate?.firstName || candidate?.name || "Candidate";

                  const profilePicture = getLogoSrc(
                    candidate?.profilePicture,
                    candidate?.profilePicture?.contentType,
                  );

                  return (
                    <div
                      key={application._id}
                      className="min-w-0 rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#C9D8E5] hover:shadow-sm"
                    >
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          {/* Candidate Profile Picture */}
                          {profilePicture ? (
                            <img
                              src={profilePicture}
                              alt={candidateName}
                              className="h-14 w-14 shrink-0 rounded-full border-2 border-[#E6EFF8] object-cover max-sm:h-12 max-sm:w-12"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E6EFF8] bg-[#EEF6FB] text-base font-bold text-[#0859A8] max-sm:h-12 max-sm:w-12 max-sm:text-sm">
                              {candidateName.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-semibold text-[#25364A]">
                              {candidateName}
                            </h3>

                            <p className="truncate text-xs text-[#8998A6]">
                              {candidate?.email ||
                                application.email ||
                                "Email not available"}
                            </p>

                            <p className="mt-1 text-xs text-[#8998A6]">
                              Applied{" "}
                              {application.createdAt
                                ? new Date(
                                    application.createdAt,
                                  ).toLocaleDateString()
                                : "Recently"}
                            </p>
                          </div>
                        </div>

                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                          <span
                            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              application.status,
                            )}`}
                          >
                            {application.status}
                          </span>

                          <Link
                            to={`/recruiter/applications/${application._id}`}
                            className="inline-flex w-full items-center justify-center rounded-lg border border-[#DCE3E8] bg-white px-3 py-2 text-xs font-semibold text-[#52606D] transition hover:border-[#B8D2EA] hover:bg-[#EEF6FB] hover:text-[#0859A8] sm:w-auto"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecruiterApplications;

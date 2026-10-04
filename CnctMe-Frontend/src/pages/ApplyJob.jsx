import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  FileText,
  BriefcaseBusiness,
  MapPin,
  CheckCircle2,
  Send,
  X,
  Building2,
  Clock3,
} from "lucide-react";

import api from "../api/axios";
import getApiError from "../utils/apiError";
import getLogoSrc from "../utils/logo";

import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const ApplyJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // STATE
  const [job, setJob] = useState(null);

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // FETCH JOB
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/jobs/${id}`);

        setJob(response.data.job);
      } catch (error) {
        const apiError = getApiError(error);

        setError(
          apiError?.general ||
            apiError?.message ||
            "Unable to load job information.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  // HANDLE RESUME
  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError(null);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload your resume as a PDF, DOC, or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be smaller than 5MB.");
      event.target.value = "";
      return;
    }

    setResume(file);
  };

  // REMOVE RESUME
  const handleRemoveResume = () => {
    setResume(null);

    const fileInput = document.getElementById("resume");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // SUBMIT APPLICATION
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null);

    if (!resume) {
      setError("Please upload your resume.");
      return;
    }

    if (!coverLetter.trim()) {
      setError("Please write a cover letter.");
      return;
    }

    if (coverLetter.trim().length < 20) {
      setError("Cover letter should contain at least 20 characters.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter.trim());

      const response = await api.post(`/jobs/${id}/apply`, formData);

      console.log("Application submitted:", response.data);

      setSuccess(true);
    } catch (error) {
      const apiError = getApiError(error);

      setError(
        apiError?.general ||
          apiError?.message ||
          "Unable to submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto max-w-5xl px-3 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
          <div className="mb-5 h-5 w-28 animate-pulse rounded bg-[#E6EFF8] sm:mb-6" />

          <div className="h-40 animate-pulse rounded-2xl bg-white sm:h-32" />

          <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[1fr_300px]">
            <div className="h-125 animate-pulse rounded-2xl bg-white sm:h-137.5" />

            <div className="h-72 animate-pulse rounded-2xl bg-white" />
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // ERROR / JOB NOT FOUND
  if (!job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-[#E6EFF8] bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8]">
              <BriefcaseBusiness size={25} className="text-[#0859A8]" />
            </div>

            <h1 className="mt-4 text-xl font-semibold text-[#25364A]">
              Unable to load job
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#68798A]">
              {error || "This job could not be found."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#064A8D] sm:w-auto"
            >
              <ArrowLeft size={17} />
              Back to Jobs
            </button>
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // ============================================================
  // COMPANY INFORMATION
  // ============================================================

  const companyName =
    job?.company?.name ||
    job?.company?.companyName ||
    job?.company?.title ||
    job?.companyName ||
    job?.company?.company?.name ||
    "Company";

  const companyLogo = getLogoSrc(
    job?.company?.logo || job?.companyLogo || job?.company?.company?.logo,
  );

  const companyId =
    job?.company?._id ||
    job?.company?.id ||
    job?.companyId ||
    (typeof job?.company === "string" ? job.company : null);

  // SUCCESS UI
  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-[#E6EFF8] bg-white p-5 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <CheckCircle2 size={34} className="text-green-600" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#25364A]">
              Application Submitted
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#68798A]">
              Your application for{" "}
              <span className="font-semibold text-[#25364A]">{job.title}</span>{" "}
              at{" "}
              <span className="font-semibold text-[#0859A8]">
                {companyName}
              </span>{" "}
              has been submitted successfully.
            </p>

            <div className="mt-6 rounded-xl bg-[#F8FAFC] p-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6EFF8] bg-[#EEF6FB]">
                  {companyLogo ? (
                    <img
                      src={companyLogo}
                      alt={companyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 size={22} className="text-[#0859A8]" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#25364A]">
                    {companyName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-[#68798A]">
                    {job.title}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => navigate("/jobs")}
                className="w-full rounded-lg border border-[#DCE3E8] px-5 py-2.5 text-sm font-medium text-[#25364A] transition hover:bg-[#F3F2F0] sm:w-auto"
              >
                Browse More Jobs
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard/jobseeker")}
                className="w-full rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#064A8D] sm:w-auto"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MainNavbar />

      <main className="mx-auto max-w-5xl px-3 pb-10 pt-24 sm:px-6 sm:pb-12 sm:pt-28 lg:px-8">
        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate(`/jobs/${id}`)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#68798A] transition hover:text-[#0859A8] sm:mb-5"
        >
          <ArrowLeft size={17} />
          Back to Job
        </button>

        {/* JOB / COMPANY HEADER */}

        <section className="rounded-2xl border border-[#E6EFF8] bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* COMPANY */}

            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6EFF8] bg-[#EEF6FB] sm:h-16 sm:w-16">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2
                    size={24}
                    className="text-[#0859A8] sm:h-6.75 sm:w-6.75"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#68798A] sm:text-xs">
                  Applying to
                </p>

                <h1 className="mt-1 wrap-break-words text-base font-bold text-[#25364A] sm:text-xl">
                  {companyName}
                </h1>

                <div className="mt-1 flex flex-col gap-1 text-xs text-[#68798A] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <BriefcaseBusiness
                      size={14}
                      className="shrink-0 text-[#0859A8]"
                    />
                    <span className="truncate">{job.title}</span>
                  </span>

                  {job.location && (
                    <span className="inline-flex min-w-0 items-center gap-1.5">
                      <MapPin size={14} className="shrink-0 text-[#0859A8]" />
                      <span className="wrap-break-words">{job.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* JOB TAGS */}

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {job.jobType && (
                <span className="rounded-full bg-[#E6EFF8] px-3 py-1.5 text-xs font-medium text-[#0859A8]">
                  {job.jobType}
                </span>
              )}

              {job.workMode && (
                <span className="rounded-full bg-[#F3F2F0] px-3 py-1.5 text-xs font-medium text-[#25364A]">
                  {job.workMode}
                </span>
              )}

              {job.category && (
                <span className="rounded-full bg-[#EEF6FB] px-3 py-1.5 text-xs font-medium text-[#35698D]">
                  {job.category}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}

        <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[1fr_300px]">
          {/* APPLICATION FORM */}

          <section className="min-w-0 rounded-2xl border border-[#E6EFF8] bg-white shadow-sm">
            <div className="border-b border-[#E6EFF8] px-4 py-5 sm:px-7">
              <h2 className="text-lg font-bold text-[#25364A] sm:text-xl">
                Apply for this position
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-[#68798A]">
                Submit your resume and cover letter to apply for this job.
              </p>
            </div>

            {error && (
              <div className="mx-4 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600 sm:mx-7">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 px-4 py-5 sm:px-7 sm:py-6"
            >
              {/* RESUME */}

              <div>
                <label
                  htmlFor="resume"
                  className="mb-2 block text-sm font-semibold text-[#25364A]"
                >
                  Resume
                  <span className="ml-1 text-red-500">*</span>
                </label>

                {!resume ? (
                  <label
                    htmlFor="resume"
                    className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DCE3E8] bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#0859A8] hover:bg-[#EEF6FB] sm:px-5 sm:py-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6EFF8]">
                      <Upload size={21} className="text-[#0859A8]" />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[#25364A]">
                      Upload your resume
                    </p>

                    <p className="mt-1 text-xs text-[#68798A]">
                      PDF, DOC, or DOCX • Maximum 5MB
                    </p>

                    <span className="mt-4 rounded-lg border border-[#0859A8] px-4 py-2 text-xs font-medium text-[#0859A8] transition group-hover:bg-white">
                      Choose File
                    </span>

                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex flex-col gap-3 rounded-xl border border-[#E6EFF8] bg-[#EEF6FB] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                        <FileText size={20} className="text-[#0859A8]" />
                      </div>

                      <div className="min-w-0">
                        <p className="break-all text-sm font-medium text-[#25364A] sm:truncate">
                          {resume.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#68798A]">
                          {(resume.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveResume}
                      className="flex h-8 w-8 shrink-0 self-end items-center justify-center rounded-lg text-[#68798A] transition hover:bg-white hover:text-red-500 sm:self-auto"
                      title="Remove resume"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* COVER LETTER */}

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="coverLetter"
                    className="block text-sm font-semibold text-[#25364A]"
                  >
                    Cover Letter
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <span className="shrink-0 text-xs text-[#68798A]">
                    {coverLetter.length}/5000
                  </span>
                </div>

                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(event) => {
                    setCoverLetter(event.target.value);
                    setError(null);
                  }}
                  maxLength={5000}
                  rows={9}
                  placeholder="Tell the recruiter why you are a good fit for this position..."
                  className="w-full resize-none rounded-xl border border-[#DCE3E8] bg-white px-3.5 py-3 text-sm leading-6 text-[#25364A] outline-none transition placeholder:text-[#9AA7B3] focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4"
                />

                <p className="mt-2 text-xs leading-5 text-[#68798A]">
                  Mention your relevant experience, skills, and why you are
                  interested in working at {companyName}.
                </p>
              </div>

              {/* NOTE */}

              <div className="rounded-xl border border-[#E6EFF8] bg-[#F8FAFC] p-3.5 sm:p-4">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#0859A8]"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#25364A]">
                      Before submitting
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#68798A]">
                      Make sure your resume is up to date and your cover letter
                      is tailored to this position.
                    </p>
                  </div>
                </div>
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-[#E6EFF8] pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/jobs/${id}`)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-[#DCE3E8] px-5 py-3 text-sm font-medium text-[#25364A] transition hover:bg-[#F3F2F0] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#064A8D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={17} />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* JOB SUMMARY */}

          <aside className="h-fit min-w-0 rounded-2xl border border-[#E6EFF8] bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-28">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#68798A]">
              Job Summary
            </p>

            <h3 className="mt-2 wrap-break-words text-lg font-bold leading-6 text-[#25364A]">
              {job.title}
            </h3>

            {/* COMPANY */}

            <div className="mt-5 flex items-center gap-3 border-b border-[#E6EFF8] pb-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6EFF8] bg-[#EEF6FB]">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt={companyName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 size={22} className="text-[#0859A8]" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#68798A]">Posted by</p>

                <p className="truncate text-sm font-semibold text-[#25364A]">
                  {companyName}
                </p>
              </div>
            </div>

            {/* JOB DETAILS */}

            <div className="mt-5 space-y-4">
              {job.location && (
                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#0859A8]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-[#68798A]">Location</p>

                    <p className="mt-0.5 wrap-break-words text-sm font-medium text-[#25364A]">
                      {job.location}
                    </p>
                  </div>
                </div>
              )}

              {job.workMode && (
                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    size={17}
                    className="mt-0.5 shrink-0 text-[#0859A8]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-[#68798A]">Work Mode</p>

                    <p className="mt-0.5 wrap-break-words text-sm font-medium text-[#25364A]">
                      {job.workMode}
                    </p>
                  </div>
                </div>
              )}

              {job.jobType && (
                <div className="flex items-start gap-3">
                  <Clock3
                    size={17}
                    className="mt-0.5 shrink-0 text-[#0859A8]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-[#68798A]">Job Type</p>

                    <p className="mt-0.5 wrap-break-words text-sm font-medium text-[#25364A]">
                      {job.jobType}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* COMPANY BUTTON */}

            {companyId && (
              <button
                type="button"
                onClick={() => navigate(`/companies/${companyId}`)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-[#0859A8] px-4 py-2.5 text-sm font-medium text-[#0859A8] transition hover:bg-[#EEF6FB]"
              >
                <Building2 size={16} />
                View Company
              </button>
            )}
          </aside>
        </div>
      </main>

      <MainFooter />
    </div>
  );
};

export default ApplyJob;

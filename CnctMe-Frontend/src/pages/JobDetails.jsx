import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Flag,
  MapPin,
  Share2,
  Users,
  Building2,
  Wallet,
  GraduationCap,
} from "lucide-react";

import api from "../api/axios";
import getApiError from "../utils/apiError";
import getLogoSrc from "../utils/logo";

import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";
import ReportModal from "../components/report/ReportModel";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ============================================================
  // AUTH USER
  // ============================================================

  const user = useSelector((state) => state.auth?.user);

  const isJobseeker = user?.role === "jobseeker";

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);

  // FETCH JOB DETAILS
  useEffect(() => {
    const fetchJobDetails = async () => {
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
            "Unable to load job details.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // CHECK SAVED JOB
  useEffect(() => {
    const checkSavedJob = async () => {
      // Only jobseekers can save jobs
      if (!id || !isJobseeker) {
        setSaved(false);
        return;
      }

      try {
        const response = await api.get("/saved-jobs");

        const savedJobs = response.data.savedJobs || [];

        const isSaved = savedJobs.some((savedJob) => {
          const savedJobId =
            savedJob?.job?._id ||
            savedJob?.job?.id ||
            savedJob?.job ||
            savedJob?._id;

          return String(savedJobId) === String(id);
        });

        setSaved(isSaved);
      } catch (error) {
        getApiError(error);
      }
    };

    checkSavedJob();
  }, [id, isJobseeker]);

  // APPLY
  const handleApply = () => {
    if (!job?._id) return;

    navigate(`/jobs/${job._id}/apply`);
  };

  // SAVE / UNSAVE
  const handleSave = async () => {
    // Only jobseekers can save jobs
    if (!isJobseeker || !job?._id || saving) return;

    try {
      setSaving(true);

      if (saved) {
        await api.delete(`/jobs/${job._id}/save`);
        setSaved(false);
      } else {
        await api.post(`/jobs/${job._id}/save`);
        setSaved(true);
      }
    } catch (error) {
      const apiError = getApiError(error);

      alert(
        apiError?.general || apiError?.message || "Unable to update saved job.",
      );
    } finally {
      setSaving(false);
    }
  };

  // SHARE
  const handleShare = async () => {
    try {
      const shareData = {
        title: job?.title || "Job Opportunity",
        text: `Check out this job opportunity: ${job?.title || ""}`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);

        alert("Job link copied to clipboard.");
      }
    } catch (error) {
      getApiError(error);
    }
  };

  // REPORT JOB
  const handleReportJob = () => {
    if (!isJobseeker || !job?._id) return;

    setShowReportModal(true);
  };

  // VIEW COMPANY
  const handleViewCompany = () => {
    const companyId =
      job?.company?._id ||
      job?.company?.id ||
      job?.companyId ||
      (typeof job?.company === "string" ? job.company : null);

    if (!companyId) return;

    navigate(`/companies/${companyId}`);
  };

  // FORMAT SALARY
  const formatSalary = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    return new Intl.NumberFormat("en-PK").format(value);
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Recently";

    const jobDate = new Date(date);

    if (Number.isNaN(jobDate.getTime())) {
      return "Recently";
    }

    return jobDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // TIME AGO
  const getTimeAgo = (date) => {
    if (!date) return "Recently";

    const createdAt = new Date(date);

    if (Number.isNaN(createdAt.getTime())) {
      return "Recently";
    }

    const now = new Date();
    const difference = now - createdAt;

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return formatDate(date);
  };

  // EXPERIENCE
  const getExperience = () => {
    const min = job?.experienceMin;
    const max = job?.experienceMax;

    if (
      (min === undefined || min === null || min === "") &&
      (max === undefined || max === null || max === "")
    ) {
      return "Not specified";
    }

    if (
      min !== undefined &&
      min !== null &&
      min !== "" &&
      max !== undefined &&
      max !== null &&
      max !== ""
    ) {
      return `${min} - ${max} years`;
    }

    if (min !== undefined && min !== null && min !== "") {
      return `${min}+ years`;
    }

    return `Up to ${max} years`;
  };

  // SALARY
  const getSalary = () => {
    const min = formatSalary(job?.salaryMin);
    const max = formatSalary(job?.salaryMax);

    if (min && max) {
      return `PKR ${min} - ${max}`;
    }

    if (min) {
      return `PKR ${min}+`;
    }

    if (max) {
      return `Up to PKR ${max}`;
    }

    return "Salary not specified";
  };

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

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
          <div className="mb-6 h-5 w-28 animate-pulse rounded bg-[#E6EFF8]" />

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#E6EFF8] bg-white p-6 shadow-sm">
                <div className="flex gap-4">
                  <div className="h-16 w-16 animate-pulse rounded-full bg-[#E6EFF8]" />

                  <div className="flex-1">
                    <div className="mb-3 h-6 w-2/3 animate-pulse rounded bg-[#E6EFF8]" />

                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#E6EFF8]" />
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <div className="h-16 animate-pulse rounded-xl bg-[#F3F2F0]" />
                  <div className="h-16 animate-pulse rounded-xl bg-[#F3F2F0]" />
                  <div className="h-16 animate-pulse rounded-xl bg-[#F3F2F0]" />
                  <div className="h-16 animate-pulse rounded-xl bg-[#F3F2F0]" />
                </div>
              </div>

              <div className="rounded-2xl border border-[#E6EFF8] bg-white p-6 shadow-sm">
                <div className="mb-4 h-5 w-40 animate-pulse rounded bg-[#E6EFF8]" />

                <div className="space-y-3">
                  <div className="h-4 animate-pulse rounded bg-[#F3F2F0]" />
                  <div className="h-4 animate-pulse rounded bg-[#F3F2F0]" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-[#F3F2F0]" />
                </div>
              </div>
            </div>

            <div className="h-64 animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // ERROR
  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto flex min-h-[65vh] max-w-6xl items-center justify-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-2xl border border-[#E6EFF8] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8]">
              <BriefcaseBusiness size={25} className="text-[#0859A8]" />
            </div>

            <h1 className="text-xl font-semibold text-[#25364A]">
              Job not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#68798A]">
              {error ||
                "The job you are looking for may have been removed or is no longer available."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/jobs")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#064A8D]"
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
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MainNavbar />

      <main className="mx-auto max-w-6xl px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        {/* BACK */}

        <button
          type="button"
          onClick={() => navigate("/jobs")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#68798A] transition hover:text-[#0859A8]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* ===================================================
              LEFT
          =================================================== */}

          <div className="space-y-5">
            {/* JOB HEADER */}

            <section className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-4">
                  {/* LOGO */}

                  <div className="flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6EFF8] bg-[#EEF6FB]">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 size={30} className="text-[#0859A8]" />
                    )}
                  </div>

                  {/* TITLE */}

                  <div className="min-w-0">
                    {job.category && (
                      <span className="mb-2 inline-flex rounded-full bg-[#E6EFF8] px-2.5 py-1 text-xs font-medium text-[#0859A8]">
                        {job.category}
                      </span>
                    )}

                    <h1 className="text-2xl font-bold leading-tight text-[#25364A]">
                      {job.title}
                    </h1>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-[#25364A]">
                        {companyName}
                      </span>

                      {job.company?.verified && (
                        <>
                          <span className="text-[#DCE3E8]">•</span>

                          <span className="inline-flex items-center gap-1 text-green-600">
                            <CheckCircle2 size={14} />
                            Verified
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex shrink-0 gap-2">
                  {/* SAVE ICON */}

                  {isJobseeker && (
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      title={
                        saving
                          ? "Saving job..."
                          : saved
                            ? "Remove from saved jobs"
                            : "Save job"
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                        saved
                          ? "border-green-200 bg-green-50 text-green-600"
                          : "border-[#DCE3E8] bg-white text-[#68798A] hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      {saving ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                      ) : (
                        <Bookmark
                          size={18}
                          fill={saved ? "currentColor" : "none"}
                        />
                      )}
                    </button>
                  )}

                  {/* SHARE */}

                  <button
                    type="button"
                    onClick={handleShare}
                    title="Share job"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE3E8] bg-white text-[#68798A] transition hover:border-[#0859A8] hover:bg-[#EEF6FB] hover:text-[#0859A8]"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* JOB META */}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {/* LOCATION */}

                <div className="flex items-center gap-3 rounded-xl bg-[#F3F2F0] p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                    <MapPin size={17} className="text-[#0859A8]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-[#68798A]">Location</p>

                    <p className="mt-0.5 truncate text-sm font-medium text-[#25364A]">
                      {job.location || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* JOB TYPE */}

                <div className="flex items-center gap-3 rounded-xl bg-[#F3F2F0] p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                    <BriefcaseBusiness size={17} className="text-[#0859A8]" />
                  </div>

                  <div>
                    <p className="text-xs text-[#68798A]">Job Type</p>

                    <p className="mt-0.5 text-sm font-medium text-[#25364A]">
                      {job.jobType || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* WORK MODE */}

                <div className="flex items-center gap-3 rounded-xl bg-[#F3F2F0] p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                    <Users size={17} className="text-[#0859A8]" />
                  </div>

                  <div>
                    <p className="text-xs text-[#68798A]">Work Mode</p>

                    <p className="mt-0.5 text-sm font-medium text-[#25364A]">
                      {job.workMode || "Not specified"}
                    </p>
                  </div>
                </div>

                {/* EXPERIENCE */}

                <div className="flex items-center gap-3 rounded-xl bg-[#F3F2F0] p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
                    <GraduationCap size={17} className="text-[#0859A8]" />
                  </div>

                  <div>
                    <p className="text-xs text-[#68798A]">Experience</p>

                    <p className="mt-0.5 text-sm font-medium text-[#25364A]">
                      {getExperience()}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* DESCRIPTION */}

            <section className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[#25364A]">
                Job Description
              </h2>

              <div className="mt-3 whitespace-pre-line text-sm leading-7 text-[#68798A]">
                {job.description || "No description provided."}
              </div>
            </section>

            {/* SKILLS */}

            {job.skills &&
              ((Array.isArray(job.skills) && job.skills.length > 0) ||
                (typeof job.skills === "string" && job.skills.trim())) && (
                <section className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm sm:p-6">
                  <h2 className="text-lg font-semibold text-[#25364A]">
                    Required Skills
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(Array.isArray(job.skills)
                      ? job.skills
                      : job.skills.split(",")
                    ).map((skill, index) => {
                      const cleanSkill =
                        typeof skill === "string" ? skill.trim() : skill;

                      if (!cleanSkill) return null;

                      return (
                        <span
                          key={`${cleanSkill}-${index}`}
                          className="rounded-lg border border-[#E6EFF8] bg-[#EEF6FB] px-3 py-1.5 text-sm font-medium text-[#0859A8]"
                        >
                          {cleanSkill}
                        </span>
                      );
                    })}
                  </div>
                </section>
              )}

            {/* JOB INFORMATION */}

            <section className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-[#25364A]">
                Job Information
              </h2>

              <div className="mt-3 divide-y divide-[#E6EFF8]">
                <div className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <Wallet size={17} className="text-[#0859A8]" />

                    <span className="text-sm text-[#68798A]">Salary</span>
                  </div>

                  <span className="text-right text-sm font-medium text-[#25364A]">
                    {getSalary()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <Clock3 size={17} className="text-[#0859A8]" />

                    <span className="text-sm text-[#68798A]">Job Type</span>
                  </div>

                  <span className="text-sm font-medium text-[#25364A]">
                    {job.jobType || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 py-3">
                  <div className="flex items-center gap-3">
                    <CalendarDays size={17} className="text-[#0859A8]" />

                    <span className="text-sm text-[#68798A]">Posted</span>
                  </div>

                  <span className="text-sm font-medium text-[#25364A]">
                    {getTimeAgo(job.createdAt)}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          =================================================== */}

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              {/* APPLY CARD */}

              <section className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-[#68798A]">
                  Salary
                </p>

                <p className="mt-1 text-xl font-bold text-[#25364A]">
                  {getSalary()}
                </p>

                <p className="mt-1 text-xs text-[#68798A]">
                  {job.workMode || "Work mode not specified"}
                </p>

                <button
                  type="button"
                  onClick={handleApply}
                  className="mt-5 flex w-full items-center justify-center rounded-lg bg-[#0859A8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064A8D]"
                >
                  Apply Now
                </button>

                {/* SAVE JOB */}

                {isJobseeker && (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition ${
                      saved
                        ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                        : "border-[#DCE3E8] bg-white text-[#25364A] hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Bookmark
                          size={17}
                          fill={saved ? "currentColor" : "none"}
                        />

                        {saved ? "Saved" : "Save Job"}
                      </>
                    )}
                  </button>
                )}

                {/* SHARE */}

                <button
                  type="button"
                  onClick={handleShare}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#DCE3E8] bg-white px-5 py-3 text-sm font-medium text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#EEF6FB] hover:text-[#0859A8]"
                >
                  <Share2 size={17} />
                  Share Job
                </button>

                {/* REPORT JOB */}

                {isJobseeker && (
                  <button
                    type="button"
                    onClick={handleReportJob}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Flag size={17} />
                    Report Job
                  </button>
                )}
              </section>

              {/* COMPANY */}

              <section className="rounded-2xl border border-[#E6EFF8] bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-[#25364A]">
                  About the Company
                </h2>

                <div className="mt-4 flex items-center gap-3">
                  {/* BIGGER COMPANY LOGO */}

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#E6EFF8] bg-[#EEF6FB]">
                    {companyLogo ? (
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 size={27} className="text-[#0859A8]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#25364A]">
                      {companyName}
                    </p>

                    {job.company?.industry && (
                      <p className="mt-0.5 truncate text-xs text-[#68798A]">
                        {job.company.industry}
                      </p>
                    )}
                  </div>
                </div>

                {job.company?.description && (
                  <p className="mt-4 line-clamp-4 text-sm leading-6 text-[#68798A]">
                    {job.company.description}
                  </p>
                )}

                {companyId && (
                  <button
                    type="button"
                    onClick={handleViewCompany}
                    className="mt-4 flex w-full items-center justify-center rounded-lg border border-[#0859A8] px-4 py-2.5 text-sm font-medium text-[#0859A8] transition hover:bg-[#EEF6FB]"
                  >
                    View Company
                  </button>
                )}
              </section>

              {/* POSTED */}

              <div className="rounded-2xl border border-[#E6EFF8] bg-[#EEF6FB] p-4">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-0.5 shrink-0 text-[#0859A8]"
                  />

                  <div>
                    <p className="text-sm font-medium text-[#25364A]">
                      Posted on
                    </p>

                    <p className="mt-1 text-sm text-[#68798A]">
                      {formatDate(job.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* REPORT MODAL */}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        job={job}
        company={job?.company}
        title="Report Job"
      />

      <MainFooter />
    </div>
  );
};

export default JobDetails;

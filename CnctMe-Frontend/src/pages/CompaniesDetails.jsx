import { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  Globe2,
  MapPin,
  Users,
  Factory,
  ArrowUpRight,
  X,
  BriefcaseBusiness,
  MapPinned,
  Clock3,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Flag,
} from "lucide-react";

import api from "../api/axios";
import getApiError from "../utils/apiError";
import getLogoSrc from "../utils/logo";
import getWebsiteUrl from "../utils/website";

import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";
import ReportModal from "../components/report/ReportModel";

const CompaniesDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLogoModal, setShowLogoModal] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);

  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");

  // FETCH COMPANY
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        if (!companyId) {
          setError("Company ID is missing.");
          setLoading(false);
          return;
        }

        const response = await api.get(`/companies/${companyId}`);

        console.log("COMPANY RESPONSE:", response.data);
        console.log("COMPANY:", response.data.companyInfo);
        console.log("COMPANY LOGO:", response.data.companyInfo?.logo);

        setCompany(response.data.companyInfo || null);
      } catch (error) {
        console.error("Error fetching company:", error);

        const apiError = getApiError(error);

        setError(
          typeof apiError === "string"
            ? apiError
            : apiError?.general || "Unable to load company.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId]);

  useEffect(() => {
    if (!showLogoModal) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowLogoModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showLogoModal]);

  // FETCH COMPANY JOBS
  const fetchCompanyJobs = async () => {
    if (!company?._id) {
      return;
    }

    try {
      setJobsLoading(true);
      setJobsError("");

      const response = await api.get("/jobs", {
        params: {
          company: company._id,
        },
      });

      console.log("COMPANY JOBS RESPONSE:", response.data);

      const fetchedJobs = Array.isArray(response.data?.allJobs)
        ? response.data.allJobs
        : [];

      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching company jobs:", error);

      const apiError = getApiError(error);

      setJobsError(
        typeof apiError === "string"
          ? apiError
          : apiError?.general || "Unable to load available jobs.",
      );

      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // TOGGLE JOBS
  const handleToggleJobs = async () => {
    if (showJobs) {
      setShowJobs(false);
      return;
    }

    setShowJobs(true);

    if (jobs.length === 0) {
      await fetchCompanyJobs();
    }
  };

  const logoSrc = company?.logo ? getLogoSrc(company.logo) : null;

  const websiteUrl = company?.website ? getWebsiteUrl(company.website) : null;

  const joinedDate = company?.createdAt
    ? new Date(company.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not available";

  // ============================================================
  // JOB HELPERS
  // ============================================================

  const formatSalary = (job) => {
    const min = job?.salaryMin;
    const max = job?.salaryMax;

    if (
      (min === undefined || min === null || min === "") &&
      (max === undefined || max === null || max === "")
    ) {
      return null;
    }

    const formattedMin =
      min !== undefined && min !== null && min !== ""
        ? Number(min).toLocaleString()
        : null;

    const formattedMax =
      max !== undefined && max !== null && max !== ""
        ? Number(max).toLocaleString()
        : null;

    if (formattedMin && formattedMax) {
      return `Rs ${formattedMin} - Rs ${formattedMax}`;
    }

    if (formattedMin) {
      return `Rs ${formattedMin}`;
    }

    if (formattedMax) {
      return `Rs ${formattedMax}`;
    }

    return null;
  };

  const formatExperience = (job) => {
    const min = job?.experienceMin;
    const max = job?.experienceMax;

    if (
      (min === undefined || min === null || min === "") &&
      (max === undefined || max === null || max === "")
    ) {
      return null;
    }

    if (
      min !== undefined &&
      min !== null &&
      min !== "" &&
      max !== undefined &&
      max !== null &&
      max !== ""
    ) {
      if (Number(min) === Number(max)) {
        return `${min} ${Number(min) === 1 ? "year" : "years"}`;
      }

      return `${min}-${max} years`;
    }

    if (min !== undefined && min !== null && min !== "") {
      return `${min}+ years`;
    }

    if (max !== undefined && max !== null && max !== "") {
      return `Up to ${max} years`;
    }

    return null;
  };

  const formatJobType = (jobType) => {
    if (!jobType) {
      return "";
    }

    return jobType
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatWorkMode = (workMode) => {
    if (!workMode) {
      return "";
    }

    return workMode
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getJobId = (job) => {
    return job?._id || job?.id;
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto max-w-5xl px-3 pb-10 pt-24 sm:px-5 sm:pb-12 md:px-6 lg:px-10">
          {/* PAGE HEADER SKELETON */}

          <div className="mb-6 flex flex-col gap-4 sm:mb-7">
            <div className="h-9 w-28 animate-pulse rounded-lg bg-[#E6EFF8]" />

            <div className="h-3 w-72 max-w-full animate-pulse rounded bg-[#EEF2F6]" />
          </div>

          {/* MAIN CARD SKELETON */}

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            {/* HERO */}

            <div className="relative overflow-hidden bg-[#E6EFF8]">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/5" />

              <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#0859A8]/5" />

              <div className="relative px-4 py-7 sm:px-8 sm:py-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                  <div className="h-20 w-20 shrink-0 animate-pulse rounded-full border-4 border-white bg-[#D5E1EB] shadow-lg sm:h-24 sm:w-24" />

                  <div className="min-w-0 flex-1">
                    <div className="h-7 w-52 max-w-full animate-pulse rounded-md bg-[#D5E1EB] sm:h-8" />

                    <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded-lg bg-white/70" />
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT */}

            <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-[#E2E8F0]" />

                <div>
                  <div className="h-5 w-20 animate-pulse rounded bg-[#E2E8F0]" />

                  <div className="mt-2 h-3 w-48 animate-pulse rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-5">
                <div className="space-y-3">
                  <div className="h-3 w-full animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="h-3 w-[94%] animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="h-3 w-[78%] animate-pulse rounded bg-[#E2E8F0]" />
                  <div className="h-3 w-[58%] animate-pulse rounded bg-[#EEF2F6]" />
                </div>
              </div>
            </div>

            {/* DETAILS */}

            <div className="bg-[#FBFCFD] p-4 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-[#E2E8F0]" />

                <div>
                  <div className="h-5 w-36 animate-pulse rounded bg-[#E2E8F0]" />

                  <div className="mt-2 h-3 w-60 animate-pulse rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-[#D7E4ED] bg-white p-5 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-20 animate-pulse rounded bg-[#D5E1EB]" />

                        <div className="mt-2.5 h-4 w-32 max-w-full animate-pulse rounded bg-[#E2E8F0]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-[#DCE3E8] bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <Building2 className="h-7 w-7 text-red-500" />
            </div>

            <h1 className="text-xl font-bold text-[#25364A]">
              Unable to load company
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#697586]">{error}</p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // COMPANY NOT FOUND
  if (!company) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <MainNavbar />

        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 pb-12 pt-24 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-2xl border border-[#DCE3E8] bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6EFF8]">
              <Building2 className="h-7 w-7 text-[#0859A8]" />
            </div>

            <h1 className="text-xl font-bold text-[#25364A]">
              Company not found
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#697586]">
              The company you are looking for does not exist.
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
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
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <MainNavbar />

      <main className="mx-auto min-w-0 max-w-5xl px-3 pb-10 pt-24 sm:px-5 sm:pb-12 md:px-6 lg:px-10">
        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#68798A] transition hover:text-[#0859A8]"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0859A8]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs sm:tracking-[0.18em]">
                Company Profile
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
              {company.companyName}
            </h1>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#6B7A89] sm:text-sm">
              Explore company information, details, and available jobs.
            </p>
          </div>
        </div>

        {/* ==================================================
            COMPANY PROFILE CARD
        ================================================== */}

        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
          {/* ==================================================
              COMPANY HERO
          ================================================== */}

          <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
            {/* DECORATIVE SHAPES */}

            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/10" />

            <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#0859A8]/10" />

            <div className="relative px-4 py-7 sm:px-8 sm:py-8">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                {/* LOGO */}

                <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-24 sm:w-24">
                    {logoSrc ? (
                      <button
                        type="button"
                        onClick={() => setShowLogoModal(true)}
                        className="group relative h-full w-full cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-[#0859A8] focus:ring-offset-2"
                        aria-label="View company logo"
                      >
                        <img
                          src={logoSrc}
                          alt={`${company.companyName} logo`}
                          className="h-full w-full rounded-full object-cover transition duration-200 group-hover:brightness-90"
                        />

                        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#25364A]/0 text-xs font-semibold text-white opacity-0 transition duration-200 group-hover:bg-[#25364A]/35 group-hover:opacity-100">
                          View
                        </span>
                      </button>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2
                          size={28}
                          className="text-[#526170] sm:h-8 sm:w-8"
                        />
                      </div>
                    )}
                  </div>

                  {/* COMPANY INFO */}

                  <div className="min-w-0 max-w-full">
                    <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                      <h2 className="wrap-break-words text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
                        {company.companyName}
                      </h2>

                      {company.industry && (
                        <span className="max-w-full rounded-full bg-[#0859A8] px-3 py-1 text-[11px] font-bold leading-4 text-white shadow-sm sm:text-xs">
                          {company.industry}
                        </span>
                      )}
                    </div>

                    {company.location && (
                      <div className="mt-3 inline-flex max-w-full items-start gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-[#526170]">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-[#526170]"
                        />

                        <span className="wrap-break-words">
                          {company.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* REPORT COMPANY */}

                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E2CFCF] bg-white/90 px-4 py-2.5 text-xs font-semibold text-[#B42318] shadow-sm transition hover:border-[#C0392B] hover:bg-[#FFF5F5] sm:w-auto"
                >
                  <Flag size={15} strokeWidth={2} />
                  Report Company
                </button>
              </div>
            </div>
          </div>

          {/* ABOUT */}

          <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                <Building2 size={18} className="text-[#526170]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                  About
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Company overview and introduction.
                </p>
              </div>
            </div>

            <div className="min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD]">
              <div className="px-4 py-4 sm:px-5 sm:py-5">
                {company.description ? (
                  <p className="whitespace-pre-line wrap-break-words text-xs leading-6 text-[#526170] sm:text-sm sm:leading-7">
                    {company.description}
                  </p>
                ) : (
                  <p className="text-xs italic text-[#8998A6] sm:text-sm">
                    No company description has been added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* COMPANY DETAILS */}

          <div className="min-w-0 bg-[#FBFCFD] p-4 sm:p-8">
            <div className="mb-5 flex items-center gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                <Factory size={18} className="text-[#526170]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Company Details
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Key information about this organization.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
              {/* WEBSITE */}

              {company.website && (
                <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                      <Globe2 size={17} className="text-[#526170]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                        Website
                      </p>

                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex max-w-full items-start gap-1 break-all text-xs font-semibold leading-5 text-[#25364A] transition hover:text-[#0859A8] hover:underline sm:text-sm"
                      >
                        <span className="break-all">{company.website}</span>

                        <ArrowUpRight
                          size={14}
                          className="mt-0.5 shrink-0 text-[#526170]"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATION */}

              {company.location && (
                <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                      <MapPin size={17} className="text-[#526170]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                        Location
                      </p>

                      <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                        {company.location}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* INDUSTRY */}

              {company.industry && (
                <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                      <Factory size={17} className="text-[#526170]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                        Industry
                      </p>

                      <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                        {company.industry}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPANY SIZE */}

              {company.companySize && (
                <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                      <Users size={17} className="text-[#526170]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                        Company Size
                      </p>

                      <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                        {company.companySize}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* JOINED CnctMe*/}

              <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                    <BriefcaseBusiness size={17} className="text-[#526170]" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                      Joined HireHub
                    </p>

                    <p className="mt-1.5 wrap-break-words text-xs font-semibold leading-5 text-[#25364A] sm:text-sm">
                      {joinedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              VIEW JOBS
          ================================================== */}

          <div className="border-t border-[#DDE7EF] bg-white p-4 sm:p-6">
            <button
              type="button"
              onClick={handleToggleJobs}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md"
            >
              <BriefcaseBusiness size={17} className="shrink-0" />

              {showJobs
                ? "Hide Available Jobs"
                : `View Jobs at ${company.companyName}`}

              {showJobs ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
            </button>
          </div>

          {/* ==================================================
              AVAILABLE JOBS
          ================================================== */}

          {showJobs && (
            <div className="border-t border-[#DDE7EF] bg-[#F8FAFC] p-4 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8]">
                    <BriefcaseBusiness size={18} className="text-[#0859A8]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                      Available Jobs
                    </h3>

                    <p className="mt-0.5 text-xs text-[#8998A6]">
                      Current job openings at {company.companyName}.
                    </p>
                  </div>
                </div>

                {!jobsLoading && !jobsError && (
                  <span className="shrink-0 rounded-full bg-[#E6EFF8] px-3 py-1 text-xs font-bold text-[#0859A8]">
                    {jobs.length} {jobs.length === 1 ? "Opening" : "Openings"}
                  </span>
                )}
              </div>

              {/* ==================================================
                  JOB SKELETON LOADING
              ================================================== */}

              {jobsLoading && (
                <div className="grid min-w-0 grid-cols-1 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5"
                    >
                      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* JOB INFO SKELETON */}

                        <div className="min-w-0 flex-1">
                          {/* TITLE + JOB TYPE */}

                          <div className="flex min-w-0 flex-wrap items-center gap-2">
                            <div className="h-5 w-48 max-w-full animate-pulse rounded-md bg-[#E2E8F0] sm:h-6" />

                            <div className="h-6 w-20 animate-pulse rounded-full bg-[#E6EFF8]" />
                          </div>

                          {/* JOB META */}

                          <div className="mt-3 flex min-w-0 flex-wrap gap-x-4 gap-y-2">
                            <div className="flex items-center gap-1.5">
                              <div className="h-3.5 w-3.5 animate-pulse rounded bg-[#E2E8F0]" />
                              <div className="h-3 w-24 animate-pulse rounded bg-[#EEF2F6]" />
                            </div>

                            <div className="flex items-center gap-1.5">
                              <div className="h-3.5 w-3.5 animate-pulse rounded bg-[#E2E8F0]" />
                              <div className="h-3 w-20 animate-pulse rounded bg-[#EEF2F6]" />
                            </div>

                            <div className="flex items-center gap-1.5">
                              <div className="h-3.5 w-3.5 animate-pulse rounded bg-[#E2E8F0]" />
                              <div className="h-3 w-20 animate-pulse rounded bg-[#EEF2F6]" />
                            </div>

                            <div className="flex items-center gap-1.5">
                              <div className="h-3.5 w-3.5 animate-pulse rounded bg-[#E2E8F0]" />
                              <div className="h-3 w-28 animate-pulse rounded bg-[#EEF2F6]" />
                            </div>
                          </div>

                          {/* CATEGORY */}

                          <div className="mt-3">
                            <div className="h-6 w-24 animate-pulse rounded-md bg-[#F1F4F7]" />
                          </div>

                          {/* SKILLS */}

                          <div className="mt-3 flex flex-wrap gap-2">
                            <div className="h-6 w-16 animate-pulse rounded-md bg-[#F4F7FA]" />
                            <div className="h-6 w-20 animate-pulse rounded-md bg-[#F4F7FA]" />
                            <div className="h-6 w-14 animate-pulse rounded-md bg-[#F4F7FA]" />
                            <div className="h-6 w-18 animate-pulse rounded-md bg-[#F4F7FA]" />
                          </div>
                        </div>

                        {/* VIEW JOB BUTTON SKELETON */}

                        <div className="h-10 w-28 shrink-0 animate-pulse rounded-lg bg-[#EEF2F6]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* JOB ERROR */}

              {!jobsLoading && jobsError && (
                <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center">
                  <p className="text-sm font-medium text-red-600">
                    {jobsError}
                  </p>

                  <button
                    type="button"
                    onClick={fetchCompanyJobs}
                    className="mt-4 rounded-lg bg-[#0859A8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#064985]"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* NO JOBS */}

              {!jobsLoading && !jobsError && jobs.length === 0 && (
                <div className="rounded-xl border border-[#D7E4ED] bg-white px-5 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6EFF8]">
                    <BriefcaseBusiness size={25} className="text-[#0859A8]" />
                  </div>

                  <h4 className="mt-4 text-base font-bold text-[#25364A]">
                    No jobs available
                  </h4>

                  <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#8998A6] sm:text-sm">
                    This company does not currently have any active job
                    openings.
                  </p>
                </div>
              )}

              {/* JOB LIST */}

              {!jobsLoading && !jobsError && jobs.length > 0 && (
                <div className="grid min-w-0 grid-cols-1 gap-4">
                  {jobs.map((job) => {
                    const jobId = getJobId(job);
                    const salary = formatSalary(job);
                    const experience = formatExperience(job);

                    return (
                      <div
                        key={jobId}
                        className="min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm transition hover:border-[#BFD3E3] hover:shadow-md sm:p-5"
                      >
                        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          {/* JOB INFO */}

                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <h4 className="min-w-0 wrap-break-words text-base font-bold text-[#25364A] sm:text-lg">
                                {job.title || "Untitled Job"}
                              </h4>

                              {job.jobType && (
                                <span className="rounded-full bg-[#E6EFF8] px-2.5 py-1 text-[10px] font-bold text-[#0859A8] sm:text-xs">
                                  {formatJobType(job.jobType)}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 flex min-w-0 flex-wrap gap-x-4 gap-y-2 text-xs text-[#697586]">
                              {/* LOCATION */}

                              {job.location && (
                                <span className="inline-flex min-w-0 items-center gap-1.5">
                                  <MapPinned
                                    size={14}
                                    className="shrink-0 text-[#8998A6]"
                                  />

                                  <span className="wrap-break-words">
                                    {job.location}
                                  </span>
                                </span>
                              )}

                              {/* WORK MODE */}

                              {job.workMode && (
                                <span className="inline-flex items-center gap-1.5">
                                  <BriefcaseBusiness
                                    size={14}
                                    className="shrink-0 text-[#8998A6]"
                                  />

                                  <span>{formatWorkMode(job.workMode)}</span>
                                </span>
                              )}

                              {/* EXPERIENCE */}

                              {experience && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Clock3
                                    size={14}
                                    className="shrink-0 text-[#8998A6]"
                                  />

                                  <span>{experience}</span>
                                </span>
                              )}

                              {/* SALARY */}

                              {salary && (
                                <span className="inline-flex min-w-0 items-center gap-1.5">
                                  <DollarSign
                                    size={14}
                                    className="shrink-0 text-[#8998A6]"
                                  />

                                  <span className="wrap-break-words">
                                    {salary}
                                  </span>
                                </span>
                              )}
                            </div>

                            {/* CATEGORY */}

                            {job.category && (
                              <div className="mt-3">
                                <span className="inline-flex rounded-md border border-[#D7E4ED] bg-[#FBFCFD] px-2.5 py-1 text-[11px] font-semibold text-[#526170]">
                                  {job.category}
                                </span>
                              </div>
                            )}

                            {/* SKILLS */}

                            {Array.isArray(job.skills) &&
                              job.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {job.skills
                                    .slice(0, 5)
                                    .map((skill, index) => (
                                      <span
                                        key={`${skill}-${index}`}
                                        className="rounded-md bg-[#F4F7FA] px-2.5 py-1 text-[10px] font-medium text-[#697586]"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                </div>
                              )}
                          </div>

                          {/* VIEW JOB */}

                          {jobId && (
                            <Link
                              to={`/jobs/${jobId}`}
                              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#D0DCE6] bg-white px-4 py-2.5 text-xs font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#F5F9FD] hover:text-[#0859A8] sm:text-sm"
                            >
                              View Job
                              <ArrowUpRight size={15} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <MainFooter />

      {/* ============================================================
          COMPANY LOGO MODAL
      ============================================================ */}

      {showLogoModal && logoSrc && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#25364A]/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setShowLogoModal(false)}
        >
          {/* CLOSE */}

          <button
            type="button"
            onClick={() => setShowLogoModal(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 sm:right-6 sm:top-6"
            aria-label="Close company logo"
          >
            <X size={22} />
          </button>

          {/* LOGO */}

          <div
            className="relative flex h-[min(78vw,20rem)] w-[min(78vw,20rem)] max-w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl sm:h-96 sm:w-96"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={logoSrc}
              alt={`${company.companyName} logo`}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}

      {/* ============================================================
          REPORT COMPANY MODAL
      ============================================================ */}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        company={company}
        title="Report Company"
      />
    </div>
  );
};

export default CompaniesDetails;

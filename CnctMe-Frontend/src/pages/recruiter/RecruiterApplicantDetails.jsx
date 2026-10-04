import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Download,
  ExternalLink,
  User,
  Building2,
  Clock3,
  RotateCcw,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

import InterviewsForm from "../../components/recruiterForms/InterviewsForm";
import getLogoSrc from "../../utils/logo";

import {
  getApplicantDetails,
  getApplicantResume,
  getAllInterviews,
  updateApplicationStatus,
  clearCurrentApplicant,
  selectCurrentApplicant,
  selectApplicantDetailsLoading,
  selectApplicantDetailsError,
  selectStatusUpdating,
  selectInterviews,
  selectInterviewsLoading,
} from "../../features/recruiter/recruiterSlice";

// ==================================================
// HELPERS
// ==================================================

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getInterviewStatusClasses = (status) => {
  switch (status) {
    case "Scheduled":
      return "border-[#BFD5E5] bg-[#E6EFF8] text-[#0859A8]";

    case "Completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#DDE7EF] bg-[#F8FAFC] text-[#526170]";
  }
};

const getApplicationStatusClasses = (status) => {
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

// COMPONENT
const RecruiterApplicantDetails = () => {
  const { applicationId } = useParams();

  const dispatch = useDispatch();

  // REDUX
  const applicant = useSelector(selectCurrentApplicant);
  const loading = useSelector(selectApplicantDetailsLoading);
  const error = useSelector(selectApplicantDetailsError);
  const statusUpdating = useSelector(selectStatusUpdating);
  const interviews = useSelector(selectInterviews);
  const interviewsLoading = useSelector(selectInterviewsLoading);

  // LOCAL STATE
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showProfileImage, setShowProfileImage] = useState(false);

  // LOAD DATA
  useEffect(() => {
    if (!applicationId) {
      return;
    }

    dispatch(getApplicantDetails(applicationId));
    dispatch(getAllInterviews());

    return () => {
      dispatch(clearCurrentApplicant());
    };
  }, [dispatch, applicationId]);

  // FIND CURRENT INTERVIEW
  const currentInterview = useMemo(() => {
    if (!applicationId || !Array.isArray(interviews)) {
      return null;
    }

    return (
      interviews.find((interview) => {
        const interviewApplication = interview?.application;

        const interviewApplicationId =
          typeof interviewApplication === "object"
            ? interviewApplication?._id || interviewApplication?.id
            : interviewApplication;

        return String(interviewApplicationId) === String(applicationId);
      }) || null
    );
  }, [interviews, applicationId]);

  const currentStatus = applicant?.status || "Applied";

  const interviewStatus = currentInterview?.status || null;

  const interviewCompleted = interviewStatus === "Completed";
  const interviewCancelled = interviewStatus === "Cancelled";
  const interviewScheduled = interviewStatus === "Scheduled";

  const getAllowedStatuses = () => {
    switch (currentStatus) {
      case "Applied":
        return ["Applied", "Under Review", "Rejected"];

      case "Under Review":
        return ["Under Review", "Shortlisted", "Rejected"];

      case "Shortlisted":
        return ["Shortlisted", "Rejected"];

      case "Interview":
        if (currentInterview?.status === "Cancelled") {
          return ["Interview", "Rejected"];
        }

        if (currentInterview?.status === "Completed") {
          return ["Interview", "Selected", "Rejected"];
        }

        return ["Interview", "Rejected"];

      case "Selected":
        return ["Selected"];

      case "Rejected":
        return ["Rejected"];

      default:
        return [currentStatus];
    }
  };

  const allowedStatuses = getAllowedStatuses();

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (!applicationId || !newStatus || newStatus === currentStatus) {
      return;
    }

    if (newStatus === "Interview") {
      return;
    }

    if (newStatus === "Selected" && !interviewCompleted) {
      return;
    }

    const result = await dispatch(
      updateApplicationStatus({
        applicationId,
        status: newStatus,
      }),
    );

    if (updateApplicationStatus.fulfilled.match(result)) {
      await dispatch(getApplicantDetails(applicationId));
      await dispatch(getAllInterviews());
    }
  };

  const handleInterviewSuccess = async () => {
    setShowInterviewForm(false);

    await dispatch(getApplicantDetails(applicationId));
    await dispatch(getAllInterviews());
  };

  const handleResume = async (download) => {
    if (!applicationId) {
      return;
    }

    try {
      await dispatch(
        getApplicantResume({
          applicationId,
          download,
        }),
      ).unwrap();
    } catch (error) {
      console.error(
        download ? "Failed to download resume:" : "Failed to open resume:",
        error,
      );
    }
  };

  // ==================================================
  // CANDIDATE
  // ==================================================

  const rawCandidate =
    applicant?.user || applicant?.candidate || applicant?.applicant || null;

  const candidate =
    rawCandidate && typeof rawCandidate === "object" ? rawCandidate : {};

  const candidateId =
    typeof rawCandidate === "string"
      ? rawCandidate
      : candidate?._id || candidate?.id || applicant?.userId || null;

  const firstName = candidate?.firstName || applicant?.firstName || "";

  const lastName = candidate?.lastName || applicant?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    candidate?.name ||
    applicant?.name ||
    "Candidate";

  const email = candidate?.email || applicant?.email || "Email not available";

  const phone =
    candidate?.phoneNumber ||
    candidate?.phone ||
    applicant?.phoneNumber ||
    applicant?.phone ||
    "Phone not available";

  const profilePicture =
    candidate?.profilePicture ||
    candidate?.avatar ||
    applicant?.profilePicture ||
    applicant?.avatar;

  const logoSrc = profilePicture ? getLogoSrc(profilePicture) : null;

  const job = applicant?.job || {};

  const company = job?.company || applicant?.company || {};

  const companyLogoSrc = company?.logo ? getLogoSrc(company.logo) : null;

  const applicantError =
    error?.general ||
    error?.message ||
    (typeof error === "string" ? error : null);

  // LOADING

  if (loading) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
        <div className="mx-auto min-w-0 max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
          <div className="mb-5 h-5 w-36 animate-pulse rounded-md bg-[#E6EFF8] sm:mb-6" />

          <div className="mb-5 min-w-0 overflow-hidden rounded-2xl border border-[#D7E4ED] bg-white shadow-sm sm:mb-6">
            <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
              <div className="relative p-4 sm:p-7">
                <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                    <div className="h-16 w-16 shrink-0 animate-pulse rounded-full border-4 border-white bg-white sm:h-24 sm:w-24" />

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <div className="h-7 w-40 max-w-full animate-pulse rounded-md bg-white/80 sm:h-9 sm:w-56" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-white/80" />
                      </div>

                      <div className="h-4 w-40 animate-pulse rounded-md bg-white/70" />

                      <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                        <div className="h-9 w-52 max-w-full animate-pulse rounded-lg bg-white/75" />
                        <div className="h-9 w-40 max-w-full animate-pulse rounded-lg bg-white/75" />
                      </div>
                    </div>
                  </div>

                  <div className="w-full shrink-0 rounded-xl border border-white/80 bg-white/75 p-4 lg:w-64">
                    <div className="mb-2 h-3 w-32 animate-pulse rounded-md bg-[#DDE7EF]" />
                    <div className="h-10 w-full animate-pulse rounded-lg bg-[#DDE7EF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5 min-w-0 overflow-hidden rounded-2xl border border-[#D7E4ED] bg-white shadow-sm sm:mb-6">
            <div className="border-b border-[#DDE7EF] px-4 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-[#E6EFF8]" />

                  <div className="space-y-2">
                    <div className="h-5 w-36 animate-pulse rounded-md bg-[#E6EFF8]" />
                    <div className="h-3 w-60 max-w-full animate-pulse rounded-md bg-[#E6EFF8]" />
                  </div>
                </div>

                <div className="h-8 w-24 animate-pulse rounded-full bg-[#E6EFF8]" />
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                <div className="h-20 w-full animate-pulse rounded-xl bg-[#F8FBFD]" />

                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#E6EFF8]" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-2.5 w-20 animate-pulse rounded-md bg-[#DDE7EF]" />
                          <div className="h-4 w-24 animate-pulse rounded-md bg-[#E6EFF8]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3">
            <div className="min-w-0 space-y-5 sm:space-y-6 xl:col-span-2">
              {[1, 2, 3, 4].map((section) => (
                <div
                  key={section}
                  className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="mb-5 flex items-start gap-3">
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#E6EFF8]" />

                    <div className="space-y-2">
                      <div className="h-5 w-36 animate-pulse rounded-md bg-[#E6EFF8]" />
                      <div className="h-3 w-52 max-w-full animate-pulse rounded-md bg-[#F1F5F9]" />
                    </div>
                  </div>

                  {section === 3 ? (
                    <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:p-5">
                      <div className="space-y-3">
                        <div className="h-3 w-full animate-pulse rounded-md bg-[#E6EFF8]" />
                        <div className="h-3 w-11/12 animate-pulse rounded-md bg-[#E6EFF8]" />
                        <div className="h-3 w-4/5 animate-pulse rounded-md bg-[#E6EFF8]" />
                        <div className="h-3 w-3/5 animate-pulse rounded-md bg-[#E6EFF8]" />
                      </div>
                    </div>
                  ) : section === 4 ? (
                    <div className="flex flex-col gap-3 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:flex-row sm:flex-wrap">
                      <div className="h-10 w-full animate-pulse rounded-lg bg-[#E6EFF8] sm:w-28" />
                      <div className="h-10 w-full animate-pulse rounded-lg bg-[#E6EFF8] sm:w-32" />
                    </div>
                  ) : (
                    <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4"
                        >
                          <div className="h-2.5 w-20 animate-pulse rounded-md bg-[#DDE7EF]" />
                          <div className="mt-3 h-4 w-32 max-w-full animate-pulse rounded-md bg-[#E6EFF8]" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="min-w-0 space-y-5 sm:space-y-6">
              {[1, 2, 3].map((section) => (
                <div
                  key={section}
                  className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="mb-5 flex items-start gap-3">
                    <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-[#E6EFF8]" />

                    <div className="space-y-2">
                      <div className="h-5 w-40 animate-pulse rounded-md bg-[#E6EFF8]" />
                      <div className="h-3 w-44 max-w-full animate-pulse rounded-md bg-[#F1F5F9]" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {section === 2 ? (
                      <div className="flex min-w-0 items-center gap-4 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                        <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EFF8]" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-4 w-32 max-w-full animate-pulse rounded-md bg-[#E6EFF8]" />
                          <div className="h-3 w-24 max-w-full animate-pulse rounded-md bg-[#F1F5F9]" />
                        </div>
                      </div>
                    ) : (
                      [1, 2, 3].map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4"
                        >
                          <div className="h-2.5 w-20 animate-pulse rounded-md bg-[#DDE7EF]" />
                          <div className="mt-3 h-4 w-32 max-w-full animate-pulse rounded-md bg-[#E6EFF8]" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR / NOT FOUND
  if (!applicant) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8 lg:px-10">
        <div className="mx-auto min-w-0 max-w-6xl">
          <Link
            to="/recruiter/applications"
            className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#0859A8] transition hover:text-[#064985] sm:mb-6 sm:text-sm"
          >
            <ArrowLeft size={17} />
            Back to Applications
          </Link>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <AlertCircle
                  size={22}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div className="min-w-0">
                  <p className="font-semibold text-red-800">
                    Unable to load applicant details.
                  </p>

                  {applicantError && (
                    <p className="mt-2 wrap-break-words text-xs leading-6 text-red-700 sm:text-sm">
                      {applicantError}
                    </p>
                  )}

                  <p className="mt-2 break-all text-xs text-red-600">
                    Application ID: {applicationId || "Missing"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <div className="mx-auto min-w-0 max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
        {/* BACK */}

        <Link
          to="/recruiter/applications"
          className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-[#0859A8] transition hover:text-[#064985] sm:text-sm"
        >
          <ArrowLeft size={17} />
          Back to Applications
        </Link>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-5 min-w-0 overflow-hidden rounded-2xl border border-[#D7E4ED] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.06)] sm:mb-6">
          <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/10" />
            <div className="absolute -bottom-28 right-32 h-48 w-48 rounded-full bg-[#0859A8]/10" />

            <div className="relative p-4 sm:p-7">
              <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                  {logoSrc ? (
                    <button
                      type="button"
                      onClick={() => setShowProfileImage(true)}
                      className="group h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-24 sm:w-24"
                      aria-label={`View ${fullName}'s profile picture`}
                    >
                      <img
                        src={logoSrc}
                        alt={fullName}
                        className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                      />
                    </button>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white text-[#0859A8] shadow-md sm:h-24 sm:w-24">
                      <User size={28} className="sm:h-8.5 sm:w-8.5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                      <h1 className="max-w-full wrap-break-words text-xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
                        {fullName}
                      </h1>

                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${getApplicationStatusClasses(
                          currentStatus,
                        )}`}
                      >
                        {currentStatus}
                      </span>
                    </div>

                    <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#526170]">
                      {job?.title || "Job application"}
                    </p>

                    <div className="mt-4 flex min-w-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                      <span className="inline-flex max-w-full min-w-0 items-start gap-2 rounded-lg border border-white/80 bg-white/75 px-3 py-2 text-xs font-medium text-[#526170]">
                        <Mail
                          size={14}
                          className="mt-0.5 shrink-0 text-[#0859A8]"
                        />
                        <span className="break-all">{email}</span>
                      </span>

                      <span className="inline-flex max-w-full items-start gap-2 rounded-lg border border-white/80 bg-white/75 px-3 py-2 text-xs font-medium text-[#526170]">
                        <Phone
                          size={14}
                          className="mt-0.5 shrink-0 text-[#0859A8]"
                        />
                        <span className="wrap-break-words">{phone}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* APPLICATION STATUS */}

                <div className="w-full shrink-0 rounded-xl border border-white/80 bg-white/75 p-4 backdrop-blur-sm lg:w-64">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#526170]">
                    Application Status
                  </label>

                  <select
                    value={currentStatus}
                    onChange={handleStatusChange}
                    disabled={
                      statusUpdating ||
                      currentStatus === "Selected" ||
                      currentStatus === "Rejected"
                    }
                    className={`w-full rounded-lg border px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10 ${getApplicationStatusClasses(
                      currentStatus,
                    )}`}
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {currentStatus === "Interview" && !interviewCompleted && (
                    <p className="mt-2 text-xs leading-5 text-[#68798A]">
                      Selected becomes available after the interview is
                      completed.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            INTERVIEW SECTION
        ================================================== */}

        <div className="mb-5 min-w-0 overflow-hidden rounded-2xl border border-[#D7E4ED] bg-white shadow-sm sm:mb-6">
          <div className="border-b border-[#DDE7EF] px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                    <CalendarDays size={19} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-[#25364A]">
                      Interview Status
                    </h2>

                    <p className="mt-0.5 text-xs leading-relaxed text-[#8998A6]">
                      Current interview information for this candidate.
                    </p>
                  </div>
                </div>
              </div>

              {interviewStatus && (
                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3.5 py-2 text-xs font-bold ${getInterviewStatusClasses(
                    interviewStatus,
                  )}`}
                >
                  {interviewStatus === "Scheduled" && (
                    <Clock3 size={15} className="mr-2" />
                  )}

                  {interviewStatus === "Completed" && (
                    <CheckCircle2 size={15} className="mr-2" />
                  )}

                  {interviewStatus === "Cancelled" && (
                    <XCircle size={15} className="mr-2" />
                  )}

                  {interviewStatus}
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {interviewsLoading && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#E6EFF8]" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-4 w-40 animate-pulse rounded-md bg-[#E6EFF8]" />
                      <div className="h-3 w-64 max-w-full animate-pulse rounded-md bg-[#DDE7EF]" />
                      <div className="h-3 w-48 max-w-full animate-pulse rounded-md bg-[#DDE7EF]" />
                    </div>
                  </div>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-[#E6EFF8]" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="h-2.5 w-20 animate-pulse rounded-md bg-[#DDE7EF]" />
                          <div className="h-4 w-28 max-w-full animate-pulse rounded-md bg-[#E6EFF8]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!interviewsLoading &&
              !currentInterview &&
              currentStatus === "Shortlisted" && (
                <div className="overflow-hidden rounded-xl border border-[#BFD5E5] bg-[#F8FBFE]">
                  <div className="border-l-4 border-[#0859A8] p-4 sm:p-5">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                        <CalendarDays size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-[#25364A]">
                          Candidate is ready for an interview
                        </h3>

                        <p className="mt-1.5 max-w-2xl text-xs leading-6 text-[#68798A] sm:text-sm">
                          This candidate has been shortlisted. Schedule an
                          interview to move the application into the Interview
                          stage.
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowInterviewForm(true)}
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
                        >
                          <CalendarDays size={16} />
                          Schedule Interview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {!interviewsLoading &&
              !currentInterview &&
              currentStatus !== "Shortlisted" && (
                <div className="rounded-xl border border-dashed border-[#C9D6E0] bg-[#F8FAFC] p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#8998A6] shadow-sm">
                      <AlertCircle size={19} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-[#25364A]">
                        No interview record
                      </h3>

                      <p className="mt-1 text-xs leading-6 text-[#68798A] sm:text-sm">
                        There is currently no interview record for this
                        application.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {!interviewsLoading && currentInterview && (
              <div className="space-y-4 sm:space-y-5">
                {interviewScheduled && (
                  <div className="rounded-xl border border-[#BFD5E5] bg-[#F8FBFE] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                        <Clock3 size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#25364A]">
                          Interview is scheduled
                        </p>

                        <p className="mt-1 text-xs leading-6 text-[#68798A] sm:text-sm">
                          The candidate has an upcoming interview.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {interviewCompleted && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-emerald-600">
                        <CheckCircle2 size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-emerald-800">
                          Interview completed
                        </p>

                        <p className="mt-1 text-xs leading-6 text-emerald-700 sm:text-sm">
                          You can now change the application to Selected or
                          Rejected.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {interviewCancelled && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-red-600">
                        <XCircle size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-red-800">
                          Interview cancelled
                        </p>

                        <p className="mt-1 text-xs leading-6 text-red-700 sm:text-sm">
                          This interview was cancelled. The application remains
                          in the Interview stage.
                        </p>

                        <Link
                          to="/recruiter/interviews"
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] sm:w-auto"
                        >
                          <RotateCcw size={15} />
                          Reschedule Interview
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                        <CalendarDays size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8998A6]">
                          Interview Date
                        </p>

                        <p className="mt-1 wrap-break-words text-sm font-semibold text-[#25364A]">
                          {formatDate(currentInterview.date)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                        <Clock3 size={18} />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8998A6]">
                          Interview Time
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#25364A]">
                          {currentInterview.time || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                        <Video size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#8998A6]">
                          Meeting
                        </p>

                        {currentInterview.meetingLink ? (
                          <a
                            href={currentInterview.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 flex items-start gap-1 text-sm font-semibold text-[#0859A8] transition hover:text-[#064985] hover:underline"
                          >
                            <span>Open meeting</span>

                            <ExternalLink
                              size={13}
                              className="mt-0.5 shrink-0"
                            />
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-[#68798A]">
                            No meeting link
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#DDE7EF] pt-5 sm:flex-row sm:flex-wrap">
                  {interviewScheduled && currentInterview.meetingLink && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          currentInterview.meetingLink,
                          "_blank",
                          "noopener,noreferrer",
                        )
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
                    >
                      <Video size={17} />
                      Open Meeting
                    </button>
                  )}

                  {interviewCancelled && (
                    <Link
                      to="/recruiter/interviews"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
                    >
                      <RotateCcw size={17} />
                      Reschedule Interview
                    </Link>
                  )}

                  <Link
                    to="/recruiter/interviews"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D5E1EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] sm:w-auto"
                  >
                    <CalendarDays size={17} />
                    View All Interviews
                  </Link>
                </div>
              </div>
            )}

            {showInterviewForm && (
              <div className="mt-5 min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FAFC] p-3 sm:p-4">
                <InterviewsForm
                  applicationId={applicationId}
                  onSuccess={handleInterviewSuccess}
                  onCancel={() => setShowInterviewForm(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-3">
          {/* LEFT */}

          <div className="min-w-0 space-y-5 sm:space-y-6 xl:col-span-2">
            {/* JOB INFORMATION */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                  <BriefcaseBusiness size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">
                    Job Information
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Details of the position this candidate applied for.
                  </p>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Position
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold text-[#25364A]">
                    {job?.title || "Not available"}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Location
                  </p>

                  <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-[#25364A]">
                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-[#0859A8]"
                    />

                    <span className="wrap-break-words">
                      {job?.location || "Not specified"}
                    </span>
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Job Type
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold text-[#25364A]">
                    {job?.jobType || "Not specified"}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Work Mode
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold text-[#25364A]">
                    {job?.workMode || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* SKILLS */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                  <BriefcaseBusiness size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">Skills</h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Skills associated with this position.
                  </p>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                <div className="flex flex-wrap gap-2">
                  {(applicant?.job?.skills || []).length > 0 ? (
                    applicant.job.skills.map((skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                        className="max-w-full wrap-break-words rounded-lg border border-[#BFD5E5] bg-[#E6EFF8] px-3.5 py-2 text-xs font-semibold text-[#0859A8] transition hover:border-[#0859A8] hover:bg-[#DCEAF5] sm:text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-[#68798A]">
                      No skills provided.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* COVER LETTER */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">
                    Cover Letter
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Candidate's application message.
                  </p>
                </div>
              </div>

              <div className="min-w-0 overflow-hidden rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:p-5">
                <p className="min-w-0 whitespace-pre-wrap wrap-break-words wrap-anywhere text-xs leading-7 text-[#526170] sm:text-sm">
                  {applicant?.coverLetter || "No cover letter provided."}
                </p>
              </div>
            </div>

            {/* RESUME */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                  <FileText size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">Resume</h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Review or download the candidate's resume.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={() => handleResume(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
                >
                  <ExternalLink size={17} />
                  View Resume
                </button>

                <button
                  type="button"
                  onClick={() => handleResume(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D5E1EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] sm:w-auto"
                >
                  <Download size={17} />
                  Download Resume
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="min-w-0 space-y-5 sm:space-y-6">
            {/* CANDIDATE INFORMATION */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                  <User size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">
                    Candidate Information
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Candidate contact details.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Full Name
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold text-[#25364A]">
                    {fullName}
                  </p>
                </div>

                <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-[#25364A]">
                    {email}
                  </p>
                </div>

                <div className="rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Phone
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold text-[#25364A]">
                    {phone}
                  </p>
                </div>

                {candidateId && (
                  <Link
                    to={`/recruiter/candidates/${candidateId}`}
                    className="group flex w-full items-center justify-between gap-3 rounded-xl border border-[#BFD5E5] bg-[#E6EFF8] px-4 py-3.5 text-sm font-semibold text-[#0859A8] transition hover:border-[#0859A8] hover:bg-[#DCEAF5]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <User size={17} className="shrink-0" />
                      <span className="truncate">View Candidate Profile</span>
                    </span>

                    <ExternalLink
                      size={16}
                      className="shrink-0 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                )}
              </div>
            </div>

            {/* COMPANY */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F8FAFC] text-[#25364A]">
                  <Building2 size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-[#25364A]">Company</h3>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Company associated with this position.
                  </p>
                </div>
              </div>

              <div className="flex min-w-0 items-center gap-4 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#D7E4ED] bg-white">
                  {companyLogoSrc ? (
                    <img
                      src={companyLogoSrc}
                      alt={company?.companyName || "Company"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-[#25364A]" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="wrap-break-words font-semibold text-[#25364A]">
                    {company?.companyName || "Company not available"}
                  </p>

                  {company?.location && (
                    <p className="mt-1 flex items-start gap-1.5 text-sm text-[#68798A]">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-[#0859A8]"
                      />

                      <span className="wrap-break-words">
                        {company.location}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* APPLICATION TIMELINE */}

            <div className="min-w-0 rounded-2xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#25364A]">
                  <CalendarDays size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#25364A]">
                    Application Timeline
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Progress of this application.
                  </p>
                </div>
              </div>

              <div className="relative space-y-0">
                <div className="relative flex gap-4 pb-6">
                  <div className="relative flex w-4 shrink-0 justify-center">
                    <div className="absolute left-1/2 top-3 h-full w-px -translate-x-1/2 bg-[#DDE7EF]" />

                    <div className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0859A8] shadow-sm" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#25364A]">
                      Application submitted
                    </p>

                    <p className="mt-1 text-xs text-[#8998A6]">
                      {formatDate(applicant?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-4 pb-6">
                  <div className="relative flex w-4 shrink-0 justify-center">
                    <div className="absolute left-1/2 top-3 h-full w-px -translate-x-1/2 bg-[#DDE7EF]" />

                    <div
                      className={`relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                        currentStatus === "Interview" ||
                        currentStatus === "Selected" ||
                        currentStatus === "Rejected"
                          ? "bg-[#0859A8]"
                          : "bg-[#CBD5DF]"
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#25364A]">
                      Current status
                    </p>

                    <p className="mt-1 wrap-break-words text-xs text-[#8998A6]">
                      {currentStatus}
                    </p>
                  </div>
                </div>

                {currentInterview && (
                  <div className="relative flex gap-4">
                    <div className="relative flex w-4 shrink-0 justify-center">
                      <div
                        className={`relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-white shadow-sm ${
                          interviewStatus === "Scheduled" ||
                          interviewStatus === "Completed" ||
                          interviewStatus === "Cancelled"
                            ? "bg-[#0859A8]"
                            : "bg-[#CBD5DF]"
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#25364A]">
                        Interview
                      </p>

                      <p className="mt-1 wrap-break-words text-xs text-[#8998A6]">
                        {interviewStatus}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          PROFILE IMAGE MODAL
      ================================================== */}

      {showProfileImage && logoSrc && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowProfileImage(false)}
        >
          <div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowProfileImage(false)}
              className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#25364A] shadow-lg transition hover:bg-[#F8FAFC]"
              aria-label="Close profile picture"
            >
              <XCircle size={20} />
            </button>

            <img
              src={logoSrc}
              alt={fullName}
              className="h-72 w-72 rounded-full border-4 border-white bg-[#F8FAFC] object-contain shadow-2xl sm:h-96 sm:w-96"
            />

            <p className="mt-3 text-center text-sm font-semibold text-white">
              {fullName}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicantDetails;

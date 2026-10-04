import { useEffect, useState } from "react";
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
  AlertCircle,
  XCircle,
} from "lucide-react";

import getLogoSrc from "../../utils/logo";

import {
  fetchAdminApplicationById,
  clearSelectedApplication,
  selectAdminApplication,
  selectAdminApplicationDetailsLoading,
  selectAdminApplicationDetailsError,
} from "../../features/admin/adminSlice";

// ==================================================
// HELPERS
// ==================================================

const formatDate = (date) => {
  if (!date) {
    return "Not available";
  }

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

// ==================================================
// RESUME BUFFER HELPER
// ==================================================

const getResumeBlob = (resume) => {
  if (!resume?.data) {
    return null;
  }

  try {
    let bytes;

    if (Array.isArray(resume.data)) {
      bytes = new Uint8Array(resume.data);
    } else if (
      resume.data?.type === "Buffer" &&
      Array.isArray(resume.data.data)
    ) {
      bytes = new Uint8Array(resume.data.data);
    } else {
      return null;
    }

    return new Blob([bytes], {
      type: resume.contentType || "application/octet-stream",
    });
  } catch (error) {
    console.error("Failed to create resume blob:", error);
    return null;
  }
};

// ==================================================
// COMPONENT
// ==================================================

const AdminApplicationDetails = () => {
  const { applicationId } = useParams();

  const dispatch = useDispatch();

  // REDUX
  const application = useSelector(selectAdminApplication);

  const loading = useSelector(selectAdminApplicationDetailsLoading);

  const error = useSelector(selectAdminApplicationDetailsError);

  // LOCAL STATE
  const [showProfileImage, setShowProfileImage] = useState(false);

  // LOAD APPLICATION
  useEffect(() => {
    if (!applicationId) {
      return;
    }

    dispatch(fetchAdminApplicationById(applicationId));

    return () => {
      dispatch(clearSelectedApplication());
    };
  }, [dispatch, applicationId]);

  // CANDIDATE
  const candidate =
    application?.user || application?.candidate || application?.applicant || {};

  const firstName = candidate?.firstName || application?.firstName || "";

  const lastName = candidate?.lastName || application?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim() ||
    candidate?.name ||
    application?.name ||
    "Candidate";

  const email = candidate?.email || application?.email || "Email not available";

  const phone =
    candidate?.phoneNumber ||
    candidate?.phone ||
    application?.phoneNumber ||
    application?.phone ||
    "Phone not available";

  const profilePicture =
    candidate?.profilePicture ||
    candidate?.avatar ||
    application?.profilePicture ||
    application?.avatar;

  const profileImageSrc = profilePicture ? getLogoSrc(profilePicture) : null;

  const job = application?.job || {};

  const company = job?.company || application?.company || {};

  const companyLogoSrc = company?.logo ? getLogoSrc(company.logo) : null;

  const currentStatus = application?.status || "Applied";

  const applicationError =
    error?.general ||
    error?.message ||
    (typeof error === "string" ? error : null);

  //Resume
  const handleResume = (download) => {
    if (!application?.resume) {
      return;
    }

    const blob = getResumeBlob(application.resume);

    if (!blob) {
      return;
    }

    const url = URL.createObjectURL(blob);

    if (download) {
      const link = document.createElement("a");

      link.href = url;

      link.download =
        application.resume.originalName ||
        `${fullName.replace(/\s+/g, "_")}_Resume`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
        <div className="mx-auto min-w-0 max-w-6xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8 lg:py-8">
          <div className="mb-5 h-5 w-36 animate-pulse rounded-md bg-[#E6EFF8] sm:mb-6" />

          {/* HEADER SKELETON */}

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

          {/* CONTENT SKELETON */}

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
  if (!application) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8 lg:px-10">
        <div className="mx-auto min-w-0 max-w-6xl">
          <Link
            to="/admin/applications"
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
                    Unable to load application details.
                  </p>

                  {applicationError && (
                    <p className="mt-2 wrap-break-words text-xs leading-6 text-red-700 sm:text-sm">
                      {applicationError}
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
          to="/admin/applications"
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
                  {profileImageSrc ? (
                    <button
                      type="button"
                      onClick={() => setShowProfileImage(true)}
                      className="group h-16 w-16 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-24 sm:w-24"
                      aria-label={`View ${fullName}'s profile picture`}
                    >
                      <img
                        src={profileImageSrc}
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
                  <p className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-[#526170]">
                    Application Status
                  </p>

                  <div
                    className={`flex min-h-10 w-full items-center rounded-lg border px-4 py-2.5 text-sm font-semibold ${getApplicationStatusClasses(
                      currentStatus,
                    )}`}
                  >
                    {currentStatus}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-[#68798A]">
                    Application status is managed through the application
                    workflow.
                  </p>
                </div>
              </div>
            </div>
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

                  <p className="mt-2 wrap-break-words text-sm font-semibold capitalize text-[#25364A]">
                    {job?.jobType || "Not specified"}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    Work Mode
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold capitalize text-[#25364A]">
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
                  {(job?.skills || []).length > 0 ? (
                    job.skills.map((skill, index) => (
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
                  {application?.coverLetter || "No cover letter provided."}
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
                  disabled={!application?.resume}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <ExternalLink size={17} />
                  View Resume
                </button>

                <button
                  type="button"
                  onClick={() => handleResume(true)}
                  disabled={!application?.resume}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#D5E1EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <Download size={17} />
                  Download Resume
                </button>
              </div>

              {application?.resume?.originalName && (
                <p className="mt-3 break-all text-xs text-[#8998A6]">
                  File: {application.resume.originalName}
                </p>
              )}
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
                {/* SUBMITTED */}

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
                      {formatDate(application?.createdAt)}
                    </p>
                  </div>
                </div>

                {/* CURRENT STATUS */}

                <div className="relative flex gap-4">
                  <div className="relative flex w-4 shrink-0 justify-center">
                    <div className="relative z-10 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0859A8] shadow-sm" />
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================
          PROFILE IMAGE MODAL
      ================================================== */}

      {showProfileImage && profileImageSrc && (
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
              src={profileImageSrc}
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

export default AdminApplicationDetails;

import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  Flag,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  User,
  UserRound,
  X,
} from "lucide-react";

import {
  getApplicantProfile,
  clearCandidateProfile,
  selectCurrentCandidateProfile,
  selectCandidateProfileLoading,
  selectCandidateProfileError,
} from "../../features/recruiter/recruiterSlice";

import getLogoSrc from "../../utils/logo";
import ReportModal from "../../components/report/ReportModel";

const RecruiterCandidateProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const locationPath = useLocation();
  const dispatch = useDispatch();

  const profile = useSelector(selectCurrentCandidateProfile);
  const loading = useSelector(selectCandidateProfileLoading);
  const error = useSelector(selectCandidateProfileError);

  const [showImageModal, setShowImageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const isAdminProfile = locationPath.pathname.startsWith("/admin/users/");

  useEffect(() => {
    if (userId) {
      dispatch(
        getApplicantProfile({
          userId,
          isAdmin: isAdminProfile,
        }),
      );
    }

    return () => {
      dispatch(clearCandidateProfile());
    };
  }, [dispatch, userId, isAdminProfile]);

  const getFullName = () => {
    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || profile?.name || "User";
  };

  const getInitials = () => {
    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";

    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

    return initials.toUpperCase() || "U";
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const profileImage = getLogoSrc(profile?.profilePicture);

  // PROFILE DATA
  const skills = Array.isArray(profile?.skills) ? profile.skills : [];

  const educationItems = Array.isArray(profile?.education)
    ? profile.education
    : profile?.education
      ? [{ degree: profile.education }]
      : [];

  const experienceItems = Array.isArray(profile?.experience)
    ? profile.experience
    : profile?.experience
      ? [{ jobTitle: profile.experience }]
      : [];

  const location =
    typeof profile?.location === "string"
      ? profile.location
      : [profile?.location?.city, profile?.location?.country]
          .filter(Boolean)
          .join(", ");

  // PROFESSIONAL POSITION
  const professionalPosition =
    profile?.professionalPosition ||
    profile?.professionalTitle ||
    profile?.professional_position ||
    profile?.position ||
    profile?.headline ||
    profile?.title ||
    profile?.professionalInfo?.professionalPosition ||
    profile?.professionalInfo?.position ||
    profile?.professionalInfo?.title ||
    profile?.professional?.position ||
    profile?.professional?.title ||
    "";

  // CHECK CURRENT EXPERIENCE
  const isCurrentlyWorking = (item) => {
    if (!item) return false;

    if (
      item.currentlyWorking === true ||
      item.current === true ||
      item.isCurrent === true ||
      item.currentlyEmployed === true ||
      item.isCurrentlyWorking === true
    ) {
      return true;
    }

    const currentStatus = String(
      item.status || item.employmentStatus || item.workStatus || "",
    )
      .trim()
      .toLowerCase();

    if (
      currentStatus === "current" ||
      currentStatus === "present" ||
      currentStatus === "currently working" ||
      currentStatus === "currently employed"
    ) {
      return true;
    }

    const endDateValue = String(item.endDate || "")
      .trim()
      .toLowerCase();

    if (
      endDateValue === "present" ||
      endDateValue === "current" ||
      endDateValue === "now"
    ) {
      return true;
    }

    const hasStartDate = Boolean(item.startDate) || Boolean(item.startYear);

    const hasNoEndDate =
      item.endDate === null ||
      item.endDate === undefined ||
      item.endDate === "" ||
      item.endYear === null ||
      item.endYear === undefined ||
      item.endYear === "";

    if (hasStartDate && hasNoEndDate) {
      return true;
    }

    return false;
  };

  // CHECK CURRENT EDUCATION
  const isCurrentlyStudying = (item) => {
    if (!item) return false;

    if (
      item.currentlyStudying === true ||
      item.current === true ||
      item.isCurrent === true ||
      item.currentlyEnrolled === true ||
      item.isCurrentlyStudying === true
    ) {
      return true;
    }

    const currentStatus = String(
      item.status || item.educationStatus || item.studyStatus || "",
    )
      .trim()
      .toLowerCase();

    if (
      currentStatus === "current" ||
      currentStatus === "present" ||
      currentStatus === "currently studying" ||
      currentStatus === "currently enrolled"
    ) {
      return true;
    }

    const endDateValue = String(item.endDate || "")
      .trim()
      .toLowerCase();

    if (
      endDateValue === "present" ||
      endDateValue === "current" ||
      endDateValue === "now"
    ) {
      return true;
    }

    const hasStartDate = Boolean(item.startDate) || Boolean(item.startYear);

    const hasNoEndDate =
      item.endDate === null ||
      item.endDate === undefined ||
      item.endDate === "" ||
      item.endYear === null ||
      item.endYear === undefined ||
      item.endYear === "";

    if (hasStartDate && hasNoEndDate) {
      return true;
    }

    return false;
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200" />

          <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-sm">
            <div className="h-52 animate-pulse bg-[#E6EFF8]" />

            <div className="space-y-5 p-5 sm:p-8">
              <div className="-mt-20 flex items-center gap-5">
                <div className="h-28 w-28 animate-pulse rounded-full border-4 border-white bg-gray-200 sm:h-32 sm:w-32" />

                <div className="space-y-3">
                  <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
                <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
                <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !profile) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-[#D5E1EB] bg-white p-6 text-center shadow-sm sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <UserRound size={26} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#25364A]">
              Profile unavailable
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B7A89]">
              {error?.general || "We could not load this user's profile."}
            </p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985]"
            >
              <ArrowLeft size={17} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userName = getFullName();

  return (
    <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
      <div className="mx-auto min-w-0 max-w-5xl">
        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="mb-6">
          <div className="mb-4 flex justify-start">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#68798A] transition hover:text-[#0859A8]"
            >
              <ArrowLeft size={17} />
              Back
            </button>
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0859A8]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs">
                User Profile
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
                  Profile
                </h1>

                <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#6B7A89] sm:text-sm">
                  View the user's personal and professional information.
                </p>
              </div>

              {!isAdminProfile && profile?._id && (
                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 sm:w-auto"
                >
                  <Flag size={16} />
                  Report User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            MAIN PROFILE CARD
        ========================================== */}

        <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
          {/* PROFILE HERO */}

          <section className="relative overflow-hidden border-b border-[#DDE7EF] bg-[#E6EFF8] px-5 py-7 sm:px-8 sm:py-9">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-20 border-white/30" />

            <div className="pointer-events-none absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/20" />

            <div className="relative flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => {
                  if (profileImage) {
                    setShowImageModal(true);
                  }
                }}
                disabled={!profileImage}
                className={`group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-32 sm:w-32 ${
                  profileImage ? "cursor-pointer" : "cursor-default"
                }`}
                aria-label={
                  profileImage ? "View profile picture" : "Profile picture"
                }
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#EEF6FB] text-3xl font-bold text-[#0859A8]">
                    {getInitials()}
                  </div>
                )}

                {profileImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#25364A]/0 text-white opacity-0 transition group-hover:bg-[#25364A]/25 group-hover:opacity-100">
                    <span className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                      View
                    </span>
                  </div>
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="wrap-break-words text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
                      {userName}
                    </h2>

                    <span className="inline-flex shrink-0 items-center rounded-full border border-[#BFD5E5] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0859A8]">
                      {profile.role === "recruiter"
                        ? "Recruiter"
                        : profile.role === "admin"
                          ? "Admin"
                          : "Jobseeker"}
                    </span>
                  </div>

                  {professionalPosition ? (
                    <p className="text-sm font-medium text-[#526170] sm:text-base">
                      {professionalPosition}
                    </p>
                  ) : (
                    <p className="text-sm italic text-[#8998A6]">
                      No professional position added.
                    </p>
                  )}

                  <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                    {profile.email && (
                      <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                        <Mail size={14} className="shrink-0 text-[#0859A8]" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}

                    {profile.phone && (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                        <Phone size={14} className="shrink-0 text-[#0859A8]" />
                        <span>{profile.phone}</span>
                      </div>
                    )}

                    {location && (
                      <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                        <MapPin size={14} className="shrink-0 text-[#0859A8]" />
                        <span className="truncate">{location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PERSONAL INFORMATION */}

          <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0]">
                <User size={18} className="text-[#526170]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Personal Information
                </h2>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Basic personal and contact information.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  First Name
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.firstName || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Last Name
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.lastName || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Email
                </p>

                <p className="mt-1.5 break-all text-sm font-semibold text-[#25364A]">
                  {profile.email || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Phone Number
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.phone || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4 sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Location
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {location || "Not provided"}
                </p>
              </div>
            </div>
          </section>

          {/* PROFESSIONAL INFORMATION */}

          <section className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF]">
                <BriefcaseBusiness size={18} className="text-[#526170]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Professional Information
                </h2>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Professional background and introduction.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Professional Position
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {professionalPosition || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Account / Profile Type
                </p>

                <p className="mt-1.5 text-sm font-semibold capitalize text-[#25364A]">
                  {profile.role || "Jobseeker"}
                </p>
              </div>

              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  About
                </p>

                {profile.about || profile.bio ? (
                  <p className="mt-2 whitespace-pre-wrap wrap-break-words text-sm leading-7 text-[#526170]">
                    {profile.about || profile.bio}
                  </p>
                ) : (
                  <p className="mt-2 text-sm italic text-[#8998A6]">
                    No professional introduction added yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SKILLS */}

          <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
            <div className="mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0]">
                  <Code2 size={18} className="text-[#526170]" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Skills
                  </h2>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Professional skills listed on the profile.
                  </p>
                </div>
              </div>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => {
                  const skillName =
                    typeof skill === "string"
                      ? skill
                      : skill?.name || skill?.title || "";

                  if (!skillName) return null;

                  return (
                    <span
                      key={`${skillName}-${index}`}
                      className="inline-flex items-center rounded-lg border border-[#BFD5E5] bg-[#E6EFF8] px-3 py-2 text-xs font-semibold text-[#0859A8]"
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-8 text-center">
                <p className="text-sm text-[#8998A6]">No skills added yet.</p>
              </div>
            )}
          </section>

          {/* SOCIAL PROFILES */}

          <section className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-5 sm:p-8">
            <div className="mb-5">
              <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                Social Profiles
              </h2>

              <p className="mt-1 text-xs text-[#8998A6]">
                Professional online presence.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-sm font-bold text-[#0859A8]">
                    in
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#526170]">LinkedIn</p>

                    {profile.linkedin ? (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block truncate text-sm font-medium text-[#0859A8] hover:underline"
                      >
                        {profile.linkedin}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-[#8998A6]">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[10px] font-bold text-[#0859A8]">
                    GH
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#526170]">GitHub</p>

                    {profile.github ? (
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block truncate text-sm font-medium text-[#0859A8] hover:underline"
                      >
                        {profile.github}
                      </a>
                    ) : (
                      <p className="mt-1 text-xs text-[#8998A6]">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================
              EDUCATION
          ======================================== */}

          <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0]">
                <GraduationCap size={18} className="text-[#526170]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Education
                </h2>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Educational background.
                </p>
              </div>
            </div>

            {educationItems.length > 0 ? (
              <div className="space-y-4">
                {educationItems.map((item, index) => {
                  const currentlyStudying = isCurrentlyStudying(item);

                  return (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                          <GraduationCap size={18} className="text-[#0859A8]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start gap-2">
                            <h3 className="wrap-break-words text-sm font-bold text-[#25364A]">
                              {item?.degree ||
                                item?.program ||
                                item?.title ||
                                "Education"}
                            </h3>

                            {currentlyStudying && (
                              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#BFD5E5] bg-[#E6EFF8] px-2.5 py-1 text-[10px] font-bold text-[#0859A8]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0859A8]" />
                                Currently Studying
                              </span>
                            )}
                          </div>

                          {(item?.institution ||
                            item?.school ||
                            item?.university) && (
                            <p className="mt-1 wrap-break-words text-xs font-medium text-[#526170]">
                              {item?.institution ||
                                item?.school ||
                                item?.university}
                            </p>
                          )}

                          {(item?.fieldOfStudy || item?.field) && (
                            <p className="mt-1 wrap-break-words text-xs text-[#8998A6]">
                              {item?.fieldOfStudy || item?.field}
                            </p>
                          )}

                          {(item?.startDate ||
                            item?.endDate ||
                            item?.startYear ||
                            item?.endYear ||
                            currentlyStudying) && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#8998A6]">
                              <CalendarDays size={13} />

                              <span>
                                {item?.startYear ||
                                  formatDate(item?.startDate) ||
                                  ""}

                                {(item?.startYear || item?.startDate) &&
                                (item?.endYear ||
                                  item?.endDate ||
                                  currentlyStudying)
                                  ? " – "
                                  : ""}

                                {currentlyStudying
                                  ? "Present"
                                  : item?.endYear ||
                                    formatDate(item?.endDate) ||
                                    ""}
                              </span>
                            </div>
                          )}

                          {item?.description && (
                            <p className="mt-3 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-[#64748B]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-8 text-center">
                <p className="text-sm text-[#8998A6]">
                  No education added yet.
                </p>
              </div>
            )}
          </section>

          {/* ========================================
              EXPERIENCE
          ======================================== */}

          <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0]">
                <BriefcaseBusiness size={18} className="text-[#526170]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Experience
                </h2>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Professional work experience.
                </p>
              </div>
            </div>

            {experienceItems.length > 0 ? (
              <div className="space-y-4">
                {experienceItems.map((item, index) => {
                  const currentlyWorking = isCurrentlyWorking(item);

                  return (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                          <BriefcaseBusiness
                            size={18}
                            className="text-[#0859A8]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start gap-2">
                            <h3 className="wrap-break-words text-sm font-bold text-[#25364A]">
                              {item?.jobTitle ||
                                item?.title ||
                                "Professional Experience"}
                            </h3>

                            {currentlyWorking && (
                              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#BFD5E5] bg-[#E6EFF8] px-2.5 py-1 text-[10px] font-bold text-[#0859A8]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0859A8]" />
                                Currently Working
                              </span>
                            )}
                          </div>

                          {item?.company && (
                            <p className="mt-1 wrap-break-words text-xs font-semibold text-[#526170]">
                              {item.company}
                            </p>
                          )}

                          {(item?.startDate ||
                            item?.endDate ||
                            item?.startYear ||
                            item?.endYear ||
                            currentlyWorking) && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#8998A6]">
                              <CalendarDays size={13} />

                              <span>
                                {item?.startYear ||
                                  formatDate(item?.startDate) ||
                                  ""}

                                {(item?.startDate || item?.startYear) &&
                                (item?.endDate ||
                                  item?.endYear ||
                                  currentlyWorking)
                                  ? " – "
                                  : ""}

                                {currentlyWorking
                                  ? "Present"
                                  : item?.endYear ||
                                    formatDate(item?.endDate) ||
                                    ""}
                              </span>
                            </div>
                          )}

                          {item?.description && (
                            <p className="mt-3 whitespace-pre-wrap wrap-break-words text-sm leading-6 text-[#64748B]">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-8 text-center">
                <p className="text-sm text-[#8998A6]">
                  No experience added yet.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ==========================================
          PROFILE IMAGE MODAL
      ========================================== */}

      {showImageModal && profileImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#25364A]/80 p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white text-[#25364A] shadow-lg transition hover:bg-[#F3F6F8]"
              aria-label="Close profile picture"
            >
              <X size={18} />
            </button>

            <div className="flex h-72 w-72 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#E6EFF8] shadow-2xl sm:h-96 sm:w-96">
              <img
                src={profileImage}
                alt={userName}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          REPORT USER MODAL
      ========================================== */}

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedUser={profile}
        title={`Report ${userName}`}
      />
    </div>
  );
};

export default RecruiterCandidateProfile;

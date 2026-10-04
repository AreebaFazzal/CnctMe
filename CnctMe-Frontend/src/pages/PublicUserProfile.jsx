import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Code2,
  GraduationCap,
  MapPin,
  User,
  UserRound,
  X,
} from "lucide-react";

import MainNavbar from "../components/layout/MainNavbar";

import MainFooter from "../components/layout/MainFooter";

import {
  fetchPublicUserProfile,
  clearPublicUserProfile,
  selectPublicUserProfile,
  selectPublicUserProfileLoading,
  selectPublicUserProfileError,
} from "../features/people/peopleSlice";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const PublicUserProfile = () => {
  const { userId } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const profile = useSelector(selectPublicUserProfile);

  const loading = useSelector(selectPublicUserProfileLoading);

  const error = useSelector(selectPublicUserProfileError);

  const [showImageModal, setShowImageModal] = useState(false);

  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchPublicUserProfile(userId));
    }

    return () => {
      dispatch(clearPublicUserProfile());
    };
  }, [dispatch, userId]);

  const getFullName = () => {
    const firstName = profile?.firstName || "";

    const lastName = profile?.lastName || "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || "User";
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
      return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const formatYear = (year) => {
    if (!year) return "";

    return String(year);
  };

  const getProfilePictureUrl = () => {
    if (!profile?._id || imageError) {
      return "";
    }

    return `${API_BASE_URL}/users/public/${profile._id}/profile-picture`;
  };

  const fullName = getFullName();

  const profilePicture = getProfilePictureUrl();

  const skills = Array.isArray(profile?.skills) ? profile.skills : [];

  const educationItems = Array.isArray(profile?.education)
    ? profile.education
    : [];

  const experienceItems = Array.isArray(profile?.experience)
    ? profile.experience
    : [];

  const handleBack = () => {
    navigate(-1);
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
        <MainNavbar />

        <main className="pt-16">
          <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
            <div className="mb-6 h-5 w-32 animate-pulse rounded bg-[#E6EFF8]" />

            <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-sm">
              <div className="h-44 animate-pulse bg-[#E6EFF8] sm:h-52" />

              <div className="space-y-5 p-5 sm:p-8">
                <div className="-mt-20 flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="h-28 w-28 shrink-0 animate-pulse rounded-full border-4 border-white bg-[#DCE3E8] sm:h-32 sm:w-32" />

                  <div className="space-y-3">
                    <div className="h-7 w-52 animate-pulse rounded bg-[#E6EFF8]" />

                    <div className="h-4 w-36 animate-pulse rounded bg-[#E6EFF8]" />

                    <div className="h-4 w-28 animate-pulse rounded bg-[#E6EFF8]" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="h-20 animate-pulse rounded-xl bg-[#F3F2F0]" />

                  <div className="h-20 animate-pulse rounded-xl bg-[#F3F2F0]" />

                  <div className="h-20 animate-pulse rounded-xl bg-[#F3F2F0]" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div className="h-48 animate-pulse rounded-2xl bg-white" />

              <div className="h-56 animate-pulse rounded-2xl bg-white" />

              <div className="h-48 animate-pulse rounded-2xl bg-white" />
            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  // ERROR
  if (error || !profile) {
    return (
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
        <MainNavbar />

        <main className="pt-16">
          <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-3 py-8 sm:px-5 md:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-2xl border border-[#D5E1EB] bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <UserRound size={26} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-[#25364A]">
                Profile unavailable
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#6B7A89]">
                {error?.general ||
                  error ||
                  "We could not load this user's profile."}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#DCE3E8] px-5 py-2.5 text-sm font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8]"
                >
                  <ArrowLeft size={17} />
                  Go Back
                </button>

                <Link
                  to="/people"
                  className="inline-flex items-center justify-center rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985]"
                >
                  Browse People
                </Link>
              </div>
            </div>
          </div>
        </main>

        <MainFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
      <MainNavbar />

      <main className="pt-16">
        <div className="mx-auto min-w-0 max-w-5xl px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="mb-6">
            <div className="mb-4 flex justify-start">
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#68798A] transition hover:text-[#0859A8]"
              >
                <ArrowLeft size={17} />
                Back to People
              </button>
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#0859A8]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs">
                  Public Profile
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
                Profile
              </h1>

              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#6B7A89] sm:text-sm">
                View this member's personal and professional information.
              </p>
            </div>
          </div>

          {/* ==========================================
              MAIN PROFILE CARD
          ========================================== */}

          <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            {/* ========================================
                PROFILE HERO
            ======================================== */}

            <section className="relative overflow-hidden border-b border-[#DDE7EF] bg-[#E6EFF8] px-5 py-7 sm:px-8 sm:py-9">
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-20 border-white/30" />

              <div className="pointer-events-none absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/20" />

              <div className="relative flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
                {/* PROFILE IMAGE */}

                <button
                  type="button"
                  onClick={() => {
                    if (profilePicture) {
                      setShowImageModal(true);
                    }
                  }}
                  disabled={!profilePicture}
                  className={`group relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg sm:h-32 sm:w-32 ${
                    profilePicture ? "cursor-pointer" : "cursor-default"
                  }`}
                  aria-label={
                    profilePicture ? "View profile picture" : "Profile picture"
                  }
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={fullName}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#EEF6FB] text-3xl font-bold text-[#0859A8]">
                      {getInitials()}
                    </div>
                  )}

                  {profilePicture && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#25364A]/0 text-white opacity-0 transition group-hover:bg-[#25364A]/25 group-hover:opacity-100">
                      <span className="rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                        View
                      </span>
                    </div>
                  )}
                </button>

                {/* HERO INFORMATION */}

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-col gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <h2 className="wrap-break-words text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
                        {fullName}
                      </h2>

                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#BFD5E5] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0859A8]">
                        <CheckCircle2 size={12} />

                        {profile.role === "recruiter"
                          ? "Recruiter"
                          : "Jobseeker"}
                      </span>
                    </div>

                    {profile.position ? (
                      <p className="wrap-break-words text-sm font-medium text-[#526170] sm:text-base">
                        {profile.position}
                      </p>
                    ) : (
                      <p className="text-sm italic text-[#8998A6]">
                        No professional position added.
                      </p>
                    )}

                    <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                      {profile.location && (
                        <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                          <MapPin
                            size={14}
                            className="shrink-0 text-[#0859A8]"
                          />

                          <span className="truncate">{profile.location}</span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs capitalize text-[#526170]">
                        <User size={14} className="shrink-0 text-[#0859A8]" />

                        <span>{profile.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================
                PERSONAL INFORMATION
            ======================================== */}

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
                    Basic public profile information.
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
                    Profile Type
                  </p>

                  <p className="mt-1.5 text-sm font-semibold capitalize text-[#25364A]">
                    {profile.role || "Jobseeker"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                    Location
                  </p>

                  <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                    {profile.location || "Not provided"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                    Member Since
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-[#25364A]">
                    {profile.createdAt
                      ? formatDate(profile.createdAt)
                      : "Not available"}
                  </p>
                </div>
              </div>
            </section>

            {/* ========================================
                PROFESSIONAL INFORMATION
            ======================================== */}

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
                    {profile.position || "Not provided"}
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

                  {profile.bio ? (
                    <p className="mt-2 whitespace-pre-wrap wrap-break-words text-sm leading-7 text-[#526170]">
                      {profile.bio}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm italic text-[#8998A6]">
                      No professional introduction added yet.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ========================================
                SKILLS
            ======================================== */}

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

            {/* ========================================
                SOCIAL PROFILES
            ======================================== */}

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
                {/* LINKEDIN */}

                <div className="rounded-xl border border-[#DDE7EF] bg-white p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-sm font-bold text-[#0859A8]">
                      in
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#526170]">
                        LinkedIn
                      </p>

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

                {/* GITHUB */}

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

                {/* WEBSITE */}
              </div>
            </section>

            {/* ========================================
                EDUCATION
            ======================================== */}

            <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8FBFD]">
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
                <div className="space-y-4 bg-[#F8FBFD]">
                  {educationItems.map((item, index) => {
                    // No end year means the person is currently studying.
                    const isCurrentlyStudying = !item?.endYear;

                    return (
                      <div
                        key={item?._id || index}
                        className="rounded-xl border border-[#D7E4ED] bg-[#FBFCFD] p-4 sm:p-5"
                      >
                        <div className="flex gap-4 bg-[#F8FBFD]">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F8FBFD]">
                            <GraduationCap
                              size={18}
                              className="text-[#0859A8]"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="wrap-break-words text-sm font-bold text-[#25364A]">
                                {item?.degree || "Education"}
                              </h3>

                              {isCurrentlyStudying && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#BFD5E5] bg-[#E6EFF8] px-2 py-1 text-[10px] font-bold text-[#0859A8]">
                                  <CheckCircle2 size={11} />
                                  Currently Studying
                                </span>
                              )}
                            </div>

                            {item?.institution && (
                              <p className="mt-1 wrap-break-words text-xs font-medium text-[#526170]">
                                {item.institution}
                              </p>
                            )}

                            {item?.fieldOfStudy && (
                              <p className="mt-1 wrap-break-words text-xs text-[#8998A6]">
                                {item.fieldOfStudy}
                              </p>
                            )}

                            {(item?.startYear || item?.endYear) && (
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#8998A6]">
                                <CalendarDays size={13} />

                                <span>
                                  {formatYear(item.startYear) || "—"}
                                  {(item.startYear || item.endYear) && " – "}
                                  {formatYear(item.endYear) || "Present"}
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
                    // No end date means the person is currently working here.
                    const isCurrentlyWorking = !item?.endDate;

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
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="wrap-break-words text-sm font-bold text-[#25364A]">
                                {item?.jobTitle || "Professional Experience"}
                              </h3>

                              {isCurrentlyWorking && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#BFD5E5] bg-[#E6EFF8] px-2 py-1 text-[10px] font-bold text-[#0859A8]">
                                  <CheckCircle2 size={11} />
                                  Currently Working
                                </span>
                              )}
                            </div>

                            {item?.company && (
                              <p className="mt-1 wrap-break-words text-xs font-semibold text-[#526170]">
                                {item.company}
                              </p>
                            )}

                            {(item?.startDate || item?.endDate) && (
                              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#8998A6]">
                                <CalendarDays size={13} />

                                <span>
                                  {formatDate(item.startDate) || "Start"}
                                  {" – "}
                                  {formatDate(item.endDate) || "Present"}
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
      </main>

      <MainFooter />

      {/* ==========================================
          PROFILE IMAGE MODAL
      ========================================== */}

      {showImageModal && profilePicture && (
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
                src={profilePicture}
                alt={fullName}
                className="h-full w-full object-contain"
                onError={() => {
                  setImageError(true);
                  setShowImageModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicUserProfile;

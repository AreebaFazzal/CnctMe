import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  Save,
  User,
  BriefcaseBusiness,
  GraduationCap,
  Edit,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  X,
  Globe,
} from "lucide-react";

import {
  getRecruiterProfile,
  updateRecruiterProfile,
  selectRecruiterProfile,
  selectRecruiterProfileLoading,
  selectRecruiterProfileUpdating,
  selectRecruiterProfileError,
} from "../../features/recruiter/recruiterSlice";

import { updateUser } from "../../features/auth/authSlice";

import api from "../../api/axios";
import getLogoSrc from "../../utils/logo";
import getApiError from "../../utils/apiError";
import { formatMonthYear } from "../../utils/date";

// PROFILE VIEW
export const Profile = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectRecruiterProfile);
  const loading = useSelector(selectRecruiterProfileLoading);
  const error = useSelector(selectRecruiterProfileError);

  const [profileImage, setProfileImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // LOAD PROFILE
  useEffect(() => {
    dispatch(getRecruiterProfile());
  }, [dispatch]);

  // LOAD PROFILE PICTURE
  useEffect(() => {
    let objectUrl = null;

    const loadProfilePicture = async () => {
      try {
        const response = await api.get("/users/profile-picture", {
          responseType: "blob",
        });

        if (response.data && response.data.size > 0) {
          objectUrl = URL.createObjectURL(response.data);
          setProfileImage(objectUrl);
        }
      } catch (error) {
        setProfileImage(null);
        getApiError(error);
      }
    };

    loadProfilePicture();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  useEffect(() => {
    if (!showImageModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowImageModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showImageModal]);

  // LOADING
  if (loading && !profile) {
    return (
      <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
        <div className="mx-auto min-w-0 max-w-5xl">
          <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 animate-pulse">
              <div className="mb-2 h-3 w-32 rounded bg-[#E6EFF8] sm:w-36" />
              <div className="h-8 w-40 rounded-lg bg-[#DDE7EF] sm:h-9 sm:w-48" />
              <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#EEF2F6] sm:w-80" />
            </div>

            <div className="h-10 w-full animate-pulse rounded-lg bg-[#DDE7EF] sm:w-36" />
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
            {/* PROFILE HERO SKELETON */}

            <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
              <div className="relative px-4 py-7 sm:px-8 sm:py-8">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                  <div className="h-24 w-24 shrink-0 animate-pulse rounded-full border-4 border-white bg-[#D7E4ED] shadow-lg sm:h-27 sm:w-27" />

                  <div className="min-w-0 flex-1 animate-pulse">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <div className="h-7 w-48 max-w-full rounded-lg bg-[#D7E4ED] sm:h-8 sm:w-56" />
                      <div className="h-6 w-20 rounded-full bg-[#C7D8E5]" />
                    </div>

                    <div className="mt-2 h-4 w-40 max-w-full rounded bg-[#D7E4ED]" />

                    <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                      <div className="h-9 w-full max-w-xs rounded-lg bg-white/70 sm:w-52" />
                      <div className="h-9 w-full max-w-xs rounded-lg bg-white/70 sm:w-40" />
                      <div className="h-9 w-full max-w-xs rounded-lg bg-white/70 sm:w-44" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSONAL INFORMATION SKELETON */}

            <div className="animate-pulse border-b border-[#DDE7EF] p-4 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E6EFF8] sm:h-11 sm:w-11" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-44 rounded bg-[#DDE7EF] sm:h-6 sm:w-52" />
                  <div className="mt-2 h-3 w-60 max-w-full rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:p-5"
                  >
                    <div className="h-3 w-20 rounded bg-[#E6EFF8]" />
                    <div className="mt-3 h-4 w-32 max-w-full rounded bg-[#DDE7EF]" />
                  </div>
                ))}
              </div>
            </div>

            {/* PROFESSIONAL INFORMATION SKELETON */}

            <div className="animate-pulse border-b border-[#DDE7EF] bg-[#FBFCFD] p-4 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E6EFF8] sm:h-11 sm:w-11" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-52 rounded bg-[#DDE7EF] sm:h-6 sm:w-60" />
                  <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-3 w-16 rounded bg-[#E6EFF8]" />
                        <div className="mt-2 h-4 w-32 max-w-full rounded bg-[#DDE7EF]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-white shadow-sm sm:mt-5">
                <div className="flex items-center gap-3 border-b border-[#DDE7EF] px-4 py-4 sm:px-5">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-[#E6EFF8]" />

                  <div className="min-w-0">
                    <div className="h-4 w-12 rounded bg-[#DDE7EF]" />
                    <div className="mt-1.5 h-3 w-32 rounded bg-[#EEF2F6]" />
                  </div>
                </div>

                <div className="space-y-3 px-4 py-4 sm:px-5 sm:py-5">
                  <div className="h-3 w-full rounded bg-[#EEF2F6]" />
                  <div className="h-3 w-[92%] rounded bg-[#EEF2F6]" />
                  <div className="h-3 w-[75%] rounded bg-[#EEF2F6]" />
                </div>
              </div>
            </div>

            {/* SKILLS SKELETON */}

            <div className="animate-pulse border-b border-[#DDE7EF] p-4 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E6EFF8] sm:h-11 sm:w-11" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-20 rounded bg-[#DDE7EF] sm:h-6 sm:w-24" />
                  <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:p-5">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className={`h-8 rounded-lg bg-[#E6EFF8] ${
                      item % 3 === 0 ? "w-28" : item % 2 === 0 ? "w-20" : "w-24"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* SOCIAL PROFILES SKELETON */}

            <div className="animate-pulse border-b border-[#DDE7EF] bg-[#FBFCFD] p-4 sm:p-8">
              <div className="mb-5 sm:mb-6">
                <div className="h-5 w-36 rounded bg-[#DDE7EF] sm:h-6 sm:w-44" />
                <div className="mt-2 h-3 w-60 max-w-full rounded bg-[#EEF2F6]" />
              </div>

              <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-20 rounded bg-[#DDE7EF]" />
                        <div className="mt-2 h-3 w-24 rounded bg-[#EEF2F6]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EDUCATION SKELETON */}

            <div className="animate-pulse border-b border-[#DDE7EF] p-4 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E6EFF8] sm:h-11 sm:w-11" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-28 rounded bg-[#DDE7EF] sm:h-6 sm:w-32" />
                  <div className="mt-2 h-3 w-56 max-w-full rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="relative min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-4 pl-5 sm:p-5 sm:pl-6"
                  >
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#E6EFF8]" />

                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-5 w-44 max-w-full rounded bg-[#DDE7EF]" />
                        <div className="mt-2 h-4 w-36 max-w-full rounded bg-[#E6EFF8]" />
                        <div className="mt-2 h-3 w-28 max-w-full rounded bg-[#EEF2F6]" />

                        <div className="mt-4 h-8 w-32 rounded-lg bg-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPERIENCE SKELETON */}

            <div className="animate-pulse p-4 sm:p-8">
              <div className="mb-5 flex items-start gap-3 sm:mb-6">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-[#E6EFF8] sm:h-11 sm:w-11" />

                <div className="min-w-0 flex-1">
                  <div className="h-5 w-28 rounded bg-[#DDE7EF] sm:h-6 sm:w-32" />
                  <div className="mt-2 h-3 w-60 max-w-full rounded bg-[#EEF2F6]" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="relative min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-4 pl-5 sm:p-5 sm:pl-6"
                  >
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#E6EFF8]" />

                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-[#E6EFF8]" />

                      <div className="min-w-0 flex-1">
                        <div className="h-5 w-48 max-w-full rounded bg-[#DDE7EF]" />
                        <div className="mt-2 h-4 w-36 max-w-full rounded bg-[#E6EFF8]" />

                        <div className="mt-4 h-8 w-36 rounded-lg bg-white" />

                        <div className="mt-4 border-t border-[#DDE7EF] pt-4">
                          <div className="mb-2 h-3 w-20 rounded bg-[#E6EFF8]" />
                          <div className="h-3 w-full rounded bg-[#EEF2F6]" />
                          <div className="mt-2 h-3 w-[90%] rounded bg-[#EEF2F6]" />
                          <div className="mt-2 h-3 w-[70%] rounded bg-[#EEF2F6]" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR
  if (error && !profile) {
    return (
      <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8 lg:px-10">
        <div className="mx-auto min-w-0 max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-700 sm:p-6 sm:text-sm">
            {typeof error === "string"
              ? error
              : error?.general || "Failed to load profile."}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // USER NAME
  const userName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.firstName || "User";

  // PROFILE IMAGE
  const storedProfileImage = getLogoSrc(
    profile.profilePicture,
    profile.profilePicture?.contentType,
  );

  const image = profileImage || storedProfileImage;

  // ARRAYS
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  const education = Array.isArray(profile.education) ? profile.education : [];

  const experience = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  return (
    <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
      <div className="mx-auto min-w-0 max-w-5xl">
        {/* PAGE HEADER */}

        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0859A8]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs sm:tracking-[0.18em]">
                Recruiter Profile
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-[#6B7A89] sm:text-sm">
              Manage your personal and professional information.
            </p>
          </div>

          <Link
            to="/recruiter/profile/edit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
          >
            <Edit size={17} />
            Edit Profile
          </Link>
        </div>

        {/* MAIN PROFILE */}

        <div className="min-w-0 overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
          {/* PROFILE HERO */}

          <div className="relative min-w-0 overflow-hidden bg-[#E6EFF8]">
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#0859A8]/10" />
            <div className="absolute -bottom-28 right-24 h-52 w-52 rounded-full bg-[#0859A8]/10" />

            <div className="relative px-4 py-7 sm:px-8 sm:py-8">
              <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
                {/* PROFILE IMAGE */}

                {image ? (
                  <button
                    type="button"
                    onClick={() => setShowImageModal(true)}
                    className="group relative h-24 w-24 shrink-0 self-start rounded-full focus:outline-none focus:ring-2 focus:ring-[#0859A8] focus:ring-offset-2 sm:h-27 sm:w-27 sm:self-auto"
                    aria-label="View profile picture"
                  >
                    <img
                      src={image}
                      alt={userName}
                      className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-lg transition duration-200 group-hover:brightness-90 sm:h-27 sm:w-27"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />

                    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-[#25364A]/0 text-xs font-semibold text-white opacity-0 transition duration-200 group-hover:bg-[#25364A]/35 group-hover:opacity-100">
                      View
                    </span>
                  </button>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white text-xl font-bold text-[#0859A8] shadow-lg sm:h-27 sm:w-27 sm:text-2xl">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* PROFILE INFO */}

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                    <h2 className="max-w-full wrap-break-words text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl">
                      {userName}
                    </h2>

                    <span className="rounded-full bg-[#0859A8] px-3 py-1 text-[11px] font-bold text-white shadow-sm sm:text-xs">
                      {profile.role || "Recruiter"}
                    </span>
                  </div>

                  {profile.position && (
                    <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#526170]">
                      {profile.position}
                    </p>
                  )}

                  <div className="mt-4 flex min-w-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        title={`Send an email to ${profile.email}`}
                        className="inline-flex max-w-full min-w-0 items-start gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-[#526170] transition hover:border-[#0859A8] hover:bg-white hover:text-[#0859A8]"
                      >
                        <Mail
                          size={14}
                          className="mt-0.5 shrink-0 text-[#0859A8]"
                        />

                        <span className="break-all">{profile.email}</span>
                      </a>
                    )}

                    {profile.phoneNumber && (
                      <span className="inline-flex max-w-full min-w-0 items-start gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-[#526170]">
                        <Phone
                          size={14}
                          className="mt-0.5 shrink-0 text-[#0859A8]"
                        />

                        <span className="wrap-break-words">
                          {profile.phoneNumber}
                        </span>
                      </span>
                    )}

                    {profile.location && (
                      <span className="inline-flex max-w-full min-w-0 items-start gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs font-medium text-[#526170]">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0 text-[#0859A8]"
                        />

                        <span className="wrap-break-words">
                          {profile.location}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PERSONAL INFORMATION */}

          <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0] shadow-sm sm:h-11 sm:w-11">
                <User size={18} className="text-[#526170]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Personal Information
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Your basic contact and personal details.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {[
                ["First Name", profile.firstName],
                ["Last Name", profile.lastName],
                ["Email", profile.email],
                ["Phone Number", profile.phoneNumber],
                ["Location", profile.location],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:p-5"
                >
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                    {label}
                  </p>

                  <p
                    className={`mt-2 ${
                      label === "Email" ? "break-all" : "wrap-break-words"
                    } text-sm font-semibold text-[#25364A]`}
                  >
                    {value || "Not provided"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PROFESSIONAL INFORMATION */}

          <div className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-4 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                <BriefcaseBusiness size={18} className="text-[#526170]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Professional Information
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Your professional role and background.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                    <BriefcaseBusiness size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                      Position
                    </p>

                    <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                      {profile.position || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                    <User size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                      Role
                    </p>

                    <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                      {profile.role || "Recruiter"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BIO */}

            <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-white shadow-sm sm:mt-5">
              <div className="flex items-center gap-3 border-b border-[#DDE7EF] bg-white px-4 py-4 sm:px-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                  <User size={16} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#25364A]">Bio</h4>

                  <p className="text-[11px] text-[#68798A]">
                    Professional introduction
                  </p>
                </div>
              </div>

              <div className="px-4 py-4 sm:px-5 sm:py-5">
                {profile.bio ? (
                  <p className="whitespace-pre-line wrap-break-words text-xs leading-6 text-[#526170] sm:text-sm sm:leading-7">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-xs italic text-[#8998A6] sm:text-sm">
                    No bio has been added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SKILLS */}

          <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
            <div className="mb-5 sm:mb-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                  <BriefcaseBusiness size={18} className="text-[#526170]" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Skills
                  </h3>

                  <p className="mt-0.5 text-xs text-[#8998A6]">
                    Professional skills and areas of expertise.
                  </p>
                </div>
              </div>
            </div>

            {skills.length > 0 ? (
              <div className="min-w-0 rounded-xl border border-[#DDE7EF] bg-[#F8FBFD] p-4 sm:p-5">
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="max-w-full wrap-break-words rounded-lg border border-[#BFD5E5] bg-[#E6EFF8] px-3.5 py-2 text-xs font-semibold text-[#0859A8] transition hover:border-[#0859A8] hover:bg-[#DCEAF5] sm:text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-6 text-center sm:px-5 sm:py-7">
                <p className="text-xs text-[#8998A6] sm:text-sm">
                  No skills have been added yet.
                </p>
              </div>
            )}
          </div>

          {/* SOCIAL PROFILES */}

          <div className="border-b border-[#DDE7EF] bg-[#FBFCFD] p-4 sm:p-8">
            <div className="mb-5 sm:mb-6">
              <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                Social Profiles
              </h3>

              <p className="mt-1 text-xs text-[#8998A6]">
                Professional links and online presence.
              </p>
            </div>

            {profile.linkedin || profile.github || profile.website ? (
              <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                {profile.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0859A8] hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-sm font-bold text-[#0859A8] transition group-hover:bg-[#0859A8] group-hover:text-white">
                        in
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#25364A]">
                          LinkedIn
                        </p>

                        <p className="mt-0.5 text-xs text-[#8998A6]">
                          View profile
                        </p>
                      </div>
                    </div>
                  </a>
                )}

                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0859A8] hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[10px] font-bold text-[#0859A8] transition group-hover:bg-[#0859A8] group-hover:text-white">
                        GH
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#25364A]">
                          GitHub
                        </p>

                        <p className="mt-0.5 text-xs text-[#8998A6]">
                          View profile
                        </p>
                      </div>
                    </div>
                  </a>
                )}

                {profile.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group min-w-0 rounded-xl border border-[#D7E4ED] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0859A8] hover:shadow-md"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8] transition group-hover:bg-[#0859A8] group-hover:text-white">
                        <Globe size={17} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#25364A]">
                          Personal Website
                        </p>

                        <p className="mt-0.5 text-xs text-[#8998A6]">
                          Visit website
                        </p>
                      </div>
                    </div>
                  </a>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-white px-4 py-6 text-center sm:px-5 sm:py-7">
                <p className="text-xs text-[#8998A6] sm:text-sm">
                  No social profiles have been added yet.
                </p>
              </div>
            )}
          </div>

          {/* EDUCATION */}

          <div className="border-b border-[#DDE7EF] p-4 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                <GraduationCap size={18} className="text-[#526170]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Education
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Your educational background.
                </p>
              </div>
            </div>

            {education.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {education.map((item, index) => {
                  const isCurrentlyStudying =
                    item.currentlyStudying === true || !item.endYear;

                  return (
                    <div
                      key={item._id || index}
                      className="relative min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] transition hover:border-[#AFC8DB] hover:shadow-sm"
                    >
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#0859A8]" />

                      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                            <GraduationCap size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <h4 className="wrap-break-words text-base font-bold text-[#25364A]">
                                  {item.degree || "Degree not specified"}
                                </h4>

                                {item.institution && (
                                  <p className="mt-1 wrap-break-words text-sm font-semibold text-[#0859A8]">
                                    {item.institution}
                                  </p>
                                )}

                                {item.fieldOfStudy && (
                                  <p className="mt-1 wrap-break-words text-sm text-[#68798A]">
                                    {item.fieldOfStudy}
                                  </p>
                                )}
                              </div>

                              {isCurrentlyStudying && (
                                <span className="w-fit shrink-0 rounded-full bg-[#0859A8] px-3 py-1.5 text-[11px] font-bold text-white">
                                  Currently Studying
                                </span>
                              )}
                            </div>

                            {(item.startYear ||
                              item.endYear ||
                              item.currentlyStudying) && (
                              <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-lg border border-[#DDE7EF] bg-white px-3 py-2 text-xs font-medium text-[#68798A]">
                                <CalendarDays
                                  size={14}
                                  className="mt-0.5 shrink-0 text-[#0859A8]"
                                />

                                <span className="wrap-break-words">
                                  {item.startYear || "—"} -{" "}
                                  {isCurrentlyStudying ? (
                                    <span className="font-bold text-[#0859A8]">
                                      Present
                                    </span>
                                  ) : (
                                    item.endYear || "—"
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-6 text-center sm:px-5 sm:py-7">
                <p className="text-xs text-[#8998A6] sm:text-sm">
                  No education information has been added yet.
                </p>
              </div>
            )}
          </div>

          {/* EXPERIENCE */}

          <div className="p-4 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1F1EF] shadow-sm sm:h-11 sm:w-11">
                <BriefcaseBusiness size={18} className="text-[#526170]" />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Experience
                </h3>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Your professional work experience.
                </p>
              </div>
            </div>

            {experience.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {experience.map((item, index) => {
                  const startDate = formatMonthYear(item.startDate);
                  const endDate = formatMonthYear(item.endDate);

                  const isCurrentlyWorking =
                    item.currentlyWorking === true || !item.endDate;

                  return (
                    <div
                      key={item._id || index}
                      className="relative min-w-0 overflow-hidden rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] transition hover:border-[#AFC8DB] hover:shadow-sm"
                    >
                      <div className="absolute bottom-0 left-0 top-0 w-1 bg-[#0859A8]" />

                      <div className="p-4 pl-5 sm:p-5 sm:pl-6">
                        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                            <BriefcaseBusiness size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <h4 className="wrap-break-words text-base font-bold text-[#25364A]">
                                  {item.jobTitle || "Job title not specified"}
                                </h4>

                                {item.company && (
                                  <p className="mt-1 wrap-break-words text-sm font-semibold text-[#0859A8]">
                                    {item.company}
                                  </p>
                                )}
                              </div>

                              {isCurrentlyWorking && (
                                <span className="w-fit shrink-0 rounded-full bg-[#0859A8] px-3 py-1.5 text-[11px] font-bold text-white">
                                  Currently Working
                                </span>
                              )}
                            </div>

                            {startDate && (
                              <div className="mt-4 inline-flex max-w-full items-start gap-2 rounded-lg border border-[#DDE7EF] bg-white px-3 py-2 text-xs font-medium text-[#68798A]">
                                <CalendarDays
                                  size={14}
                                  className="mt-0.5 shrink-0 text-[#0859A8]"
                                />

                                <span className="wrap-break-words">
                                  {startDate} -{" "}
                                  {isCurrentlyWorking ? (
                                    <span className="font-bold text-[#0859A8]">
                                      Present
                                    </span>
                                  ) : (
                                    endDate || "—"
                                  )}
                                </span>
                              </div>
                            )}

                            {item.description && (
                              <div className="mt-4 border-t border-[#DDE7EF] pt-4">
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#0859A8]">
                                  Description
                                </p>

                                <p className="whitespace-pre-line wrap-break-words text-xs leading-6 text-[#68798A] sm:text-sm sm:leading-7">
                                  {item.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#BFD5E5] bg-[#F8FBFD] px-4 py-6 text-center sm:px-5 sm:py-7">
                <p className="text-xs text-[#8998A6] sm:text-sm">
                  No experience information has been added yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE IMAGE MODAL */}

      {showImageModal && image && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#25364A]/80 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setShowImageModal(false)}
        >
          <button
            type="button"
            onClick={() => setShowImageModal(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 sm:right-6 sm:top-6"
            aria-label="Close profile picture"
          >
            <X size={22} />
          </button>

          <div
            className="relative flex h-[min(78vw,20rem)] w-[min(78vw,20rem)] max-w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-2xl sm:h-96 sm:w-96"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={image}
              alt={userName}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// EDIT PROFILE
// ============================================================

const CURRENT_YEAR = new Date().getFullYear();

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const normalizeErrorKey = (key) => key.replace(/\[(\d+)\]/g, ".$1");

const FieldError = ({ message }) =>
  message ? <p className="mt-1.5 text-xs text-red-500">{message}</p> : null;

const validateProfileForm = (data) => {
  const errors = {};

  // PERSONAL
  if (!data.firstName.trim()) errors.firstName = "First name is required.";
  if (!data.lastName.trim()) errors.lastName = "Last name is required.";

  if (
    data.phoneNumber.trim() &&
    !/^\+?[\d\s()-]{7,20}$/.test(data.phoneNumber.trim())
  ) {
    errors.phoneNumber = "Enter a valid phone number.";
  }

  // SOCIAL
  if (data.linkedin.trim() && !isValidUrl(data.linkedin.trim())) {
    errors.linkedin = "Enter a valid URL, e.g. https://linkedin.com/in/you";
  }

  if (data.github.trim() && !isValidUrl(data.github.trim())) {
    errors.github = "Enter a valid URL, e.g. https://github.com/you";
  }

  // EDUCATION
  data.education.forEach((item, i) => {
    const p = `education.${i}`;

    if (!item.degree?.trim()) errors[`${p}.degree`] = "Degree is required.";

    if (!item.institution?.trim()) {
      errors[`${p}.institution`] = "Institution is required.";
    }

    const start = Number(item.startYear);
    const end = Number(item.endYear);
    let startValid = false;

    if (!item.startYear) {
      errors[`${p}.startYear`] = "Start year is required.";
    } else if (
      !Number.isInteger(start) ||
      start < 1950 ||
      start > CURRENT_YEAR + 10
    ) {
      errors[`${p}.startYear`] = `Enter a year between 1950 and ${
        CURRENT_YEAR + 10
      }.`;
    } else {
      startValid = true;
    }

    if (!item.currentlyStudying && item.endYear) {
      if (!Number.isInteger(end) || end < 1950 || end > CURRENT_YEAR + 10) {
        errors[`${p}.endYear`] = `Enter a year between 1950 and ${
          CURRENT_YEAR + 10
        }.`;
      } else if (startValid && end < start) {
        errors[`${p}.endYear`] = "End year cannot be earlier than start year.";
      }
    }
  });

  // EXPERIENCE
  data.experience.forEach((item, i) => {
    const p = `experience.${i}`;

    if (!item.jobTitle?.trim()) {
      errors[`${p}.jobTitle`] = "Job title is required.";
    }

    if (!item.company?.trim()) {
      errors[`${p}.company`] = "Company is required.";
    }

    const startStr = item.startDate ? String(item.startDate).slice(0, 10) : "";
    const endStr = item.endDate ? String(item.endDate).slice(0, 10) : "";
    const today = new Date().toISOString().slice(0, 10);

    if (!startStr) {
      errors[`${p}.startDate`] = "Start date is required.";
    } else if (startStr > today) {
      errors[`${p}.startDate`] = "Start date cannot be in the future.";
    }

    if (!item.currentlyWorking && endStr) {
      if (startStr && endStr < startStr) {
        errors[`${p}.endDate`] = "End date cannot be earlier than start date.";
      } else if (endStr > today) {
        errors[`${p}.endDate`] = "End date cannot be in the future.";
      }
    }
  });

  return errors;
};

export const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const profile = useSelector(selectRecruiterProfile);
  const loading = useSelector(selectRecruiterProfileLoading);
  const saving = useSelector(selectRecruiterProfileUpdating);
  const reduxError = useSelector(selectRecruiterProfileError);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [existingProfileImage, setExistingProfileImage] = useState(null);

  const [formData, setFormData] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  // GET PROFILE
  useEffect(() => {
    dispatch(getRecruiterProfile());
  }, [dispatch]);

  // LOAD EXISTING PROFILE IMAGE
  useEffect(() => {
    let imageUrl = null;

    const loadProfileImage = async () => {
      try {
        const response = await api.get("/users/profile-picture", {
          responseType: "blob",
        });

        if (response.data && response.data.size > 0) {
          imageUrl = URL.createObjectURL(response.data);
          setExistingProfileImage(imageUrl);
        }
      } catch (error) {
        setExistingProfileImage(null);
        getApiError(error);
      }
    };

    loadProfileImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, []);

  // INITIAL FORM DATA
  const initialFormData = profile
    ? {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        position: profile.position || "",
        bio: profile.bio || "",
        location: profile.location || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",

        skills: Array.isArray(profile.skills) ? [...profile.skills] : [],

        education: Array.isArray(profile.education)
          ? profile.education.map((item) => ({
              ...item,
              currentlyStudying:
                item.currentlyStudying === true || !item.endYear,
              startYear: item.startYear || "",
              endYear: item.endYear || "",
            }))
          : [],

        experience: Array.isArray(profile.experience)
          ? profile.experience.map((item) => ({
              ...item,
              currentlyWorking: item.currentlyWorking === true || !item.endDate,
              startDate: item.startDate || "",
              endDate: item.endDate || "",
            }))
          : [],
      }
    : null;

  const currentFormData = formData || initialFormData;

  // ERROR HELPERS
  const clearFieldError = (...keys) => {
    setFieldErrors((prev) => {
      if (!keys.some((key) => prev[key])) return prev;

      const next = { ...prev };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const borderClass = (key) =>
    fieldErrors[key] ? "border-red-400" : "border-[#C8D5E0]";

  const focusFirstError = (errors) => {
    const keys = Object.keys(errors);

    if (!keys.length) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = Array.from(document.querySelectorAll("[data-field]")).find(
      (node) => keys.includes(node.getAttribute("data-field")),
    );

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const applyServerErrors = (err) => {
    const mapped = {};
    let general = "";

    if (typeof err === "string") {
      general = err;
    } else if (err && typeof err === "object") {
      Object.entries(err).forEach(([key, value]) => {
        if (typeof value !== "string") return;

        if (key === "general" || key === "message") {
          general = general || value;
        } else {
          mapped[normalizeErrorKey(key)] = value;
        }
      });
    }

    setFieldErrors(mapped);

    setError(
      general ||
        Object.values(mapped)[0] ||
        "Failed to update your profile. Please try again.",
    );

    focusFirstError(mapped);
  };

  // INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    clearFieldError(name);

    setFormData((prev) => ({
      ...(prev || initialFormData),
      [name]: value,
    }));
  };

  // PROFILE PICTURE
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be less than 5MB.");
      return;
    }

    setError("");
    setProfilePicture(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  // SKILLS
  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    const alreadyExists = currentFormData.skills.some(
      (existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase(),
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setFormData((prev) => ({
      ...(prev || initialFormData),
      skills: [...(prev || initialFormData).skills, skill],
    }));

    setSkillInput("");
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...(prev || initialFormData),
      skills: (prev || initialFormData).skills.filter(
        (existingSkill) => existingSkill !== skill,
      ),
    }));
  };

  // EDUCATION
  const addEducation = () => {
    setFormData((prev) => ({
      ...(prev || initialFormData),
      education: [
        ...(prev || initialFormData).education,
        {
          degree: "",
          institution: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          currentlyStudying: false,
        },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    // Start and end year are validated together, so clear both
    if (field === "startYear" || field === "endYear") {
      clearFieldError(
        `education.${index}.startYear`,
        `education.${index}.endYear`,
      );
    } else {
      clearFieldError(`education.${index}.${field}`);
    }

    setFormData((prev) => ({
      ...(prev || initialFormData),
      education: (prev || initialFormData).education.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const handleCurrentlyStudyingChange = (index, checked) => {
    clearFieldError(`education.${index}.endYear`);

    setFormData((prev) => ({
      ...(prev || initialFormData),
      education: (prev || initialFormData).education.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              currentlyStudying: checked,
              endYear: checked ? "" : item.endYear || "",
            }
          : item,
      ),
    }));
  };

  const removeEducation = (index) => {
    // Indexes shift after removal, so reset the field errors
    setFieldErrors({});

    setFormData((prev) => ({
      ...(prev || initialFormData),
      education: (prev || initialFormData).education.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  // EXPERIENCE
  const addExperience = () => {
    setFormData((prev) => ({
      ...(prev || initialFormData),
      experience: [
        ...(prev || initialFormData).experience,
        {
          jobTitle: "",
          company: "",
          startDate: "",
          endDate: "",
          description: "",
          currentlyWorking: false,
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    // Start and end date are validated together, so clear both
    if (field === "startDate" || field === "endDate") {
      clearFieldError(
        `experience.${index}.startDate`,
        `experience.${index}.endDate`,
      );
    } else {
      clearFieldError(`experience.${index}.${field}`);
    }

    setFormData((prev) => ({
      ...(prev || initialFormData),
      experience: (prev || initialFormData).experience.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    }));
  };

  const handleCurrentlyWorkingChange = (index, checked) => {
    clearFieldError(`experience.${index}.endDate`);

    setFormData((prev) => ({
      ...(prev || initialFormData),
      experience: (prev || initialFormData).experience.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              currentlyWorking: checked,
              endDate: checked ? "" : item.endDate || "",
            }
          : item,
      ),
    }));
  };

  const removeExperience = (index) => {
    // Indexes shift after removal, so reset the field errors
    setFieldErrors({});

    setFormData((prev) => ({
      ...(prev || initialFormData),
      experience: (prev || initialFormData).experience.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // CLIENT-SIDE VALIDATION
    const validationErrors = validateProfileForm(currentFormData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError("Please fix the highlighted fields below.");
      focusFirstError(validationErrors);
      return;
    }

    setFieldErrors({});

    const cleanedEducation = currentFormData.education.map((item) => {
      const { currentlyStudying, ...educationData } = item;

      return {
        ...educationData,
        endYear: currentlyStudying ? "" : item.endYear || "",
      };
    });

    const cleanedExperience = currentFormData.experience.map((item) => {
      const { currentlyWorking, ...experienceData } = item;

      return {
        ...experienceData,
        endDate: currentlyWorking ? "" : item.endDate || "",
      };
    });

    const data = new FormData();

    data.append("firstName", currentFormData.firstName.trim());
    data.append("lastName", currentFormData.lastName.trim());
    data.append("phoneNumber", currentFormData.phoneNumber.trim());
    data.append("position", currentFormData.position.trim());
    data.append("bio", currentFormData.bio.trim());
    data.append("location", currentFormData.location.trim());
    data.append("linkedin", currentFormData.linkedin.trim());
    data.append("github", currentFormData.github.trim());

    data.append("skills", JSON.stringify(currentFormData.skills));

    data.append("education", JSON.stringify(cleanedEducation));

    data.append("experience", JSON.stringify(cleanedExperience));

    if (profilePicture) {
      data.append("profilePicture", profilePicture);
    }

    try {
      const result = await dispatch(updateRecruiterProfile(data)).unwrap();

      if (result.user) {
        dispatch(updateUser(result.user));
      }

      setSuccess(result.message || "Profile updated successfully.");

      setTimeout(() => {
        navigate("/recruiter/profile");
      }, 700);
    } catch (err) {
      // Shows server errors under the matching inputs
      applyServerErrors(err);
    }
  };

  // LOADING
  if (loading || !currentFormData) {
    // KEEP YOUR EXISTING LOADING SKELETON HERE, exactly as it is:
    // return ( <div className="min-h-screen ..."> ... </div> );
  }

  const displayError =
    error ||
    reduxError?.general ||
    (typeof reduxError === "string" ? reduxError : "");

  const storedProfileImage = getLogoSrc(
    profile?.profilePicture,
    profile?.profilePicture?.contentType,
  );

  const image = previewImage || existingProfileImage || storedProfileImage;

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-8 lg:px-8">
      <div className="mx-auto min-w-0 max-w-5xl">
        {/* HEADER */}

        <div className="mb-5 min-w-0 sm:mb-6">
          <Link
            to="/recruiter/profile"
            className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-[#68798A] transition hover:text-[#0859A8] sm:text-sm"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <h1 className="text-xl font-bold text-[#25364A] sm:text-2xl">
            Edit Profile
          </h1>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#68798A] sm:text-sm">
            Update your personal and professional information.
          </p>
        </div>

        {/* ALERTS */}

        {displayError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium leading-relaxed text-[#D64545] sm:mb-5 sm:px-5 sm:py-4 sm:text-sm">
            {displayError}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-xs font-medium leading-relaxed text-green-700 sm:mb-5 sm:px-5 sm:py-4 sm:text-sm">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="min-w-0 space-y-4 sm:space-y-6"
        >
          {/* PROFILE PICTURE */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                <User size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Profile Picture
                </h2>

                <p className="text-xs leading-relaxed text-[#8A96A3] sm:text-sm">
                  Use a professional photo for your recruiter profile.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-5">
              {image ? (
                <img
                  src={image}
                  alt="Profile preview"
                  className="h-20 w-20 shrink-0 rounded-full border-4 border-[#E6EFF8] object-cover sm:h-24 sm:w-24"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-[#E6EFF8] bg-[#EEF6FB] text-xl font-bold text-[#0859A8] sm:h-24 sm:w-24 sm:text-2xl">
                  {currentFormData.firstName?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div className="min-w-0 w-full sm:w-auto">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#C8D5E0] bg-white px-4 py-2.5 text-sm font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#F8FBFE] hover:text-[#0859A8] sm:w-auto"
                >
                  <Camera size={17} />
                  Change Photo
                </button>

                <p className="mt-2 text-xs text-[#8A96A3]">
                  JPG, PNG or WEBP. Maximum 5MB.
                </p>
              </div>
            </div>
          </section>

          {/* PERSONAL INFORMATION */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                <User size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Personal Information
                </h2>

                <p className="text-xs leading-relaxed text-[#8A96A3] sm:text-sm">
                  Update your basic contact information.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-5">
              {[
                {
                  label: "First Name",
                  name: "firstName",
                  type: "text",
                  required: true,
                },
                {
                  label: "Last Name",
                  name: "lastName",
                  type: "text",
                  required: true,
                },
                {
                  label: "Phone Number",
                  name: "phoneNumber",
                  type: "tel",
                  placeholder: "+92 300 1234567",
                },
                {
                  label: "Location",
                  name: "location",
                  type: "text",
                  placeholder: "Karachi, Pakistan",
                },
              ].map((field) => (
                <div key={field.name} className="min-w-0">
                  <label className="mb-2 block text-sm font-semibold text-[#25364A]">
                    {field.label}
                    {field.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </label>

                  <input
                    type={field.type}
                    name={field.name}
                    data-field={field.name}
                    value={currentFormData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full min-w-0 rounded-lg border ${borderClass(
                      field.name,
                    )} bg-white px-3.5 py-3 text-sm text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4`}
                  />

                  <FieldError message={fieldErrors[field.name]} />
                </div>
              ))}
            </div>
          </section>

          {/* PROFESSIONAL */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                <BriefcaseBusiness size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Professional Information
                </h2>

                <p className="text-xs leading-relaxed text-[#8A96A3] sm:text-sm">
                  Tell candidates more about your professional background.
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-[#25364A]">
                  Position
                </label>

                <input
                  type="text"
                  name="position"
                  data-field="position"
                  value={currentFormData.position}
                  onChange={handleChange}
                  placeholder="HR Manager / Talent Acquisition Specialist"
                  className={`w-full min-w-0 rounded-lg border ${borderClass(
                    "position",
                  )} bg-white px-3.5 py-3 text-sm text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4`}
                />

                <FieldError message={fieldErrors.position} />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-[#25364A]">
                  Bio
                </label>

                <textarea
                  name="bio"
                  data-field="bio"
                  value={currentFormData.bio}
                  onChange={handleChange}
                  rows={5}
                  maxLength={500}
                  placeholder="Write a short professional introduction..."
                  className={`w-full resize-none rounded-lg border ${borderClass(
                    "bio",
                  )} bg-white px-3.5 py-3 text-sm leading-6 text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4`}
                />

                <div className="mt-1 flex items-start justify-between gap-3">
                  <FieldError message={fieldErrors.bio} />

                  <p className="ml-auto text-right text-xs text-[#8A96A3]">
                    {currentFormData.bio.length}/500
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SKILLS */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
              Skills
            </h2>

            <p className="mb-4 mt-1 text-xs leading-relaxed text-[#8A96A3] sm:mb-5 sm:text-sm">
              Add professional skills related to your role.
            </p>

            <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="min-w-0 flex-1 rounded-lg border border-[#C8D5E0] bg-white px-3.5 py-3 text-sm text-[#25364A] outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4"
                placeholder="e.g. Recruitment"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#064A8E] sm:w-auto"
              >
                <Plus size={17} />
                Add
              </button>
            </div>

            {currentFormData.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                {currentFormData.skills.map((skill, index) => (
                  <div
                    key={`${skill}-${index}`}
                    className="flex max-w-full items-center gap-2 rounded-full bg-[#E6EFF8] px-3.5 py-2 text-xs font-medium text-[#0859A8] sm:text-sm"
                  >
                    <span className="wrap-break-words">{skill}</span>

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-full px-1 transition hover:bg-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SOCIAL */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
              Social Profiles
            </h2>

            <p className="mb-4 mt-1 text-xs leading-relaxed text-[#8A96A3] sm:mb-5 sm:text-sm">
              Add your professional social links.
            </p>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-5">
              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-[#25364A]">
                  LinkedIn
                </label>

                <input
                  type="url"
                  name="linkedin"
                  data-field="linkedin"
                  value={currentFormData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className={`w-full min-w-0 rounded-lg border ${borderClass(
                    "linkedin",
                  )} bg-white px-3.5 py-3 text-sm text-[#25364A] outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4`}
                />

                <FieldError message={fieldErrors.linkedin} />
              </div>

              <div className="min-w-0">
                <label className="mb-2 block text-sm font-semibold text-[#25364A]">
                  GitHub
                </label>

                <input
                  type="url"
                  name="github"
                  data-field="github"
                  value={currentFormData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/yourusername"
                  className={`w-full min-w-0 rounded-lg border ${borderClass(
                    "github",
                  )} bg-white px-3.5 py-3 text-sm text-[#25364A] outline-none focus:border-[#0859A8] focus:ring-2 focus:ring-[#E6EFF8] sm:px-4`}
                />

                <FieldError message={fieldErrors.github} />
              </div>
            </div>
          </section>

          {/* EDUCATION */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                  <GraduationCap size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Education
                  </h2>

                  <p className="text-xs leading-relaxed text-[#8A96A3] sm:text-sm">
                    Add your educational background.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addEducation}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0859A8] px-4 py-2.5 text-sm font-semibold text-[#0859A8] transition hover:bg-[#E6EFF8] sm:w-auto"
              >
                <Plus size={16} />
                Add Education
              </button>
            </div>

            {currentFormData.education.length === 0 ? (
              <p className="rounded-xl bg-[#F8FAFC] px-4 py-4 text-xs text-[#8A96A3] sm:px-5 sm:text-sm">
                No education added yet.
              </p>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {currentFormData.education.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="min-w-0 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5"
                  >
                    <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-bold text-[#25364A]">
                        Education {index + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="flex w-fit items-center gap-1.5 text-sm font-medium text-[#D64545]"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                      <div className="min-w-0">
                        <input
                          type="text"
                          data-field={`education.${index}.degree`}
                          value={item.degree || ""}
                          onChange={(e) =>
                            updateEducation(index, "degree", e.target.value)
                          }
                          placeholder="Degree"
                          className={`w-full min-w-0 rounded-lg border ${borderClass(
                            `education.${index}.degree`,
                          )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                        />

                        <FieldError
                          message={fieldErrors[`education.${index}.degree`]}
                        />
                      </div>

                      <div className="min-w-0">
                        <input
                          type="text"
                          data-field={`education.${index}.institution`}
                          value={item.institution || ""}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "institution",
                              e.target.value,
                            )
                          }
                          placeholder="Institution"
                          className={`w-full min-w-0 rounded-lg border ${borderClass(
                            `education.${index}.institution`,
                          )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                        />

                        <FieldError
                          message={
                            fieldErrors[`education.${index}.institution`]
                          }
                        />
                      </div>

                      <div className="min-w-0">
                        <input
                          type="text"
                          data-field={`education.${index}.fieldOfStudy`}
                          value={item.fieldOfStudy || ""}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "fieldOfStudy",
                              e.target.value,
                            )
                          }
                          placeholder="Field of Study"
                          className={`w-full min-w-0 rounded-lg border ${borderClass(
                            `education.${index}.fieldOfStudy`,
                          )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                        />

                        <FieldError
                          message={
                            fieldErrors[`education.${index}.fieldOfStudy`]
                          }
                        />
                      </div>

                      <div className="grid min-w-0 grid-cols-1 gap-4 min-[380px]:grid-cols-2">
                        <div className="min-w-0">
                          <input
                            type="number"
                            data-field={`education.${index}.startYear`}
                            value={item.startYear || ""}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "startYear",
                                e.target.value,
                              )
                            }
                            placeholder="Start Year"
                            className={`w-full min-w-0 rounded-lg border ${borderClass(
                              `education.${index}.startYear`,
                            )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`education.${index}.startYear`]
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <input
                            type="number"
                            data-field={`education.${index}.endYear`}
                            value={item.endYear || ""}
                            disabled={item.currentlyStudying}
                            onChange={(e) =>
                              updateEducation(index, "endYear", e.target.value)
                            }
                            placeholder="End Year"
                            className={`w-full min-w-0 rounded-lg border ${borderClass(
                              `education.${index}.endYear`,
                            )} bg-white px-3.5 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-[#EEF2F5] disabled:text-[#9AA6B2] focus:border-[#0859A8] sm:px-4`}
                          />

                          <FieldError
                            message={fieldErrors[`education.${index}.endYear`]}
                          />
                        </div>
                      </div>
                    </div>

                    <label className="mt-4 flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(item.currentlyStudying)}
                        onChange={(e) =>
                          handleCurrentlyStudyingChange(index, e.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#C8D5E0] text-[#0859A8] focus:ring-[#0859A8]"
                      />

                      <span className="text-xs font-medium leading-5 text-[#52606D] sm:text-sm">
                        I am currently studying here
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* EXPERIENCE */}

          <section className="min-w-0 rounded-2xl border border-[#DCE3E8] bg-white p-4 shadow-sm sm:p-7">
            <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8] text-[#0859A8]">
                  <BriefcaseBusiness size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                    Experience
                  </h2>

                  <p className="text-xs leading-relaxed text-[#8A96A3] sm:text-sm">
                    Add your professional experience.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={addExperience}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#0859A8] px-4 py-2.5 text-sm font-semibold text-[#0859A8] transition hover:bg-[#E6EFF8] sm:w-auto"
              >
                <Plus size={16} />
                Add Experience
              </button>
            </div>

            {currentFormData.experience.length === 0 ? (
              <p className="rounded-xl bg-[#F8FAFC] px-4 py-4 text-xs text-[#8A96A3] sm:px-5 sm:text-sm">
                No experience added yet.
              </p>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {currentFormData.experience.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="min-w-0 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5"
                  >
                    <div className="mb-4 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-sm font-bold text-[#25364A]">
                        Experience {index + 1}
                      </h3>

                      <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="flex w-fit items-center gap-1.5 text-sm font-medium text-[#D64545]"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`experience.${index}.jobTitle`}
                            value={item.jobTitle || ""}
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "jobTitle",
                                e.target.value,
                              )
                            }
                            placeholder="Job Title"
                            className={`w-full min-w-0 rounded-lg border ${borderClass(
                              `experience.${index}.jobTitle`,
                            )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`experience.${index}.jobTitle`]
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <input
                            type="text"
                            data-field={`experience.${index}.company`}
                            value={item.company || ""}
                            onChange={(e) =>
                              updateExperience(index, "company", e.target.value)
                            }
                            placeholder="Company"
                            className={`w-full min-w-0 rounded-lg border ${borderClass(
                              `experience.${index}.company`,
                            )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                          />

                          <FieldError
                            message={fieldErrors[`experience.${index}.company`]}
                          />
                        </div>
                      </div>

                      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
                        <div className="min-w-0">
                          <label className="mb-2 block text-xs font-semibold text-[#68798A]">
                            Start Date
                          </label>

                          <input
                            type="date"
                            data-field={`experience.${index}.startDate`}
                            value={
                              item.startDate
                                ? String(item.startDate).slice(0, 10)
                                : ""
                            }
                            onChange={(e) =>
                              updateExperience(
                                index,
                                "startDate",
                                e.target.value,
                              )
                            }
                            className={`w-full min-w-0 rounded-lg border ${borderClass(
                              `experience.${index}.startDate`,
                            )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                          />

                          <FieldError
                            message={
                              fieldErrors[`experience.${index}.startDate`]
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <label className="mb-2 block text-xs font-semibold text-[#68798A]">
                            End Date
                          </label>

                          <input
                            type="date"
                            data-field={`experience.${index}.endDate`}
                            value={
                              item.endDate
                                ? String(item.endDate).slice(0, 10)
                                : ""
                            }
                            disabled={item.currentlyWorking}
                            onChange={(e) =>
                              updateExperience(index, "endDate", e.target.value)
                            }
                            className={`w-full min-w-0 rounded-lg border ${borderClass(
                              `experience.${index}.endDate`,
                            )} bg-white px-3.5 py-3 text-sm outline-none disabled:cursor-not-allowed disabled:bg-[#EEF2F5] disabled:text-[#9AA6B2] focus:border-[#0859A8] sm:px-4`}
                          />

                          <FieldError
                            message={fieldErrors[`experience.${index}.endDate`]}
                          />
                        </div>
                      </div>

                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={Boolean(item.currentlyWorking)}
                          onChange={(e) =>
                            handleCurrentlyWorkingChange(
                              index,
                              e.target.checked,
                            )
                          }
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#C8D5E0] text-[#0859A8] focus:ring-[#0859A8]"
                        />

                        <span className="text-xs font-medium leading-5 text-[#52606D] sm:text-sm">
                          I am currently working here
                        </span>
                      </label>

                      <div className="min-w-0">
                        <textarea
                          data-field={`experience.${index}.description`}
                          value={item.description || ""}
                          onChange={(e) =>
                            updateExperience(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          rows={4}
                          placeholder="Describe your responsibilities and achievements..."
                          className={`w-full resize-none rounded-lg border ${borderClass(
                            `experience.${index}.description`,
                          )} bg-white px-3.5 py-3 text-sm outline-none focus:border-[#0859A8] sm:px-4`}
                        />

                        <FieldError
                          message={
                            fieldErrors[`experience.${index}.description`]
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 pb-6 sm:flex-row sm:justify-end sm:pb-8">
            <Link
              to="/recruiter/profile"
              className="flex w-full items-center justify-center rounded-lg border border-[#C8D5E0] bg-white px-5 py-3 text-sm font-semibold text-[#52606D] transition hover:bg-[#F8FAFC] sm:w-auto"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#064A8E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Profile;

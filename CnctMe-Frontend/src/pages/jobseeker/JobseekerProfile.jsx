import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Edit,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  BriefcaseBusiness,
  GraduationCap,
  User,
  X,
} from "lucide-react";

import {
  getRecruiterProfile,
  selectRecruiterProfile,
  selectRecruiterProfileLoading,
  selectRecruiterProfileError,
} from "../../features/recruiter/recruiterSlice";

import api from "../../api/axios";
import getApiError from "../../utils/apiError";
import { formatMonthYear } from "../../utils/date";

const JobseekerProfile = () => {
  const dispatch = useDispatch();

  const profile = useSelector(selectRecruiterProfile);
  const loading = useSelector(selectRecruiterProfileLoading);
  const error = useSelector(selectRecruiterProfileError);

  const [showImageModal, setShowImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

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
      } catch (err) {
        setProfileImage(null);
        getApiError(err);
      }
    };

    loadProfilePicture();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  // CLOSE MODAL WITH ESCAPE
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
        <div className="mx-auto min-w-0 max-w-5xl animate-pulse">
          <div className="mb-6">
            <div className="mb-2 h-3 w-32 rounded bg-[#E6EFF8]" />
            <div className="h-8 w-48 rounded-lg bg-[#DDE7EF]" />
            <div className="mt-2 h-3 w-64 max-w-full rounded bg-[#EEF2F6]" />
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white">
            <div className="flex items-center gap-6 bg-[#E6EFF8] px-8 py-9">
              <div className="h-28 w-28 shrink-0 rounded-full border-4 border-white bg-[#D7E4ED]" />

              <div className="flex-1">
                <div className="h-7 w-56 max-w-full rounded-lg bg-[#D7E4ED]" />
                <div className="mt-3 h-4 w-40 max-w-full rounded bg-[#D7E4ED]" />
              </div>
            </div>

            <div className="space-y-4 p-8">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-20 rounded-xl border border-[#E0E7ED] bg-[#FBFCFD]"
                />
              ))}
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

  // DERIVED VALUES
  const userName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.firstName || profile.lastName || "User";

  const initials =
    `${profile.firstName?.charAt(0) || ""}${
      profile.lastName?.charAt(0) || ""
    }`.toUpperCase() || "U";

  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  const educationItems = Array.isArray(profile.education)
    ? profile.education
    : [];

  const experienceItems = Array.isArray(profile.experience)
    ? profile.experience
    : [];

  const isCurrentlyStudying = (item) =>
    item?.currentlyStudying === true || !item?.endYear;

  const isCurrentlyWorking = (item) =>
    item?.currentlyWorking === true || !item?.endDate;

  return (
    <div className="min-h-[calc(100vh-73px)] min-w-0 overflow-x-hidden bg-[#F8FAFC] px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-10">
      <div className="mx-auto min-w-0 max-w-5xl">
        {/* PAGE HEADER */}
        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#0859A8]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0859A8] sm:text-xs">
                Jobseeker Profile
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
            to="/jobseeker/profile/edit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#064985] hover:shadow-md sm:w-auto"
          >
            <Edit size={17} />
            Edit Profile
          </Link>
        </div>

        {/* MAIN PROFILE CARD */}
        <div className="overflow-hidden rounded-2xl border border-[#D5E1EB] bg-white shadow-[0_6px_24px_rgba(8,89,168,0.07)]">
          {/* PROFILE HERO */}
          <section className="relative overflow-hidden border-b border-[#DDE7EF] bg-[#E6EFF8] px-5 py-7 sm:px-8 sm:py-9">
            {/* DECORATIVE CIRCLES */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border-20 border-white/30" />

            <div className="pointer-events-none absolute -bottom-16 right-24 h-32 w-32 rounded-full bg-white/20" />

            <div className="relative flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
              {/* PROFILE IMAGE */}
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
                    {initials}
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

              {/* HERO INFO */}
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h2 className="wrap-break-words text-2xl font-bold tracking-tight text-[#25364A] sm:text-3xl">
                      {userName}
                    </h2>

                    <span className="inline-flex shrink-0 items-center rounded-full border border-[#BFD5E5] bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0859A8]">
                      Jobseeker
                    </span>
                  </div>

                  {profile.position ? (
                    <p className="text-sm font-medium text-[#526170] sm:text-base">
                      {profile.position}
                    </p>
                  ) : (
                    <p className="text-sm italic text-[#8998A6]">
                      Add your professional position from Edit Profile.
                    </p>
                  )}

                  {/* CONTACT CHIPS */}
                  <div className="mt-2 flex min-w-0 flex-wrap gap-2">
                    {profile.email && (
                      <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                        <Mail size={14} className="shrink-0 text-[#0859A8]" />

                        <span className="truncate">{profile.email}</span>
                      </div>
                    )}

                    {profile.phoneNumber && (
                      <div className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                        <Phone size={14} className="shrink-0 text-[#0859A8]" />

                        <span>{profile.phoneNumber}</span>
                      </div>
                    )}

                    {profile.location && (
                      <div className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#526170]">
                        <MapPin size={14} className="shrink-0 text-[#0859A8]" />

                        <span className="truncate">{profile.location}</span>
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
                  Your basic personal and contact information.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* FIRST NAME */}
              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  First Name
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.firstName || "Not provided"}
                </p>
              </div>

              {/* LAST NAME */}
              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Last Name
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.lastName || "Not provided"}
                </p>
              </div>

              {/* EMAIL */}
              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4 sm:col-span-2 lg:col-span-1">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Email
                </p>

                <p className="mt-1.5 break-all text-sm font-semibold text-[#25364A]">
                  {profile.email || "Not provided"}
                </p>
              </div>

              {/* PHONE */}
              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Phone Number
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.phoneNumber || "Not provided"}
                </p>
              </div>

              {/* LOCATION */}
              <div className="rounded-xl border border-[#E0E7ED] bg-[#FBFCFD] p-4 sm:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Location
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.location || "Not provided"}
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
                  Your professional background and introduction.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* POSITION */}
              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Professional Position
                </p>

                <p className="mt-1.5 wrap-break-words text-sm font-semibold text-[#25364A]">
                  {profile.position || "Not provided"}
                </p>
              </div>

              {/* PROFILE TYPE */}
              <div className="rounded-xl border border-[#DDE7EF] bg-white p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#8998A6]">
                  Account / Profile Type
                </p>

                <p className="mt-1.5 text-sm font-semibold text-[#25364A]">
                  Jobseeker
                </p>
              </div>

              {/* ABOUT */}
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

          {/* SKILLS */}
          <section className="border-b border-[#DDE7EF] p-5 sm:p-8">
            <div className="mb-5">
              <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                Skills
              </h2>

              <p className="mt-1 text-xs text-[#8998A6]">
                Professional skills listed on your profile.
              </p>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="inline-flex items-center rounded-lg border border-[#BFD5E5] bg-[#E6EFF8] px-3 py-2 text-xs font-semibold text-[#0859A8]"
                  >
                    {skill}
                  </span>
                ))}
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
                Your professional online presence.
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
                    <p className="text-xs font-bold text-[#526170]">LinkedIn</p>

                    {profile.linkedin ? (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
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
                        rel="noopener noreferrer"
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

          {/* EDUCATION */}
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
                  Your educational background.
                </p>
              </div>
            </div>

            {educationItems.length > 0 ? (
              <div className="space-y-4">
                {educationItems.map((item, index) => {
                  const studying = isCurrentlyStudying(item);

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
                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="wrap-break-words text-sm font-bold text-[#25364A]">
                                {item?.degree || "Degree not specified"}
                              </h3>

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
                            </div>

                            {studying && (
                              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#0859A8] px-3 py-1.5 text-[11px] font-bold text-white">
                                Currently Studying
                              </span>
                            )}
                          </div>

                          {(item?.startYear || item?.endYear || studying) && (
                            <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#DDE7EF] bg-white px-3 py-2 text-xs font-medium text-[#68798A]">
                              <CalendarDays
                                size={14}
                                className="shrink-0 text-[#0859A8]"
                              />

                              <span className="wrap-break-words">
                                {item.startYear || "—"} -{" "}
                                {studying ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-[#0859A8]">
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

          {/* EXPERIENCE */}
          <section className="p-5 sm:p-8">
            <div className="mb-5 flex items-start gap-3 sm:mb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3F2F0]">
                <BriefcaseBusiness size={18} className="text-[#526170]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#25364A] sm:text-lg">
                  Experience
                </h2>

                <p className="mt-0.5 text-xs text-[#8998A6]">
                  Your professional work experience.
                </p>
              </div>
            </div>

            {experienceItems.length > 0 ? (
              <div className="space-y-4">
                {experienceItems.map((item, index) => {
                  const startDate = formatMonthYear(item?.startDate);
                  const endDate = formatMonthYear(item?.endDate);
                  const working = isCurrentlyWorking(item);

                  return (
                    <div
                      key={item?._id || index}
                      className="rounded-xl border border-[#D7E4ED] bg-[#F8FBFD] p-4 sm:p-5"
                    >
                      <div className="flex gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E6EFF8]">
                          <BriefcaseBusiness
                            size={18}
                            className="text-[#0859A8]"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <h3 className="wrap-break-words text-sm font-bold text-[#25364A]">
                                {item?.jobTitle || "Job title not specified"}
                              </h3>

                              {item?.company && (
                                <p className="mt-1 wrap-break-words text-xs font-semibold text-[#526170]">
                                  {item.company}
                                </p>
                              )}
                            </div>

                            {working && (
                              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-[#0859A8] px-3 py-1.5 text-[11px] font-bold text-white">
                                Currently Working
                              </span>
                            )}
                          </div>

                          {startDate && (
                            <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg border border-[#DDE7EF] bg-white px-3 py-2 text-xs font-medium text-[#68798A]">
                              <CalendarDays
                                size={14}
                                className="shrink-0 text-[#0859A8]"
                              />

                              <span className="wrap-break-words">
                                {startDate} -{" "}
                                {working ? (
                                  <span className="inline-flex items-center gap-1 font-bold text-[#0859A8]">
                                    Present
                                  </span>
                                ) : (
                                  endDate || "—"
                                )}
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

      {/* PROFILE IMAGE MODAL */}
      {showImageModal && profileImage && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-[#25364A]/80 p-4 backdrop-blur-sm"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative"
            onClick={(event) => event.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setShowImageModal(false)}
              className="absolute -right-3 -top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white text-[#25364A] shadow-lg transition hover:bg-[#F3F6F8]"
              aria-label="Close profile picture"
            >
              <X size={18} />
            </button>

            {/* COMPLETE IMAGE INSIDE CIRCLE */}
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
    </div>
  );
};

export default JobseekerProfile;

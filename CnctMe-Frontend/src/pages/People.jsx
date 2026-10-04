import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  Users,
  UserRound,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

import {
  getPublicUsers,
  selectPeople,
  selectPeopleLoading,
  selectPeopleError,
} from "../features/people/peopleSlice";

import { selectUser } from "../features/auth/authSlice";

const getProfilePictureUrl = (userId) => {
  if (!userId) {
    return "";
  }

  return `${import.meta.env.VITE_API_URL}/users/public/${userId}/profile-picture`;
};

const getInitials = (user) => {
  if (!user) {
    return "U";
  }

  const first = user.firstName?.charAt(0) || "";
  const last = user.lastName?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "U";
};

// ERROR MESSAGE
const getErrorMessage = (errorValue) => {
  if (!errorValue) {
    return "Failed to load people.";
  }

  if (typeof errorValue === "string") {
    return errorValue;
  }

  if (typeof errorValue === "object") {
    if (typeof errorValue.general === "string") {
      return errorValue.general;
    }

    if (typeof errorValue.message === "string") {
      return errorValue.message;
    }

    if (typeof errorValue.error === "string") {
      return errorValue.error;
    }

    if (
      errorValue.general &&
      typeof errorValue.general === "object" &&
      typeof errorValue.general.message === "string"
    ) {
      return errorValue.general.message;
    }
  }

  return "Failed to load people.";
};

// PEOPLE
const People = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(selectPeople);
  const loading = useSelector(selectPeopleLoading);
  const error = useSelector(selectPeopleError);
  const currentUser = useSelector(selectUser);

  const [search, setSearch] = useState("");
  const [activeRole, setActiveRole] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Keep the existing 6-card layout.
  const USERS_PER_PAGE = 9;

  // FETCH PEOPLE
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        getPublicUsers({
          search: search.trim() || undefined,
          role: activeRole || undefined,
          page: currentPage,
          limit: USERS_PER_PAGE,
        }),
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [dispatch, search, activeRole, currentPage]);

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleAllRole = () => {
    setActiveRole("");
    setCurrentPage(1);
  };

  const handleJobseekerRole = () => {
    setActiveRole("jobseeker");
    setCurrentPage(1);
  };

  const handleRecruiterRole = () => {
    setActiveRole("recruiter");
    setCurrentPage(1);
  };

  const hasNextPage = users.length === USERS_PER_PAGE;
  const hasPreviousPage = currentPage > 1;

  const handlePreviousPage = () => {
    if (!hasPreviousPage || loading) {
      return;
    }

    setCurrentPage((previousPage) => previousPage - 1);
  };

  const handleNextPage = () => {
    if (!hasNextPage || loading) {
      return;
    }

    setCurrentPage((previousPage) => previousPage + 1);
  };

  // VIEW PROFILE
  const handleViewProfile = (userId) => {
    if (!currentUser) {
      navigate(`/login?redirect=${encodeURIComponent(`/profile/${userId}`)}`);

      return;
    }

    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MainNavbar />

      <main className="pt-16">
        {/* ==========================================
            HERO / SEARCH SECTION
        ========================================== */}
        <section className="relative overflow-hidden border-b border-[#DCE3E8] bg-[#F3F2F0]">
          {/* Decorative background */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#0A66C2]/5 blur-3xl sm:h-72 sm:w-72" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-56 w-56 rounded-full bg-[#38BDF8]/5 blur-3xl sm:h-72 sm:w-72" />

          <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            {/* ==========================================
        HEADING
    ========================================== */}

            <div className="mb-5 flex items-start gap-3 sm:mb-6 sm:gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#0A66C2] shadow-sm sm:h-11 sm:w-11">
                <Users size={21} strokeWidth={2} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="h-7 w-1 shrink-0 rounded-full bg-[#0A66C2] sm:h-8" />

                  <h1 className="text-xl font-bold tracking-tight text-[#16212B] sm:text-2xl">
                    People
                  </h1>
                </div>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#697586]">
                  Discover professionals, recruiters, and jobseekers across
                  CnctMe and connect with people who match your career goals.
                </p>
              </div>
            </div>

            {/* ==========================================
        SEARCH + FILTERS
    ========================================== */}

            <div className="rounded-2xl border border-[#DCE3E8] bg-white p-3 shadow-sm sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                {/* SEARCH */}

                <div className="relative min-w-0 flex-1">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A97A6]"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search people by name, position, skill..."
                    className="h-12 w-full rounded-xl border border-[#DCE3E8] bg-[#F8FAFC] pl-11 pr-11 text-sm text-[#25364A] outline-none transition placeholder:text-[#8A97A6] focus:border-[#0A66C2] focus:bg-white focus:ring-2 focus:ring-[#0A66C2]/10"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8A97A6] transition hover:bg-[#EEF2F6] hover:text-[#526273]"
                      aria-label="Clear search"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>

                {/* ROLE FILTERS */}

                <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
                  <button
                    type="button"
                    onClick={handleAllRole}
                    className={`h-12 rounded-xl px-3 text-sm font-semibold transition sm:px-5 ${
                      activeRole === ""
                        ? "bg-[#0A66C2] text-white shadow-sm"
                        : "border border-[#DCE3E8] bg-white text-[#526273] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    }`}
                  >
                    All
                  </button>

                  <button
                    type="button"
                    onClick={handleJobseekerRole}
                    className={`h-12 rounded-xl px-3 text-sm font-semibold transition sm:px-5 ${
                      activeRole === "jobseeker"
                        ? "bg-[#0A66C2] text-white shadow-sm"
                        : "border border-[#DCE3E8] bg-white text-[#526273] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    }`}
                  >
                    Jobseekers
                  </button>

                  <button
                    type="button"
                    onClick={handleRecruiterRole}
                    className={`h-12 rounded-xl px-3 text-sm font-semibold transition sm:px-5 ${
                      activeRole === "recruiter"
                        ? "bg-[#0A66C2] text-white shadow-sm"
                        : "border border-[#DCE3E8] bg-white text-[#526273] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                    }`}
                  >
                    Recruiters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            PEOPLE SECTION
        ========================================== */}

        <section className="bg-[#F8FAFC] py-8 sm:py-10 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-600 sm:px-5">
                {getErrorMessage(error)}
              </div>
            )}

            {/* ==========================================
                RESULTS HEADER
            ========================================== */}

            {!loading && !error && users.length > 0 && (
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-[#16212B] sm:text-xl">
                    Discover People
                  </h2>

                  <p className="mt-1 text-sm leading-5 text-[#697586]">
                    {search.trim()
                      ? `Showing people matching "${search.trim()}"`
                      : activeRole === "jobseeker"
                        ? "Discover jobseekers across HireHub."
                        : activeRole === "recruiter"
                          ? "Discover recruiters across HireHub."
                          : "Explore professionals and recruiters across HireHub."}
                  </p>
                </div>

                <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[#DCE3E8] bg-white px-4 py-2 text-sm font-medium text-[#526273] shadow-sm">
                  <Users size={15} className="shrink-0 text-[#0A66C2]" />

                  <span>
                    {users.length} {users.length === 1 ? "Person" : "People"}
                  </span>
                </div>
              </div>
            )}

            {/* ==========================================
                LOADING SKELETONS
            ========================================== */}

            {loading && (
              <div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                aria-label="Loading people"
                aria-busy="true"
              >
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-[#DCE3E8] bg-white p-5 shadow-sm sm:p-6"
                  >
                    {/* Profile Header */}

                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 shrink-0 animate-pulse rounded-full bg-[#E6EFF8] sm:h-16 sm:w-16" />

                      <div className="min-w-0 flex-1">
                        <div className="h-5 w-32 animate-pulse rounded bg-[#E6EFF8]" />

                        <div className="mt-2 h-3.5 w-28 animate-pulse rounded bg-[#EEF2F6]" />

                        <div className="mt-3 h-6 w-20 animate-pulse rounded-full bg-[#EEF2F6]" />
                      </div>
                    </div>

                    {/* Location */}

                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-[#E6EFF8]" />

                      <div className="h-3.5 w-32 animate-pulse rounded bg-[#EEF2F6]" />
                    </div>

                    {/* Skills */}

                    <div className="mt-4 flex gap-2">
                      <div className="h-7 w-16 animate-pulse rounded-full bg-[#EEF2F6]" />

                      <div className="h-7 w-20 animate-pulse rounded-full bg-[#EEF2F6]" />

                      <div className="h-7 w-14 animate-pulse rounded-full bg-[#EEF2F6]" />
                    </div>

                    {/* Button */}

                    <div className="mt-5 h-10 w-full animate-pulse rounded-lg bg-[#E6EFF8]" />
                  </div>
                ))}
              </div>
            )}

            {/* ==========================================
                PEOPLE GRID
            ========================================== */}

            {!loading && users.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {users.map((user) => {
                  const imageUrl = getProfilePictureUrl(user._id);
                  const initials = getInitials(user);

                  return (
                    <article
                      key={user._id}
                      className="group flex h-full min-w-0 flex-col rounded-2xl border border-[#DCE3E8] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#C7DBEE] hover:shadow-md sm:p-6"
                    >
                      {/* ==========================================
                          PROFILE HEADER
                      ========================================== */}

                      <div className="flex min-w-0 items-start gap-4">
                        {/* PROFILE IMAGE */}

                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#0A66C2] sm:h-16 sm:w-16">
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                            {initials}
                          </div>

                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={`${user.firstName || ""} ${
                                user.lastName || ""
                              }`}
                              className="absolute inset-0 h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          )}
                        </div>

                        {/* USER INFO */}

                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-base font-bold text-[#16212B]">
                            {user.firstName} {user.lastName}
                          </h2>

                          {/* POSITION (always rendered) */}

                          <p
                            className={`mt-1 truncate text-sm font-medium ${
                              user.position
                                ? "text-[#0A66C2]"
                                : "text-[#8A97A6]"
                            }`}
                          >
                            {user.position || "No data"}
                          </p>

                          <div className="mt-2">
                            <span className="inline-flex max-w-full rounded-full bg-[#E6EFF8] px-2.5 py-1 text-xs font-medium capitalize text-[#0A66C2]">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ==========================================
                          LOCATION (always rendered)
                      ========================================== */}

                      <div className="mt-5 flex min-w-0 items-center gap-2 border-t border-[#EEF2F6] pt-4 text-sm text-[#697586]">
                        <MapPin size={16} className="shrink-0 text-[#8A97A6]" />

                        <span
                          className={`truncate ${
                            user.location ? "" : "text-[#8A97A6]"
                          }`}
                        >
                          {user.location || "No data"}
                        </span>
                      </div>

                      {/* ==========================================
                          SKILLS (always rendered)
                      ========================================== */}

                      <div className="mt-4 flex min-h-7 flex-wrap items-center gap-1.5">
                        {user.skills?.length > 0 ? (
                          <>
                            {user.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={`${skill}-${index}`}
                                className="max-w-full truncate rounded-full border border-[#DCE3E8] bg-[#F8FAFC] px-2.5 py-1 text-xs text-[#526273]"
                              >
                                {skill}
                              </span>
                            ))}

                            {user.skills.length > 3 && (
                              <span className="rounded-full border border-[#DCE3E8] bg-[#F8FAFC] px-2.5 py-1 text-xs text-[#697586]">
                                +{user.skills.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-[#8A97A6]">
                            No data
                          </span>
                        )}
                      </div>

                      {/* ==========================================
                          VIEW PROFILE (pinned to bottom)
                      ========================================== */}

                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={() => handleViewProfile(user._id)}
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#0A66C2] px-4 text-sm font-semibold text-white transition hover:bg-[#0959A8] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]/20 focus:ring-offset-2"
                        >
                          <UserRound size={16} />
                          <span>View Complete Profile</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ==========================================
                PAGINATION
            ========================================== */}

            {!loading && !error && (users.length > 0 || currentPage > 1) && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={!hasPreviousPage || loading}
                  className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                    !hasPreviousPage || loading
                      ? "cursor-not-allowed border-[#E5EAF0] bg-[#F8FAFC] text-[#B0BAC5]"
                      : "border-[#DCE3E8] bg-white text-[#526273] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                  }`}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                {/* CURRENT PAGE */}

                <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#E6EFF8] px-4 text-sm font-bold text-[#0A66C2]">
                  {currentPage}
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={!hasNextPage || loading}
                  className={`flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition ${
                    !hasNextPage || loading
                      ? "cursor-not-allowed border-[#E5EAF0] bg-[#F8FAFC] text-[#B0BAC5]"
                      : "border-[#DCE3E8] bg-white text-[#526273] hover:border-[#0A66C2] hover:text-[#0A66C2]"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* ==========================================
                EMPTY STATE
            ========================================== */}

            {!loading && !error && users.length === 0 && (
              <div className="mx-auto max-w-lg rounded-3xl border border-[#DCE3E8] bg-white px-5 py-12 text-center shadow-sm sm:px-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6EFF8] text-[#0A66C2]">
                  <Users size={28} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-[#16212B]">
                  No people found
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#697586]">
                  Try changing your search or selecting a different role.
                </p>

                {(search || activeRole) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveRole("");
                      setCurrentPage(1);
                    }}
                    className="mt-5 rounded-xl border border-[#DCE3E8] bg-white px-4 py-2.5 text-sm font-semibold text-[#0A66C2] transition hover:border-[#0A66C2] hover:bg-[#E6EFF8]"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default People;

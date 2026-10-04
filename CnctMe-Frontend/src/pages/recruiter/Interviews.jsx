import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Search,
  X,
  RefreshCw,
  CalendarDays,
  Clock,
  BriefcaseBusiness,
  Video,
  Eye,
  Pencil,
  Check,
  Ban,
  ExternalLink,
  RotateCcw,
  MapPin,
  User,
  Loader2,
  CheckCircle2,
  UserRound,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Card from "../../components/ui/Card";

import {
  getAllInterviews,
  updateInterview,
  completeInterview,
  cancelInterview,
  rescheduleInterview,
  updateApplicationStatus,
  selectInterviews,
  selectInterviewsLoading,
  selectInterviewsError,
  selectUpdateInterviewLoading,
  selectCompleteInterviewLoading,
  selectCancelInterviewLoading,
  selectRescheduleInterviewLoading,
  selectStatusUpdating,
} from "../../features/recruiter/recruiterSlice";

// ==================================================
// HELPERS
// ==================================================

const formatDateForInput = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

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

// ==================================================
// CANDIDATE HELPERS
// ==================================================

const isPopulatedUser = (val) =>
  val &&
  typeof val === "object" &&
  (val.firstName || val.lastName || val.name || val.fullName);

const getCandidate = (interview) => {
  if (isPopulatedUser(interview?.candidate)) {
    return interview.candidate;
  }

  if (isPopulatedUser(interview?.application?.user)) {
    return interview.application.user;
  }

  return null;
};

const getCandidateName = (interview) => {
  const candidate = getCandidate(interview);

  if (!candidate) {
    return "Unknown Applicant";
  }

  const firstName =
    typeof candidate.firstName === "string" ? candidate.firstName.trim() : "";

  const lastName =
    typeof candidate.lastName === "string" ? candidate.lastName.trim() : "";

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName;
  }

  if (typeof candidate.name === "string" && candidate.name.trim()) {
    return candidate.name.trim();
  }

  if (typeof candidate.fullName === "string" && candidate.fullName.trim()) {
    return candidate.fullName.trim();
  }

  return "Unknown Applicant";
};

// JOB
const getJobTitle = (interview) => {
  return (
    interview?.application?.job?.title ||
    interview?.job?.title ||
    "Job position"
  );
};

const getLocation = (interview) => {
  return (
    interview?.application?.job?.location ||
    interview?.job?.location ||
    "Location not specified"
  );
};

// PROFILE PICTURE
const getProfilePicture = (interview) => {
  const candidate = getCandidate(interview);

  const picture = candidate?.profilePicture;

  if (!picture) {
    return null;
  }

  if (typeof picture === "string") {
    if (picture.startsWith("http") || picture.startsWith("data:")) {
      return picture;
    }

    return `data:image/jpeg;base64,${picture}`;
  }

  if (picture?.data) {
    try {
      const bytes = Array.isArray(picture.data)
        ? picture.data
        : picture.data?.data;

      if (!Array.isArray(bytes)) {
        return null;
      }

      const chunkSize = 0x8000;
      let binary = "";

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.slice(i, i + chunkSize);
        binary += String.fromCharCode(...chunk);
      }

      const base64 = btoa(binary);

      return `data:${picture.contentType || "image/jpeg"};base64,${base64}`;
    } catch (error) {
      console.error("Profile picture conversion error:", error);
      return null;
    }
  }

  return null;
};

// APPLICATION
const getApplicationId = (interview) => {
  const application = interview?.application;

  if (!application) {
    return null;
  }

  if (typeof application === "object") {
    return application?._id || application?.id || null;
  }

  return application;
};

const getApplicationStatus = (interview) => {
  return interview?.application?.status || "Interview";
};

const getStatusClasses = (status) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getApplicationStatusClasses = (status) => {
  switch (status) {
    case "Applied":
      return "bg-gray-50 text-gray-700 border-gray-200";

    case "Under Review":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "Shortlisted":
      return "bg-indigo-50 text-indigo-700 border-indigo-200";

    case "Interview":
      return "bg-purple-50 text-purple-700 border-purple-200";

    case "Selected":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";

    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

// ==================================================
// STAT CARD
// ==================================================

const StatCard = ({ title, value, icon: Icon, description }) => {
  return (
    <Card className="border-0 shadow-sm">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 sm:text-sm">
            {title}
          </p>

          <p className="mt-1.5 text-xl font-bold text-[#25364A] sm:mt-2 sm:text-2xl">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E6EFF8] text-[#526170] sm:h-11 sm:w-11">
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
};

// ==================================================
// INTERVIEW SKELETON
// ==================================================

const InterviewSkeleton = () => {
  return (
    <Card className="min-w-0 border-0 shadow-sm">
      <div className="animate-pulse">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
              <div className="h-12 w-12 shrink-0 rounded-full bg-[#E6EFF8] sm:h-16 sm:w-16" />

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                  <div className="h-4 w-36 rounded-md bg-[#E2E8F0] sm:h-5 sm:w-44" />

                  <div className="h-6 w-20 rounded-full bg-[#EEF2F6]" />
                </div>

                <div className="mt-2.5 h-3.5 w-48 max-w-full rounded-md bg-[#EEF2F6] sm:w-64" />

                <div className="mt-3 flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2">
                  <div className="h-3.5 w-28 rounded-md bg-[#EEF2F6]" />

                  <div className="h-3.5 w-24 rounded-md bg-[#EEF2F6]" />

                  <div className="h-3.5 w-36 rounded-md bg-[#EEF2F6]" />
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2 xl:justify-end">
              <div className="h-9 w-full rounded-lg bg-[#EEF2F6] sm:w-32" />

              <div className="h-9 w-full rounded-lg bg-[#EEF2F6] sm:w-20" />

              <div className="h-9 w-full rounded-lg bg-[#E6EFF8] sm:w-20" />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="h-3 w-28 rounded-md bg-[#E2E8F0]" />

              <div className="mt-2 h-3 w-64 max-w-full rounded-md bg-[#EEF2F6]" />
            </div>

            <div className="h-10 w-full rounded-lg bg-[#EEF2F6] sm:w-40" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// ==================================================
// MAIN COMPONENT
// ==================================================

const Interviews = () => {
  const dispatch = useDispatch();

  const interviews = useSelector(selectInterviews);
  const loading = useSelector(selectInterviewsLoading);
  const error = useSelector(selectInterviewsError);
  const updateLoading = useSelector(selectUpdateInterviewLoading);
  const completeLoading = useSelector(selectCompleteInterviewLoading);
  const cancelLoading = useSelector(selectCancelInterviewLoading);
  const rescheduleLoading = useSelector(selectRescheduleInterviewLoading);
  const statusUpdating = useSelector(selectStatusUpdating);

  const [searchInterviews, setSearchInterviews] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const interviewsPerPage = 5;

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const [form, setForm] = useState({
    date: "",
    time: "",
    meetingLink: "",
  });

  useEffect(() => {
    dispatch(getAllInterviews());
  }, [dispatch]);

  // STATISTICS
  const totalInterviews = interviews.length;

  const scheduledInterviews = interviews.filter(
    (interview) => interview.status === "Scheduled",
  ).length;

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "Completed",
  ).length;

  const cancelledInterviews = interviews.filter(
    (interview) => interview.status === "Cancelled",
  ).length;

  // FILTER
  const filteredInterviews = useMemo(() => {
    const search = searchInterviews.trim().toLowerCase();

    return interviews.filter((interview) => {
      const candidateName = getCandidateName(interview).toLowerCase();

      const candidateEmail =
        getCandidate(interview)?.email?.toLowerCase() || "";

      const jobTitle = getJobTitle(interview).toLowerCase();

      const matchesSearch =
        !search ||
        candidateName.includes(search) ||
        candidateEmail.includes(search) ||
        jobTitle.includes(search);

      const matchesStatus =
        statusFilter === "All" || interview.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [interviews, searchInterviews, statusFilter]);

  // PAGINATION
  const totalPages = Math.ceil(filteredInterviews.length / interviewsPerPage);

  const safeCurrentPage =
    totalPages > 0 ? Math.min(currentPage, totalPages) : 1;

  const startIndex = (safeCurrentPage - 1) * interviewsPerPage;

  const endIndex = startIndex + interviewsPerPage;

  const paginatedInterviews = filteredInterviews.slice(startIndex, endIndex);

  const handleView = (interview) => {
    setSelectedInterview(interview);
    setShowViewModal(true);
  };

  const handleEdit = (interview) => {
    setSelectedInterview(interview);

    setForm({
      date: formatDateForInput(interview.date),
      time: interview.time || "",
      meetingLink: interview.meetingLink || "",
    });

    setShowEditModal(true);
  };

  // OPEN RESCHEDULE
  const handleReschedule = (interview) => {
    setSelectedInterview(interview);

    setForm({
      date: formatDateForInput(interview.date),
      time: interview.time || "",
      meetingLink: interview.meetingLink || "",
    });

    setShowRescheduleModal(true);
  };

  // FORM CHANGE
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // UPDATE INTERVIEW
  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!selectedInterview) {
      return;
    }

    const result = await dispatch(
      updateInterview({
        interviewId: selectedInterview._id,
        date: form.date,
        time: form.time,
        meetingLink: form.meetingLink,
      }),
    );

    if (updateInterview.fulfilled.match(result)) {
      setShowEditModal(false);
      setSelectedInterview(null);

      await dispatch(getAllInterviews());
    }
  };

  // RESCHEDULE
  const handleRescheduleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedInterview) {
      return;
    }

    const result = await dispatch(
      rescheduleInterview({
        interviewId: selectedInterview._id,
        date: form.date,
        time: form.time,
        meetingLink: form.meetingLink,
      }),
    );

    if (rescheduleInterview.fulfilled.match(result)) {
      setShowRescheduleModal(false);
      setSelectedInterview(null);

      await dispatch(getAllInterviews());
    }
  };

  // COMPLETE
  const handleComplete = async () => {
    if (!selectedInterview) {
      return;
    }

    const result = await dispatch(completeInterview(selectedInterview._id));

    if (completeInterview.fulfilled.match(result)) {
      setShowCompleteModal(false);
      setSelectedInterview(null);

      await dispatch(getAllInterviews());
    }
  };

  // CANCEL
  const handleCancel = async () => {
    if (!selectedInterview) {
      return;
    }

    const result = await dispatch(cancelInterview(selectedInterview._id));

    if (cancelInterview.fulfilled.match(result)) {
      setShowCancelModal(false);
      setSelectedInterview(null);

      await dispatch(getAllInterviews());
    }
  };

  // CHANGE APPLICATION STATUS
  const handleApplicationStatusChange = async (interview, newStatus) => {
    const applicationId = getApplicationId(interview);

    const currentApplicationStatus = getApplicationStatus(interview);

    if (!applicationId) {
      return;
    }

    if (!newStatus || newStatus === currentApplicationStatus) {
      return;
    }

    if (newStatus === "Selected" && interview.status !== "Completed") {
      return;
    }

    if (
      currentApplicationStatus === "Selected" ||
      currentApplicationStatus === "Rejected"
    ) {
      return;
    }

    const result = await dispatch(
      updateApplicationStatus({
        applicationId,
        status: newStatus,
      }),
    );

    if (updateApplicationStatus.fulfilled.match(result)) {
      await dispatch(getAllInterviews());

      if (selectedInterview?._id === interview._id) {
        setSelectedInterview(null);
        setShowViewModal(false);
      }
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowCompleteModal(false);
    setShowCancelModal(false);
    setShowRescheduleModal(false);
    setSelectedInterview(null);
  };

  // PAGINATION HANDLERS
  const handlePreviousPage = () => {
    setCurrentPage((previousPage) => Math.max(previousPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previousPage) => Math.min(previousPage + 1, totalPages));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchInterviews(event.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInterviews("");
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#F8FAFC]">
        <div className="px-3 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-8">
          {/* HEADER */}

          <div className="mb-6 flex min-w-0 flex-col gap-4 sm:mb-7 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#25364A] sm:text-2xl">
                Interviews
              </h1>

              <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-gray-500 sm:text-sm">
                Manage scheduled, completed and cancelled candidate interviews.
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(getAllInterviews())}
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-[#25364A] shadow-sm transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* STATS */}

          <div className="mb-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
            <StatCard
              title="Total Interviews"
              value={totalInterviews}
              icon={CalendarDays}
              description="All interviews"
            />

            <StatCard
              title="Scheduled Interviews"
              value={scheduledInterviews}
              icon={Clock}
              description="Currently scheduled"
            />

            <StatCard
              title="Completed Interviews"
              value={completedInterviews}
              icon={Check}
              description="Successfully completed"
            />

            <StatCard
              title="Cancelled Interviews"
              value={cancelledInterviews}
              icon={Ban}
              description="Cancelled interviews"
            />
          </div>

          {/* FILTERS */}

          <Card className="mb-5 border-0 shadow-sm sm:mb-6">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#526170]"
                />

                <input
                  type="text"
                  value={searchInterviews}
                  onChange={handleSearchChange}
                  placeholder="Search candidate or job..."
                  className="w-full min-w-0 rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-10 text-sm outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
                />

                {searchInterviews && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-[#25364A] outline-none focus:border-[#0859A8] lg:w-auto lg:min-w-44"
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </Card>

          {/* ERROR */}

          {error?.general && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700 sm:mb-6 sm:text-sm">
              {error.general}
            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="min-w-0 space-y-4">
              <InterviewSkeleton />
              <InterviewSkeleton />
              <InterviewSkeleton />
            </div>
          )}

          {/* EMPTY */}

          {!loading && filteredInterviews.length === 0 && (
            <Card className="border-0 py-10 text-center shadow-sm sm:py-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8] text-[#526170]">
                <CalendarDays size={26} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-[#25364A]">
                No interviews found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-gray-500 sm:text-sm">
                {searchInterviews || statusFilter !== "All"
                  ? "Try changing your search or filter."
                  : "Interviews will appear here when you schedule them for candidates."}
              </p>
            </Card>
          )}

          {/* INTERVIEWS */}

          {!loading && filteredInterviews.length > 0 && (
            <>
              <div className="min-w-0 space-y-4">
                {paginatedInterviews.map((interview) => {
                  const profilePicture = getProfilePicture(interview);

                  const candidateName = getCandidateName(interview);

                  const applicationStatus = getApplicationStatus(interview);

                  const applicationId = getApplicationId(interview);

                  const isFinalStatus =
                    applicationStatus === "Selected" ||
                    applicationStatus === "Rejected";

                  const canSelect =
                    interview.status === "Completed" && !isFinalStatus;

                  return (
                    <Card
                      key={interview._id}
                      className="min-w-0 border-0 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex min-w-0 flex-col gap-5">
                        {/* TOP */}

                        <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                          {/* LEFT */}

                          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                            {/* CANDIDATE IMAGE */}

                            {profilePicture ? (
                              <img
                                src={profilePicture}
                                alt={candidateName}
                                className="h-13 w-13 shrink-0 rounded-full object-cover sm:h-16 sm:w-16"
                              />
                            ) : (
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6EFF8] text-[#526170] sm:h-16 sm:w-16">
                                <User size={22} className="sm:h-6.5 sm:w-6.5" />
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex min-w-0 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2.5">
                                <h3 className="max-w-full truncate text-sm font-semibold text-[#25364A] sm:text-base">
                                  {candidateName}
                                </h3>

                                <span
                                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium sm:text-xs ${getStatusClasses(
                                    interview.status,
                                  )}`}
                                >
                                  {interview.status}
                                </span>
                              </div>

                              <p className="mt-1 flex min-w-0 items-start gap-2 text-xs text-gray-500 sm:text-sm">
                                <BriefcaseBusiness
                                  size={14}
                                  className="mt-0.5 shrink-0"
                                />

                                <span className="wrap-break-words">
                                  {getJobTitle(interview)}
                                </span>
                              </p>

                              <div className="mt-2.5 flex min-w-0 flex-col gap-2 text-xs text-gray-500 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2 sm:text-sm">
                                <span className="flex items-start gap-2">
                                  <CalendarDays
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />

                                  <span>{formatDate(interview.date)}</span>
                                </span>

                                <span className="flex items-start gap-2">
                                  <Clock
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />

                                  <span>
                                    {interview.time || "Time not specified"}
                                  </span>
                                </span>

                                <span className="flex min-w-0 items-start gap-2">
                                  <MapPin
                                    size={14}
                                    className="mt-0.5 shrink-0"
                                  />

                                  <span className="wrap-break-words">
                                    {getLocation(interview)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* ACTIONS */}

                          <div className="flex min-w-0 flex-wrap items-center gap-2 xl:justify-end">
                            {/* VIEW APPLICATION */}

                            {applicationId && (
                              <Link
                                to={`/recruiter/applications/${applicationId}`}
                                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#D7E4ED] bg-[#F8FBFD] px-3 py-2 text-xs font-medium text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#E6EFF8] hover:text-[#0859A8] sm:w-auto sm:text-sm"
                              >
                                <UserRound
                                  size={16}
                                  className="text-[#526170]"
                                />
                                View Candidate
                              </Link>
                            )}

                            {/* VIEW INTERVIEW */}

                            <button
                              type="button"
                              onClick={() => handleView(interview)}
                              className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] sm:w-auto sm:text-sm"
                            >
                              <Eye size={16} />
                              View
                            </button>

                            {interview.status === "Scheduled" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleEdit(interview)}
                                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] sm:w-auto sm:text-sm"
                                >
                                  <Pencil size={16} />
                                  Edit
                                </button>

                                {interview.meetingLink && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      window.open(
                                        interview.meetingLink,
                                        "_blank",
                                        "noopener,noreferrer",
                                      )
                                    }
                                    className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#064985] sm:w-auto sm:text-sm"
                                  >
                                    <Video size={16} />
                                    Join
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedInterview(interview);
                                    setShowCompleteModal(true);
                                  }}
                                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 sm:w-auto sm:text-sm"
                                >
                                  <Check size={16} />
                                  Complete
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedInterview(interview);
                                    setShowCancelModal(true);
                                  }}
                                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 sm:w-auto sm:text-sm"
                                >
                                  <Ban size={16} />
                                  Cancel
                                </button>
                              </>
                            )}

                            {interview.status === "Cancelled" && (
                              <button
                                type="button"
                                onClick={() => handleReschedule(interview)}
                                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#064985] sm:w-auto sm:text-sm"
                              >
                                <RotateCcw size={16} />
                                Reschedule
                              </button>
                            )}

                            {interview.status === "Completed" &&
                              interview.meetingLink && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.open(
                                      interview.meetingLink,
                                      "_blank",
                                      "noopener,noreferrer",
                                    )
                                  }
                                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] sm:w-auto sm:text-sm"
                                >
                                  <ExternalLink size={16} />
                                  Meeting Link
                                </button>
                              )}
                          </div>
                        </div>

                        {/* APPLICATION STATUS */}

                        <div className="flex min-w-0 flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                              Application Status
                            </p>

                            <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500">
                              {interview.status === "Completed"
                                ? "Interview completed. You can now select or reject the candidate."
                                : "Application status"}
                            </p>
                          </div>

                          {applicationId ? (
                            <select
                              value={applicationStatus}
                              onChange={(event) =>
                                handleApplicationStatusChange(
                                  interview,
                                  event.target.value,
                                )
                              }
                              disabled={statusUpdating || isFinalStatus}
                              className={`w-full rounded-lg border px-3 py-2 text-sm font-medium outline-none focus:border-[#0859A8] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-45 sm:w-auto ${getApplicationStatusClasses(
                                applicationStatus,
                              )}`}
                            >
                              <option value="Interview">Interview</option>

                              {canSelect && (
                                <option value="Selected">Selected</option>
                              )}

                              {!isFinalStatus && (
                                <option value="Rejected">Rejected</option>
                              )}
                            </select>
                          ) : (
                            <span className="text-xs text-red-500">
                              Application unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-xs text-gray-500 sm:text-sm">
                    Showing{" "}
                    <span className="font-medium text-[#25364A]">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-[#25364A]">
                      {Math.min(endIndex, filteredInterviews.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[#25364A]">
                      {filteredInterviews.length}
                    </span>{" "}
                    interviews
                  </p>

                  <div className="flex items-center gap-1">
                    {/* PREVIOUS */}

                    <button
                      type="button"
                      onClick={handlePreviousPage}
                      disabled={safeCurrentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    {/* PAGE NUMBERS */}

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
                          safeCurrentPage === page
                            ? "border-[#0859A8] bg-[#0859A8] text-white"
                            : "border-gray-200 bg-white text-[#25364A] hover:border-[#0859A8] hover:text-[#0859A8]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* NEXT */}

                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={safeCurrentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#25364A] transition hover:border-[#0859A8] hover:text-[#0859A8] disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Next page"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ==================================================
          VIEW MODAL
      ================================================== */}

      {showViewModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:px-4">
          <div className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            <div className="flex min-w-0 items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#25364A]">
                  Interview Details
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Complete interview information
                </p>
              </div>

              <button
                type="button"
                onClick={closeModals}
                className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-4 sm:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6EFF8] text-[#526170]">
                  <User size={22} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-[#25364A]">
                    {getCandidateName(selectedInterview)}
                  </h3>

                  <p className="break-all text-xs text-gray-500 sm:text-sm">
                    {getCandidate(selectedInterview)?.email ||
                      "Email unavailable"}
                  </p>
                </div>
              </div>

              {getApplicationId(selectedInterview) && (
                <Link
                  to={`/recruiter/applications/${getApplicationId(
                    selectedInterview,
                  )}`}
                  onClick={closeModals}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#D7E4ED] bg-[#F8FBFD] px-4 py-3 text-sm font-semibold text-[#25364A] transition hover:border-[#0859A8] hover:bg-[#E6EFF8] hover:text-[#0859A8]"
                >
                  <UserRound size={17} className="text-[#526170]" />
                  View Candidate Application
                  <ExternalLink size={15} className="text-[#526170]" />
                </Link>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Position</p>

                  <p className="mt-1 wrap-break-words text-sm font-medium text-[#25364A]">
                    {getJobTitle(selectedInterview)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Interview Status</p>

                  <span
                    className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      selectedInterview.status,
                    )}`}
                  >
                    {selectedInterview.status}
                  </span>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Date</p>

                  <p className="mt-1 text-sm font-medium text-[#25364A]">
                    {formatDate(selectedInterview.date)}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-xs text-gray-400">Time</p>

                  <p className="mt-1 text-sm font-medium text-[#25364A]">
                    {selectedInterview.time || "Not specified"}
                  </p>
                </div>
              </div>

              {/* APPLICATION STATUS */}

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Application Status</p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
                      Selected is available after interview completion. Rejected
                      can be selected at any interview stage.
                    </p>
                  </div>

                  {getApplicationId(selectedInterview) ? (
                    <select
                      value={getApplicationStatus(selectedInterview)}
                      onChange={(event) =>
                        handleApplicationStatusChange(
                          selectedInterview,
                          event.target.value,
                        )
                      }
                      disabled={
                        statusUpdating ||
                        getApplicationStatus(selectedInterview) ===
                          "Selected" ||
                        getApplicationStatus(selectedInterview) === "Rejected"
                      }
                      className={`w-full rounded-lg border px-3 py-2 text-sm font-medium outline-none focus:border-[#0859A8] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-40 sm:w-auto ${getApplicationStatusClasses(
                        getApplicationStatus(selectedInterview),
                      )}`}
                    >
                      <option value="Interview">Interview</option>

                      {selectedInterview.status === "Completed" && (
                        <option value="Selected">Selected</option>
                      )}

                      {getApplicationStatus(selectedInterview) !== "Selected" &&
                        getApplicationStatus(selectedInterview) !==
                          "Rejected" && (
                          <option value="Rejected">Rejected</option>
                        )}
                    </select>
                  ) : (
                    <span className="text-xs text-red-500">
                      Application unavailable
                    </span>
                  )}
                </div>
              </div>

              {selectedInterview.meetingLink && (
                <div className="rounded-lg border border-[#E6EFF8] bg-[#F8FBFE] p-4">
                  <p className="text-xs text-gray-400">Meeting Link</p>

                  <a
                    href={selectedInterview.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-start gap-2 break-all text-sm font-medium text-[#0859A8] hover:underline"
                  >
                    <ExternalLink size={15} className="mt-0.5 shrink-0" />

                    <span className="break-all">
                      {selectedInterview.meetingLink}
                    </span>
                  </a>
                </div>
              )}

              {selectedInterview.status === "Cancelled" && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="font-medium text-red-800">
                    This interview has been cancelled.
                  </p>

                  <p className="mt-1 text-sm text-red-700">
                    You can reschedule this interview for the candidate.
                  </p>
                </div>
              )}

              {selectedInterview.status === "Completed" && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        Interview completed
                      </p>

                      <p className="mt-1 text-xs text-emerald-700">
                        You can now mark the candidate as Selected or Rejected.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
              {selectedInterview.status === "Cancelled" && (
                <button
                  type="button"
                  onClick={() => {
                    setShowViewModal(false);
                    handleReschedule(selectedInterview);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#064985] sm:w-auto"
                >
                  <RotateCcw size={16} />
                  Reschedule Interview
                </button>
              )}

              <button
                type="button"
                onClick={closeModals}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#25364A] hover:bg-gray-50 sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          EDIT MODAL
      ================================================== */}

      {showEditModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:px-4">
          <div className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            <div className="flex min-w-0 items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#25364A]">
                  Edit Interview
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Update interview details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModals}
                className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5 p-4 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#25364A]">
                  Interview Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0859A8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#25364A]">
                  Interview Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0859A8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#25364A]">
                  Meeting Link
                </label>

                <input
                  type="url"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/..."
                  required
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0859A8]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModals}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#25364A] hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#064985] disabled:opacity-50 sm:w-auto"
                >
                  {updateLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          RESCHEDULE MODAL
      ================================================== */}

      {showRescheduleModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:px-4">
          <div className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]">
            <div className="flex min-w-0 items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#25364A]">
                  Reschedule Interview
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Choose a new date and time for this candidate.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModals}
                className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleRescheduleSubmit}
              className="space-y-5 p-4 sm:p-6"
            >
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-red-800">
                  Current interview status: Cancelled
                </p>

                <p className="mt-1 text-xs leading-relaxed text-red-700">
                  After rescheduling, the interview will become Scheduled again.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#25364A]">
                  New Interview Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0859A8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#25364A]">
                  New Interview Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0859A8]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#25364A]">
                  Meeting Link
                </label>

                <input
                  type="url"
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/..."
                  required
                  className="w-full min-w-0 rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#0859A8]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModals}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#25364A] hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={rescheduleLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#064985] disabled:opacity-50 sm:w-auto"
                >
                  {rescheduleLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  Reschedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          COMPLETE MODAL
      ================================================== */}

      {showCompleteModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:px-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Check size={22} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#25364A]">
              Complete Interview?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Mark the interview with{" "}
              <strong>{getCandidateName(selectedInterview)}</strong> as
              completed.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModals}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#25364A] sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleComplete}
                disabled={completeLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
              >
                {completeLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Complete Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          CANCEL MODAL
      ================================================== */}

      {showCancelModal && selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:px-4">
          <div className="my-auto w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Ban size={22} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#25364A]">
              Cancel Interview?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              The interview will be marked as cancelled. The candidate's
              application will remain in the Interview stage and can be
              rescheduled later.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModals}
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#25364A] sm:w-auto"
              >
                Keep Interview
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelLoading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 sm:w-auto"
              >
                {cancelLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Cancel Interview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Interviews;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Eye,
  UserCircle,
  Ban,
  CheckCircle,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  ShieldCheck,
  BriefcaseBusiness,
  UserRound,
  CalendarDays,
  Mail,
} from "lucide-react";

import {
  fetchAdminUsers,
  fetchAdminUserById,
  blockAdminUser,
  unblockAdminUser,
  deleteAdminUser,
  clearSelectedUser,
} from "../../features/admin/adminSlice";

import Select from "../../components/ui/Select";

const ROLE_OPTIONS = [
  {
    label: "Job Seekers",
    value: "jobseeker",
  },
  {
    label: "Recruiters",
    value: "recruiter",
  },
  {
    label: "Admins",
    value: "admin",
  },
];

const STATUS_OPTIONS = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Blocked",
    value: "blocked",
  },
];

// PROFILE IMAGE HELPER
const getProfileImageSrc = (profilePicture) => {
  if (!profilePicture?.data) {
    return null;
  }

  const contentType = profilePicture.contentType || "image/jpeg";

  let imageData = profilePicture.data;

  if (
    imageData &&
    typeof imageData === "object" &&
    imageData.type === "Buffer" &&
    Array.isArray(imageData.data)
  ) {
    imageData = imageData.data;
  }

  if (Array.isArray(imageData)) {
    try {
      let binary = "";

      const bytes = new Uint8Array(imageData);
      const chunkSize = 8192;

      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));

        binary += String.fromCharCode(...chunk);
      }

      return `data:${contentType};base64,${btoa(binary)}`;
    } catch (error) {
      console.error("Failed to convert profile image:", error);
      return null;
    }
  }

  if (typeof imageData === "string") {
    if (imageData.startsWith("data:")) {
      return imageData;
    }

    return `data:${contentType};base64,${imageData}`;
  }

  return null;
};

// PROFILE AVATAR
const ProfileAvatar = ({ user, size = "h-12 w-12" }) => {
  const imageSrc = getProfileImageSrc(user?.profilePicture);

  const initials = (
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}` ||
    user?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E6EFF8] font-semibold text-[#0859A8]`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};

// USER NAME
const getUserName = (user) => {
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  return fullName || "Unnamed User";
};

const getRoleStyles = (role) => {
  switch (role) {
    case "admin":
      return "bg-purple-50 text-purple-700 border border-purple-100";

    case "recruiter":
      return "bg-blue-50 text-[#0859A8] border border-blue-100";

    case "jobseeker":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";

    default:
      return "bg-gray-50 text-gray-600 border border-gray-100";
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";

    case "blocked":
      return "bg-red-50 text-red-700 border border-red-100";

    default:
      return "bg-gray-50 text-gray-600 border border-gray-100";
  }
};

const RoleIcon = ({ role }) => {
  if (role === "admin") {
    return <ShieldCheck size={14} />;
  }

  if (role === "recruiter") {
    return <BriefcaseBusiness size={14} />;
  }

  return <UserRound size={14} />;
};

// TABLE SKELETON
const UserTableSkeleton = () => {
  return (
    <>
      {Array.from({ length: 7 }).map((_, index) => (
        <tr key={index} className="border-b border-gray-100 last:border-b-0">
          {/* USER */}

          <td className="px-3 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-gray-200" />

              <div className="min-w-0 flex-1">
                <div className="h-3.5 w-32 animate-pulse rounded bg-gray-200" />

                <div className="mt-2 h-3 w-44 max-w-full animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </td>

          {/* ROLE */}

          <td className="px-3 py-4 sm:px-5">
            <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />
          </td>

          {/* STATUS */}

          <td className="px-3 py-4 sm:px-5">
            <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
          </td>

          {/* JOINED */}

          <td className="px-3 py-4 sm:px-5">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          </td>

          {/* ACTIONS */}

          <td className="px-3 py-4 sm:px-5">
            <div className="flex items-center justify-end gap-2">
              <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />

              <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />

              <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />

              <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

// USER DETAILS SKELETON
const UserDetailsSkeleton = () => {
  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6">
      {/* PROFILE */}

      <div className="flex flex-col items-center">
        <div className="h-24 w-24 animate-pulse rounded-full bg-gray-200" />

        <div className="mt-4 h-5 w-36 animate-pulse rounded bg-gray-200" />

        <div className="mt-2 h-4 w-48 max-w-full animate-pulse rounded bg-gray-100" />

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-gray-200" />

          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>

      {/* DETAILS */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl bg-[#F8FAFC] p-4">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

            <div className="mt-2 h-4 w-32 max-w-full animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* BUTTONS */}

      <div className="mt-6 h-10 w-full animate-pulse rounded-xl bg-gray-200" />

      <div className="mt-3 h-10 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
};

// ADMIN USERS
const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    users = [],
    usersPagination,
    selectedUser,

    usersLoading,
    userDetailsLoading,
    userActionLoading,

    usersError,
    userDetailsError,
    userActionError,
  } = useSelector((state) => state.admin);

  // LOCAL STATE
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  const [page, setPage] = useState(1);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);

  // FETCH USERS
  useEffect(() => {
    dispatch(
      fetchAdminUsers({
        search,
        role,
        status,
        page,
        limit: 10,
        sort: "createdAt",
        order: "desc",
      }),
    );
  }, [dispatch, search, role, status, page]);

  // SEARCH
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ROLE FILTER
  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setPage(1);
  };

  // STATUS FILTER
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // VIEW USER DETAILS MODAL
  const handleViewUser = async (user) => {
    if (!user?._id) {
      return;
    }

    setShowDetailsModal(true);

    dispatch(clearSelectedUser());

    await dispatch(fetchAdminUserById(user._id));
  };

  // VIEW FULL USER PROFILE
  const handleViewProfile = (user) => {
    if (!user?._id) {
      return;
    }

    navigate(`/admin/users/${user._id}/profile`);
  };

  // CLOSE DETAILS MODAL
  const handleCloseDetails = () => {
    setShowDetailsModal(false);

    dispatch(clearSelectedUser());
  };

  // OPEN BLOCK MODAL
  const handleOpenBlockModal = (user) => {
    setUserToBlock(user);
    setShowBlockModal(true);
  };

  // CLOSE BLOCK MODAL
  const handleCloseBlockModal = () => {
    setShowBlockModal(false);
    setUserToBlock(null);
  };

  // BLOCK / UNBLOCK USER
  const handleConfirmBlock = async () => {
    if (!userToBlock?._id) {
      return;
    }

    if (userToBlock.status === "blocked") {
      await dispatch(unblockAdminUser(userToBlock._id));
    } else {
      await dispatch(blockAdminUser(userToBlock._id));
    }

    handleCloseBlockModal();

    dispatch(
      fetchAdminUsers({
        search,
        role,
        status,
        page,
        limit: 10,
        sort: "createdAt",
        order: "desc",
      }),
    );
  };

  // OPEN DELETE MODAL
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // CLOSE DELETE MODAL
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // DELETE USER
  const handleConfirmDelete = async () => {
    if (!userToDelete?._id) {
      return;
    }

    const result = await dispatch(deleteAdminUser(userToDelete._id));

    if (!result.error) {
      handleCloseDeleteModal();

      dispatch(
        fetchAdminUsers({
          search,
          role,
          status,
          page,
          limit: 10,
          sort: "createdAt",
          order: "desc",
        }),
      );
    }
  };

  // PAGINATION
  const currentPage = usersPagination?.currentPage || page;
  const totalPages = usersPagination?.totalPages || 1;
  const totalUsers = usersPagination?.totalUsers || 0;

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F8FAFC] p-3 sm:p-5 md:p-7">
      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl font-bold text-[#25364A] sm:text-2xl">
          User Management
        </h1>

        <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
          Manage platform users, roles, and account status.
        </p>
      </div>

      {/* ========================================
          FILTERS
      ======================================== */}

      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
        <div className="grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,180px)_minmax(0,180px)]">
          {/* SEARCH */}

          <div className="relative min-w-0">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by name or email..."
              className="w-full min-w-0 rounded-xl border border-gray-200 bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-[#25364A] outline-none transition focus:border-[#0859A8] focus:ring-2 focus:ring-[#0859A8]/10"
            />
          </div>

          {/* ROLE */}

          <div className="min-w-0 w-full">
            <Select
              id="admin-user-role"
              name="role"
              value={role}
              onChange={handleRoleChange}
              options={ROLE_OPTIONS}
              placeholder="All Roles"
              className="w-full min-w-0 rounded-xl py-2.5 font-medium"
            />
          </div>

          {/* STATUS */}

          <div className="min-w-0 w-full">
            <Select
              id="admin-user-status"
              name="status"
              value={status}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
              placeholder="All Statuses"
              className="w-full min-w-0 rounded-xl py-2.5 font-medium"
            />
          </div>
        </div>
      </div>

      {/* ========================================
          ERROR
      ======================================== */}

      {(usersError || userDetailsError || userActionError) && (
        <div className="mb-5 wrap-break-words rounded-xl border border-red-100 bg-red-50 px-3 py-3 text-sm text-red-700 sm:px-4">
          {usersError || userDetailsError || userActionError}
        </div>
      )}

      {/* ========================================
          USERS TABLE
      ======================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* TABLE HEADER */}

        <div className="flex flex-col gap-1 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-[#25364A]">
              All Users
            </h2>

            <p className="mt-0.5 text-xs text-gray-500">
              {totalUsers} {totalUsers === 1 ? "user" : "users"} found
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-190">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F8FAFC] text-left">
                <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                  User
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                  Role
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                  Status
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                  Joined
                </th>

                <th className="whitespace-nowrap px-3 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {usersLoading ? (
                <UserTableSkeleton />
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E6EFF8] text-[#0859A8]">
                        <User size={24} />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-[#25364A]">
                        No users found
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-[#F8FAFC]/70"
                  >
                    {/* USER */}

                    <td className="px-3 py-4 sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <ProfileAvatar user={user} />

                        <div className="min-w-0 max-w-55">
                          <p className="truncate text-sm font-semibold text-[#25364A]">
                            {getUserName(user)}
                          </p>

                          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                            <Mail size={12} className="shrink-0" />

                            <span className="truncate">
                              {user.email || "No email"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}

                    <td className="px-3 py-4 sm:px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getRoleStyles(
                          user.role,
                        )}`}
                      >
                        <RoleIcon role={user.role} />

                        {user.role === "jobseeker"
                          ? "Job Seeker"
                          : user.role || "Unknown"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-4 sm:px-5">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(
                          user.status,
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            user.status === "active"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        {user.status || "Unknown"}
                      </span>
                    </td>

                    {/* JOINED */}

                    <td className="px-3 py-4 sm:px-5">
                      <div className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
                        <CalendarDays
                          size={15}
                          className="shrink-0 text-gray-400"
                        />

                        {formatDate(user.createdAt)}
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-3 py-4 sm:px-5">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW DETAILS */}

                        <button
                          type="button"
                          onClick={() => handleViewUser(user)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-[#0859A8]/20 hover:bg-[#E6EFF8] hover:text-[#0859A8]"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>

                        {/* FULL PROFILE */}

                        <button
                          type="button"
                          onClick={() => handleViewProfile(user)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-[#0859A8]/20 hover:bg-[#E6EFF8] hover:text-[#0859A8]"
                          title="View profile"
                        >
                          <UserCircle size={17} />
                        </button>

                        {/* BLOCK / UNBLOCK */}

                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => handleOpenBlockModal(user)}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition ${
                              user.status === "blocked"
                                ? "border-emerald-100 bg-white text-emerald-600 hover:bg-emerald-50"
                                : "border-gray-200 bg-white text-gray-500 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                            }`}
                            title={
                              user.status === "blocked"
                                ? "Unblock user"
                                : "Block user"
                            }
                          >
                            {user.status === "blocked" ? (
                              <CheckCircle size={16} />
                            ) : (
                              <Ban size={16} />
                            )}
                          </button>
                        )}

                        {/* DELETE */}

                        {user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(user)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        {!usersLoading && users.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================
          VIEW USER MODAL
      ======================================== */}

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[90vh]">
            {/* HEADER */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#25364A]">
                  User Details
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  View account information
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseDetails}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={19} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="min-h-0 overflow-y-auto">
              {userDetailsLoading ? (
                <UserDetailsSkeleton />
              ) : selectedUser ? (
                <div className="px-4 py-5 sm:px-6 sm:py-6">
                  {/* PROFILE */}

                  <div className="flex flex-col items-center">
                    <ProfileAvatar user={selectedUser} size="h-24 w-24" />

                    <h3 className="mt-4 max-w-full wrap-break-words text-center text-lg font-semibold text-[#25364A]">
                      {getUserName(selectedUser)}
                    </h3>

                    <p className="mt-1 max-w-full break-all text-center text-sm text-gray-500">
                      {selectedUser.email || "No email"}
                    </p>

                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getRoleStyles(
                          selectedUser.role,
                        )}`}
                      >
                        <RoleIcon role={selectedUser.role} />

                        {selectedUser.role === "jobseeker"
                          ? "Job Seeker"
                          : selectedUser.role}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyles(
                          selectedUser.status,
                        )}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            selectedUser.status === "active"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        {selectedUser.status}
                      </span>
                    </div>
                  </div>

                  {/* DETAILS */}

                  <div className="mt-7 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                    <div className="min-w-0 rounded-xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-medium text-gray-400">
                        First Name
                      </p>

                      <p className="mt-1 wrap-break-words text-sm font-semibold text-[#25364A]">
                        {selectedUser.firstName || "—"}
                      </p>
                    </div>

                    <div className="min-w-0 rounded-xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-medium text-gray-400">
                        Last Name
                      </p>

                      <p className="mt-1 wrap-break-words text-sm font-semibold text-[#25364A]">
                        {selectedUser.lastName || "—"}
                      </p>
                    </div>

                    <div className="min-w-0 rounded-xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-medium text-gray-400">Email</p>

                      <p className="mt-1 break-all text-sm font-semibold text-[#25364A]">
                        {selectedUser.email || "—"}
                      </p>
                    </div>

                    <div className="min-w-0 rounded-xl bg-[#F8FAFC] p-4">
                      <p className="text-xs font-medium text-gray-400">
                        Joined
                      </p>

                      <p className="mt-1 wrap-break-words text-sm font-semibold text-[#25364A]">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* VIEW FULL PROFILE */}

                  <button
                    type="button"
                    onClick={() => handleViewProfile(selectedUser)}
                    className="mt-5 w-full rounded-xl bg-[#0859A8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064985] sm:mt-6"
                  >
                    View Full Profile
                  </button>

                  {/* CLOSE */}

                  <button
                    type="button"
                    onClick={handleCloseDetails}
                    className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="px-4 py-12 text-center sm:px-6">
                  <p className="text-sm text-gray-500">
                    User details could not be loaded.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          BLOCK / UNBLOCK MODAL
      ======================================== */}

      {showBlockModal && userToBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  userToBlock.status === "blocked"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {userToBlock.status === "blocked" ? (
                  <CheckCircle size={21} />
                ) : (
                  <Ban size={21} />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[#25364A]">
                  {userToBlock.status === "blocked"
                    ? "Unblock User?"
                    : "Block User?"}
                </h3>

                <p className="mt-1 wrap-break-words text-sm leading-6 text-gray-500">
                  {userToBlock.status === "blocked"
                    ? `Are you sure you want to unblock ${getUserName(
                        userToBlock,
                      )}?`
                    : `Are you sure you want to block ${getUserName(
                        userToBlock,
                      )}?`}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={handleCloseBlockModal}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmBlock}
                disabled={userActionLoading}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
                  userToBlock.status === "blocked"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {userActionLoading
                  ? "Processing..."
                  : userToBlock.status === "blocked"
                    ? "Unblock User"
                    : "Block User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          DELETE MODAL
      ======================================== */}

      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={21} />
              </div>

              <div className="min-w-0">
                <h3 className="text-base font-semibold text-[#25364A]">
                  Delete User?
                </h3>

                <p className="mt-1 wrap-break-words text-sm leading-6 text-gray-500">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-[#25364A]">
                    {getUserName(userToDelete)}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={userActionLoading}
                className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                {userActionLoading ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;

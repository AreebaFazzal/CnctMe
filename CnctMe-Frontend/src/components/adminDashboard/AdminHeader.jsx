import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  X,
  BriefcaseBusiness,
  UserCheck,
  UserX,
  CalendarDays,
  RefreshCw,
  Flag,
  FileWarning,
  CircleAlert,
  Menu,
  ShieldCheck,
} from "lucide-react";

import api from "../../api/axios";

import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  clearNotificationError,
  selectNotifications,
  selectNotificationLoading,
  selectNotificationError,
  selectNotificationActionLoading,
  selectUnreadNotificationCount,
} from "../../features/notifications/notificationsSlice";

import { logoutUser } from "../../features/auth/authSlice";

import getApiError from "../../utils/apiError";

const AdminHeader = ({ user }) => {
  const dispatch = useDispatch();

  const notifications = useSelector(selectNotifications);
  const notificationLoading = useSelector(selectNotificationLoading);
  const notificationError = useSelector(selectNotificationError);
  const notificationActionLoading = useSelector(
    selectNotificationActionLoading,
  );
  const unreadCount = useSelector(selectUnreadNotificationCount);

  const [profileImage, setProfileImage] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notificationRef = useRef(null);

  const fullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Admin";

  // LOAD ADMIN PROFILE PICTURE
  useEffect(() => {
    let objectUrl = null;

    const loadProfilePicture = async () => {
      try {
        const response = await api.get("/users/profile-picture", {
          responseType: "blob",
        });

        objectUrl = URL.createObjectURL(response.data);

        setProfileImage(objectUrl);
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

  // FETCH NOTIFICATIONS ON MOUNT
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // TOGGLE NOTIFICATIONS
  const handleNotificationToggle = () => {
    const nextState = !notificationOpen;

    setNotificationOpen(nextState);

    if (nextState) {
      dispatch(fetchNotifications());
    } else {
      dispatch(clearNotificationError());
      setShowDeleteAllConfirm(false);
    }
  };

  // CLOSE NOTIFICATIONS ON OUTSIDE CLICK
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
        setShowDeleteAllConfirm(false);
      }
    };

    if (notificationOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [notificationOpen]);

  // CLOSE NOTIFICATIONS WITH ESCAPE
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
        setShowDeleteAllConfirm(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // MARK ONE AS READ
  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  // MARK ALL AS READ
  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) return;

    dispatch(markAllNotificationsAsRead());
  };

  // DELETE ONE NOTIFICATION
  const handleDeleteNotification = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  // SHOW DELETE ALL CONFIRMATION
  const handleDeleteAllNotifications = () => {
    if (notifications.length === 0) return;

    setShowDeleteAllConfirm(true);
  };

  // CONFIRM DELETE ALL
  const handleConfirmDeleteAllNotifications = () => {
    dispatch(deleteAllNotifications());
    setShowDeleteAllConfirm(false);
  };

  // CANCEL DELETE ALL
  const handleCancelDeleteAllNotifications = () => {
    setShowDeleteAllConfirm(false);
  };

  // LOGOUT
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // NOTIFICATION ICON
  const getNotificationIcon = (type) => {
    switch (type) {
      case "APPLICATION_RECEIVED":
        return <BriefcaseBusiness size={17} strokeWidth={2} />;

      case "APPLICATION_SHORTLISTED":
        return <UserCheck size={17} strokeWidth={2} />;

      case "APPLICATION_REJECTED":
        return <UserX size={17} strokeWidth={2} />;

      case "CANDIDATE_SELECTED":
        return <UserCheck size={17} strokeWidth={2} />;

      case "INTERVIEW_SCHEDULED":
        return <CalendarDays size={17} strokeWidth={2} />;

      case "INTERVIEW_UPDATED":
        return <RefreshCw size={17} strokeWidth={2} />;

      case "INTERVIEW_CANCELLED":
        return <X size={17} strokeWidth={2} />;

      case "REPORT_CREATED":
        return <Flag size={17} strokeWidth={2} />;

      case "USER_REPORTED":
        return <FileWarning size={17} strokeWidth={2} />;

      case "JOB_REPORTED":
        return <FileWarning size={17} strokeWidth={2} />;

      default:
        return <CircleAlert size={17} strokeWidth={2} />;
    }
  };

  // NOTIFICATION ICON STYLE
  const getNotificationIconStyle = (type) => {
    switch (type) {
      case "APPLICATION_RECEIVED":
      case "APPLICATION_SHORTLISTED":
      case "CANDIDATE_SELECTED":
        return "bg-[#EAF4FF] text-[#0859A8]";

      case "APPLICATION_REJECTED":
      case "INTERVIEW_CANCELLED":
        return "bg-[#FFF1F1] text-[#C0392B]";

      case "INTERVIEW_SCHEDULED":
      case "INTERVIEW_UPDATED":
        return "bg-[#EEF8F3] text-[#25865A]";

      case "REPORT_CREATED":
      case "USER_REPORTED":
      case "JOB_REPORTED":
        return "bg-[#FFF8E8] text-[#B27A00]";

      default:
        return "bg-[#F1F5F9] text-[#475569]";
    }
  };

  // RELATIVE TIME
  const getRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const notificationDate = new Date(date);

    const differenceInSeconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000,
    );

    if (differenceInSeconds < 60) {
      return "Just now";
    }

    const minutes = Math.floor(differenceInSeconds / 60);

    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 4) {
      return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }

    return notificationDate.toLocaleDateString();
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 flex h-18 items-center justify-between border-b border-[#DCE3E8] bg-white px-7 shadow-sm max-sm:px-4 sm:px-5 lg:px-7">
        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="flex items-center gap-3">
          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Open navigation menu"
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#25364A] transition hover:bg-[#F1F5F9] max-md:flex"
          >
            <Menu size={21} strokeWidth={2} />
          </button>

          {/* LOGO */}

          <div className="ml-8 max-md:ml-0 sm:ml-2 lg:ml-8">
            <Link
              to="/dashboard/admin"
              className="text-2xl font-bold tracking-tight text-[#25364A] transition-opacity hover:opacity-90 max-sm:text-xl"
            >
              Cnct<span className="text-[#0859A8]">Me</span>
            </Link>
          </div>

          {/* ADMIN LABEL */}

          <div className="ml-2 hidden items-center gap-2 md:flex lg:ml-5">
            <div className="h-6 w-px bg-[#DCE3E8]" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0859A8]">
                <ShieldCheck size={17} strokeWidth={2} />
              </div>

              <div>
                <p className="text-xs font-bold text-[#25364A]">Admin Panel</p>

                <p className="text-[10px] font-medium text-[#94A3B8]">
                  Platform management
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="flex items-center gap-4 max-sm:gap-2 sm:gap-3 lg:gap-4">
          {/* ==========================================
              NOTIFICATION
          ========================================== */}

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={handleNotificationToggle}
              aria-label="Notifications"
              aria-expanded={notificationOpen}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F0DFA8] bg-[#FFF9E8] text-[#C99700] transition hover:border-[#C99700] hover:bg-[#FFF4CC] max-sm:h-9 max-sm:w-9"
            >
              <Bell size={19} strokeWidth={2} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* ==========================================
                NOTIFICATION DROPDOWN
            ========================================== */}

            {notificationOpen && (
              <div
                className="
                  absolute right-0 top-13
                  w-100 max-w-[calc(100vw-2rem)]
                  overflow-hidden rounded-2xl
                  border border-[#DCE3E8]
                  bg-white
                  shadow-[0_12px_40px_rgba(37,54,74,0.15)]

                  max-md:fixed
                  max-md:right-2
                  max-md:top-18
                  max-md:w-[calc(100vw-1rem)]
                  max-md:max-w-none

                  max-sm:right-2
                  max-sm:left-2
                  max-sm:w-auto
                "
              >
                {/* DROPDOWN HEADER */}

                <div className="flex items-center justify-between gap-3 border-b border-[#E8EDF1] px-5 py-4 max-sm:px-4 max-sm:py-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#25364A]">
                      Notifications
                    </h3>

                    {unreadCount > 0 ? (
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        {unreadCount} unread{" "}
                        {unreadCount === 1 ? "notification" : "notifications"}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-xs text-[#64748B]">
                        You&apos;re all caught up
                      </p>
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="flex shrink-0 items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllAsRead}
                          disabled={notificationActionLoading === "all"}
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#0859A8] transition hover:bg-[#EAF4FF] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <CheckCheck size={13} />

                          <span className="hidden sm:inline">Mark all</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleDeleteAllNotifications}
                        disabled={notificationActionLoading === "delete-all"}
                        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#C0392B] transition hover:bg-[#FFF1F1] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={13} />

                        <span className="hidden sm:inline">Delete all</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* DELETE ALL CONFIRMATION */}

                {showDeleteAllConfirm && (
                  <div className="mx-4 mt-3 overflow-hidden rounded-xl border border-[#F1D6D6] bg-[#FFF9F9] shadow-sm">
                    <div className="flex items-start gap-3 px-4 py-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#C0392B]">
                        <Trash2 size={17} strokeWidth={2} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-[#25364A]">
                          Delete all notifications?
                        </h4>

                        <p className="mt-1 text-[11px] leading-4.5 text-[#64748B]">
                          This will permanently remove all of your
                          notifications. This action cannot be undone.
                        </p>

                        <div className="mt-3 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleCancelDeleteAllNotifications}
                            disabled={
                              notificationActionLoading === "delete-all"
                            }
                            className="rounded-lg border border-[#DCE3E8] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#475569] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={handleConfirmDeleteAllNotifications}
                            disabled={
                              notificationActionLoading === "delete-all"
                            }
                            className="flex items-center gap-1.5 rounded-lg bg-[#C0392B] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#A93226] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={12} />
                            Delete all
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ERROR */}

                {notificationError && (
                  <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-[#F3D0D0] bg-[#FFF5F5] px-3 py-2.5 text-xs text-[#B42318]">
                    <CircleAlert size={15} className="mt-0.5 shrink-0" />

                    <p className="min-w-0 flex-1">
                      {typeof notificationError === "string"
                        ? notificationError
                        : "Failed to load notifications."}
                    </p>

                    <button
                      type="button"
                      onClick={() => dispatch(clearNotificationError())}
                      className="shrink-0 text-[#B42318] transition hover:opacity-70"
                      aria-label="Dismiss error"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* NOTIFICATION LIST */}

                <div className="max-h-100 overflow-y-auto max-md:max-h-[calc(100vh-9rem)]">
                  {notificationLoading ? (
                    <div className="flex min-h-55 items-center justify-center">
                      <span className="text-xs font-medium text-[#64748B]">
                        Loading notifications...
                      </span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex min-h-55 flex-col items-center justify-center px-6 text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F1F5F9] text-[#64748B]">
                        <Bell size={21} strokeWidth={1.8} />
                      </div>

                      <h4 className="text-sm font-semibold text-[#25364A]">
                        No notifications
                      </h4>

                      <p className="mt-1 max-w-55 text-xs leading-5 text-[#64748B]">
                        You&apos;re all caught up. New activity will appear
                        here.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const isReadLoading =
                        notificationActionLoading === notification._id;

                      const isDeleteLoading =
                        notificationActionLoading ===
                        `delete-${notification._id}`;

                      return (
                        <div
                          key={notification._id}
                          className={`border-b border-[#EEF2F5] px-4 py-4 transition last:border-b-0 ${
                            notification.isRead
                              ? "bg-white hover:bg-[#F8FAFC]"
                              : "bg-[#F7FBFF] hover:bg-[#F1F8FE]"
                          }`}
                        >
                          <div className="flex gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getNotificationIconStyle(
                                notification.type,
                              )}`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4
                                className={`wrap-break-words text-xs leading-5 ${
                                  notification.isRead
                                    ? "font-semibold text-[#25364A]"
                                    : "font-bold text-[#25364A]"
                                }`}
                              >
                                {notification.title}
                              </h4>

                              <p className="mt-1 wrap-break-words text-xs leading-5 text-[#64748B]">
                                {notification.message}
                              </p>

                              <p className="mt-2 text-[10px] font-medium text-[#94A3B8]">
                                {getRelativeTime(notification.createdAt)}
                              </p>

                              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                {!notification.isRead && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleMarkAsRead(notification._id)
                                    }
                                    disabled={isReadLoading}
                                    className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-[#0859A8] transition hover:bg-[#E6EFF8] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Check size={12} />
                                    Mark as read
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeleteNotification(notification._id)
                                  }
                                  disabled={isDeleteLoading}
                                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-[#64748B] transition hover:bg-[#FFF1F1] hover:text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* FOOTER */}

                {notifications.length > 0 && !notificationLoading && (
                  <div className="border-t border-[#E8EDF1] bg-[#FAFBFC] px-5 py-3 max-sm:px-4">
                    <p className="text-center text-[10px] font-medium text-[#94A3B8]">
                      Showing your latest notifications
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ==========================================
              ADMIN PROFILE
          ========================================== */}

          <Link
            to="/dashboard/admin"
            className="flex min-w-0 items-center gap-3 rounded-lg px-2 py-1 transition hover:bg-[#F8FAFC] max-sm:gap-2 max-sm:px-1"
            aria-label="View admin dashboard"
          >
            <span className="truncate text-sm font-semibold text-[#25364A] max-sm:max-w-25 max-sm:text-xs sm:max-w-35 lg:max-w-none">
              {fullName}
            </span>

            {profileImage ? (
              <img
                src={profileImage}
                alt={fullName}
                className="h-13 w-13 shrink-0 rounded-full border-2 border-[#E6EFF8] object-cover max-sm:h-10 max-sm:w-10 sm:h-12 sm:w-12 lg:h-13 lg:w-13"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[#E6EFF8] bg-[#EEF6FB] text-base font-bold text-[#0859A8] max-sm:h-10 max-sm:w-10 max-sm:text-sm sm:h-12 sm:w-12 lg:h-14 lg:w-14">
                {fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
        </div>
      </header>

      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
        />
      )}

      {/* ==========================================
          MOBILE ADMIN NAVIGATION
      ========================================== */}

      <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"}`}>
        <div className="fixed left-0 top-18 z-50 h-[calc(100vh-72px)] w-72 bg-white shadow-xl">
          <AdminMobileNavigation
            onNavigate={() => setMobileMenuOpen(false)}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </>
  );
};

// ==========================================
// ADMIN MOBILE NAVIGATION
// ==========================================

const AdminMobileNavigation = ({ onNavigate, onLogout }) => {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-4">
      <nav className="space-y-1">
        <AdminNavLink
          to="/dashboard/admin"
          label="Dashboard"
          icon="dashboard"
          onNavigate={onNavigate}
        />

        <AdminNavLink
          to="/admin/users"
          label="Users"
          icon="users"
          onNavigate={onNavigate}
        />

        <AdminNavLink
          to="/admin/companies"
          label="Companies"
          icon="companies"
          onNavigate={onNavigate}
        />

        <AdminNavLink
          to="/admin/jobs"
          label="Jobs"
          icon="jobs"
          onNavigate={onNavigate}
        />

        <AdminNavLink
          to="/admin/applications"
          label="Applications"
          icon="applications"
          onNavigate={onNavigate}
        />

        <AdminNavLink
          to="/admin/reports"
          label="Reports"
          icon="reports"
          onNavigate={onNavigate}
        />
      </nav>

      <div className="mt-auto border-t border-[#E6EFF8] pt-4">
        <button
          type="button"
          onClick={onLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// ==========================================
// ADMIN NAV LINK
// ==========================================

const AdminNavLink = ({ to, label, icon, onNavigate }) => {
  const icons = {
    dashboard: "▦",
    users: "♙",
    companies: "▣",
    jobs: "▤",
    applications: "▥",
    reports: "⚑",
  };

  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[#25364A] transition hover:bg-[#E6EFF8] hover:text-[#0859A8]"
    >
      <span className="w-5 text-center text-lg">{icons[icon]}</span>

      {label}
    </Link>
  );
};

export default AdminHeader;

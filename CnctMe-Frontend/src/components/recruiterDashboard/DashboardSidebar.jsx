import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  FileText,
  Building2,
  Settings,
  LogOut,
  CalendarDays,
  Flag,
  X,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import api from "../../api/axios";

import { logout } from "../../features/auth/authSlice";

import { selectRecruiterProfile } from "../../features/recruiter/recruiterSlice";
import getApiError from "../../utils/apiError";

const DashboardSidebar = ({ user }) => {
  const dispatch = useDispatch();

  const recruiterProfile = useSelector(selectRecruiterProfile);
  const authUser = useSelector((state) => state.auth.user);

  const [profileImage, setProfileImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentUser = user || authUser;

  const firstName = currentUser?.firstName || recruiterProfile?.firstName || "";

  const lastName = currentUser?.lastName || recruiterProfile?.lastName || "";

  const userName = `${firstName} ${lastName}`.trim() || "User";

  // LOAD PROFILE PICTURE
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
        return getApiError(error);
      }
    };

    loadProfilePicture();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  // MOBILE SIDEBAR TOGGLE
  useEffect(() => {
    const handleSidebarToggle = () => {
      setSidebarOpen((previous) => !previous);
    };

    window.addEventListener("toggle-dashboard-sidebar", handleSidebarToggle);

    return () => {
      window.removeEventListener(
        "toggle-dashboard-sidebar",
        handleSidebarToggle,
      );
    };
  }, []);

  // CLOSE SIDEBAR
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // NAVIGATION
  const navigation = [
    {
      name: "Home",
      path: "/",
      icon: Home,
      end: true,
    },
    {
      name: "Dashboard",
      path: "/dashboard/recruiter",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "My Jobs",
      path: "/recruiter/jobs",
      icon: BriefcaseBusiness,
      end: true,
    },
    {
      name: "Post a Job",
      path: "/recruiter/jobs/create",
      icon: PlusCircle,
      end: true,
    },
    {
      name: "Applications",
      path: "/recruiter/applications",
      icon: FileText,
      end: true,
    },
    {
      name: "Interviews",
      path: "/recruiter/interviews",
      icon: CalendarDays,
      end: true,
    },
    {
      name: "Company",
      path: "/recruiter/company",
      icon: Building2,
      end: true,
    },
    {
      name: "My Reports",
      path: "/recruiter/reports",
      icon: Flag,
      end: true,
    },
  ];

  const bottomNavigation = [
    {
      name: "Settings",
      path: "/recruiter/settings",
      icon: Settings,
      end: true,
    },
  ];

  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
          className="fixed inset-0 top-18 z-40 hidden bg-[#25364A]/30 backdrop-blur-[1px] max-md:block"
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          sticky top-18.25 z-40 flex h-[calc(100vh-73px)] w-60 shrink-0
          flex-col border-r border-[#E2E8F0] bg-[#F8FAFC]

          max-lg:w-52

          max-md:fixed
          max-md:left-0
          max-md:top-18
          max-md:z-50
          max-md:h-[calc(100vh-73px)]
          max-md:w-70
          max-md:transform
          max-md:transition-transform
          max-md:duration-300
          max-md:ease-in-out

          ${sidebarOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full"}
        `}
      >
        {/* MOBILE CLOSE BUTTON */}

        <div className="hidden items-center justify-end border-b border-[#E2E8F0] px-4 py-3 max-md:flex">
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#52606D] transition hover:bg-[#EEF6FB] hover:text-[#0859A8]"
          >
            <X size={19} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 overflow-y-auto px-3 py-5 max-lg:px-2.5 max-md:px-3 max-md:py-4">
          {/* MAIN NAVIGATION */}

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 max-lg:gap-2.5 max-lg:px-3.5 ${
                      isActive
                        ? "bg-[#E6EFF8] text-[#0859A8]"
                        : "text-[#52606D] hover:bg-[#EEF6FB] hover:text-[#0859A8]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 2}
                        className="shrink-0"
                      />

                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* DIVIDER */}

          <div className="my-5 border-t border-[#E8EDF1]" />

          {/* BOTTOM NAVIGATION */}

          <div className="space-y-1">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 max-lg:gap-2.5 max-lg:px-3.5 ${
                      isActive
                        ? "bg-[#E6EFF8] text-[#0859A8]"
                        : "text-[#52606D] hover:bg-[#EEF6FB] hover:text-[#0859A8]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 2}
                        className="shrink-0"
                      />

                      <span className="truncate">{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

            {/* LOGOUT */}

            <button
              type="button"
              onClick={() => dispatch(logout())}
              className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#52606D] transition-all duration-200 hover:bg-[#FDECEC] hover:text-[#D64545] max-lg:gap-2.5 max-lg:px-3.5"
            >
              <LogOut
                size={19}
                strokeWidth={2}
                className="shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
              />

              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* PROFILE */}

        <div className="border-t border-[#E2E8F0] p-3 max-lg:p-2.5">
          <Link
            to="/recruiter/profile"
            onClick={closeSidebar}
            className="flex items-center gap-3 rounded-xl bg-[#F8FAFC] px-3 py-3 transition hover:bg-[#EEF6FB] max-lg:gap-2.5 max-lg:px-2.5"
            aria-label="View profile"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt={userName}
                className="h-13 w-13 shrink-0 rounded-full border-2 border-white object-cover shadow-sm max-lg:h-12 max-lg:w-12"
              />
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#E6EFF8] text-base font-bold text-[#0859A8] shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#25364A]">
                {userName}
              </p>

              <p className="text-xs text-[#7A8793]">Recruiter</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;

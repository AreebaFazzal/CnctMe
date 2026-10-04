import { NavLink } from "react-router-dom";

import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  Flag,
  LayoutDashboard,
  LogOut,
  Users,
  Home,
} from "lucide-react";

import { useDispatch } from "react-redux";

import { logoutUser } from "../../features/auth/authSlice";

const AdminSidebar = () => {
  const dispatch = useDispatch();

  const navigation = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Dashboard",
      path: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      label: "Companies",
      path: "/admin/companies",
      icon: Building2,
    },
    {
      label: "Jobs",
      path: "/admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      path: "/admin/applications",
      icon: FileText,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: Flag,
    },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <aside className="sticky top-18.25 hidden h-[calc(100vh-73px)] w-64 shrink-0 border-r border-[#E6EFF8] bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-5 px-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Administration
            </p>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#E6EFF8] text-[#0859A8]"
                        : "text-[#25364A] hover:bg-[#F3F6FA] hover:text-[#0859A8]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 2}
                        className={
                          isActive
                            ? "text-[#0859A8]"
                            : "text-gray-500 group-hover:text-[#0859A8]"
                        }
                      />

                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="my-6 border-t border-[#E6EFF8]" />

          <div className="rounded-xl bg-[#F3F7FB] p-4">
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 size={17} className="text-[#0859A8]" />

              <span className="text-xs font-bold uppercase tracking-wide text-[#25364A]">
                Admin Area
              </span>
            </div>

            <p className="text-xs leading-5 text-gray-500">
              Manage CnctMeusers, jobs, companies, applications and reports.
            </p>
          </div>
        </div>

        {/* LOGOUT */}
        <div className="border-t border-[#E6EFF8] p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={19} />

            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

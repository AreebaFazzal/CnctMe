import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  selectIsAuthenticated,
  selectUser,
} from "../../features/auth/authSlice";

import LogoutButton from "../auth/LogoutButton";

const MainNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const getDashboardPath = () => {
    if (user?.role === "recruiter") {
      return "/dashboard/recruiter";
    }

    if (user?.role === "admin") {
      return "/dashboard/admin";
    }

    return "/dashboard/jobseeker";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-[#0859A8] after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:bg-[#0859A8]"
        : "text-[#25364A] hover:text-[#0859A8] after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-[#0859A8] after:transition-all after:duration-300 hover:after:w-full"
    }`;

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[#DCE3E8] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:grid lg:grid-cols-3 lg:px-8">
        {/* Logo */}
        <div className="lg:justify-self-start">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-bold tracking-tight text-[#25364A]"
          >
            Cnct<span className="text-[#0859A8]">Me</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isAuthPage && (
          <nav className="hidden items-center justify-center gap-7 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/jobs" className={navLinkClass}>
              Jobs
            </NavLink>

            <NavLink to="/companies" className={navLinkClass}>
              Companies
            </NavLink>

            <NavLink to="/people" className={navLinkClass}>
              People
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>
        )}

        {/* Desktop Actions */}
        <div className="hidden items-center justify-self-end gap-3 md:flex">
          {isAuthPage ? (
            <Link
              to="/"
              className="rounded-lg border border-[#0859A8] bg-white px-5 py-2.5 text-sm font-medium text-[#0859A8] transition-all duration-200 hover:bg-[#0859A8] hover:text-white"
            >
              Home
            </Link>
          ) : !isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-[#0859A8] bg-white px-5 py-2.5 text-sm font-medium text-[#0859A8] transition-all duration-200 hover:bg-[#0859A8] hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg border border-[#0859A8] bg-[#0859A8] px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-[#064B8F] hover:bg-[#064B8F]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to={getDashboardPath()}
                className="rounded-lg border border-[#0859A8] bg-[#0859A8]/5 px-5 py-2.5 text-sm font-semibold text-[#0859A8] transition-all duration-200 hover:bg-[#0859A8] hover:text-white"
              >
                Dashboard
              </Link>

              <LogoutButton />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="ml-auto rounded-lg p-2 text-[#25364A] transition hover:bg-[#F3F2F0] md:hidden"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-[#DCE3E8] bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6">
            {!isAuthPage && (
              <>
                <NavLink to="/" className={navLinkClass} onClick={closeMenu}>
                  Home
                </NavLink>

                <NavLink
                  to="/jobs"
                  className={`${navLinkClass} mt-4`}
                  onClick={closeMenu}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/companies"
                  className={`${navLinkClass} mt-4`}
                  onClick={closeMenu}
                >
                  Companies
                </NavLink>

                <NavLink
                  to="/people"
                  className={`${navLinkClass} mt-4`}
                  onClick={closeMenu}
                >
                  People
                </NavLink>

                <NavLink
                  to="/about"
                  className={`${navLinkClass} mt-4`}
                  onClick={closeMenu}
                >
                  About
                </NavLink>
              </>
            )}

            <div className="mt-5 border-t border-[#DCE3E8] pt-4">
              {isAuthPage ? (
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="block rounded-lg border border-[#0859A8] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#0859A8] transition hover:bg-[#0859A8] hover:text-white"
                >
                  Home
                </Link>
              ) : !isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-[#0859A8] px-4 py-2.5 text-center text-sm font-semibold text-[#0859A8] transition hover:bg-[#0859A8] hover:text-white"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="rounded-lg bg-[#0859A8] px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#064B8F]"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to={getDashboardPath()}
                    onClick={closeMenu}
                    className="rounded-lg border border-[#0859A8] bg-[#0859A8]/5 px-4 py-2.5 text-center text-sm font-semibold text-[#0859A8] transition hover:bg-[#0859A8] hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <div className="flex justify-center px-4 py-1">
                    <LogoutButton />
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default MainNavbar;

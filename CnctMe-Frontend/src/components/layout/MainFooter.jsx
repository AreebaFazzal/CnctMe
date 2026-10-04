import { Link } from "react-router-dom";

const MainFooter = () => {
  return (
    <footer className="relative w-screen max-w-none border-t border-[#DCE3E8] bg-[#F3F2F0]">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-7">
        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 py-5 sm:gap-x-8 sm:gap-y-6 sm:py-6 lg:grid-cols-4 lg:gap-8 lg:py-7">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              to="/"
              className="inline-block text-xl font-bold tracking-tight text-[#25364A] sm:text-2xl"
            >
              Cnct<span className="text-[#0859A8]">Me</span>
            </Link>

            <p className="mt-2 max-w-xs text-xs leading-5 text-gray-500 sm:text-sm">
              Connecting talented people with meaningful career opportunities
              and helping businesses find the right talent.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#DCE3E8] text-gray-500 transition hover:border-[#0859A8] hover:bg-[#0859A8] hover:text-white sm:h-8 sm:w-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.37 4.28 5.46v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.57V8.99H3.56v11.46ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="X"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#DCE3E8] text-gray-500 transition hover:border-[#0859A8] hover:bg-[#0859A8] hover:text-white sm:h-8 sm:w-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.9h1.73L8.28 4.02H6.43L17.8 19.9Z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-md border border-[#DCE3E8] text-gray-500 transition hover:border-[#0859A8] hover:bg-[#0859A8] hover:text-white sm:h-8 sm:w-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.04 1.79-4.72 4.54-4.72 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.88v2.28h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#25364A] sm:text-xs">
              Explore
            </h3>

            <ul className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/jobs"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Find Jobs
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  About CnctMe
                </Link>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#25364A] sm:text-xs">
              For Users
            </h3>

            <ul className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
              <li>
                <Link
                  to="/signup"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Log In
                </Link>
              </li>

              <li>
                <Link
                  to="/jobs"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Browse Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#25364A] sm:text-xs">
              Legal
            </h3>

            <ul className="mt-2.5 space-y-1.5 sm:mt-3 sm:space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="text-xs text-gray-500 transition hover:text-[#0859A8] sm:text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            <div className="mt-3 max-w-xs rounded-lg bg-white/60 px-3 py-2.5 sm:mt-4 sm:px-3.5 sm:py-3">
              <p className="text-[11px] font-medium leading-4 text-[#25364A] sm:text-xs">
                Looking for your next opportunity?
              </p>

              <Link
                to="/jobs"
                className="mt-1 inline-flex text-[11px] font-semibold text-[#0859A8] hover:underline sm:text-xs"
              >
                Explore jobs →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-1.5 border-t border-[#DCE3E8] py-3 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-left">
          <p className="text-[10px] text-gray-400 sm:text-xs">
            © {new Date().getFullYear()} CnctMe. All rights reserved.
          </p>

          <p className="text-[10px] text-gray-400 sm:text-xs">
            Built to connect talent with opportunity.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;

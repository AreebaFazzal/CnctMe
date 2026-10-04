import { Link } from "react-router-dom";

const AuthFooter = () => {
  return (
    <footer className="border-t border-[#DCE3E8] bg-white">
      <div className="mx-auto flex min-h-14 w-full max-w-7xl flex-col items-center justify-center gap-2 px-4 py-3 text-center sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link to="/" className="text-sm font-bold text-[#25364A]">
          Cnct<span className="text-[#0859A8]">Me</span>
        </Link>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} CnctMe. All rights reserved.
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <Link to="/" className="transition-colors hover:text-[#0859A8]">
            Home
          </Link>

          <Link to="/login" className="transition-colors hover:text-[#0859A8]">
            Login
          </Link>

          <Link to="/signup" className="transition-colors hover:text-[#0859A8]">
            Sign Up
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;

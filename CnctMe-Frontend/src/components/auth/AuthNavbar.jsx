import { Link } from "react-router-dom";

const AuthNavbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE3E8]/80 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group text-2xl font-bold tracking-tight text-[#25364A]"
        >
          Cnct<span className="text-[#0859A8]">Me</span>
        </Link>

        <Link
          to="/"
          className="rounded-lg border border-[#0859A8] bg-white px-4 py-2 text-sm font-medium text-[#0859A8] transition-colors duration-200 hover:bg-[#0859A8] hover:text-white"
        >
          Home
        </Link>
      </nav>
    </header>
  );
};

export default AuthNavbar;

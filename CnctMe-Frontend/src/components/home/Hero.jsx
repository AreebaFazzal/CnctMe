import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Search,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";

import heroImage from "../../assets/images/Hero.svg";

import {
  fetchJobs,
  selectTotalJobs,
  selectJobLoading,
} from "../../features/jobs/jobsSlice";

import {
  fetchCompanies,
  selectCompanyLoading,
  selectTotalCompanies,
} from "../../features/companies/companiesSlice";

const Hero = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Job Data
  const totalJobs = useSelector(selectTotalJobs);
  const jobLoading = useSelector(selectJobLoading);

  // Redux Company Data
  const totalCompanies = useSelector(selectTotalCompanies);
  const companyLoading = useSelector(selectCompanyLoading);

  // Search State
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // Typing Animation
  const [firstLine, setFirstLine] = useState("");
  const [secondLine, setSecondLine] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Fetch Jobs
  useEffect(() => {
    dispatch(
      fetchJobs({
        currentPage: 1,
        filters: {
          search: "",
          location: "",
          jobType: [],
          workMode: "",
          experienceMin: "",
          experienceMax: "",
          salaryMin: "",
          salaryMax: "",
          category: "",
          sorting: "",
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCompanies({
        page: 1,
        search: "",
      }),
    );
  }, [dispatch]);

  // Typing Animation
  useEffect(() => {
    const firstText = "Find the right job.";
    const secondText = "Build your future.";

    let firstIndex = 0;
    let secondIndex = 0;

    let firstTimer;
    let secondTimer;
    let cursorTimer;

    const typeSecondLine = () => {
      if (secondIndex < secondText.length) {
        secondIndex += 1;

        setSecondLine(secondText.slice(0, secondIndex));

        secondTimer = setTimeout(typeSecondLine, 70);
      }
    };

    const typeFirstLine = () => {
      if (firstIndex < firstText.length) {
        firstIndex += 1;

        setFirstLine(firstText.slice(0, firstIndex));

        firstTimer = setTimeout(typeFirstLine, 70);
      } else {
        secondTimer = setTimeout(typeSecondLine, 250);
      }
    };

    typeFirstLine();

    cursorTimer = setInterval(() => {
      setShowCursor((previous) => !previous);
    }, 500);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
      clearInterval(cursorTimer);
    };
  }, []);

  // Search Handler
  const handleSearch = () => {
    const trimmedSearch = search.trim();
    const trimmedLocation = location.trim();

    if (!trimmedSearch && !trimmedLocation) {
      navigate("/jobs");
      return;
    }

    const params = new URLSearchParams();

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    }

    if (trimmedLocation) {
      params.set("location", trimmedLocation);
    }

    navigate(`/jobs?${params.toString()}`);
  };

  // Enter Key Handler
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-[#F7FAFD] to-[#F3F2F0] pt-20 sm:pt-20 lg:pt-24">
      {/* =====================================================
          CREATIVE BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large soft blue shape */}
        <div className="absolute -right-32 -top-24 h-115 w-115 rounded-full bg-linear-to-br from-[#DCEEFB] to-[#EEF6FB] opacity-90 blur-3xl" />

        {/* Bottom blue glow */}
        <div className="absolute -bottom-40 -left-32 h-105 w-105 rounded-full bg-linear-to-tr from-[#E6EFF8] to-[#F3F2F0] opacity-70 blur-3xl" />

        {/* Center soft glow */}
        <div className="absolute left-[38%] top-[38%] h-56 w-56 rounded-full bg-[#EEF6FB] opacity-50 blur-3xl" />

        {/* Decorative dots */}
        <div className="absolute right-[18%] top-[20%] h-2 w-2 rounded-full bg-[#0A66C2] opacity-30" />

        <div className="absolute right-[25%] top-[27%] h-1.5 w-1.5 rounded-full bg-[#0A66C2] opacity-25" />

        <div className="absolute bottom-[22%] left-[12%] h-2 w-2 rounded-full bg-[#0A66C2] opacity-20" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(#DCE3E8 1px, transparent 1px), linear-gradient(90deg, #DCE3E8 1px, transparent 1px)",
            backgroundSize: "70px 70px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
          }}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 pb-12 pt-7 sm:px-6 sm:pb-14 sm:pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pb-16 lg:pt-9">
        {/* =================================================
            LEFT CONTENT
        ================================================== */}

        <div>
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCE3E8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#0A66C2] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0A66C2] opacity-60" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0A66C2]" />
            </span>
            Your career starts here
          </div>

          {/* Heading */}
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-[#25364A] sm:text-4xl lg:text-5xl">
            <span>
              {firstLine}

              {showCursor &&
                firstLine.length < "Find the right job.".length && (
                  <span className="ml-0.5 text-[#0A66C2]">|</span>
                )}
            </span>

            <br />

            <span className="bg-linear-to-r from-[#0A66C2] to-[#3B9AE1] bg-clip-text text-transparent">
              {secondLine}

              {showCursor &&
                firstLine.length >= "Find the right job.".length &&
                secondLine.length < "Build your future.".length && (
                  <span className="ml-0.5 text-[#0A66C2]">|</span>
                )}
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-lg text-xs leading-6 text-[#697586] sm:text-sm">
            Discover opportunities that match your skills, experience, and
            career goals. CnctMe connects talented people with companies looking
            for their next great hire.
          </p>

          {/* =================================================
              SEARCH BOX
          ================================================== */}

          <div className="mt-6 max-w-2xl rounded-2xl border border-[#DCE3E8] bg-white p-2 shadow-[0_14px_36px_rgba(37,54,74,0.10)] sm:flex sm:items-center">
            {/* Job Search */}
            <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors focus-within:bg-[#F5FAFF] sm:px-3.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EEF6FB]">
                <Search className="h-3 w-3 text-[#0A66C2]" />
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, skills, or keywords"
                className="w-full bg-transparent text-xs text-[#25364A] outline-none placeholder:text-[#8998A6] sm:text-sm"
              />
            </div>

            {/* Divider */}
            <div className="hidden h-7 w-px bg-[#E8EDF1] sm:block" />

            {/* Location */}
            <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors focus-within:bg-[#F5FAFF] sm:px-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF6FB]">
                <MapPin className="h-3.5 w-3.5 text-[#0A66C2]" />
              </span>

              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Location"
                className="w-full bg-transparent text-xs text-[#25364A] outline-none placeholder:text-[#8998A6] sm:text-sm"
              />
            </div>

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="group mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#0A66C2] to-[#0859A8] px-5 py-3 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-md hover:brightness-105 active:scale-[0.98] sm:mt-0 sm:w-auto sm:text-sm"
            >
              Search jobs
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* =================================================
              STATS
          ================================================== */}

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {/* Companies */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF1] bg-white px-3 py-1.5 text-xs text-[#697586] shadow-sm">
              <Users className="h-3.5 w-3.5 text-[#0A66C2]" />
              <span className="font-semibold text-[#25364A]">
                {companyLoading ? "..." : totalCompanies.toLocaleString()}
              </span>
              companies
            </div>

            {/* Jobs */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF1] bg-white px-3 py-1.5 text-xs text-[#697586] shadow-sm">
              <TrendingUp className="h-3.5 w-3.5 text-[#0A66C2]" />
              <span className="font-semibold text-[#25364A]">
                {jobLoading ? "..." : totalJobs.toLocaleString()}
              </span>
              jobs listed
            </div>

            {/* Career Focused */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E8EDF1] bg-white px-3 py-1.5 text-xs text-[#697586] shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#198754]" />
              <span className="font-semibold text-[#25364A]">100%</span>
              career focused
            </div>
          </div>

          {/* =================================================
              JOIN HIREHUB
          ================================================== */}

          <div className="mt-5">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#0A66C2] transition hover:text-[#0859A8] sm:text-sm"
            >
              Join CnctMe today
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* =================================================
            RIGHT IMAGE
        ================================================== */}

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-md">
            {/* Soft blue background behind image */}
            <div className="absolute inset-5 rounded-4xl bg-linear-to-br from-[#EEF6FB] to-[#E1EEF9] blur-2xl" />

            {/* Image Card */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#DCE3E8] bg-white p-4 shadow-[0_20px_50px_rgba(37,54,74,0.12)]">
              {/* Top accent */}
              <div className="absolute left-6 right-6 top-0 h-1 rounded-b-full bg-linear-to-r from-[#0A66C2] to-[#3B9AE1]" />

              <img
                src={heroImage}
                alt="CnctMecareer opportunities"
                className="relative h-auto w-full object-contain"
              />
            </div>

            {/* =================================================
                CAREER READY CARD
            ================================================== */}

            <div className="absolute -bottom-4 left-3 rounded-xl border border-[#DCE3E8] bg-white px-3.5 py-2.5 shadow-lg sm:left-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-[#EEF6FB] to-[#E1EEF9]">
                  <CheckCircle2 className="h-4 w-4 text-[#0A66C2]" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#25364A]">
                    Career Ready
                  </p>

                  <p className="text-[10px] text-[#697586]">
                    Your next opportunity awaits
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                NEW JOBS DAILY BADGE
            ================================================== */}

            <div className="absolute -right-3 top-6 hidden items-center gap-2 rounded-xl border border-[#DCE3E8] bg-white px-3 py-2 shadow-lg sm:flex">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF4E5]">
                <Sparkles className="h-3.5 w-3.5 text-[#B7791F]" />
              </span>

              <div>
                <p className="text-[11px] font-semibold text-[#25364A]">
                  New jobs daily
                </p>
              </div>
            </div>

            {/* Small decorative circle */}
            <div className="absolute -right-4 -top-4 -z-10 h-16 w-16 rounded-full border border-[#E6EFF8]" />

            {/* Small decorative ring */}
            <div className="absolute -bottom-6 -left-6 -z-10 h-20 w-20 rounded-full border border-dashed border-[#B9D8F0] opacity-70" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

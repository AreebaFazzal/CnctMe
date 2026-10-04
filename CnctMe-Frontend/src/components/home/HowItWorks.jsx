import { Link } from "react-router-dom";
import howItWorksImage from "../../assets/images/hero-middle.jpg";

const seekerSteps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Add your skills, experience, and career preferences.",
  },
  {
    number: "02",
    title: "Discover Jobs",
    description: "Explore opportunities that match your career goals.",
  },
  {
    number: "03",
    title: "Apply With Ease",
    description: "Apply directly and manage your applications in one place.",
  },
  {
    number: "04",
    title: "Get Hired",
    description:
      "Connect with employers and take the next step in your career.",
  },
];

const recruiterSteps = [
  {
    number: "01",
    title: "Create Company Profile",
    description: "Showcase your company and attract the right candidates.",
  },
  {
    number: "02",
    title: "Post a Job",
    description: "Create detailed job listings with your requirements.",
  },
  {
    number: "03",
    title: "Find Candidates",
    description: "Review applications and discover talented professionals.",
  },
  {
    number: "04",
    title: "Hire Talent",
    description: "Manage interviews and hire the right people for your team.",
  },
];

const StepCard = ({ step, index }) => {
  return (
    <div
      className="group animate-fade-up opacity-0"
      style={{
        animationDelay: `${0.15 + index * 0.08}s`,
      }}
    >
      <div className="flex gap-4">
        <div className="relative flex shrink-0 flex-col items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B9D8F0] bg-[#EEF6FB] text-[9px] font-bold text-[#0A66C2] transition-all duration-300 ease-out group-hover:scale-110 group-hover:border-[#0A66C2] group-hover:bg-[#0A66C2] group-hover:text-white sm:h-8 sm:w-8 sm:text-[10px]">
            {step.number}
          </div>

          {index < 3 && (
            <div className="mt-1 h-full min-h-6 w-px bg-[#DCE3E8] transition-colors duration-300 group-hover:bg-[#B9D8F0]" />
          )}
        </div>

        <div className="pb-5">
          <h4 className="text-xs font-semibold text-[#25364A] transition-colors duration-300 group-hover:text-[#0A66C2] sm:text-sm">
            {step.title}
          </h4>

          <p className="mt-1 max-w-md text-[11px] leading-5 text-[#68798A] sm:text-xs sm:leading-6">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0 animate-background-move bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${howItWorksImage})`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-white/80" />

      <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#EEF6FB] opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="animate-fade-up flex items-center justify-center gap-2 opacity-0">
            <span className="h-px w-6 bg-[#0A66C2]" />

            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A66C2] sm:text-sm">
              How It Works
            </p>

            <span className="h-px w-6 bg-[#0A66C2]" />
          </div>

          <h2
            className="animate-fade-up mt-3 text-2xl font-bold tracking-tight text-[#25364A] opacity-0 sm:text-3xl lg:text-[32px]"
            style={{ animationDelay: "0.2s" }}
          >
            Simple steps to move forward
          </h2>

          <p
            className="animate-fade-up mx-auto mt-4 max-w-xl text-xs leading-6 text-[#68798A] opacity-0 sm:text-sm sm:leading-7"
            style={{ animationDelay: "0.2s" }}
          >
            Whether you are looking for your next opportunity or searching for
            talented professionals, CnctMe keeps the process simple.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div
            className="animate-fade-up rounded-xl border border-[#DCE3E8] bg-[#F8F9FA] p-6 opacity-0 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#B9D8F0] hover:bg-white hover:shadow-md sm:p-7"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-[#EEF6FB] px-2.5 py-1 text-[10px] font-semibold text-[#0A66C2]">
                For Job Seekers
              </span>

              <h3 className="mt-2 text-base font-bold text-[#25364A] sm:text-lg">
                Find your next opportunity
              </h3>

              <p className="mt-1 text-[11px] text-[#68798A] sm:text-xs">
                Discover jobs and take the next step in your career.
              </p>
            </div>

            <div>
              {seekerSteps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>

            <Link
              to="/jobs"
              className="group mt-1 inline-flex items-center gap-2 rounded-md border border-[#0A66C2] px-4 py-2 text-xs font-semibold text-[#0A66C2] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EEF6FB] hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/20"
            >
              Find Jobs
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <div
            className="animate-fade-up rounded-xl border border-[#DCE3E8] bg-[#F8F9FA] p-6 opacity-0 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#B9D8F0] hover:bg-white hover:shadow-md sm:p-7"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-[#EEF6FB] px-2.5 py-1 text-[10px] font-semibold text-[#0A66C2]">
                For Recruiters
              </span>

              <h3 className="mt-2 text-base font-bold text-[#25364A] sm:text-lg">
                Find the right talent
              </h3>

              <p className="mt-1 text-[11px] text-[#68798A] sm:text-xs">
                Connect with talented professionals and build your team.
              </p>
            </div>

            <div>
              {recruiterSteps.map((step, index) => (
                <StepCard key={step.number} step={step} index={index} />
              ))}
            </div>

            <Link
              to="/signup"
              className="group mt-1 inline-flex items-center gap-2 rounded-md bg-[#0A66C2] px-4 py-2 text-xs font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#0859A8] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/30"
            >
              Get Started
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

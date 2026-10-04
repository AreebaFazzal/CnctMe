import { Link } from "react-router-dom";
import Card from "../ui/Card";

const WhyCnctMe = () => {
  return (
    <section className="bg-[#F3F2F0] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div
            className="animate-fade-up flex items-center justify-center gap-3 opacity-0"
            style={{ animationDelay: "0s" }}
          >
            <span className="h-px w-7 bg-[#0A66C2]" />

            <p className="text-xs font-semibold  tracking-wide text-[#0A66C2] sm:text-sm">
              WHY CnctMe
            </p>

            <span className="h-px w-7 bg-[#0A66C2]" />
          </div>

          <h2
            className="animate-fade-up mt-3 text-2xl font-bold tracking-tight text-[#25364A] opacity-0 sm:text-3xl lg:text-[32px]"
            style={{ animationDelay: "0.2s" }}
          >
            Everything you need to move your career forward
          </h2>

          <p
            className="animate-fade-up mt-4 text-xs leading-6 text-[#68798A] opacity-0 sm:text-sm sm:leading-7"
            style={{ animationDelay: "0.2s" }}
          >
            CnctMe makes it easier to discover opportunities, connect with
            companies, and take the next step in your professional journey.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div
            className="animate-fade-up opacity-0 transition-all duration-500 ease-out hover:-translate-y-2"
            style={{ animationDelay: "0.3s" }}
          >
            <Card
              title="Find the Right Jobs"
              subtitle="Discover relevant opportunities that match your skills, experience, and career goals."
              className="h-full min-h-57.5 border-[#DCE3E8] transition-all duration-500 ease-out hover:border-[#B9D8F0] hover:shadow-xl"
            >
              <Link
                to="/jobs"
                className="group mt-7 inline-flex items-center gap-2 rounded-lg border border-[#0A66C2] px-5 py-2.5 text-xs font-medium text-[#0A66C2] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EEF6FB] hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/30"
              >
                Find Jobs
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Card>
          </div>

          <div
            className="animate-fade-up opacity-0 transition-all duration-500 ease-out hover:-translate-y-2"
            style={{ animationDelay: "0.4s" }}
          >
            <Card
              title="Connect with Companies"
              subtitle="Explore companies, discover new opportunities, and connect with recruiters."
              className="h-full min-h-57.5 border-[#DCE3E8] transition-all duration-500 ease-out hover:border-[#B9D8F0] hover:shadow-xl"
            >
              <Link
                to="/companies"
                className="group mt-7 inline-flex items-center gap-2 rounded-lg border border-[#0A66C2] px-5 py-2.5 text-xs font-medium text-[#0A66C2] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EEF6FB] hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/30"
              >
                Find Companies
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Card>
          </div>

          <div
            className="animate-fade-up opacity-0 transition-all duration-500 ease-out hover:-translate-y-2"
            style={{ animationDelay: "0.5s" }}
          >
            <Card
              title="Build Your Career"
              subtitle="Create your profile, showcase your skills, and discover opportunities to grow professionally."
              className="h-full min-h-57.5 border-[#DCE3E8] transition-all duration-500 ease-out hover:border-[#B9D8F0] hover:shadow-xl"
            >
              <Link
                to="/signup"
                className="group mt-7 inline-flex items-center gap-2 rounded-lg border border-[#0A66C2] px-5 py-2.5 text-xs font-medium text-[#0A66C2] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#EEF6FB] hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/30"
              >
                Sign Up
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCnctMe;

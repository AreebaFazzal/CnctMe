import { Link } from "react-router-dom";
import heroLast from "../../assets/images/hero-last.svg";

const CallToAction = () => {
  return (
    <section className="group relative overflow-hidden bg-[#F3F2F0] py-24 sm:py-28 lg:py-32">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat transition-transform duration-2000 ease-out group-hover:scale-100"
        style={{
          backgroundImage: `url(${heroLast})`,
        }}
      />

      <div className="absolute inset-0 bg-white/65 transition-opacity duration-700 group-hover:bg-white/60" />

      <div className="relative z-10 mx-auto flex max-w-7xl justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div
            className="animate-fade-up flex items-center justify-center gap-3 opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="h-px w-7 bg-[#0A66C2]" />

            <p className="text-xs font-semibold uppercase tracking-wide text-[#0A66C2] sm:text-sm">
              Start Your Journey
            </p>

            <span className="h-px w-7 bg-[#0A66C2]" />
          </div>

          <h2
            className="animate-fade-up mt-3 text-2xl font-bold tracking-tight text-[#25364A] opacity-0 sm:text-3xl lg:text-[32px]"
            style={{ animationDelay: "0.2s" }}
          >
            Your next opportunity starts here
          </h2>

          <p
            className="animate-fade-up mx-auto mt-4 max-w-xl text-sm leading-6 text-[#68798A] opacity-0 sm:text-base sm:leading-7"
            style={{ animationDelay: "0.35s" }}
          >
            Join thousands of professionals discovering new opportunities,
            connecting with great companies, and building the careers they want
            with CnctMe.
          </p>

          <div
            className="animate-fade-up mx-auto mt-7 flex w-full justify-center opacity-0"
            style={{ animationDelay: "0.5s" }}
          >
            <Link
              to="/signup"
              className="group/button mx-auto inline-flex w-fit items-center gap-2 rounded-lg bg-[#0A66C2] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#0859A8] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#0A66C2]/30 active:translate-y-0"
            >
              Get Started
              <span className="transition-transform duration-300 ease-out group-hover/button:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

import { Link } from "react-router-dom";

import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const About = () => {
  return (
    <div className="min-h-screen bg-white text-[#25364A]">
      <MainNavbar />

      <main className="pt-16">
        {/* HERO */}
        <section className="border-b border-[#DCE3E8] bg-[#F3F2F0]">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
            <p className="about-fade text-sm font-semibold text-[#0859A8]">
              About CnctMe
            </p>

            <h1 className="about-fade about-delay-1 mt-4 text-2xl font-bold tracking-tight text-[#25364A] sm:text-4xl">
              Connecting Me with talent & opportunity.
            </h1>

            <p className="about-fade about-delay-2 mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-md">
              CnctMe is a professional job platform that helps people discover
              meaningful career opportunities while helping employers find the
              talent they need.
            </p>
          </div>
        </section>

        {/* VISION */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
            <p className="text-sm font-semibold text-[#0859A8]">Vision</p>

            <h2 className="mt-3 text-2xl font-bold text-[#25364A] sm:text-3xl">
              Create better opportunities for everyone.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              We envision a professional world where people can easily discover
              opportunities that match their ambitions and companies can connect
              with people who can help them grow.
            </p>
          </div>
        </section>

        {/* MISSION */}
        <section className="border-y border-[#DCE3E8] bg-[#F3F2F0]">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
            <p className="text-sm font-semibold text-[#0859A8]">Mission</p>

            <h2 className="mt-3 text-2xl font-bold text-[#25364A] sm:text-3xl">
              Connect professionals and employers to make hiring simpler.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
              CnctMe brings job seekers and employers together through a
              straightforward platform built around discovery, connection, and
              professional growth.
            </p>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0859A8]">
                Who are we?
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#25364A] sm:text-3xl">
                A platform built around people and possibilities.
              </h2>
            </div>

            <div className="mt-6 space-y-4 text-center leading-7 text-gray-600">
              <p>
                CnctMe was created with a simple purpose: make the process of
                finding a job and finding the right candidate easier.
              </p>

              <p>
                Professionals can discover jobs, create their profiles, apply
                for opportunities, and manage their applications from one place.
              </p>

              <p>
                Employers can create job opportunities, discover qualified
                candidates, and manage applications through a focused hiring
                experience.
              </p>

              <p>
                By bringing both sides together, CnctMe aims to make
                professional connections more meaningful and hiring more
                efficient.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT CnctMe OFFERS */}
        <section className="border-t border-[#DCE3E8] bg-[#F3F2F0]">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:py-16">
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0859A8]">
                What we offer
              </p>

              <h2 className="mt-3 text-2xl font-bold text-[#25364A] sm:text-3xl">
                Everything starts with the right connection.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0859A8]/10 text-[#0859A8]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="6.5" />
                    <path strokeLinecap="round" d="m16 16 4 4" />
                  </svg>
                </div>

                <h3 className="mt-4 font-semibold text-[#25364A]">Discover</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Find opportunities that match your skills, experience, and
                  career goals.
                </p>
              </div>

              <div className="bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0859A8]/10 text-[#0859A8]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    />
                    <circle cx="9" cy="7" r="4" />
                    <path strokeLinecap="round" d="M19 8v6m3-3h-6" />
                  </svg>
                </div>

                <h3 className="mt-4 font-semibold text-[#25364A]">Connect</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Bring talented professionals and employers together through
                  one platform.
                </p>
              </div>

              <div className="bg-white p-6 text-center shadow-sm transition-shadow duration-300 hover:shadow-md">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#0859A8]/10 text-[#0859A8]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 19V9m5 10V5m5 14v-7m5 7V3"
                    />
                  </svg>
                </div>

                <h3 className="mt-4 font-semibold text-[#25364A]">Grow</h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Help professionals move forward and companies build stronger
                  teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SIMPLE CTA */}
        <section className="bg-[#064B8F]">
          <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Your next opportunity starts here.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-blue-100">
              Explore opportunities and take the next step in your professional
              journey with CnctMe.
            </p>

            <Link
              to="/jobs"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#064B8F] transition-colors duration-200 hover:bg-[#F3F2F0]"
            >
              Explore Jobs
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6 6 6-6 6"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>

      <MainFooter />

      <style>
        {`
          @keyframes aboutFade {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .about-fade {
            animation: aboutFade 0.7s ease-out both;
          }

          .about-delay-1 {
            animation-delay: 0.1s;
          }

          .about-delay-2 {
            animation-delay: 0.2s;
          }

          @media (prefers-reduced-motion: reduce) {
            .about-fade {
              animation: none;
            }

            * {
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default About;

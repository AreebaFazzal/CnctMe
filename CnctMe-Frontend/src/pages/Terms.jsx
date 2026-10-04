import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using CnctMe, you agree to comply with these Terms & Conditions. If you do not agree with these terms, please do not use the platform.",
    },
    {
      title: "2. Using CnctMe",
      content:
        "CnctMe provides a platform where job seekers can discover employment opportunities and recruiters can publish jobs and find candidates.",
    },
    {
      title: "3. User Accounts",
      content:
        "Users are responsible for providing accurate information and keeping their account credentials secure. You are responsible for activity performed through your account.",
    },
    {
      title: "4. Job Seekers",
      content:
        "Job seekers should provide truthful information in their profiles, resumes, and applications. Users should independently evaluate job opportunities and employers before accepting employment.",
    },
    {
      title: "5. Recruiters",
      content:
        "Recruiters are responsible for ensuring that job listings and company information published on CnctMe are accurate, legitimate, and compliant with applicable laws.",
    },
    {
      title: "6. Prohibited Activities",
      content:
        "Users must not use CnctMe for fraud, harassment, impersonation, unauthorized access, misleading job listings, spam, or any activity that violates applicable laws or the rights of others.",
    },
    {
      title: "7. Content",
      content:
        "Users are responsible for content they submit to the platform. CnctMe may remove content or restrict accounts that violate these terms or create risks for the platform or its users.",
    },
    {
      title: "8. Platform Availability",
      content:
        "We aim to keep CnctMe available and reliable, but we cannot guarantee uninterrupted access or that the platform will always be free from errors.",
    },
    {
      title: "9. Changes to These Terms",
      content:
        "We may update these Terms & Conditions when necessary. Updated terms will be posted on this page with a revised date.",
    },
    {
      title: "10. Contact",
      content:
        "If you have questions about these Terms & Conditions, please contact us through the Contact Us page.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F2F0] text-[#25364A]">
      <MainNavbar />

      <main className="flex-1 pt-16">
        {/* PAGE HEADER */}
        <section className="border-b border-[#DCE3E8] bg-[#F3F2F0]">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-14 bg-[#C7D0D8] sm:w-24" />

              <p className="text-sm font-semibold tracking-wide text-[#0859A8]">
                Legal
              </p>

              <span className="h-px w-14 bg-[#C7D0D8] sm:w-24" />
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#25364A] sm:text-5xl">
              Terms & Conditions
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Last updated: September 8, 2026
            </p>
          </div>
        </section>

        {/* TERMS CONTENT */}
        <section className="bg-[#F3F2F0]">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="space-y-12">
              {sections.map((section) => (
                <section key={section.title}>
                  {/* SECTION TITLE */}
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-[#DCE3E8]" />

                    <h2 className="shrink-0 text-sm font-semibold text-[#0859A8]">
                      {section.title}
                    </h2>

                    <div className="h-px flex-1 bg-[#DCE3E8]" />
                  </div>

                  {/* SECTION CONTENT */}
                  <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-7 text-gray-600 sm:text-base">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
};

export default Terms;

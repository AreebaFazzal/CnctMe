import MainNavbar from "../components/layout/MainNavbar";
import MainFooter from "../components/layout/MainFooter";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "Welcome to CnctMe. We respect your privacy and are committed to protecting the personal information you provide while using our platform.",
    },
    {
      title: "2. Information We Collect",
      content:
        "Depending on how you use CnctMe, we may collect information such as your name, email address, account type, professional information, job applications, and other information you choose to provide.",
    },
    {
      title: "3. How We Use Your Information",
      content:
        "We may use collected information to provide and improve our services, manage accounts, process job applications, connect job seekers with recruiters, communicate with users, and maintain platform security.",
    },
    {
      title: "4. Account Security",
      content:
        "We take reasonable measures to protect account information and use appropriate security practices. However, no online service can guarantee absolute security.",
    },
    {
      title: "5. Information Sharing",
      content:
        "We do not intend to sell personal information. Information may be shared when necessary to provide CnctMe services, comply with legal obligations, prevent abuse, or protect the rights and safety of users and the platform.",
    },
    {
      title: "6. Cookies and Local Storage",
      content:
        "CnctMe may use cookies, local storage, and similar technologies to maintain authentication, remember preferences, and improve the user experience.",
    },
    {
      title: "7. Your Rights",
      content:
        "Depending on applicable law, you may have rights regarding access, correction, deletion, or management of your personal information.",
    },
    {
      title: "8. Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.",
    },
    {
      title: "9. Contact",
      content:
        "If you have questions about this Privacy Policy, please visit our Contact Us page.",
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
              Privacy Policy
            </h1>

            <p className="mt-4 text-sm text-gray-500">
              Last updated: September 8, 2026
            </p>
          </div>
        </section>

        {/* POLICY BODY */}
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

export default PrivacyPolicy;

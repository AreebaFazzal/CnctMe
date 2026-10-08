const transporter = require("../config/email");

// ==========================================
// EMAIL LAYOUT
// ==========================================

const createEmailTemplate = ({
  title,
  greeting,
  content,
  buttonText,
  buttonLink,
  footerText = "",
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f8fafc;
    font-family:Arial, Helvetica, sans-serif;
    color:#25364A;
  "
>

  <div
    style="
      width:100%;
      padding:40px 15px;
      box-sizing:border-box;
    "
  >

    <div
      style="
        max-width:600px;
        margin:0 auto;
        background:#ffffff;
        border-radius:10px;
        overflow:hidden;
        border:1px solid #e6eff8;
      "
    >

      <!-- HEADER -->

      <div
        style="
          background:#0859A8;
          padding:24px;
          text-align:center;
        "
      >

        <h1
          style="
            margin:0;
            color:#ffffff;
            font-size:28px;
            font-weight:700;
          "
        >
          CnctMe
        </h1>

      </div>


      <!-- CONTENT -->

      <div
        style="
          padding:35px 30px;
          line-height:1.6;
          font-size:15px;
        "
      >

        <h2
          style="
            margin-top:0;
            margin-bottom:20px;
            color:#25364A;
            font-size:22px;
          "
        >
          ${title}
        </h2>

        ${greeting ? `<p>${greeting}</p>` : ""}

        ${content}


        ${
          buttonText && buttonLink
            ? `
              <div style="text-align:center; margin:30px 0;">

                <a
                  href="${buttonLink}"
                  style="
                    display:inline-block;
                    padding:13px 24px;
                    background:#0859A8;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:6px;
                    font-weight:600;
                  "
                >
                  ${buttonText}
                </a>

              </div>
            `
            : ""
        }


        ${
          footerText
            ? `
              <p
                style="
                  color:#64748b;
                  font-size:14px;
                  margin-top:25px;
                "
              >
                ${footerText}
              </p>
            `
            : ""
        }

        <p style="margin-top:30px;">
          Regards,<br />
          <strong>CnctMe Team</strong>
        </p>

      </div>


      <!-- FOOTER -->

      <div
        style="
          background:#f8fafc;
          padding:20px;
          text-align:center;
          border-top:1px solid #e6eff8;
        "
      >

        <p
          style="
            margin:0;
            color:#64748b;
            font-size:12px;
          "
        >
          This is an automated email from CnctMe.
        </p>

      </div>

    </div>

  </div>

</body>
</html>
`;
};

// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    await transporter.sendMail({
      from: `"CnctMe" <${process.env.EMAIL_USER}>`,

      to,

      subject,

      text,

      html,

      replyTo: process.env.EMAIL_USER,
    });

    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

// ==========================================
// VERIFY EMAIL
// ==========================================

const sendVerificationEmail = async ({ email, verificationLink }) => {
  const html = createEmailTemplate({
    title: "Verify Your CnctMe Account",

    greeting: "Welcome to CnctMe!",

    content: `
      <p>
        Thank you for creating your CnctMe account.
      </p>

      <p>
        Please verify your email address to activate your
        account and continue using CnctMe.
      </p>

      <p>
        This verification link will expire in
        <strong>24 hours</strong>.
      </p>
    `,

    buttonText: "Verify Email",

    buttonLink: verificationLink,

    footerText:
      "If you did not create a CnctMe account, you can safely ignore this email.",
  });

  const text = `
Welcome to CnctMe!

Thank you for creating your CnctMe account.

Please verify your email address using the link below:

${verificationLink}

This verification link expires in 24 hours.

If you did not create a CnctMe account, you can safely ignore this email.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: email,
    subject: "Verify Your CnctMe Account",
    html,
    text,
  });
};

// ==========================================
// RESET PASSWORD
// ==========================================

const sendPasswordResetEmail = async ({ email, resetLink }) => {
  const html = createEmailTemplate({
    title: "Reset Your CnctMe Password",

    greeting: "Hello,",

    content: `
      <p>
        We received a request to reset your CnctMe password.
      </p>

      <p>
        Click the button below to create a new password.
      </p>

      <p>
        This password reset link will expire in
        <strong>15 minutes</strong>.
      </p>
    `,

    buttonText: "Reset Password",

    buttonLink: resetLink,

    footerText:
      "If you did not request a password reset, you can safely ignore this email.",
  });

  const text = `
Reset Your CnctMe Password

We received a request to reset your CnctMe password.

Use the following link to reset your password:

${resetLink}

This link expires in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: email,
    subject: "Reset Your CnctMe Password",
    html,
    text,
  });
};

// ==========================================
// APPLICATION RECEIVED
// ==========================================

const sendApplicationReceivedEmail = async ({
  recruiterEmail,
  candidateName,
  jobTitle,
}) => {
  const html = createEmailTemplate({
    title: "New Job Application Received",

    greeting: "Hello Recruiter,",

    content: `
      <p>
        <strong>${candidateName}</strong>
        has applied for your job:
      </p>

      <p>
        <strong>${jobTitle}</strong>
      </p>

      <p>
        Please log in to CnctMe to review the application.
      </p>
    `,

    footerText:
      "You can review and manage applications from your CnctMe dashboard.",
  });

  const text = `
New Job Application Received

Hello Recruiter,

${candidateName} has applied for your job:

${jobTitle}

Please log in to CnctMe to review the application.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: recruiterEmail,
    subject: "New Job Application Received",
    html,
    text,
  });
};

// ==========================================
// APPLICATION SHORTLISTED
// ==========================================

const sendApplicationShortlistedEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
}) => {
  const html = createEmailTemplate({
    title: "Your Application Has Been Shortlisted",

    greeting: `Hello ${candidateName},`,

    content: `
      <p>
        Congratulations!
      </p>

      <p>
        Your application for
        <strong>${jobTitle}</strong>
        has been shortlisted.
      </p>

      <p>
        The recruiter will contact you regarding the next steps.
      </p>
    `,
  });

  const text = `
Your Application Has Been Shortlisted

Hello ${candidateName},

Congratulations!

Your application for ${jobTitle} has been shortlisted.

The recruiter will contact you regarding the next steps.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: candidateEmail,
    subject: "Your Application Has Been Shortlisted",
    html,
    text,
  });
};

// ==========================================
// APPLICATION REJECTED
// ==========================================

const sendApplicationRejectedEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
}) => {
  const html = createEmailTemplate({
    title: "Application Status Update",

    greeting: `Hello ${candidateName},`,

    content: `
      <p>
        Thank you for applying for
        <strong>${jobTitle}</strong>.
      </p>

      <p>
        Unfortunately, your application was not selected
        for the next stage.
      </p>

      <p>
        We encourage you to continue exploring opportunities
        on CnctMe.
      </p>
    `,
  });

  const text = `
Application Status Update

Hello ${candidateName},

Thank you for applying for ${jobTitle}.

Unfortunately, your application was not selected for the next stage.

We encourage you to continue exploring opportunities on CnctMe.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: candidateEmail,
    subject: "Application Status Update",
    html,
    text,
  });
};

// ==========================================
// CANDIDATE SELECTED
// ==========================================

const sendCandidateSelectedEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
}) => {
  const html = createEmailTemplate({
    title: "Congratulations! You Have Been Selected",

    greeting: `Hello ${candidateName},`,

    content: `
      <p>
        We are pleased to inform you that you have been
        <strong>selected</strong> for:
      </p>

      <p>
        <strong>${jobTitle}</strong>
      </p>

      <p>
        The recruiter will contact you with further details.
      </p>
    `,
  });

  const text = `
Congratulations! You Have Been Selected

Hello ${candidateName},

We are pleased to inform you that you have been selected for:

${jobTitle}

The recruiter will contact you with further details.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: candidateEmail,
    subject: "Congratulations! You Have Been Selected",
    html,
    text,
  });
};

// ==========================================
// INTERVIEW SCHEDULED
// ==========================================

const sendInterviewScheduledEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
  date,
  time,
  meetingLink,
}) => {
  const formattedDate = new Date(date).toLocaleDateString();

  const html = createEmailTemplate({
    title: "Interview Scheduled",

    greeting: `Hello ${candidateName},`,

    content: `
      <p>
        Your interview for
        <strong>${jobTitle}</strong>
        has been scheduled.
      </p>

      <h3 style="color:#25364A;">
        Interview Details
      </h3>

      <p>
        <strong>Date:</strong>
        ${formattedDate}
      </p>

      <p>
        <strong>Time:</strong>
        ${time}
      </p>

      ${
        meetingLink
          ? `
            <p>
              <strong>Meeting Link:</strong>
              <a
                href="${meetingLink}"
                style="color:#0859A8;"
              >
                Join Interview
              </a>
            </p>
          `
          : ""
      }

      <p>
        Please make sure you are available at the scheduled time.
      </p>
    `,
  });

  const text = `
Interview Scheduled

Hello ${candidateName},

Your interview for ${jobTitle} has been scheduled.

Interview Details:

Date: ${formattedDate}
Time: ${time}

${meetingLink ? `Meeting Link: ${meetingLink}` : ""}

Please make sure you are available at the scheduled time.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: candidateEmail,
    subject: "Interview Scheduled",
    html,
    text,
  });
};

// ==========================================
// INTERVIEW UPDATED
// ==========================================

const sendInterviewUpdatedEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
  date,
  time,
  meetingLink,
}) => {
  const formattedDate = new Date(date).toLocaleDateString();

  const html = createEmailTemplate({
    title: "Your Interview Details Have Been Updated",

    greeting: `Hello ${candidateName},`,

    content: `
      <p>
        The interview details for
        <strong>${jobTitle}</strong>
        have been updated.
      </p>

      <h3 style="color:#25364A;">
        Updated Interview Details
      </h3>

      <p>
        <strong>Date:</strong>
        ${formattedDate}
      </p>

      <p>
        <strong>Time:</strong>
        ${time}
      </p>

      ${
        meetingLink
          ? `
            <p>
              <strong>Meeting Link:</strong>
              <a
                href="${meetingLink}"
                style="color:#0859A8;"
              >
                Join Interview
              </a>
            </p>
          `
          : ""
      }

      <p>
        Please check your CnctMe account for the latest details.
      </p>
    `,
  });

  const text = `
Your Interview Details Have Been Updated

Hello ${candidateName},

The interview details for ${jobTitle} have been updated.

Updated Interview Details:

Date: ${formattedDate}
Time: ${time}

${meetingLink ? `Meeting Link: ${meetingLink}` : ""}

Please check your CnctMe account for the latest details.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: candidateEmail,
    subject: "Your Interview Details Have Been Updated",
    html,
    text,
  });
};

// ==========================================
// INTERVIEW CANCELLED
// ==========================================

const sendInterviewCancelledEmail = async ({
  candidateEmail,
  candidateName,
  jobTitle,
}) => {
  const html = createEmailTemplate({
    title: "Interview Cancelled",

    greeting: `Hello ${candidateName},`,

    content: `
      <p>
        Unfortunately, your interview for
        <strong>${jobTitle}</strong>
        has been cancelled.
      </p>

      <p>
        Please check your CnctMe account for further updates.
      </p>
    `,
  });

  const text = `
Interview Cancelled

Hello ${candidateName},

Unfortunately, your interview for ${jobTitle} has been cancelled.

Please check your CnctMe account for further updates.

Regards,
CnctMe Team
`;

  await sendEmail({
    to: candidateEmail,
    subject: "Interview Cancelled",
    html,
    text,
  });
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,

  sendApplicationReceivedEmail,
  sendApplicationShortlistedEmail,
  sendApplicationRejectedEmail,
  sendCandidateSelectedEmail,

  sendInterviewScheduledEmail,
  sendInterviewUpdatedEmail,
  sendInterviewCancelledEmail,
};

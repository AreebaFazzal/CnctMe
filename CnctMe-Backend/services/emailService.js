const transporter = require("../config/email");

// ==========================================
// SEND EMAIL
// ==========================================

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"CnctMe" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

// ==========================================
// VERIFY EMAIL
// ==========================================

const sendVerificationEmail = async ({ email, verificationLink }) => {
  await sendEmail({
    to: email,

    subject: "Verify Your CnctMe Account",

    html: `
      <h2>Welcome to CnctMe</h2>

      <p>
        Thank you for creating your CnctMe account.
      </p>

      <p>
        Please verify your email address by clicking
        the button below.
      </p>

      <a
        href="${verificationLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#007bff;
          color:white;
          text-decoration:none;
          border-radius:5px;
        "
      >
        Verify Email
      </a>

      <p>
        This verification link expires in 24 hours.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
  });
};

// ==========================================
// RESET PASSWORD
// ==========================================

const sendPasswordResetEmail = async ({ email, resetLink }) => {
  await sendEmail({
    to: email,

    subject: "Reset Your CnctMe Password",

    html: `
      <h2>Reset Your Password</h2>

      <p>
        We received a request to reset your password.
      </p>

      <a
        href="${resetLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#007bff;
          color:white;
          text-decoration:none;
          border-radius:5px;
        "
      >
        Reset Password
      </a>

      <p>
        This link expires in 15 minutes.
      </p>

      <p>
        If you did not request this, you can safely
        ignore this email.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: recruiterEmail,

    subject: "New Job Application Received",

    html: `
      <h2>New Application Received</h2>

      <p>Hello Recruiter,</p>

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

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: candidateEmail,

    subject: "Your Application Has Been Shortlisted",

    html: `
      <h2>Congratulations!</h2>

      <p>Hello ${candidateName},</p>

      <p>
        Your application for
        <strong>${jobTitle}</strong>
        has been shortlisted.
      </p>

      <p>
        The recruiter will contact you regarding
        the next steps.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: candidateEmail,

    subject: "Application Status Update",

    html: `
      <h2>Application Update</h2>

      <p>Hello ${candidateName},</p>

      <p>
        Thank you for applying for
        <strong>${jobTitle}</strong>.
      </p>

      <p>
        Unfortunately, your application was not
        selected for the next stage.
      </p>

      <p>
        We encourage you to continue exploring
        opportunities on CnctMe.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: candidateEmail,

    subject: "Congratulations! You Have Been Selected",

    html: `
      <h2>Congratulations!</h2>

      <p>Hello ${candidateName},</p>

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

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: candidateEmail,

    subject: "Interview Scheduled",

    html: `
      <h2>Interview Scheduled</h2>

      <p>Hello ${candidateName},</p>

      <p>
        Your interview for
        <strong>${jobTitle}</strong>
        has been scheduled.
      </p>

      <h3>Interview Details</h3>

      <p>
        <strong>Date:</strong>
        ${new Date(date).toLocaleDateString()}
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
              <a href="${meetingLink}">
                Join Interview
              </a>
            </p>
          `
          : ""
      }

      <p>
        Please make sure you are available
        at the scheduled time.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: candidateEmail,

    subject: "Your Interview Details Have Been Updated",

    html: `
      <h2>Interview Updated</h2>

      <p>Hello ${candidateName},</p>

      <p>
        The interview details for
        <strong>${jobTitle}</strong>
        have been updated.
      </p>

      <h3>Updated Interview Details</h3>

      <p>
        <strong>Date:</strong>
        ${new Date(date).toLocaleDateString()}
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
              <a href="${meetingLink}">
                Join Interview
              </a>
            </p>
          `
          : ""
      }

      <p>
        Please check your CnctMe account for
        the latest details.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
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
  await sendEmail({
    to: candidateEmail,

    subject: "Interview Cancelled",

    html: `
      <h2>Interview Cancelled</h2>

      <p>Hello ${candidateName},</p>

      <p>
        Unfortunately, your interview for
        <strong>${jobTitle}</strong>
        has been cancelled.
      </p>

      <p>
        Please check your CnctMe account for
        further updates.
      </p>

      <p>
        Regards,<br>
        CnctMe Team
      </p>
    `,
  });
};

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

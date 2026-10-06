<div align="center">

# CnctMe

### Full-Stack Job Recruitment Platform

A modern MERN-based recruitment platform connecting **job seekers, recruiters, and administrators** through a complete hiring workflow.

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[Live Demo](https://cnctme.vercel.app)** · **[GitHub](https://github.com/AreebaFazzal/CnctMe)**

</div>

---

## About

**CnctMe** is a full-stack job recruitment platform built with the **MERN stack**.

The platform provides dedicated experiences for three types of users:

| Role              | Capabilities                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **Job Seeker**    | Search jobs, save jobs, apply, track applications, manage profile and interviews               |
| **Recruiter**     | Manage company, create jobs, review applications, shortlist candidates and schedule interviews |
| **Administrator** | Manage users, companies, jobs, applications and reports                                        |

The application also includes secure authentication, role-based authorization, notifications, reporting, email functionality, and responsive design.

---

## Features

### Authentication & Authorization

- User registration and login
- Email verification
- Resend verification email
- Forgot and reset password
- JWT authentication
- Access and refresh token system
- Role-based authorization
- Protected routes
- Account verification and access control

### Job Seeker

- Browse and search available jobs
- Save jobs
- Apply with resume and cover letter
- Track application status
- View scheduled interviews
- Manage profile and account settings
- Receive notifications

### Recruiter

- Create and manage company profile
- Create and manage job postings
- Review job applications
- Update application status
- Shortlist candidates
- Schedule and manage interviews
- Receive recruitment notifications

### Administrator

- Dashboard statistics
- User management
- Company management
- Job management
- Application management
- Report management
- Platform moderation

### Additional Features

- Notifications
- Emails
- User reporting
- Public profiles
- Responsive interface
- Mobile-friendly dashboards

---

## Screenshots

### Home

<p align="center">
  <img src="https://github.com/AreebaFazzal/CnctMe/blob/32fa789557041a01cd733b4f7ba738221a3be488/Home-I.png" alt="CnctMe Home Page" width="900">
</p>

### Authentication

<p align="center">
  <img src="./CnctMe-UI-SS/auth/Login.png" alt="CnctMe Login Page" width="900">
</p>

### Admin Dashboard

<p align="center">
  <img src="./CnctMe-UI-SS/admin/Dashboard.png" alt="CnctMe Admin Dashboard" width="900">
</p>

### Recruiter Dashboard

<p align="center">
  <img src="./CnctMe-UI-SS/recruiter/Dashboard.png" alt="CnctMe Recruiter Dashboard" width="900">
</p>

### Job Seeker Dashboard

<p align="center">
  <img src="./CnctMe-UI-SS/jobseeker/Dashboard.png" alt="CnctMe Job Seeker Dashboard" width="900">
</p>

---

## Tech Stack

| Category        | Technologies                       |
| --------------- | ---------------------------------- |
| Frontend        | React, Redux Toolkit, React Router |
| Styling         | Tailwind CSS                       |
| Backend         | Node.js, Express.js                |
| Database        | MongoDB, Mongoose                  |
| Authentication  | JWT, bcrypt                        |
| Email           | Nodemailer                         |
| HTTP Client     | Axios                              |
| Development     | Vite, ESLint                       |
| Version Control | Git, GitHub                        |
| Deployment      | Vercel                             |

---

## Application Workflow

```text
                         CnctMe
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
     Job Seeker        Recruiter         Admin
          │                │                │
          ▼                ▼                ▼
      Find Jobs       Create Company    Manage Platform
          │                │
          ▼                ▼
        Apply          Post Jobs
          │                │
          └───────┬────────┘
                  ▼
          Application Review
                  │
                  ▼
             Shortlisted
                  │
                  ▼
              Interview
                  │
          ┌───────┴───────┐
          ▼               ▼
       Selected        Rejected
```

---

## Project Structure

```text
CnctMe/
│
├── CnctMe-Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── CnctMe-Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── assets/
│   │   │   └── images/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
│
└── README.md
```

---

## Getting Started

### Clone

```bash
git clone https://github.com/AreebaFazzal/CnctMe.git
cd CnctMe
```

### Backend

```bash
cd CnctMe-Backend
npm install
npm start
```

### Frontend

Open a new terminal:

```bash
cd CnctMe-Frontend
npm install
npm run dev
```

Create `.env` files for both applications using the provided `.env.example` files.

> Never commit `.env` files or sensitive credentials.

---

## Security

CnctMe implements several security measures, including:

- JWT-based authentication
- Short-lived access tokens
- HTTP-only refresh token cookies
- Password hashing with bcrypt
- Email verification
- Password reset tokens
- Role-based access control
- Protected API routes
- Account status validation

---

## Deployment

**Frontend**

https://cnctme.vercel.app/

**Backend**

https://cnctme-backend.vercel.app/

---

## Author

**Areeba Fazzal**

Full-Stack MERN Developer

[GitHub](https://github.com/AreebaFazzal)

---

<div align="center">

**CnctMe — Connect. Discover. Hire.**

If you found this project useful, consider giving the repository a star.

</div>

import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./appSlice";
import authReducer from "../features/auth/authSlice";
import jobsReducer from "../features/jobs/jobsSlice";
import companiesReducer from "../features/companies/companiesSlice";
import recruiterReducer from "../features/recruiter/recruiterSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import jobseekerReducer from "../features/jobseeker/jobseekerSlice";
import adminReducer from "../features/admin/adminSlice";
import reportsReducer from "../features/reports/reportsSlice";
import peopleReducer from "../features/people/peopleSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    jobs: jobsReducer,
    companies: companiesReducer,
    recruiter: recruiterReducer,
    notifications: notificationsReducer,
    jobseeker: jobseekerReducer,
    admin: adminReducer,
    reports: reportsReducer,
    people: peopleReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

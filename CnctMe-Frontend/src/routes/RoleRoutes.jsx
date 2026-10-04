import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectUser } from "../features/auth/authSlice";

const RoleRoutes = ({ allowedRoles = [] }) => {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoutes;

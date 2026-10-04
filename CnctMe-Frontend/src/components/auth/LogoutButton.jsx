import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { logoutUser, selectAuthLoading } from "../../features/auth/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    await dispatch(logoutUser());

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;

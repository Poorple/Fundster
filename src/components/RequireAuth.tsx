import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const RequireAuth = () => {
  const location = useLocation();
  const [cookies] = useCookies(["user-cookie"]);
  const isUserLoggedIn = !!cookies["user-cookie"];

  return isUserLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;

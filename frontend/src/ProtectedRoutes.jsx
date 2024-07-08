import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const useAuth = () => {
  const { isAuthenticated } = useSelector((state) => state.authUser);
  return isAuthenticated;
};

const ProtectedRoutes = () => {
  const location = useLocation();
  const isAuth = useAuth();

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoutes;

// hooks/useAuth.js
import { useSelector } from "react-redux";

export const useAuth = () => {
  const userInfo = useSelector((state) => state.authUser.userInfo);
  return { userInfo };
};

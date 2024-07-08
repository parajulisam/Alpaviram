import axios from "axios";
import { setIsAuthenticated, setUserInfo } from "./authUser-slice";
import { toast } from "react-toastify";

export const authUser = (loginDetails) => {
  return async (dispatch) => {
    const { email, password } = loginDetails;
    // console.log(email);
    // console.log(password);

    try {
      // dispatch(userAuthRequest)

      //req body configurations

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // login
      // axios.post(url, data, config)
      // data will come from backend server
      // data => message + token
      const { data } = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        { email, password },
        { withCredentials: true },
        config
      );

      //   dispatch(userAuthSuccess(data.message));

      dispatch(setIsAuthenticated(true));

      localStorage.setItem("firstLogin", true);

      toast.success("Login successful!", {
        position: "bottom-right",
        style: { backgroundColor: "black", color: "white" },
      });
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || err.message, {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });
    }
  };
};

// called after getting the token from cookie
export const fetchAuthUser = (token) => {
  return async (dispatch) => {
    const response = await axios.get(
      "http://localhost:3001/api/v1/user/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log(response);

    dispatch(
      setUserInfo({
        user: response.data,
        isAdmin: response.data.role === 1 ? true : false,
      })
    );

    dispatch(setIsAuthenticated(true));
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await axios.get("http://localhost:3001/api/v1/user/logout");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  };
};

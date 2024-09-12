import axios from "axios";
import { setIsAuthenticated, setUserInfo } from "./authUser-slice";
import { toast } from "react-toastify";

// Login action
export const authUser = (loginDetails) => {
  return async (dispatch) => {
    const { email, password } = loginDetails;

    console.log("Login details:", { email, password });

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Make POST request to the login endpoint
      const { data } = await axios.post(
        "http://localhost:3001/api/v1/user/login",
        { email, password },
        config
      );

      console.log("Login response data:", data);

      // Set the authentication and user information
      dispatch(setIsAuthenticated(true));

      // Store tokens in localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("firstLogin", true);

      // Fetch user info after login using access token
      dispatch(fetchAuthUser());

      // Display a success message
      toast.success("Login successful!", {
        position: "bottom-right",
        style: { backgroundColor: "black", color: "white" },
      });
    } catch (err) {
      console.log("Login error:", err);

      // Display error message on failure
      toast.error(err?.response?.data?.message || err.message, {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });
    }
  };
};

// Fetch user profile after login
export const fetchAuthUser = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("No access token found");
      return; // If no token is found, stop execution
    }

    console.log("Fetching user info with token from localStorage:", token);

    try {
      const response = await axios.get(
        "http://localhost:3001/api/v1/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` }, // Use token from localStorage
        }
      );

      console.log("User info response:", response.data);

      // Dispatch the user info and admin status
      dispatch(
        setUserInfo({
          user: response.data,
          isAdmin: response.data.role === 1, // Assuming role 1 is admin
        })
      );

      dispatch(setIsAuthenticated(true));
    } catch (err) {
      console.error("Failed to fetch user info:", err);

      // If token is invalid, trigger logout
      if (err?.response?.status === 401) {
        dispatch(logout());
      }
    }
  };
};

// Logout action
export const logout = () => {
  return async (dispatch) => {
    try {
      // Optionally make a request to the backend to clear the token server-side
      await axios.get("http://localhost:3001/api/v1/user/logout");

      // Clear tokens and localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("firstLogin");

      // Redirect to the homepage after logout
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);

      // Even on error, clear tokens and redirect to the homepage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    }
  };
};

import axios from "axios";
import { setToken } from "./token-slice";

export const getToken = () => {
  return async (dispatch) => {
    try {
      console.log("Requesting new access token...");
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/refreshToken",
        null,
        { withCredentials: true }
      );
      const data = response.data;
      console.log("Access token received:", data.accessToken);
      dispatch(setToken(data.accessToken));
    } catch (error) {
      console.error("Error fetching access token:", error);
      localStorage.removeItem("firstLogin");
      // Handle error here if needed
    }
  };
};

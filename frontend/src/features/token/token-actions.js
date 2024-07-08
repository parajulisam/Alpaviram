import axios from "axios";
import { setToken } from "./token-slice";
export const getToken = () => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/user/refreshToken",
        null,
        { withCredentials: true }
      );
      const data = response.data;
      console.log("accesstoken : ", data.accessToken);
      dispatch(setToken(data.accessToken));
    } catch (error) {
      localStorage.removeItem("firstLogin");
      // Handle error here if needed
    }
  };
};

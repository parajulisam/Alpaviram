import axios from "axios";
import { categoryListSuccess } from "./categoryList-slice";

export const getCategoryList = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/categories"
      );
      dispatch(categoryListSuccess(data));
    } catch (error) {
      throw new Error(error);
    }
  };
};

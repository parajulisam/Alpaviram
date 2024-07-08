import axios from "axios";
import { productListSuccess } from "./productList-slice";

export const getFeaturedProductList = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(
        "http://localhost:3001/api/v1/products/featured"
      );
      dispatch(productListSuccess(data));
    } catch (error) {
      throw new Error(error);
    }
  };
};

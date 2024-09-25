import axios from "axios";
import { recommendedProductsSuccess } from "./productList-slice";

export const getRecommendedProducts = () => {
  return async (dispatch) => {
    try {
      // Get preference from local storage
      const storedPreference = localStorage.getItem("preference");
      const preference = storedPreference ? JSON.parse(storedPreference) : { category: {}, brand: {} }; // Default to an empty preference object

      // Send preference directly as the request body
      const response = await axios.post(
        "http://localhost:3001/api/v1/products/get/recommendations",
        preference,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Dispatch the response data to the Redux store
      dispatch(recommendedProductsSuccess(response.data));
    } catch (error) {
      console.error("Failed to fetch recommended products:", error);
      // Handle error appropriately (e.g., dispatch an error action if needed)
    }
  };
};

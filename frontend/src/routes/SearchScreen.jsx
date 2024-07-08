import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard, { apiUrl } from "../components/Product/ProductCard";

const initialState = {
  productList: [],
  isLoading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS":
      return { ...state, isLoading: false, productList: action.payload, error: null };
    case "FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const SearchScreen = () => {
  const [searchParams] = useSearchParams();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, productList, error } = state;

  const searchTerm = searchParams.get("q") || "";

  useEffect(() => {
    const getMatchedProducts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/products/search?keyword=${searchTerm}`
        );

        const { matchedProducts } = data;
        dispatch({ type: "SUCCESS", payload: matchedProducts });
      } catch (error) {
        dispatch({ type: "FAILURE", payload: error.message });
        toast.error(error.message);
      }
    };

    if (searchTerm) {
      getMatchedProducts();
    }
  }, [searchTerm]);

  // Ensure productList is defined before accessing its length
  const hasProducts = productList && productList.length > 0;

  return (
    <div className="px-6 py-10 max-w-screen-2xl mx-auto">
      {/* title */}
      <div className="title flex justify-center py-2">
        <span className="font-medium text-xl uppercase md:text-2xl px-4 tracking-wide">
          Products related to "{searchTerm}"
        </span>
      </div>

      {/* featured products */}
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : hasProducts ? (
        <div className="flex flex-wrap justify-evenly px-4 py-8">
          {productList.map((product) => (
            <ProductCard product={product} key={product.product_id} />
          ))}
        </div>
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
};

export default SearchScreen;

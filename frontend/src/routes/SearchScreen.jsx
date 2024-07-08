import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard, { apiUrl } from "../components/Product/ProductCard";

const initialState = {
  productList: [],
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SUCCESS":
      return { ...state, isLoading: false, productList: action.payload };

    default:
      return state;
  }
};

const SearchScreen = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // For product and category
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isLoading, productList, error } = state;

  const searchTerm = searchParams.get("q") || "";

  useEffect(() => {
    const getMatchedProducts = async () => {
      try {
        const { data } = await axios.get(
          `${apiUrl}/api/v1/products/search?keyword=${searchTerm}`
        );

        const { matchedProducts } = data;

        dispatch({ type: "SUCCESS", payload: matchedProducts });
      } catch (error) {
        toast.error(error);
      }
    };

    getMatchedProducts();
  }, [searchTerm]);

  return (
    <>
      <div className=" px-6 py-10  max-w-screen-2xl mx-auto ">
        {/* title */}
        <div className="title flex justify-center  py-2">
          <span className="font-medium text-xl uppercase md:text-2xl px-4 tracking-wide ">
            Products related to "{searchTerm}"
          </span>
        </div>

        {/* featured products */}
        <div className="flex flex-wrap justify-evenly  px-4 py-8">
          {productList.map((product) => (
            <ProductCard product={product} key={product.product_id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchScreen;

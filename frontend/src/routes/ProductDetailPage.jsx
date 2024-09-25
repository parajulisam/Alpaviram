import React, { useEffect, useReducer, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Rating from "../components/Product/Rating";
import { FaCaretDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cart-action";
import axios from "axios";
import { apiUrl } from "../components/Product/ProductCard";
import Review from "../components/Product/Review";
import { toast } from "react-toastify";

const initialState = {
  product: { category: {}, reviews: [], brand: {} },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "PRODUCT_DETAIL_SUCCESS":
      return { ...state, product: action.payload };
    default:
      return state;
  }
};

const ProductDetailPage = () => {
  const dispatchRedux = useDispatch();
  const [qty, setQty] = useState(1);
  const params = useParams();
  const proID = params.id;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { product } = state;
  const { category, brand, reviews, ...productDetails } = product;
  const { product_id, name, imagePath, price, countInStock } = productDetails;
  const [changed, setChanged] = useState(false);

  const handlePlusButton = () => {
    if (qty < countInStock) {
      setQty((prevQty) => prevQty + 1);
    }
  };

  const handleMinusButton = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const addToCartHandler = () => {
    if (countInStock === 0) {
      toast.error("This product is out of stock.", {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });
    } else {
      dispatchRedux(
        addToCart({ product_id, name, imagePath, price, countInStock, qty,  category_id: category.category_id, brand_id: brand.brand_id })
      );
    }
  };

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/v1/products/${params.id}`
        );
        console.log("Fetched product details:", data); // Log fetched data
        dispatch({
          type: "PRODUCT_DETAIL_SUCCESS",
          payload: data,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        throw new Error(error);
      }
    };

    getProductDetails();
  }, [params.id, changed]);

  const reviewUpdated = () => {
    setChanged(true);
  };

  console.log("Product details in state:", product); // Log product details before rendering

  return (
    <>
      <div className="main max-w-screen-xl mx-3 my-3 md:mx-5 md:my-5 xl:mx-auto lg:mx-7 ">
        <Link to={"/"}>
          <button className="bg-neutral-700 px-4 mx-2 py-1 text-white rounded-sm hover:bg-white border hover:border-black hover:text-black hover:opacity-90 hover:duration-300">
            GO BACK
          </button>
        </Link>
        <div className="top grid my-3 md:grid-cols-2 rounded-md overflow-hidden p-2 ">
          <div className="image border border-gray-200 max-h-[550px] ">
            <img
              src={`http://localhost:3001${imagePath}`}
              alt=""
              className="w-full h-full rounded-md  "
            />
          </div>
          <div className="details space-y-3  lg:space-y-6 mt-3 md:mt-0 px-2 md:mx-4 lg:mx-6 relative">
            <div className="title font-semibold text-3xl lg:text-4xl ">
              {name}
            </div>
            <hr className="border border-neutral-200" />
            <div className="catBrand flex space-x-4 ">
              <div className="category  text-xs ">
                Category :{" "}
                <span className="px-2 py-1 rounded-xl bg-[#D9D9D9]">
                  {category.name}
                </span>
              </div>
              <div className="brand text-xs ">
                Brand :{" "}
                <span className="px-2 py-1 rounded-xl bg-[#D9D9D9]">
                  {brand.name}
                </span>
              </div>
            </div>
            <div className="rating ">
              <Rating
                value={productDetails.rating}
                text={`${productDetails.numReviews} reviews`}
              />
            </div>
            <div className="price text-3xl  lg:text-4xl font-light">
              NPR. {price} /-
            </div>
            <hr className="border border-neutral-200" />
            <div className="space-y-3 lg:space-y-4  flex flex-col lg:absolute bottom-0  lg:w-1/2">
              <div className="text-sm">
                In Stock : {countInStock}
                {/* {countInStock === 0 && (
                  <span className="text-red-500 font-semibold">
                    {" "}
                    Out of Stock
                  </span>
                )} */}
              </div>
              <div className="flex items-center border-gray-100">
                <span
                  onClick={handleMinusButton}
                  className="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-neutral-500 hover:text-neutral-50"
                >
                  {" "}
                  -{" "}
                </span>
                <input
                  className="h-8 w-8 border bg-white text-center text-xs outline-none"
                  type="number"
                  disabled
                  value={qty}
                  min="1"
                />
                <span
                  onClick={handlePlusButton}
                  className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-neutral-500 hover:text-neutral-50"
                >
                  {" "}
                  +{" "}
                </span>
              </div>
              <div className="button">
                <button
                  onClick={addToCartHandler}
                  className={`w-full md:w-full py-2 bg-neutral-700 text-white rounded-md hover:bg-white border hover:border-black hover:text-black hover:opacity-90 hover:duration-300 ${
                    countInStock === 0 ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={countInStock === 0}
                >
                  {countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="description my-4 lg:my-8 px-2 md:px-0 ">
          <div className="title flex justify-between uppercase font-semibold  text-sm rounded-t-md bg-neutral-300 text-black px-4 py-1 lg:py-2 lg:px-6 border-x-2 border-neutral-900">
            <p>Product Description</p>
            <button className="text-lg lg:text-xl">
              <FaCaretDown />
            </button>
          </div>
          <div className="description border rounded-b-md text-xs lg:text-sm  px-4 lg:px-6 py-2 text-justify">
            {productDetails.description}
          </div>
        </div>
        <Review reviews={reviews} reviewUpdated={reviewUpdated} />
        <div className="realted"></div>
      </div>
    </>
  );
};

export default ProductDetailPage;

import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../features/cart/cart-action";
import Rating from "./Rating";
import { toast } from "react-toastify";
export const apiUrl = import.meta.env.VITE_URL;
import { addPreference } from "../../utils/preference";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authUser); // Access authentication state

  const { product_id, name, imagePath, price, countInStock, numReviews, category_id, brand_id } =
    product;
  const qty = 1;

  const addToCartHandler = () => {
    if (countInStock === 0) {
      toast.error("This product is out of stock.", {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });
    } else if (!isAuthenticated) {
      toast.error("Please log in to add items to the cart.", {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });
    } else {
      dispatch(
        addToCart({ product_id, name, imagePath, price, countInStock, qty, brand_id, category_id })
      );
    }
  };

  return (
    <div className="card border border-slate-300 shadow-2xl w-64 rounded-sm my-4 bg-[#F0F0F0] hover:scale-105 hover:duration-300 hover:ease-in-out mx-3">
      {/* imagePath */}
      <Link to={`/products/${product.product_id}`}
      onClick={()=>{
        addPreference(category_id, brand_id, 1)
      }}
      >
        <div className="img border border-slate-300">
          <img
            src={`http://localhost:3001${imagePath}`}
            alt="no image"
            className="object-fill"
          />
        </div>
      </Link>

      {/* card information */}
      <div className="px-4 py-2 space-y-2">
        {/* title */}
        <Link to={`/products/${product.product_id}`}>
          <div className="title text-xl tracking-wide">{product.name}</div>
        </Link>

        {/* rating */}
        <div className="rating">
          <Rating
            text={`${product.numReviews} reviews`}
            value={product.rating}
          />
        </div>

        {/* price */}
        <div className="price flex space-x-1">
          <div className="price text-xl">NPR {product.price} /-</div>
        </div>

        {/* add to cart button */}
        <div className="button">
          <button
            onClick={addToCartHandler}
            className={`w-full py-2 border border-black rounded-sm ${
              countInStock === 0
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-neutral-700 hover:text-white hover:opacity-90"
            }`}
            disabled={countInStock === 0}
          >
            {countInStock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

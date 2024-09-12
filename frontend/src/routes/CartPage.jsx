import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartCard } from "../components/Cart/CartCard";
import CartSubTotal from "../components/Cart/CartSubTotal";
import { fetchCartData } from "../features/cart/cart-action";
import { useAuth } from "../hooks/useAuth";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, total } = useSelector((state) => state.cart);
  const { userInfo } = useAuth();

  useEffect(() => {
    if (userInfo?.user_id) {
      console.log("Fetching cart data for user:", userInfo.user_id);
      dispatch(fetchCartData(userInfo.user_id));
    } else {
      console.error("User ID is not available");
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    console.log("Cart Items:", cartItems);
    console.log("Total:", total);
  }, [cartItems, total]);

  return (
    <div className="min-h-52">
      {cartItems.length === 0 ? (
        <div>
          <div className="title text-xl md:text-3xl text-center font-medium py-24">
            Cart Items
          </div>
          <div className="flex flex-col justify-center items-center pb-32 gap-10 text-red-700 text-lg">
            Sorry, no items in the cart!
            <button className="bg-neutral-700 mx-2 px-6 py-1 text-white rounded-sm hover:bg-white border hover:border-black hover:text-black hover:opacity-90 hover:duration-300">
              <Link to="/">Go to Home Page</Link>
            </button>
          </div>
        </div>
      ) : (
        <div className="main max-w-screen-xl mx-5 my-4 md:my-10 md:mx-6 lg:mx-10 lg:my-16 xl:mx-auto">
          <div className="title text-xl md:text-3xl text-center font-medium py-2">
            Cart Items
          </div>
          <div className="twoDivs flex flex-col lg:flex-row justify-between my-6 md:my-14">
            <div className="w-full">
              {cartItems.map((item, index) => (
                <CartCard key={index} item={item} />
              ))}
            </div>
            <div className="lg:w-2/4">
              <CartSubTotal total={total} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

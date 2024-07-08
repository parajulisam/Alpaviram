import React, { useState } from "react";
import { ImBin } from "react-icons/im";
import { useDispatch } from "react-redux";
import { removeFromCart } from "../../features/cart/cart-action";
import { apiUrl } from "../Product/ProductCard";
// import { removeProduct } from "../../features/cart-slice";

export const CartCard = ({ item }) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState(item.qty);

  // console.log(item);
  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const handlePlusButton = () => {
    setQty(qty + 1);
  };

  //qty deduct
  const handleMinusButton = () => {
    if (qty > 1) setQty(qty - 1);
  };

  return (
    <>
      <div className="cartdetails main flex flex-col md:flex-row justify-start lg:w-11/12  bg-neutral-200 p-6 rounded-lg border-x-2 border-neutral-800 drop-shadow-lg  mb-8 lg:mr-4  hover:translate-y-1 hover:ease-linear hover:duration-300">
        {/* div grid 1 for image  */}
        <div className="1 flex justify-center  ">
          <div className="image md:w-52 md:max-h-48  rounded-md overflow-hidden border border-blue-">
            <img
              src={`http://localhost:3001${item.imagePath}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* div grid 2 for item details */}
        <div className="2  w-full  md:ml-4  ">
          {/* now flex this div as col */}
          <div className="details mt-4 md:mt-0  h-full flex flex-col justify-between gap-4  ">
            {/* flex this name and button div */}
            <div className="nameAndButton flex justify-between space-y-2   ">
              <div className="name text-xl md:text-2xl font-light text-neutral-900 ">
                {item.name}
              </div>
              <div
                onClick={() => removeFromCartHandler(item.product_id)}
                className="delButton ml-4 text-red-700 hover:text-xl hover:duration-200 font-medium"
              >
                <ImBin />
              </div>
            </div>

            {/* flex this price and qunatity div */}
            <div className="priceAndQuantity flex justify-between items-center my-2  w-full ">
              <div>
                <div className="price md:text-lg  mb-4">
                  NPR {item.price} /-
                </div>
                <div className="price flex items-center  gap-2">
                  Subtotal :
                  <p className="text-xl md:text-2xl">
                    {" "}
                    NPR {item.price * item.qty} /-
                  </p>
                </div>
              </div>

              {/* quantiry button */}
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
                  value={qty}
                  min="1"
                  disabled
                />
                <span
                  onClick={handlePlusButton}
                  className="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-neutral-500 hover:text-neutral-50"
                >
                  {" "}
                  +{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

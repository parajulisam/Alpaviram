import React from "react";
import { Link } from "react-router-dom";

const CartSubTotal = ({ total }) => {
  return (
    <>
      <div className="subtotal bg-neutral-100 border-x-2 border-neutral-800 rounded-lg mt-8 lg:mt-0 p-4 xl:px-6  xl:ml-4   ">
        <div className="head font-medium mt-2 mb-4 text-2xl">Cart Total</div>
        <div className="body space-y-6 ">
          <div className="subtotal flex justify-between">
            <p className="">Total</p>
            <p className="">NPR {total} /-</p>
          </div>

          {/* shipping */}

          <div className="shipping flex justify-between">
            <p>Shipping (Free Shipping)</p>
            <p>NPR 0 /-</p>
          </div>
          <hr className="border border-neutral-500" />

          <div className="grand total">
            <div className="grand total flex justify-between my-8">
              <p className=" text-lg xl:text-xl">Grand Total</p>
              <p className=" text-lg xl:text-xl">NPR {total} /-</p>
            </div>
          </div>

          <div className="button">
            <Link to={"/checkout"}>
              <button className="w-full md:w-full py-3 mb-3 bg-white  text-black rounded-sm hover:bg-neutral-700 border border-black hover:text-white hover:opacity-90 hover:duration-300">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSubTotal;

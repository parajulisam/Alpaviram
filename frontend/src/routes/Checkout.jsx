import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import localForage from "localforage";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCartItems,
  clearShippingAddress,
  saveShippingAddress,
} from "../features/cart/cart-slice";
import axios from "axios";

const Checkout = () => {
  const {
    register,
    reset,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatchRedux = useDispatch();

  const { cartItems, shippingAddress, total } = useSelector(
    (state) => state.cart
  );
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
    console.log(cartItems);
    dispatchRedux(saveShippingAddress(data));
  };

  useEffect(() => {
    const createOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Get the token from local storage

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use the token in the Authorization header
          },
        };

        const order = {
          orderItems: cartItems,
          total_amount: total,
          shippingAddress,
        };

        const { data } = await axios.post(
          "http://localhost:3001/api/v1/orders",
          order,
          config
        );
        console.log(data);

        dispatchRedux(clearCartItems());
        dispatchRedux(clearShippingAddress());

        await localForage.removeItem("cartItems");

        navigate(`/payment/?orderId=${data.order_id}`);
      } catch (error) {
        console.error("Order creation failed:", error);
        throw new Error(error);
      }
    };

    if (shippingAddress && cartItems.length !== 0) {
      createOrder();
    }
  }, [shippingAddress, cartItems, dispatchRedux, total]);

  return (
    <>
      <div>
        <h1 className="text-3xl font-medium flex justify-center mt-8 mb-4 md:mb-0">
          Checkout Details
        </h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="main flex flex-col p-4 lg:flex-row lg:justify-around max-w-screen-xl mx-auto"
      >
        {/* Shipping section */}
        <div className="shipping p-3 lg:p-6 border bg-neutral-50 rounded-md drop-shadow-lg md:my-6 md:mx-6 md:px-6 lg:my-8 lg:w-1/2">
          <h3 className="text-2xl mb-6 mt-2">Shipping Information</h3>
          {/* First Name */}
          <div className="names grid grid-cols-2 space-x-4">
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                name="firstName"
                className="firstName border border-slate-400 rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
                placeholder="First Name"
                {...register("firstName", { required: true })}
              />
              {errors.firstName?.type === "required" && (
                <p className="text-red-500 text-sm">First Name is required.</p>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                name="lastName"
                className="Last Name border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
              />
              {errors.lastName?.type === "required" && (
                <p className="text-red-500 text-sm">Last Name is required.</p>
              )}
            </div>
          </div>
          {/* Email */}
          <div className="flex flex-col my-6">
            <input
              type="email"
              name="email"
              className="email border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
              placeholder="Email Address"
              {...register("email", { required: true })}
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 text-sm">Email is required.</p>
            )}
          </div>
          {/* Contact */}
          <div className="flex flex-col my-6">
            <input
              type="number"
              name="contact"
              className="contact border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
              placeholder="Contact Number"
              {...register("contact", { required: true })}
            />
            {errors.contact?.type === "required" && (
              <p className="text-red-500 text-sm">Contact is required.</p>
            )}
          </div>
          {/* Street and Postal Code */}
          <div className="names grid grid-cols-2 space-x-4 my-6">
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                name="street"
                className="Country border border-slate-400 rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
                placeholder="Street"
                {...register("street", { required: true })}
              />
              {errors.street?.type === "required" && (
                <p className="text-red-500 text-sm">Street is required.</p>
              )}
            </div>
            <div className="flex flex-col space-y-3">
              <input
                type="number"
                name="postalCode"
                className="place border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
                placeholder="Postal Code"
                {...register("postalCode", { required: true })}
              />
              {errors.postalCode?.type === "required" && (
                <p className="text-red-500 text-sm">Postal code is required.</p>
              )}
            </div>
          </div>
          {/* City */}
          <div className="flex flex-col my-6">
            <input
              type="text"
              name="city"
              className="email border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
              placeholder="City"
              {...register("city", { required: true })}
            />
            {errors.city?.type === "required" && (
              <p className="text-red-500 text-sm">City is required.</p>
            )}
          </div>
          {/* Province */}
          <div className="flex flex-col my-6">
            <input
              type="text"
              name="province"
              className="email border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg focus:outline-slate-400"
              placeholder="Province"
              {...register("province", { required: true })}
            />
            {errors.province?.type === "required" && (
              <p className="text-red-500 text-sm">Province is required.</p>
            )}
          </div>
        </div>
        <div className="total lg:my-8 rounded-md md:mx-6 lg:w-2/6">
          <div className="subtotal bg-neutral-100 border-x-2 border-neutral-800 rounded-lg mt-8 lg:mt-0 p-4 xl:px-6">
            <div className="head font-medium mt-2 mb-8 text-2xl">
              Your Order
            </div>
            <div className="body space-y-6">
              <div className="subtotal flex justify-between">
                <p>Product</p>
                <p>Sub Total</p>
              </div>
              <hr className="border border-neutral-500" />
              {/* Shipping Items */}
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="shipping grid grid-cols-3 justify-between"
                >
                  <p className="col-span-2">
                    {item.name} x {item.qty}
                  </p>
                  <p className="text-right">NPR {item.price * item.qty} /-</p>
                </div>
              ))}
              <div className="grand total">
                <div className="subtotal flex justify-between">
                  <p className="font-medium">Grand Total</p>
                  <p className="font-medium text-xl">NPR {total} /-</p>
                </div>
              </div>
              <button
                type="submit"
                className="rounded-md bg-sky-800 hover:bg-sky-700 text-white py-2 px-4 w-full text-lg"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Checkout;

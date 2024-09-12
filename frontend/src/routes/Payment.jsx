import axios from "axios";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import PaymentButton from "../components/Payment/PaymentButton";

const initialState = {
  order: {
    products: [],
    shipping_address: {},
    payment_method: "",
    total_amount: 0,
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ORDER_SUCCESS":
      return {
        ...state,
        order: action.payload,
      };
    case "ORDER_FAILURE":
      return {
        ...state,
        order: initialState.order,
      };
    default:
      return state;
  }
};

const Payment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const shipad = useSelector((state) => state.cart.shippingAddress);
  console.log("Shipping Address", shipad);

  const [state, dispatch] = useReducer(reducer, initialState);
  const { order } = state;
  console.log("Order", order);
  console.log("Order ID:", orderId);

  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        if (!orderId || !token) {
          console.log("Order ID or token is missing, skipping fetch.");
          return; // Early return if orderId or token is falsy
        }

        const { data } = await axios.get(
          `http://localhost:3001/api/v1/orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched order data:", data);

        dispatch({
          type: "ORDER_SUCCESS",
          payload: data,
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
        dispatch({ type: "ORDER_FAILURE" });
      }
    };

    getOrderDetails();
  }, [orderId, token]);

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const handleChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <>
      <div className="main flex flex-col p-4 lg:flex-row lg:justify-around lg:my-14 max-w-screen-xl mx-auto">
        <div className="shipping p-3 lg:p-6 border bg-neutral-50 rounded-md drop-shadow-lg md:my-6 md:mx-6 md:px-6 lg:my-8 lg:w-2/5">
          <form>
            <h1 className="mb-4 mx-4 text-xl font-medium">Pay with</h1>
            <div className="mb-3 mx-3">
              <label>
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={handleChange}
                />
                COD (Cash on Delivery)
              </label>
            </div>

            <div className="mb-3 mx-3">
              <label>
                <input
                  type="radio"
                  value="Khalti"
                  checked={paymentMethod === "Khalti"}
                  onChange={handleChange}
                />
                Khalti
              </label>
            </div>

            <PaymentButton
              paymentMethod={paymentMethod}
              orderId={orderId}
              amount={order.total_amount}
            />
          </form>
        </div>
        <div className="lg:my-8 rounded-md md:mx-6 lg:w-2/5">
          <div className="subtotal bg-neutral-100 border border-neutral-300 rounded-lg mt-8 lg:mt-0 p-4 xl:px-6">
            <div className="head font-medium mt-2 mb-8 text-2xl">
              Order Summary
            </div>
            <hr className="border-black" />
            <div className="body space-y-6">
              <div className="grand total">
                <div className="grand total flex justify-between my-8">
                  <p className="text-lg xl:text-xl">Grand Total</p>
                  <p className="text-lg xl:text-xl">
                    NPR {order.total_amount} /-
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;

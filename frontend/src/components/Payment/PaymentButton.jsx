import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiUrl } from "../Product/ProductCard";

const initialState = {
  success: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ORDER_SUCCESS_PAY":
      return {
        ...state,
        success: true,
      };
    default:
      return state;
  }
};

const PaymentButton = ({ paymentMethod, orderId, amount }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.authUser);
  console.log(userInfo);

  // const { first_name, email, contact_number } = userInfo;
  const { success } = state;
  console.log("success value: ", success);

  const { token } = useSelector((state) => state.token);

  //function to update the payment status
  const paymentHandler = async (paymentDetails) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `http://localhost:3001/api/v1/orders/${orderId}/pay`,
        paymentDetails,
        config
      );
      console.log("Payment successful");
      dispatch({ type: "ORDER_SUCCESS_PAY" });
      console.log("suceess after dispatch", success);
    } catch (error) {
      throw new Error(error);
    }
  };

  console.log(amount);

  const onKhaltiClick = async ({
    payment_method,
    total,
    orderId,
    userInfo,
  }) => {
    console.log(total, orderId, userInfo);
    const payload = {
      return_url: "http://localhost:5173/orderComplete",
      website_url: "http://localhost:5173/",
      amount: total * 100,
      purchase_order_id: orderId,
      purchase_order_name: "test",
      customer_info: {
        name: userInfo.first_name,
        email: userInfo.email,
        phone: userInfo.contact_number,
      },
    };

    const response = await axios.post(
      "http://localhost:3001/api/v1/khalti/pay",
      payload
    );

    console.log(response);

    const url = response.data.payment_url;
    // console.log(url);
    // navigate(url);
    // if (response) {
    window.location.href = `${url}`;

    paymentHandler(
      { payment_method: "Khalti", is_paid: 1 },
      "Payment with Khalti successful. Order Completed !"
    );

    // }
  };

  // After success payment
  useEffect(() => {
    if (success) {
      toast.success(`Payment done with ${paymentMethod}`, {
        position: "top-right",
        style: { backgroundColor: "black", color: "white" },
      });

      navigate("/orderComplete");
    }
  }, [success]);

  return (
    <>
      {paymentMethod === "COD" && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            paymentHandler({ payment_method: "COD" });
          }}
          className="w-full md:w-full py-3 mb-3 my-4 bg-white  text-black rounded-sm hover:bg-neutral-700 border border-black hover:text-white hover:opacity-90 hover:duration-300"
        >
          Confirm PaymentButton
        </button>
      )}

      {paymentMethod === "Khalti" && (
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            onKhaltiClick({
              payment_method: "Khalti",
              orderId: orderId,
              total: amount,
              userInfo: userInfo,
            });
          }}
          className="w-full md:w-full py-3 mb-3 my-4 bg-purple-800  text-white rounded-sm hover:bg-purple-600 border border-black hover:opacity-90 hover:duration-300"
        >
          Pay with Khalti
        </button>
      )}
    </>
  );
};

export default PaymentButton;

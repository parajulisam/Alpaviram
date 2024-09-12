import React, { useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { removeItemFromCart } from "../../features/cart/cart-slice";

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
  const dispatchRedux = useDispatch();
  const { userInfo } = useSelector((state) => state.authUser);
  const { token } = useSelector((state) => state.token);
  const { success } = state;

  const paymentHandler = async (paymentDetails) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.put(
        `http://localhost:3001/api/v1/orders/${orderId}/pay`,
        paymentDetails,
        config
      );

      if (response.data.is_paid === 1) {
        // Remove cart item after successful payment
        dispatchRedux(removeItemFromCart(orderId)); // Adjust according to your cart item identification
        toast.success("Payment status updated successfully.");
        navigate(`/orderComplete?pidx=${paymentDetails.payment_id}`);
      } else {
        toast.error("Failed to update payment status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status. Please try again.");
    }
  };

  const onKhaltiClick = () => {
    const config = {
      publicKey: "test_public_key_ee71705cad0e48279ef9a71a6ef42b75",
      productIdentity: orderId,
      productName: "Order Payment",
      productUrl: "http://google.com",
      eventHandler: {
        async onSuccess(payload) {
          try {
            const response = await axios.post(
              "http://localhost:3001/api/v1/khalti/pay",
              {
                token: payload.token,
                amount: payload.amount,
              }
            );

            if (response.data.success) {
              await paymentHandler({
                payment_method: "Khalti",
                payment_id: payload.token,
                amount: payload.amount,
              });
              toast.success(`Payment successful with ${paymentMethod}`);
              navigate(`/orderComplete?pidx=${payload.token}`);
            } else {
              toast.error("Failed to verify payment. Please try again later.");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            toast.error("Payment failed. Please try again later.");
          }
        },
        onError(error) {
          console.error("Khalti error:", error);
          toast.error("Payment failed. Please try again later.");
        },
        onClose() {
          // Khalti widget is closing
        },
      },
      paymentPreference: ["KHALTI"],
    };

    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: amount * 100 });
  };

  return (
    <>
      {paymentMethod === "COD" && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            paymentHandler({ payment_method: "COD" });
          }}
          className="w-full py-3 mb-3 my-4 bg-white text-black rounded-sm border border-black hover:bg-neutral-700 hover:text-white hover:opacity-90 hover:duration-300"
        >
          Confirm Payment (COD)
        </button>
      )}

      {paymentMethod === "Khalti" && (
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            onKhaltiClick();
          }}
          className="w-full py-3 mb-3 my-4 bg-purple-800 text-white rounded-sm border border-black hover:bg-purple-600 hover:opacity-90 hover:duration-300"
        >
          Pay with Khalti
        </button>
      )}
    </>
  );
};

export default PaymentButton;

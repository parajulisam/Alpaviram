import { toast } from "react-toastify";
import { addItemToCart, removeItemFromCart, replaceCart } from "./cart-slice";
import localForage from "localforage";
import { addPreference } from "../../utils/preference";

export const addToCart = (item) => async (dispatch, getState) => {
  const { userId, userInfo } = getState().authUser; // Retrieve userId and userInfo
  const { role } = userInfo || {};

  console.log("Current userId:", userId); // Log the correct userId
  console.log("Adding item to cart:", item);

  if (!userId) {
    return toast.error("Please log in to add items to your cart.", {
      position: "top-right",
      style: { backgroundColor: "black", color: "white" },
    });
  }

  if (role === 1) {
    return toast.error("You do not have access to add items to the cart.", {
      position: "top-right",
      style: { backgroundColor: "black", color: "white" },
    });
  }

  // Update user preference to the localStorage
  addPreference(item.category_id, item.brand_id, 2)

  dispatch(addItemToCart(item));

  await localForage.setItem(`cartItems_${userId}`, getState().cart.cartItems);

  console.log(`Cart items for user ${userId}:`, getState().cart.cartItems);

  toast.success("Added to cart successfully!", {
    position: "bottom-right",
    style: { backgroundColor: "black", color: "white" },
  });
};

// Remove from cart action with userId
export const removeFromCart = (id) => async (dispatch, getState) => {
  const { userId, userInfo } = getState().authUser; // Retrieve userId and userInfo
  const { role } = userInfo || {};

  console.log("Removing item from cart:", id);
  console.log("Current userId:", userId);

  if (!userId) {
    return toast.error("Please log in to manage your cart.", {
      position: "top-right",
      style: { backgroundColor: "black", color: "white" },
    });
  }

  if (role === 1) {
    return toast.error("You do not have access to manage the cart.", {
      position: "top-right",
      style: { backgroundColor: "black", color: "white" },
    });
  }

  dispatch(removeItemFromCart(id));

  // Update cart items for the specific user in localForage
  await localForage.setItem(`cartItems_${userId}`, getState().cart.cartItems);

  console.log(
    `Updated cart items for user ${userId}:`,
    getState().cart.cartItems
  );

  toast.error("Product removed!", {
    position: "top-right",
    style: { backgroundColor: "black", color: "white" },
  });
};

// Fetch cart data for the specific user
export const fetchCartData = () => async (dispatch, getState) => {
  const { userId } = getState().authUser;

  if (!userId) {
    console.log("No userId found, skipping cart fetch.");
    return;
  }

  const cartItemsFromStorage =
    (await localForage.getItem(`cartItems_${userId}`)) || [];

  dispatch(replaceCart(cartItemsFromStorage));
};

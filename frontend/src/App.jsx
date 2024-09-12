import React, { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login } from "./components/LogIn/Login";
import SignUp from "./components/LogIn/SignUp";
import ErrorPage from "./components/Error/ErrorPage";
import RootLayout from "./routes/RootLayout";
import Products from "./routes/Products";
import ProductDetailPage from "./routes/ProductDetailPage";
import CartPage from "./routes/CartPage";
import Checkout from "./routes/Checkout";
import { useDispatch, useSelector } from "react-redux";
import { getToken } from "./features/token/token-actions";
import { fetchAuthUser } from "./features/authUser/authUser-action";
import UserProfile from "./routes/UserProfile/UserProfile";
import Orders from "./routes/UserProfile/Orders";
import Dashboard from "./routes/UserProfile/Dashboard";
import PersonalInfo from "./routes/UserProfile/PersonalInfo";
import AdminView from "./routes/Admin/AdminView";
import AdminDashboard from "./routes/Admin/AdminDashboard";
import AdminUsers from "./routes/Admin/AdminUsers";
import AdminOrders from "./routes/Admin/AdminOrders";
import AdminProducts from "./routes/Admin/AdminProducts";
import AdminCategory from "./routes/Admin/AdminCategory";
import AdminBrand from "./routes/Admin/AdminBrand";
import { fetchCartData } from "./features/cart/cart-action";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Payment from "./routes/Payment";
import ProtectedRoutes from "./ProtectedRoutes";
import OrderComplete from "./routes/OrderComplete";
import SearchScreen from "./routes/SearchScreen";
import FilterScreen from "./routes/FilterScreen";
import "./index.css";
import ProductsByCategory from "./routes/ProductsByCategory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Products />, index: true },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/products/:id", element: <ProductDetailPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/search", element: <SearchScreen /> },
      { path: "/catBrandFilter", element: <FilterScreen /> },
      {
        path: "/filterByCategory/:categoryId",
        element: <ProductsByCategory />,
      },

      {
        element: <ProtectedRoutes />,
        children: [
          { path: "/checkout", element: <Checkout /> },
          { path: "/payment", element: <Payment /> },
          { path: "/orderComplete", element: <OrderComplete /> },
          {
            path: "/userProfile",
            element: <UserProfile />,
            children: [
              { path: "dashboard", element: <Dashboard />, index: true },
              { path: "orders", element: <Orders /> },
              { path: "personalInfo", element: <PersonalInfo /> },
            ],
          },
          {
            path: "/admin",
            element: <AdminView />,
            children: [
              { path: "dashboard", element: <AdminDashboard />, index: true },
              { path: "orders", element: <AdminOrders /> },
              { path: "products", element: <AdminProducts /> },

              { path: "users", element: <AdminUsers /> },
              { path: "category", element: <AdminCategory /> },
              { path: "brands", element: <AdminBrand /> },
            ],
          },
        ],
      },
    ],
  },
]);

const App = () => {
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.token);

  const { isAuthenticated, userInfo } = useSelector((state) => state.authUser);

  // when isAuthenticated is changed
  // i.e. login status is changed
  useEffect(() => {
    // When the app loads if there is no firstLogin
    // It is not possible to get the access token
    // And without access token it is not possible to get user info
    const firstLogin = localStorage.getItem("firstLogin");

    if (firstLogin && !userInfo) {
      // To get Access token
      dispatch(getToken());
    }
  }, [isAuthenticated, dispatch, userInfo]);

  useEffect(() => {
    // if token is present
    if (token && !userInfo) {
      dispatch(fetchAuthUser(token));
    }
  }, [token, dispatch, userInfo]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;

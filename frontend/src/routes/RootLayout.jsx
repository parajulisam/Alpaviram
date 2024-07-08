import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/footer";
import NavBar from "../components/NavBar/NavBar";
import { ToastContainer } from "react-toastify";

const RootLayout = () => {
  return (
    <>
      <NavBar />
      <ToastContainer />
      <Outlet />
      <Footer />
    </>
  );
};

export default RootLayout;

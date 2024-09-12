import React, { useEffect, useState } from "react";
import { PiShoppingCartFill } from "react-icons/pi";
import { PiUserBold } from "react-icons/pi";
import { IoIosSearch } from "react-icons/io";
import logo from "../../assets/electroLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { PiCaretDownBold } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authUser/authUser-action";
import { fetchCartData } from "../../features/cart/cart-action";

const NavBar = () => {
  const { isAuthenticated, userInfo } = useSelector((state) => state.authUser);
  const { totalQuantity } = useSelector((state) => state.cart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartData());
    }
  }, [isAuthenticated, dispatch]);

  const [searchText, setSearchText] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (!searchText) return;
    navigate(`/search/?q=${searchText.trim()}`);
    setSearchText("");
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpenAdmin, setIsDropdownOpenAdmin] = useState(false);

  // Access token from local storage
  const accessToken = localStorage.getItem("accessToken");

  return (
    <>
      {/* Top Bar */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full bg-[#2C2C2C]">
        <div className="top bg-[#2C2C2C] text-white text-xs h-[30px] md:flex items-center px-4 hidden md:text-sm">
          Connect with us !!
        </div>
        <div className="bottom bg-[#2C2C2C] text-white text-xs h-[30px] flex justify-center items-center text-center md:text-sm">
          Grab the deals !! 15% OFF
        </div>
      </div> */}

      {/* Middle Bar */}
      <div className="bg-[#D9D9D9]">
        <div className="mid h-[60px] flex justify-around items-center bg-[#D9D9D9] max-w-screen-2xl mx-auto border border-slate-200">
          <Link to="/">
            <h1 className="w-30 h-7 font-bold font-mono lg:ml-8 my-5 sm:w-34 sm:h-9 md:w-38 md:h-10 lg:w-40 lg:h-13">
              ALPAVIRAM
            </h1>
          </Link>

          {/* Dropdown for Shop by */}
          <div className="hidden relative lg:inline-block text-left group">
            <button className="flex items-center justify-center text-sm font-medium md:block px-4 py-1 border border-black bg-white hover:bg-white hover:border-white transition-all duration-500">
              <p className="flex items-center gap-1">
                Shop by <PiCaretDownBold />
              </p>
            </button>
            <div className="origin-top-right absolute right-0 w-30 rounded-md shadow-lg bg-[#2C2C2C] text-white py-1 z-50 hidden group-hover:block">
              <Link
                to="/catBrandFilter"
                className="dropdown-item block px-5 py-2 text-sm hover:bg-white hover:text-black"
              >
                Category
              </Link>
              <Link
                to="/catBrandFilter"
                className="dropdown-item block px-5 py-2 text-sm hover:bg-white hover:text-black"
              >
                Brand
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={searchSubmitHandler}
            className="search flex relative items-center h-[35px] w-1/2"
          >
            <input
              className="rounded-full px-6 w-full h-full drop-shadow-2xl"
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              placeholder="Search"
            />
            <IoIosSearch className="absolute top-2 text-lg right-5" />
          </form>

          {/* Buttons */}
          <div className="right flex items-center mx-4 space-x-3">
            {!userInfo || userInfo.role !== 1 ? (
              <Link to="/cart" className="flex relative">
                <PiShoppingCartFill className="size-6" />
                {totalQuantity > 0 && (
                  <span className="flex items-center justify-center absolute -top-2 -right-2 h-4 w-4 bg-red-500 text-white text-xs rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            ) : null}

            <Link to="/login">
              <PiUserBold className="mx-2 size-5 md:hidden" />
            </Link>

            {userInfo && userInfo.isAdmin && (
              <div className="relative inline-block text-left group">
                <button className="sign hidden text-sm font-medium md:block px-6 py-1 border border-black bg-white hover:bg-white hover:border-white transition-all duration-500">
                  Admin
                </button>
                <div className="origin-top-right absolute right-0 w-30 rounded-md shadow-lg bg-[#2C2C2C] text-white py-1 z-50 hidden group-hover:block">
                  <Link
                    to="/admin/dashboard"
                    className="dropdown-item block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="dropdown-item block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/products"
                    className="dropdown-item block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Products
                  </Link>
                  <Link
                    to="/admin/category"
                    className="dropdown-item block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Category
                  </Link>
                  <Link
                    to="/admin/brands"
                    className="dropdown-item block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Brand
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="dropdown-item block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Orders
                  </Link>
                </div>
              </div>
            )}

            {isAuthenticated && (
              <div className="relative group">
                <button className="log hidden text-sm text-white font-medium md:block bg-[#2C2C2C] px-4 py-1 rounded-sm hover:bg-white border hover:border-black hover:text-black transition-all duration-500">
                  My Account
                </button>
                <div className="dropdown-menu absolute w-24 right-0 bg-[#2C2C2C] text-white rounded-md py-1 z-50 hidden group-hover:block">
                  <Link
                    to="/userProfile/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => dispatch(logout())}
                    className="block px-4 py-2 text-sm hover:bg-white hover:text-black"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="log hidden text-sm text-white font-medium md:block bg-[#2C2C2C] px-4 py-1 rounded-sm hover:bg-white border hover:border-black hover:text-black transition-all duration-500"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  className="sign hidden text-sm font-medium md:block px-4 py-1 border border-black hover:bg-white hover:border-white transition-all duration-500"
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

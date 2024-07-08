import React from "react";
import { ImFacebook2 } from "react-icons/im";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#2C2C2C]">
      <div className="footer max-w-screen-2xl mx-auto grid grid-cols-1 bg-[#2C2C2C] lg:grid-cols-3">
        {/* news letter */}
        <div className="letter  px-5 py-4 md:px-10 lg:px-14">
          <h1 className="font-medium text-2xl text-white my-3">
            Sign Up to our Newsletter.
          </h1>

          {/* subscription */}
          <div className="flex items-center">
            <input
              type="text"
              className="py-2 px-3 my-2 w-64 bg-[#2C2C2C] border border-white  rounded-lg placeholder:text-xs placeholder:text-slate-400"
              placeholder="Your Email"
            />
            <button className="mx-4 px-4 py-2 border border-white rounded-xl bg-white text-xs font-semibold">
              Subscribe
            </button>
          </div>

          {/* social links */}
          <div className="flex items-center gap-3">
            <h2 className="text-white font-extralight text-md my-3 mx-2">
              Follow us on
            </h2>
            <ImFacebook2 className="text-white text-2xl" />
            <FaInstagram className="text-white text-3xl" />
          </div>
        </div>

        {/* customer service */}
        <div className="service  px-5  py-4 md:px-10 lg:px-14">
          <h1 className="font-medium text-2xl  text-white my-3 ">
            Customer Service
          </h1>
          <ul>
            <li className="text-slate-300 text-sm py-2 font-light">About Us</li>
            <li className="text-slate-300 text-sm py-2 font-light">Search</li>
            <li className="text-slate-300 text-sm py-2 font-light">
              Order and Returns
            </li>
            <li className="text-slate-300 text-sm py-2 font-light">
              Contact Us
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="service px-5  py-4 md:px-10 lg:px-14">
          <h1 className="font-medium text-2xl  text-white my-3 ">
            Contact Information
          </h1>
          <ul>
            <li className="text-slate-300 text-sm py-2 font-light ">
              Address : Pokhara - 12, Lamachaur, Nepal
            </li>
            <li className="text-slate-300 text-sm py-2 font-light ">
              Phone : +977 9817176633
            </li>
            <li className="text-slate-300 text-sm py-2 font-light ">
              Email : Alpaviramhub@gmail.com.np
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <hr className="text-white w-11/12 m-auto my-2" />
      <h2 className="copy w-full text-center font-thin pb-4 text-white">
        Copyright @ Alpaviramhub
      </h2>
    </div>
  );
};

export default Footer;

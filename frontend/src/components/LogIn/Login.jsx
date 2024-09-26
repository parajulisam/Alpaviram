import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../../features/authUser/authUser-action";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userInfo, isAuthenticated } = useSelector((state) => state.authUser);

  //after succesfull authentication and user info
  useEffect(() => {
    console.log("UserInfo: ", userInfo);
    if (userInfo) {
      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        console.log("Navigating to /");
        navigate("/");
      }
    }
  }, [userInfo]);

  const onSubmit = (data) => {
    // console.log(data);
    // alert(JSON.stringify(data));
    dispatch(authUser(data));
    reset();
  };
  return (
    <>
      <div className="flex  justify-center items-center my-24 h-[-100px] ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border  py-4 px-6 rounded-lg shadow-2xl w-3/4 sm:max-w-prose space-y-5 md:max-w-prose  lg:max-w-prose  "
        >
          <h1 className="text-xl  mb-4 font-semibold">Login to your account</h1>

          {/* input fields */}
          <div className=" space-y-6">
            {/* email */}

            <div className="flex flex-col space-y-3">
              <input
                type="email"
                // id="email"
                name="email"
                className="email border border-slate-400 block rounded-sm w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                placeholder="Email"
                {...register("email", { required: true })}
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500 text-sm">Email is required.</p>
              )}
            </div>

            {/* password */}
            <div className="flex flex-col space-y-3">
              <input
                type="password"
                name="password"
                // id="password"
                className=" border border-slate-400 block rounded-sm w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                placeholder="Password"
                {...register("password", { required: true, minLength: 6 })}
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 text-sm">Password is required.</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-500 text-sm">
                  Min Length did not match.
                </p>
              )}
            </div>
          </div>
          <div>
            <a
              href="#"
              className="cursor-pointer  relative text-xs w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left"
            >
              Forgot your password?
            </a>
          </div>
          <button
            type="submit"
            className="login bg-[#2C2C2C] text-white my-4 rounded-sm text-sm md:text-base py-2 w-full shadow-lg hover:bg-black"
          >
            LOGIN
          </button>
          <div className="text-xs">
            <p className="forgot">
              Create new account?{" "}
              <Link
                to="/signup"
                className="signup underline underline-offset-1 uppercase hover:text-red-500 hover:tracking-wide"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

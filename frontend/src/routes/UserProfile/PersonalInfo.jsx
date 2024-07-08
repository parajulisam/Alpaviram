import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { apiUrl } from "../../components/Product/ProductCard";
import { toast } from "react-toastify";

const PersonalInfo = () => {
  const {
    register,
    reset,
    watch,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { userInfo } = useSelector((state) => state.authUser);
  const { token } = useSelector((state) => state.token);

  const onUpdateDetailsSubmit = async (formData) => {
    const { firstName, lastName, contactNumber } = formData;

    await axios.put(
      "http://localhost:3001/api/v1/user/info",
      { firstName, lastName, contactNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    toast.success("Update successful!", {
      position: "bottom-right",
      style: { backgroundColor: "black", color: "white" },
    });
    // console.log(JSON.stringify(data));
  };

  const onUpdatePassword = async (formData) => {
    const { currentPassword, newPassword } = formData;

    // console.log(currentPassword, newPassword);
    await axios.put(
      "http://localhost:3001/api/v1/user/updatePassword",
      { currentPassword, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    toast.success("Update successful!", {
      position: "bottom-right",
      style: { backgroundColor: "black", color: "white" },
    });
    // console.log(JSON.stringify(data));
  };

  return (
    <div className="  bg-white  rounded-lg p-8 mt-4 flex gap-x-2 justify-evenly">
      <div className=" px-4 py- rounded">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Personal Information
        </h2>
        <div className="space-y-3">
          <div>
            <span className="font-medium">First Name:</span>{" "}
            {userInfo.first_name}
          </div>
          <div>
            <span className="font-medium">Last Name:</span> {userInfo.last_name}
          </div>
          <div>
            <span className="font-medium">Email:</span> {userInfo.email}
          </div>
          <div>
            <span className="font-medium">Contact:</span>{" "}
            {userInfo.contact_number}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <form onSubmit={handleSubmit(onUpdateDetailsSubmit)}>
          <div className="border px-4 py-4 border-gray-400 rounded">
            <div className="names grid grid-cols-2 space-x-4  ">
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  defaultValue={userInfo.first_name}
                  name="first_name"
                  className="firstName border border-slate-400 rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                  placeholder="First Name"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName?.type === "required" && (
                  <p className="text-red-500 text-sm">
                    First Name is required.
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  ini
                  defaultValue={userInfo.last_name}
                  name="last_name"
                  className="Last Name border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                  placeholder="Last Name"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName?.type === "required" && (
                  <p className="text-red-500 text-sm">Last Name is required.</p>
                )}
              </div>
            </div>

            {/* extra */}

            <div className="flex flex-col my-6">
              <input
                type="number"
                name="contact"
                defaultValue={userInfo.contact_number}
                className="contact border border-slate-400 block rounded-md w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                placeholder="Contact Number"
                {...register("contactNumber", { required: true })}
              />
              {errors.contactNumber?.type === "required" && (
                <p className="text-red-500 text-sm ">Contact is required.</p>
              )}
            </div>
            <div className="button">
              <button className=" my-2 text-sm text-black font-medium md:block bg-white px-6 py-2 rounded-sm hover:bg-[#2C2C2C] border border-gray-500 hover:text-white transition-all duration-500">
                Update Details
              </button>
            </div>
          </div>
        </form>
        <form onSubmit={handleSubmit(onUpdatePassword)}>
          <div className="border px-4 py-4 border-gray-400 rounded">
            <div className="names grid grid-cols-2 space-x-4  ">
              <div className="flex flex-col space-y-3">
                <input
                  type="password"
                  name="currentPassword"
                  className=" border border-slate-400 block rounded-sm w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                  placeholder="Current Password"
                  {...register("currentPassword", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.currentPassword?.type === "required" && (
                  <p className="text-red-500 text-sm ">Password is required.</p>
                )}
                {errors.currentPassword?.type === "minLength" && (
                  <p className="text-red-500 text-sm ">
                    Password must be at least 6 characters.
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-3">
                <input
                  type="password"
                  name="newPassword"
                  className=" border border-slate-400 block rounded-sm w-full py-2 px-2 placeholder:text-sm md:placeholder:text-base focus:shadow-lg  focus:outline-slate-400 "
                  placeholder="New Password"
                  {...register("newPassword", {
                    required: true,
                  })}
                />
                {errors.newPassword?.type === "required" && (
                  <p className="text-red-500 text-sm ">Password is required.</p>
                )}
              </div>
            </div>

            {/* extra */}

            <div className="button">
              <button className=" my-2 text-sm text-black font-medium md:block bg-white px-6 py-2 rounded-sm hover:bg-[#2C2C2C] border border-gray-500 hover:text-white transition-all duration-500">
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;

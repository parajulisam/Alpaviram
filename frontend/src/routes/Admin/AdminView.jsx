import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const AdminView = () => {
  return (
    <div>
      <div className="flex flex-col gap-4 overflow-hidden">
        <div className="flex justify-center bg-[#2C2C2C] gap-6 py-4 text-left uppercase font-medium text-white">
          {/* Use NavLink for navigation links with active styling */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-4 bg-white text-black"
                : "py-2 px-4 hover:bg-white duration-300 "
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-4 bg-white text-black"
                : "py-2 px-4 hover:bg-white duration-300"
            }
          >
            Orders
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-4 bg-white text-black"
                : "py-2 px-4 hover:bg-white duration-300"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/category"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-4 bg-white text-black"
                : "py-2 px-4 hover:bg-white duration-300"
            }
          >
            Category
          </NavLink>
          <NavLink
            to="/admin/brands"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-4 bg-white text-black"
                : "py-2 px-4 hover:bg-white duration-300"
            }
          >
            Brand
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive
                ? "py-2 px-4 bg-white text-black"
                : "py-2 px-4 hover:bg-white duration-300"
            }
          >
            Users
          </NavLink>
        </div>
        <div className="rounded-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminView;

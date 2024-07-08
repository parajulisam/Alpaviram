import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { first_name, last_name, email } = useSelector(
    (state) => state.authUser.userInfo
  );
  return (
    <div className="flex justify-center items-center h-full bg-[#D9D9D9]">
      <div className="font-light text-lg ">
        Welcome {first_name} to the Dashboard of your AlpaviramHub account. Please
        enjoy!
      </div>
    </div>
  );
};

export default Dashboard;

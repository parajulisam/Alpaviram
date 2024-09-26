import React from "react";
import banner from "../../assets/banner-airpods-pro.jpeg";

const Banner = () => {
  return (
    <div className="max-w-screen-2xl w-full m-auto relative rounded-sm">
      <img src={banner} className="w-full h-[250px] md:h-[400px] lg:h-[200px]" />
    </div>
  );
};

export default Banner;

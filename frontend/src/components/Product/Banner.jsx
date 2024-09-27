import React from "react";
import banner from "../../assets/banner-airpods-pro.jpeg";

const Banner = () => {
  return (
    <div className="w-[calc(100vw-17px)] w-full m-auto relative rounded-sm">
      <img src={banner} className="w-full h-[250px]  md:h-[400px]" />
    </div>
  );
};

export default Banner;

import React from "react";
import banner from "../../assets/banner-airpods-pro.jpeg";

const Banner = () => {
  return (
    <div className="max-w-screen-2xl h-[400px] w-full m-auto relative rounded-sm">
      <div
        className="w-full h-full bg-cover bg-center "
        style={{ backgroundImage: `url(${banner})` }}
      ></div>
    </div>
  );
};

export default Banner;

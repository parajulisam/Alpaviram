import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1">
      <span className="mx-1">
        {value >= 1 ? (
          <FaStar className="text-yellow-500 drop-shadow-2xl" />
        ) : value >= 0.5 ? (
          <FaStarHalfAlt className="text-yellow-500 drop-shadow-2xl" />
        ) : (
          <FaRegStar className="text-yellow-500 drop-shadow-2xl" />
        )}
      </span>
      <span className="mx-1">
        {value >= 2 ? (
          <FaStar className="text-yellow-500 drop-shadow-2xl" />
        ) : value >= 1.5 ? (
          <FaStarHalfAlt className="text-yellow-500 drop-shadow-2xl" />
        ) : (
          <FaRegStar className="text-yellow-500 drop-shadow-2xl" />
        )}
      </span>
      <span className="mx-1">
        {value >= 3 ? (
          <FaStar className="text-yellow-500 drop-shadow-2xl" />
        ) : value >= 2.5 ? (
          <FaStarHalfAlt className="text-yellow-500 drop-shadow-2xl" />
        ) : (
          <FaRegStar className="text-yellow-500 drop-shadow-2xl" />
        )}
      </span>
      <span className="mx-1">
        {value >= 4 ? (
          <FaStar className="text-yellow-500 drop-shadow-2xl" />
        ) : value >= 3.5 ? (
          <FaStarHalfAlt className="text-yellow-500 drop-shadow-2xl" />
        ) : (
          <FaRegStar className="text-yellow-500 drop-shadow-2xl" />
        )}
      </span>
      <span className="mx-1">
        {value >= 5 ? (
          <FaStar className="text-yellow-500 drop-shadow-2xl" />
        ) : value >= 4.5 ? (
          <FaStarHalfAlt className="text-yellow-500 drop-shadow-2xl" />
        ) : (
          <FaRegStar className="text-yellow-500 drop-shadow-2xl" />
        )}
      </span>

      <span className="px-2">{text && text}</span>
    </div>
  );
};

export default Rating;

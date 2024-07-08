import React, { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

export const DropdownTableRow = ({
  colSpanNumber,
  remainingTableRows,
  dropdownDiv,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <>
      <tr className="border-2 border-t-0">
        <td className="p-3" onClick={toggleDropdown}>
          <FaAngleDown className="size-4" />
        </td>
        <>{remainingTableRows}</>
      </tr>
      {showDropdown && (
        <tr className="border-2 border-t-0 bg-white">
          <td colSpan={colSpanNumber}>{dropdownDiv}</td>
        </tr>
      )}
    </>
  );
};

import React from "react";
import { useState } from "react";

const SelectGender = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="border p-2 rounded border-[#c86989] 
                   text-[#c86989] cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-[#712941]"
      >
        {value
          ? options.find((opt) => opt.value === value)?.label
          : "Select Gender"}
      </div>

     
      {open && (
        <ul className="absolute left-0 w-full mt-1 bg-white 
                       border border-[#c86989] rounded shadow-md z-10">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`p-2 cursor-pointer transition-colors
                ${
                  value === opt.value
                    ? "bg-[#712941] text-white"
                    : "text-[#c86989] hover:bg-[#712941] hover:text-white"
                }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectGender
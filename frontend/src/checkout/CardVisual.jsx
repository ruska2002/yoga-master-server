import React, { useState } from "react";

export default function CardVisual() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  return (
    <div className="w-full max-w-md mx-auto">
     
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <div className="mb-6">
          <label className="block text-[#712941] text-sm mb-1">Card number</label>
          <div className="flex items-center border-b-2 border-[#f3d3e0] focus-within:border-[#712941]">
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 16) value = value.slice(0, 16);
                value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                setCardNumber(value);
              }}
              placeholder="1234 5678 0000 1276"
              className="appearance-none
                         [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none
                         [&::-moz-appearance]:textfield
                         w-full p-2 text-lg focus:outline-none placeholder-[#c86989] text-[#712941]"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-[#712941] text-sm mb-1">MM/YY</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 4) value = value.slice(0, 4);
                if (value.length > 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2);
                }
                setExpiry(value);
              }}
              placeholder="07/26"
              className="w-full border-b-2 border-[#f3d3e0] p-2 focus:outline-none placeholder-[#c86989] focus:border-[#712941] appearance-none
                         [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none
                         [&::-moz-appearance]:textfield
                         text-lg"
            />
          </div>

          <div className="flex-1">
            <label className="block text-[#712941] text-sm mb-1 ">CVC/CVV2</label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, "");
                if (value.length > 3) value = value.slice(0, 3);
                setCvc(value);
              }}
              placeholder="123"
              className="w-full border-b-2 border-[#f3d3e0] p-2 focus:outline-none placeholder-[#c86989] focus:border-[#712941] appearance-none
                         [&::-webkit-outer-spin-button]:appearance-none
                         [&::-webkit-inner-spin-button]:appearance-none
                         [&::-moz-appearance]:textfield
                         text-lg text-[#712941]" />
          </div>
        </div>
      </div>

      
      <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-lg bg-gradient-to-r from-blue-400 to-teal-400 text-white p-6">
        <div className="text-xl tracking-widest mb-8">
          {cardNumber || "#### #### #### ####"}
        </div>

        <div className="absolute bottom-16 left-6 text-lg font-semibold">
          John Smith
        </div>

        <div className="absolute bottom-6 left-6 text-lg">
          {expiry || "MM/YY"}
        </div>

        <div className="absolute bottom-6 right-6 text-lg">
          {cvc || "CVC"}
        </div>
      </div>
    </div>
  );
}
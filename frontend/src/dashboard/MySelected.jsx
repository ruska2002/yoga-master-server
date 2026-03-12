import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";
import PreLoader from "../components/PreLoader";

export default function MySelected() {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const goToCheckout = () => {
    
    const total = selectedClasses.reduce((sum, cls) => sum + Number(cls.price), 0);
    localStorage.setItem("checkoutTotal", total.toFixed(2));
    localStorage.setItem("checkoutClasses", JSON.stringify(selectedClasses));

    navigate("/dashboard/payment-info");
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await api.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSelectedClasses(res.data);
      } catch (err) {
        console.log(err);
        alert("Error fetching cart");
      }finally{
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  

  const handleRemove = async (classId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.delete(`/delete-cart-item/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedClasses(selectedClasses.filter((cls) => cls._id !== classId));
    } catch (err) {
      console.log(err);
      alert("Error removing class");
    }
  };

  const totalPrice = selectedClasses.reduce((sum, cls) => sum + Number(cls.price), 0);
  const tax = (totalPrice * 0.08).toFixed(2);
  const totalWithTax = (totalPrice + Number(tax)).toFixed(2);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[#712941] mb-6">
        My Selected Classes
      </h2>
      {loading ? (<PreLoader inline/>) : selectedClasses.length === 0 ? (
        <p className="text-center text-[#712941]">Your cart is empty</p>
      ) : ( 
        <>
         <div className="grid grid-cols-4 gap-6 text-[#712941]">
        {selectedClasses.map((cls) => (
          <div key={cls._id} className="shadow-lg rounded p-4 relative">
            <img
              src={cls.image}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <p className="font-bold">{cls.name}</p>
            <p>Instructor: {cls.instructorName}</p>
            <p>Price: ${cls.price}</p>
            <button
              onClick={() => handleRemove(cls._id)}
              className="absolute top-2 right-2 bg-[#712941] text-white px-2 py-1 rounded hover:bg-[#c86989]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {selectedClasses.length > 0 && (
        <div className="shadow-lg rounded p-4 w-[40%] flex flex-col ml-auto gap-2 text-[#712941] mt-6">
          <h1 className="text-xl font-bold">SUMMARY</h1>
          <hr className="bg-[#712941]" />
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>${totalPrice}</p>
          </div>
          <div className="flex justify-between">
            <p>Taxes:</p>
            <p>${tax}</p>
          </div>
          <div className="flex justify-between">
            <p>Extra Fees:</p>
            <p>$0.00</p>
          </div>
          <hr className="bg-[#712941]" />
          <div className="flex justify-between mt-2 text-xl font-bold">
            <p>Total:</p>
            <p>${totalWithTax}</p>
          </div>
          <button
            onClick={goToCheckout}
            className="bg-[#712941] text-white py-3 px-3 rounded-lg hover:bg-[#c86989]"
          >
            Proceed to Payment
          </button>
        </div>
      )}
      
    </>
     )
      }
    </div>
  );
}
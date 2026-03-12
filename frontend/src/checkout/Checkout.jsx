import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../lib/axios";

export default function Checkout() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const selectedClasses = JSON.parse(localStorage.getItem("checkoutClasses") || "[]");
  const totalPrice = selectedClasses.reduce((sum, cls) => sum + Number(cls.price), 0);
  const tax = (totalPrice * 0.08).toFixed(2);
  const totalWithTax = (totalPrice + Number(tax)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/create-payment-intent",
        { price: totalWithTax },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        res.data.clientSecret,
        { payment_method: { card: elements.getElement(CardElement) } }
      );

      if (error) {
        alert(error.message);
      } else if (paymentIntent.status === "succeeded") {
        const user = JSON.parse(localStorage.getItem("user"));

        await api.post(
          "/payment-info",
          {
            userEmail: user.email,
            classesId: selectedClasses.map((c) => c._id),
            price: totalWithTax,
            transactionId: paymentIntent.id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        localStorage.removeItem("checkoutClasses");
        localStorage.removeItem("checkoutTotal");

        
        setSuccess(true);
      }
    } catch (err) {
      console.log(err);
      alert("Payment failed!");
    }
    setLoading(false);
  };

  
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-[#712941]">
        <div className="text-6xl">✅</div>
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-[#c86989]">Your classes have been enrolled.</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/dashboard/my-enrolled")}
            className="bg-[#712941] text-white px-6 py-2 rounded-lg hover:bg-[#c86989]"
          >
            My Enrolled Classes
          </button>
          <button
            onClick={() => navigate("/dashboard/payment-history")}
            className="border border-[#712941] text-[#712941] px-6 py-2 rounded-lg hover:bg-[#f3d3e0]"
          >
            Payment History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-2 text-[#712941]">Checkout</h1>
      <p className="text-[#c86989] mb-6">Total: <span className="font-bold text-[#712941]">${totalWithTax}</span></p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-lg border border-[#f3d3e0]">
          <label className="block text-[#712941] text-sm mb-3">Card Details</label>
        
          <CardElement
            options={{
               hidePostalCode: true,
              disableLink: true, 
              style: {
                base: {
                  fontSize: "16px",
                  color: "#712941",
                  "::placeholder": { color: "#c86989" },
                },
                invalid: { color: "#e53e3e" },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-[#712941] text-white py-3 rounded-lg hover:bg-[#c86989] disabled:opacity-50 transition-colors"
        >
          {loading ? "Processing..." : `Pay $${totalWithTax}`}
        </button>
      </form>
    </div>
  );
}
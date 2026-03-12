import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import PreLoader from "../components/PreLoader";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) return;

      try {
        const res = await api.get(`/payment-history/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPayments(res.data);
      } catch (err) {
        console.log(err);
        alert("Error fetching payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  

  return (
    <div className="p-6">
       <h2 className="text-3xl font-bold text-[#712941] mb-6">
       Payment History
      </h2>
      {loading ? (<PreLoader inline/>) : payments.length === 0 ? (
        <p className="text-center mt-6 text-[#712941]">No payment history found.</p>
      ) : (
        <div className="max-w-4xl mx-auto mt-10 p-6 shadow rounded">      
        <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-[#712941] text-white">
            <th className="border px-4 py-2"></th>
            <th className="border px-4 py-2">Class Name</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Date</th>
           
          </tr>
        </thead>
        <tbody>
          {payments.map((pmt, index) => (
            <tr key={pmt._id} className="text-center text-[#712941]">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-3">
                <div className="max-h-16 overflow-y-auto flex flex-col gap-1">
                  {pmt.classNames ? pmt.classNames.map((name, idx) => (<span key={idx} className="bg-[#f3d3e0] text-[#712941] px-2 py-0.5 rounded-full text-sm whitespace-nowrap">
                    {name}
                  </span>)) : `${pmt.classesId?.length || 1} class(es)`}
                </div>
              </td>
              <td className="border px-4 py-2">${pmt.price}</td>
             
              <td className="border px-4 py-2">
                {new Date(pmt.date || pmt.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      )}
      
    </div>
    
  );
}
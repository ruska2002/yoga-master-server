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
    <div className="sm:p-6 font-dancing">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#712941] mb-4 sm:mb-6">
        Payment History
      </h2>

      {loading ? (
        <PreLoader inline />
      ) : payments.length === 0 ? (
        <p className="text-center mt-6 text-[#712941]">No payment history found.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block max-w-4xl mx-auto mt-6 p-4 sm:p-6 shadow rounded overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#712941] text-white text-sm">
                  <th className="border px-4 py-2">#</th>
                  <th className="border px-4 py-2">Class Name</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pmt, index) => (
                  <tr key={pmt._id} className="text-center text-[#712941]">
                    <td className="border px-4 py-2 text-sm">{index + 1}</td>
                    <td className="border px-4 py-3">
                      <div className="max-h-16 overflow-y-auto flex flex-col gap-1 items-center">
                        {pmt.classNames
                          ? pmt.classNames.map((name, idx) => (
                              <span key={idx} className="bg-[#f3d3e0] text-[#712941] px-2 py-0.5 rounded-full text-sm whitespace-nowrap">
                                {name}
                              </span>
                            ))
                          : `${pmt.classesId?.length || 1} class(es)`}
                      </div>
                    </td>
                    <td className="border px-4 py-2 text-sm">${pmt.price}</td>
                    <td className="border px-4 py-2 text-sm">
                      {new Date(pmt.date || pmt.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden mt-4">
            {payments.map((pmt, index) => (
              <div key={pmt._id} className="bg-[#f3d3e0] rounded-lg p-4 shadow border border-[#c86989]/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-[#a07080]">#{index + 1}</span>
                  <span className="font-bold text-[#712941]">${pmt.price}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {pmt.classNames
                    ? pmt.classNames.map((name, idx) => (
                        <span key={idx} className="bg-white text-[#712941] px-2 py-0.5 rounded-full text-xs">
                          {name}
                        </span>
                      ))
                    : <span className="text-sm text-[#712941]">{pmt.classesId?.length || 1} class(es)</span>}
                </div>
                <p className="text-xs text-[#a07080]">
                  {new Date(pmt.date || pmt.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
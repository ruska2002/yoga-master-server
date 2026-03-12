import React, { useEffect, useState } from "react";
import api from "../lib/axios";
import PreLoader from "../components/PreLoader";

export default function MyEnrolled() {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      if (!token || !user) return;

      try {
        
        const res = await api.get(`/enrolled-classes/${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledClasses(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolled();
  }, []);

  

  return (
    <div className="p-6 ">
      <h2 className="text-3xl font-bold text-[#712941] mb-6">My Enrolled Classes</h2>
      {loading ? (<PreLoader inline/>) : enrolledClasses.length === 0 ? (
        <p className="text-center mt-6 text-[#712941]">You have not enrolled in any classes yet.</p>
      ):(
        <div className="grid grid-cols-4 gap-6">
          {enrolledClasses.map((item, index) => (
            <div key={index} className="shadow-lg rounded-lg overflow-hidden text-[#712941]">
              <img src={item.classes.image} className="w-full h-32 object-cover" />
              <div className="p-4">
                <p className="font-bold">{item.classes.name}</p>
                <p className="text-sm text-[#c86989]">Instructor: {item.instructor?.name}</p>
                <p className="text-sm mt-1">${item.classes.price}</p>
                <span className="inline-block mt-2 text-xs bg-[#f3d3e0] text-[#712941] px-2 py-1 rounded-full">
                  Enrolled ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
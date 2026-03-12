import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from '../lib/axios'
import Footer from '../components/Footer'
import { useNavigate } from "react-router";
import PreLoader from "../components/PreLoader";


const Classes = () => {
    const [cartIds, setCartIds] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [classes, setClasses] = useState([])
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (!token || !user) return;

    try {
      
      const cartRes = await api.get("/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartIds(cartRes.data.map((c) => c._id));

     
      const enrolledRes = await api.get(`/enrolled-classes/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledIds(enrolledRes.data.map((item) => item.classes._id));
    } catch (err) {
      console.log(err);
    }
  };
  fetchUserData();
}, []);

    useEffect(() => {
        const FetchData = async () => {
            try{
                const res = await api.get('classes')
                setClasses(res.data)
            }catch(err){
                console.log(err)
            }finally{
                setLoading(false)
            }
        }
        FetchData()
    }, [])
    if(loading){
       return <PreLoader/>
    }

const handleSelect = async (selectedClass) => {
  const token = localStorage.getItem("token");
  if (!token) return alert("Please login first!");

  try {
    await api.post(
      "/add-to-cart",
      { classId: selectedClass._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Class added to your cart!");
  } catch (err) {
    console.log(err);
    alert(err.response?.data?.message || "Error adding class");
  }
};
    return(
        <div>
            <NavBar/>
           <div className="flex flex-col">
            <hr className="mt-[5%]"/>
             <p className="text-center text-[#712941] text-[20px] md:text-[35px] font-bold uppercase">Classes</p>
             <hr className="mb-[5%]"/>
            <div className="lg:grid-cols-4 md:grid-cols-3 grid grid-cols-2 sm:grid gap-6 max-w-6xl mx-auto">
                {classes.map((cls) => (
                   <div
                    key={cls._id}
                   className="w-[170px] h-[280px] min-[535px]:w-[230px] min-[535px]:h-[300px] shadow-2xl rounded-lg overflow-hidden relative group cursor-pointer flex flex-col"
                    >
                    <img
                        src={cls.image}
                        className="w-full h-[140px] object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    
                    <div className="p-4 text-[#712941] flex flex-col flex-1">
                        <p className="font-bold text-[12px] min-[535px]:text-[15px]">{cls.name}</p>
                        <p className="text-[10px] min-[535px]:text-[14px]">Instructor: {cls.instructorName}</p>
                        <p className="text-[9px] min-[535px]:text-[13px]">Available Seats: {cls.availableSeats}</p>
                       
                    
                        <button onClick={() => navigate(`/classes/${cls._id}`)} className="mt-auto bg-[#712941] hover:bg-[#c86989] text-white py-1 rounded z-10">
                        View
                        </button>
                    </div>


                   <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"></div>

                   <button
                    onClick={() => handleSelect(cls)}
                    disabled={cartIds.includes(cls._id) || enrolledIds.includes(cls._id)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       sm:py-2 sm:px-4 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10
                      disabled:bg-gray-400 disabled:cursor-not-allowed
                      bg-[#c86989] text-white hover:bg-[#712941]"
                  >
                    {enrolledIds.includes(cls._id)
                      ? "Enrolled ✓"
                      : cartIds.includes(cls._id)
                      ? "In Cart"
                      : "Select"}
                  </button>
                    </div>

                ))}
            </div>
           </div>
           <Footer />
        </div>
    )
}

export default Classes;
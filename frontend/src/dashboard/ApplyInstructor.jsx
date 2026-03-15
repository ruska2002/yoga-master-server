import React, { useState } from "react";
import api from "../lib/axios"; 
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "../lib/cloudinary";

export default function ApplyInstructor() {
  const [question, setQuestion] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [age, setAge] = useState("");
  const [specialization, setSpecialization] = useState("");
  const { user } = useAuth(); 

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 
    if (!token) return toast.error("Please login first");
    if (!photo) return toast.error("Please upload your photo");

    try {
      setLoading(true);
      const photoUrl = await uploadToCloudinary(photo);

      const data = {
        name: user?.name,
        email: user?.email,
        yearsOfExperience,
        age,
        specialization,
        answer: question,
        photoUrl,
        status: "pending"
      };

      const res = await api.post("/ass-instructor", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);
      toast.success("Application submitted successfully!");
      setYearsOfExperience("");
      setAge("");
      setSpecialization("");
      setQuestion("");
      setPhoto(null);
      setPreview(null);
    } catch (err) {
      console.log(err);
      toast.error("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:p-6 font-dancing">
      <h2 className="text-3xl font-bold text-[#712941] mb-6">
        Apply as Instructor
      </h2>
  
      <div className="max-w-md mx-auto p-6 shadow rounded bg-[#f3d3e0]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex justify-between">
            <p className="text-[#712941] font-bold">Name</p>
            <p className="text-[#c86989]">{user?.name}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-[#712941] font-bold">Email</p>
            <p className="text-[#c86989]">{user?.email}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-[#712941] font-bold">Age</p>
           <input 
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-20 border border-[#c86989] rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#c86989]"
              required
            />
          </div>
          <div className="flex justify-between">
            <p className="text-[#712941] font-bold">Years of Yoga Experience</p>
           <input
              type="text"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(e.target.value)}
              className="w-20 border border-[#c86989] rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#c86989]"
              required
            />
          </div>
          <div className="flex justify-between">
            <p className="text-[#712941] font-bold">Specialization</p>
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="border border-[#c86989] rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#c86989]"
              required
            />
          </div>

          {/*  Photo Upload Section */}
          <div className="flex flex-col items-center gap-3 py-2">
            
          
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#c86989] overflow-hidden flex items-center justify-center bg-pink-50">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#c86989] text-xs text-center px-2">No photo</span>
              )}
            </div>

         
            <input
              type="file"
              accept="image/*"
              id="photoInput"
              onChange={handlePhotoChange}
              className="hidden"
            />

            
            <label
              htmlFor="photoInput"
              className="cursor-pointer border border-[#c86989] text-[#712941] py-1 px-4 rounded hover:bg-[#712941] hover:text-white transition-colors text-sm"
            >
              {preview ? "Change Photo" : "Add Your Photo"}
            </label>
          </div>

          <label>
            <p className="text-[#712941] font-bold mb-2">What is yoga for you?</p>
            <textarea
              placeholder="Yoga is a practice that unites the body......."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-[#c86989] placeholder-[#c86989] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#c86989] [&::-webkit-resizer]:bg-transparent [&::-webkit-resizer]:bg-none"
              rows={4}
              required
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpolygon points='0,10 10,0 10,10' fill='%23c86989'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'bottom right',
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#712941] text-white py-2 px-4 rounded hover:bg-[#c86989] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
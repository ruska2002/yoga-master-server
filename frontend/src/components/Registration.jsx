import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SelectGender from "./SelectGender";
import api from "../lib/axios";
import home from '../../public/assets/home.png'
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Registration = () => {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
 
  try {
    const response = await api.post("/new-user", { name, email, password, gender });
    login(response.data); 
    navigate("/dashboard");
  } catch (err) {
    const message = err.response?.data?.message || "Registration failed";
    setError(message)
    toast.error(message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-dancing">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl flex flex-col gap-5 text-[#712941]">
        <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border p-3 rounded-lg placeholder-[#c86989] border-[#c86989] focus:outline-none focus:ring-2 focus:ring-[#712941] transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-3 rounded-lg placeholder-[#c86989] border-[#c86989] focus:outline-none focus:ring-2 focus:ring-[#712941] transition-all"
          />
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-3 rounded-lg placeholder-[#c86989] border-[#c86989] focus:outline-none focus:ring-2 focus:ring-[#712941] transition-all"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border p-3 rounded-lg placeholder-[#c86989] border-[#c86989] focus:outline-none focus:ring-2 focus:ring-[#712941] transition-all"
          />
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <SelectGender value={gender} onChange={setGender} />

        <button
          type="submit"
          className="bg-[#712941] text-white py-3 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          Register
        </button>

        <div className="flex gap-8 mt-4 justify-center">
          <Link to="/">
            <div className="flex items-center justify-center gap-2 bg-[#f3d3e0] text-[#712941] py-2 px-4 rounded-xl font-semibold hover:bg-[#e9b7d0] cursor-pointer transition w-44">
              <img src={home} alt="home" className="w-5 h-5" />
              <p className="text-center">Back Home</p>
            </div>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Registration;
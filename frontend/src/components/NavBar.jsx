import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import avatar from '../../public/assets/meditation.png';
import { useAuth } from '../context/AuthContext';

export default function NavBar({ onMenuToggle }) {
  const { user, logout } = useAuth();  // ← use context
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = (value) => {
    setMenuOpen(value);
    if (onMenuToggle) onMenuToggle(value);
  };

  const handleLogOut = () => {
    logout();             
    toggleMenu(false);
    navigate("/");
  };

  return (
    <header className="w-full font-dancing">
      <div className="flex justify-between items-center px-6 sm:px-12 py-4 w-full bg-[#dac2da]">
        <h2 className="text-[#712941] text-xl md:text-3xl font-bold font-dancing">YogaVibe</h2>

        <nav className="hidden md:flex gap-8 items-center text-[#712941] md:text-xl">
          <Link to="/" className="hover:text-[#c86989] transition">Home</Link>
          <Link to="/instructors" className="hover:text-[#c86989] transition">Instructors</Link>
          <Link to="/classes" className="hover:text-[#c86989] transition">Classes</Link>

          {!user ? (
            <Link to="/login" className="hover:text-[#c86989] transition">Login</Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to='/dashboard' className="hover:text-[#c86989] transition">Dashboard</Link>
              <img src={user.photoURL || avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              <button onClick={handleLogOut} className="hover:text-[#c86989] transition">Sign Out</button>
            </div>
          )}
        </nav>

        <button onClick={() => toggleMenu(!menuOpen)} className="md:hidden text-[#712941]">
          {menuOpen ? <HiX className="w-6 h-5" /> : <HiMenuAlt3 className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-[#712941] bg-[#dac2da] shadow-md">
          <Link to="/" onClick={() => toggleMenu(false)} className="hover:text-[#c86989] transition">Home</Link>
          <Link to="/instructors" onClick={() => toggleMenu(false)} className="hover:text-[#c86989] transition">Instructors</Link>
          <Link to="/classes" onClick={() => toggleMenu(false)} className="hover:text-[#c86989] transition">Classes</Link>

          {!user ? (
            <Link to="/login" onClick={() => toggleMenu(false)} className="hover:text-[#c86989] transition">Login</Link>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <img src={user.photoURL || avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                <span className="font-semibold uppercase text-sm">{user.name}</span>
              </div>
              <Link to='/dashboard' onClick={() => toggleMenu(false)} className="hover:text-[#c86989] transition">Dashboard</Link>
              <button onClick={handleLogOut} className="text-left hover:text-[#c86989] transition">Sign Out</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
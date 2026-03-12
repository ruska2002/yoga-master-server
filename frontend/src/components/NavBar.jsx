import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import avatar from '../../public/assets/meditation.png';

export default function NavBar({menuOpen, setMenuOpen}) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    menuOpen(false)
    navigate("/");
  };

  return (
    <header className="w-full">
      <div className="flex justify-between items-center px-6 sm:px-12 py-4 w-full">
        
        {/* Logo */}
        <h2 className="text-[#712941] text-xl font-bold">YogaVibe</h2>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-8 items-center text-[#712941]">
          <Link to="/" className="hover:text-[#c86989] transition">Home</Link>
          <Link to="/instructors" className="hover:text-[#c86989] transition">Instructors</Link>
          <Link to="/classes" className="hover:text-[#c86989] transition">Classes</Link>

          {!user ? (
            <Link to="/login" className="hover:text-[#c86989] transition">Login</Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link to='/dashboard' className="hover:text-[#c86989] transition">Dashboard</Link>
              <img
                src={user.photoURL || avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <button onClick={handleLogOut} className="hover:text-[#c86989] transition">
                Sign Out
              </button>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#712941]"
        >
          {menuOpen ? <HiX className="w-6 h-5" /> : <HiMenuAlt3 className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-[#712941] bg-[#dac2da] shadow-md">
          <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-[#c86989] transition">Home</Link>
          <Link to="/instructors" onClick={() => setMenuOpen(false)} className="hover:text-[#c86989] transition">Instructors</Link>
          <Link to="/classes" onClick={() => setMenuOpen(false)} className="hover:text-[#c86989] transition">Classes</Link>

          {!user ? (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-[#c86989] transition">Login</Link>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-semibold uppercase text-sm">{user.name}</span>
              </div>
              <Link to='/dashboard' onClick={() => setMenuOpen(false)} className="hover:text-[#c86989] transition">Dashboard</Link>
              <button onClick={handleLogOut} className="text-left hover:text-[#c86989] transition">Sign Out</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
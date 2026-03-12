import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";
import { TbShoppingBag, TbShoppingBagSearch } from "react-icons/tb";
import { GiMeditation } from "react-icons/gi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { HiOutlineLogin, HiUsers } from "react-icons/hi";
import { MdClass } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa6";
import { MdLibraryAdd, MdLibraryAddCheck, MdPendingActions, MdFactCheck } from "react-icons/md";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const links = (
    <div className="flex flex-col justify-between h-full">
      <div className="p-6 pt-14">
        <h2 className="text-2xl font-bold text-[#712941] mb-6">YogaVibe</h2>
        <div className="flex flex-col gap-3 text-[#712941]">

          {user?.role === "user" && (
            <>
              <Link to="" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <TbLayoutDashboardFilled className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="my-enrolled" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <GiMeditation className="w-5 h-5" /> My Enrolled
              </Link>
              <Link to="my-selected" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <TbShoppingBag className="w-5 h-5" /> My Selected
              </Link>
              <Link to="payment-history" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <TbShoppingBagSearch className="w-5 h-5" /> Payment History
              </Link>
              <Link to="apply-instructor" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <FaChalkboardTeacher className="w-5 h-5" /> Apply for Instructor
              </Link>
            </>
          )}

          {user?.role === "instructor" && (
            <>
              <Link to="" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <TbLayoutDashboardFilled className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="add-class" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <MdLibraryAdd className="w-5 h-5" /> Add a Class
              </Link>
              <Link to="my-classes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <MdLibraryAddCheck className="w-5 h-5" /> My Classes
              </Link>
              <Link to="pending-classes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <MdPendingActions className="w-5 h-5" /> Pending Classes
              </Link>
              <Link to="approved-classes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <MdFactCheck className="w-5 h-5" /> Approved Classes
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <TbLayoutDashboardFilled className="w-5 h-5" /> Dashboard
              </Link>
              <Link to="manage-users" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <HiUsers className="w-5 h-5" /> Manage Users
              </Link>
              <Link to="manage-classes" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <MdClass className="w-5 h-5" /> Manage Classes
              </Link>
              <Link to="applications" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
                <FaFileSignature className="w-5 h-5" /> Applications
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="p-6 flex flex-col gap-3 text-[#712941]">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#712941]" />
          <div className="flex-1 border-t-2 border-[#712941]" />
          <div className="w-2 h-2 rounded-full bg-[#712941]" />
        </div>
        <div className="flex gap-2 items-center">
          <GrYoga style={{ width: '20px', height: '20px' }} className="text-[#712941] ml-2" />
          <p className="uppercase font-bold truncate">{user?.name}</p>
        </div>
        <Link to="/" className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
          <IoHome className="w-5 h-5" /> Home
        </Link>
        <button onClick={handleLogOut} className="flex items-center gap-2 p-2 rounded hover:bg-[#f3d3e0] transition">
          <HiOutlineLogin className="w-5 h-5" /> Log Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 bg-white shadow-lg flex-col">
        {links}
      </div>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md text-[#712941]"
      >
        <HiMenuAlt2 className="w-6 h-6" />
      </button>

      {/* Mobile sliding sidebar - full screen with inline style */}
      <div
        style={{
          width: '100vw',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease'
        }}
        className="md:hidden fixed top-0 left-0 h-full bg-white shadow-xl z-50"
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-[#712941]"
        >
          <HiX className="w-6 h-6" />
        </button>
        {links}
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
        <Outlet />
      </div>
    </div>
  );
}
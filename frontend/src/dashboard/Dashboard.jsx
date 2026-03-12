// src/dashboard/Dashboard.jsx
import React from 'react'
import { useAuth } from '../context/AuthContext'
import helloGif from '../../public/assets/gif.gif'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-[#712941] text-xl'>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-[#712941] text-xl'>Please log in</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center items-center gap-2 text-[#712941]'>
      <img src={helloGif} alt='gif' className=' w-72 '  />
      <div className='flex flex-col items-center'>
        <h1 className='flex gap-2 text-[25px]'>
          Hi, <p className='uppercase'>{user.name}</p>
        </h1>
        <h1 className='text-[45px]'>Welcome To Your Dashboard</h1>
        <p>Hey dear, This is a simple dashboard home. Our developer is updating it.</p>
        <p className='font-bold'>You can jump to any page you want from here.</p>
        <div className='flex gap-2 mt-4'>
          <Link to='/dashboard/my-enrolled' className="bg-[#712941] text-white py-3 px-3 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
            My Enroll
          </Link>
          <Link to="/dashboard/my-selected" className="bg-[#712941] text-white py-3 px-3 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
            My Selected
          </Link>
          <Link to="/dashboard/payment-history" className="bg-[#712941] text-white py-3 px-3 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
            Payment History
          </Link>
          <Link to="/dashboard/apply-instructor" className="bg-[#712941] text-white py-3 px-3 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg">
            Join as Instructor
          </Link>
        </div>
      </div>
    </div>
  );
}
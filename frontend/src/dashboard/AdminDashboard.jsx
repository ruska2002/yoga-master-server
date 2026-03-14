import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col justify-center items-center gap-4 text-[#712941] font-dancing'>
      <h1 className='text-[40px] font-bold'>Admin Panel</h1>
      <p className='text-xl'>Welcome, <span className='uppercase font-bold'>{user?.name}</span>!</p>
      <p className='text-[#8c3256]'>You have full control over users, classes, and applications.</p>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 w-full max-w-2xl'>
       
        <Link to='/dashboard/manage-users' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md">
          Manage Users
        </Link>
        <Link to='/dashboard/manage-classes' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md">
          Manage Classes
        </Link>
        <Link to='/dashboard/applications' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md">
          Applications
        </Link>
      </div>
    </div>
  )
}
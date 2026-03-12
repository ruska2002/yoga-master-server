import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function InstructorDashboard() {
  const { user } = useAuth();

  return (
    <div className='flex flex-col justify-center items-center gap-4 text-[#712941] px-4 py-8'>
      <h1 className='text-2xl sm:text-4xl font-bold text-center'>Instructor Panel</h1>
      <p className='text-base sm:text-xl text-center'>Welcome, <span className='uppercase font-bold'>{user?.name}</span>!</p>
      <p className='text-[#8c3256] text-sm sm:text-base text-center'>Manage your classes and track your students from here.</p>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 w-full max-w-2xl'>
        <Link to='/dashboard/add-class' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md text-center text-sm sm:text-base flex items-center justify-center">
          Add a Class
        </Link>
        <Link to='/dashboard/my-classes' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md text-center text-sm sm:text-base flex items-center justify-center">
          My Classes
        </Link>
        <Link to='/dashboard/pending-classes' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md text-center text-sm sm:text-base flex items-center justify-center">
          Pending Classes
        </Link>
        <Link to='/dashboard/approved-classes' className="bg-[#712941] text-white py-3 px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md text-center text-sm sm:text-base flex items-center justify-center">
          Approved Classes
        </Link>
      </div>
    </div>
  )
}
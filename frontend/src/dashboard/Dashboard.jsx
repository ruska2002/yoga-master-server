import React from 'react'
import { useAuth } from '../context/AuthContext'
import helloGif from '../../public/assets/gif.gif'
import { Link } from 'react-router-dom'
import PreLoader from '../components/PreLoader';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
   <PreLoader/>
  }

  if (!user) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p className='text-[#712941] text-xl'>Please log in</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center items-center gap-2 text-[#712941] p-4 sm:p-6 font-dancing'>
      <img src={helloGif} alt='gif' className='w-40 sm:w-56 md:w-72' />
      <div className='flex flex-col items-center text-center'>
        <h1 className='flex gap-2 text-lg sm:text-[25px] font-bold'>
          Hi, <p className='uppercase'>{user.name}</p>
        </h1>
        <h1 className='text-2xl sm:text-3xl md:text-[35px] font-bold leading-tight'>
          Welcome To Your Dashboard
        </h1>
        <p className='text-sm sm:text-base mt-1'>
          Hey dear, This is a simple dashboard home. Our developer is updating it.
        </p>
        <p className='font-bold text-sm sm:text-base'>
          You can jump to any page you want from here.
        </p>
        <div className='flex flex-wrap justify-center gap-2 mt-4'>
          <Link to='/dashboard/my-enrolled'
            className="bg-[#712941] text-white py-2 px-3 sm:py-3 sm:px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base">
            My Enroll
          </Link>
          <Link to="/dashboard/my-selected"
            className="bg-[#712941] text-white py-2 px-3 sm:py-3 sm:px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base">
            My Selected
          </Link>
          <Link to="/dashboard/payment-history"
            className="bg-[#712941] text-white py-2 px-3 sm:py-3 sm:px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base">
            Payment History
          </Link>
          <Link to="/dashboard/apply-instructor"
            className="bg-[#712941] text-white py-2 px-3 sm:py-3 sm:px-4 rounded-lg hover:bg-[#c86989] transition-all duration-300 font-semibold shadow-md hover:shadow-lg text-sm sm:text-base">
            Join as Instructor
          </Link>
        </div>
      </div>
    </div>
  );
}
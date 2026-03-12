import React, {useEffect, useState} from 'react'
import api from '../lib/axios'
import PreLoader from '../components/PreLoader';
import { IoPerson } from "react-icons/io5";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled  } from "react-icons/tb";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }finally{
        setLoading(false)
      }
    };

    fetchUsers();
  }, []);

 // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
  <div className='p-6'>
    <h2 className="text-3xl font-bold text-[#712941] mb-6">Manage Users</h2>
     
   
      {loading ? (
        
       <PreLoader inline />
        
      ) : (
        <div className='p-6 bg-[#f3d3e0] border rounded-lg shadow-md'>
          <table className="w-full border-collapse">
            <thead>
              <tr className='text-[#712941] uppercase'>
                <th className="p-3 text-left"><AiOutlineFieldNumber className='text-[#712941] text-2xl'/></th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers
                .filter((user) => user.role !== 'admin')
                .map((user, index) => (
                  <tr key={user._id} className="border-b border-white hover:bg-[#fdf0f5] text-[#712941]">
                    <td className="p-3">{startIndex + index + 1}</td>
                    <td className="p-3 flex ml-3"><IoPerson className="text-2xl text-[#712941]" /></td>
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.role}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Pagination buttons*/}
          <div className='flex justify-center items-center gap-2 mt-6'>
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-white text-[#712941] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#712941] focus:ring-opacity-50 hover:scale-95 disabled:hover:scale-100"
            >
              <TbPlayerTrackPrevFilled className='text-2xl'/>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${currentPage === page ? 'bg-[#712941] text-white' : 'bg-white text-[#712941]'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-white text-[#712941] disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#712941] focus:ring-opacity-50 hover:scale-95 disabled:hover:scale-100"
            >
              <TbPlayerTrackNextFilled className='text-2xl'/>
            </button>
          </div>
        </div>
      )}
    </div>
  
)
}

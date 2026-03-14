import React, {useEffect, useState} from 'react'
import api from '../lib/axios'
import PreLoader from '../components/PreLoader';
import { IoPerson } from "react-icons/io5";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { TbPlayerTrackNextFilled, TbPlayerTrackPrevFilled } from "react-icons/tb";

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
      } finally {
        setLoading(false)
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => u.role !== 'admin');
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className='sm:p-6 font-dancing'>
      <h2 className="text-2xl sm:text-3xl font-bold text-[#712941] mb-4 sm:mb-6">Manage Users</h2>

      {loading ? <PreLoader inline /> : (
        <div className='p-3 sm:p-6 bg-[#f3d3e0] border rounded-lg shadow-md'>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className='text-[#712941] uppercase'>
                  <th className="p-3 text-left"><AiOutlineFieldNumber className='text-2xl'/></th>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
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
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {currentUsers.map((user, index) => (
              <div key={user._id} className="bg-white/60 rounded-lg p-3 border border-[#c86989]/30 flex gap-3 items-center">
                <span className="text-xs text-[#a07080] w-4 shrink-0">{startIndex + index + 1}</span>
                <IoPerson className="text-2xl text-[#712941] shrink-0" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-[#712941] font-semibold text-sm truncate">{user.name}</p>
                  <p className="text-xs text-[#a07080] truncate">{user.email}</p>
                </div>
                <span className="text-xs bg-white text-[#712941] px-2 py-1 rounded-full font-semibold border border-[#c86989]/30 shrink-0 capitalize">
                  {user.role}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className='flex justify-center items-center gap-2 mt-6 flex-wrap'>
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-white text-[#712941] disabled:opacity-70 hover:scale-95 disabled:hover:scale-100"
            >
              <TbPlayerTrackPrevFilled className='text-2xl'/>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded ${currentPage === page ? 'bg-[#712941] text-white' : 'bg-white text-[#712941]'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded bg-white text-[#712941] disabled:opacity-70 hover:scale-95 disabled:hover:scale-100"
            >
              <TbPlayerTrackNextFilled className='text-2xl'/>
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
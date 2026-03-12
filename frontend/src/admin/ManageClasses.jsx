import React, { useEffect, useState } from 'react'
import PreLoader from '../components/PreLoader'
import api from '../lib/axios'

export default function ManageClasses() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true) 

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes-manage') 
        setClasses(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses() 
  }, []) 

  const handleApprove = async (id) => {
  try {
    const token = localStorage.getItem("token") 
    await api.put(`/change-status/${id}`, { status: 'approved', reason: '' }, {
      headers: { Authorization: `Bearer ${token}` } 
    })
    setClasses(classes.map(cls => cls._id === id ? { ...cls, status: 'approved' } : cls))
  } catch (err) {
    console.log(err)
  }
}

const handleReject = async (id) => {
  const reason = prompt("Reason for rejection:")
  if (!reason) return
  try {
    const token = localStorage.getItem("token") 
    await api.put(`/change-status/${id}`, { status: 'denied', reason }, {
      headers: { Authorization: `Bearer ${token}` } 
    })
    setClasses(classes.map(cls => cls._id === id ? { ...cls, status: 'denied' } : cls))
  } catch (err) {
    console.log(err)
  }
}

  if (loading) return <PreLoader inline />

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[#712941] mb-6">Manage Classes</h2>

      {classes.length === 0 ? (
        <p className="text-center text-[#712941]">No classes found.</p>
      ) : (
        <div className="p-6 bg-[#f3d3e0] border rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[#712941] uppercase text-sm">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Class Name</th>
                <th className="p-3 text-left">Instructor</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Seats</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={cls._id} className="border-b border-white hover:bg-[#fdf0f5] text-[#712941]">
                  <td className="p-3 text-[#a07080]">{index + 1}</td>
                  <td className="p-3">
                    <img src={cls.image} alt={cls.name} className="w-12 h-10 object-cover rounded" />
                  </td>
                  <td className="p-3 font-semibold">{cls.name}</td>
                  <td className="p-3 text-sm">{cls.instructorName}</td>
                  <td className="p-3">${cls.price}</td>
                  <td className="p-3">{cls.availableSeats}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize
                      ${cls.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        cls.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'}`}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(cls._id)}
                        disabled={cls.status === 'approved'}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 disabled:opacity-40"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(cls._id)}
                        disabled={cls.status === 'denied'}
                        className="px-3 py-1 bg-red-400 text-white text-xs rounded-full hover:bg-red-500 disabled:opacity-40"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
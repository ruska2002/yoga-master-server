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

  const statusStyle = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700'
    if (status === 'approved') return 'bg-green-100 text-green-700'
    return 'bg-red-100 text-red-700'
  }

  if (loading) return <PreLoader inline />

  return (
    <div className="sm:p-6 font-dancing">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#712941] mb-4 sm:mb-6">Manage Classes</h2>

      {classes.length === 0 ? (
        <p className="text-center text-[#712941]">No classes found.</p>
      ) : (
        <div className="sm:p-6 bg-[#f3d3e0] border rounded-lg shadow-md">

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="text-[#712941] uppercase text-[10px]">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Image</th>
                <th className="p-2 text-left">Class Name</th>
                <th className="p-2 text-left">Instructor</th>
                <th className="p-2 text-left">Price</th>
                <th className="p-2 text-left">Seats</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
              <tbody>
                {classes.map((cls, index) => (
                  <tr key={cls._id} className="border-b border-white hover:bg-[#fdf0f5] text-[#712941]">
                    <td className="p-2 text-[#a07080]">{index + 1}</td>
                    <td className="p-2">
                      <img src={cls.image} alt={cls.name} className="w-10 h-8 object-cover rounded" />
                    </td>
                    <td className="p-2 font-semibold">{cls.name}</td>
                    <td className="p-2">{cls.instructorName}</td>
                    <td className="p-2">${cls.price}</td>
                    <td className="p-2">{cls.availableSeats}</td>
                    <td className="p-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${statusStyle(cls.status)}`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <button onClick={() => handleApprove(cls._id)} disabled={cls.status === 'approved'}
                          className="px-2 py-0.5 bg-green-500 text-white text-[10px] rounded-full hover:bg-green-600 disabled:opacity-40">
                          Approve
                        </button>
                        <button onClick={() => handleReject(cls._id)} disabled={cls.status === 'denied'}
                          className="px-2 py-0.5 bg-red-400 text-white text-[10px] rounded-full hover:bg-red-500 disabled:opacity-40">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="flex flex-col gap-3 sm:hidden">
            {classes.map((cls, index) => (
              <div key={cls._id} className="bg-white/60 rounded-lg p-3 border border-[#c86989]/30">
                <div className="flex gap-3 items-center">
                  <span className="text-xs text-[#a07080] w-4 shrink-0">{index + 1}</span>
                  <img src={cls.image} alt={cls.name} className="w-14 h-12 object-cover rounded shrink-0" />
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-[#712941] font-semibold text-sm truncate">{cls.name}</p>
                    <p className="text-xs text-[#a07080] truncate">{cls.instructorName}</p>
                    <div className="flex gap-3 text-xs text-[#a07080] flex-wrap">
                      <span>${cls.price}</span>
                      <span>Seats: {cls.availableSeats}</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize shrink-0 ${statusStyle(cls.status)}`}>
                    {cls.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleApprove(cls._id)}
                    disabled={cls.status === 'approved'}
                    className="flex-1 py-1.5 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 disabled:opacity-40"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(cls._id)}
                    disabled={cls.status === 'denied'}
                    className="flex-1 py-1.5 bg-red-400 text-white text-xs rounded-full hover:bg-red-500 disabled:opacity-40"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}
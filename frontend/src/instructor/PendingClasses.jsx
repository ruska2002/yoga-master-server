import React, { useEffect, useState } from 'react'
import api from '../lib/axios'
import PreLoader from '../components/PreLoader'
import { useAuth } from '../context/AuthContext'

export default function PendingClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await api.get(`/classes/${user?.email}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setClasses(res.data.filter(c => c.status === 'pending'))
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [user?.email])

  if (loading) return <PreLoader inline />

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#712941] mb-4 sm:mb-6">Pending Classes</h2>

      {classes.length === 0 ? (
        <p className="text-center text-[#712941]">No pending classes.</p>
      ) : (
        <div className="p-3 sm:p-6 bg-[#f3d3e0] border rounded-lg shadow-md">

          {/* Desktop table */}
          <table className="hidden sm:table w-full border-collapse">
            <thead>
              <tr className="text-[#712941] uppercase text-sm">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Class Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Seats</th>
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-left">Status</th>
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
                  <td className="p-3">${cls.price}</td>
                  <td className="p-3">{cls.availableSeats}</td>
                  <td className="p-3 capitalize">{cls.level || '—'}</td>
                  <td className="p-3">
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold capitalize">
                      {cls.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 sm:hidden">
            {classes.map((cls, index) => (
              <div key={cls._id} className="bg-white/60 rounded-lg p-3 border border-[#c86989]/30 flex gap-3 items-center">
                <span className="text-xs text-[#a07080] w-4 shrink-0">{index + 1}</span>
                <img src={cls.image} alt={cls.name} className="w-14 h-12 object-cover rounded shrink-0" />
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-[#712941] font-semibold text-sm truncate">{cls.name}</p>
                  <div className="flex gap-3 text-xs text-[#a07080] flex-wrap">
                    <span>${cls.price}</span>
                    <span>Seats: {cls.availableSeats}</span>
                    <span className="capitalize">Level: {cls.level || '—'}</span>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold capitalize shrink-0">
                  {cls.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  )
}
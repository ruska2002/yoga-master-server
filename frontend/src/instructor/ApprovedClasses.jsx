import React, { useEffect, useState } from 'react'
import api from '../lib/axios'
import PreLoader from '../components/PreLoader'
import { useAuth } from '../context/AuthContext'

export default function ApprovedClasses() {
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
        setClasses(res.data.filter(c => c.status === 'approved'))
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
    <div className="p-6">
      <h2 className="text-3xl font-bold text-[#712941] mb-6">Approved Classes</h2>

      {classes.length === 0 ? (
        <p className="text-center text-[#712941]">No approved classes yet.</p>
      ) : (
        <div className="p-6 bg-[#f3d3e0] border rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[#712941] uppercase text-sm">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Class Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Seats</th>
                <th className="p-3 text-left">Enrolled</th>
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
                  <td className="p-3">{cls.totalEnrolled || 0}</td>
                  <td className="p-3">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Approved
                    </span>
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
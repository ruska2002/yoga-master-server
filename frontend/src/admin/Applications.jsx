import React, {useState, useEffect} from 'react'
import api from '../lib/axios'
import PreLoader from '../components/PreLoader';

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const res = await api.get('/instructor-applications', {
          headers: { Authorization: `Bearer ${token}` } 
        })
        setApplications(res.data)
      } catch(err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    } 
    fetchData()
  },[])

  const handleAccept = async (app) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(`/instructor-applications/${app._id}/accept`, { email: app.email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(applications.filter(a => a._id !== app._id));
    } catch (err) {
      console.log(err);
    }
  }

  const handleReject = async (app) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/instructor-applications/${app._id}/reject`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(applications.filter(a => a._id !== app._id));
    } catch (err) {
      console.log(err);
    }
  };

  if(loading) return <PreLoader inline/>

  return (
    <div className="sm:p-6 font-dancing">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#712941] mb-4 sm:mb-6">Instructor Applications</h2>

      {applications.length === 0 ? (
        <p className="text-[#712941]">No applications found.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map((app, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start p-4 sm:p-5 bg-[#f3d3e0] border rounded-lg shadow-md">

              {/* Top row on mobile: photo + name + buttons */}
              <div className="flex gap-4 items-center w-full sm:w-auto sm:flex-col sm:items-center">
                <img
                  src={app.photoUrl}
                  alt={app.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#712941] shrink-0"
                />
                {/* Name visible only on mobile next to photo */}
                <h3 className="text-lg font-bold text-[#712941] sm:hidden">{app.name}</h3>
              </div>

              {/* Info */}
              <div className="flex-1 w-full">

                {/* Name + buttons row — desktop */}
                <div className="hidden sm:flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#712941]">{app.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleAccept(app)}
                      className="px-4 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600">
                      Accept
                    </button>
                    <button onClick={() => handleReject(app)}
                      className="px-4 py-1 bg-red-400 text-white text-sm rounded-full hover:bg-red-500">
                      Reject
                    </button>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize
                  ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    app.status === 'approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'}`}>
                  {app.status}
                </span>

                {/* Info grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#712941] mt-3">
                  <p><span className="font-semibold">Email:</span> {app.email}</p>
                  <p><span className="font-semibold">Age:</span> {app.age}</p>
                  <p><span className="font-semibold">Experience:</span> {app.yearsOfExperience} years</p>
                  <p><span className="font-semibold">Specialization:</span> {app.specialization}</p>
                </div>

                <div className="mt-3 text-sm text-[#712941]">
                  <p className="font-semibold">Why do you want to be an instructor?</p>
                  <p className="mt-1 text-[#a0526e]">{app.answer}</p>
                </div>

                {/* Accept/Reject buttons — mobile only */}
                <div className="flex gap-2 mt-4 sm:hidden">
                  <button onClick={() => handleAccept(app)}
                    className="flex-1 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600">
                    Accept
                  </button>
                  <button onClick={() => handleReject(app)}
                    className="flex-1 py-2 bg-red-400 text-white text-sm rounded-full hover:bg-red-500">
                    Reject
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
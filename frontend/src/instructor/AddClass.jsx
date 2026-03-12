import React, { useState } from 'react'
import api from '../lib/axios'
import { useAuth } from '../context/AuthContext'
import PreLoader from '../components/PreLoader'
import SelectLevel from '../components/SelectLevel'

export default function AddClass() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [availableSeats, setAvailableSeats] = useState('')
  const [price, setPrice] = useState('')
  const [videoLink, setVideoLink] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState('')
  const [level, setLevel] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)) }
  }

  const uploadToImgbb = async (imageFile) => {
    const formData = new FormData()
    formData.append("image", imageFile)
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_UPLOAD_PHOTO}`, { method: "POST", body: formData })
    const data = await res.json()
    return data.data.url
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) return alert("Please login first")
    if (!image) return alert("Please upload a class photo")
    try {
      setLoading(true)
      const imageUrl = await uploadToImgbb(image)
      await api.post("/new-class", {
        name, image: imageUrl, availableSeats, price, videoLink,
        description, duration, level,
        instructorName: user?.name, instructorEmail: user?.email,
        status: "pending", totalEnrolled: 0,
      }, { headers: { Authorization: `Bearer ${token}` } })
      alert("Class submitted for approval!")
      setName(''); setImage(null); setPreview(null)
      setAvailableSeats(''); setPrice(''); setVideoLink('')
      setDescription(''); setDuration(''); setLevel('')
    } catch (err) {
      console.log(err)
      alert("Error submitting class")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <PreLoader inline />

  const inputCls = "border border-[#c86989] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#712941] text-[#712941] bg-white placeholder-[#c86989] w-full text-sm"

  const fields = [
    {
      num: 1, label: "Class Name",
      input: <input type="text" value={name} onChange={e => setName(e.target.value)}
        placeholder="e.g. Morning Flow Yoga" className={inputCls} required />
    },
    {
      num: 2, label: "Cover Photo",
      input: (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-16 h-12 rounded border-2 border-dashed border-[#c86989] overflow-hidden flex items-center justify-center bg-white shrink-0">
            {preview
              ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
              : <span className="text-[10px] text-[#c86989]">NO IMG</span>}
          </div>
          <input type="file" accept="image/*" id="photoInput" onChange={handlePhotoChange} className="hidden" />
          <label htmlFor="photoInput"
            className="cursor-pointer border border-[#c86989] text-[#712941] py-1 px-4 rounded hover:bg-[#712941] hover:text-white transition-colors text-sm">
            {preview ? "Change" : "Upload"}
          </label>
        </div>
      )
    },
    {
      num: 3, label: "Level",
      input: <SelectLevel value={level} onChange={setLevel} />
    },
    {
      num: 4, label: "Available Seats",
      input: <input type="number" value={availableSeats} onChange={e => setAvailableSeats(e.target.value)}
        placeholder="e.g. 20" className={inputCls} required />
    },
    {
      num: 5, label: "Price (USD)",
      input: <input type="number" value={price} onChange={e => setPrice(e.target.value)}
        placeholder="e.g. 49" className={inputCls} required />
    },
    {
      num: 6, label: "Duration (min)",
      input: <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
        placeholder="e.g. 60" className={inputCls} />
    },
    {
      num: 7, label: "Video Link",
      input: <input type="url" value={videoLink} onChange={e => setVideoLink(e.target.value)}
        placeholder="https://youtube.com/..." className={inputCls} />
    },
    {
      num: 8, label: "Description",
      input: <textarea value={description} onChange={e => setDescription(e.target.value)}
        placeholder="Describe your class..." rows={3}
        className={`${inputCls} resize-none`} required />
    },
  ]

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#712941] mb-4 sm:mb-6">Add Class</h2>

      <div className="p-4 sm:p-6 bg-[#f3d3e0] border rounded-lg shadow-md">

       
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 border-b border-white pb-4 mb-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-[#a07080] mb-1">Instructor</p>
            <p className="text-[#712941] font-semibold text-sm">{user?.name}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-[#a07080] mb-1">Email</p>
            <p className="text-[#712941] font-semibold text-sm break-all">{user?.email}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-[#a07080] mb-1">Status</p>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
              Pending Approval
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Desktop: table layout — Hidden on mobile */}
          <table className="hidden sm:table w-full border-collapse">
            <thead>
              <tr className="text-[#712941] uppercase text-sm">
                <th className="p-3 text-left w-8">#</th>
                <th className="p-3 text-left">Field</th>
                <th className="p-3 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(({ num, label, input }) => (
                <tr key={num} className="border-b border-white hover:bg-[#fdf0f5] text-[#712941]">
                  <td className="p-3 text-[#a07080]">{num}</td>
                  <td className="p-3 font-semibold text-sm whitespace-nowrap">{label}</td>
                  <td className="p-3">{input}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile: card layout — Hidden on desktop */}
          <div className="flex flex-col gap-4 sm:hidden">
            {fields.map(({ num, label, input }) => (
              <div key={num} className="bg-white/60 rounded-lg p-3 border border-[#c86989]/30">
                <p className="text-xs text-[#a07080] uppercase tracking-wider mb-1">
                  {num}. {label}
                </p>
                {input}
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit"
              className="bg-[#712941] text-white py-2 px-6 sm:px-8 rounded hover:bg-[#c86989] transition-colors text-sm sm:text-base w-full sm:w-auto">
              Submit Class
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
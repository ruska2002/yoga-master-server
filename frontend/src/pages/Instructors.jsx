import React, { useEffect, useState } from 'react'
import api from '../lib/axios'
import PreLoader from '../components/PreLoader'
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Instructors() {
   const [instructors, setInstructors] = useState([]);
   const [loading, setLoading] = useState(true)


   useEffect(() => {
    const fetchInstructors = async () => {
      try{
        const res = await api.get('/instructors')
        setInstructors(res.data)
      }catch(err){
        console.log(err)
      }finally{
        setLoading(false)
      }

    }
    fetchInstructors()

   },[])

  if(loading){
      return <PreLoader/>
  }
  return (
    <div>
      <NavBar />
      <div className=''>
        <hr className="mt-[5%]"/>
        <p className="text-center text-[#712941] text-[20px] md:text-[35px] font-bold">INSTRUCTORS</p>
<hr className="mb-[5%]"/>
      <div className="mt-10 space-y-8">
     {instructors.map((inst, index) => (
     <div
      key={index}
      className={`flex items-center justify-center gap-6 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
    >
          <div className="md:w-64 md:h-60 w-32 h-36 overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={inst.photoUrl}
                alt={inst.name}
                className="w-full h-full object-cover border-2 border-[#712941] rounded-3xl"
              />
            </div>
             <div className="w-1/2 flex flex-col gap-2">
              <h2 className="md:text-2xl text-[15px] font-bold text-[#7d344c] text-center">{inst.name}</h2>
              <h3 className='md:text-xl text-[10px] font-medium text-[#a3355a]'>What is yoga to me?</h3>
              <p className='text-[#ab3a60] text-[10px] md:text-[16px]'>{inst.yoga}</p>
              <p className='text-[#b75b7a] text-[9px] md:text-[15px] font-semibold'>{inst.name}'s experience - {inst.yearsOfExperience} years</p>
            </div>
          </div>
        ))}
      </div>
      <Footer/>
      </div>
    </div>
  )
}

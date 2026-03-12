import React, { useEffect, useState, useRef } from 'react'
import api from '../lib/axios'
import NavBar from '../components/NavBar'
import { useParams } from "react-router-dom"
import Footer from '../components/Footer'
import PreLoader from "../components/PreLoader";

const ClassDetails = () => {
    const [clss, setClss] = useState(null)
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    
   
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await api.get(`/class/${id}`)
                setClss(res.data)
            }catch(error){
                console.log(error)
            }finally {
       setLoading(false);
    }
        }
        fetchData()
    }, [id])

 

    useEffect(() => {
        if (!videoRef.current) return;

        const video = videoRef.current;

        const observer = new IntersectionObserver(
            ([entry]) => {
            if (entry.isIntersecting) {
                video.play().catch((err) => {
                console.log("Autoplay blocked:", err);
                });
            } else {
                video.pause();
            }
            },
            {
            root: null,      
            threshold: 0.5,    
            }
        );

        observer.observe(video);

        return () => {
            if (video) observer.unobserve(video);
        };
    }, [clss]); 


 if (loading || !clss) {
  return <PreLoader />;
}
    return(
        <div>
            <NavBar />

            <div className='bg-[#712941] text-white text-center p-6 uppercase'>
                Class Details
            </div>

            <div className="flex items-start justify-between p-12 gap-10">
                <div className='flex-[50%]'>
                    <img
                    src={clss.image}
                    alt="yoga class picture"
                    width={650}
                    height={450}
                    className="w-full h-auto object-cover rounded-sm" 
                    />
                </div>

                <div className="flex flex-col">
                    <img
                    src={clss.pic}
                    alt="instructor image"
                    className="w-80 h-56 object-cover rounded-sm"
                    />
                    <div className='flex mt-4'>
                        <p className='w-1/2 ml-2 text-center justify-center text-[29px] text-[#712941]'>${clss.price}</p>
                        <button className='bg-[#712941] w-full h-10 hover:bg-[#c86989] rounded-sm text-[white]'>Entroll Now</button>
                    </div>
                    <hr className="mt-4 mb-4 border-[#712941]" />
                    <div className='flex flex-col text-[#712941]'>
                       <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <img src="/assets/person.png" width={20} height={20} />
                                <p>Instructor</p>
                            </div>

                            <p>{clss.instructorName}</p>
                            
                        </div>
                        <hr className="mt-4 mb-4 bg-[#712941]" />

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'> 
                                <img src='/assets/time.png' width={25} height={25} className='ml-[-5px]'/>
                                <p>Duration</p>
                            </div>
                            <p>{clss.duration}</p>
                           
                        </div>
                        
                        <hr className='mt-4 mb-4 bg-[#712941]' />
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <img src='/assets/persons.png' width={30} height={35} className='ml-[-5px]'/>
                                <p>Enrolled</p>
                            </div>
                             <p>{clss.availableSeats} Students</p>
                        </div>
                        
                        <hr className='mt-4 bg-[#712941] mb-4' />

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <img src='/assets/online.png' width={22} height={22} />
                                <p>Lectures</p>
                            </div>
                            <p>{clss.lectures}</p>
                        </div>
                        
                       <hr className='mt-4 bg-[#712941] mb-4' />

                       <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                             <img src='/assets/language.png' width={24} height={24} />
                             <p>Language</p>
                        </div>
                        <p>English</p>
                       </div>
                       
                        <hr className='mt-4 bg-[#712941] mb-4' />

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <img src='/assets/level.png' width={25} height={25} />
                                <p>Course Level</p>
                            </div>
                            <p>{clss.level}</p>
                        </div>
                    
                    </div>
                </div>
            </div>
            <div className='flex mt-[-50px]'>
                <div className='flex flex-col pl-12 text-[#712941]'>
                    <p className='text-[35px]'>{clss.name}</p>

                    <div className='flex items-center gap-12'>
                        <div className='flex items-center gap-2'>
                            <img src={clss.pic} width={20} height={20} className='rounded-full border-2 border-[#712941]'/>
                            <p>Trainer</p>
                            <p className='text-[#c86989]'>{clss.instructorName}</p>
                        </div>
                        <div className='flex gap-2'>
                            <p>Submitted Data</p>
                            <p className='text-[#c86989]'>
                                {clss.submitted && clss.submitted.split("T")[0]}
                            </p>
                        </div>
                    </div>
                    <div className='mt-12'>
                        <p className='text-[35px]'>Course Description</p>
                        <p className='w-[50%]'>{clss.description}</p>
                    </div>
                   

                    <div className="max-w-4xl ml-6">
                        <div className=" mt-12">
                            <p className="text-2xl font-bold text-[#712941] mb-6">What you will learn</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 bg-[#712941]/10 p-4 rounded-lg">
                                    <img src="/assets/right.png" width={20} height={20} alt="check icon" />
                                    <p className="text-[#712941] font-medium">Learn basic poses</p>
                                </div>

                                <div className="flex items-center gap-3 bg-[#712941]/10 p-4 rounded-lg">
                                    <img src="/assets/right.png" width={20} height={20} alt="check icon" />
                                    <p className="text-[#712941] font-medium">Improve flexibility</p>
                                </div>

                                <div className="flex items-center gap-3 bg-[#712941]/10 p-4 rounded-lg">
                                    <img src="/assets/right.png" width={20} height={20} alt="check icon" />
                                    <p className="text-[#712941] font-medium">Build strength</p>
                                </div>

                                <div className="flex items-center gap-3 bg-[#712941]/10 p-4 rounded-lg">
                                    <img src="/assets/right.png" width={20} height={20} alt="check icon" />
                                    <p className="text-[#712941] font-medium">Enhance balance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                   

                    <video
                        ref={videoRef}
                        src={clss.videoLink}
                        className="w-full max-w-[600px] mt-24 rounded-lg shadow-lg"
                        muted     
                        loop
                        playsInline
                        preload="metadata"
                    />
                    <div className='mt-20 mb-20 bg-[#712941]/10 p-2 w-[60%] rounded-lg shadow-lg'>
                        <p className='text-[35px]'>Lesson Plan</p>
                        <p className='mt-6'>This yoga course is designed for students of all levels, focusing on building strength, flexibility, balance, and mindfulness. Each session follows a structured plan to ensure gradual progress and a safe learning environment. The class begins with a gentle warm-up including stretches and breathing exercises to prepare the body and mind. Then students learn foundational poses, emphasizing correct technique, stability, and posture awareness. After mastering the basics, the class progresses to intermediate poses that challenge balance, flexibility, and coordination, with instructors offering modifications as needed. Next, students practice flow sequences, combining poses into a continuous series to build endurance and mental focus while connecting breath with movement. The session concludes with a cool-down and relaxation segment to release tension and restore calm, often including guided meditation or mindfulness exercises. By the end of the course, students will have improved flexibility, strength, and balance, enhanced mind-body awareness, reduced stress, knowledge of basic to intermediate yoga sequences, and confidence in practicing safely and effectively.</p>
                    </div>
                   
                </div>
              
            </div>
            <Footer />
        </div>
    )
}

export default ClassDetails;

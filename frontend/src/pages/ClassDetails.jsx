import React, { useEffect, useState, useRef } from 'react'
import api from '../lib/axios'
import NavBar from '../components/NavBar'
import { useParams } from "react-router-dom"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
import PreLoader from "../components/PreLoader";

const ClassDetails = () => {
    const [clss, setClss] = useState(null)
    const { id } = useParams()
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);
    const navigate = useNavigate()

    const handleEnroll = () => {
        const token = localStorage.getItem("token")
        if (!token) return navigate('/login')
        localStorage.setItem("checkoutClasses", JSON.stringify([clss]))
        localStorage.setItem("checkoutTotal", Number(clss.price).toFixed(2))
        navigate('/dashboard/payment-info')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get(`/class/${id}`)
                setClss(res.data)
            } catch (error) {
                console.log(error)
            } finally {
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
                    video.play().catch((err) => console.log("Autoplay blocked:", err));
                } else {
                    video.pause();
                }
            },
            { root: null, threshold: 0.5 }
        );
        observer.observe(video);
        return () => { if (video) observer.unobserve(video); };
    }, [clss]);

    if (loading || !clss) return <PreLoader />;

    return (
        <div className='font-dancing'>
            <NavBar />
            <hr className="mt-[5%]" />

            <div className='text-[#712941] text-center p-4 sm:p-6 uppercase mt-2'>
                <p className='text-center text-[#712941] text-xl sm:text-2xl md:text-[35px] font-bold'>
                    Class Details
                </p>
            </div>
            <hr />

           
            <div className="flex flex-col lg:flex-row items-start
                            px-4 sm:px-8 md:px-12
                            py-6 sm:py-8 md:py-12
                            gap-6 lg:gap-10">

               
                <div className='flex flex-col w-full lg:flex-1 min-w-0'>
                    <img
                        src={clss.image}
                        alt="yoga class picture"
                        className="w-full h-auto object-cover rounded-md"
                    />

                    
                    <p className='text-2xl sm:text-3xl md:text-[35px] text-[#712941] mt-4'>
                        {clss.name}
                    </p>

                    <div className='flex flex-wrap items-center gap-x-8 gap-y-2 mt-2'>
                        <div className='flex items-center gap-2'>
                            <img
                                src={clss.pic}
                                width={20}
                                height={20}
                                className='rounded-full border-2 border-[#712941]'
                                alt="trainer"
                            />
                            <p className='text-[#712941]'>Trainer</p>
                            <p className='text-[#c86989] font-nunito'>{clss.instructorName}</p>
                        </div>
                        <div className='flex gap-2 text-sm sm:text-base text-[#712941]'>
                            <p>Submitted Date</p>
                            <p className='text-[#c86989] font-nunito'>
                                {clss.submitted && clss.submitted.split("T")[0]}
                            </p>
                        </div>
                    </div>
                </div>

               
                <div className="flex flex-col w-full lg:w-[320px] shrink-0">
                    <img
                        src={clss.pic}
                        alt="instructor image"
                        className="w-full h-56 sm:h-64 md:h-96 object-cover rounded-md object-[center_20%]"
                    />
                    <div className='flex mt-4 items-center gap-2'>
                        <p className='w-1/2 text-center text-2xl sm:text-[29px] text-[#712941]'>
                            ${clss.price}
                        </p>
                        <button
                            onClick={handleEnroll}
                            className='bg-[#712941] w-full h-10 hover:bg-[#c86989] rounded-md text-white text-sm sm:text-base'
                        >
                            Enroll Now
                        </button>
                    </div>
                    <hr className="mt-4 mb-4 border-[#712941]" />

                    <div className='flex flex-col text-[#712941] text-sm sm:text-base'>
                        {[
                            { icon: "/assets/person.png",   label: "Instructor",   value: clss.instructorName },
                            { icon: "/assets/time.png",     label: "Duration",     value: clss.duration },
                            { icon: "/assets/persons.png",  label: "Enrolled",     value: `${clss.availableSeats} Students` },
                            { icon: "/assets/online.png",   label: "Lectures",     value: clss.lectures },
                            { icon: "/assets/language.png", label: "Language",     value: "English" },
                            { icon: "/assets/level.png",    label: "Course Level", value: clss.level },
                        ].map(({ icon, label, value }) => (
                            <div key={label}>
                                <div className='flex items-center justify-between py-1'>
                                    <div className='flex items-center gap-2'>
                                        <img src={icon} width={22} height={22} alt={label} />
                                        <p>{label}</p>
                                    </div>
                                    <p className='ml-4 text-right'>{value}</p>
                                </div>
                                <hr className='mt-3 mb-3 border-[#712941]/30' />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

           
            <div className='flex flex-col px-4 sm:px-8 md:px-12 text-[#712941] lg:-mt-32'>

                
                <div className='mt-2 sm:mt-4'>
                    <p className='text-2xl sm:text-[35px]'>Course Description</p>
                    <p className='w-full lg:w-[50%] mt-2 text-sm sm:text-base leading-relaxed font-nunito'>
                        {clss.description}
                    </p>
                </div>

               
                <div className="w-full lg:max-w-4xl mt-8 sm:mt-12">
                    <p className="text-xl sm:text-2xl font-bold text-[#712941] mb-4 sm:mb-6">
                        What you will learn
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-nunito">
                        {["Learn basic poses", "Improve flexibility", "Build strength", "Enhance balance"].map((item) => (
                            <div key={item} className="flex items-center gap-3 bg-[#712941]/10 p-3 sm:p-4 rounded-lg">
                                <img src="/assets/right.png" width={20} height={20} alt="check icon" />
                                <p className="text-[#712941] font-medium text-sm sm:text-base">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Video */}
                <video
                    ref={videoRef}
                    src={clss.videoLink}
                    className="w-full max-w-full sm:max-w-[600px] mt-12 sm:mt-24 rounded-lg shadow-lg"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                />

                {/* Lesson Plan */}
                <div className='mt-12 sm:mt-20 mb-12 sm:mb-20 bg-[#712941]/10 p-4 sm:p-6 w-full lg:w-[60%] rounded-lg shadow-lg'>
                    <p className='text-2xl sm:text-[35px]'>Lesson Plan</p>
                    <p className='mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed font-nunito'>
                        This yoga course is designed for students of all levels, focusing on building strength,
                        flexibility, balance, and mindfulness. Each session follows a structured plan to ensure
                        gradual progress and a safe learning environment. The class begins with a gentle warm-up
                        including stretches and breathing exercises to prepare the body and mind. Then students
                        learn foundational poses, emphasizing correct technique, stability, and posture awareness.
                        After mastering the basics, the class progresses to intermediate poses that challenge
                        balance, flexibility, and coordination, with instructors offering modifications as needed.
                        Next, students practice flow sequences, combining poses into a continuous series to build
                        endurance and mental focus while connecting breath with movement. The session concludes
                        with a cool-down and relaxation segment to release tension and restore calm, often
                        including guided meditation or mindfulness exercises.
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default ClassDetails;

import NavBar from "../components/NavBar";
import React, { useEffect, useState } from "react";
import api from '../lib/axios'
import pictures from '../pictures.json'
import FooterSection from "../components/FooterSection";
import PreLoader from "../components/PreLoader";
import EmailSender from "../components/EmailSender";
import { Link } from "react-router";

export default function HomePage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popularClasses, setPopularClasses] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false)

  // FIX: merged two separate useEffects into one to avoid race condition
  // FIX: removed JS image preloading (was blocking PreLoader for 3-5s on mobile)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [popularRes, instructorsRes] = await Promise.all([
          api.get('/popular-classes'),
          api.get('instructors'),
        ])
        setPopularClasses(popularRes.data)
        setClasses(instructorsRes.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <PreLoader />;
  }

  return (
    <div className="w-full font-dancing">

      <div className="relative w-full bg-[#e8d5e8]">
        <img
          src="/assets/yoga1.jpg"
          alt="yoga"
          className="w-full h-auto block"
        />
        <div className="absolute top-0 left-0 w-full z-10">
          <NavBar onMenuToggle={(val) => setMenuOpen(val)} />
        </div>
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 text-center text-[#712941] z-10 w-full px-4">
          <h1 className={menuOpen ? "hidden" : "text-2xl sm:text-3xl md:text-4xl font-bold"}>
            Welcome to YogaVibe
          </h1>
        </div>
      </div>

      {/* Popular Classes */}
      <section className="w-full py-10 sm:py-16 px-4 sm:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center text-[#712941]">
          Our Popular Classes
        </h2>
        <p className="max-w-xl mx-auto text-center text-[#c86989] mb-10 text-sm sm:text-base md:text-lg">
          Join thousands of students in our most loved yoga classes.
        </p>

        <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto font-nunito">
          {popularClasses.map((cls, indx) => (
            <Link to={`/classes/${cls._id}`} key={cls._id}>
              <div className={`rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 ${indx === 1 ? 'md:-mt-6 md:mb-6' : ''}`}>
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.name}                  // FIX: use class name as alt
                    width={600}
                    height={192}                    // FIX: explicit dimensions prevent CLS
                    loading="lazy"                  // FIX: lazy load below-fold images
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-[#712941] text-white text-xs px-3 py-1 rounded-full">
                    🔥 {cls.totalEnrolled || 0} enrolled
                  </span>
                </div>
                <div className="p-4 sm:p-5 text-[#712941]">
                  <h3 className="font-bold text-base sm:text-xl">{cls.name}</h3>
                  <p className="text-xs sm:text-lg text-[#712941] mt-1">Instructor: {cls.instructorName}</p>
                  <p className="text-xs sm:text-sm text-[#712941] mt-1 line-clamp-2">{cls.description}</p>
                  <div className="flex justify-between items-center mt-3 sm:mt-4">
                    <p className="font-bold text-lg sm:text-2xl">${cls.price}</p>
                    <span className="text-s bg-[#ed9cbc] text-[#712941] px-2 sm:px-3 py-1 rounded-full">
                      {cls.availableSeats} seats left
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="w-full py-16 mb-10 overflow-hidden">
        <p className="text-center text-[#c86989] tracking-[0.3em] uppercase font-medium mb-10 font-dancing">
          Life in motion
        </p>

        {/* Desktop gallery */}
        <div className="hidden md:flex relative w-full flex-wrap justify-center gap-6 py-16 px-8">
          {pictures.map((img, index) => (
            <div
              key={img.id}
              className={`shadow-[0_35px_60px_15px_rgb(218,194,218)]
                w-40 h-60 rounded-lg overflow-hidden group cursor-pointer
                hover:scale-105 transition-all duration-500
                ${index % 2 === 0 ? '-translate-y-4' : 'translate-y-6'}
              `}
            >
              <img
                src={img.pic}
                alt={`Yoga class ${img.id}`}       // FIX: meaningful alt
                loading="lazy"                      // FIX: lazy load all gallery images
                width={160}
                height={240}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* Mobile gallery */}
        <div className="md:hidden max-w-sm mx-auto px-4">
          <div className="grid grid-cols-2 gap-3">
            {pictures.map((img, index) => {
              const rotations = ['-2deg', '1deg', '-1deg', '2deg', '0deg', '-3deg'];
              const rot = rotations[index % rotations.length];
              const heights = ['160px', '200px', '176px', '220px', '144px', '190px'];
              const h = heights[index % heights.length];

              return (
                <div
                  key={img.id}
                  style={{ transform: `rotate(${rot})` }}
                  className="group cursor-pointer hover:scale-105 transition-all duration-500 ease-out"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden"
                    style={{ height: h, boxShadow: '0 8px 32px rgba(113,41,65,0.18)' }}
                  >
                    <img
                      src={img.pic}
                      alt={`Yoga class ${img.id}`} // FIX: meaningful alt
                      loading="lazy"               // FIX: lazy load mobile gallery
                      width={160}
                      height={220}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* FIX: removed gradient overlay — expensive to paint on mobile GPUs */}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Instructors */}
      <section className="w-full py-10 px-4 sm:px-8 mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-14 text-center text-[#712941]">
          Our Popular Instructors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {classes.slice(0, 3).map((teachers, index) => (
            <Link to='/instructors' key={index}>
              <div className={`rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow hover:scale-95 duration-300 ${index === 1 ? 'md:-mt-6 md:-mb-6' : ''}`}>
                <img
                  src={teachers.photoUrl}
                  alt={teachers.name}              // FIX: use instructor name as alt
                  loading="lazy"                   // FIX: lazy load instructor images
                  width={600}
                  height={256}
                  className="w-full h-48 sm:h-56 md:h-64 object-cover object-[center_20%]"
                />
                <p className="p-4 sm:p-5 text-[#712941] font-bold text-base sm:text-lg">{teachers.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="w-full bg-[#712941] flex justify-center items-center py-8 sm:py-10 px-4">
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16 text-center">
          <div>
            <p className="text-[12px] sm:text-3xl font-bold text-[#f3d3e0]">35M+</p>
            <p className="text-[8px] sm:text-base md:text-lg text-[#f3d3e0]">Visitors</p>
          </div>
          <div>
            <p className="text-[12px] sm:text-3xl font-bold text-[#f3d3e0]">5M+</p>
            <p className="text-[8px] sm:text-base md:text-lg text-[#f3d3e0]">Subscribers</p>
          </div>
          <div>
            <p className="text-[12px] sm:text-3xl font-bold text-[#f3d3e0]">950k+</p>
            <p className="text-[8px] sm:text-base md:text-lg text-[#f3d3e0]">Students</p>
          </div>
          <div>
            <p className="text-[12px] sm:text-3xl font-bold text-[#f3d3e0]">90%</p>
            <p className="text-[8px] sm:text-base md:text-lg text-[#f3d3e0]">Success stories</p>
          </div>
        </div>
      </section>

      <EmailSender />
      <FooterSection />
    </div>
  );
}

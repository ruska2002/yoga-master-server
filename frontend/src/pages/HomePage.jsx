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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const popularRes = await api.get('/popular-classes');
        setPopularClasses(popularRes.data);

        await Promise.all([
          ...pictures.map((img) => {
            return new Promise((resolve) => {
              const image = new Image();
              image.onload = () => resolve();
              image.onerror = () => resolve();
              image.src = img.pic;
            });
          }),
          new Promise((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = "/assets/yoga1.jpg";
          }),
          ...popularRes.data.map((cls) => {
            return new Promise((resolve) => {
              const image = new Image();
              image.onload = () => resolve();
              image.onerror = () => resolve();
              image.src = cls.image;
            });
          }),
        ]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('instructors')
        setClasses(res.data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    };
    fetchData()
  }, [])

  if (loading) {
    return <PreLoader />;
  }

  return (
    <div className="w-full">

    <div className="relative w-full overflow-hidden bg-[#e8d5e8]">
  <img
    src="/assets/yoga1.jpg"
    alt="yoga"
    className="w-full h-auto block"
  />
  <div className="absolute top-0 left-0 w-full z-10">
    <NavBar />
  </div>
  <div className="absolute bottom-8 sm:bottom-10 left-1/2 transform -translate-x-1/2 text-center text-[#712941] z-10 w-full px-4">
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
      Welcome to YogaVibe
    </h1>
  </div>
</div>

      
      <section className="w-full py-10 sm:py-16 px-4 sm:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center text-[#712941]">
          Our Popular Classes
        </h2>
        <p className="max-w-xl mx-auto text-center text-[#c86989] mb-10 text-sm sm:text-base md:text-lg">
          Join thousands of students in our most loved yoga classes.
        </p>

        <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {popularClasses.map((cls, indx) => (
            <Link to={`/classes/${cls._id}`} key={indx}>
              <div className={`rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300 ${indx === 1 ? 'md:-mt-6 md:mb-6' : ''}`}>

                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img
                    src={cls.image}
                    alt={cls.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-[#712941] text-white text-xs px-3 py-1 rounded-full">
                    🔥 {cls.totalEnrolled || 0} enrolled
                  </span>
                </div>

                <div className="p-4 sm:p-5 text-[#712941]">
                  <h3 className="font-bold text-base sm:text-lg">{cls.name}</h3>
                  <p className="text-xs sm:text-sm text-[#c86989] mt-1">Instructor: {cls.instructorName}</p>
                  <p className="text-xs sm:text-sm text-[#cf7f9a] mt-1 line-clamp-2">{cls.description}</p>
                  <div className="flex justify-between items-center mt-3 sm:mt-4">
                    <p className="font-bold text-lg sm:text-xl">${cls.price}</p>
                    <span className="text-xs bg-[#f3d3e0] text-[#712941] px-2 sm:px-3 py-1 rounded-full">
                      {cls.availableSeats} seats left
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section>

  <section className="w-full py-16 mb-10 overflow-hidden">
  <p className="text-center text-[#c86989] text-xs tracking-[0.3em] uppercase font-medium mb-10">
    Life in motion
  </p>

  {/* DESKTOP: original wavy flex layout */}
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
          alt={`Class ${img.id}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
    ))}
  </div>

  {/* MOBILE: grid with rotations */}
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
                alt={`Class ${img.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#712941]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>

     
      <section className="w-full py-10 px-4 sm:px-8 mb-10">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-8 sm:mb-14 text-center text-[#712941]">
          Our Popular Instructors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {classes.slice(0, 3).map((teachers, index) => (
            <Link to='/instructors' key={index}>
              <div className={`rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow hover:scale-95 duration-300 ${index === 1 ? 'md:-mt-6 md:-mb-6' : ''}`}>
                <img src={teachers.photoUrl} alt="instructor image" className="w-full h-48 sm:h-56 md:h-64 object-cover object-[center_20%]" />
                <p className="p-4 sm:p-5 text-[#712941] font-bold text-base sm:text-lg ">{teachers.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      
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
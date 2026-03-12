import React from "react";
import { GrYoga } from "react-icons/gr";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const today = new Date();
  const year = today.getFullYear();

  return (
    <footer className="bg-[#712941] text-white mt-20">

      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path fill="#fff" d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">

        {/* Brand column - full width on mobile */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <GrYoga style={{ width: '32px', height: '32px', minWidth: '32px' }} className="text-[#f3d3e0]" />
            <span className="text-xl sm:text-2xl font-bold tracking-widest uppercase">YogaVibe</span>
          </div>
          <p className="text-[#f3d3e0] text-sm leading-relaxed">
            Find your balance, breathe deep, and move with intention.
            Classes for every body, every level, every journey.
          </p>
          <div className="flex gap-3 mt-2">
            {[FaInstagram, FaTwitter, FaFacebookF, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full border border-[#f3d3e0] flex items-center justify-center hover:bg-[#c86989] hover:border-[#c86989] transition-colors duration-200">
                <Icon className="w-3.5 h-3.5 text-[#f3d3e0]" />
              </a>
            ))}
          </div>
        </div>

        {/* Services column */}
        <div className="flex flex-col gap-3">
          <p className="text-[#f3d3e0] uppercase text-xs tracking-widest font-semibold mb-1">Services</p>
          <div className="w-8 h-0.5 bg-[#c86989] mb-2 rounded-full" />
          {["All Classes", "Instructors", "Private Sessions", "Workshops", "Retreats"].map((item, i) => (
            <a key={i} href="#" className="text-sm text-white/80 hover:text-[#f3d3e0] hover:translate-x-1 transition-all duration-200 inline-block">
              {item}
            </a>
          ))}
        </div>

        {/* About column */}
        <div className="flex flex-col gap-3">
          <p className="text-[#f3d3e0] uppercase text-xs tracking-widest font-semibold mb-1">About</p>
          <div className="w-8 h-0.5 bg-[#c86989] mb-2 rounded-full" />
          {["Our Story", "Team", "Blog", "Press", "Careers"].map((item, i) => (
            <a key={i} href="#" className="text-sm text-white/80 hover:text-[#f3d3e0] hover:translate-x-1 transition-all duration-200 inline-block">
              {item}
            </a>
          ))}
        </div>

        {/* Support column */}
        <div className="flex flex-col gap-3">
          <p className="text-[#f3d3e0] uppercase text-xs tracking-widest font-semibold mb-1">Support</p>
          <div className="w-8 h-0.5 bg-[#c86989] mb-2 rounded-full" />
          {["FAQ", "Contact Us", "Privacy Policy", "Terms of Service", "Refund Policy"].map((item, i) => (
            <a key={i} href="#" className="text-sm text-white/80 hover:text-[#f3d3e0] hover:translate-x-1 transition-all duration-200 inline-block">
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-6xl mx-auto text-center">
        <p className="text-white/50 text-xs tracking-wide">© {year} YogaVibe. All rights reserved.</p>
        <div className="hidden sm:flex items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#c86989]" />
          <div className="w-16 h-px bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#c86989]" />
        </div>
        <p className="text-white/50 text-xs tracking-wide">Made with 🤍 for wellness</p>
      </div>

    </footer>
  );
}


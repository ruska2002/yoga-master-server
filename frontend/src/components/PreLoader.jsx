import React from "react";

const PreLoader = ({ inline = false }) => {
  return (
    <div className={inline
      ? "flex flex-col items-center justify-center h-64 gap-6"
      : "fixed inset-0 flex items-center justify-center bg-[#f8f5f2] z-50"
    }>
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 border-4 border-[#8b5e83] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#712941] text-lg tracking-widest animate-pulse">Breathe In...</p>
      </div>
    </div>
  );
};

export default PreLoader;
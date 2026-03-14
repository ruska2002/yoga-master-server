import React from 'react';
import { useNavigate } from 'react-router-dom';

const PupularCourses = ({ clss }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    
    console.log("Navigating to:", clss._id);
    navigate(`/classes/${clss._id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer w-64 rounded-lg overflow-hidden shadow-lg hover:scale-105 transition-transform"
    >
      <img
        src={clss.image}
        alt={clss.name}
        className="w-full h-36 object-cover"
      />
      <div className="p-2 bg-white font-dancing">
        <h3 className="text-[#712941] font-bold text-lg">{clss.name}</h3>
        <p className="text-gray-600 text-sm">{clss.instructorName}</p>
      </div>
    </div>
  );
};

export default PupularCourses;

import React from "react";
const Footer = () => {
     const today = new Date();
    const year = today.getFullYear();
    return(
        <div className="mt-[12px]">
        <hr/>
        <footer className="flex justify-center mt-[2%] mb-[2%]">
        <p className="text-[#712941] text-[12px] md:text-lg font-dancing">© Copyright {year}</p>
      </footer>
      </div>
    )

}

export default Footer;
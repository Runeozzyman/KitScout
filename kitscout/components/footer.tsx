"use client";

import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function FloatingSocials() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999999,
      }}
    >
      <div className="flex items-center gap-5 bg-white border shadow-lg rounded-full px-4 py-2 pointer-events-auto">
        
        <a href="https://linkedin.com/in/austinwort/" className="text-black hover:text-[#0077B5] transition-colors cursor-pointer">
            <FaLinkedin size={35} />
        </a>

        <a href="https://github.com/Runeozzyman" 
           className="text-black hover:text-[#8534F3] transition-colors cursor-pointer"
           target="_blank"
           rel="noopener noreferrer"
           >
            <FaGithub size={35}/>
        </a>

      </div>
    </div>
  );
}
import React from "react";
import Cube from "./Cube";

const HeroSection = () => {
  return (
    <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 md:px-16 items-center relative">
      
      {/* Left Content */}
      <div className="max-w-2xl z-20 mx-auto lg:mx-0 text-center lg:text-left pt-10 lg:pt-0">
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
          Work aligned.<br />
          Deliver faster.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
          Aligno brings structure and clarity to your team &ap; s workflow. Manage tasks, share updates, and track progress — all in one place built for speed and teamwork.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="bg-linear-to-r from-violet-500 to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_25px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all duration-200">
            Start now
          </button>
          <button className="bg-white/5 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
            Watch demo
          </button>
        </div>
      </div>

      {/* Right Graphic (CSS 3D Art) */}
      <div className="relative h-125 w-full flex items-center justify-center overflow-hidden lg:overflow-visible">
        {/* Background Glow */}
        <div className="absolute w-100 h-400 bg-indigo-500/20 rounded-full blur-[80px] -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

        {/* 3D Grid Container */}
        <div 
          className="grid grid-cols-3 gap-4 transform-gpu p-4"
          style={{ 
            perspective: '1000px',
            transform: 'rotateY(-15deg) rotateX(10deg)'
          }}
        >
          {/* We map out the cubes. 
            0 = empty (invisible), 
            1 = visible cube 
          */}
          {[
            // Row 1
            0, 1, 0,
            // Row 2
            1, 0, 1,
            // Row 3 (Crossbar)
            1, 2, 1, // 2 is the glowing center piece
            // Row 4
            1, 0, 1
          ].map((type, index) => (
            <Cube key={index} type={type} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
import React from "react";

const Cube = ({ type }) => {
  // Base styles for all visible cubes
  const baseStyle = "w-20 h-20 md:w-24 md:h-24 rounded-2xl border-t border-l border-white/20 backdrop-blur-md transition-transform hover:scale-105 duration-300 shadow-2xl";
  
  // Specific gradients based on position to mimic lighting
  const variants = {
    0: "opacity-0 pointer-events-none", // Invisible
    1: "bg-gradient-to-br from-white/10 to-white/5", // Standard glass
    2: "bg-gradient-to-br from-violet-500/40 to-white/10 shadow-[0_0_40px_rgba(139,92,246,0.4)] border-violet-400/30", // Center glow
  };

  // If type is 1, let's add slight color variations to mimic the reference image
  // We can randomize or explicitly set them. Here I'll just check if it's visible.
  if (type === 0) return <div className="w-20 h-20 md:w-24 md:h-24"></div>;

  return (
    <div className={`${baseStyle} ${variants[type]}`}></div>
  );
};

export default Cube;
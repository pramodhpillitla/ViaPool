import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-8 md:px-16 relative z-10">
      {/* Left: Logo & Links */}
      <div className="flex items-center gap-12 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          {/* Logo Icon */}
          <div className="w-6 h-6 rounded flex items-center justify-center bg-linear-to-r from-violet-400 to-blue-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M4 4H20V6H4V4ZM4 11H20V13H4V11ZM4 18H20V20H4V18Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 to-blue-400">
            Aligno
          </span>
        </div>

        <ul className="hidden md:flex gap-8 text-gray-400 text-sm font-medium">
          {['Product', 'Pricing', 'Company', 'Help'].map((item) => (
            <li key={item}>
              <a href="#" className="hover:text-white transition-colors duration-200">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex gap-4 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm">
        <button className="text-sm font-semibold text-gray-300 hover:text-white px-3 py-1.5 transition-colors">
          Log in
        </button>
        <button className="bg-linear-to-r from-violet-500 to-blue-500 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_25px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 transition-all duration-200">
          Contact us
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
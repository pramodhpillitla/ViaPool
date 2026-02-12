// 1. dark theme with violet and black and dark blue

// import React, { useState } from 'react';
// import { MapPin, Users, Zap, Clock, ArrowRight, Smartphone, Star } from 'lucide-react';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-[#0F172A] text-slate-200 selection:bg-cyan-500/30">
//       {/* Glow Effect Background */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

//       {/* Navigation */}
//       <nav className="relative z-10 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
//         <div className="flex items-center gap-2">
//           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3 shadow-lg shadow-indigo-500/20">
//             <Zap className="text-white fill-white" size={20} />
//           </div>
//           <span className="text-2xl font-black tracking-tighter text-white">VIAPOOL</span>
//         </div>
//         <div className="hidden md:flex gap-10 text-sm font-bold uppercase tracking-widest text-slate-400">
//           <a href="#" className="hover:text-cyan-400 transition-colors">Network</a>
//           <a href="#" className="hover:text-cyan-400 transition-colors">Safety</a>
//           <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
//         </div>
//         <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-cyan-400 transition-all duration-300">
//           Launch App
//         </button>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
//         <div className="space-y-8 text-center lg:text-left">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
//             </span>
//             Live in 12 Cities
//           </div>
//           <h1 className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tight">
//             MOVE BEYOND <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
//               THE COMMUTE.
//             </span>
//           </h1>
//           <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0">
//             Viapool connects you with premium shared transit. High-frequency routes, luxury seating, and zero stress.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
//             <div className="relative group">
//               <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
//               <button className="relative bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3">
//                 Download for iOS <Smartphone size={20} />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Visual Element - Glassmorphism Card */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full"></div>
//           <div className="relative bg-slate-800/40 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] shadow-2xl">
//             <div className="space-y-6">
//               <div className="flex items-center justify-between border-b border-white/5 pb-4">
//                 <span className="font-bold">Recent Trip</span>
//                 <span className="text-cyan-400 text-sm">Completed</span>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex gap-4">
//                   <div className="flex flex-col items-center gap-1">
//                     <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
//                     <div className="w-0.5 h-10 bg-slate-700"></div>
//                     <div className="w-3 h-3 border-2 border-indigo-500 rounded-full"></div>
//                   </div>
//                   <div className="space-y-6">
//                     <div>
//                       <p className="text-xs text-slate-500 uppercase font-bold">Pickup</p>
//                       <p className="text-white font-medium">Cyber City Terminal</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500 uppercase font-bold">Destination</p>
//                       <p className="text-white font-medium">Green Valley Hub</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features - Horizontal Scroll Style */}
//       <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
//         <div className="grid md:grid-cols-4 gap-8">
//           <Stat icon={<Users size={24} />} value="2.4M" label="Shared Miles" />
//           <Stat icon={<Clock size={24} />} value="12m" label="Avg Wait Time" />
//           <Stat icon={<Star size={24} />} value="4.9" label="User Rating" />
//           <Stat icon={<MapPin size={24} />} value="450+" label="Smart Stops" />
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="px-6 py-20">
//         <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] p-12 text-center relative overflow-hidden">
//           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"></div>
//           <h2 className="text-4xl font-black text-white mb-6 italic">Ready to optimize your morning?</h2>
//           <p className="text-indigo-100 text-lg mb-10 max-w-md mx-auto">Join the 10,000+ commuters who switched to Viapool this month.</p>
//           <button className="bg-white text-indigo-950 px-12 py-4 rounded-full font-black uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
//             Get Started <ArrowRight size={20} />
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// };

// const Stat = ({ icon, value, label }) => (
//   <div className="text-center md:text-left space-y-2 group">
//     <div className="text-indigo-500 group-hover:text-cyan-400 transition-colors duration-300">
//       {icon}
//     </div>
//     <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
//     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</p>
//   </div>
// );

// export default Home;




// 2. white , black and green theme

// import React from 'react';
// import { ArrowUpRight, Globe, Zap, Fingerprint, Shield, MoveRight } from 'lucide-react';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-[#F9F9F9] text-[#000000] font-sans selection:bg-[#E2FF3B]">
//       {/* Ultra-Thin Progress Bar */}
//       <div className="h-1 w-full bg-black/5 fixed top-0 z-50">
//         <div className="h-full w-1/3 bg-[#E2FF3B]"></div>
//       </div>

//       {/* Header */}
//       <nav className="flex justify-between items-center p-8 border-b border-black/5">
//         <div className="text-2xl font-black tracking-tighter flex items-center gap-1">
//           VIA <span className="bg-[#E2FF3B] px-1 italic text-black">POOL</span>
//         </div>
//         <div className="hidden lg:flex gap-12 text-[11px] font-black uppercase tracking-[0.2em]">
//           <a href="#" className="hover:line-through transition-all">Network</a>
//           <a href="#" className="hover:line-through transition-all">The Fleet</a>
//           <a href="#" className="hover:line-through transition-all">Enterprise</a>
//         </div>
//         <div className="flex items-center gap-6">
//           <span className="text-[11px] font-black uppercase tracking-widest hidden sm:block">Login</span>
//           <button className="bg-black text-white px-8 py-3 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-[#E2FF3B] hover:text-black transition-colors">
//             Reserve
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main>
//         <section className="px-8 pt-24 pb-12 border-b border-black/5">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex justify-between items-end mb-12">
//               <h1 className="text-[12vw] font-black leading-[0.85] tracking-tighter uppercase">
//                 The New <br /> Standard.
//               </h1>
//               <div className="hidden lg:block w-1/3 pb-6 border-l border-black/20 pl-8">
//                 <p className="text-xl font-medium leading-tight mb-6">
//                   Re-engineering the daily commute into a high-performance ritual.
//                 </p>
//                 <div className="flex items-center gap-2 group cursor-pointer">
//                   <span className="font-black text-xs uppercase tracking-widest group-hover:mr-2 transition-all">Explore Infrastructure</span>
//                   <ArrowUpRight size={16} />
//                 </div>
//               </div>
//             </div>

//             {/* Massive Hero Image Placeholder */}
//             <div className="w-full h-[60vh] bg-black relative group overflow-hidden">
//                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069')] bg-cover bg-center grayscale contrast-125 opacity-70 group-hover:scale-105 transition-transform duration-1000"></div>
//                <div className="absolute bottom-8 left-8">
//                   <span className="bg-[#E2FF3B] text-black px-4 py-2 font-black text-xs tracking-tighter uppercase">Vehicle Type: Class-A Shuttle</span>
//                </div>
//             </div>
//           </div>
//         </section>

//         {/* Features: The Grid */}
//         <section className="grid md:grid-cols-3 border-b border-black/5">
//           <FeatureItem 
//             number="01"
//             icon={<Zap size={20} />}
//             title="NEURAL ROUTING"
//             desc="Proprietary AI that predicts traffic patterns 15 minutes before they happen."
//           />
//           <FeatureItem 
//             number="02"
//             icon={<Fingerprint size={20} />}
//             title="BIOMETRIC ACCESS"
//             desc="Seamless entry via secure biometric verification for every passenger."
//           />
//           <FeatureItem 
//             number="03"
//             icon={<Shield size={20} />}
//             title="TOTAL ASSURANCE"
//             desc="Real-time end-to-end encryption for all route and rider data."
//           />
//         </section>

//         {/* CTA Section */}
//         <section className="p-8 py-32 bg-black text-white text-center overflow-hidden relative">
//           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
//             <h2 className="text-[30vw] font-black leading-none uppercase">POOL</h2>
//           </div>
//           <div className="relative z-10">
//             <h2 className="text-5xl md:text-7xl font-black mb-12 uppercase tracking-tighter italic">
//               Don't just travel. <br />Arrive.
//             </h2>
//             <button className="bg-[#E2FF3B] text-black px-16 py-6 rounded-none font-black text-sm uppercase tracking-[0.3em] hover:scale-105 transition-transform flex items-center gap-4 mx-auto">
//               Join the Network <MoveRight size={20} />
//             </button>
//           </div>
//         </section>
//       </main>

//       {/* Footer */}
//       <footer className="p-8 grid md:grid-cols-4 gap-12 border-t border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/40">
//         <div>© 2026 Viapool Global</div>
//         <div>INSTAGRAM / TWITTER / LINKEDIN</div>
//         <div>Basar, Telangana, India</div>
//         <div className="text-black text-right">Privacy Policy</div>
//       </footer>
//     </div>
//   );
// };

// const FeatureItem = ({ number, icon, title, desc }) => (
//   <div className="p-12 border-r border-black/5 last:border-r-0 group hover:bg-white transition-colors">
//     <div className="flex justify-between items-start mb-16">
//       <span className="text-[10px] font-black bg-black text-white px-2 py-1">{number}</span>
//       <div className="group-hover:text-[#E2FF3B] group-hover:fill-[#E2FF3B] transition-colors">{icon}</div>
//     </div>
//     <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{title}</h3>
//     <p className="text-black/60 font-medium text-sm leading-relaxed mb-8">{desc}</p>
//     <div className="h-[1px] w-0 bg-black group-hover:w-full transition-all duration-500"></div>
//   </div>
// );

// export default Home;





//3. similar to one 

// import React, { useState, useEffect } from 'react';
// import { MoveRight, Zap, Shield, Compass, Star, Play, Cpu } from 'lucide-react';

// const Home = () => {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 50);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-cyan-400 selection:text-black">
      
//       {/* --- VISUAL ELEMENT: ANIMATED MESH GRADIENT --- */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse" />
//         <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-cyan-500/10 blur-[100px]" />
//         <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-lime-400/5 blur-[80px]" />
//       </div>

//       {/* Navigation */}
//       <nav className={`fixed w-full z-50 transition-all duration-500 px-8 py-6 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent'}`}>
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//           <div className="text-2xl font-black tracking-tighter flex items-center gap-2 group cursor-pointer">
//             <div className="w-8 h-8 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-lg group-hover:rotate-180 transition-transform duration-700 shadow-lg shadow-cyan-500/20" />
//             VIAPOOL
//           </div>
//           <div className="hidden md:flex gap-10 text-sm font-semibold tracking-wide text-slate-400">
//             <a href="#" className="hover:text-cyan-400 transition-colors">Network</a>
//             <a href="#" className="hover:text-cyan-400 transition-colors">The Tech</a>
//             <a href="#" className="hover:text-cyan-400 transition-colors">Fleet</a>
//           </div>
//           <button className="relative group overflow-hidden bg-white text-black px-7 py-2.5 rounded-full font-bold transition-all">
//             <span className="relative z-10">Get App</span>
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative pt-40 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
//         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-bounce-slow">
//           <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
//           <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Transit Reinvented</span>
//         </div>
        
//         <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85]">
//           SMOOTH <br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-300 to-lime-200">
//             VELOCITY.
//           </span>
//         </h1>
        
//         <p className="max-w-xl text-lg text-slate-400 mb-12 leading-relaxed">
//           Luxury commute at scale. Experience the first truly intelligent, high-frequency transit network built for the modern urban elite.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-6">
//           <button className="px-10 py-5 bg-gradient-to-br from-violet-600 to-violet-800 rounded-2xl font-black text-lg shadow-2xl shadow-violet-500/20 hover:scale-105 transition-transform flex items-center gap-3 group">
//             Book My Route <MoveRight className="group-hover:translate-x-2 transition-transform" />
//           </button>
//           <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3">
//             <Play size={20} fill="currentColor" /> See How
//           </button>
//         </div>
//       </section>

//       {/* --- VISUAL ELEMENT: GLASS CARDS --- */}
//       <section className="px-8 pb-40 max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-3 gap-8">
//           <GlassCard 
//             icon={<Cpu className="text-cyan-400" />}
//             title="Mesh IQ"
//             desc="Our neural network optimizes every pickup point in real-time."
//           />
//           <GlassCard 
//             icon={<Shield className="text-violet-400" />}
//             title="Vault Secure"
//             desc="Biometric entry and encrypted trip data for total privacy."
//           />
//           <GlassCard 
//             icon={<Compass className="text-lime-300" />}
//             title="Flow State"
//             desc="Zero-wait transfers and ergonomically designed fleet cabins."
//           />
//         </div>
//       </section>

//       {/* CTA / Footer Lite */}
//       <section className="px-8 py-20">
//         <div className="max-w-5xl mx-auto relative group">
//           <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-[3rem] blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
//           <div className="relative bg-[#0a0f1e] border border-white/10 rounded-[3rem] p-16 flex flex-col items-center overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"></div>
//             <h2 className="text-5xl font-black mb-6 text-center">Ready for the <br/><span className="italic font-light">next generation?</span></h2>
//             <p className="text-slate-500 mb-10 text-center max-w-sm">No surge pricing. No stress. Just pure, unadulterated flow.</p>
//             <div className="flex gap-4">
//                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:border-cyan-400 transition-colors cursor-pointer"><Star size={20} /></div>
//                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 hover:border-cyan-400 transition-colors cursor-pointer"><Zap size={20} /></div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// const GlassCard = ({ icon, title, desc }) => (
//   <div className="relative group p-1 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] hover:from-cyan-400/20 transition-all duration-700">
//     <div className="h-full bg-[#0a0f1e]/80 backdrop-blur-xl rounded-[1.9rem] p-10 flex flex-col items-start">
//       <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
//         {icon}
//       </div>
//       <h3 className="text-2xl font-black mb-4 tracking-tight uppercase tracking-[0.1em]">{title}</h3>
//       <p className="text-slate-400 leading-relaxed font-medium">{desc}</p>
//     </div>
//   </div>
// );

// export default Home;




//4. 3 but a lil better 
// import React from 'react';
// import { MousePointer2, Wind, ShieldCheck, Activity, ChevronRight, Globe, Layers } from 'lucide-react';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-[#0A1128] text-white font-sans selection:bg-azure-500/30 overflow-x-hidden">
      
//       {/* --- VISUAL ELEMENT: THE "AURORA GLOW" --- */}
//       <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none" />
//       <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

//       {/* Navigation */}
//       <nav className="relative z-50 flex items-center justify-between px-12 py-8 max-w-[1800px] mx-auto">
//         <div className="flex items-center gap-3 group cursor-pointer">
//           <div className="relative">
//             <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-400 transition-all duration-500">
//               <Wind size={20} className="text-blue-400" />
//             </div>
//           </div>
//           <span className="text-2xl font-black tracking-widest italic uppercase">ViaPool</span>
//         </div>
        
//         <div className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-full">
//           <NavLink label="Network" active />
//           <NavLink label="The Fleet" />
//           <NavLink label="Technology" />
//         </div>

//         <button className="bg-white text-[#0A1128] px-8 py-3 rounded-full font-black text-sm uppercase tracking-tighter hover:bg-blue-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
//           Join the Fleet
//         </button>
//       </nav>

//       {/* Hero Section */}
//       <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-40">
//         <div className="grid lg:grid-cols-2 gap-20 items-center">
//           <div className="space-y-10">
//             <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full">
//               <Activity size={14} className="text-blue-400 animate-pulse" />
//               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-200">System Status: Optimal</span>
//             </div>
            
//             <h1 className="text-7xl md:text-[6.5rem] font-black leading-[0.85] tracking-tighter">
//               TRANSIT <br /> 
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-400/50">
//                 UNBOUND.
//               </span>
//             </h1>

//             <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-light">
//               Eliminating the friction of urban movement. Premium bus-pooling powered by predictive architecture.
//             </p>

//             <div className="flex gap-4">
//               <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all flex items-center gap-3 group shadow-xl shadow-blue-600/20">
//                 Explore Routes <ChevronRight className="group-hover:translate-x-1 transition-transform" />
//               </button>
//               <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/20 to-transparent">
//                 <button className="bg-[#0A1128]/80 backdrop-blur-md px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/5 transition-all flex items-center gap-3">
//                   <Globe size={20} className="text-blue-400" /> Live Map
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Floating Glass Display */}
//           <div className="relative">
//             <div className="absolute -inset-10 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
//             <div className="relative bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[3rem] p-10 shadow-2xl overflow-hidden group">
//               {/* Decorative "Scanning" Line */}
//               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 group-hover:top-full transition-all duration-[3000ms] ease-linear" />
              
//               <div className="space-y-8">
//                 <div className="flex justify-between items-end">
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Current Node</p>
//                     <h3 className="text-3xl font-black">HTECH_042</h3>
//                   </div>
//                   <Layers className="text-white/20" size={40} />
//                 </div>

//                 <div className="space-y-4">
//                    <StatRow label="Availability" value="98.2%" color="bg-blue-400" />
//                    <StatRow label="Active Units" value="1,240" color="bg-white" />
//                    <StatRow label="Energy Efficiency" value="A+" color="bg-emerald-400" />
//                 </div>

//                 <div className="pt-6 flex gap-2">
//                    {[1,2,3,4,5,6].map(i => (
//                      <div key={i} className="h-12 w-full bg-white/5 rounded-lg border border-white/10 hover:bg-blue-500/20 transition-colors cursor-crosshair" />
//                    ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Feature Grid */}
//       <section className="max-w-7xl mx-auto px-8 pb-32 grid md:grid-cols-3 gap-8">
//         <GlassFeature 
//           icon={<MousePointer2 size={24} />}
//           title="Zero Friction"
//           desc="One-tap booking system integrated with your corporate workspace."
//         />
//         <GlassFeature 
//           icon={<ShieldCheck size={24} />}
//           title="Secure Transit"
//           desc="End-to-end encrypted route data and verified professional pilots."
//         />
//         <GlassFeature 
//           icon={<Wind size={24} />}
//           title="Aerodynamic Flow"
//           desc="Optimized boarding sequences to save you 15 minutes every trip."
//         />
//       </section>
//     </div>
//   );
// };

// // Sub-Components for Cleanliness
// const NavLink = ({ label, active = false }) => (
//   <a href="#" className={`px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-white text-[#0A1128]' : 'text-white/50 hover:text-white'}`}>
//     {label}
//   </a>
// );

// const StatRow = ({ label, value, color }) => (
//   <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-white/20 transition-colors">
//     <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{label}</span>
//     <div className="flex items-center gap-3">
//       <span className="font-black text-sm">{value}</span>
//       <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
//     </div>
//   </div>
// );

// const GlassFeature = ({ icon, title, desc }) => (
//   <div className="group relative p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 to-transparent hover:from-blue-400/50 transition-all duration-500">
//     <div className="h-full bg-[#0A1128]/40 backdrop-blur-2xl rounded-[2.45rem] p-10 border border-white/5">
//       <div className="mb-8 p-4 w-fit bg-white/5 rounded-2xl border border-white/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-400 group-hover:text-white transition-all duration-500">
//         {icon}
//       </div>
//       <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{title}</h3>
//       <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
//     </div>
//   </div>
// );

// export default Home;





//5. glass effect white
// import React from 'react';
// import { Compass, Zap, Shield, ArrowRight, Play, LayoutGrid, Cpu, MapPin } from 'lucide-react';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-[#FBFBFB] text-[#1D1D1F] font-['Outfit',sans-serif] selection:bg-blue-100">
      
//       {/* --- SOFT AMBIENT BACKGROUND --- */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]" />
//         <div className="absolute bottom-[5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-purple-50/60 blur-[100px]" />
//       </div>

//       {/* Floating Pearl Navigation */}
//       <nav className="fixed top-6 w-full z-50 px-6">
//         <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
//               <Zap size={18} className="text-white fill-white" />
//             </div>
//             <span className="text-xl font-bold tracking-tight text-slate-800 uppercase">ViaPool</span>
//           </div>
          
//           <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
//             <a href="#" className="hover:text-blue-600 transition-colors">Safety</a>
//             <a href="#" className="hover:text-blue-600 transition-colors">Routes</a>
//             <a href="#" className="hover:text-blue-600 transition-colors">Business</a>
//           </div>

//           <button className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-md">
//             Get Started
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative pt-44 pb-20 px-6 flex flex-col items-center">
//         <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8">
//           <span className="relative flex h-2 w-2">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
//           </span>
//           <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Available in Hyderabad</span>
//         </div>

//         <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-center mb-8 text-slate-900 leading-[1.1]">
//           Commute in <br />
//           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
//             Pure Comfort.
//           </span>
//         </h1>

//         <p className="max-w-xl text-center text-lg text-slate-500 mb-12 font-medium leading-relaxed">
//           The intelligence of AI meets the serenity of a private lounge. Reach your destination refreshed, every single time.
//         </p>

//         <div className="flex flex-col sm:flex-row gap-4">
//           <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center gap-2">
//             Book a Ride <ArrowRight size={20} />
//           </button>
//           <button className="px-10 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center gap-2">
//             <Play size={20} className="text-blue-600" fill="currentColor" /> Watch Video
//           </button>
//         </div>
//       </section>

//       {/* Pearl Glass Dashboard */}
//       <section className="px-6 max-w-6xl mx-auto pb-40">
//         <div className="bg-white/40 backdrop-blur-2xl rounded-[3rem] border border-white/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] overflow-hidden">
//           <div className="p-10 grid md:grid-cols-3 gap-12">
            
//             <GlassFeature 
//               icon={<MapPin className="text-blue-500" />}
//               title="Smart Hubs"
//               desc="Optimized stops within 2 minutes of your location."
//             />
//             <GlassFeature 
//               icon={<Shield className="text-indigo-500" />}
//               title="SafePass"
//               desc="Verified drivers and real-time biometric check-ins."
//             />
//             <GlassFeature 
//               icon={<Cpu className="text-purple-500" />}
//               title="AutoRoute"
//               desc="Dynamic rerouting that bypasses traffic in real-time."
//             />

//           </div>

//           {/* Visualization Section */}
//           <div className="px-10 pb-10">
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] p-8 border border-white flex flex-col md:flex-row items-center justify-between gap-8">
//                <div className="space-y-4">
//                   <h3 className="text-2xl font-bold text-slate-800">Track your savings</h3>
//                   <p className="text-slate-500 max-w-xs">Our users save an average of ₹4,500 monthly compared to private cabs.</p>
//                   <div className="flex gap-2">
//                     <div className="px-4 py-2 bg-white rounded-full text-sm font-bold shadow-sm">~45% Cheaper</div>
//                     <div className="px-4 py-2 bg-white rounded-full text-sm font-bold shadow-sm">0 Carbon</div>
//                   </div>
//                </div>
//                <div className="w-full md:w-64 h-40 bg-white/60 backdrop-blur-md rounded-3xl border border-white flex items-center justify-center italic text-slate-400 font-medium">
//                   [Interactive Map Graphic]
//                </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// const GlassFeature = ({ icon, title, desc }) => (
//   <div className="group">
//     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 group-hover:shadow-md transition-all">
//       {icon}
//     </div>
//     <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{title}</h3>
//     <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
//   </div>
// );

// export default Home;







//6. Green with glass effect 

// import React from 'react';
// import { 
//   Zap, 
//   Shield, 
//   ArrowRight, 
//   Cpu, 
//   MapPin, 
//   Gauge, 
//   Fingerprint, 
//   Layers, 
//   Play, 
//   Sparkles 
// } from 'lucide-react';

// const Home = () => {
//   return (
//     <div className="min-h-screen bg-[#F5F5F7] text-[#022C22] font-['Bricolage_Grotesque',sans-serif] overflow-x-hidden">
      
//       {/* --- VIBRANT BACKGROUND ELEMENTS (Trapped behind glass) --- */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-[#ADFF00] rounded-full blur-[140px] opacity-30 animate-pulse" />
//         <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[120px]" />
//       </div>

//       {/* Floating Navigation */}
//       <nav className="fixed top-8 w-full z-50 px-6">
//         <div className="max-w-5xl mx-auto flex items-center justify-between px-8 py-4 bg-white/40 backdrop-blur-[40px] border-t border-l border-white/60 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
//           <div className="flex items-center gap-2 font-black text-2xl tracking-tighter uppercase italic">
//             VIA<span className="text-teal-700">POOL</span>
//           </div>
//           <div className="hidden md:flex gap-10 text-[11px] font-black uppercase tracking-[0.2em] text-teal-900/60">
//             <a href="#" className="hover:text-teal-900">Safety</a>
//             <a href="#" className="hover:text-teal-900">Fleet</a>
//             <a href="#" className="hover:text-teal-900">Enterprise</a>
//           </div>
//           <button className="bg-[#ADFF00] text-teal-950 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-lime-200 hover:scale-105 transition-transform">
//             Reserve
//           </button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative pt-56 pb-32 px-6 flex flex-col items-center">
//         <div className="px-5 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white shadow-sm mb-12 flex items-center gap-2">
//           <Sparkles size={14} className="text-teal-600" />
//           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-800">Next-Gen Mobility protocol</span>
//         </div>

//         <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-center mb-8 leading-[0.8] mix-blend-multiply italic uppercase">
//           Ride The <br /> 
//           <span className="text-teal-600">Velocity.</span>
//         </h1>

//         <p className="max-w-xl text-center text-lg text-teal-900/60 mb-14 font-bold leading-relaxed">
//           Premium bus-pooling refined through predictive architecture. One tap to access a world of frictionless movement.
//         </p>

//         <div className="flex gap-6">
//           <button className="px-12 py-6 bg-teal-900 text-white rounded-[2.5rem] font-black text-xl flex items-center gap-4 hover:shadow-2xl hover:shadow-teal-900/20 transition-all">
//             Get Access <ArrowRight size={24} />
//           </button>
//           <button className="px-10 py-6 bg-white/40 backdrop-blur-[60px] border border-white/80 rounded-[2.5rem] font-black text-xl hover:bg-white transition-all flex items-center gap-3">
//             <Play size={20} className="fill-teal-900 text-teal-900" /> Demo
//           </button>
//         </div>
//       </section>

//       {/* Heavy Glass Action Card */}
//       <section className="px-6 max-w-7xl mx-auto pb-48">
//         <div className="relative group p-[2px] rounded-[4rem] bg-gradient-to-br from-white to-transparent shadow-2xl">
//           <div className="relative bg-white/30 backdrop-blur-[80px] rounded-[3.9rem] border border-white/40 overflow-hidden flex flex-col lg:flex-row">
            
//             {/* Content Side */}
//             <div className="p-16 flex-1 space-y-12">
//                <div className="space-y-4">
//                   <h2 className="text-5xl font-black tracking-tight leading-tight uppercase">Intelligence <br/> Behind The Glass.</h2>
//                   <p className="text-teal-900/60 font-bold max-w-sm">Every route is a mathematical symphony, optimized for comfort and absolute punctuality.</p>
//                </div>
               
//                <div className="grid sm:grid-cols-2 gap-8">
//                   <StrongGlassStat icon={<Gauge/>} value="99.2%" label="On-Time Rate" />
//                   <StrongGlassStat icon={<Fingerprint/>} value="Biometric" label="Secure Entry" />
//                </div>
//             </div>

//             {/* Visual Side (The Neon Display) */}
//             <div className="lg:w-[400px] bg-teal-950 p-12 flex flex-col justify-between text-[#ADFF00] relative">
//                <div className="absolute top-0 left-0 w-full h-1 bg-[#ADFF00] shadow-[0_0_15px_#ADFF00]" />
//                <div className="space-y-2">
//                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Fleet Status</p>
//                  <div className="text-4xl font-black italic">ACTIVE</div>
//                </div>
//                <div className="h-40 border-l border-[#ADFF00]/30 pl-6 flex items-end">
//                   <p className="text-sm font-bold leading-relaxed">Live routing enabled across 14 zones. All units operational.</p>
//                </div>
//             </div>

//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// // Sub-components
// const StrongGlassStat = ({ icon, value, label }) => (
//   <div className="p-8 bg-white/50 backdrop-blur-3xl border border-white rounded-[2rem] shadow-sm flex flex-col gap-4 group hover:bg-white transition-all">
//     <div className="text-teal-700 group-hover:scale-110 transition-transform">{icon}</div>
//     <div>
//       <p className="text-2xl font-black tracking-tighter text-teal-950">{value}</p>
//       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600/50">{label}</p>
//     </div>
//   </div>
// );

// export default Home;







//7. aghh finally a good one , with black - green with glass effect
// import React from 'react';
// import { 
//   Zap, 
//   Shield, 
//   ArrowRight, 
//   Cpu, 
//   MapPin, 
//   Gauge, 
//   Fingerprint, 
//   Layers, 
//   Play, 
//   Sparkles,
//   Command,
//   Bell
// } from 'lucide-react';

// const EmeraldCrystalLanding = () => {
//   return (
//     <div className="min-h-screen bg-[#0A0F14] text-white/90 font-['Plus_Jakarta_Sans',sans-serif] overflow-x-hidden">
      
//       {/* --- KINETIC BACKGROUND (Deep Emerald & Indigo Orbs) --- */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//         <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[140px]" />
//       </div>

//       {/* --- LIQUID NAVIGATION --- */}
//       <nav className="fixed top-8 w-full z-50 px-6">
//         <div className="max-w-5xl mx-auto flex items-center justify-between px-8 py-4 bg-white/[0.03] backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] shadow-2xl shadow-black/50">
//           <div className="flex items-center gap-3 font-black text-2xl tracking-tighter italic">
//             <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
//               <Command size={22} className="text-[#0A0F14]" />
//             </div>
//             VIA<span className="text-emerald-500">POOL</span>
//           </div>
          
//           <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-full border border-white/5">
//             <NavTab label="Intelligence" active />
//             <NavTab label="The Fleet" />
//             <NavTab label="Infrastructure" />
//           </div>

//           <button className="bg-emerald-500 text-[#0A0F14] px-8 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500">
//             Get Started
//           </button>
//         </div>
//       </nav>

//       {/* --- HERO SECTION --- */}
//       <section className="relative pt-64 pb-32 px-6 flex flex-col items-center">
//         <div className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl mb-12 flex items-center gap-3">
//           <Sparkles size={16} className="text-emerald-400" />
//           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Next-Gen Mobility protocol</span>
//         </div>

//         <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter text-center mb-10 leading-[0.8] uppercase">
//           Ride The <br /> 
//           <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-200 to-emerald-500">
//             Velocity.
//           </span>
//         </h1>

//         <p className="max-w-2xl text-center text-xl text-white/40 mb-16 font-medium leading-relaxed tracking-tight italic">
//           High-performance transit for the urban vanguard. <br/> 
//           Engineered by AI. Experienced through comfort.
//         </p>

//         <div className="flex flex-wrap justify-center gap-8">
//           <button className="px-14 py-7 bg-white text-black rounded-[2.5rem] font-black text-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10">
//             Reserve Now
//           </button>
//           <button className="px-12 py-7 bg-white/5 backdrop-blur-[60px] border border-white/10 rounded-[2.5rem] font-black text-2xl hover:bg-white/10 transition-all flex items-center gap-4">
//             <Play size={24} fill="white" /> Experience
//           </button>
//         </div>
//       </section>

//       {/* --- THE CRYSTAL DASHBOARD --- */}
//       <section className="px-6 max-w-7xl mx-auto pb-48">
//         <div className="grid lg:grid-cols-12 gap-10">
          
//           {/* Main Visualizer */}
//           <div className="lg:col-span-8 group relative">
//             <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/40 to-transparent rounded-[4rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-700" />
//             <div className="relative h-full bg-white/[0.02] backdrop-blur-[80px] border border-white/10 rounded-[4rem] p-16 shadow-2xl overflow-hidden">
//                <div className="flex justify-between items-start mb-20">
//                   <div className="space-y-4">
//                     <h3 className="text-5xl font-black uppercase tracking-tighter">Neural <br/> Architecture.</h3>
//                     <p className="text-white/30 font-bold max-w-xs leading-snug">Every route is a mathematical symphony of efficiency and comfort.</p>
//                   </div>
//                   <Cpu size={64} className="text-emerald-500/20" />
//                </div>
               
//                <div className="grid md:grid-cols-3 gap-10">
//                   <Metric icon={<Gauge/>} label="Latency" value="0.04s" />
//                   <Metric icon={<MapPin/>} label="Coverage" value="98.2%" />
//                   <Metric icon={<Fingerprint/>} label="Security" value="BIO-6" />
//                </div>
//             </div>
//           </div>

//           {/* Side Info Panel */}
//           <div className="lg:col-span-4 space-y-10">
//              <div className="bg-emerald-500 rounded-[4rem] p-12 text-[#0A0F14] flex flex-col justify-between h-[320px] shadow-2xl shadow-emerald-500/20 group cursor-pointer overflow-hidden relative">
//                 <div className="absolute top-[-20%] right-[-20%] opacity-20 group-hover:rotate-12 transition-transform duration-1000">
//                   <Layers size={200} />
//                 </div>
//                 <h4 className="text-3xl font-black uppercase tracking-tighter leading-none relative z-10">The <br/> Premium <br/> Protocol.</h4>
//                 <div className="flex justify-between items-center relative z-10">
//                   <span className="text-sm font-black uppercase tracking-widest">Enroll Now</span>
//                   <ArrowRight size={32} />
//                 </div>
//              </div>
             
//              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-10 h-[280px] flex flex-col justify-center text-center group">
//                 <Bell size={40} className="mx-auto mb-6 text-emerald-500 group-hover:animate-bounce" />
//                 <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40">Notifications</p>
//                 <p className="text-xl font-bold mt-2">Live route updates <br/> synced to your calendar.</p>
//              </div>
//           </div>

//         </div>
//       </section>
//     </div>
//   );
// };

// // --- SUB-COMPONENTS ---
// const NavTab = ({ label, active = false }) => (
//   <button className={`px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-500 ${active ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
//     {label}
//   </button>
// );

// const Metric = ({ icon, label, value }) => (
//   <div className="p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/5 rounded-[3rem] group hover:bg-white/[0.08] transition-all cursor-default">
//     <div className="text-emerald-500 mb-6 group-hover:scale-110 transition-transform">{icon}</div>
//     <p className="text-3xl font-black tracking-tighter mb-1">{value}</p>
//     <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20">{label}</p>
//   </div>
// );

// export default EmeraldCrystalLanding;


//8. font size acha hai ismee

// import React from 'react';
// import { 
//   Zap, 
//   Shield, 
//   ArrowRight, 
//   Cpu, 
//   MapPin, 
//   Gauge, 
//   Fingerprint, 
//   Command,
//   ChevronRight,
//   Globe
// } from 'lucide-react';

// const ObsidianLabLanding = () => {
//   return (
//     <div className="min-h-screen bg-[#050505] text-white/80 font-['Inter',sans-serif] selection:bg-blue-500/30 overflow-x-hidden">
      
//       {/* --- SUBTLE AMBIENT LIGHT (Very dim to keep it clean) --- */}
//       <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />
//       <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/5 blur-[120px] pointer-events-none" />

//       {/* --- ULTRA-CLEAN NAVIGATION --- */}
//       <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl">
//         <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-5">
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2 font-semibold text-sm tracking-tighter text-white">
//               <Command size={16} className="text-blue-500" />
//               VIAPOOL <span className="text-white/20 font-light">/</span> <span className="text-white/40 uppercase text-[10px] tracking-[0.2em]">OS.1</span>
//             </div>
//             <div className="hidden md:flex items-center gap-6 ml-6 border-l border-white/10 pl-8">
//               <NavNode label="Network" />
//               <NavNode label="Fleet" />
//               <NavNode label="Infrastructure" />
//             </div>
//           </div>
          
//           <div className="flex items-center gap-4">
//             <span className="text-[10px] font-medium tracking-[0.2em] text-white/30 uppercase">v2.0.42</span>
//             <button className="bg-white text-black px-5 py-1.5 rounded-sm text-[11px] font-bold uppercase tracking-wider hover:bg-blue-500 hover:text-white transition-all">
//               Initialize
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* --- HERO SECTION: EDITORIAL STYLE --- */}
//       <header className="relative pt-48 pb-32 px-8 max-w-[1400px] mx-auto">
//         <div className="max-w-4xl">
//           <div className="flex items-center gap-3 mb-8">
//             <div className="h-[1px] w-8 bg-blue-500" />
//             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-500">Autonomous Logistics</span>
//           </div>
          
//           <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-10 leading-[1.1]">
//             The architecture of <br /> 
//             <span className="text-white/40">urban movement.</span>
//           </h1>

//           <p className="max-w-xl text-base text-white/40 mb-12 leading-relaxed">
//             Viapool leverages predictive neural meshes to synchronize corporate transit. 
//             Designed for precision, engineered for the modern vanguard.
//           </p>

//           <div className="flex items-center gap-8">
//             <button className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:text-blue-400 transition-colors">
//               Request Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//             </button>
//             <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
//               View Technical Specs
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* --- THE "INSTRUMENT" DASHBOARD --- */}
//       <section className="px-8 max-w-[1400px] mx-auto pb-40">
//         <div className="grid lg:grid-cols-12 gap-px bg-white/10 border border-white/10 rounded-sm overflow-hidden shadow-2xl">
          
//           {/* Main Module */}
//           <div className="lg:col-span-8 bg-[#0A0A0A] p-12 relative overflow-hidden group">
//             <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
//               <Globe size={300} strokeWidth={1} />
//             </div>
            
//             <div className="relative z-10 flex flex-col h-full">
//               <div className="mb-20">
//                 <span className="text-[10px] font-bold tracking-[0.3em] text-blue-500 uppercase block mb-4">Core Module</span>
//                 <h2 className="text-2xl font-medium text-white mb-4 leading-tight tracking-tight">Predictive Routing <br/> Synchronization.</h2>
//               </div>

//               <div className="grid sm:grid-cols-3 gap-12 mt-auto">
//                 <DataPoint icon={<Gauge size={14}/>} label="LATENCY" value="0.04ms" />
//                 <DataPoint icon={<Cpu size={14}/>} label="COMPUTE" value="12.4 tflops" />
//                 <DataPoint icon={<Fingerprint size={14}/>} label="AUTH" value="Bio-Verified" />
//               </div>
//             </div>
//           </div>

//           {/* Action Sidebar */}
//           <div className="lg:col-span-4 bg-[#0A0A0A] flex flex-col divide-y divide-white/10">
//             <div className="p-10 flex-1 group cursor-pointer hover:bg-white/5 transition-colors">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="p-2 bg-blue-500/10 rounded-sm">
//                   <Zap size={18} className="text-blue-500" />
//                 </div>
//                 <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
//               </div>
//               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">Fleet Management</h4>
//               <p className="text-[11px] text-white/30 leading-relaxed font-medium">Real-time telemetry and health monitoring for all operational units.</p>
//             </div>

//             <div className="p-10 flex-1 group cursor-pointer hover:bg-white/5 transition-colors">
//               <div className="flex justify-between items-start mb-8">
//                 <div className="p-2 bg-emerald-500/10 rounded-sm">
//                   <Shield size={18} className="text-emerald-500" />
//                 </div>
//                 <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
//               </div>
//               <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white mb-2">Security Protocol</h4>
//               <p className="text-[11px] text-white/30 leading-relaxed font-medium">End-to-end encrypted session logs with hardware-level verification.</p>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="px-8 py-20 border-t border-white/5 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
//         <div className="text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase italic">
//           ViaPool © 2026 / All Rights Reserved
//         </div>
//         <div className="flex gap-12 text-[10px] font-bold tracking-[0.3em] text-white/20 uppercase">
//           <a href="#" className="hover:text-white transition-colors">Terms</a>
//           <a href="#" className="hover:text-white transition-colors">Privacy</a>
//           <a href="#" className="hover:text-white transition-colors">Legal</a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // --- MINI COMPONENTS ---
// const NavNode = ({ label }) => (
//   <a href="#" className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 hover:text-white transition-colors">
//     {label}
//   </a>
// );

// const DataPoint = ({ icon, label, value }) => (
//   <div className="group">
//     <div className="flex items-center gap-2 mb-3 text-white/20 group-hover:text-blue-500 transition-colors">
//       {icon}
//       <span className="text-[9px] font-bold uppercase tracking-[0.3em]">{label}</span>
//     </div>
//     <p className="text-lg font-medium text-white/80 tabular-nums">{value}</p>
//   </div>
// );

// export default ObsidianLabLanding;






// 9 one could be finalsiedd
// import React from 'react';
// import { 
//   Zap, 
//   Shield, 
//   ArrowRight, 
//   Cpu, 
//   MapPin, 
//   Gauge, 
//   Fingerprint, 
//   Command,
//   ChevronRight,
//   Globe,
//   Layers,
//   Sparkles,
//   Play,
//   Bell
// } from 'lucide-react';

// const ObsidianCrystalLanding = () => {
//   return (
//     <div className="min-h-screen bg-[#050505] text-white/80 font-['Inter',sans-serif] selection:bg-emerald-500/30 overflow-x-hidden">
      
//       {/* --- KINETIC MESH BACKGROUND --- */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//         <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/[0.07] blur-[120px] animate-pulse" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/[0.05] blur-[140px]" />
//       </div>

//       {/* --- REFINED GLASS NAVIGATION --- */}
//       <nav className="fixed top-6 w-full z-50 px-6">
//         <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-4 bg-white/[0.03] backdrop-blur-[10px] border border-white/10 rounded-2xl shadow-2xl">
//           <div className="flex items-center gap-2 font-bold text-sm tracking-tighter text-white">
//             <Command size={18} className="text-emerald-500" />
//             VIAPOOL <span className="text-white/20 font-light">/</span> <span className="text-white/40 uppercase text-[9px] tracking-[0.3em]">OS.1</span>
//           </div>
          
//           <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5">
//             <NavNode label="Intelligence" active />
//             <NavNode label="Fleet" />
//             <NavNode label="Nodes" />
//           </div>

//           <div className="flex items-center gap-6">
//             <span className="text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase hidden sm:block">Build 2.0.42</span>
//             <button className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all duration-500">
//               Initialize
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* --- HERO SECTION: CLEAN EDITORIAL --- */}
//       <header className="relative pt-52 pb-32 px-8 max-w-[1400px] mx-auto text-center flex flex-col items-center">
//         <div className="px-5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl mb-10 flex items-center gap-3">
//           <Sparkles size={14} className="text-emerald-400" />
//           <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Autonomous Mobility Protocol</span>
//         </div>
        
//         <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
//           The Architecture <br /> 
//           <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-100 to-emerald-500">
//             Of Urban Flow.
//           </span>
//         </h1>

//         <p className="max-w-xl text-sm md:text-base text-white/40 mb-12 leading-relaxed tracking-tight font-medium">
//           Leveraging predictive neural meshes to synchronize corporate transit. <br/>
//           Engineered for precision, experienced through absolute comfort.
//         </p>

//         <div className="flex flex-wrap justify-center gap-6">
//           <button className="px-10 py-5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-white/5">
//             Request Access
//           </button>
//           <button className="px-10 py-5 bg-white/[0.03] backdrop-blur-[60px] border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3">
//             <Play size={16} fill="white" /> View Experience
//           </button>
//         </div>
//       </header>

//       {/* --- THE INSTRUMENT DASHBOARD --- */}
//       <section className="px-8 max-w-[1400px] mx-auto pb-40">
//         <div className="grid lg:grid-cols-12 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          
//           {/* Main Module */}
//           <div className="lg:col-span-8 bg-[#080808] p-12 relative overflow-hidden group">
//             <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
//               <Globe size={400} strokeWidth={1} />
//             </div>
            
//             <div className="relative z-10 flex flex-col h-full">
//               <div className="mb-24">
//                 <span className="text-[9px] font-bold tracking-[0.4em] text-emerald-500 uppercase block mb-4">// Core Intelligence</span>
//                 <h2 className="text-3xl font-black text-white mb-4 leading-tight tracking-tighter uppercase">Predictive Routing <br/> Synchronization.</h2>
//                 <p className="text-xs text-white/30 font-medium max-w-xs">Real-time latency: 0.04ms</p>
//               </div>

//               <div className="grid sm:grid-cols-3 gap-12 mt-auto">
//                 <DataPoint icon={<Gauge size={18}/>} label="Efficiency" value="+42.8%" />
//                 <DataPoint icon={<Cpu size={18}/>} label="Compute" value="12.4 TFLOPs" />
//                 <DataPoint icon={<Fingerprint size={18}/>} label="Protocol" value="BIO-SYNC" />
//               </div>
//             </div>
//           </div>

//           {/* Action Sidebar */}
//           <div className="lg:col-span-4 bg-[#080808] flex flex-col divide-y divide-white/10">
//             <div className="p-10 flex-1 group cursor-pointer hover:bg-white/[0.02] transition-colors relative overflow-hidden">
//               <div className="flex justify-between items-start mb-10">
//                 <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
//                   <Zap size={20} className="text-emerald-500" />
//                 </div>
//                 <ChevronRight size={18} className="text-white/10 group-hover:text-white transition-colors" />
//               </div>
//               <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-3">Fleet Infrastructure</h4>
//               <p className="text-[11px] text-white/30 leading-relaxed font-medium">Telemetry and health monitoring for all active units.</p>
//             </div>

//             <div className="p-10 flex-1 group cursor-pointer hover:bg-white/[0.02] transition-colors relative overflow-hidden">
//                <div className="flex justify-between items-start mb-10">
//                 <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
//                   <Shield size={20} className="text-blue-500" />
//                 </div>
//                 <ChevronRight size={18} className="text-white/10 group-hover:text-white transition-colors" />
//               </div>
//               <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-3">Security Vault</h4>
//               <p className="text-[11px] text-white/30 leading-relaxed font-medium">End-to-end encrypted session logs with hardware verification.</p>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="px-8 py-20 border-t border-white/5 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
//         <div className="text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">
//           ViaPool © 2026 / Institutional Transit Protocol
//         </div>
//         <div className="flex gap-12 text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">
//           <a href="#" className="hover:text-white transition-colors tracking-[0.3em]">Privacy</a>
//           <a href="#" className="hover:text-white transition-colors tracking-[0.3em]">Infrastructure</a>
//           <a href="#" className="hover:text-white transition-colors tracking-[0.3em]">Legal</a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // --- MINI COMPONENTS ---
// const NavNode = ({ label, active = false }) => (
//   <button className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${active ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}>
//     {label}
//   </button>
// );

// const DataPoint = ({ icon, label, value }) => (
//   <div className="group">
//     <div className="flex items-center gap-2 mb-4 text-white/20 group-hover:text-emerald-400 transition-colors">
//       {icon}
//       <span className="text-[8px] font-bold uppercase tracking-[0.4em]">{label}</span>
//     </div>
//     <p className="text-xl font-black text-white/90 tabular-nums tracking-tighter uppercase">{value}</p>
//   </div>
// );

// export default ObsidianCrystalLanding;









//10.

// import React from 'react';
// import { 
//   Zap, Shield, ArrowRight, Cpu, MapPin, Gauge, Fingerprint, 
//   Command, ChevronRight, Globe, Sparkles, Play, Bell 
// } from 'lucide-react';

// const PhysicalGlassLanding = () => {
//   return (
//     <div className="min-h-screen bg-[#030303] text-white/70 font-['Inter',sans-serif] selection:bg-emerald-500/30 overflow-x-hidden">
      
//       {/* --- KINETIC MESH (Deep Atmosphere) --- */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
//         <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-emerald-500/[0.08] blur-[160px] animate-pulse" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/[0.06] blur-[140px]" />
//       </div>

//       {/* --- THE INSTRUMENT NAV --- */}
//       <nav className="fixed top-6 w-full z-50 px-6">
//         <div className="max-w-[1300px] mx-auto flex items-center justify-between px-6 py-2.5 bg-white/[0.02] backdrop-blur-[100px] border border-white/10 rounded-xl shadow-2xl ring-1 ring-inset ring-white/10">
//           <div className="flex items-center gap-3 font-bold text-[11px] tracking-[0.2em] text-white uppercase">
//             <Command size={14} className="text-emerald-500" />
//             Viapool <span className="text-white/10">|</span> <span className="text-white/40">Transit OS</span>
//           </div>
          
//           <div className="hidden lg:flex items-center gap-1">
//             <NavNode label="Network" active />
//             <NavNode label="Infrastructure" />
//             <NavNode label="Security" />
//           </div>

//           <div className="flex items-center gap-6">
//             <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
//             <button className="bg-white text-black px-4 py-1.5 rounded font-black text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all duration-700 active:scale-95">
//               Initialize
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* --- HERO: ARCHITECTURAL MINIMALISM --- */}
//       <header className="relative pt-48 pb-24 px-8 max-w-[1300px] mx-auto flex flex-col items-start">
//         <div className="flex items-center gap-4 mb-10 overflow-hidden">
//           <div className="h-[1px] w-6 bg-emerald-500/50" />
//           <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-500/80">System Protocol 8.1.0</span>
//         </div>
        
//         <h1 className="text-4xl md:text-6xl font-black tracking-[-0.05em] text-white mb-8 leading-[1.05] uppercase">
//           Predictive <br /> 
//           <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-50 to-emerald-600">
//             Urban Logistics.
//           </span>
//         </h1>

//         <p className="max-w-md text-[13px] text-white/30 mb-12 leading-relaxed tracking-tight font-medium border-l border-white/10 pl-6">
//           Synchronizing corporate transit through neural mesh architecture. Engineered for absolute precision and executive-level silence.
//         </p>

//         <div className="flex items-center gap-8">
//           <button className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white">
//             Request Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
//           </button>
//           <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors">
//             Technical Whitepaper
//           </button>
//         </div>
//       </header>

//       {/* --- THE GLASS CONSOLE --- */}
//       <section className="px-8 max-w-[1300px] mx-auto pb-40">
//         <div className="grid lg:grid-cols-12 gap-px bg-white/5 border border-white/10 rounded-lg overflow-hidden shadow-[0_0_80px_-20px_rgba(0,0,0,1)]">
          
//           {/* Main Visual Unit */}
//           <div className="lg:col-span-8 bg-[#050505]/40 backdrop-blur-[120px] p-12 relative group shadow-inner">
//             <div className="absolute -top-24 -right-24 opacity-[0.02] group-hover:opacity-[0.04] transition-opacity duration-1000">
//               <Globe size={500} strokeWidth={0.5} />
//             </div>
            
//             <div className="relative z-10 flex flex-col h-full">
//               <div className="mb-24 flex justify-between items-start">
//                 <div>
//                   <h2 className="text-xl font-black text-white mb-2 tracking-tighter uppercase italic">Neural Flow Synchronizer</h2>
//                   <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Operational Status: Nominal</p>
//                 </div>
//                 <Cpu size={20} className="text-emerald-500/40" />
//               </div>

//               <div className="grid sm:grid-cols-3 gap-16 mt-auto">
//                 <DataNode icon={<Gauge size={14}/>} label="Optimization" value="99.4%" />
//                 <DataNode icon={<MapPin size={14}/>} label="Zone Reach" value="Global" />
//                 <DataNode icon={<Shield size={14}/>} label="Security" value="AES-X" />
//               </div>
//             </div>
//           </div>

//           {/* Side Modules */}
//           <div className="lg:col-span-4 bg-[#050505]/60 backdrop-blur-[120px] flex flex-col divide-y divide-white/10 shadow-inner">
//             <Module icon={<Zap size={16}/>} label="Fleet Engine" desc="Autonomous telemetry logs." />
//             <Module icon={<Bell size={16}/>} label="Node Alerts" desc="Live congestion bypass." />
//             <div className="p-10 flex-1 bg-emerald-500/[0.02] group cursor-pointer overflow-hidden flex flex-col justify-end">
//                <span className="text-[9px] font-black tracking-[0.4em] text-emerald-500 mb-2 uppercase">Institutional</span>
//                <h4 className="text-sm font-black text-white uppercase tracking-tighter">Request Enterprise Build</h4>
//             </div>
//           </div>

//         </div>
//       </section>

//       {/* --- FOOTER --- */}
//       <footer className="px-8 py-16 border-t border-white/5 max-w-[1300px] mx-auto flex justify-between items-center">
//         <div className="text-[9px] font-bold tracking-[0.4em] text-white/10 uppercase">
//           Viapool Transit Labs / Build 2.0.42
//         </div>
//         <div className="flex gap-10 text-[9px] font-bold tracking-[0.4em] text-white/10 uppercase">
//           <a href="#" className="hover:text-emerald-500 transition-colors">Infra</a>
//           <a href="#" className="hover:text-emerald-500 transition-colors">Legal</a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // --- MICRO COMPONENTS ---
// const NavNode = ({ label, active = false }) => (
//   <button className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.3em] transition-all rounded ${active ? 'text-white' : 'text-white/20 hover:text-white hover:bg-white/5'}`}>
//     {label}
//   </button>
// );

// const DataNode = ({ icon, label, value }) => (
//   <div className="group">
//     <div className="flex items-center gap-3 mb-4 text-white/10 group-hover:text-emerald-500 transition-all duration-500">
//       {icon}
//       <span className="text-[8px] font-black uppercase tracking-[0.5em]">{label}</span>
//     </div>
//     <p className="text-xl font-black text-white/90 tabular-nums tracking-[-0.05em] uppercase">{value}</p>
//   </div>
// );

// const Module = ({ icon, label, desc }) => (
//   <div className="p-10 flex-1 group cursor-pointer hover:bg-white/[0.02] transition-colors">
//     <div className="flex justify-between items-center mb-6">
//       <div className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors">{icon}</div>
//       <ChevronRight size={14} className="text-white/5 group-hover:text-white transition-all" />
//     </div>
//     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80 mb-2">{label}</h4>
//     <p className="text-[11px] text-white/20 leading-relaxed font-medium">{desc}</p>
//   </div>
// );

// export default PhysicalGlassLanding;











// 11. with framer motion 
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Shield, ArrowRight, Cpu, MapPin, Gauge, Fingerprint, 
  Command, ChevronRight, Globe, Layers, Sparkles, Play, Bell 
} from 'lucide-react';

const ObsidianCrystalLanding = () => {
  // Animation Variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white/80 font-['Inter',sans-serif] selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* --- KINETIC MESH BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.07, 0.1, 0.07] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-500/[0.07] blur-[120px]" 
        />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/[0.05] blur-[140px]" />
      </div>

      {/* --- REFINED GLASS NAVIGATION --- */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="fixed top-6 w-full z-50 px-6"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-4 bg-white/[0.03] backdrop-blur-[20px] border border-white/10 rounded-2xl shadow-2xl ring-1 ring-inset ring-white/5">
          <div className="flex items-center gap-2 font-bold text-sm tracking-tighter text-white">
            <Command size={18} className="text-emerald-500" />
            VIAPOOL <span className="text-white/20 font-light">/</span> <span className="text-white/40 uppercase text-[9px] tracking-[0.3em]">OS.1</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5">
            <NavNode label="Intelligence" active />
            <NavNode label="Fleet" />
            <NavNode label="Nodes" />
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase hidden sm:block">Build 2.0.42</span>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all duration-300"
            >
              Initialize
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <motion.header 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="relative pt-52 pb-32 px-8 max-w-[1400px] mx-auto text-center flex flex-col items-center"
      >
        <motion.div variants={fadeInUp} className="px-5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-xl mb-10 flex items-center gap-3">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 font-mono">Autonomous Mobility Protocol</span>
        </motion.div>
        
        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8 leading-[0.9] uppercase">
          The Architecture <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-emerald-100 to-emerald-500">
            Of Urban Flow.
          </span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="max-w-xl text-sm md:text-base text-white/40 mb-12 leading-relaxed tracking-tight font-medium">
          Leveraging predictive neural meshes to synchronize corporate transit. <br/>
          Engineered for precision, experienced through absolute comfort.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            className="px-10 py-5 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl shadow-white/5"
          >
            Request Access
          </motion.button>
          <motion.button 
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            className="px-10 py-5 bg-white/[0.03] backdrop-blur-[60px] border border-white/10 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3"
          >
            <Play size={16} fill="white" /> View Experience
          </motion.button>
        </motion.div>
      </motion.header>

      {/* --- THE INSTRUMENT DASHBOARD --- */}
      <section className="px-8 max-w-[1400px] mx-auto pb-40">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="grid lg:grid-cols-12 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/5"
        >
          
          {/* Main Module */}
          <div className="lg:col-span-8 bg-[#080808] p-12 relative overflow-hidden group">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 p-12 opacity-[0.02]"
            >
              <Globe size={400} strokeWidth={1} />
            </motion.div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-24">
                <span className="text-[9px] font-bold tracking-[0.4em] text-emerald-500 uppercase block mb-4 font-mono">// Core Intelligence</span>
                <h2 className="text-3xl font-black text-white mb-4 leading-tight tracking-tighter uppercase italic">Predictive Routing <br/> Synchronization.</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-white/30 font-mono">Real-time latency: 0.04ms</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-12 mt-auto">
                <DataPoint icon={<Gauge size={18}/>} label="Efficiency" value="+42.8%" />
                <DataPoint icon={<Cpu size={18}/>} label="Compute" value="12.4 TFLOPs" />
                <DataPoint icon={<Fingerprint size={18}/>} label="Protocol" value="BIO-SYNC" />
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 bg-[#080808] flex flex-col divide-y divide-white/10">
            <SidebarItem 
              icon={<Zap size={20} className="text-emerald-500" />}
              label="Fleet Infrastructure"
              desc="Telemetry and health monitoring for active units."
              color="bg-emerald-500/10"
            />
            <SidebarItem 
              icon={<Shield size={20} className="text-blue-500" />}
              label="Security Vault"
              desc="End-to-end encrypted session logs with verification."
              color="bg-blue-500/10"
            />
          </div>

        </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="px-8 py-20 border-t border-white/5 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12 opacity-40">
        <div className="text-[9px] font-bold tracking-[0.4em] text-white uppercase font-mono">
          ViaPool © 2026 / Institutional Transit Protocol
        </div>
        <div className="flex gap-12 text-[9px] font-bold tracking-[0.4em] text-white uppercase">
          <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Nodes</a>
          <a href="#" className="hover:text-emerald-400 transition-colors">Legal</a>
        </div>
      </footer>
    </div>
  );
};

// --- MINI COMPONENTS ---
const NavNode = ({ label, active = false }) => (
  <motion.button 
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
    className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.25em] transition-all ${active ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white'}`}
  >
    {label}
  </motion.button>
);

const DataPoint = ({ icon, label, value }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="group"
  >
    <div className="flex items-center gap-2 mb-4 text-white/20 group-hover:text-emerald-400 transition-colors">
      {icon}
      <span className="text-[8px] font-bold uppercase tracking-[0.4em] font-mono">{label}</span>
    </div>
    <p className="text-xl font-black text-white/90 tabular-nums tracking-tighter uppercase">{value}</p>
  </motion.div>
);

const SidebarItem = ({ icon, label, desc, color }) => (
  <motion.div 
    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
    className="p-10 flex-1 group cursor-pointer relative overflow-hidden transition-colors"
  >
    <div className="flex justify-between items-start mb-10">
      <div className={`p-2.5 ${color} rounded-lg border border-white/10`}>
        {icon}
      </div>
      <ChevronRight size={18} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </div>
    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white mb-3">{label}</h4>
    <p className="text-[11px] text-white/30 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export default ObsidianCrystalLanding;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Terms from '../Terms';
import { 
  Globe, Play, ArrowDown, Check
} from 'lucide-react';

function useScrollReveal(count, delay = 420) {
  const ref = useRef(null);
  const [openCount, setOpenCount] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          for (let i = 1; i <= count; i++) {
            setTimeout(() => setOpenCount(i), i * delay);
          }
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, delay]);

  return { ref, openCount };
}

const Landing = () => {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);

  const stats = useScrollReveal(4, 300);

  const onTryPrototype = () => {
    navigate('/login');
  };

  return (
    <div className="antialiased selection:bg-blue-600 selection:text-white bg-black">
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Foresee Bridge" className="w-7 h-7 opacity-90" style={{filter:'invert(1)'}} />
            <span className="text-white font-bold text-xl tracking-tighter">FORESEE<span className="text-zinc-500 font-light ml-1">BRIDGE</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#howitworks" className="hover:text-white transition">How it works</a>
            <button onClick={onTryPrototype} className="hover:text-white transition">Live demo</button>
            <a href="#investorview" className="hover:text-white transition">Investor view</a>
          </div>
          <button onClick={onTryPrototype} className="bg-zinc-100 hover:bg-white text-black px-5 py-2 flex items-center gap-2 rounded-lg font-medium transition duration-300">
            <img src="/logo.png" alt="" className="w-4 h-4" /> Try prototype
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-black via-[#050505] to-[#0a0a0a]">
        
        {/* Abstract Digital Bridge VFX */}
        <div className="absolute inset-0 opacity-40 flex justify-center items-center" style={{ maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)', WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)'}}>
            <svg className="absolute w-full h-[80%] bottom-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                {[...Array(6)].map((_, i) => {
                    const startX = 5 + (i * 18);
                    const startY = 60 + Math.sin(i * 1.5)*15;
                    const endX = startX + 18;
                    const endY = 60 + Math.sin((i+1) * 1.5)*15;
                    
                    if (i === 5) return (
                        <ellipse key={i} cx={startX} cy={startY} rx="1.5" ry="0.6" fill="#3b82f6" opacity="0.8">
                            <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                        </ellipse>
                    );

                    return (
                        <g key={i}>
                            <ellipse cx={startX} cy={startY} rx="1.5" ry="0.6" fill="#3b82f6" opacity="0.8">
                                <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
                            </ellipse>
                            <path d={`M${startX},${startY} Q${(startX+endX)/2},${Math.min(startY,endY)-8} ${endX},${endY}`} 
                                  fill="none" stroke="#60a5fa" strokeWidth="0.3"
                                  strokeDasharray="30" strokeDashoffset="30">
                                <animate attributeName="stroke-dashoffset" values="30;0" dur="2.5s" begin={`${i * 1}s`} repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="2.5s" begin={`${i * 1}s`} repeatCount="indefinite" />
                            </path>
                            {[1, 2, 3].map(j => (
                                <line key={j} x1={startX + j*4.5} y1={(startY+endY)/2 - 4} x2={startX + j*4.5} y2={100} stroke="#3b82f6" strokeWidth="0.1" strokeOpacity="0">
                                     <animate attributeName="stroke-opacity" values="0;0.4;0" dur="2.5s" begin={`${i * 1 + j*0.3}s`} repeatCount="indefinite" />
                                </line>
                            ))}
                        </g>
                    )
                })}
            </svg>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <div className="flex flex-col md:flex-row justify-center items-center gap-0 md:gap-4 font-black tracking-tighter text-6xl md:text-8xl drop-shadow-2xl">
             <span className="text-blue-500">FORESEE</span>
             <span className="text-white font-light tracking-widest">BRIDGE</span>
          </div>
          
          <p className="text-blue-500 font-semibold tracking-wider uppercase text-sm mb-6 mt-4">AI funding-readiness platform</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-4xl mx-auto">Built for founders who have ideas but not easy access to capital.</h2>
          <p className="text-xl md:text-2xl text-zinc-400 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
             <strong className="text-white font-normal">Foresee Bridge </strong> is an AI-powered matchmaking platform that connects founders with investors based on real alignment in sector, risk, and growth potential, not just geography or network.
          </p>
          <p className="text-zinc-500 text-sm font-medium mb-6 tracking-wide">investors don't pay but everyone gains</p>
          <p className="text-3xl md:text-4xl font-bold italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-blue-300 mb-10 tracking-tight leading-tight">
            "the next big thing is one match away"
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={onTryPrototype} className="relative group overflow-hidden bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 hover:bg-blue-500">
                 <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-shimmer transition-all"></div>
                 <Play className="w-5 h-5 fill-current relative z-10" /> <span className="relative z-10">Live Demo</span>
              </button>
              <a href="#howitworks" className="bg-white/5 border border-white/10 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2">
                 How it works <ArrowDown className="w-5 h-5" />
              </a>
          </div>
        </div>
      </section>

      {/* The Problem & Root Cause */}
      <section id="problem" className="py-24 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                 <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">The problem/gap Foresee Bridge solves.</h3>
                 <p className="text-lg text-zinc-400 max-w-4xl mx-auto font-light mb-4">
                    <strong className="text-white font-medium">Funding Access Gap:</strong> we are solving the access and trust in global finance by connecting the right people and making better decisions possible.
                 </p>
                 <p className="text-lg text-zinc-500 max-w-3xl mx-auto font-light mb-2">
                    Most startups rely on personal loans instead of equity and ideas stay local, never scaling.
                 </p>
            </div>

            <div ref={stats.ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 90% */}
                <div className={`p-8 rounded-2xl bg-black flex flex-col items-start transition-all duration-700 cursor-default border ${stats.openCount >= 1 ? 'border-blue-500/40 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.08)]' : 'border-white/10'}`}>
                    <div className={`text-4xl font-bold text-white mb-2 tracking-tight transition-all duration-500 ${stats.openCount >= 1 ? '-translate-y-1' : ''}`}>90%</div>
                    <div className={`grid transition-all duration-700 w-full ease-in-out ${stats.openCount >= 1 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="text-zinc-400 text-sm leading-relaxed mt-2 pt-4 border-t border-white/10">About 90% of startups fail in their first try because they cant secure funding or run out of cash early on.</div>
                        </div>
                    </div>
                </div>

                {/* 38% */}
                <div className={`p-8 rounded-2xl bg-black flex flex-col items-start transition-all duration-700 cursor-default border ${stats.openCount >= 2 ? 'border-blue-500/40 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.08)]' : 'border-white/10'}`}>
                    <div className={`text-4xl font-bold text-white mb-2 tracking-tight transition-all duration-500 ${stats.openCount >= 2 ? '-translate-y-1' : ''}`}>38%</div>
                    <div className={`grid transition-all duration-700 w-full ease-in-out ${stats.openCount >= 2 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="text-zinc-400 text-sm leading-relaxed mt-2 pt-4 border-t border-white/10">38% startups fail because they run out of cash or fail to raise new capital.</div>
                        </div>
                    </div>
                </div>

                {/* <1% */}
                <div className={`p-8 rounded-2xl bg-black flex flex-col items-start transition-all duration-700 cursor-default border ${stats.openCount >= 3 ? 'border-blue-500/40 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.08)]' : 'border-white/10'}`}>
                    <div className={`text-4xl font-bold text-white mb-2 tracking-tight transition-all duration-500 ${stats.openCount >= 3 ? '-translate-y-1' : ''}`}>&lt;1%</div>
                    <div className={`grid transition-all duration-700 w-full ease-in-out ${stats.openCount >= 3 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="text-zinc-400 text-sm leading-relaxed mt-2 pt-4 border-t border-white/10">Less than 1% ever receive venture capital to supercharge their growth.</div>
                        </div>
                    </div>
                </div>

                {/* 2% */}
                <div className={`p-8 rounded-2xl bg-black flex flex-col items-start transition-all duration-700 cursor-default border ${stats.openCount >= 4 ? 'border-blue-500/40 scale-[1.02] shadow-[0_0_30px_rgba(59,130,246,0.08)]' : 'border-white/10'}`}>
                    <div className={`text-4xl font-bold text-white mb-2 tracking-tight transition-all duration-500 ${stats.openCount >= 4 ? '-translate-y-1' : ''}`}>2%</div>
                    <div className={`grid transition-all duration-700 w-full ease-in-out ${stats.openCount >= 4 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                            <div className="text-zinc-400 text-sm leading-relaxed mt-2 pt-4 border-t border-white/10">Owners establishing their business in developing economies receive only 2% of global foreign investment.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Try Prototype CTA */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black text-center border-t border-white/5">
        <div className="max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-white mb-6">See Foresee Bridge in Action</h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">Launch the interactive prototype to experience the AI decision models and dual-sided investor matchmaking flow directly in your browser.</p>
            <button onClick={onTryPrototype} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all shadow-lg flex items-center gap-2 mx-auto">
                <Globe className="w-5 h-5"/> Try the Prototype
            </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 border-t border-white/5 text-center px-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 hover:bg-blue-600/30 transition-colors duration-300 cursor-pointer">
               <img src="/logo.png" alt="Foresee Bridge" className="w-8 h-8 opacity-60 hover:opacity-100 transition-opacity" style={{filter:'invert(1)'}} />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white tracking-tight">A unified plane for sovereign capital.</h2>
            <p className="text-zinc-500 mb-8 font-light text-sm leading-relaxed">
                Foresee Bridge doesn't just connect startups and funds. It perfectly standardizes the institutional trust layer required to unlock the world's most robust emerging economies.
            </p>
            <div className="text-zinc-600 font-bold text-[10px] tracking-[0.2em] uppercase">
                Foresee Bridge © 2026
            </div>
            <div className="mt-4">
               <button onClick={() => setShowTerms(true)} className="text-zinc-500 hover:text-white text-xs transition underline-offset-4 hover:underline">Terms & Conditions</button>
            </div>
        </div>
      </footer>

      {showTerms && <Terms onClose={() => setShowTerms(false)} />}
    </div>
  );
};

export default Landing;

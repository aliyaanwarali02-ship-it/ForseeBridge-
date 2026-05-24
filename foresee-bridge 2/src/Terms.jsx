import React from 'react';
import { X, ShieldCheck, FileText, Scale, Database, AlertCircle } from 'lucide-react';

const Terms = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-black text-white flex flex-col font-sans animate-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
               <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-0.5">Terms and Conditions</h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Effective Date: Today</p>
            </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-full transition-colors group">
          <X className="w-5 h-5 text-zinc-400 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-12 pb-24 space-y-12 bg-gradient-to-b from-black to-[#050505] selection:bg-blue-500/30">
        <div className="max-w-4xl mx-auto space-y-12">
            
            <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <FileText className="w-6 h-6 text-emerald-500" />
                 <h2 className="text-2xl font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
              </div>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                  By accessing and using Foresee Bridge (the "Platform"), you agree to be bound by these Terms and Conditions. The Platform is designed as an AI-powered matchmaking ecosystem for founders and investors in emerging markets. If you do not agree with any part of these terms, please do not use our services.
              </p>
            </section>

            <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <Scale className="w-6 h-6 text-blue-500" />
                 <h2 className="text-2xl font-bold text-white tracking-tight">2. Platform Role & Limitations</h2>
              </div>
              <ul className="space-y-4 text-zinc-400 font-light text-lg">
                 <li className="flex gap-4">
                     <span className="text-blue-500 font-bold">•</span>
                     <span><strong>Matchmaking Only:</strong> Foresee Bridge acts solely as a facilitator connecting startups and capital. We do not provide financial advice, guarantee funding, or endorse any specific investment opportunities.</span>
                 </li>
                 <li className="flex gap-4">
                     <span className="text-blue-500 font-bold">•</span>
                     <span><strong>Metrics-Based AI:</strong> Our AI evaluates business health and alignment based on the data provided. It does not rewrite pitches or guarantee the certainty of any match outcome.</span>
                 </li>
                 <li className="flex gap-4">
                     <span className="text-blue-500 font-bold">•</span>
                     <span><strong>Due Diligence:</strong> Users (both founders and investors) are entirely responsible for conducting their own independent due diligence before entering into any financial agreements.</span>
                 </li>
              </ul>
            </section>

            <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <Database className="w-6 h-6 text-violet-500" />
                 <h2 className="text-2xl font-bold text-white tracking-tight">3. Data Usage & Privacy</h2>
              </div>
              <p className="text-zinc-400 font-light leading-relaxed text-lg mb-6">
                  We maintain strict data protocols to protect sensitive financial narratives.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-black border border-white/5 p-6 rounded-2xl">
                     <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Input Data</span>
                     <p className="text-sm text-zinc-400 leading-relaxed font-light">Your financial assets and pitch inputs are processed by our intelligence layer solely to construct your investor-ready profile and generate matches.</p>
                 </div>
                 <div className="bg-black border border-white/5 p-6 rounded-2xl">
                     <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest block mb-2">Communication</span>
                     <p className="text-sm text-zinc-400 leading-relaxed font-light">To maintain platform integrity, the sharing of direct contact information (emails, phone numbers) inside the chat interface is monitored and restricted.</p>
                 </div>
              </div>
            </section>
            
            <section className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                 <AlertCircle className="w-6 h-6 text-red-500" />
                 <h2 className="text-2xl font-bold text-white tracking-tight">4. Liability & Obligations</h2>
              </div>
              <p className="text-zinc-400 font-light leading-relaxed text-lg mb-4">
                  <strong>Disclaimer of Warranties:</strong> The Platform and AI insights are provided "as is" without warranty of any kind. 
              </p>
              <p className="text-zinc-400 font-light leading-relaxed text-lg">
                  Foresee Bridge and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of the Platform, including but not limited to lost profits, lost opportunities, or business interruption.
              </p>
            </section>

        </div>
      </div>
    </div>
  );
};

export default Terms;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  Building, LogOut, Bell, Search, Globe, FolderKanban, 
  MessageSquare, CheckCircle2, ChevronRight, AlertCircle,
  FileSignature, Send, User, MapPin, SearchCode, Mail, Phone, Lock,
  Zap, BarChart3, ClipboardList, ShieldCheck, FileText, Upload,
  ChevronLeft, Bookmark, XCircle, RefreshCw, Users
} from 'lucide-react';

const InvestorDashboard = () => {
  const navigate = useNavigate();
  const { 
    role, logout, founderProfile, financialAssets,
    credibility, strength, investorSelectedDeal, setInvestorSelectedDeal,
    syncedChat, setSyncedChat, investorNotify, alert, containsContactInfo, triggerNotify,
    investorProfile, setInvestorProfile, premiumUnlocked, setPremiumUnlocked,
    calculateCompatibility, simulateUpload, isUploading, MATCHED_FOUNDERS
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [contactWarning, setContactWarning] = useState(false);
  const [savedMatches, setSavedMatches] = useState([]);
  const [skippedMatches, setSkippedMatches] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (role !== 'investor') navigate('/login');
  }, [role, navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [syncedChat]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    if (containsContactInfo(chatInput)) {
      setContactWarning(true);
      setTimeout(() => setContactWarning(false), 3500);
      return;
    }
    setSyncedChat(prev => [...prev, { sender: 'investor', text: chatInput }]);
    triggerNotify('founder', { title: 'New Message', body: chatInput });
    setChatInput('');
  };

  const Badge = ({ children, color = 'zinc' }) => {
    const colors = {
      zinc: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
      emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      red: 'bg-red-500/10 border-red-500/20 text-red-500',
      violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    };
    return (
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${colors[color]}`}>
        {children}
      </span>
    );
  };

  const handleSubmitProfile = () => {
    setProfileSubmitted(true);
    setTimeout(() => {
        setProfileSubmitted(false);
        setActiveTab('radar');
    }, 2000);
  };

  const sidebarLinks = [
    { id: 'onboarding', label: 'Profile Setup', icon: User },
    { id: 'radar', label: 'Match L1', icon: Zap },
    { id: 'chat', label: 'Basic Chat', icon: MessageSquare },
    { id: 'vision', label: 'Match L2', icon: BarChart3 },
    { id: 'ecosystem', label: 'Ecosystem', icon: Users }
  ];

  if (role !== 'investor') return null;

  const topMatches = MATCHED_FOUNDERS.filter(f => !skippedMatches.includes(f.id)).slice(0, 3);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-black tracking-tighter">
            <img src="/logo.png" alt="Foresee Bridge" className="w-6 h-6" style={{filter:'invert(1)'}} />
            FORESEE
          </div>
        </div>
        <div className="px-6 py-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-blue-500 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 inline-block">
               Investor Portal
            </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map(link => (
             <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                  activeTab === link.id 
                    ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
             >
                <link.icon className="w-4 h-4" />
                {link.label}
             </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-500 font-bold text-sm transition-all">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 shrink-0 bg-[#0a0a0a]">
           <h2 className="text-xl font-bold">{sidebarLinks.find(l => l.id === activeTab)?.label}</h2>
           <div className="flex items-center gap-4">
             {investorNotify && (
               <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-400 text-xs font-bold animate-pulse cursor-pointer" onClick={() => setActiveTab('chat')}>
                 <Bell className="w-3.5 h-3.5" /> {investorNotify.title}
               </div>
             )}
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-600/30">
               {investorProfile.name ? investorProfile.name.charAt(0) : 'I'}
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 relative bg-[#050505] flex justify-center">
            <div className="w-full max-w-4xl">
              
               {/* ONBOARDING FLOW */}
               {activeTab === 'onboarding' && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-between mb-8">
                       {[1,2,3,4].map(step => (
                          <div key={step} className="flex flex-col items-center flex-1 relative">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all font-bold ${onboardingStep === step ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : onboardingStep > step ? 'bg-blue-500/20 border border-blue-500/30 text-blue-500' : 'bg-white/5 text-zinc-500 border border-white/10'}`}>
                                  {onboardingStep > step ? <CheckCircle2 className="w-5 h-5"/> : step}
                              </div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-3 absolute top-12 whitespace-nowrap">
                                  {step === 1 ? 'Basic Info' : step === 2 ? 'Preferences' : step === 3 ? 'Background' : 'Verify'}
                              </div>
                              {step < 4 && <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${onboardingStep > step ? 'bg-blue-500/30' : 'bg-white/5'}`}></div>}
                          </div>
                      ))}
                    </div>
                    <div className="h-4"></div>

                    <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                       
                       {onboardingStep === 1 && (
                           <div className="space-y-6 animate-in slide-in-from-right-4">
                              <h3 className="text-xl font-bold text-white mb-2">Establish Your Investor Profile</h3>
                              <p className="text-zinc-500 text-sm mb-8">This determines your market position and AI matching foundation.</p>
                              
                              <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Full Name / Entity Name</label>
                                 <input type="text" value={investorProfile.name} onChange={e => setInvestorProfile({...investorProfile, name: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Investor Type</label>
                                    <select value={investorProfile.type} onChange={e => setInvestorProfile({...investorProfile, type: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all">
                                        <option>Angel Investor</option><option>VC Firm</option><option>Syndicate</option><option>Family Office</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Location</label>
                                    <input type="text" value={investorProfile.location} onChange={e => setInvestorProfile({...investorProfile, location: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50 transition-all" />
                                  </div>
                              </div>
                               <div>
                                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4 block mt-4">Preferred Sectors</label>
                                  <div className="flex flex-wrap gap-2">
                                        {['Fintech', 'Clean Energy', 'Agri-Tech', 'AI/ML', 'Healthcare', 'SME', 'E-commerce'].map(s => (
                                            <button 
                                              key={s} 
                                              onClick={() => {
                                                const next = investorProfile.sectors.includes(s) ? investorProfile.sectors.filter(x => x !== s) : [...investorProfile.sectors, s];
                                                setInvestorProfile({...investorProfile, sectors: next});
                                              }}
                                              className={`px-3 py-2 rounded-lg text-[10px] font-black border transition-all ${investorProfile.sectors.includes(s) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#050505] border-white/10 text-zinc-500 hover:border-white/20'}`}
                                            >
                                              {s}
                                            </button>
                                        ))}
                                  </div>
                              </div>
                           </div>
                       )}

                       {onboardingStep === 2 && (
                           <div className="space-y-6 animate-in slide-in-from-right-4">
                              <h3 className="text-xl font-bold text-white mb-2">Investment Preferences</h3>
                              <p className="text-zinc-500 text-sm mb-8">Define your precise investment thesis for accurate matchmaking.</p>
                              
                              <div>
                                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4 block">Target Stages</label>
                                  <div className="flex flex-wrap gap-2">
                                    {['Pre-Seed', 'Seed', 'Series A', 'Series B', 'SME'].map(s => (
                                        <button 
                                          key={s} 
                                          onClick={() => {
                                            const next = investorProfile.stages.includes(s) ? investorProfile.stages.filter(x => x !== s) : [...investorProfile.stages, s];
                                            setInvestorProfile({...investorProfile, stages: next});
                                          }}
                                          className={`px-3 py-2 rounded-lg text-[10px] font-black border transition-all ${investorProfile.stages.includes(s) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#050505] border-white/10 text-zinc-500 hover:border-white/20'}`}
                                        >
                                          {s}
                                        </button>
                                    ))}
                                  </div>
                              </div>

                              <div className="mt-8">
                                  <label className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2 block">Ticket Size Range</label>
                                  <div className="flex flex-col gap-6 p-6 border border-white/10 bg-[#050505] rounded-xl">
                                      <div className="flex items-center gap-4">
                                        <span className="text-xs text-zinc-500 font-bold w-12">Min</span>
                                        <input type="range" min="10000" max="5000000" step="10000" value={investorProfile.ticketSizeRange?.min || 50000} onChange={e => setInvestorProfile({...investorProfile, ticketSizeRange: {...investorProfile.ticketSizeRange, min: Number(e.target.value)}})} className="w-full accent-blue-600" />
                                        <span className="text-sm font-bold text-white w-20 text-right">${Number(investorProfile.ticketSizeRange?.min).toLocaleString()}</span>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <span className="text-xs text-zinc-500 font-bold w-12">Max</span>
                                        <input type="range" min="50000" max="25000000" step="50000" value={investorProfile.ticketSizeRange?.max || 2000000} onChange={e => setInvestorProfile({...investorProfile, ticketSizeRange: {...investorProfile.ticketSizeRange, max: Number(e.target.value)}})} className="w-full accent-blue-600" />
                                        <span className="text-sm font-bold text-white w-20 text-right">${Number(investorProfile.ticketSizeRange?.max).toLocaleString()}</span>
                                      </div>
                                  </div>
                              </div>

                              <div className="mt-8">
                                  <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-4 block">Risk Tolerance</label>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase">Conservative</span>
                                    <span className="text-[10px] text-blue-400 font-bold uppercase">{investorProfile.riskTolerance}</span>
                                    <span className="text-[10px] text-zinc-600 font-bold uppercase">Aggressive</span>
                                  </div>
                                  <input 
                                    type="range" min="1" max="10" 
                                    value={investorProfile.riskTolerance === 'Conservative' ? 2 : investorProfile.riskTolerance === 'Balanced' ? 5 : 8} 
                                    onChange={(e) => {
                                      let val = 'Balanced';
                                      if (e.target.value < 4) val = 'Conservative';
                                      if (e.target.value > 7) val = 'Aggressive';
                                      setInvestorProfile({...investorProfile, riskTolerance: val});
                                    }} 
                                    className="w-full h-1.5 bg-[#050505] rounded-full appearance-none accent-blue-600 cursor-pointer border border-white/10" 
                                  />
                              </div>
                           </div>
                       )}

                       {onboardingStep === 3 && (
                           <div className="space-y-6 animate-in slide-in-from-right-4">
                              <h3 className="text-xl font-bold text-white mb-2">Background & Intent</h3>
                              <p className="text-zinc-500 text-sm mb-8">What do you bring to the table besides capital?</p>
                              
                              <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Notable Portfolio Companies</label>
                                 <input type="text" value={investorProfile.portfolio.join(', ')} onChange={e => setInvestorProfile({...investorProfile, portfolio: e.target.value.split(', ')})} placeholder="Comma separated..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" />
                              </div>
                              <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Businesses Owned (Optional)</label>
                                 <input type="text" value={investorProfile.businessesOwned} onChange={e => setInvestorProfile({...investorProfile, businessesOwned: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" />
                              </div>
                              <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Notable Successes (Optional)</label>
                                 <input type="text" value={investorProfile.successes} onChange={e => setInvestorProfile({...investorProfile, successes: e.target.value})} placeholder="e.g. Exited StartupX at 5x multiple" className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" />
                              </div>

                              <h4 className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-2 mt-8 border-b border-white/10 pb-2">Strategic Intent</h4>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Investment Horizon</label>
                                    <select value={investorProfile.horizon} onChange={e => setInvestorProfile({...investorProfile, horizon: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50">
                                        <option>Short-Term Returns</option><option>Long-Term Growth</option><option>Evergreen</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Involvement Desired</label>
                                    <select value={investorProfile.involvementDesired} onChange={e => setInvestorProfile({...investorProfile, involvementDesired: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50">
                                        <option>Silent / Capital Only</option><option>Low (Quarterly Updates)</option><option>High (Board Seat / Advisory)</option>
                                    </select>
                                  </div>
                              </div>
                           </div>
                       )}

                       {onboardingStep === 4 && (
                           <div className="space-y-6 animate-in slide-in-from-right-4">
                              <h3 className="text-xl font-bold text-white mb-2">Build Trust</h3>
                              <p className="text-zinc-500 text-sm mb-8">Verified investors unlock top-tier startup dealflow instantly.</p>
                              
                              <div className="space-y-4">
                                   <div className="p-4 bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-between">
                                       <div>
                                           <div className="text-sm font-bold text-white flex items-center gap-2"><User className="w-4 h-4 text-zinc-500"/> Identity Verification</div>
                                           <div className="text-[10px] text-zinc-500 mt-1">Govt ID & Selfie</div>
                                       </div>
                                       {investorProfile.verification.identity === 'verified' ? <Badge color="blue">Verified Badge</Badge> : <button className="px-4 py-2 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-lg hover:bg-blue-500/20">Verify</button>}
                                   </div>
                                   <div className="p-4 bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-between">
                                       <div>
                                           <div className="text-sm font-bold text-white flex items-center gap-2"><ClipboardList className="w-4 h-4 text-zinc-500"/> Financial Capability</div>
                                           <div className="text-[10px] text-zinc-500 mt-1">Proof of Funds or Accreditation</div>
                                       </div>
                                       {investorProfile.verification.financial === 'verified' ? <Badge color="blue">Accredited</Badge> : <button onClick={simulateUpload} disabled={isUploading} className="px-4 py-2 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-lg hover:bg-blue-500/20">{isUploading ? 'Scanning...' : 'Upload Docs'}</button>}
                                   </div>
                              </div>

                              <div className="mt-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex flex-col items-center justify-center">
                                  <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Investor Trust Score</div>
                                  <div className="text-4xl font-black text-white">{investorProfile.trustScore}/100</div>
                              </div>
                           </div>
                       )}
                       
                       {/* Controls */}
                       <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
                           {onboardingStep > 1 ? (
                               <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="px-6 py-3 border border-white/10 rounded-xl text-zinc-400 font-bold text-sm hover:text-white flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
                           ) : <div></div>}
                           
                           {onboardingStep < 4 ? (
                               <button onClick={() => setOnboardingStep(onboardingStep + 1)} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2">Next <ChevronRight className="w-4 h-4"/></button>
                           ) : (
                               <button onClick={() => { handleSubmitProfile(); setOnboardingStep(1); }} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-xl shadow-white/10 transition-all flex items-center gap-2 text-xs">Complete Radar Build <CheckCircle2 className="w-4 h-4"/></button>
                           )}
                       </div>
                    </div>
                  </div>
               )}

               {/* DEAL RADAR */}
               {activeTab === 'radar' && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4 pb-20">
                     {!investorSelectedDeal ? (
                        <>
                           <div className="p-6 bg-blue-500/5 border border-blue-500/15 rounded-3xl mb-8 flex items-center gap-4">
                             <SearchCode className="w-8 h-8 text-blue-500 shrink-0" />
                             <p className="text-sm text-zinc-300 leading-relaxed"><span className="text-blue-400 font-bold">Standardized Radar:</span> Profiles are parsed into strict AI structural limits. No biased pitch decks, just performance variables.</p>
                           </div>

                           <div className="flex items-center justify-between mb-4">
                               <h3 className="text-white font-bold text-lg">Top Market Alignments</h3>
                               <button onClick={() => setSavedMatches([])} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/5"><RefreshCw className="w-3.5 h-3.5"/> Reweigh Radar</button>
                           </div>

                           {topMatches.length === 0 ? (
                               <div className="text-center py-20 text-zinc-500">No new deals match your strict thesis filters.</div>
                           ) : (
                               <div className="space-y-8">
                                 {topMatches.map(founder => {
                                   const comp = calculateCompatibility(founder, investorProfile);
                                   return (
                                     <div key={founder.id} className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden group">
                                         
                                        {/* Action Header */}
                                        <div className="flex justify-end gap-3 mb-6 relative z-10">
                                            <button onClick={() => setSavedMatches([...savedMatches, founder.id])} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${savedMatches.includes(founder.id) ? 'bg-blue-500/20 text-blue-500' : 'bg-black border border-white/10 text-zinc-400 hover:text-white'}`}>
                                                <Bookmark className={`w-4 h-4 ${savedMatches.includes(founder.id) ? 'fill-current' : ''}`} />
                                            </button>
                                            <button onClick={() => setSkippedMatches([...skippedMatches, founder.id])} className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-colors">
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                            {/* Left Info Side */}
                                            <div className="flex-1 border-r border-white/5 pr-8">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-white font-black text-xl shrink-0">
                                                        {founder.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-black text-2xl leading-none mb-1.5 flex items-center gap-2">
                                                            {founder.name}
                                                            {founder.verified && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                        </h4>
                                                        <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                            {founder.sector} • {founder.stage}
                                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px]">Trust: {founder.trustScore}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest block mb-1">Fundraising</span>
                                                        <span className="text-white text-lg font-black">${Number(founder.capitalRequired || 0).toLocaleString()} <span className="text-[10px] text-zinc-500">/ {founder.equityOffered}% Eq</span></span>
                                                    </div>
                                                    <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                                                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest block mb-1">Risk Profile (AI)</span>
                                                        <div className="text-emerald-500 font-bold uppercase tracking-widest text-[10px] mt-2">{founder.financialConfidence || 'Calculated AI'}</div>
                                                    </div>
                                                </div>

                                                <button onClick={() => setInvestorSelectedDeal(founder)} className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-colors flex items-center justify-center gap-2">
                                                    + Plus More
                                                </button>
                                            </div>

                                            {/* Right Metric Side - No Percentage Match Combine */}
                                            <div className="w-full md:w-64 shrink-0">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                                                    <BarChart3 className="w-4 h-4"/> Radar Parameters
                                                </div>
                                                <div className="space-y-5 mb-8">
                                                    {[
                                                        { label: 'Sector Proximity', val: comp.sectorAlignment || 88, color: 'blue' },
                                                        { label: 'Capital Feasibility', val: comp.capitalFit || 94, color: 'emerald' },
                                                        { label: 'Growth Stage Match', val: comp.stageCompatibility || 82, color: 'violet' },
                                                        { label: 'Risk/Reward Target', val: comp.riskAlignment || 78, color: 'orange' }
                                                    ].map((m, i) => (
                                                        <div key={i}>
                                                            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-1.5 text-zinc-400">
                                                                <span>{m.label}</span>
                                                                <span className="text-white">{m.val}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                                                                <div className={`h-full bg-${m.color}-500`} style={{width: `${m.val}%`}}></div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs text-zinc-400 font-medium leading-relaxed">
                                                    <strong>The Fit:</strong> {founder.name}'s capital requirement aligns securely with your portfolio threshold. Stage scaling matches intended thesis perfectly.
                                                </div>
                                            </div>
                                        </div>
                                     </div>
                                   );
                                 })}
                               </div>
                           )}
                           <div className="h-20 shrink-0"></div>
                        </>
                     ) : (
                       <div className="space-y-8 animate-in slide-in-from-right-4 pb-20">
                          <div className="flex justify-between items-center">
                              <button onClick={() => setInvestorSelectedDeal(null)} className="text-zinc-500 hover:text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                                 <ChevronLeft className="w-4 h-4" /> Radar Scope
                              </button>
                             {savedMatches.includes(investorSelectedDeal.id) ? <Badge color="blue">Deal Saved in Registry</Badge> : null}
                          </div>
                          
                           <div className="bg-white rounded-[32px] p-8 md:p-12 text-black shadow-xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-100 rotate-12 -translate-y-32 translate-x-32 group-hover:bg-blue-50 transition-colors duration-700"></div>
                             
                             <div className="flex items-start justify-between mb-10 relative z-10">
                                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-lg">{investorSelectedDeal.name.charAt(0)}</div>
                                <div className="text-right">
                                   <div className="flex items-center justify-end gap-1 text-xs text-zinc-400 font-bold uppercase tracking-widest mb-2">
                                     {investorSelectedDeal.verified ? <><ShieldCheck className="w-3.5 h-3.5 text-blue-500"/> Verified Business</> : 'Pending Verification'}
                                   </div>
                                    {savedMatches.includes(investorSelectedDeal.id) ? (
                                       <button onClick={() => setSavedMatches(savedMatches.filter(id => id !== investorSelectedDeal.id))} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">Remove from Registry</button>
                                    ) : (
                                       <button onClick={() => setSavedMatches([...savedMatches, investorSelectedDeal.id])} className="text-[10px] font-bold text-white bg-black px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors">Save to Registry</button>
                                    )}
                                </div>
                             </div>

                             <h4 className="text-3xl font-black mb-1 relative z-10">{investorSelectedDeal.name}</h4>
                             <div className="text-sm text-zinc-500 font-bold uppercase tracking-widest mb-10 flex items-center gap-2 relative z-10">
                                <MapPin className="w-4 h-4 text-blue-500"/> {investorSelectedDeal.city}, {investorSelectedDeal.country} • <span className="bg-zinc-100 px-2 py-0.5 rounded">{investorSelectedDeal.sector}</span> • <span className="bg-zinc-100 px-2 py-0.5 rounded">{investorSelectedDeal.stage}</span>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10 border-t border-b border-zinc-100 py-8">
                                <div>
                                   <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Capital Block Ask</div>
                                   <div className="text-3xl font-black">${Number(investorSelectedDeal.capitalRequired).toLocaleString()}</div>
                                </div>
                                <div>
                                   <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1">Equity Dilution</div>
                                   <div className="text-3xl font-black">{investorSelectedDeal.equityOffered}%</div>
                                </div>
                                <div className="border-l border-zinc-100 pl-6">
                                   <div className="text-[10px] text-zinc-400 uppercase font-black tracking-widest mb-1 text-emerald-500">Platform Trust Rating</div>
                                   <div className="text-3xl font-black text-emerald-600">{investorSelectedDeal.trustScore}/100</div>
                                </div>
                             </div>

                              <div className="relative z-10 mb-8">
                                 <h5 className="text-[10px] font-black text-black uppercase tracking-widest mb-3">Core Value Prop</h5>
                                 <p className="text-base text-zinc-600 leading-relaxed max-w-2xl">{investorSelectedDeal.pitch}</p>
                              </div>
                           </div>

                            {!premiumUnlocked ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
                                     <div className="mb-10 p-6 bg-[#111] rounded-[24px] border border-blue-500/20 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                                       <div className="absolute right-0 top-0 w-32 h-32 bg-blue-600/10 rotate-45 -translate-y-10 translate-x-10"></div>
                                       <div className="relative z-10 mb-6">
                                         <h5 className="text-sm font-black text-white mb-1 uppercase tracking-widest flex items-center gap-2"><Lock className="w-4 h-4 text-blue-500"/> Connect & Analyze (Level 2)</h5>
                                         <p className="text-xs text-zinc-500 max-w-sm">Deeper AI market insights and meeting booking features are secured.</p>
                                       </div>
                                       <button onClick={() => setPremiumUnlocked(true)} className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-blue-500/20 shrink-0 relative z-10">
                                         Unlock Premium ($75)
                                       </button>
                                     </div>
                                     <div className="mb-10 p-8 bg-[#111] rounded-[24px] border border-emerald-500/20">
                                         <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Zap className="w-4 h-4"/> Initiate Deal</h5>
                                         <button onClick={() => { setActiveTab('chat'); setSyncedChat([]); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                                             <MessageSquare className="w-4 h-4"/> Open Secure Chat
                                         </button>
                                         <p className="text-[9px] text-zinc-500 text-center font-bold">Free Feature: Basic Chat is Unlocked</p>
                                     </div>
                                </div>
                             ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4">
                                     <div className="mb-10 p-8 bg-[#111] rounded-[24px] border border-white/5">
                                        <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 flex items-center gap-2"><BarChart3 className="w-4 h-4"/> AI Market Vector</h5>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Estimated Market Scope</div>
                                                <div className="text-sm font-bold text-white">{investorSelectedDeal.marketSize || '$4.2B LATAM Market'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Disruption Strategy</div>
                                                <div className="text-sm font-bold text-white">{investorSelectedDeal.uvp || 'Decentralized nodes bypassing legacy structures'}</div>
                                            </div>
                                        </div>
                                     </div>
                                     <div className="mb-10 p-8 bg-[#111] rounded-[24px] border border-emerald-500/20">
                                         <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Zap className="w-4 h-4"/> Initiate Deal</h5>
                                         <button onClick={() => { setActiveTab('chat'); setSyncedChat([]); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                                             <MessageSquare className="w-4 h-4"/> Open Secure Channel
                                         </button>
                                         <p className="text-[9px] text-zinc-500 text-center font-bold">Encrypted End-to-End Environment</p>
                                     </div>
                                </div>
                             )}

                       </div>
                     )}
                  </div>
               )}

              {/* MATCH L2 */}
              {activeTab === 'vision' && (
                 <div className="space-y-8 animate-in slide-in-from-right-4 pb-20 mt-8">
                    {!premiumUnlocked ? (
                      <div className="bg-[#111] p-10 rounded-[40px] border border-blue-500/20 shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
                          <h3 className="text-3xl font-black text-white mb-3 tracking-tight relative z-10">Unlock Matchmaking L2</h3>
                          <p className="text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed relative z-10 font-medium">
                            Premium for founders — input your capital breakdown and AI generates a cash flow projection, best/worst case, and funding feedback.
                          </p>
                          <div className="space-y-3 w-full max-w-sm mx-auto mb-10 relative z-10">
                              <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex items-center gap-3 text-left">
                                 <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                 <span className="text-sm text-zinc-300 font-medium tracking-wide">AI Fund Allocation Simulator</span>
                              </div>
                              <div className="bg-black/50 border border-white/5 p-4 rounded-xl flex items-center gap-3 text-left">
                                 <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                                 <span className="text-sm text-zinc-300 font-medium tracking-wide">Predictive Runway Consequences</span>
                              </div>
                          </div>
                      </div>
                    ) : (
                      <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center justify-center min-h-[50vh]">
                         <BarChart3 className="w-16 h-16 text-blue-500 mb-4 opacity-50" />
                         <h3 className="text-2xl font-bold text-white mb-2">Investor Vision Dashboard</h3>
                         <p className="text-zinc-500 text-sm">You have unlocked premium L2 features. Full analytics suite coming soon.</p>
                      </div>
                    )}
                 </div>
              )}

              {/* ECOSYSTEM */}
              {activeTab === 'ecosystem' && (
                <div className="flex flex-col items-center py-20 text-center animate-in fade-in duration-1000 mt-8">
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-500 mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                     <Users className="w-10 h-10 mb-1" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">The Global Startup Ecosystem</h3>
                  <p className="text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                    Looking ahead: tracking your accepted startups, analytics, and comprehensive emerging market thesis discovery.
                  </p>
                  <Badge color="blue">Coming Soon</Badge>
                </div>
              )}

               {/* CHAT */}
               {activeTab === 'chat' && (
                 <div className="flex flex-col h-[75vh] bg-[#111] overflow-hidden border border-white/5 rounded-3xl shadow-2xl relative">
                  {contactWarning && (
                      <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white text-xs font-bold p-3 rounded-lg flex items-center gap-2 z-50 animate-in slide-in-from-top-2 shadow-xl">
                        <AlertCircle className="w-4 h-4" /> Sharing contact details via chat is prohibited to ensure platform security.
                      </div>
                  )}

                  <div className="p-5 bg-black/40 border-b border-white/5 flex items-center gap-4 backdrop-blur-md z-10 shrink-0">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-bold text-white text-lg shadow-inner">
                           {founderProfile.name ? founderProfile.name.charAt(0) : 'E'}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#111] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-base">{founderProfile.name}</h4>
                        <div className="text-[11px] text-zinc-400 font-medium">Founder is Online</div>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest my-4">Connection Secured</p>
                      {syncedChat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'investor' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                              <div className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20 shadow-inner">{msg.text}</div>
                            ) : (
                              <div className={`max-w-[80%] p-4 text-sm rounded-2xl shadow-md ${msg.sender === 'investor' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-[#222] text-zinc-200 border border-white/5 rounded-tl-sm'}`}>
                                  {msg.text}
                              </div>
                            )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-black/40 border-t border-white/5 shrink-0 flex items-center gap-3">
                      <input 
                        type="text" 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message to the founder..." 
                        className="flex-1 bg-[#222] text-white text-sm px-6 py-4 rounded-xl outline-none focus:ring-1 focus:ring-blue-500/50"
                      />
                      <button onClick={handleSend} className="w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white transition-all shadow-lg shrink-0">
                        <Send className="w-5 h-5 ml-1" />
                      </button>
                  </div>
                </div>
              )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDashboard;

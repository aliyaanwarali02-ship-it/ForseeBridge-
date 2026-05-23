import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  User, Layout, Zap, MessageSquare, BarChart3, Users,
  Bell, LogOut, Award, CheckCircle2, AlertCircle, Bot,
  Mail, Phone, FileSignature, MapPin, ClipboardList,
  FileText, Upload, Plus, Trash2, Calendar, Send, Lock,
  ChevronRight, ChevronLeft, Bookmark, XCircle, RefreshCw
} from 'lucide-react';

const FounderDashboard = () => {
  const navigate = useNavigate();
  const { 
    role, logout, founderProfile, setFounderProfile,
    financialAssets, setFinancialAssets, credibility, setCredibility,
    isUploading, simulateUpload, aiSuggestions, strength,
    premiumUnlocked, setPremiumUnlocked, syncedChat, setSyncedChat,
    MATCHED_INVESTORS, founderNotify, containsContactInfo,
    calculateCompatibility
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [contactWarning, setContactWarning] = useState(false);
  const [showMeetingPopup, setShowMeetingPopup] = useState(null);
  const [allocation, setAllocation] = useState({ hiring: 40, marketing: 20, technology: 30, ops: 10 });
  const [visionMode, setVisionMode] = useState('idle');
  const [visionResults, setVisionResults] = useState(null);
  const [savedMatches, setSavedMatches] = useState([]);
  const [skippedMatches, setSkippedMatches] = useState([]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (role !== 'founder') navigate('/login');
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
    setSyncedChat(prev => [...prev, { sender: 'founder', text: chatInput }]);
    setChatInput('');
  };

  const handleTestDecision = () => {
    setVisionMode('analyzing');
    setTimeout(() => {
        let runway = 12, risk = 'Low', riskMsg = 'Healthy distribution of capital.', growthMsg = 'Steady growth with balanced risk exposure.';
        if (allocation.hiring > 45) { runway = 6; risk = 'High'; riskMsg = 'Labor costs will rapidly drain cash reserves.'; growthMsg = 'Accelerates team scaling but jeopardizes operational survival.'; }
        else if (allocation.marketing > 40) { runway = 8; risk = 'Medium'; riskMsg = 'High reliance on customer acquisition efficiency.'; growthMsg = 'Drives fast top-line growth if conversion channels are proven.'; }
        setVisionResults({ runway, risk, riskMsg, growthMsg });
        setVisionMode('results');
    }, 1500);
  };

  const connectWithInvestor = (inv) => {
    setActiveTab('chat');
    setSyncedChat(prev => {
        if(prev.length === 0) return [{ sender: 'system', text: `Match established with ${inv.name}. Open direct line.` }];
        return prev;
    });
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
        setActiveTab('matches');
    }, 2000);
  };

  const sidebarLinks = [
    { id: 'onboarding', label: 'Profile Setup', icon: Layout },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'matches', label: 'Match L1', icon: Zap },
    { id: 'chat', label: 'Basic Chat', icon: MessageSquare },
    { id: 'vision', label: 'Match L2', icon: BarChart3 },
    { id: 'cofounder', label: 'Ecosystem', icon: Users }
  ];

  if (role !== 'founder') return null;

  const topMatches = MATCHED_INVESTORS.filter(i => !skippedMatches.includes(i.id)).slice(0, 3);

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
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 inline-block">
               Founder Portal
            </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {sidebarLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === link.id 
                  ? 'bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] text-white' 
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 shrink-0 bg-[#0a0a0a]">
           <h2 className="text-xl font-bold">{sidebarLinks.find(l => l.id === activeTab)?.label}</h2>
           <div className="flex items-center gap-4">
             {founderNotify && (
               <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-xs font-bold animate-pulse cursor-pointer" onClick={() => setActiveTab('chat')}>
                 <Bell className="w-3.5 h-3.5" /> {founderNotify.title}
               </div>
             )}
             <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-600/30">
               {founderProfile.name ? founderProfile.name.charAt(0) : 'F'}
             </div>
           </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 relative bg-[#050505]">
           <div className="max-w-4xl mx-auto">
             
             {/* SETUP / ONBOARDING */}
             {activeTab === 'onboarding' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                  {/* Progress Bar */}
                  <div className="flex items-center justify-between mb-8">
                     {[1,2,3,4].map(step => (
                        <div key={step} className="flex flex-col items-center flex-1 relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all font-bold ${onboardingStep === step ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : onboardingStep > step ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-500' : 'bg-white/5 text-zinc-500 border border-white/10'}`}>
                                {onboardingStep > step ? <CheckCircle2 className="w-5 h-5"/> : step}
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-3 absolute top-12 whitespace-nowrap">
                                {step === 1 ? 'Basic Info' : step === 2 ? 'Deets' : step === 3 ? 'Traction' : 'Verify'}
                            </div>
                            {step < 4 && <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0 ${onboardingStep > step ? 'bg-emerald-500/30' : 'bg-white/5'}`}></div>}
                        </div>
                     ))}
                  </div>
                  <div className="h-4"></div>

                  <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {onboardingStep === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                           <h3 className="text-xl font-bold text-white mb-2">Let's start with the basics</h3>
                           <p className="text-zinc-500 text-sm mb-8">This information creates the foundation of your startup profile.</p>
                           <div>
                               <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Company Name</label>
                               <input type="text" value={founderProfile.name} onChange={e => setFounderProfile({...founderProfile, name: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all" />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">HQ City</label>
                                 <input type="text" value={founderProfile.city} onChange={e => setFounderProfile({...founderProfile, city: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all" />
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Country</label>
                                 <input type="text" value={founderProfile.country} onChange={e => setFounderProfile({...founderProfile, country: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all" />
                               </div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Sector</label>
                                 <select value={founderProfile.sector} onChange={e => setFounderProfile({...founderProfile, sector: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all">
                                     <option>Clean Energy</option><option>Agri-Tech</option><option>Fintech</option><option>SME</option><option>DeepTech</option>
                                 </select>
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Stage</label>
                                 <select value={founderProfile.stage} onChange={e => setFounderProfile({...founderProfile, stage: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all">
                                     <option>Idea</option><option>MVP</option><option>Early Revenue</option><option>Scaling</option>
                                 </select>
                               </div>
                           </div>
                           <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Product/Service Description</label>
                                <textarea value={founderProfile.description} onChange={e => setFounderProfile({...founderProfile, description: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-20 no-scrollbar" placeholder="What does your product do?" />
                           </div>
                        </div>
                    )}

                    {onboardingStep === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                           <h3 className="text-xl font-bold text-white mb-2">Deepen Your Business Profile</h3>
                           <p className="text-zinc-500 text-sm mb-8">These advanced inputs strictly improve AI matchmaking quality.</p>
                           <div className="grid grid-cols-2 gap-6">
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Business Model</label>
                                 <input type="text" value={founderProfile.model} onChange={e => setFounderProfile({...founderProfile, model: e.target.value})} placeholder="B2B SaaS, Marketplace..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all" />
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Mission & Vision</label>
                                 <input type="text" value={founderProfile.mission} onChange={e => setFounderProfile({...founderProfile, mission: e.target.value})} placeholder="Our mission is to..." className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 transition-all" />
                               </div>
                           </div>
                           <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Problem Being Solved</label>
                                <textarea value={founderProfile.problem} onChange={e => setFounderProfile({...founderProfile, problem: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-20" placeholder="Clear statement of the problem..." />
                           </div>
                           <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Unique Value Proposition (UVP)</label>
                                <textarea value={founderProfile.uvp} onChange={e => setFounderProfile({...founderProfile, uvp: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-20" placeholder="What makes it different?" />
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Target Market</label>
                                 <input type="text" value={founderProfile.targetMarket} onChange={e => setFounderProfile({...founderProfile, targetMarket: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Market Size</label>
                                 <input type="text" value={founderProfile.marketSize} onChange={e => setFounderProfile({...founderProfile, marketSize: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                               </div>
                           </div>
                           <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Competitive Landscape</label>
                                <input type="text" value={founderProfile.competitors} onChange={e => setFounderProfile({...founderProfile, competitors: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none flex-1 focus:border-emerald-500/50" placeholder="Main competitors..." />
                           </div>
                        </div>
                    )}

                    {onboardingStep === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                           <h3 className="text-xl font-bold text-white mb-2">Traction & Ask</h3>
                           <p className="text-zinc-500 text-sm mb-8">What have you achieved and what are you looking for?</p>
                           
                           <h4 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2 mt-4 border-b border-white/10 pb-2">Metrics</h4>
                           <div className="grid grid-cols-3 gap-4">
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Users / MO.</label>
                                 <input type="number" value={founderProfile.monthlyUsers} onChange={e => setFounderProfile({...founderProfile, monthlyUsers: Number(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Growth Rate (%)</label>
                                 <input type="number" value={founderProfile.growthRate} onChange={e => setFounderProfile({...founderProfile, growthRate: Number(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Retention (%)</label>
                                 <input type="number" value={founderProfile.retentionRate} onChange={e => setFounderProfile({...founderProfile, retentionRate: Number(e.target.value)})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                               </div>
                           </div>

                           <h4 className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2 mt-8 border-b border-white/10 pb-2">The Ask</h4>
                           <div>
                                <label className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2 block text-emerald-500">Capital Required: ${Number(founderProfile.capitalRequired).toLocaleString()}</label>
                                <input type="range" min="10000" max="10000000" step="50000" value={founderProfile.capitalRequired} onChange={e => setFounderProfile({...founderProfile, capitalRequired: e.target.value})} className="w-full accent-emerald-500" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Preferred Investor</label>
                                 <select value={founderProfile.preferredInvestor} onChange={e => setFounderProfile({...founderProfile, preferredInvestor: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50">
                                     <option>Strategic</option><option>Hands-on</option><option>Silent</option>
                                 </select>
                               </div>
                               <div>
                                 <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Timeline</label>
                                 <select value={founderProfile.fundingTimeline} onChange={e => setFounderProfile({...founderProfile, fundingTimeline: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50">
                                     <option>Urgent</option><option>Flexible</option><option>Long-term</option>
                                 </select>
                               </div>
                           </div>
                           <div>
                                <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">The Pitch Narrative</label>
                                <textarea value={founderProfile.pitch} onChange={e => setFounderProfile({...founderProfile, pitch: e.target.value})} className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-32 no-scrollbar" placeholder="Write in your own words..." />
                                <div className="flex justify-between mt-2 px-1">
                                   <span className="text-[9px] text-zinc-600 font-bold uppercase">{founderProfile.pitch.split(' ').filter(x => x.length > 0).length} words</span>
                                   <span className={`text-[9px] font-bold uppercase ${founderProfile.pitch.length < 500 ? 'text-red-500' : 'text-emerald-500'}`}>
                                      AI Evaluation: {founderProfile.pitch.length < 500 ? 'Too weak or less engaging' : 'Strong and engaging'}
                                   </span>
                                </div>
                                <div className="mt-4 p-4 bg-[#111] border border-dashed border-white/10 rounded-xl flex items-center gap-3">
                                   <Upload className="w-5 h-5 text-zinc-500 shrink-0" />
                                   <div>
                                      <div className="text-xs text-zinc-400 font-bold mb-0.5">Upload Pitch Deck <span className="text-zinc-600 font-normal">(Optional)</span></div>
                                      <div className="text-[10px] text-zinc-600">PowerPoint or PDF — AI evaluates clarity & highlights weak areas</div>
                                   </div>
                                   <button className="ml-auto text-xs font-bold text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg hover:bg-blue-500/10 transition-all whitespace-nowrap">Browse</button>
                                </div>
                           </div>
                        </div>
                    )}

                    {onboardingStep === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                           <h3 className="text-xl font-bold text-white mb-2">Build Trust & Credibility</h3>
                           <p className="text-zinc-500 text-sm mb-8">Verified profiles earn a higher Trust Score & Match preference.</p>
                           
                           <div className="space-y-4">
                                <div className="p-4 bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-white flex items-center gap-2"><User className="w-4 h-4 text-zinc-500"/> Identity Verification</div>
                                        <div className="text-[10px] text-zinc-500 mt-1">Govt ID & Live Selfie required</div>
                                    </div>
                                    {founderProfile.verification.identity === 'verified' ? <Badge color="emerald">Verified</Badge> : <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg hover:bg-emerald-500/20">Verify</button>}
                                </div>
                                <div className="p-4 bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-white flex items-center gap-2"><ClipboardList className="w-4 h-4 text-zinc-500"/> Business Verification</div>
                                        <div className="text-[10px] text-zinc-500 mt-1">Trade License / Registration docs</div>
                                    </div>
                                    {founderProfile.verification.business === 'verified' ? <Badge color="emerald">Verified</Badge> : <button className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg hover:bg-emerald-500/20">Upload Trade Lic.</button>}
                                </div>
                                <div className="p-4 bg-[#050505] border border-white/10 rounded-2xl flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-bold text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-zinc-500"/> Financial Confidence</div>
                                        <div className="text-[10px] text-zinc-500 mt-1">Bank statements or verified audits</div>
                                    </div>
                                    {founderProfile.verification.financial === 'verified' ? <Badge color="emerald">Verified</Badge> : <button onClick={simulateUpload} disabled={isUploading} className="px-4 py-2 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-lg hover:bg-emerald-500/20">{isUploading ? 'Scanning...' : 'Verify Finance'}</button>}
                                </div>
                           </div>

                           <div className="mt-8 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex flex-col items-center justify-center">
                               <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Current Trust Score</div>
                               <div className="text-4xl font-black text-white">{founderProfile.trustScore}/100</div>
                           </div>
                        </div>
                    )}
                    
                    <div className="flex justify-between mt-10 pt-6 border-t border-white/5">
                        {onboardingStep > 1 ? (
                            <button onClick={() => setOnboardingStep(onboardingStep - 1)} className="px-6 py-3 border border-white/10 rounded-xl text-zinc-400 font-bold text-sm hover:text-white flex items-center gap-2"><ChevronLeft className="w-4 h-4"/> Back</button>
                        ) : <div></div>}
                        
                        {onboardingStep < 4 ? (
                            <button onClick={() => setOnboardingStep(onboardingStep + 1)} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2">Next <ChevronRight className="w-4 h-4"/></button>
                        ) : (
                            <button onClick={() => { handleSubmitProfile(); setOnboardingStep(1); }} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl shadow-xl shadow-white/10 transition-all flex items-center gap-2 text-xs">Verify & Complete <CheckCircle2 className="w-4 h-4"/></button>
                        )}
                    </div>
                  </div>
                </div>
             )}

              {/* PROFILE OVERVIEW */}
             {activeTab === 'profile' && (
                <div className="space-y-8 animate-in slide-in-from-right-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#111] p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Bot className="w-16 h-16" /></div>
                        <h3 className="text-blue-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Bot className="w-4 h-4"/> AI Profile Critique</h3>
                        <div className="space-y-3 relative z-10">
                          {aiSuggestions.map(s => (
                              <div key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border leading-relaxed text-sm ${s.type === 'warning' ? 'bg-red-500/5 border-red-500/20 text-red-200' : 'bg-blue-500/5 border-blue-500/20 text-blue-200'}`}>
                                {s.type === 'warning' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" /> : <Bot className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />}
                                <span>{s.text}</span>
                              </div>
                          ))}
                        </div>
                    </div>
                    <div className="bg-[#111] p-6 rounded-3xl border border-white/5 shadow-2xl">
                        <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">Credibility & Verification</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-white"><User className="w-4 h-4 text-emerald-500"/> Identity Check</div>
                              {founderProfile.verification.identity === 'verified' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Badge>Pending</Badge>}
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-white"><ClipboardList className="w-4 h-4 text-zinc-500"/> Business Status</div>
                              {founderProfile.verification.business === 'verified' ? <Badge color="emerald">Registered Business</Badge> : <Badge>Pending Reg</Badge>}
                          </div>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-sm text-white"><BarChart3 className="w-4 h-4 text-zinc-500"/> Financial Confidence: <span className="text-blue-400 font-bold ml-1">{founderProfile.financialConfidence}</span></div>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* Investor Facing Preview */}
                  <div className="bg-white rounded-[32px] p-8 md:p-12 text-black shadow-2xl relative overflow-hidden group mt-8 mt-12">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-zinc-100 rotate-12 -translate-y-24 translate-x-16 group-hover:bg-emerald-50 transition-colors duration-500"></div>
                    <div className="flex items-start justify-between mb-10 relative z-10">
                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl">{founderProfile.name.charAt(0)}</div>
                        <div className="text-right">
                          <h4 className="text-2xl font-bold leading-none mb-2">{founderProfile.name}</h4>
                          <div className="text-zinc-500 text-xs uppercase font-bold tracking-widest mb-4 flex items-center justify-end gap-1"><MapPin className="w-3.5 h-3.5"/> {founderProfile.city}, {founderProfile.country}</div>
                          <Badge color="blue">{founderProfile.stage}</Badge>
                        </div>
                    </div>
                    <div className="mb-10 relative z-10">
                        <div className="text-zinc-400 text-xs uppercase font-bold tracking-widest mb-2">Fundraising Status</div>
                        <div className="text-5xl font-black mb-2">${Number(founderProfile.capitalRequired).toLocaleString()}</div>
                        <div className="text-sm text-zinc-500 font-medium italic">for {founderProfile.equityOffered}% Equity</div>
                    </div>
                  </div>

                  {/* Validate profile changes -> Submit */}
                  <div className="pt-4 flex justify-between gap-4">
                     <button onClick={() => setActiveTab('onboarding')} className="px-6 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-colors flex-1 text-center text-zinc-400 text-sm">Edit Onboarding Setup</button>
                      
                    {profileSubmitted ? (
                      <div className="flex-1 flex flex-col items-center justify-center py-4 px-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in fade-in duration-300">
                        <span className="text-emerald-400 font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Live & Visible</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleSubmitProfile}
                        className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-xl shadow-xl shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs"
                      >
                        <FileSignature className="w-4 h-4" /> Save & Launch Profile
                      </button>
                    )}
                  </div>
                </div>
             )}

             {/* MATCHES (LEVEL 1) */}
             {activeTab === 'matches' && (
                <div className="space-y-6 animate-in fade-in pb-20">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                      <div>
                          <h3 className="text-xl font-bold text-white mb-2">Top AI Recommended Matches</h3>
                          <p className="text-sm text-zinc-500">Structured metric alignments based on your explicit onboarding limits.</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setSavedMatches([])} className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/5"><RefreshCw className="w-3.5 h-3.5"/> Redo Matching</button>
                      </div>
                  </div>

                  {topMatches.length === 0 ? (
                      <div className="text-center py-20 text-zinc-500">No more matches found in queue.</div>
                  ) : (
                      <div className="grid grid-cols-1 gap-8">
                        {topMatches.map(inv => {
                            const comp = calculateCompatibility(founderProfile, inv);
                            return (
                                <div key={inv.id} className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-emerald-500/20 transition-all shadow-2xl relative overflow-hidden group">
                                    {/* Action Header */}
                                    <div className="flex justify-end gap-3 mb-6 relative z-10">
                                        <button onClick={() => setSavedMatches([...savedMatches, inv.id])} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${savedMatches.includes(inv.id) ? 'bg-blue-500/20 text-blue-500' : 'bg-black border border-white/10 text-zinc-400 hover:text-white'}`}>
                                            <Bookmark className={`w-4 h-4 ${savedMatches.includes(inv.id) ? 'fill-current' : ''}`} />
                                        </button>
                                        <button onClick={() => setSkippedMatches([...skippedMatches, inv.id])} className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:border-red-500/30 transition-colors">
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                        {/* Left Side: Detail */}
                                        <div className="flex-1 border-r border-white/5 pr-8">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`w-16 h-16 rounded-2xl bg-${inv.color}-500/10 border border-${inv.color}-500/20 flex items-center justify-center text-${inv.color}-500 font-black text-xl shrink-0`}>
                                                    {inv.avatar}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-black text-2xl leading-none mb-1.5 flex items-center gap-2">
                                                    {inv.name}
                                                    {inv.verified && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                                                    </h4>
                                                    <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                                    {inv.type} • {inv.country}
                                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px]">Trust: {inv.trustScore}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mb-6">
                                                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">Why this match fits</div>
                                                <p className="text-sm font-medium text-zinc-300 leading-relaxed p-4 bg-black/40 rounded-xl border border-white/5">
                                                    {inv.name} has a strong history in {inv.sectors[0]} investments and their ticket size closely aligns with your $500k ask. Their focus on {inv.focus} perfectly matches your current trajectory.
                                                </p>
                                            </div>

                                            <div className="flex gap-4">
                                                <button onClick={() => connectWithInvestor(inv)} className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2">
                                                    <MessageSquare className="w-4 h-4"/> Connect
                                                </button>
                                                {premiumUnlocked ? (
                                                <button onClick={() => setShowMeetingPopup(inv.id)} className="flex-1 py-3 bg-black border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl hover:border-white/30 transition-colors flex items-center justify-center gap-2">
                                                    <Calendar className="w-4 h-4"/> Book Meeting
                                                </button>
                                                ) : (
                                                <button onClick={() => setActiveTab('vision')} className="flex-1 py-3 bg-black/50 border border-blue-500/30 text-blue-400 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-blue-500/10 transition-colors flex items-center justify-center gap-2">
                                                    <Lock className="w-3.5 h-3.5"/> L2 to Book
                                                </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Side: Metrics Breakdown No Single Overall Score */}
                                        <div className="w-full md:w-64 shrink-0">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-6 flex items-center gap-2">
                                                <BarChart3 className="w-4 h-4"/> Metric Breakdown
                                            </div>
                                            <div className="space-y-5">
                                                {[
                                                    { label: 'Sector Alignment', val: comp.sectorAlignment, color: 'blue' },
                                                    { label: 'Capital Fit', val: comp.capitalFit, color: 'emerald' },
                                                    { label: 'Stage Match', val: comp.stageCompatibility, color: 'violet' },
                                                    { label: 'Strategic Alignment', val: comp.strategicFit, color: 'orange' }
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
                                            
                                            {!premiumUnlocked && (
                                                <div className="mt-8 p-3 rounded-xl border border-white/10 bg-white/5 text-center group-hover:border-blue-500/30 transition-colors">
                                                    <div className="text-[10px] font-bold text-zinc-400 mb-2">Want deeper reasoning & risk profiling?</div>
                                                    <button onClick={() => setActiveTab('vision')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:underline">Unlock L2 Analysis</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                      </div>
                  )}
                </div>
             )}

             {/* CHAT */}
             {activeTab === 'chat' && (
                <div className="flex flex-col h-[75vh] bg-[#111] overflow-hidden border border-white/5 rounded-3xl shadow-2xl relative">
                  {contactWarning && (
                      <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white text-xs font-bold p-3 rounded-lg flex items-center gap-2 z-50 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4" /> Sharing contact details via chat is prohibited to ensure platform security. Use the 'Book Meeting' feature instead.
                      </div>
                  )}

                  <div className="p-4 bg-black/40 border-b border-white/5 flex items-center gap-3 backdrop-blur-md z-10 shrink-0">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-500">AC</div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#111] rounded-full"></div>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">Apex Capital</h4>
                        <div className="text-[10px] text-zinc-400 font-medium">Online</div>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest my-4">Connection Secured</p>
                      {syncedChat.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'founder' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                              <div className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20 shadow-inner">{msg.text}</div>
                            ) : (
                              <div className={`max-w-[80%] p-3 text-sm rounded-2xl shadow-md ${msg.sender === 'founder' ? 'bg-emerald-600 text-white rounded-tr-sm' : 'bg-[#222] text-zinc-200 border border-white/5 rounded-tl-sm'}`}>
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
                        placeholder="Type a message..." 
                        className="flex-1 bg-[#222] text-white text-sm px-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-emerald-500/50"
                      />
                      <button onClick={handleSend} className="w-12 h-12 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-white transition-all shadow-lg shrink-0">
                        <Send className="w-5 h-5 ml-1" />
                      </button>
                  </div>
                </div>
             )}

             {/* MATCH L2 */}
             {activeTab === 'vision' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 pb-20">
                   {!premiumUnlocked ? (
                      <div className="bg-[#111] p-10 rounded-[40px] border border-blue-500/20 shadow-2xl text-center flex flex-col items-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rotate-12 -translate-y-32 translate-x-32"></div>
                          <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 relative z-10">
                            <Zap className="w-10 h-10 text-blue-500" />
                          </div>
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
                          <button onClick={() => setPremiumUnlocked(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 px-14 rounded-2xl shadow-2xl shadow-blue-600/40 transition-all flex items-center gap-3 relative z-10 active:scale-95 uppercase tracking-widest text-xs">
                             Invest in Access – $75
                          </button>
                      </div>
                   ) : (
                      <div className="space-y-6">
                          <div className="bg-[#111] border border-white/5 rounded-3xl p-8 shadow-2xl">
                            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3"><Zap className="w-5 h-5 text-blue-500"/> Financial Decision Engine</h3>
                            <p className="text-sm text-zinc-400 mb-8 leading-relaxed">Analyze your funding ask against industry norms and project runway impacts with scenario analysis.</p>
                            
                            <div className="space-y-10 mb-10">
                                {['hiring', 'marketing', 'technology', 'ops'].map(dept => (
                                  <div key={dept}>
                                      <div className="flex justify-between mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <span>{dept} Allocation</span>
                                        <span className="text-blue-400">{allocation[dept]}%</span>
                                      </div>
                                      <input type="range" min="0" max="100" value={allocation[dept]} onChange={e => setAllocation({...allocation, [dept]: Number(e.target.value)})} className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                                  </div>
                                ))}
                            </div>
                            <button onClick={handleTestDecision} className="w-full py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] uppercase tracking-widest text-xs">
                               Generate Scenario Analysis
                            </button>
                          </div>

                          {visionResults && (
                              <div className="bg-[#111] p-8 rounded-3xl border border-blue-500/20 animate-in slide-in-from-bottom-4 shadow-2xl">
                                <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-8">AI Projection & Scenario Analysis</h3>
                                
                                <div className="grid grid-cols-2 gap-6 mb-10">
                                   <div className="bg-black/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                                     <div className="text-[10px] font-bold text-zinc-600 uppercase mb-3 tracking-widest">Projected Runway</div>
                                     <div className="text-4xl font-black text-white">{visionResults.runway} <span className="text-xs text-zinc-500 font-medium">months</span></div>
                                   </div>
                                   <div className="bg-black/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                                     <div className="text-[10px] font-bold text-zinc-600 uppercase mb-3 tracking-widest">Risk Profile</div>
                                     <div className={`text-2xl font-black ${visionResults.risk === 'High' ? 'text-red-500' : visionResults.risk === 'Medium' ? 'text-yellow-500' : 'text-emerald-500'}`}>{visionResults.risk}</div>
                                   </div>
                                </div>

                                <div className="space-y-6">
                                   <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                                      <div className="text-[10px] text-zinc-500 uppercase font-black mb-4 tracking-widest">Scenario Analysis</div>
                                      <div className="grid grid-cols-3 gap-4">
                                         {[
                                           { label: 'Worst Case', val: '4 Months', color: 'red' },
                                           { label: 'Expected', val: '12 Months', color: 'blue' },
                                           { label: 'Best Case', val: '18 Months', color: 'emerald' }
                                         ].map(s => (
                                           <div key={s.label} className="text-center">
                                              <div className="text-[8px] font-bold text-zinc-600 uppercase mb-1">{s.label}</div>
                                              <div className={`text-xs font-black text-${s.color}-500`}>{s.val}</div>
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20 text-sm">
                                     <strong className="text-red-400 block mb-2 text-xs font-black uppercase tracking-widest flex items-center gap-2"><AlertCircle className="w-4 h-4"/> Risk Consequence</strong>
                                     <span className="text-zinc-300 leading-relaxed font-medium">{visionResults.riskMsg}</span>
                                   </div>
                                   <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 text-sm">
                                     <strong className="text-emerald-400 block mb-2 text-xs font-black uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Growth Opportunity</strong>
                                     <span className="text-zinc-300 leading-relaxed font-medium">{visionResults.growthMsg}</span>
                                   </div>
                                </div>
                              </div>
                           )}
                      </div>
                   )}
                </div>
             )}

             {/* COFOUNDER / VISION */}
             {activeTab === 'cofounder' && (
                <div className="flex flex-col items-center py-20 text-center animate-in fade-in duration-1000">
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center text-blue-500 mb-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                     <Users className="w-10 h-10 mb-1" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">The Global Startup Ecosystem</h3>
                  <p className="text-zinc-400 max-w-md mx-auto leading-relaxed mb-6">
                    Looking ahead: matching founders with technical co-founders and industry mentors to ensure ideas don't die in isolation.
                  </p>
                  <Badge color="blue">Coming in Phase 2</Badge>
                </div>
             )}

           </div>
        </div>
      </div>
    </div>
  );
};

export default FounderDashboard;

import React, { useState, useEffect, useRef } from 'react';
import Terms from './Terms';
import { 
  Home, Search, PieChart, User, Users, ChevronLeft, Bell, 
  BarChart3, CheckCircle2, AlertCircle, ShieldCheck, 
  Coins, TrendingUp, Cpu, X, SearchCode, MessageSquare,
  Send, Bot, ArrowRight, Activity, RefreshCw, Zap, Handshake, 
  FileSignature, Globe, Mail, Phone, Award, FileText, Layout,
  Briefcase, MapPin, Calendar, DollarSign, Percent, ClipboardList,
  Upload, Plus, Trash2, Building, ExternalLink, MoreVertical
} from 'lucide-react';

// --- DATA ---

const MATCHED_INVESTORS = [
  {
    id: 'inv1',
    name: 'Apex Capital',
    country: 'Singapore',
    focus: 'SaaS / Fintech',
    minTicket: '$100k',
    maxTicket: '$1.5M',
    match: 96,
    avatar: 'AC',
    color: 'blue'
  },
  {
    id: 'inv2',
    name: 'Meridian Ventures',
    country: 'UAE',
    focus: 'Impact / Emerging Markets',
    minTicket: '$250k',
    maxTicket: '$5M',
    match: 88,
    avatar: 'MV',
    color: 'emerald'
  },
  {
    id: 'inv3',
    name: 'NovaBridge Fund',
    country: 'UK',
    focus: 'Cross-border Trade',
    minTicket: '$50k',
    maxTicket: '$750k',
    match: 81,
    avatar: 'NB',
    color: 'violet'
  }
];

const TUTORIAL_STEPS = [
  {
    side: 'founder',
    title: 'Step 1 — Setup',
    desc: 'Input your company name, country, sector, stage, product, problem, vision, market size, projections, capital needed, and equity offered. No use of funds required.',
    emoji: '🏗️',
    action: { type: 'founder', tab: 'onboarding' }
  },
  {
    side: 'founder',
    title: 'Step 2 — AI Profile',
    desc: 'The AI converts your inputs into a clean, investor-ready profile. You write your own pitch — AI evaluates clarity and flags weak areas. It does not rewrite.',
    emoji: '🧠',
    action: { type: 'founder', tab: 'profile' }
  },
  {
    side: 'founder',
    title: 'Step 3 — Matchmaking L1',
    desc: 'AI matches you with top investors based on sector, stage, and growth alignment — fully metrics-based, not opinion-based. Connect via in-platform chat.',
    emoji: '🎯',
    action: { type: 'founder', tab: 'matches' }
  },
  {
    side: 'both',
    title: 'Step 4 — Chat',
    desc: 'Secure in-platform messaging. Book a meeting directly. Contact details (email/phone) are blocked — all communication stays inside Foresee Bridge.',
    emoji: '💬',
    action: { type: 'both' }
  },
  {
    side: 'founder',
    title: 'Step 5 — Matchmaking L2 (Paid)',
    desc: 'Upgrade to input your capital allocation. AI generates cash flow projections, best/worst case scenarios, and funding feedback.',
    emoji: '💡',
    action: { type: 'founder', tab: 'vision' }
  },
  {
    side: 'investor',
    title: 'Step 6 — Investor View',
    desc: 'Investors see the full structured profile: product, market, projections, and the founder\'s original pitch. Free for investors — no subscription required.',
    emoji: '🌐',
    action: { type: 'investor', tab: 'radar', selectDeal: true }
  },
  {
    side: 'founder',
    title: 'Step 7 — Vision',
    desc: 'Beyond funding — co-founder discovery, mentorship matching, and the full startup ecosystem. Foresee Bridge is not just investor matching.',
    emoji: '🚀',
    action: { type: 'founder', tab: 'cofounder' }
  },
];

// --- COMPONENTS ---

const PhoneWrapper = ({ title, glowColor, children, tutorialActive }) => (
    <div className="flex flex-col items-center gap-4 shrink-0 transition-all duration-500">
        <div className={`text-${glowColor}-500 font-bold tracking-widest uppercase flex items-center gap-2 bg-${glowColor}-500/10 px-4 py-2 rounded-full border border-${glowColor}-500/20 transition-all duration-500 ${tutorialActive ? 'scale-105' : ''}`}>
           <span className="text-xs">{title}</span>
        </div>
        <div
          className={`w-[390px] h-[844px] bg-[#0c0c0c] rounded-[54px] border-[2px] shadow-[0_0_0_8px_#080808,0_0_0_10px_#1a1a1a,0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col scale-[0.70] sm:scale-[0.85] origin-top md:origin-center shrink-0 transition-all duration-500`}
          style={{
            borderColor: tutorialActive ? (glowColor === 'emerald' ? '#10b981' : '#3b82f6') : '#1f1f1f',
            boxShadow: tutorialActive
              ? `0 0 0 8px #080808, 0 0 0 10px #1a1a1a, 0 20px 60px rgba(0,0,0,0.8), 0 0 40px 4px ${glowColor === 'emerald' ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.25)'}`
              : undefined,
          }}
        >
            {/* Dynamic Island */}
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-[20px] z-[100] flex items-center justify-end pr-[10px] gap-1 shadow-md">
               <div className={`w-2.5 h-2.5 rounded-full bg-${glowColor}-500 shadow-[0_0_6px_var(--tw-shadow-color)] shadow-${glowColor}-500`}></div>
            </div>
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-[60px] z-[99] flex items-start justify-between px-[28px] pt-[16px] text-[12px] font-semibold text-white pointer-events-none">
                <span>9:41</span>
                <div className="flex gap-[6px] items-center text-zinc-400">
                    <span>WiFi</span>
                    <span>🔋</span>
                </div>
            </div>
            {children}
        </div>
    </div>
);

const AuthScreen = ({ type, onLogin }) => {
  const isFounder = type === 'founder';
  const glowHex = isFounder ? '#10b981' : '#3b82f6';
  const btnColor = isFounder ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500';
  const textClr = isFounder ? 'text-emerald-500' : 'text-blue-500';

  return (
  <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#050505] animate-in slide-in-from-bottom-8 fade-in duration-700 pointer-events-auto">
     <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
        {isFounder ? <User className={`w-8 h-8 ${textClr}`} /> : <Briefcase className={`w-8 h-8 ${textClr}`} />}
     </div>
     <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
     <p className="text-zinc-500 text-sm mb-10 text-center px-4 leading-relaxed">
       {isFounder ? 'Building the future of global fundraising.' : 'Discovering verified emerging market alpha.'}
     </p>

     <div className="w-full space-y-4">
        <button onClick={onLogin} className={`w-full text-white font-bold py-3.5 rounded-xl transition-all ${btnColor}`}>
           Log In
        </button>
        <button onClick={onLogin} className="w-full bg-zinc-900 border border-white/10 hover:border-white/20 text-white font-bold py-3.5 rounded-xl transition-colors">
           Create Account
        </button>
     </div>
  </div>
  );
};

// --- MAIN APP ---

export default function MobileApp({ onClose }) {
  // SHARED STATE
  const [founderAuth, setFounderAuth] = useState(false);
  const [investorAuth, setInvestorAuth] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [syncedChat, setSyncedChat] = useState([]);
  const [introRender, setIntroRender] = useState(true);
  const [introVisible, setIntroVisible] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

  // Refs for Chat Auto-Scroll
  const founderEndRef = useRef(null);
  const investorEndRef = useRef(null);

  const scrollToBottom = () => {
    founderEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    investorEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [syncedChat]);

  useEffect(() => {
    // Shorter intro duration as requested: 1.2s reveal, then fade out
    const timer1 = setTimeout(() => setIntroVisible(false), 1200);
    const timer2 = setTimeout(() => setIntroRender(false), 1500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  // Tutorial Auto-Navigation
  useEffect(() => {
    if (tutorialStep === -1) return;
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step.action) return;

    if (step.action.type === 'founder') {
      setFounderAuth(true);
      setFounderTab(step.action.tab);
    } else if (step.action.type === 'investor') {
      setInvestorAuth(true);
      setInvestorTab(step.action.tab);
      if (step.action.selectDeal) setInvestorSelectedDeal(founderProfile);
      else setInvestorSelectedDeal(null);
    } else if (step.action.type === 'both') {
      setFounderAuth(true);
      setInvestorAuth(true);
      setFounderTab('chat');
      setInvestorTab('chat');
      if (syncedChat.length === 0) {
        setSyncedChat([{ sender: 'system', text: 'Tutorial: Secure match established. Direct line active.' }]);
      }
    }
  }, [tutorialStep]);
  
  // FOUNDER STATE
  const [founderTab, setFounderTab] = useState('onboarding'); // 'onboarding', 'profile', 'matches', 'chat'
  const [founderProfile, setFounderProfile] = useState({
    name: 'EcoEnergy Brazil',
    logo: null,
    city: 'São Paulo',
    country: 'Brazil',
    sector: 'Clean Energy',
    stage: 'Startup',
    description: 'Decentralized solar micro-grids for off-grid industrial communities.',
    problem: 'High cost and unreliability of main grid power in rural industrial zones.',
    targetMarket: 'Remote mining and agricultural hubs.',
    marketSize: '$4.2B addressing market',
    yearsOperating: '2',
    capitalRequired: 500000,
    equityOffered: 15,
    useOfFunds: 'Scaling hardware production and expanding to 3 new regions.',
    pitch: 'We have already deployed 12 nodes with 98% uptime. Our goal is to become the leading provider of decentralized industrial power in the LATAM region by 2027.'
  });
  const [financialAssets, setFinancialAssets] = useState([
    { id: 1, name: 'Q4_Revenue_Statement.pdf', verified: true },
    { id: 2, name: '2024_P_L_Projections.xlsx', verified: false }
  ]);
  const [credibility, setCredibility] = useState({ 
    email: true, 
    phone: false, 
    documents: true 
  });
  const [isUploading, setIsUploading] = useState(false);
  const [founderChatInput, setFounderChatInput] = useState('');
  
  // VISION STATE
  const [visionUnlocked, setVisionUnlocked] = useState(false);
  const [allocation, setAllocation] = useState({ hiring: 40, marketing: 20, technology: 30, ops: 10 });
  const [visionMode, setVisionMode] = useState('idle'); // 'idle', 'analyzing', 'results'
  const [visionResults, setVisionResults] = useState(null);

  const handleTestDecision = () => {
    setVisionMode('analyzing');
    setTimeout(() => {
        let runway = 12;
        let risk = 'Low';
        let riskMsg = 'Healthy distribution of capital across functional areas.';
        let growthMsg = 'Steady growth with balanced risk exposure.';

        if (allocation.hiring > 45) {
            runway = 6;
            risk = 'High';
            riskMsg = 'Labor costs will rapidly drain cash reserves.';
            growthMsg = 'Accelerates team scaling but jeopardizes operational survival.';
        } else if (allocation.marketing > 40) {
            runway = 8;
            risk = 'Medium';
            riskMsg = 'High reliance on customer acquisition efficiency.';
            growthMsg = 'Drives fast top-line growth if conversion channels are proven.';
        } else if (allocation.technology > 45) {
            runway = 9;
            risk = 'Medium';
            riskMsg = 'Heavy R&D delays go-to-market speed.';
            growthMsg = 'Builds strong product moat but delays short-term revenue.';
        } else if (allocation.ops > 40) {
            runway = 14;
            risk = 'Low';
            riskMsg = 'Over-indexed on ops; may underinvest in growth.';
            growthMsg = 'Highly stable but slower expected valuation growth.';
        }

        setVisionResults({ runway, risk, riskMsg, growthMsg });
        setVisionMode('results');
    }, 1500);
  };
  
  // INVESTOR STATE
  const [investorTab, setInvestorTab] = useState('radar'); // 'radar', 'portfolio', 'chat'
  const [investorSelectedDeal, setInvestorSelectedDeal] = useState(null);
  const [investorChatInput, setInvestorChatInput] = useState('');
  const [contactWarning, setContactWarning] = useState(null); // 'founder' | 'investor' | null
  const [showMeetingPopup, setShowMeetingPopup] = useState(null); // investor id or null

  // Notification States
  const [founderNotify, setFounderNotify] = useState(null);
  const [investorNotify, setInvestorNotify] = useState(null);

  const triggerNotify = (side, msg) => {
    if (side === 'founder') {
      setFounderNotify(msg);
      setTimeout(() => setFounderNotify(null), 3000);
    } else {
      setInvestorNotify(msg);
      setTimeout(() => setInvestorNotify(null), 3000);
    }
  };

  // AI Feedbacks (Simulated)
  const [aiSuggestions, setAiSuggestions] = useState([
    { id: 1, type: 'warning', text: 'Pitch length is slightly under the recommended minimum.' },
    { id: 2, type: 'tip', text: 'Consider adding more detail to the Target Market section.' }
  ]);

  // Profile Strength (Dummy calculation)
  const strength = Math.min(
    (founderProfile.name ? 5 : 0) + 
    (founderProfile.description ? 10 : 0) + 
    (founderProfile.pitch ? 15 : 0) + 
    (credibility.email ? 10 : 0) + 
    (credibility.phone ? 10 : 0) + 
    (credibility.documents ? 20 : 0) + 
    (financialAssets.length * 15), 
    100
  );

  // --- HELPERS ---
  const containsContactInfo = (text) => {
    const emailRx = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
    const phoneRx = /(\+?\d[\d\s\-(). ]{6,}\d)/;
    return emailRx.test(text) || phoneRx.test(text);
  };

  // --- ACTIONS ---

  const handleFounderSend = () => {
    if (!founderChatInput.trim()) return;
    if (containsContactInfo(founderChatInput)) {
      setContactWarning('founder');
      setTimeout(() => setContactWarning(null), 3500);
      return;
    }
    setSyncedChat(prev => [...prev, { sender: 'founder', text: founderChatInput }]);
    if (investorTab !== 'chat') {
        triggerNotify('investor', { 
            title: 'New Message', 
            body: `${founderProfile.name}: ${founderChatInput}` 
        });
    }
    setFounderChatInput('');
  };

  const handleInvestorSend = () => {
    if (!investorChatInput.trim()) return;
    if (containsContactInfo(investorChatInput)) {
      setContactWarning('investor');
      setTimeout(() => setContactWarning(null), 3500);
      return;
    }
    setSyncedChat(prev => [...prev, { sender: 'investor', text: investorChatInput }]);
    if (founderTab !== 'chat') {
        triggerNotify('founder', { 
            title: 'New Message from Investor', 
            body: investorChatInput 
        });
    }
    setInvestorChatInput('');
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
        setFinancialAssets(prev => [...prev, { id: Date.now(), name: 'New_Financial_Report.pdf', verified: false }]);
        setIsUploading(false);
    }, 1500);
  };

  const connectWithInvestor = (inv) => {
    setFounderTab('chat');
    setSyncedChat([{ sender: 'system', text: `Match established with ${inv.name}. Open direct line.` }]);
  };

  // --- RENDERING HELPERS ---

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

  const NotificationBanner = ({ notify, color, onAction }) => {
    if (!notify) return null;
    return (
      <div onClick={onAction} className="absolute top-[68px] left-4 right-4 z-[110] bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300 cursor-pointer hover:bg-zinc-800 transition-colors">
         <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-${color}-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-${color}-600/20`}>
               <MessageSquare className="w-4 h-4 fill-current" />
            </div>
            <div className="flex-1 overflow-hidden">
               <div className="text-white text-[11px] font-bold leading-tight">{notify.title}</div>
               <div className="text-zinc-500 text-[10px] leading-tight truncate mt-0.5">{notify.body}</div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505]/95 backdrop-blur-3xl flex flex-col items-center justify-start xl:justify-center p-4 overflow-y-auto no-scrollbar pt-24 xl:pt-4 selection:bg-blue-500/30 selection:text-blue-200">

      {/* --- TOP HEADER --- */}
      <div className="absolute top-0 left-0 right-0 px-8 py-6 grid grid-cols-3 items-center z-50">
         <div className="text-white font-black text-xl tracking-tighter flex items-center gap-2">
             <img src="/logo.png" alt="Foresee Bridge" className="w-8 h-8" style={{filter:'invert(1)'}} />
             <span className="hidden sm:inline">FORESEE <span className="text-blue-500 font-light">BRIDGE</span></span>
         </div>

         <div className="flex justify-center">
           <button onClick={() => setTutorialStep(0)} className="group relative flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-full border border-white/10 transition-all active:scale-95">
             <span className="text-blue-500 group-hover:animate-pulse">✨</span> Start Flow Tutorial
           </button>
         </div>

         <div className="flex justify-end">
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all">
                <X className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* --- TUTORIAL TOOLTIP --- */}
      {tutorialStep >= 0 && (() => {
        const step = TUTORIAL_STEPS[tutorialStep];
        const color = step.side === 'founder' ? '#10b981' : step.side === 'investor' ? '#3b82f6' : '#a855f7';
        return (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-64 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
               <Badge color={step.side === 'founder' ? 'emerald' : step.side === 'investor' ? 'blue' : 'violet'}>{step.side}</Badge>
               <span className="text-zinc-600 text-[10px] font-mono">{tutorialStep + 1}/{TUTORIAL_STEPS.length}</span>
            </div>
            <div className="text-2xl mb-2">{step.emoji}</div>
            <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
            <p className="text-zinc-500 text-[11px] leading-relaxed mb-4">{step.desc}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setTutorialStep(s => Math.max(0, s-1))} 
                disabled={tutorialStep === 0}
                className="flex-1 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-bold disabled:opacity-30"
              >Back</button>
              <button 
                onClick={() => tutorialStep < TUTORIAL_STEPS.length - 1 ? setTutorialStep(s => s+1) : setTutorialStep(-1)}
                className="flex-1 py-1.5 rounded-lg bg-white text-black text-xs font-bold"
              >
                {tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-24 w-full pb-20 mt-10 xl:mt-0">
          
          {/* ========================================================= */}
          {/* FOUNDER PHONE */}
          {/* ========================================================= */}
          <PhoneWrapper title="Founder Interface" glowColor="emerald" tutorialActive={tutorialStep >= 0 && TUTORIAL_STEPS[tutorialStep].side !== 'investor'}>
              
              <NotificationBanner notify={founderNotify} color="emerald" onAction={() => setFounderTab('chat')} />

              {/* Founder Intro Overlay */}
              {introRender && (
                 <div className={`absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${introVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                    <img src="/logo.png" alt="Foresee Bridge" className="w-20 h-20 mb-6 animate-pulse" style={{filter:'invert(1) sepia(1) saturate(3) hue-rotate(100deg)'}} />
                    <h1 className="text-emerald-500 font-black text-4xl tracking-widest uppercase mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">FORESEE</h1>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2 px-4 py-1.5">Global Founder</p>
                 </div>
              )}

              {!founderAuth && !introRender && <AuthScreen type="founder" onLogin={() => setFounderAuth(true)} />}
              
              {/* FOUNDER APP CONTENT */}
              {founderAuth && (
                 <div className="flex-1 flex flex-col pt-16 bg-[#0c0c0c] overflow-hidden">
                    
                    {/* Founder Tabs */}
                    <div className="px-6 flex items-center justify-between mb-2">
                       <h2 className="text-white font-bold text-lg">Foresee Bridge</h2>
                       <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-zinc-500" />
                       </button>
                    </div>

                    <div className="px-6 flex gap-4 border-b border-white/5 overflow-x-auto no-scrollbar shrink-0">
                       {[
                          { id: 'onboarding', label: 'Profile Setup', icon: Layout },
                          { id: 'profile', label: 'Profile', icon: User },
                          { id: 'matches', label: 'Match L1', icon: Zap },
                          { id: 'chat', label: 'Basic Chat', icon: MessageSquare },
                          { id: 'vision', label: 'Match L2', icon: BarChart3 },
                          { id: 'cofounder', label: 'Ecosystem', icon: Users },
                        ].map(t => (
                         <button 
                          key={t.id} 
                          onClick={() => setFounderTab(t.id)}
                          className={`flex items-center gap-2 py-3 border-b-2 transition-all whitespace-nowrap ${founderTab === t.id ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-zinc-600 hover:text-zinc-400'}`}
                         >
                            <t.icon className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{t.label}</span>
                         </button>
                       ))}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                       
                       {/* 1. ONBOARDING / EDIT FORM */}
                       {founderTab === 'onboarding' && (
                          <div className="space-y-8 animate-in slide-in-from-bottom-4">
                             <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div>
                                   <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Profile Strength</div>
                                   <div className="text-xl font-bold text-white">{strength}%</div>
                                </div>
                                <div className="w-16 h-16 relative flex items-center justify-center">
                                   <svg className="w-full h-full -rotate-90">
                                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-white/10" />
                                      <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={176} strokeDashoffset={176 - (176 * strength) / 100} className="text-emerald-500 transition-all duration-1000" />
                                   </svg>
                                   <Award className="absolute w-6 h-6 text-emerald-500/40" />
                                </div>
                             </div>

                             <div className="space-y-5">
                                 <div>
                                   <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Company Name</label>
                                   <input type="text" value={founderProfile.name} onChange={e => setFounderProfile({...founderProfile, name: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">HQ City</label>
                                      <input type="text" value={founderProfile.city} onChange={e => setFounderProfile({...founderProfile, city: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                   </div>
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Country</label>
                                      <input type="text" value={founderProfile.country} onChange={e => setFounderProfile({...founderProfile, country: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Sector</label>
                                      <select value={founderProfile.sector} onChange={e => setFounderProfile({...founderProfile, sector: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50">
                                         <option>Clean Energy</option>
                                         <option>Agri-Tech</option>
                                         <option>Fintech</option>
                                         <option>SME</option>
                                         <option>Other</option>
                                      </select>
                                   </div>
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Stage</label>
                                      <select value={founderProfile.stage} onChange={e => setFounderProfile({...founderProfile, stage: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50">
                                         <option>Idea</option>
                                         <option>Startup</option>
                                         <option>SME</option>
                                         <option>Scale-up</option>
                                      </select>
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Years Operating</label>
                                      <input type="text" value={founderProfile.yearsOperating} onChange={e => setFounderProfile({...founderProfile, yearsOperating: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                   </div>
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Equity Offered (%)</label>
                                      <input type="number" value={founderProfile.equityOffered} onChange={e => setFounderProfile({...founderProfile, equityOffered: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                   </div>
                                </div>
                                <div>
                                   <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block text-emerald-500">Capital Required: ${Number(founderProfile.capitalRequired).toLocaleString()}</label>
                                   <input type="range" min="10000" max="10000000" step="50000" value={founderProfile.capitalRequired} onChange={e => setFounderProfile({...founderProfile, capitalRequired: e.target.value})} className="w-full accent-emerald-500" />
                                </div>
                                <div>
                                   <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Product/Service Description</label>
                                   <textarea value={founderProfile.description} onChange={e => setFounderProfile({...founderProfile, description: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-20 no-scrollbar" placeholder="Describe what you do..." />
                                </div>
                                <div>
                                   <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Problem Being Solved</label>
                                   <textarea value={founderProfile.problem} onChange={e => setFounderProfile({...founderProfile, problem: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-20 no-scrollbar" placeholder="Describe the problem..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Target Market</label>
                                      <input type="text" value={founderProfile.targetMarket} onChange={e => setFounderProfile({...founderProfile, targetMarket: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                   </div>
                                   <div>
                                      <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">Market Size (Optional)</label>
                                      <input type="text" value={founderProfile.marketSize} onChange={e => setFounderProfile({...founderProfile, marketSize: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50" />
                                   </div>
                                </div>
                                 <div>
                                    <label className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 block">The Pitch <span className="text-zinc-600 normal-case tracking-normal font-normal">(write in your own words)</span></label>
                                    <textarea value={founderProfile.pitch} onChange={e => setFounderProfile({...founderProfile, pitch: e.target.value})} className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-emerald-500/50 h-40 no-scrollbar" placeholder="Your full investor pitch — write it yourself. AI will evaluate, not rewrite." />
                                    <div className="flex justify-between mt-1 px-1">
                                       <span className="text-[9px] text-zinc-600 font-bold uppercase">{founderProfile.pitch.split(' ').filter(x => x.length > 0).length} words</span>
                                       <span className={`text-[9px] font-bold uppercase ${founderProfile.pitch.length < 500 ? 'text-red-500' : 'text-emerald-500'}`}>
                                          AI Evaluation: {founderProfile.pitch.length < 500 ? 'Too weak or less engaging' : 'Strong and engaging'}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="p-3 bg-[#1a1a1a] border border-dashed border-white/10 rounded-xl flex items-center gap-3">
                                    <Upload className="w-4 h-4 text-zinc-500 shrink-0" />
                                    <div>
                                       <div className="text-[10px] text-zinc-400 font-bold mb-0.5">Upload Pitch Deck <span className="text-zinc-600 font-normal">(Optional)</span></div>
                                       <div className="text-[9px] text-zinc-600">PowerPoint or PDF — AI evaluates clarity & highlights weak areas</div>
                                    </div>
                                    <button className="ml-auto text-[10px] font-bold text-blue-400 border border-blue-500/30 px-2 py-1 rounded-lg hover:bg-blue-500/10 transition-all whitespace-nowrap">Browse</button>
                                 </div>
                             </div>

                             <div className="pt-4 border-t border-white/5 pb-10">
                                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Financial Assets</h3>
                                <div className="space-y-3">
                                   {financialAssets.map(asset => (
                                      <div key={asset.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
                                         <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4 text-zinc-500" />
                                            <div>
                                               <div className="text-white text-[11px] font-medium leading-tight">{asset.name}</div>
                                               <div className="flex items-center gap-2 mt-0.5">
                                                  {asset.verified ? <Badge color="emerald">Verified</Badge> : <Badge>Pending</Badge>}
                                                  <span className="text-[9px] text-zinc-600 font-bold uppercase">Uploaded</span>
                                               </div>
                                            </div>
                                         </div>
                                         <button onClick={() => setFinancialAssets(prev => prev.filter(a => a.id !== asset.id))} className="text-zinc-700 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                                      </div>
                                   ))}
                                   <button onClick={simulateUpload} disabled={isUploading} className="w-full py-3 border border-dashed border-white/10 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest">
                                      {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                      {isUploading ? 'Uploading...' : 'Upload Financial Doc'}
                                   </button>
                                </div>
                             </div>
                          </div>
                       )}

                       {/* 2. PROFILE PREVIEW */}
                       {founderTab === 'profile' && (
                          <div className="space-y-6 animate-in slide-in-from-right-4">
                             {/* Credibility Badges & AI Feedback */}
                             <div className="space-y-4">
                               <div className="bg-[#151515] p-5 rounded-3xl border border-white/5 shadow-2xl overflow-hidden relative">
                                  <div className="absolute top-0 right-0 p-4 opacity-10"><Cpu className="w-12 h-12" /></div>
                                  <h3 className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-1.5"><Bot className="w-3.5 h-3.5"/> AI Profile Critique</h3>
                                  <div className="space-y-3">
                                     {aiSuggestions.map(s => (
                                        <div key={s.id} className={`flex items-start gap-3 p-3 rounded-xl border leading-relaxed text-xs ${s.type === 'warning' ? 'bg-red-500/5 border-red-500/20 text-red-100' : 'bg-blue-500/5 border-blue-500/20 text-blue-100'}`}>
                                           {s.type === 'warning' ? <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <Bot className="w-4 h-4 shrink-0 mt-0.5" />}
                                           <span>{s.text}</span>
                                        </div>
                                     ))}
                                  </div>
                               </div>

                               <div className="bg-[#1a1a1a]/50 p-5 rounded-3xl border border-white/5">
                                  <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4">Credibility Snapshot</h3>
                                  <div className="space-y-3">
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-white"><Mail className="w-3.5 h-3.5 text-emerald-500"/> Email Verified</div>
                                        {credibility.email ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <button className="text-[10px] text-zinc-500 font-bold underline">Verify</button>}
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-white"><Phone className="w-3.5 h-3.5 text-zinc-500"/> Phone Verified</div>
                                        {credibility.phone ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <button onClick={() => setCredibility({...credibility, phone: true})} className="text-[10px] text-blue-500 font-bold border border-blue-500/30 px-2 py-0.5 rounded-md hover:bg-blue-500/10">Verify Now</button>}
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-white"><FileSignature className="w-3.5 h-3.5 text-emerald-500"/> Documents KYC</div>
                                        {credibility.documents ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <button className="text-[10px] text-zinc-500 font-bold underline">Upload ID</button>}
                                     </div>
                                  </div>
                               </div>
                             </div>

                             {/* MAIN PROFILE CARD (INVESTOR FACING) */}
                             <div className="bg-white rounded-[32px] p-6 text-black shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-100 rotate-12 -translate-y-16 translate-x-16 group-hover:bg-blue-50 transition-colors"></div>
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                   <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">EE</div>
                                   <div className="text-right">
                                      <h4 className="text-lg font-bold leading-none mb-1">{founderProfile.name}</h4>
                                      <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-3 flex items-center justify-end gap-1"><MapPin className="w-2.5 h-2.5"/> {founderProfile.city}, {founderProfile.country}</div>
                                      <Badge color="blue">{founderProfile.stage}</Badge>
                                   </div>
                                </div>

                                <div className="mb-8 relative z-10">
                                   <div className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest mb-2">Fundraising Status</div>
                                   <div className="text-3xl font-black mb-1">${Number(founderProfile.capitalRequired).toLocaleString()}</div>
                                   <div className="text-xs text-zinc-500 font-medium italic">for {founderProfile.equityOffered}% Equity</div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                   <div>
                                      <h5 className="text-[10px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5"><ClipboardList className="w-3 h-3"/> The Vision</h5>
                                      <p className="text-xs leading-relaxed text-zinc-800 font-medium">{founderProfile.description}</p>
                                   </div>
                                   <div className="pt-4 border-t border-zinc-100">
                                      <h5 className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Financial Proof</h5>
                                      <div className="flex gap-2">
                                         {financialAssets.slice(0, 2).map(a => (
                                            <div key={a.id} className="px-3 py-2 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center gap-2">
                                               <FileText className="w-3 h-3 text-zinc-400" />
                                               <span className="text-[9px] font-bold text-zinc-700 max-w-[50px] truncate">{a.name}</span>
                                            </div>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                             </div>
                             <div className="h-20 shrink-0"></div>
                          </div>
                       )}

                        {/* 3. MATCHMAKING L1 */}
                        {founderTab === 'matches' && (
                           <div className="space-y-4 animate-in fade-in duration-500 pb-20">
                              <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl mb-2">
                                 <p className="text-[11px] text-zinc-400 leading-relaxed"><span className="text-emerald-400 font-bold">AI Matchmaking</span> is structured and metrics-based — it matchmakes using defined success indicators, not opinions.</p>
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                 <h3 className="text-white font-bold text-lg leading-none">Top Matches</h3>
                                 <Badge color="blue">Live Feed</Badge>
                              </div>
                              {MATCHED_INVESTORS.map(inv => (
                                 <div key={inv.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-5 hover:border-blue-500/30 transition-all">
                                    <div className="flex items-start justify-between mb-4">
                                       <div className="flex items-center gap-3">
                                          <div className={`w-12 h-12 rounded-xl bg-${inv.color}-500/10 border border-${inv.color}-500/20 flex items-center justify-center text-${inv.color}-500 font-black text-sm`}>
                                             {inv.avatar}
                                          </div>
                                          <div>
                                             <h4 className="text-white font-bold leading-tight">{inv.name}</h4>
                                             <div className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">{inv.country}</div>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <div className={`text-${inv.color}-400 font-black text-lg`}>{inv.match}%</div>
                                          <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Alignment</div>
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-5">
                                       <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                                          <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-0.5">Focus</span>
                                          <span className="text-zinc-300 text-[10px] font-medium leading-tight block">{inv.focus}</span>
                                       </div>
                                       <div className="bg-black/50 p-2.5 rounded-xl border border-white/5">
                                          <span className="text-[9px] text-zinc-600 font-bold uppercase block mb-0.5">Tickets</span>
                                          <span className="text-zinc-300 text-[10px] font-medium leading-tight block">{inv.minTicket} – {inv.maxTicket}</span>
                                       </div>
                                    </div>
                                    <div className="flex gap-2">
                                       <button onClick={() => connectWithInvestor(inv)} className={`flex-1 py-3 rounded-xl bg-${inv.color}-600 hover:bg-${inv.color}-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5`}>
                                          <MessageSquare className="w-3.5 h-3.5" /> Chat
                                       </button>
                                       <button onClick={() => setShowMeetingPopup(showMeetingPopup === inv.id ? null : inv.id)} className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:text-emerald-400 text-zinc-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                                          <Calendar className="w-3.5 h-3.5" /> Book Meeting
                                       </button>
                                    </div>
                                    {showMeetingPopup === inv.id && (
                                       <div className="mt-4 p-4 bg-[#111] border border-emerald-500/30 rounded-2xl animate-in slide-in-from-top-2 space-y-3">
                                          <h5 className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Book a Meeting</h5>
                                          <p className="text-[11px] text-zinc-400 leading-relaxed">Request a meeting with <strong className="text-white">{inv.name}</strong>. All communication stays inside the platform.</p>
                                          <div className="flex gap-2">
                                             <button onClick={() => { connectWithInvestor(inv); setShowMeetingPopup(null); }} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all">Confirm Request</button>
                                             <button onClick={() => { setShowMeetingPopup(null); setFounderTab('vision'); }} className="flex-1 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold hover:bg-blue-600/40 transition-all">Go to Match L2</button>
                                          </div>
                                          <button onClick={() => setShowMeetingPopup(null)} className="text-[9px] text-zinc-600 w-full text-center hover:text-zinc-400 mt-1">Cancel</button>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        )}
                       {/* MATCHMAKING LEVEL 2 */}
                       {founderTab === 'vision' && (
                          <div className="space-y-6 animate-in slide-in-from-right-4 pb-20">
                             {!visionUnlocked ? (
                                <div className="bg-[#151515] p-6 rounded-3xl border border-emerald-500/20 shadow-2xl text-center flex flex-col items-center animate-in slide-in-from-bottom-4 relative overflow-hidden">
                                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rotate-12 -translate-y-16 translate-x-16 pointer-events-none blur-2xl"></div>
                                   <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-white/5 relative z-10">
                                      <BarChart3 className="w-8 h-8 text-emerald-500" />
                                   </div>
                                   <h3 className="text-xl font-bold text-white mb-2 relative z-10">Unlock Matchmaking L2</h3>
                                   <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-light relative z-10">Premium for founders — input your capital breakdown and AI generates a cash flow projection, best/worst case, and funding feedback.</p>
                                   
                                   <div className="space-y-3 w-full mb-8 relative z-10">
                                      <div className="bg-black/50 border border-white/5 p-3 rounded-xl flex items-center gap-3 text-left">
                                         <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                         <span className="text-xs text-zinc-300 font-medium tracking-wide">AI Fund Allocation Simulator</span>
                                      </div>
                                      <div className="bg-black/50 border border-white/5 p-3 rounded-xl flex items-center gap-3 text-left">
                                         <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                         <span className="text-xs text-zinc-300 font-medium tracking-wide">Predictive Runway Consequences</span>
                                      </div>
                                   </div>
                                   
                                   <button onClick={() => setVisionUnlocked(true)} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm uppercase tracking-widest relative z-10 flex items-center justify-center gap-2">
                                      Upgrade for $75<span className="text-[10px] text-emerald-200 opacity-80 normal-case tracking-normal">/mo</span>
                                   </button>
                                </div>
                             ) : (
                                <>
                                   <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                                      <h3 className="text-emerald-400 font-bold text-xs flex items-center gap-2 mb-2"><Bot className="w-4 h-4" /> AI Fund Allocation Simulator</h3>
                                      <p className="text-[11px] text-emerald-100/70 leading-relaxed">Test how you plan to deploy capital. Our AI forecasts cash runway, evaluates operational risks, and projects growth viability before you pitch investors.</p>
                                   </div>

                                   <div className="space-y-5 bg-[#151515] p-5 rounded-3xl border border-white/5 shadow-2xl">
                                      <h4 className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2">Fund Allocation (%)</h4>
                                      
                                      {Object.entries(allocation).map(([key, value]) => (
                                         <div key={key}>
                                            <div className="flex justify-between text-xs mb-1.5">
                                               <span className="text-white capitalize font-medium">{key}</span>
                                               <span className="text-emerald-500 font-bold">{value}%</span>
                                            </div>
                                            <input 
                                               type="range" 
                                               min="0" max="100" 
                                               value={value} 
                                               onChange={e => {
                                                  const newVal = parseInt(e.target.value);
                                                  setAllocation(prev => ({ ...prev, [key]: newVal }));
                                                  setVisionMode('idle');
                                               }}
                                               className="w-full accent-emerald-500" 
                                            />
                                         </div>
                                      ))}

                                      <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                                         <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Total Allocation:</span>
                                            <span className={`font-bold ${Object.values(allocation).reduce((a,b)=>a+b,0) === 100 ? 'text-emerald-500' : 'text-red-500'}`}>
                                               {Object.values(allocation).reduce((a,b)=>a+b,0)}%
                                            </span>
                                         </div>
                                         {Object.values(allocation).reduce((a,b)=>a+b,0) !== 100 && (
                                             <span className="text-[10px] text-red-400 italic">Total must equal 100% to simulate.</span>
                                         )}
                                      </div>

                                      <button 
                                         onClick={handleTestDecision}
                                         disabled={visionMode === 'analyzing' || Object.values(allocation).reduce((a,b)=>a+b,0) !== 100}
                                         className="w-full py-3.5 bg-zinc-900 border border-white/10 hover:bg-emerald-600/20 hover:border-emerald-500/50 hover:text-emerald-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-4 shadow-xl"
                                      >
                                         {visionMode === 'analyzing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                                         {visionMode === 'analyzing' ? 'Running Sim...' : 'Test Decision'}
                                      </button>
                                   </div>

                                   {visionMode === 'results' && visionResults && (
                                      <div className="space-y-4 animate-in slide-in-from-bottom-4">
                                         <h4 className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest pl-2">AI Projection Consequences</h4>
                                         
                                         <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-[#1a1a1a]/50 p-4 rounded-2xl border border-white/5">
                                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><Clock className="w-3 h-3"/> Int. Runway</div>
                                                <div className={`text-2xl font-black ${visionResults.runway < 9 ? 'text-orange-400' : 'text-emerald-400'}`}>{visionResults.runway} mo</div>
                                            </div>
                                            <div className="bg-[#1a1a1a]/50 p-4 rounded-2xl border border-white/5">
                                                <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1.5 flex items-center gap-1.5"><AlertCircle className="w-3 h-3"/> Risk Signal</div>
                                                <div className={`text-xl font-black ${visionResults.risk === 'High' ? 'text-red-400' : visionResults.risk === 'Medium' ? 'text-orange-400' : 'text-emerald-400'}`}>{visionResults.risk}</div>
                                            </div>
                                         </div>

                                         <div className={`bg-${visionResults.risk === 'High' ? 'red' : visionResults.risk === 'Medium' ? 'orange' : 'emerald'}-500/5 border border-${visionResults.risk === 'High' ? 'red' : visionResults.risk === 'Medium' ? 'orange' : 'emerald'}-500/20 p-4 rounded-2xl flex items-start gap-3`}>
                                            <AlertCircle className={`w-5 h-5 shrink-0 text-${visionResults.risk === 'High' ? 'red' : visionResults.risk === 'Medium' ? 'orange' : 'emerald'}-500`} />
                                            <div>
                                               <h5 className="text-xs font-bold text-white mb-1">Risk Consequence</h5>
                                               <p className="text-[11px] text-zinc-400 leading-relaxed">{visionResults.riskMsg}</p>
                                            </div>
                                         </div>

                                         <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 shrink-0 text-blue-500" />
                                            <div>
                                               <h5 className="text-xs font-bold text-white mb-1">Growth Impact</h5>
                                               <p className="text-[11px] text-blue-100/70 leading-relaxed">{visionResults.growthMsg}</p>
                                            </div>
                                         </div>
                                   </div>
                                   )}
                                </>
                             )}
                          </div>
                        )}

                        {/* ECOSYSTEM TAB — Co-founder & Mentorship */}
                        {founderTab === 'cofounder' && (
                           <div className="space-y-6 animate-in slide-in-from-right-4 pb-20">
                              <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-2xl">
                                 <h3 className="text-violet-400 font-bold text-xs uppercase tracking-widest mb-1 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Ecosystem</h3>
                                 <p className="text-[11px] text-zinc-400 leading-relaxed">Beyond investor matching — connect with the right co-founders and mentors to build a stronger foundation.</p>
                              </div>

                              <div className="space-y-3">
                                 <h4 className="text-zinc-300 text-xs font-bold uppercase tracking-widest">Co-founder Matching</h4>
                                 {[
                                   { initials: 'AM', name: 'Amara Mensah', role: 'CTO / Engineering', match: 94, location: 'Lagos, Nigeria', badge: 'Technical' },
                                   { initials: 'RK', name: 'Ravi Krishnan', role: 'CMO / Growth', match: 87, location: 'Bangalore, India', badge: 'Growth' },
                                 ].map((p, i) => (
                                   <div key={i} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 hover:border-violet-500/30 transition-all">
                                      <div className="flex items-center gap-3 mb-3">
                                         <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-black text-sm">{p.initials}</div>
                                         <div className="flex-1">
                                            <div className="text-white font-bold text-sm leading-tight">{p.name}</div>
                                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{p.location}</div>
                                         </div>
                                         <div className="text-right">
                                            <div className="text-violet-400 font-black">{p.match}%</div>
                                            <div className="text-[9px] text-zinc-600 uppercase font-bold">Match</div>
                                         </div>
                                      </div>
                                      <div className="flex items-center justify-between">
                                         <Badge color="violet">{p.badge}</Badge>
                                         <span className="text-[10px] text-zinc-500 font-medium">{p.role}</span>
                                      </div>
                                   </div>
                                 ))}
                              </div>

                              <div className="space-y-3">
                                 <h4 className="text-zinc-300 text-xs font-bold uppercase tracking-widest">Mentorship Matching</h4>
                                 {[
                                   { initials: 'JO', name: 'James Okafor', expertise: 'Fundraising & VC Relations', years: '18y exp', badge: 'Mentor' },
                                   { initials: 'SP', name: 'Sofia Patel', expertise: 'Product Strategy & GTM', years: '12y exp', badge: 'Mentor' },
                                 ].map((m, i) => (
                                   <div key={i} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 hover:border-emerald-500/30 transition-all">
                                      <div className="flex items-center gap-3 mb-3">
                                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm">{m.initials}</div>
                                         <div className="flex-1">
                                            <div className="text-white font-bold text-sm leading-tight">{m.name}</div>
                                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">{m.years}</div>
                                         </div>
                                         <Badge color="emerald">{m.badge}</Badge>
                                      </div>
                                      <p className="text-[11px] text-zinc-400 leading-relaxed">{m.expertise}</p>
                                   </div>
                                 ))}
                              </div>

                              <div className="p-4 bg-[#111] border border-white/5 rounded-2xl">
                                 <div className="flex items-center justify-between mb-2">
                                     <h5 className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Platform Terms</h5>
                                     <button onClick={() => setShowTerms(true)} className="text-[10px] text-blue-500 font-bold hover:underline">View Full terms</button>
                                 </div>
                                 <ul className="space-y-1.5 text-[10px] text-zinc-600 leading-relaxed">
                                    <li>· Platform only matchmakes. No responsibility for outcomes or legal issues.</li>
                                    <li>· AI is metrics-based, not guaranteed. No certainty in matches.</li>
                                    <li>· Users are responsible for their own due diligence.</li>
                                    <li>· Do not share contact details (email, phone) inside chat.</li>
                                    <li>· Contact support if AI errors or pitch evaluation issues arise.</li>
                                 </ul>
                              </div>
                           </div>
                        )}

                        {/* 4. CHAT INTERFACE */}
                       {founderTab === 'chat' && (
                          <div className="flex-1 flex flex-col h-full animate-in slide-in-from-bottom-4 no-scrollbar pb-20">
                              {contactWarning === 'founder' && (
                                 <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-red-300 leading-relaxed">Sharing contact details (email or phone) is not permitted. Keep all communication inside the platform.</p>
                                 </div>
                              )}
                             <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10">
                                {syncedChat.length === 0 ? (
                                   <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-10">
                                      <MessageSquare className="w-12 h-12 mb-4" />
                                      <p className="text-xs font-medium">Select an investor from your matches to start a secure conversation.</p>
                                   </div>
                                ) : (
                                   syncedChat.map((m, i) => (
                                      <div key={i} className={`flex w-full ${m.sender === 'founder' ? 'justify-end' : m.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                                         <div className={`p-4 text-xs leading-relaxed ${
                                            m.sender === 'founder' ? 'bg-emerald-600 text-white rounded-2xl rounded-tr-none max-w-[85%]' : 
                                            m.sender === 'system' ? 'bg-zinc-900 border border-white/10 text-zinc-500 rounded-full px-6 font-bold uppercase tracking-widest text-[9px]' :
                                            'bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-none max-w-[85%]'
                                         }`}>
                                            {m.text}
                                         </div>
                                      </div>
                                   ))
                                )}
                             </div>
                             
                             {syncedChat.length > 0 && (
                                <div className="mt-4 flex gap-2">
                                   <input 
                                      type="text" 
                                      value={founderChatInput} 
                                      onChange={e => setFounderChatInput(e.target.value)} 
                                      onKeyPress={e => e.key === 'Enter' && handleFounderSend()}
                                      placeholder="Type a message..." 
                                      className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500/50" 
                                   />
                                   <button onClick={handleFounderSend} className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                                      <Send className="w-5 h-5 ml-0.5" />
                                   </button>
                                </div>
                             )}
                          </div>
                       )}

                    </div>

                    {/* iOS Bottom Margin */}
                    <div className="h-6 shrink-0 bg-[#0c0c0c]"></div>
                 </div>
              )}
          </PhoneWrapper>


          {/* ========================================================= */}
          {/* INVESTOR PHONE */}
          {/* ========================================================= */}
          <PhoneWrapper title="Investor Interface" glowColor="blue" tutorialActive={tutorialStep >= 0 && TUTORIAL_STEPS[tutorialStep].side !== 'founder'}>
              
              <NotificationBanner notify={investorNotify} color="blue" onAction={() => setInvestorTab('chat')} />

              {/* Investor Intro Overlay */}
              {introRender && (
                 <div className={`absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${introVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                    <img src="/logo.png" alt="Foresee Bridge" className="w-20 h-20 mb-6 animate-pulse" style={{filter:'invert(1) sepia(1) saturate(3) hue-rotate(190deg)'}} />
                    <h1 className="text-blue-500 font-black text-4xl tracking-widest uppercase mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">FORESEE</h1>
                    <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mt-2 px-4 py-1.5">Global Investor</p>
                 </div>
              )}

              {!investorAuth && !introRender && <AuthScreen type="investor" onLogin={() => setInvestorAuth(true)} />}

              {investorAuth && (
                 <div className="flex-1 flex flex-col pt-16 bg-[#0c0c0c] overflow-hidden">
                    
                    {/* Investor Header */}
                    <div className="px-6 flex items-center justify-between mb-4">
                       <h2 className="text-white font-bold text-lg">Deals Radar</h2>
                       <div className="flex gap-2">
                          <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                             <Search className="w-4 h-4 text-zinc-500" />
                          </button>
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">AP</div>
                       </div>
                    </div>

                    {/* Investor Tabs */}
                    <div className="px-6 flex gap-6 border-b border-white/5 mb-6 shrink-0 overflow-x-auto no-scrollbar">
                       <button onClick={() => {setInvestorTab('onboarding'); setInvestorSelectedDeal(null);}} className={`pb-3 border-b-2 transition-all whitespace-nowrap ${investorTab === 'onboarding' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Profile Setup</span>
                       </button>
                       <button onClick={() => {setInvestorTab('radar'); setInvestorSelectedDeal(null);}} className={`pb-3 border-b-2 transition-all whitespace-nowrap ${investorTab === 'radar' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Match L1</span>
                       </button>
                       <button onClick={() => {setInvestorTab('chat'); setInvestorSelectedDeal(null);}} className={`pb-3 border-b-2 transition-all whitespace-nowrap ${investorTab === 'chat' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">Basic Chat {syncedChat.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}</span>
                       </button>
                       <button onClick={() => {setInvestorTab('vision'); setInvestorSelectedDeal(null);}} className={`pb-3 border-b-2 transition-all whitespace-nowrap ${investorTab === 'vision' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Match L2</span>
                       </button>
                       <button onClick={() => {setInvestorTab('ecosystem'); setInvestorSelectedDeal(null);}} className={`pb-3 border-b-2 transition-all whitespace-nowrap ${investorTab === 'ecosystem' ? 'border-blue-500 text-blue-400' : 'border-transparent text-zinc-600'}`}>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Ecosystem</span>
                       </button>
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-0">
                       
                       {/* 1. INVESTOR RADAR */}
                       {investorTab === 'radar' && !investorSelectedDeal && (
                          <div className="space-y-4 animate-in slide-in-from-right-4">
                             <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1 block">Live Algorithm</span>
                                <p className="text-xs text-zinc-400 leading-relaxed">Filtering for 90%+ match in [Clean Energy, LATAM, Seed Stage]</p>
                             </div>

                             <div onClick={() => setInvestorSelectedDeal(founderProfile)} className="bg-white rounded-[32px] p-6 text-black shadow-2xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-all">
                                <div className="absolute top-2 right-2"><Badge color="blue">96% Match</Badge></div>
                                <div className="flex items-start gap-4 mb-6">
                                   <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-lg">EE</div>
                                   <div>
                                      <h4 className="text-base font-bold leading-none mb-1">{founderProfile.name}</h4>
                                      <div className="text-zinc-500 text-[9px] uppercase font-black">{founderProfile.city}, {founderProfile.country}</div>
                                   </div>
                                </div>
                                <div className="text-2xl font-black mb-1">${Number(founderProfile.capitalRequired).toLocaleString()}</div>
                                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-4">{founderProfile.description}</p>
                                <div className="flex items-center justify-between">
                                   <div className="flex gap-2">
                                      <Badge color="zinc">Seed</Badge>
                                      <Badge color="zinc">Verified Fin</Badge>
                                   </div>
                                   <button className="text-[10px] text-blue-500 font-bold bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                      <Plus className="w-3 h-3" /> Plus More
                                   </button>
                                </div>
                             </div>

                             {/* Placeholder generic deals */}
                             <div className="opacity-40 grayscale pointer-events-none space-y-4">
                                <div className="bg-zinc-900 border border-white/10 rounded-[32px] p-6">
                                   <h4 className="text-white font-bold opacity-50 mb-1">Agri-Stack Ghana</h4>
                                   <div className="text-xl font-bold text-zinc-100">$850k</div>
                                </div>
                                <div className="bg-zinc-900 border border-white/10 rounded-[32px] p-6">
                                   <h4 className="text-white font-bold opacity-50 mb-1">Nexus Fintech India</h4>
                                   <div className="text-xl font-bold text-zinc-100">$2.4M</div>
                                </div>
                             </div>
                          </div>
                       )}

                       {/* 2. INVESTOR DEAL DETAIL */}
                       {investorTab === 'radar' && investorSelectedDeal && (
                          <div className="space-y-6 animate-in slide-in-from-bottom-4 pb-20">
                             <button onClick={() => setInvestorSelectedDeal(null)} className="flex items-center gap-1 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-4"><ChevronLeft className="w-3.5 h-3.5"/> Back to Radar</button>
                             
                             <div className="bg-white rounded-[32px] p-6 text-black selection:bg-blue-100">
                                <div className="flex items-center justify-between mb-8">
                                   <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">EE</div>
                                   <div className="flex gap-2">
                                      <button className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center"><MoreVertical className="w-4 h-4 text-zinc-400" /></button>
                                   </div>
                                </div>

                                <div className="mb-8">
                                   <div className="flex items-center gap-2 mb-2">
                                      <h3 className="text-2xl font-black leading-tight">{investorSelectedDeal.name}</h3>
                                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                   </div>
                                   <div className="flex gap-2 mb-4">
                                      <Badge color="blue">{investorSelectedDeal.sector}</Badge>
                                      <Badge color="zinc">{investorSelectedDeal.stage}</Badge>
                                   </div>
                                    <div className="space-y-4">
                                       <div>
                                          <h5 className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Service/Product</h5>
                                          <p className="text-xs text-zinc-700 leading-relaxed font-medium">{investorSelectedDeal.description}</p>
                                       </div>
                                       <div>
                                          <h5 className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Problem solved</h5>
                                          <p className="text-xs text-zinc-700 leading-relaxed font-medium">{investorSelectedDeal.problem}</p>
                                       </div>
                                       <div className="grid grid-cols-2 gap-4">
                                          <div>
                                             <h5 className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Target Market</h5>
                                             <div className="text-[11px] font-bold">{investorSelectedDeal.targetMarket}</div>
                                          </div>
                                          <div>
                                             <h5 className="text-[9px] uppercase font-bold text-zinc-400 mb-1">Years Operating</h5>
                                             <div className="text-[11px] font-bold">{investorSelectedDeal.yearsOperating}y</div>
                                          </div>
                                       </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                   <div>
                                      <h5 className="text-[10px] uppercase font-bold text-zinc-400 mb-2">Verified Financial Assets</h5>
                                      <div className="space-y-2">
                                         {financialAssets.map(a => (
                                            <div key={a.id} className="p-3 bg-white border border-zinc-100 rounded-xl flex items-center justify-between shadow-sm">
                                               <div className="flex items-center gap-2">
                                                  <FileText className="w-3.5 h-3.5 text-blue-500"/>
                                                  <span className="text-[10px] font-bold text-zinc-600">{a.name}</span>
                                               </div>
                                               {a.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                                            </div>
                                         ))}
                                      </div>
                                   </div>

                                   {/* Founder Pitch — Untampered */}
                                   {investorSelectedDeal.pitch && (
                                      <div className="pt-4 border-t border-zinc-100">
                                         <h5 className="text-[10px] uppercase font-bold text-zinc-400 mb-2 flex items-center gap-1.5">
                                            <FileText className="w-3 h-3" /> Founder Pitch
                                         </h5>
                                         <p className="text-xs text-zinc-700 leading-relaxed font-medium italic">
                                            {investorSelectedDeal.pitch}
                                         </p>
                                         <div className="mt-2 text-[9px] text-zinc-400 uppercase font-bold tracking-widest">— Written by founder. Not AI-rewritten.</div>
                                      </div>
                                   )}
                                </div>
                                
                                <button onClick={() => {setInvestorTab('chat'); setSyncedChat([{ sender: 'system', text: `You initiated a connection with ${investorSelectedDeal.name}.` }]);}} className="w-full py-4 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black text-sm transition-all mt-10 shadow-xl flex items-center justify-center gap-2">
                                   Request Direct Line <ArrowRight className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                       )}

                       {/* 3. INVESTOR CHAT */}
                       {investorTab === 'chat' && (
                          <div className="flex-1 flex flex-col h-full animate-in slide-in-from-bottom-4 no-scrollbar pb-20">
                             {contactWarning === 'investor' && (
                                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 animate-in slide-in-from-top-2">
                                   <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                   <p className="text-[11px] text-red-300 leading-relaxed">Sharing contact details (email or phone) is not permitted. Keep all communication inside the platform.</p>
                                </div>
                             )}
                             <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pb-10">
                                {syncedChat.length === 0 ? (
                                   <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-10">
                                      <Search className="w-12 h-12 mb-4" />
                                      <p className="text-xs font-medium">Select a founder profile from the radar to start a secure connection.</p>
                                   </div>
                                ) : (
                                   syncedChat.map((m, i) => (
                                      <div key={i} className={`flex w-full ${m.sender === 'investor' ? 'justify-end' : m.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                                         <div className={`p-4 text-xs leading-relaxed ${
                                            m.sender === 'investor' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none max-w-[85%]' : 
                                            m.sender === 'system' ? 'bg-zinc-900 border border-white/10 text-zinc-500 rounded-full px-6 font-bold uppercase tracking-widest text-[9px]' :
                                            'bg-zinc-800 text-zinc-100 rounded-2xl rounded-tl-none max-w-[85%]'
                                         }`}>
                                            {m.text}
                                         </div>
                                      </div>
                                   ))
                                )}
                             </div>
                             
                             {syncedChat.length > 0 && (
                                <div className="mt-4 flex gap-2">
                                   <input 
                                      type="text" 
                                      value={investorChatInput} 
                                      onChange={e => setInvestorChatInput(e.target.value)} 
                                      onKeyPress={e => e.key === 'Enter' && handleInvestorSend()}
                                      placeholder="Message founder..." 
                                      className="flex-1 bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/50" 
                                   />
                                   <button onClick={handleInvestorSend} className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                                      <Send className="w-5 h-5 ml-0.5" />
                                   </button>
                                </div>
                             )}
                          </div>
                       )}

                    </div>

                    {investorTab === 'onboarding' && (
                       <div className="flex-1 flex items-center justify-center h-full opacity-50 px-10 text-center animate-in fade-in pb-20">
                          <p className="text-sm">Investor Profile Setup Interface</p>
                       </div>
                    )}
                    {investorTab === 'vision' && (
                       <div className="flex-1 flex items-center justify-center h-full opacity-50 px-10 text-center animate-in fade-in pb-20">
                          <p className="text-sm">Investor Match L2 Dashboard</p>
                       </div>
                    )}
                    {investorTab === 'ecosystem' && (
                       <div className="flex-1 flex items-center justify-center h-full opacity-50 px-10 text-center animate-in fade-in pb-20">
                          <p className="text-sm">Investor Ecosystem Network</p>
                       </div>
                    )}

                    {/* iOS Bottom Margin */}
                    <div className="h-6 shrink-0 bg-[#0c0c0c]"></div>
                 </div>
              )}
          </PhoneWrapper>

      </div>

      {/* iOS Style Home Indicator for frame bounds */}
      <div className="h-2 w-32 bg-zinc-800 rounded-full mt-4 opacity-20"></div>

      {showTerms && <Terms onClose={() => setShowTerms(false)} />}
    </div>
  );
}

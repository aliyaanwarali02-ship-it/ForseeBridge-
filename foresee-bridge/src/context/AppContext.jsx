import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const MATCHED_INVESTORS = [
  {
    id: 'inv1', 
    name: 'Apex Capital', 
    type: 'VC Firm',
    country: 'Singapore', 
    focus: 'SaaS / Fintech', 
    minTicket: '$100k',
    maxTicket: '$1.5M', 
    match: 96, 
    avatar: 'AC', 
    color: 'blue',
    trustScore: 92,
    verified: true,
    sectors: ['SaaS', 'Fintech'],
    stages: ['Seed', 'Series A'],
    risk: 'Low-Medium',
    goals: ['Equity', 'Advisory'],
    portfolio: ['Stripe', 'Revolut'],
    ticketRange: [100000, 1500000]
  },
  {
    id: 'inv2', 
    name: 'Meridian Ventures', 
    type: 'Angel Group',
    country: 'UAE', 
    focus: 'Impact / Emerging Markets', 
    minTicket: '$250k',
    maxTicket: '$5M', 
    match: 88, 
    avatar: 'MV', 
    color: 'emerald',
    trustScore: 85,
    verified: true,
    sectors: ['Impact', 'Clean Energy'],
    stages: ['Series A', 'Series B'],
    risk: 'Medium',
    goals: ['Equity', 'Long-term Growth'],
    portfolio: ['SolarX', 'WaterFirst'],
    ticketRange: [250000, 5000000]
  },
  {
    id: 'inv3', 
    name: 'NovaBridge Fund', 
    type: 'Firm',
    country: 'UK', 
    focus: 'Cross-border Trade', 
    minTicket: '$50k',
    maxTicket: '$750k', 
    match: 81, 
    avatar: 'NB', 
    color: 'violet',
    trustScore: 78,
    verified: false,
    sectors: ['Trade', 'Logistics'],
    stages: ['Seed'],
    risk: 'High',
    goals: ['Equity'],
    portfolio: ['ShipIt', 'GlobalTrade'],
    ticketRange: [50000, 750000]
  }
];

export const MATCHED_FOUNDERS = [
  {
    id: 'f1',
    name: 'EcoEnergy Brazil',
    city: 'São Paulo',
    country: 'Brazil',
    sector: 'Clean Energy',
    stage: 'Startup',
    capitalRequired: 500000,
    equityOffered: 15,
    pitch: 'Decentralized solar micro-grids for LATAM.',
    targetMarket: 'Remote mining and agricultural hubs.',
    marketSize: '$4.2B',
    trustScore: 68,
    verified: true,
    financialConfidence: 'Intermediate'
  },
  {
    id: 'f2',
    name: 'NeoPay Africa',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Fintech',
    stage: 'Seed',
    capitalRequired: 750000,
    equityOffered: 10,
    pitch: 'Simplifying cross-border B2B payments in West Africa.',
    targetMarket: 'Small businesses and importers.',
    marketSize: '$12B',
    trustScore: 72,
    verified: true,
    financialConfidence: 'High'
  },
  {
    id: 'f3',
    name: 'AgriSense India',
    city: 'Pune',
    country: 'India',
    sector: 'Agri-Tech',
    stage: 'Pre-Seed',
    capitalRequired: 200000,
    equityOffered: 8,
    pitch: 'AI-driven soil health monitoring for small farmers.',
    targetMarket: 'Rural farming cooperatives.',
    marketSize: '$1.5B',
    trustScore: 45,
    verified: false,
    financialConfidence: 'Low'
  }
];

export const AppProvider = ({ children }) => {
  // ROLE STATE: 'founder' | 'investor' | null
  const [role, setRole] = useState(null);

  // PREMIUM STATE (Level 2 - $75)
  const [premiumUnlocked, setPremiumUnlocked] = useState(false);

  // SHARED CHAT STATE
  const [syncedChat, setSyncedChat] = useState([]);

  // FOUNDER STATE
  const [founderProfile, setFounderProfile] = useState({
    name: 'EcoEnergy Brazil',
    logo: null,
    city: 'São Paulo',
    country: 'Brazil',
    sector: 'Clean Energy',
    stage: 'Startup',
    description: 'Decentralized solar micro-grids for off-grid industrial communities.',
    model: 'B2B Subscriptions',
    mission: 'Empower remote industries with sustainable, reliable energy.',
    problem: 'High cost and unreliability of main grid power in rural industrial zones.',
    uvp: 'Patent-pending swappable battery nodes with predictive maintenance AI.',
    competitors: 'Legacy diesel providers, regional grid monopolies.',
    targetMarket: 'Remote mining and agricultural hubs in LATAM.',
    marketSize: '$4.2B addressing market',
    yearsOperating: '2',
    capitalRequired: 500000,
    equityOffered: 15,
    useOfFunds: 'Scaling hardware production and expanding to 3 new regions.',
    pitch: 'We have already deployed 12 nodes with 98% uptime. Our goal is to become the leading provider of decentralized industrial power in the LATAM region by 2027.',
    monthlyUsers: 45,
    growthRate: 15,
    retentionRate: 98,
    preferredInvestor: 'Strategic',
    investorInvolvement: 'Hands-on Advisory',
    fundingTimeline: 'Flexible',
    verification: {
        identity: 'verified', // 'unverified', 'pending', 'verified'
        business: 'pending',
        financial: 'unverified'
    },
    financialConfidence: 'Intermediate',
    trustScore: 68
  });

  const [financialAssets, setFinancialAssets] = useState([
    { id: 1, name: 'Q4_Revenue_Statement.pdf', verified: true, type: 'Revenue' },
    { id: 2, name: '2024_P_L_Projections.xlsx', verified: false, type: 'Projections' }
  ]);

  const [credibility, setCredibility] = useState({ 
    email: true, 
    phone: false, 
    documents: true 
  });

  const [isUploading, setIsUploading] = useState(false);

  // INVESTOR STATE
  const [investorProfile, setInvestorProfile] = useState({
    name: 'Alex Rivera',
    photo: null,
    type: 'Angel Investor', // individual, firm, VC, angel
    location: 'London, UK',
    sectors: ['Clean Energy', 'Fintech', 'SaaS'],
    ticketSizeRange: { min: 50000, max: 2000000 },
    stages: ['Seed', 'Series A'],
    riskTolerance: 'Balanced', // Conservative, Balanced, Aggressive
    portfolio: ['SolarCharge', 'GreenBank', 'CloudScales'],
    businessesOwned: 'Rivera Corp, Alex Ventures',
    successes: 'Exited FoodApp at 5x multiple in 2023.',
    strategicIntent: ['Equity deals', 'Advisory roles'],
    involvementDesired: 'High (Board Seat / Advisory)',
    horizon: 'Long-term growth',
    goals: 'Equity Stake, Strategic Advisory, Building Ecosystems',
    verification: {
        identity: 'verified',
        financial: 'pending'
    },
    trustScore: 82
  });

  const [investorSelectedDeal, setInvestorSelectedDeal] = useState(null);

  // NOTIFICATION STATE
  const [founderNotify, setFounderNotify] = useState(null);
  const [investorNotify, setInvestorNotify] = useState(null);

  // AI Feedbacks (Simulated)
  const [aiSuggestions, setAiSuggestions] = useState([
    { id: 1, type: 'warning', text: 'Pitch length is slightly under the recommended minimum.' },
    { id: 2, type: 'tip', text: 'Consider adding more detail to the Target Market section.' }
  ]);

  // Compatibility Calculation
  const calculateCompatibility = (founder, investor) => {
    const sectorMatch = investor.sectors?.includes(founder.sector) ? 95 : 40;
    const stageMatch = investor.stages?.includes(founder.stage) ? 90 : 30;
    
    // Simple capital fit logic
    const capitalReq = Number(founder.capitalRequired);
    const inRange = capitalReq >= investor.ticketSizeRange?.min && capitalReq <= investor.ticketSizeRange?.max;
    const capitalFit = inRange ? 98 : 45;

    const overall = Math.round((sectorMatch + stageMatch + capitalFit + 80 + 70 + 85) / 6);

    return {
      overall,
      sectorAlignment: sectorMatch,
      capitalFit: capitalFit,
      stageCompatibility: stageMatch,
      riskAlignment: 80,
      geographicMatch: 70,
      strategicFit: 85
    };
  };

  const triggerNotify = (targetSide, msg) => {
    if (targetSide === 'founder') {
      setFounderNotify(msg);
      setTimeout(() => setFounderNotify(null), 3000);
    } else {
      setInvestorNotify(msg);
      setTimeout(() => setInvestorNotify(null), 3000);
    }
  };

  // HELPERS
  const containsContactInfo = (text) => {
    const emailRx = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
    const phoneRx = /(\+?\d[\d\s\-(). ]{6,}\d)/;
    return emailRx.test(text) || phoneRx.test(text);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
        if (role === 'founder') {
          setFounderProfile(prev => ({
            ...prev,
            verification: { ...prev.verification, financial: 'verified' },
            trustScore: Math.min(prev.trustScore + 15, 100)
          }));
        } else if (role === 'investor') {
          setInvestorProfile(prev => ({
            ...prev,
            verification: { ...prev.verification, financial: 'verified' },
            trustScore: Math.min(prev.trustScore + 15, 100)
          }));
        }
        setFinancialAssets(prev => [...prev, { id: Date.now(), name: 'Verified_Statement.pdf', verified: true, type: 'Financial' }]);
        setIsUploading(false);
    }, 2000);
  };

  const loginAs = (asRole) => {
    setRole(asRole);
  };

  const logout = () => {
    setRole(null);
  };

  // Profile Strength
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

  return (
    <AppContext.Provider value={{
      role, setRole, loginAs, logout,
      premiumUnlocked, setPremiumUnlocked,
      syncedChat, setSyncedChat,
      founderProfile, setFounderProfile,
      investorProfile, setInvestorProfile,
      financialAssets, setFinancialAssets,
      credibility, setCredibility,
      isUploading, simulateUpload,
      aiSuggestions, setAiSuggestions,
      strength,
      investorSelectedDeal, setInvestorSelectedDeal,
      founderNotify, setFounderNotify,
      investorNotify, setInvestorNotify,
      triggerNotify, containsContactInfo,
      calculateCompatibility,
      MATCHED_INVESTORS, MATCHED_FOUNDERS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

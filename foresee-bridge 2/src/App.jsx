import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

import Landing from './pages/Landing';
import Login from './pages/Login';
import FounderDashboard from './pages/FounderDashboard';
import InvestorDashboard from './pages/InvestorDashboard';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/founder/*" element={<FounderDashboard />} />
          <Route path="/investor/*" element={<InvestorDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

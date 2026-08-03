
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { InstitutionProvider, useInstitution } from './store/InstitutionContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Yoga from './pages/Yoga';
import Beautician from './pages/Beautician';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import About from './pages/About';
import Success from './pages/Success';
import { Mail, X, Send, ShieldCheck, ArrowRight } from 'lucide-react';

const EmailToast: React.FC = () => {
  const { latestEmail, dismissToast, adminSettings } = useInstitution();

  useEffect(() => {
    if (latestEmail) {
      const timer = setTimeout(() => dismissToast(), 8000);
      return () => clearTimeout(timer);
    }
  }, [latestEmail, dismissToast]);

  if (!latestEmail) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[100] max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-bounce-in ring-1 ring-[#c2b280]/20">
      <div className="bg-[#4a443d] p-3 text-white flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest">
          <Send size={14} className="text-[#c2b280]" /> Transactional Email Sent
        </div>
        <button onClick={dismissToast} className="opacity-60 hover:opacity-100"><X size={16} /></button>
      </div>
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 bg-[#fcfaf7] rounded-xl flex items-center justify-center text-[#c2b280] shadow-inner">
            <Mail size={20} />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">
              From: <span className="text-[#c2b280]">{adminSettings.smtpConfig.user}</span>
            </div>
            <div className="font-bold text-[#4a443d] leading-tight mb-1">{latestEmail.subject}</div>
            <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
              To: {latestEmail.to} <ShieldCheck size={10} className="text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-[#fcfaf7] p-3 rounded-xl border border-gray-100 mb-4">
          <p className="text-xs text-[#6b645a] leading-relaxed italic line-clamp-2">
            "{latestEmail.body}"
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">SMTP Route: Secured</span>
          </div>
          <div className="text-[8px] font-bold text-gray-300 uppercase italic">
            Via Gmail-587 Simulation
          </div>
        </div>
      </div>
      <div className="h-1 bg-[#c2b280] w-full origin-left animate-[shrink_8s_linear_forwards]" />
    </div>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-[#4a443d] text-[#ede6d9] py-16 px-4 mt-20">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
      <div className="space-y-4">
        <h3 className="text-2xl font-bold">Sadha <span className="text-[#c2b280]">Institution</span></h3>
        <p className="text-sm text-gray-400">Premium Yoga & Beauty Education</p>
        <p className="text-sm opacity-80 leading-relaxed max-w-xs">
          Empowering lives through ancient wisdom and modern professional skills since 2022.
        </p>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#c2b280]">Quick Links</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li><a href="#/yoga" className="hover:text-white">Live Yoga</a></li>
          <li><a href="#/beautician" className="hover:text-white">Beautician Course</a></li>
          <li><a href="#/about" className="hover:text-white">Instructor Profile</a></li>
          <li><a href="#/login" className="hover:text-white">Student Portal</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-4 text-[#c2b280]">Contact</h4>
        <ul className="space-y-2 text-sm opacity-80">
          <li>Yoga Street, Bengaluru</li>
          <li>+91 9441988463</li>
          <li>sadhachowdhary@gmail.com</li>
        </ul>
      </div>
    </div>
    <div className="max-w-6xl mx-auto pt-10 mt-10 border-t border-white/10 text-center text-xs opacity-50">
      &copy; {new Date().getFullYear()} Sadha Institution. All rights reserved.
    </div>
  </footer>
);

const AppContent: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/yoga" element={<Yoga />} />
        <Route path="/beautician" element={<Beautician />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </main>
    <Footer />
    <EmailToast />
  </div>
);

const App: React.FC = () => {
  return (
    <InstitutionProvider>
      <Router>
        <AppContent />
      </Router>
    </InstitutionProvider>
  );
};

export default App;

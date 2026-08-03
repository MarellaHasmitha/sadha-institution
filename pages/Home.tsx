
import React from 'react';
import { Link } from 'react-router-dom';
import { useInstitution } from '../store/InstitutionContext';
import { CONTACT_INFO } from '../constants';
import { ArrowRight, Sparkles, Heart, MessageCircle, Calendar, Timer } from 'lucide-react';

const Home: React.FC = () => {
  const { adminSettings } = useInstitution();

  const isRegistrationOpen = adminSettings.yogaRegistrationsOpen;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  return (
    <div className="min-h-screen relative">
      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/${CONTACT_INFO.phone}?text=${CONTACT_INFO.messages.general}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
        aria-label="Chat with us on WhatsApp"
      >
        <MessageCircle size={32} />
      </a>

      {/* Dynamic Registration Banner */}
      <div className={`py-3 text-center text-xs font-bold tracking-widest uppercase transition-all shadow-sm ${isRegistrationOpen ? 'bg-green-600 text-white' : 'bg-red-50 text-red-800'}`}>
        <div className="flex items-center justify-center gap-2 px-4">
          {isRegistrationOpen ? (
            <>
              <Calendar size={14} />
              <span>
                Yoga Registrations are OPEN! 
                {adminSettings.registrationClosingDate && (
                  <span className="hidden sm:inline"> • CLOSING ON {formatDate(adminSettings.registrationClosingDate)}</span>
                )}
              </span>
            </>
          ) : (
            <>
              <Timer size={14} />
              <span>
                Yoga Registrations are currently CLOSED.
                {adminSettings.registrationOpeningDate && (
                  <span className="hidden sm:inline"> • NEXT BATCH OPENS ON {formatDate(adminSettings.registrationOpeningDate)}</span>
                )}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1600" 
            alt="Yoga background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fcfaf7]"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 mb-4 text-[#c2b280] bg-white/80 rounded-full text-sm font-semibold tracking-widest uppercase shadow-sm">Premium Holistic Education</span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#4a443d] mb-6 leading-tight">
            Elevate Your <br />
            <span className="text-[#c2b280]">Mind and Body</span>
          </h1>
          <p className="text-lg text-[#6b645a] mb-8 font-medium">
            Join Sadha Laxmi for expert-led yoga sessions and professional beautician courses designed for transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/yoga" className="bg-[#c2b280] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#a89462] transition shadow-lg flex items-center justify-center gap-2">
              Start Yoga <ArrowRight size={20} />
            </Link>
            <Link to="/beautician" className="bg-white text-[#c2b280] border-2 border-[#c2b280] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#fdfbf7] transition shadow-lg flex items-center justify-center gap-2">
              Beautician Pro <Sparkles size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Stats/Notice Section for Closed Status */}
      {!isRegistrationOpen && adminSettings.registrationOpeningDate && (
        <section className="bg-white py-12 px-4 border-y border-[#ede6d9]">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
              <Calendar size={32} />
            </div>
            <h2 className="text-2xl font-bold">Upcoming Batch Announcement</h2>
            <p className="text-[#6b645a] max-w-lg">
              Our current batch is full, but we are excited to welcome new students soon. 
              Mark your calendars for our next opening on <span className="text-[#c2b280] font-bold">{formatDate(adminSettings.registrationOpeningDate)}</span>.
            </p>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-[#4a443d]">Our Specialized Tracks</h2>
          <p className="text-[#6b645a] font-medium">Professional guidance, personal growth.</p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div className="group bg-[#fcfaf7] rounded-3xl p-8 border border-[#ede6d9] hover:border-[#c2b280] transition-all duration-300 hover:shadow-2xl">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition text-[#c2b280]">
              <Heart size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-[#4a443d]">Live Yoga Sessions</h3>
            <p className="text-[#6b645a] mb-6 leading-relaxed">
              Targeted programs for Weight Loss, Weight Gain, and General Wellness. Daily live sessions for all skill levels.
            </p>
            <div className="flex items-center gap-2 text-[#c2b280] font-bold mb-8">
              <span>Flexible Monthly Plans</span>
            </div>
            <Link to="/yoga" className="block text-center py-4 bg-[#c2b280] text-white rounded-xl font-bold hover:bg-[#a89462] transition shadow-md">
              View Schedules
            </Link>
          </div>

          <div className="group bg-[#fcfaf7] rounded-3xl p-8 border border-[#ede6d9] hover:border-[#c2b280] transition-all duration-300 hover:shadow-2xl">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition text-[#c2b280]">
              <Sparkles size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-[#4a443d]">Professional Beautician</h3>
            <p className="text-[#6b645a] mb-6 leading-relaxed">
              Step-by-step masterclass covering professional bridal makeup, skincare science, and salon techniques.
            </p>
            <div className="flex items-center gap-2 text-[#c2b280] font-bold mb-8">
              <span>Instant Recorded Access</span>
            </div>
            <Link to="/beautician" className="block text-center py-4 bg-[#c2b280] text-white rounded-xl font-bold hover:bg-[#a89462] transition shadow-md">
              Start Learning
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

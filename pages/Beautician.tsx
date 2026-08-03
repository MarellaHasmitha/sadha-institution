
import React, { useState, useRef, useEffect } from 'react';
import { useInstitution } from '../store/InstitutionContext';
import { Play, Lock, BookOpen, ShieldCheck, X, MoreVertical, Monitor, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Beautician: React.FC = () => {
  const { adminSettings, user, enrollInBeautician } = useInstitution();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [showMenu, setShowMenu] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const isEnrolled = user?.enrolledCourses.includes('beautician');
  const hasExpired = user?.beauticianAccessExpiry ? new Date(user.beauticianAccessExpiry) < new Date() : false;
  const canAccess = isEnrolled && !hasExpired;

  const currentVideo = adminSettings.beauticianVideos[activeVideoIdx];

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      enrollInBeautician();
      setIsProcessing(false);
      setShowPaymentModal(false);
      navigate('/success', { 
        state: { type: 'beautician', courseName: 'Professional Beautician Course' } 
      });
    }, 2000);
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowMenu(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [activeVideoIdx, playbackSpeed]);

  if (user) {
    return (
      <div className="min-h-screen py-6 md:py-12 px-4 bg-[#fcfaf7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#c2b280] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Beautician Course</span>
                <span className="text-xs text-[#c2b280] font-bold">Curriculum Dashboard</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#4a443d]">Professional Mastery Program</h1>
              {canAccess && (
                <p className="text-green-600 font-bold flex items-center gap-2 text-sm mt-1">
                  <ShieldCheck size={16} /> Access Active until {formatDate(user.beauticianAccessExpiry!)}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Video Section */}
            <div className="flex-1 min-w-0 space-y-6">
              <div className="bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative aspect-video bg-neutral-900 border border-black/10 group">
                {canAccess ? (
                  <>
                    <video 
                      ref={videoRef}
                      key={`${currentVideo?.url}-${quality}`}
                      controls 
                      controlsList="nodownload" 
                      disablePictureInPicture
                      className="w-full h-full object-contain"
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <source src={currentVideo?.url} type="video/mp4" />
                    </video>

                    {/* Three Dots Settings Trigger */}
                    <div className="absolute bottom-10 md:bottom-12 right-1 z-20">
                      <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 bg-transparent text-white/80 flex items-center justify-center hover:text-white transition-colors"
                        title="Video Settings"
                      >
                        <MoreVertical size={24} />
                      </button>

                      {showMenu && (
                        <div className="absolute bottom-full right-2 mb-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in text-white z-30">
                          <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Settings</p>
                            <button onClick={() => setShowMenu(false)} className="opacity-40 hover:opacity-100 transition"><X size={14}/></button>
                          </div>
                          
                          <div className="p-4 space-y-4">
                            <div>
                              <p className="text-[10px] font-bold mb-2 opacity-50">Playback Quality</p>
                              <div className="grid grid-cols-2 gap-1">
                                {['1080p', '720p', '480p', 'Auto'].map(q => (
                                  <button 
                                    key={q}
                                    onClick={() => { setQuality(q); setShowMenu(false); }}
                                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-between transition ${quality === q ? 'bg-[#c2b280] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                                  >
                                    {q} {quality === q && <Check size={10} />}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold mb-2 opacity-50">Speed Control</p>
                              <div className="grid grid-cols-2 gap-1">
                                {[0.75, 1, 1.25, 1.5].map(s => (
                                  <button 
                                    key={s}
                                    onClick={() => changeSpeed(s)}
                                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-between transition ${playbackSpeed === s ? 'bg-[#c2b280] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
                                  >
                                    {s}x {playbackSpeed === s && <Check size={10} />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-white text-[10px] font-bold uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {quality} Secure Stream
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-6 md:p-10 text-center space-y-4">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#c2b280]/20 rounded-full flex items-center justify-center text-[#c2b280] mb-2">
                      <Lock size={32} className="md:size-40" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold">Curriculum Locked</h2>
                    <p className="text-gray-400 max-w-sm text-sm md:text-base">Please enroll in the Professional Beautician Course to watch all lessons and start your career.</p>
                    <button 
                      onClick={handleEnrollClick}
                      className="bg-[#c2b280] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#a89462] transition shadow-lg"
                    >
                      Enroll Now - ₹{adminSettings.beauticianPrice}
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-[#ede6d9] shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#fcfaf7] flex items-center justify-center text-[#c2b280] shadow-inner flex-shrink-0">
                      <Play size={24} className="md:size-28" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-[#4a443d]">{currentVideo?.title || 'Welcome to the Course'}</h2>
                      <p className="text-xs md:text-sm text-[#c2b280] font-bold">Module {activeVideoIdx + 1} • {canAccess ? 'Access Active' : 'Locked'}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-6 bg-[#fcfaf7] rounded-xl md:rounded-2xl border border-gray-50">
                  <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <BookOpen size={14} className="text-[#c2b280]" /> Lesson Summary
                  </h3>
                  <p className="text-[#6b645a] leading-relaxed text-sm">
                    {currentVideo?.description || 'Learn professional techniques from industry experts. This module covers essential skills required to master beautician services.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Curriculum Sidebar */}
            <div className="w-full lg:w-80 xl:w-96 space-y-6">
              <div className="bg-white p-6 rounded-2xl md:rounded-3xl border border-[#ede6d9] shadow-md lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2 text-[#4a443d]">
                    <Monitor size={20} className="text-[#c2b280]" /> Program Curriculum
                  </h3>
                </div>
                <div className="space-y-3 max-h-[40vh] md:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {adminSettings.beauticianVideos.map((v, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => { setActiveVideoIdx(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-full flex items-center gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition text-left group border-2 ${activeVideoIdx === idx ? 'bg-[#fcfaf7] border-[#c2b280]' : 'bg-white border-transparent hover:border-[#f5f2eb] hover:bg-gray-50'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition shadow-sm flex-shrink-0 ${activeVideoIdx === idx ? 'bg-[#c2b280] text-white' : 'bg-[#f5f2eb] text-[#c2b280]'}`}>
                        {!canAccess && idx !== 0 ? <Lock size={14} /> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm truncate ${activeVideoIdx === idx ? 'text-[#4a443d]' : 'text-gray-500'}`}>{v.title}</div>
                        <div className="text-[10px] text-gray-400 font-bold truncate opacity-80">{v.description}</div>
                      </div>
                      {activeVideoIdx === idx && <div className="w-2 h-2 bg-[#c2b280] rounded-full animate-pulse flex-shrink-0" />}
                    </button>
                  ))}
                </div>

                {!canAccess && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button 
                      onClick={handleEnrollClick}
                      className="w-full py-3 bg-[#4a443d] text-white rounded-xl font-bold text-sm shadow-md hover:bg-black transition flex items-center justify-center gap-2"
                    >
                      Unlock All Lessons
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Simulated Razorpay Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
              <div className="bg-[#1b2430] p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-[#2c3e50] p-1.5 rounded">
                    <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center font-bold text-xs italic">R</div>
                  </div>
                  <div className="font-bold text-sm">Checkout</div>
                </div>
                <button onClick={() => setShowPaymentModal(false)}><X size={20} /></button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-gray-500 text-xs uppercase tracking-widest font-bold">Total Amount</div>
                    <div className="text-2xl font-bold text-[#1b2430]">₹{adminSettings.beauticianPrice}</div>
                  </div>
                </div>
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-3"
                >
                  {isProcessing ? 'Verifying...' : 'Pay with UPI'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not Logged In View
  return (
    <div className="min-h-screen py-12 px-4 bg-[#fcfaf7]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-[#c2b280] font-bold tracking-widest uppercase text-sm">Professional Recorded Course</span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight text-[#4a443d]">
                Master the Art of <span className="text-[#c2b280]">Beauty & Makeup</span>
              </h1>
              <p className="text-lg text-[#6b645a] mt-6 leading-relaxed">
                Step into the professional beauty industry with our certified course. High-definition recorded modules covering everything from skincare basics to advanced bridal makeup.
              </p>
            </div>
            <div className="bg-white border border-[#ede6d9] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-400 line-through">Regular Price ₹2500</div>
                  <div className="text-4xl font-bold text-[#c2b280]">₹{adminSettings.beauticianPrice}</div>
                </div>
                <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold">60% OFF</div>
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-[#c2b280] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#a89462] transition"
              >
                Login to View Curriculum
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative border-8 border-white">
              <img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800" alt="Beautician Course" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-10">
                <div className="text-white">
                  <div className="text-sm font-bold text-[#c2b280] mb-2 uppercase tracking-widest">Enrollment Open</div>
                  <h3 className="text-2xl font-bold leading-tight">Bridal Artistry & Advanced Makeup Techniques</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beautician;

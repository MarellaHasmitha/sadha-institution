
import React, { useState } from 'react';
import { useInstitution } from '../store/InstitutionContext';
import { CONTACT_INFO } from '../constants';
import { Check, Clock, AlertCircle, X, Shield, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Yoga: React.FC = () => {
  const { adminSettings, courses, batches, user, enrollInYoga } = useInstitution();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const activeCourses = courses.filter(c => c.enabled);
  const activeBatches = batches.filter(b => b.enabled);

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!selectedCourse || !selectedBatch) {
      alert('Please select both a course and a batch.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate Razorpay Gateway Latency
    setTimeout(() => {
      enrollInYoga(selectedCourse, selectedBatch);
      setIsProcessing(false);
      setShowPaymentModal(false);
      navigate('/success', { 
        state: { 
          type: 'yoga', 
          courseName: courses.find(c => c.id === selectedCourse)?.name,
          batchName: batches.find(b => b.id === selectedBatch)?.name
        } 
      });
    }, 2000);
  };

  const isRegistrationClosed = !adminSettings.yogaRegistrationsOpen;

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Simulated Razorpay Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="bg-[#1b2430] p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-[#2c3e50] p-1.5 rounded">
                   <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center font-bold text-xs italic">R</div>
                </div>
                <div className="font-bold text-sm">Sadha Institution</div>
              </div>
              <button onClick={() => setShowPaymentModal(false)}><X size={20} /></button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                   <div className="text-gray-500 text-xs uppercase tracking-widest font-bold">Total Payable</div>
                   <div className="text-2xl font-bold text-[#1b2430]">₹{courses.find(c => c.id === selectedCourse)?.price}</div>
                 </div>
                 <div className="text-right">
                   <div className="text-gray-500 text-[10px] uppercase font-bold">Order ID</div>
                   <div className="text-xs text-gray-400">#ORD{Math.floor(Math.random()*100000)}</div>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <button className="w-full p-4 border-2 border-blue-500 bg-blue-50 rounded-xl flex items-center gap-4 text-left">
                   <Smartphone className="text-blue-600" />
                   <div>
                     <div className="font-bold text-[#1b2430]">UPI (Google Pay, PhonePe)</div>
                     <div className="text-xs text-gray-500">Pay using any UPI app</div>
                   </div>
                   <div className="ml-auto text-blue-600 font-bold text-xs uppercase">Preferred</div>
                 </button>
                 <button className="w-full p-4 border border-gray-100 rounded-xl flex items-center gap-4 text-left opacity-50">
                   <div className="w-6 h-6 bg-gray-200 rounded"></div>
                   <div>
                     <div className="font-bold text-[#1b2430]">Card / Netbanking</div>
                     <div className="text-xs text-gray-400">All major cards supported</div>
                   </div>
                 </button>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-3"
              >
                {isProcessing ? 'Verifying with Bank...' : 'Pay with UPI'}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
                <Shield size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">PCI DSS Compliant Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Yoga Programs</h1>
          <p className="text-[#6b645a]">Holistic wellness for every body and every age.</p>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          {isRegistrationClosed && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 mb-8 text-center flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-down">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-400" size={28} />
                <div className="text-left">
                  <h2 className="text-lg font-bold text-red-800">Registrations Currently Closed</h2>
                  <p className="text-sm text-red-700">Next batch starting soon. View programs below for details.</p>
                </div>
              </div>
              <a 
                href={`https://wa.me/${CONTACT_INFO.phone}?text=${CONTACT_INFO.messages.notify}`} 
                target="_blank"
                rel="noreferrer"
                className="bg-red-100 text-red-800 px-6 py-2 rounded-full font-bold hover:bg-red-200 transition"
              >
                Notify Me
              </a>
            </div>
          )}

          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 border border-[#ede6d9] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#f5f2eb] flex items-center justify-center text-[#c2b280] font-bold">1</div>
                <h2 className="text-xl font-bold">Available Programs</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {activeCourses.length > 0 ? activeCourses.map(course => (
                  <button
                    key={course.id}
                    disabled={isRegistrationClosed}
                    onClick={() => setSelectedCourse(course.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition ${selectedCourse === course.id ? 'border-[#c2b280] bg-[#fdfbf7]' : 'border-gray-100 hover:border-[#c2b280]/30'} ${isRegistrationClosed ? 'opacity-80 grayscale-[0.5] cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg">{course.name}</span>
                      {selectedCourse === course.id && <Check className="text-[#c2b280]" size={20} />}
                    </div>
                    <p className="text-sm text-[#6b645a] mb-4">{course.description}</p>
                    <div className="text-[#c2b280] font-bold">₹{course.price} / month</div>
                  </button>
                )) : <p className="text-gray-400 col-span-2 italic text-center py-10">No courses enabled by admin yet.</p>}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 border border-[#ede6d9] shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#f5f2eb] flex items-center justify-center text-[#c2b280] font-bold">2</div>
                <h2 className="text-xl font-bold">Choose a Batch</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {activeBatches.length > 0 ? activeBatches.map(batch => (
                  <button
                    key={batch.id}
                    disabled={isRegistrationClosed}
                    onClick={() => setSelectedBatch(batch.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition ${selectedBatch === batch.id ? 'border-[#c2b280] bg-[#fdfbf7]' : 'border-gray-100 hover:border-[#c2b280]/30'} ${isRegistrationClosed ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-lg">{batch.name}</span>
                      {selectedBatch === batch.id && <Check className="text-[#c2b280]" size={20} />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#6b645a]">
                      <Clock size={16} /> {batch.time}
                    </div>
                  </button>
                )) : <p className="text-gray-400 col-span-2 italic text-center py-10">No batches enabled by admin yet.</p>}
              </div>
            </section>

            {!isRegistrationClosed && (
              <section className="bg-white rounded-3xl p-8 border border-[#c2b280] shadow-xl">
                 <h2 className="text-2xl font-bold mb-6">Enrollment Summary</h2>
                 <div className="space-y-4 mb-8">
                   <div className="flex justify-between text-[#6b645a]">
                     <span>Course:</span>
                     <span className="font-bold text-[#4a443d]">{selectedCourse ? courses.find(c => c.id === selectedCourse)?.name : 'Not Selected'}</span>
                   </div>
                   <div className="flex justify-between text-[#6b645a]">
                     <span>Batch:</span>
                     <span className="font-bold text-[#4a443d]">{selectedBatch ? batches.find(b => b.id === selectedBatch)?.name : 'Not Selected'}</span>
                   </div>
                   <div className="pt-4 border-t flex justify-between items-center">
                     <span className="text-lg font-bold">Total Amount:</span>
                     <span className="text-2xl font-bold text-[#c2b280]">₹{selectedCourse ? courses.find(c => c.id === selectedCourse)?.price : 0}</span>
                   </div>
                 </div>

                 <button
                    disabled={!selectedCourse || !selectedBatch}
                    onClick={handleEnrollClick}
                    className="w-full py-4 bg-[#c2b280] text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-[#a89462] disabled:opacity-50 disabled:cursor-not-allowed transition"
                 >
                   {!user ? 'Login to Enroll' : 'Proceed to Payment (Razorpay)'}
                 </button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yoga;

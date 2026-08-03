
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, ArrowLeft, Mail } from 'lucide-react';
import { useInstitution } from '../store/InstitutionContext';

const Success: React.FC = () => {
  const location = useLocation();
  const { adminSettings, user } = useInstitution();
  const { type, courseName, batchName } = (location.state as any) || { type: 'beautician' };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center">
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center mb-8 animate-bounce">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Enrollment Successful!</h1>
        <p className="text-lg text-[#6b645a] mb-6 leading-relaxed">
          Thank you for choosing Sadha Institution. Your registration for <span className="font-bold text-[#4a443d]">{courseName || 'Professional Beautician Course'}</span> is confirmed.
        </p>

        <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-10 bg-green-50 py-3 rounded-2xl border border-green-100">
          <Mail size={20} />
          <span>Confirmation email sent to {user?.email}</span>
        </div>

        {type === 'yoga' ? (
          <div className="bg-white p-8 rounded-3xl border-2 border-[#ede6d9] shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-6">Next Steps for Yoga</h2>
            <div className="space-y-6 text-left">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                   <p className="font-bold text-[#4a443d]">Join the WhatsApp Group</p>
                   <p className="text-sm text-[#6b645a]">All live class links and updates are shared here.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                   <p className="font-bold text-[#4a443d]">Prepare your Space</p>
                   <p className="text-sm text-[#6b645a]">Keep a yoga mat, water bottle, and stable internet ready.</p>
                </div>
              </div>
            </div>
            <a 
              href={adminSettings.whatsappGroupLink}
              target="_blank"
              rel="noreferrer"
              className="mt-10 w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-lg hover:bg-green-600 transition flex items-center justify-center gap-3 shadow-lg"
            >
              <MessageSquare size={24} /> Join WhatsApp Group
            </a>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border-2 border-[#ede6d9] shadow-lg mb-8">
             <h2 className="text-xl font-bold mb-4">Immediate Access Granted</h2>
             <p className="text-[#6b645a] mb-8">You can now view all recorded lessons for the next 30 days.</p>
             <Link 
              to="/beautician" 
              className="block w-full py-4 bg-[#c2b280] text-white rounded-2xl font-bold text-lg hover:bg-[#a89462] transition shadow-lg"
             >
               Go to Course Dashboard
             </Link>
          </div>
        )}

        <Link to="/" className="text-[#c2b280] font-bold flex items-center justify-center gap-2 hover:underline">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;

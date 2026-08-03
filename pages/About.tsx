
import React from 'react';
import { CONTACT_INFO } from '../constants';
import { Heart, Award, Users, BookOpen } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=800" 
                alt="Sadha Laxmi Instructor" 
                className="rounded-3xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f5f2eb] rounded-full z-0"></div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-6">
            <span className="text-[#c2b280] font-bold uppercase tracking-widest text-sm">Certified Instructor</span>
            <h1 className="text-4xl font-bold text-[#4a443d]">Sadha Laxmi</h1>
            <p className="text-lg text-[#6b645a] leading-relaxed">
              Sadha Laxmi is a certified yoga trainer with over 2 years of experience, having trained 500+ students across different age groups. 
            </p>
            <p className="text-lg text-[#6b645a] leading-relaxed">
              Her teaching focuses on holistic wellness through breath, movement, and mindfulness, specializing in weight management, kids yoga, and general fitness. Beyond yoga, she is dedicated to professional beauty education, empowering students to start their own careers.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="flex items-center gap-3">
                <Award className="text-[#c2b280]" />
                <span className="font-bold">2+ Years Exp</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-[#c2b280]" />
                <span className="font-bold">500+ Students</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="text-[#c2b280]" />
                <span className="font-bold">Certified Pro</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="text-[#c2b280]" />
                <span className="font-bold">Holistic Focus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institution Mission */}
      <section className="py-20 bg-[#fdfbf7] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 italic">"Our mission is to bridge the gap between physical health and inner peace through accessible, premium education."</h2>
          <div className="w-20 h-1 bg-[#c2b280] mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto bg-[#fcfaf7] p-10 md:p-20 rounded-[3rem] border border-[#ede6d9] shadow-sm">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Email</div>
                  <div className="text-lg font-bold text-[#c2b280]">{CONTACT_INFO.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Phone / WhatsApp</div>
                  <div className="text-lg font-bold text-[#c2b280]">{CONTACT_INFO.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 uppercase font-bold tracking-widest mb-1">Address</div>
                  <div className="text-lg font-bold text-[#c2b280]">{CONTACT_INFO.address}</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-[#ede6d9]">
               <h3 className="text-xl font-bold mb-4">Follow on Instagram</h3>
               <p className="text-[#6b645a] mb-6">Stay updated with daily tips and student highlights.</p>
               <a 
                href={CONTACT_INFO.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-3 bg-[#c2b280] text-white rounded-xl font-bold hover:bg-[#a89462] transition"
               >
                 View Profile
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

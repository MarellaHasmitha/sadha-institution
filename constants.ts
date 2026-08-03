
import { YogaCourse, Batch } from './types';

export const INITIAL_YOGA_COURSES: YogaCourse[] = [
  { id: 'wt-gain', name: 'Weight Gain Yoga', price: 500, description: 'Boost metabolism and healthy weight gain.', enabled: false },
  { id: 'wt-loss', name: 'Weight Loss Yoga', price: 400, description: 'Effective postures for weight management.', enabled: false },
  { id: 'kids', name: 'Kids Yoga', price: 200, description: 'Fun and focus for the young ones.', enabled: false },
  { id: 'general', name: 'General Yoga', price: 300, description: 'Daily wellness and flexibility.', enabled: false },
];

export const INITIAL_BATCHES: Batch[] = [
  { id: 'morning', name: 'Morning Batch', time: '5:00 AM – 6:00 AM', enabled: false },
  { id: 'evening', name: 'Evening Batch', time: '5:00 PM – 6:00 PM', enabled: false },
];

export const COLORS = {
  primary: '#c2b280', // Sand Beige
  background: '#fcfaf7',
  text: '#4a443d',
  accent: '#a89462',
};

export const CONTACT_INFO = {
  phone: '919441988463', // Added 91 for WhatsApp wa.me compatibility
  email: 'sadhachowdhary@gmail.com',
  instagram: 'https://www.instagram.com/sadha_chowdhary',
  address: 'Yoga Street, Green Valley Area, Bengaluru – 560001',
  upi: '9441988463@ybl',
  messages: {
    notify: encodeURIComponent("Hi Sadha Institution, I am interested in joining the Yoga sessions. Please notify me when registrations open!"),
    general: encodeURIComponent("Hi, I have a query regarding the courses at Sadha Institution."),
  }
};

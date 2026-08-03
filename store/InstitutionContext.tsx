
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, YogaCourse, Batch, AdminSettings, Enrollment, BeauticianVideo } from '../types';
import { INITIAL_YOGA_COURSES, INITIAL_BATCHES } from '../constants';

interface EmailNotification {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  status: 'sent' | 'pending' | 'failed';
}

interface InstitutionContextType {
  user: User | null;
  registeredUsers: User[];
  adminSettings: AdminSettings;
  courses: YogaCourse[];
  batches: Batch[];
  enrollments: Enrollment[];
  sentEmails: EmailNotification[];
  latestEmail: EmailNotification | null;
  login: (email: string, password: string, role: UserRole) => { success: boolean; message: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  resetPassword: (email: string) => { success: boolean; message: string };
  updateAdminSettings: (settings: Partial<AdminSettings>) => void;
  updateCourses: (courses: YogaCourse[]) => void;
  updateBatches: (batches: Batch[]) => void;
  enrollInYoga: (courseId: string, batchId: string) => void;
  enrollInBeautician: () => void;
  addVideo: (video: BeauticianVideo) => void;
  clearEmails: () => void;
  dismissToast: () => void;
  sendManualTestEmail: () => void;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export const InstitutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sadha_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sadha_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('sadha_settings');
    return saved ? JSON.parse(saved) : {
      yogaRegistrationsOpen: false,
      registrationClosingDate: '',
      registrationOpeningDate: '',
      whatsappGroupLink: 'https://chat.whatsapp.com/mock-link',
      beauticianEnabled: true,
      beauticianPrice: 1000,
      beauticianVideos: [
        { 
          url: 'https://www.w3schools.com/html/mov_bbb.mp4', 
          title: 'Introduction to Skincare', 
          description: 'Understanding basic skin types and preparation for makeup.' 
        },
        { 
          url: 'https://www.w3schools.com/html/movie.mp4', 
          title: 'Basic Foundation Routine', 
          description: 'Step-by-step guide to achieving a flawless base.' 
        }
      ],
      adminPassword: 'admin123',
      smtpConfig: {
        server: 'smtp.gmail.com',
        port: 587,
        user: 'sadhachowdhary@gmail.com',
        pass: 'xrll erou rynk mowi'
      }
    };
  });

  const [courses, setCourses] = useState<YogaCourse[]>(() => {
    const saved = localStorage.getItem('sadha_courses');
    return saved ? JSON.parse(saved) : INITIAL_YOGA_COURSES;
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('sadha_batches');
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    const saved = localStorage.getItem('sadha_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [sentEmails, setSentEmails] = useState<EmailNotification[]>(() => {
    const saved = localStorage.getItem('sadha_sent_emails');
    return saved ? JSON.parse(saved) : [];
  });

  const [latestEmail, setLatestEmail] = useState<EmailNotification | null>(null);

  useEffect(() => {
    localStorage.setItem('sadha_user', JSON.stringify(user));
    localStorage.setItem('sadha_registered_users', JSON.stringify(registeredUsers));
    localStorage.setItem('sadha_settings', JSON.stringify(adminSettings));
    localStorage.setItem('sadha_courses', JSON.stringify(courses));
    localStorage.setItem('sadha_batches', JSON.stringify(batches));
    localStorage.setItem('sadha_enrollments', JSON.stringify(enrollments));
    localStorage.setItem('sadha_sent_emails', JSON.stringify(sentEmails));
  }, [user, registeredUsers, adminSettings, courses, batches, enrollments, sentEmails]);

  const sendMockEmail = (to: string, subject: string, body: string) => {
    const newEmail: EmailNotification = {
      id: Math.random().toString(36).substr(2, 9),
      from: adminSettings.smtpConfig.user,
      to,
      subject,
      body,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
    setSentEmails(prev => [newEmail, ...prev]);
    setLatestEmail(newEmail);
  };

  const sendManualTestEmail = () => {
    sendMockEmail(adminSettings.smtpConfig.user, 'SMTP Server Test', 'This is a test message to verify that your mail server simulation is correctly configured.');
  };

  const signup = (name: string, email: string, password: string) => {
    const exists = registeredUsers.find(u => u.email === email);
    if (exists) return { success: false, message: 'User already exists with this email.' };
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, name, password, role: UserRole.USER, enrolledCourses: [] };
    setRegisteredUsers(prev => [...prev, newUser]);
    sendMockEmail(email, 'Welcome to Sadha Institution!', `Dear ${name},\nYour account has been created successfully. Explore our Yoga and Beautician courses today.`);
    return { success: true, message: 'Signup successful! Please login.' };
  };

  const login = (email: string, password: string, role: UserRole) => {
    if (role === UserRole.ADMIN) {
      if (email === 'sadhachowdhary@gmail.com' && password === adminSettings.adminPassword) {
        const adminUser: User = { id: 'admin', email, name: 'Admin', role: UserRole.ADMIN, enrolledCourses: [] };
        setUser(adminUser);
        return { success: true, message: 'Admin login successful' };
      }
      return { success: false, message: 'Invalid admin credentials' };
    }
    const existingUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (existingUser) {
      setUser(existingUser);
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => setUser(null);
  const resetPassword = (email: string) => {
    sendMockEmail(email, 'Password Reset Link', `A password reset was requested for your Sadha Institution account. If this was not you, please ignore this email.`);
    return { success: true, message: 'Password reset link sent.' };
  };

  const updateAdminSettings = (settings: Partial<AdminSettings>) => setAdminSettings(prev => ({ ...prev, ...settings }));
  const updateCourses = (newCourses: YogaCourse[]) => setCourses(newCourses);
  const updateBatches = (newBatches: Batch[]) => setBatches(newBatches);

  const enrollInYoga = (courseId: string, batchId: string) => {
    if (!user) return;
    const course = courses.find(c => c.id === courseId);
    const batch = batches.find(b => b.id === batchId);
    if (!course || !batch) return;
    const newEnrollment: Enrollment = { id: `ENR-${Date.now()}`, userId: user.id, courseId, batchId, paymentId: `PAY-${Date.now()}`, date: new Date().toISOString(), courseName: course.name, batchName: batch.name, userName: user.name };
    setEnrollments(prev => [...prev, newEnrollment]);
    const updatedUser = { ...user, enrolledCourses: [...user.enrolledCourses, courseId] };
    setUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    sendMockEmail(user.email, 'Yoga Course Enrollment Confirmed!', `Dear ${user.name},\nYou have successfully enrolled in ${course.name} (${batch.name}). We look forward to seeing you in class!`);
  };

  const enrollInBeautician = () => {
    if (!user) return;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    const newEnrollment: Enrollment = { id: `ENR-BEAU-${Date.now()}`, userId: user.id, courseId: 'beautician', batchId: 'recorded', paymentId: `PAY-${Date.now()}`, date: new Date().toISOString(), courseName: 'Professional Beautician Course', batchName: 'Recorded Access', userName: user.name };
    setEnrollments(prev => [...prev, newEnrollment]);
    const updatedUser = { ...user, enrolledCourses: [...user.enrolledCourses, 'beautician'], beauticianAccessExpiry: expiryDate.toISOString() };
    setUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    sendMockEmail(user.email, 'Beautician Course Access Active', `Dear ${user.name},\nYour 30-day access to the Professional Beautician Course is now active. Log in to start your learning journey.`);
  };

  const addVideo = (video: BeauticianVideo) => {
    setAdminSettings(prev => ({ ...prev, beauticianVideos: [...prev.beauticianVideos, video] }));
  };

  const clearEmails = () => setSentEmails([]);
  const dismissToast = () => setLatestEmail(null);

  return (
    <InstitutionContext.Provider value={{ 
      user, registeredUsers, adminSettings, courses, batches, enrollments, sentEmails, latestEmail,
      login, signup, logout, resetPassword, updateAdminSettings, updateCourses, updateBatches,
      enrollInYoga, enrollInBeautician, addVideo, clearEmails, dismissToast, sendManualTestEmail
    }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (!context) throw new Error('useInstitution must be used within InstitutionProvider');
  return context;
};

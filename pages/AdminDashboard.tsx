
import React, { useState, useRef, useEffect } from 'react';
import { useInstitution } from '../store/InstitutionContext';
import { UserRole, Enrollment } from '../types';
import { Navigate } from 'react-router-dom';
import { Settings, Users, BookOpen, Video, Key, Mail, Upload, FileVideo, Trash2, Check, X, ShieldAlert, Send, Activity, Server, Search, Download, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user, adminSettings, courses, batches, enrollments, sentEmails, updateAdminSettings, updateCourses, updateBatches, addVideo, clearEmails, sendManualTestEmail } = useInstitution();
  const [activeTab, setActiveTab] = useState<'settings' | 'yoga' | 'beautician' | 'students' | 'emails' | 'profile'>('settings');
  const [studentSubTab, setStudentSubTab] = useState<'yoga' | 'beautician'>('yoga');
  const [studentSearch, setStudentSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB');
  };

  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  useEffect(() => {
    setValidations({
      length: newAdminPassword.length >= 8,
      upper: /[A-Z]/.test(newAdminPassword),
      lower: /[a-z]/.test(newAdminPassword),
      number: /[0-9]/.test(newAdminPassword),
      special: /[@$!%*?&]/.test(newAdminPassword),
    });
  }, [newAdminPassword]);

  const isPasswordStrong = Object.values(validations).every(Boolean);

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/login" />;
  }

  const exportToCSV = (type: 'yoga' | 'beautician') => {
    const data = enrollments.filter(e => type === 'yoga' ? e.courseId !== 'beautician' : e.courseId === 'beautician');
    const headers = ['Enrollment ID', 'Student Name', 'Course', 'Batch/Access', 'Date', 'Payment ID'];
    const csvRows = [headers];

    data.forEach(enr => {
      csvRows.push([
        enr.id,
        enr.userName,
        enr.courseName,
        enr.batchName,
        formatDate(enr.date),
        enr.paymentId
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sadha_Institution_${type}_Students_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTestSmtp = () => {
    setIsTestingSmtp(true);
    setTimeout(() => {
      sendManualTestEmail();
      setIsTestingSmtp(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!videoTitle) {
        alert('Please enter a lesson title first!');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setIsUploading(true);
      setTimeout(() => {
        const videoUrl = URL.createObjectURL(file);
        addVideo({
          url: videoUrl,
          title: videoTitle,
          description: videoDesc || 'No description provided.'
        });
        setIsUploading(false);
        setVideoTitle('');
        setVideoDesc('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1500);
    }
  };

  const toggleCourse = (id: string) => {
    const updated = courses.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c);
    updateCourses(updated);
  };

  const toggleBatch = (id: string) => {
    const updated = batches.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b);
    updateBatches(updated);
  };

  const filteredEnrollments = enrollments.filter(e => {
    const isCorrectType = studentSubTab === 'yoga' ? e.courseId !== 'beautician' : e.courseId === 'beautician';
    const matchesSearch = e.userName.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          e.courseName.toLowerCase().includes(studentSearch.toLowerCase());
    return isCorrectType && matchesSearch;
  });

  const TabButton = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-bold text-sm whitespace-nowrap ${
        activeTab === id ? 'border-[#c2b280] text-[#c2b280]' : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const ValidationItem = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${met ? 'text-green-500' : 'text-gray-300'}`}>
      {met ? <Check size={12} /> : <X size={12} />}
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      <div className="bg-white border-b border-[#ede6d9] sticky top-16 z-30 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex">
          <TabButton id="settings" icon={Settings} label="Global Settings" />
          <TabButton id="yoga" icon={BookOpen} label="Yoga Management" />
          <TabButton id="beautician" icon={Video} label="Beautician Course" />
          <TabButton id="students" icon={Users} label="Enrolled Students" />
          <TabButton id="emails" icon={Mail} label="Email Server" />
          <TabButton id="profile" icon={Key} label="Admin Profile" />
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {activeTab === 'settings' && (
          <div className="animate-scale-in space-y-6">
            <h2 className="text-2xl font-bold">Global Control</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2">Registration Status</h3>
                  <p className="text-sm text-gray-400 mb-6">Master switch for all live programs.</p>
                </div>
                <button 
                  onClick={() => updateAdminSettings({ yogaRegistrationsOpen: !adminSettings.yogaRegistrationsOpen })}
                  className={`w-full py-4 rounded-full font-bold transition-all shadow-md ${adminSettings.yogaRegistrationsOpen ? 'bg-green-500 text-white' : 'bg-red-50 text-white'}`}
                >
                  {adminSettings.yogaRegistrationsOpen ? 'REGISTRATIONS OPEN' : 'REGISTRATIONS CLOSED'}
                </button>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm space-y-6">
                <h3 className="text-lg font-bold">Registration Dates</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Opening Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="date" 
                        value={adminSettings.registrationOpeningDate}
                        onChange={(e) => updateAdminSettings({ registrationOpeningDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 outline-none focus:border-[#c2b280]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Closing Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input 
                        type="date" 
                        value={adminSettings.registrationClosingDate}
                        onChange={(e) => updateAdminSettings({ registrationClosingDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-100 outline-none focus:border-[#c2b280]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'yoga' && (
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-2xl font-bold">Yoga Program Management</h2>
            <div className="bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm">
              <h3 className="font-bold mb-6 text-[#c2b280] uppercase tracking-widest text-xs">Manage Courses</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {courses.map(course => (
                  <button
                    key={course.id}
                    onClick={() => toggleCourse(course.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${course.enabled ? 'border-[#c2b280] bg-[#fdfbf7]' : 'border-gray-100 opacity-60'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{course.name}</span>
                      {course.enabled && <Check size={16} className="text-[#c2b280]" />}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">₹{course.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm">
              <h3 className="font-bold mb-6 text-[#c2b280] uppercase tracking-widest text-xs">Active Batches</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {batches.map(batch => (
                  <button
                    key={batch.id}
                    onClick={() => toggleBatch(batch.id)}
                    className={`p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${batch.enabled ? 'border-[#c2b280] bg-[#fdfbf7]' : 'border-gray-100 opacity-60'}`}
                  >
                    <div>
                      <div className="font-bold">{batch.name}</div>
                      <div className="text-xs text-gray-400 font-bold uppercase">{batch.time}</div>
                    </div>
                    {batch.enabled ? <Check className="text-[#c2b280]" /> : <X className="text-gray-300" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'beautician' && (
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-2xl font-bold">Beautician Course Content</h2>
            <div className="bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Lesson Title"
                  className="w-full p-4 rounded-xl border border-gray-100 outline-none focus:border-[#c2b280]"
                />
                <input 
                  type="text" 
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="Short Description"
                  className="w-full p-4 rounded-xl border border-gray-100 outline-none focus:border-[#c2b280]"
                />
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${isUploading ? 'bg-gray-50 border-gray-200 pointer-events-none' : 'bg-[#fcfaf7] border-[#ede6d9] hover:border-[#c2b280]'}`}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/*" className="hidden" />
                {isUploading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#c2b280] border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold text-[#c2b280]">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-[#c2b280] mb-2" />
                    <p className="font-bold text-[#4a443d]">Click to add lesson</p>
                  </>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-xs text-gray-400 uppercase tracking-widest mt-8">Module List</h3>
                {adminSettings.beauticianVideos.map((v, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#fcfaf7] p-4 rounded-2xl border border-gray-100 group">
                    <FileVideo className="text-[#c2b280]" size={20} />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{v.title}</div>
                      <div className="text-[10px] text-gray-400 truncate">{v.description}</div>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = adminSettings.beauticianVideos.filter((_, idx) => idx !== i);
                        updateAdminSettings({ beauticianVideos: updated });
                      }}
                      className="text-red-400 hover:text-red-600 transition p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6 animate-scale-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-4">Enrollment Database</h2>
                <div className="flex bg-white p-1 rounded-2xl border border-[#ede6d9] w-fit">
                  <button 
                    onClick={() => setStudentSubTab('yoga')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition ${studentSubTab === 'yoga' ? 'bg-[#c2b280] text-white shadow-sm' : 'text-[#6b645a]'}`}
                  >
                    Yoga Students
                  </button>
                  <button 
                    onClick={() => setStudentSubTab('beautician')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition ${studentSubTab === 'beautician' ? 'bg-[#c2b280] text-white shadow-sm' : 'text-[#6b645a]'}`}
                  >
                    Beautician Students
                  </button>
                </div>
              </div>
              <div className="flex w-full md:w-auto gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search name or course..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#ede6d9] text-sm outline-none focus:border-[#c2b280]"
                  />
                </div>
                <button 
                  onClick={() => exportToCSV(studentSubTab)}
                  className="bg-[#4a443d] text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition shadow-sm"
                  title="Export to Excel (CSV)"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Excel</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-[#ede6d9] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#fcfaf7] border-b border-[#ede6d9]">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date / ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredEnrollments.length > 0 ? filteredEnrollments.map(enr => (
                      <tr key={enr.id} className="hover:bg-[#fcfaf7] transition">
                        <td className="px-6 py-4">
                          <div className="font-bold text-sm">{enr.userName}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-tight">{enr.userId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-[#c2b280]">{enr.courseName}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{enr.batchName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-xs font-bold text-[#4a443d]">{formatDate(enr.date)}</div>
                          <div className="text-[9px] text-gray-300 font-mono">{enr.paymentId}</div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-20 text-center text-gray-400 italic">No student records found in this category.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emails' && (
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-2xl font-bold">Mail Server</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <Server className="text-[#c2b280]" size={20} />
                  <h3 className="font-bold">Configuration</h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-400 font-bold uppercase">Host</span>
                    <span className="font-bold">{adminSettings.smtpConfig.server}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-400 font-bold uppercase">User</span>
                    <span className="font-bold truncate max-w-[100px]">{adminSettings.smtpConfig.user}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-bold uppercase">Status</span>
                    <span className="font-bold text-green-500">Connected</span>
                  </div>
                </div>
                <button 
                  onClick={handleTestSmtp}
                  disabled={isTestingSmtp}
                  className="w-full py-4 bg-[#c2b280] text-white rounded-xl font-bold hover:bg-[#a89462] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTestingSmtp ? 'Sending Test...' : <><Send size={16} /> Send Test Mail</>}
                </button>
              </div>

              <div className="md:col-span-2 bg-[#1a1a1a] p-8 rounded-[2rem] shadow-2xl overflow-hidden min-h-[300px]">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                  <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                    <Activity size={16} className="text-green-400" /> Transactional Logs
                  </h3>
                  <button onClick={clearEmails} className="text-[10px] text-red-400 font-bold uppercase hover:underline">Clear</button>
                </div>
                <div className="font-mono text-[11px] text-green-400/80 space-y-2 h-48 overflow-y-auto custom-scrollbar">
                  {sentEmails.length === 0 && <p className="opacity-40 italic">Waiting for system emails...</p>}
                  {sentEmails.map(email => (
                    <div key={email.id} className="border-l-2 border-green-900 pl-3">
                      <p className="text-white/60">[{new Date(email.timestamp).toLocaleTimeString()}] SENT</p>
                      <p className="text-green-300">To: {email.to}</p>
                      <p className="opacity-50">Subject: {email.subject}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8 animate-scale-in">
            <h2 className="text-2xl font-bold">Admin Profile</h2>
            <div className="bg-white p-8 rounded-3xl border border-[#ede6d9] shadow-sm space-y-8">
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-3 text-amber-800">
                <ShieldAlert size={20} className="shrink-0" />
                <div className="text-sm">
                  <p className="font-bold">Security Notice</p>
                  <p className="opacity-80">Update your dashboard access password regularly for maximum security.</p>
                </div>
              </div>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Change Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new secure password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full p-4 rounded-xl border border-gray-100 outline-none focus:border-[#c2b280] transition"
                  />
                </div>

                <div className="p-6 bg-[#fcfaf7] rounded-2xl border border-gray-100 grid grid-cols-2 gap-3">
                  <ValidationItem label="8+ Chars" met={validations.length} />
                  <ValidationItem label="Uppercase" met={validations.upper} />
                  <ValidationItem label="Lowercase" met={validations.lower} />
                  <ValidationItem label="Number" met={validations.number} />
                  <ValidationItem label="Special (@$!)" met={validations.special} />
                </div>

                <button 
                  onClick={() => {
                    if (isPasswordStrong) {
                      updateAdminSettings({ adminPassword: newAdminPassword });
                      alert('Dashboard password updated!');
                      setNewAdminPassword('');
                    }
                  }}
                  disabled={!isPasswordStrong}
                  className="w-full bg-[#c2b280] text-white py-4 rounded-xl font-bold transition hover:bg-[#a89462] shadow-md disabled:opacity-50"
                >
                  Update Admin Access
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInstitution } from '../store/InstitutionContext';
import { UserRole } from '../types';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useInstitution();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fdfbf7]/80 backdrop-blur-md border-b border-[#ede6d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#4a443d] tracking-tight">Sadha <span className="text-[#c2b280]">Institution</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#4a443d] hover:text-[#c2b280] font-medium transition">Home</Link>
            <Link to="/yoga" className="text-[#4a443d] hover:text-[#c2b280] font-medium transition">Yoga</Link>
            <Link to="/beautician" className="text-[#4a443d] hover:text-[#c2b280] font-medium transition">Beautician</Link>
            <Link to="/about" className="text-[#4a443d] hover:text-[#c2b280] font-medium transition">About</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === UserRole.ADMIN && (
                  <Link to="/admin" className="bg-[#c2b280] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#a89462] transition">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="text-[#4a443d] hover:text-red-500 transition">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-[#c2b280] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#a89462] transition shadow-md">Login</Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#4a443d]">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#fdfbf7] border-b border-[#ede6d9] animate-fade-in-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#4a443d] font-medium">Home</Link>
            <Link to="/yoga" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#4a443d] font-medium">Yoga</Link>
            <Link to="/beautician" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#4a443d] font-medium">Beautician</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#4a443d] font-medium">About</Link>
            {user ? (
              <>
                {user.role === UserRole.ADMIN && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#c2b280] font-bold">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="block w-full px-3 py-2 text-red-500 font-medium">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 bg-[#c2b280] text-white rounded-lg mx-4">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

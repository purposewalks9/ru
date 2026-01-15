import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Menu,
  LogOut,
  User,
  ChevronDown,
  Bell,
  Search,
  Settings,
  CreditCard,
  Sparkles
} from 'lucide-react';

const Header = ({ activeTab, toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    HeaderData();
  }, []);

  const HeaderData = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setHeaderData(data);
    } catch (error) {
      console.error('Error fetching story:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to login page after sign out
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-18 flex items-center justify-between px-8 bg-white backdrop-blur-xl border-b border-gray-100">
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <button
          onClick={toggleSidebar}
          className="p-2.5 -ml-2 text-slate-500 rounded-xl md:hidden hover:bg-slate-100 transition-all active:scale-95"
          aria-label="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        <div className="hidden lg:flex flex-col">
          <h2 className="text-xl font-bold text-black tracking-tight leading-none">
            Welcome Back
          </h2>
          <span className="text-slate-400 text-sm mt-1">
            {headerData?.name || 'Admin'}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
    

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`
              flex items-center gap-3 p-1 pr-3 rounded-2xl transition-all
              
            `}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#E9C236] flex items-center justify-center text-black shadow-lg shadow-blue-500/20">
                <User size={18} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="hidden lg:block text-left">
              <p className="text-sm font-bold text-black leading-none">
                {headerData?.name || 'Admin User'}
              </p>
              <p className="text-[10px] text-gray-700 font-semibold mt-1">Super Administrator</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200/60 rounded-[1.5rem] shadow-2xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Status</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    window.dispatchEvent(new CustomEvent('admin:navigate', {
                      detail: 'profile'
                    }));
                  }}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-slate-600 font-medium hover:bg-slate-50 rounded-xl mx-2"
                >
                  <User size={16} className="mr-3" />
                  Profile Settings
                </button>

                <div className="mt-3 pt-2 border-t border-slate-100 px-2">
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} className="mr-3" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [footerData, setFooterData] = useState(null);
  const hoverTimer = useRef(null);
  const isMounted = useRef(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // load footer from cache or supabase
  useEffect(() => {
    isMounted.current = true;
    const cached = sessionStorage.getItem('rwu_footer');
    if (cached) {
      try {
        setFooterData(JSON.parse(cached));
      } catch (e) {
        sessionStorage.removeItem('rwu_footer');
        fetchFooterData();
      }
    } else {
      fetchFooterData();
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchFooterData = async () => {
    try {
      const { data, error } = await supabase
        .from('footer')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setFooterData(data);
        try {
          sessionStorage.setItem('rwu_footer', JSON.stringify(data));
        } catch (e) {
          // ignore storage errors
        }
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  // Prefetch recruit settings (cached in sessionStorage)
  const prefetchRecruitSettings = async () => {
    const key = 'rwu_recruit_settings';
    if (sessionStorage.getItem(key)) return; // already cached

    try {
      const { data, error } = await supabase
        .from('recruit_page_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        sessionStorage.setItem(key, JSON.stringify(data));
      } else {
        // no row yet — store an explicit marker to avoid repeated queries
        sessionStorage.setItem(key, JSON.stringify({ __empty: true }));
      }
    } catch (err) {
      // fail silently, do not block navigation
      console.warn('Prefetch recruit settings failed', err);
    }
  };

  // Handlers for hover/click prefetch
  const handleRecruitMouseEnter = () => {
    // small delay so we don't prefetch on accidental touches
    hoverTimer.current = setTimeout(prefetchRecruitSettings, 200);
  };
  const handleRecruitMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  const handleRecruitClick = () => {
    // try to prefetch eagerly on click (fire-and-forget)
    prefetchRecruitSettings();
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Press & Articles', href: '/press' },
    { name: 'Success Stories', href: '/stories' },
    { name: 'Our Team', href: '/team' },
    { name: 'Career Advice', href: '/career' },
    { name: 'About', href: '/about' },
  ];

  const isActive = (href) => location.pathname === href;
  const isRecruitActive = location.pathname === '/recruit';

  return (
    <>
      <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src={footerData?.logo_url}
                alt="RWU Inc. Logo"
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-black bg-gray-100 font-bold'
                      : 'text-gray-700 hover:text-[#478100] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden lg:block">
              <Link
                to="/recruit"
                onMouseEnter={handleRecruitMouseEnter}
                onMouseLeave={handleRecruitMouseLeave}
                onClick={handleRecruitClick}
                className={`px-5 py-2 text-sm font-medium rounded-md transition-colors ${
                  isRecruitActive
                    ? 'bg-[#356800] text-white shadow-inner font-bold' // active style
                    : 'bg-[#478100] text-white hover:bg-[#3d6f00]'
                }`}
              >
                Recruit with us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen' : 'max-h-0'
          }`}
        >
          <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'text-[#478100] bg-green-50'
                    : 'text-gray-700 hover:text-[#478100] hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                to="/recruit"
                onMouseEnter={handleRecruitMouseEnter}
                onMouseLeave={handleRecruitMouseLeave}
                onClick={handleRecruitClick}
                className={`block w-full px-4 py-3 text-base font-medium rounded-md transition-colors text-center ${
                  isRecruitActive
                    ? 'bg-[#356800] text-white shadow-inner font-bold'
                    : 'bg-[#478100] text-white hover:bg-[#3d6f00]'
                }`}
              >
                Recruit with us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}
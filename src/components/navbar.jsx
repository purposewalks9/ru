import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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
    { name: 'About', href: '/about' }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768088037/Frame_2147226388_qcr7fp.png" 
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
              <button className="px-5 py-2 bg-[#478100] text-white text-sm font-medium rounded-md hover:bg-[#3d6f00] transition-colors">
                Join Us
              </button>
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
              <button className="w-full px-4 py-3 bg-[#478100] text-white text-base font-medium rounded-md hover:bg-[#3d6f00] transition-colors">
                Join Us
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
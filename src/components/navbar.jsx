import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Press & Awards', href: '/press' },
    { name: 'Success Stories', href: '/stories' },
    { name: 'Our Team', href: '/team' },
    { name: 'Career Advice', href: '/career' },
    { name: 'About', href: '/about' }
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="md:w-20 w-20 h-auto md:ml-0 ml-4">
            <img 
              src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768088037/Frame_2147226388_qcr7fp.png" 
              alt="RWU Inc. Logo" 
              className="w-full h-auto object-cover" 
            />
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-black font-semibold'
                    : 'text-gray-700 hover:text-[#478100] hover:bg-gray-50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[36px] h-1 bg-[#E9C236]"></span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <button className="px-6 py-2.5 border-[#478100] border text-black text-[12px] font-medium rounded-lg hover:bg-[#478100] hover:text-white transition-all duration-300">
              Join Us
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-gradient-to-br from-white to-gray-50 shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <div className="w-20">
              <img 
                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768088037/Frame_2147226388_qcr7fp.png" 
                alt="RWU Inc. Logo" 
                className="w-full h-auto" 
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={24} className="text-gray-700" />
            </button>
          </div>

          <div className="p-6 space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center justify-between px-5 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-[#478100] to-[#5a9e00] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-[#478100] shadow-sm hover:shadow-md'
                }`}
                style={{
                  animation: isOpen ? `slideIn 0.3s ease-out ${index * 0.05}s both` : 'none'
                }}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-base">{item.name}</span>
                <ChevronRight 
                  size={20} 
                  className={`transform transition-transform duration-300 ${
                    isActive(item.href) ? 'text-[#E9C236]' : 'group-hover:translate-x-1'
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200">
            <button 
              className="w-full px-6 py-4 bg-gradient-to-r from-[#478100] to-[#5a9e00] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => setIsOpen(false)}
            >
              Join Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


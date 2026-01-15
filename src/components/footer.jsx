import React, { useState } from 'react';
import {  ChevronDown, ChevronUp, Mail, MapPin, Phone } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaDribbble, FaInstagram, FaFacebook } from "react-icons/fa";


export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const socialLinks = [
    { icon: <FaTwitter />, link: "#" },
    { icon: <FaLinkedin />, link: "#" },
    { icon: <FaFacebook />, link: "#" },
    { icon: <FaGithub />, link: "#" },
    { icon: <FaDribbble />, link: "#" },
    { icon: <FaInstagram />, link: "#" }
  ];

  return (
    <footer className="bg-gray-50 text-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
           <div className="md:w-20 w-20 h-auto">
            <img 
              src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768088037/Frame_2147226388_qcr7fp.png" 
              alt="RWU Inc. Logo" 
              className="w-full h-auto object-cover" 
            />
          </div>
            <p className="md:text-sm text-[14px] mb-4 leading-relaxed p-4">
              Connecting talented professionals with remote opportunities worldwide.
            </p>
            <div className="space-y-4 md:text-sm text-gray-700 text-[12px] px-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-black" />
                <span>Remote First • Global Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-black" />
                <span>Support: +1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-black" />
                <span>hello@rwu-inc.com</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => toggleSection('jobs')}
              className="flex justify-between items-center w-full px-4  md:cursor-default"
            >
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                Find Jobs
              </h3>
              <span className="md:hidden">
                {openSection === 'jobs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`space-y-3 text-gray-800 md:text-sm text-[12px] transition-all duration-300 overflow-hidden px-4 mt-4 ${openSection === 'jobs' ? 'max-h-96 mb-4' : 'max-h-0'} md:max-h-none md:block`}>
              <li><a href="#" className="hover:text-gray-800 transition-colors flex items-center gap-2 group">
                Remote Jobs
              </a></li>
              <li><a href="#" className="hover:text-gray-800 transition-colors flex items-center gap-2 group">
                Entry Level
              </a></li>
              <li><a href="#" className="hover:text-gray-800 transition-colors flex items-center gap-2 group">
                Part-Time
              </a></li>
              <li><a href="#" className="hover:text-gray-800 transition-colors flex items-center gap-2 group">
                Freelance
              </a></li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => toggleSection('about')}
              className="flex justify-between items-center w-full px-4 md:cursor-default"
            >
              <h3 className="font-semibold text-black text-sm md:text-base">
                Company
              </h3>
              <span className="md:hidden">
                {openSection === 'about' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-gray-800 md:text-sm text-[12px] transition-all duration-300 overflow-hidden px-4 mt-4 ${openSection === 'about' ? 'max-h-96 mb-4' : 'max-h-0'} md:max-h-none md:block`}>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                About Us
              </a></li>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Careers
              </a></li>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Contact
              </a></li>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Blog
              </a></li>
            </ul>
          </div>

          <div>
            <button
              onClick={() => toggleSection('resources')}
              className="flex justify-between items-center w-full px-4  md:cursor-default"
            >
              <h3 className="font-semibold text-black text-sm md:text-base">
                Resources
              </h3>
              <span className="md:hidden">
                {openSection === 'resources' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-gray-800 md:text-sm text-[12px] transition-all duration-300 overflow-hidden px-4 mt-4 ${openSection === 'resources' ? 'max-h-96 mb-4' : 'max-h-0'} md:max-h-none md:block`}>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Resume Guide
              </a></li>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Interview Tips
              </a></li>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Salary Calculator
              </a></li>
              <li><a href="#" className="hover:text-black transition-colors flex items-center gap-2 group">
                Career Advice
              </a></li>
            </ul>
          </div>
        </div>

        <div className=" mb-8">
          <div className="flex flex-col md:flex-row md:justify-between justify-center items-start px-4 gap-8">
            <div className="flex-1 max-w-md">
              <h4 className="font-semibold text-black text-sm mb-3">Stay Updated</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-200 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-[#478100] hover:bg-[#2d4e04] text-white rounded-lg text-sm font-medium transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Get the latest remote job opportunities</p>
            </div>

            <div className="flex gap-4 justify-center mt-4">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.link} className="text-gray-600 hover:text-green-600">{s.icon}</a>
              ))}
            </div>

          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-gray-800 ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-800 ">
              © 2023 RWU Inc. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
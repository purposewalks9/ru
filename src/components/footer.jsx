import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Mail, MapPin, Phone } from 'lucide-react';
import { FaTwitter, FaLinkedin, FaGithub, FaDribbble, FaInstagram, FaFacebook } from "react-icons/fa";
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const [footerData, setFooterData] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    fetchFooterData();
    fetchSocialLinks();
  }, []);

  const fetchFooterData = async () => {
    try {
      const { data, error } = await supabase
        .from('footer')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setFooterData(data);
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setSocialLinks(data);
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      twitter: <FaTwitter />,
      linkedin: <FaLinkedin />,
      facebook: <FaFacebook />,
      github: <FaGithub />,
      dribbble: <FaDribbble />,
      instagram: <FaInstagram />
    };
    return icons[iconName?.toLowerCase()] || <FaLinkedin />;
  };

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
              {footerData?.description || 'Connecting talented professionals with remote opportunities worldwide.'}
            </p>
            <div className="space-y-4 md:text-sm text-gray-700 text-[12px] px-4">
              {footerData?.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-black" />
                  <span>{footerData.location}</span>
                </div>
              )}
              {footerData?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-black" />
                  <span>{footerData.phone}</span>
                </div>
              )}
              {footerData?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-black" />
                  <span>{footerData.email}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={() => toggleSection('jobs')}
              className="flex justify-between items-center w-full px-4 md:cursor-default"
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
              className="flex justify-between items-center w-full px-4 md:cursor-default"
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

        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between justify-center items-start px-4 gap-8">
            <div className="flex-1 max-w-md">
              {/* Removed newsletter form as requested */}
            </div>

            {socialLinks.length > 0 && (
              <div className="flex gap-4 justify-center mt-4">
                {socialLinks.map((link) => (
                  <a 
                    key={link.id} 
                    href={link.url || '#'} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-green-600 text-xl"
                  >
                    {getIconComponent(link.icon)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-800">
              {footerData?.copyright_text || '© 2023 RWU Inc. All rights reserved.'}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
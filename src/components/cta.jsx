import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust your path

export default function CTABannerSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ctaData, setCtaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCtaData();
  }, []);

  const fetchCtaData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cta_banner')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setCtaData(data);
    } catch (error) {
      console.error('Error fetching CTA data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (loading) {
    return (
      <div className="py-20 px-4 bg-gray-100 animate-pulse">
        <div className="max-w-5xl mx-auto text-center p-8">
          <div className="h-8 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
        </div>
      </div>
    );
  }

  if (!ctaData) {
    return (
      <div className="py-20 px-4 bg-[#478100]">
        <div className="max-w-5xl mx-auto text-center p-8">
          <h2 className="text-3xl font-bold text-white">
            Default CTA Headline
          </h2>
        </div>
      </div>
    );
  }

  // Dynamically build the headline with highlighted word
  const headlineParts = ctaData.headline.split(ctaData.highlighted_word);
  
  return (
    <div style={{
      backgroundImage: ctaData.background_image_url ? `url('${ctaData.background_image_url}')` : 'none',
      backgroundColor: ctaData.background_color || '#478100',
      backgroundPosition: "center",
      backgroundSize: "cover", 
      backgroundRepeat: "no-repeat",
    }} className="py-20 px-4 sm:px-6 lg:px-8 w-full min-h-[100px] relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10 p-8">
        <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-8 leading-tight">
          {headlineParts[0]}
          <span className="relative inline-block">
            {ctaData.highlighted_word}
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="8"
              viewBox="0 0 200 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6C50 2 150 2 198 6"
                stroke={ctaData.underline_color || '#E9C236'}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {headlineParts[1]}
        </h2>
        
        {ctaData.enable_email_collection && (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={ctaData.email_placeholder}
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E9C236]"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#E9C236] text-gray-900 font-bold rounded-lg hover:bg-[#D1A92F] transition-colors"
            >
              {ctaData.email_button_text}
            </button>
          </form>
        )}
        
        {submitted && (
          <div className="mt-4 p-3 bg-[#E9C236] text-gray-900 rounded-lg inline-block">
            Thank you for subscribing!
          </div>
        )}
      </div>
    </div>
  );
}
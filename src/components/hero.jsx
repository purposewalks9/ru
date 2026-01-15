import React from 'react';
import  { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function HeroSection() {
  const [content, setContent] = useState({
    hero_title: 'Grow Your Career',
    hero_subtitle: 'Within RWU Inc.',
    hero_description: 'Explore internal opportunities...',
    stat_open_positions: '500+',
    stat_locations: '120+',
    stat_departments: '25+'
  });
  const [loading, setLoading] = useState(false);

     useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('home_content')
      .select('*')
      .single();
    
    if (data) {
      setContent(data);
    }
    if (error) {
      console.error('Error loading content:', error);
    }
    setLoading(false);
  };
   
    return (
        <div className="pt-16 md:pt-24 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-12 lg:gap-24 justify-center items-center p-2 sm:p-4 md:p-8 lg:p-12 mt-4 md:mt-8 lg:mt-16">
                    <div className="space-y-6 md:space-y-8 w-full lg:w-auto lg:max-w-2xl flex justify-center flex-col">
                        <div className="space-y-4">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center lg:text-start font-bold leading-tight">
                                {content.hero_title}{' '}
                                <span className="text-[#E9C236]">{content.hero_subtitle}</span>{' '}
                               
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-center lg:text-start text-gray-800 leading-relaxed">
                                {content.hero_description}
                            </p>
                        </div>

                        <div className="mt-6 space-y-8 md:space-y-12">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#478100]">{content.stat_open_positions}</div>
                                    <div className="text-xs md:text-sm text-gray-600">Open Positions</div>
                                </div>
                                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg">
                                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#478100]">{content.stat_locations}</div>
                                    <div className="text-xs md:text-sm text-gray-600">Global Locations</div>
                                </div>
                                <div className="text-center p-3 md:p-4 bg-gray-50 rounded-lg col-span-2 md:col-span-1">
                                    <div className="text-lg md:text-xl lg:text-2xl font-bold text-[#478100]">{content.stat_departments}</div>
                                    <div className="text-xs md:text-sm text-gray-600">Departments</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 md:gap-3 justify-center lg:justify-start">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-2 h-2 bg-[#478100] rounded-full"></div>
                                    <span className="text-xs sm:text-sm">Internal Transfers</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-2 h-2 bg-[#478100] rounded-full"></div>
                                    <span className="text-xs sm:text-sm">Career Development</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <div className="w-2 h-2 bg-[#478100] rounded-full"></div>
                                    <span className="text-xs sm:text-sm">Global Mobility</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto py-8 md:py-12">
                        <div className="relative w-full h-auto mx-auto">
                            <img
                                src={content.hero_image_url || '/images/career-hero.jpg'}
                                alt="RWU Inc. team member exploring career opportunities"
                                className="w-full h-auto object-cover rounded-lg"
                            />
                            <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-20 h-20 sm:w-32 sm:h-32 bg-[#E9C236]/10 rounded-full -z-10"></div>
                            <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-24 h-24 sm:w-40 sm:h-40 bg-[#478100]/10 rounded-full -z-10"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
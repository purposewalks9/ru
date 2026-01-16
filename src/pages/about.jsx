import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CTABannerSection from '../components/cta';
import Footer from '../components/footer';

export default function About() {
    const [aboutData, setAboutData] = useState(null);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutData();
        fetchStats();
    }, []);

    const fetchAboutData = async () => {
        try {
            const { data, error } = await supabase
                .from('about')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            if (data) setAboutData(data);
        } catch (error) {
            console.error('Error fetching about data:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const { data, error } = await supabase
                .from('about_stats')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            if (data) setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#478100] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading About information...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768061867/Rectangle_34_1_jxcucd.png')",
            backgroundPosition: "center",
            backgroundSize: "cover", 
            backgroundRepeat: "no-repeat",
        }} className="relative overflow-hidden">
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 bg-gray-50">
                    <div className="flex md:flex-row lg:gap-32 flex-col xl:pt-48 lg:pt-48 pt-32 items-center justify-center">
                        <div className='lg:w-300 w-full'>
                            <h1 className="text-4xl font-bold text-gray-900 mb-6">
                                <span className="relative inline-block">
                                    {aboutData?.title?.split(' ').slice(0, 2).join(' ') || 'About Us'}
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        height="12"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3 8 Q50 3, 100 8 T197 8"
                                            stroke="#E9C236"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            fill="none"
                                        />
                                    </svg>
                                </span>
                                {' '}{aboutData?.title?.split(' ').slice(2).join(' ') || 'RWU Inc.'}
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed">
                                {aboutData?.description || 'Loading description...'}
                            </p>
                        </div>

                        <div className="w-160 h-auto lg:flex xl:flex hidden md:hidden">
                            {aboutData?.hero_image && (
                                <img
                                    src={aboutData.hero_image}
                                    alt="RWU Inc. team member working remotely"
                                    className="w-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://res.cloudinary.com/do4b0rrte/image/upload/v1768085809/young-female-engineer-office-requests-help-from-coworkers-block-hacker-intrusion-intern_xkzrfq.png';
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.id || index}
                            className="bg-white rounded-lg p-8 border border-gray-200 hover:border-[#478100] hover:shadow-md transition-all duration-300"
                        >
                            {/* Icon */}
                            {stat.image && (
                                <div className="w-14 h-14 mb-6">
                                    <img
                                        src={stat.image}
                                        alt={stat.label}
                                        className="w-full h-full object-contain"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </div>
                            )}
                            
                            {/* Content */}
                            <div className="text-4xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-base text-gray-600">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <CTABannerSection />
            <Footer />
        </div>
    );
}
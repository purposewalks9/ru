import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CTABannerSection from '../components/cta';
import Footer from '../components/footer';

export default function Career() {
    const [openQuestion, setOpenQuestion] = useState(null);
    const [careerData, setCareerData] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCareerData();
        fetchFAQs();
    }, []);

    const fetchCareerData = async () => {
        try {
            const { data, error } = await supabase
                .from('career')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            if (data) setCareerData(data);
        } catch (error) {
            console.error('Error fetching career data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFAQs = async () => {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) throw error;
            if (data) setFaqs(data);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    // Fallback data
    const pageTitle = careerData?.page_title || 'RWU Inc';
    const pageSubtitle = careerData?.page_subtitle || 'Careers Growth';
    const heroText = careerData?.hero_text || 'These are the stories of RWU team members worldwide who advanced their careers through internal opportunities. Their backgrounds and skills may differ, but they had the same goal: to find a role that fits their aspirations and leverages their talents. And with RWU Inc.\'s internal job portal, they found exactly that while growing within our organization.';
    const heroImage = careerData?.hero_image || 'https://res.cloudinary.com/do4b0rrte/image/upload/v1767968949/reviewbanner_miswat.png';
    const faqSectionTitle = careerData?.faq_section_title || 'Commonly Asked Questions About RWU Inc.';
    const faqSectionSubtitle = careerData?.faq_section_subtitle || 'Everything you need to know about RWU Inc.\'s internal job portal';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#478100] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading career information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex md:flex-row lg:gap-32 flex-col  xl:pt-48 lg:pt-48 md:pt-40 pt-32 items-center justify-center relative">
                        <div className="lg:w-300 w-full relative z-10">
                            <h1 className="text-4xl font-bold text-gray-900 mb-6 relative z-10">
                                <span className="relative inline-block">
                                    {pageSubtitle}
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        height="8"
                                        viewBox="0 0 200 8"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M2 6C50 2 150 2 198 6"
                                            stroke="#E9C236"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </span>
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed relative z-10">
                                {heroText}
                            </p>
                        </div>

                        <div className="w-160 h-auto hidden lg:flex">
                            <img
                                src={heroImage}
                                alt="RWU team member working remotely"
                                className="rounded-full w-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x400?text=Career+Image';
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768055520/Rectangle_34_wtd3sg.png')",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="  min-h-screen relative py-16 px-4"
                >
                    <div className="max-w-5xl mx-auto mt-32">
                        <div className="text-center mb-12">
                            <h1 className="md:text-2xl text-[18px] font-bold text-gray-900 mb-4">
                                {faqSectionTitle.split(' About ')[0]}{' '}
                                <span className="relative inline-block">
                                    {faqSectionTitle.includes(' About ') ? faqSectionTitle.split(' About ')[1].split(' ')[0] : 'Questions'}
                                    <svg
                                        className="absolute -bottom-2 left-0 w-full"
                                        height="12"
                                        viewBox="0 0 200 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M3 8 Q50 3, 100 8 T197 8"
                                            stroke="#498100"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            fill="none"
                                        />
                                    </svg>
                                </span>
                                {faqSectionTitle.includes(' About ') ? ' About ' + faqSectionTitle.split(' About ')[1].split(' ').slice(1).join(' ') : ''}
                            </h1>
                            <p className="text-gray-600 text-[10px] md:text-[12px] max-w-3xl m-4 mx-auto">
                                {faqSectionSubtitle}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.length > 0 ? (
                                faqs.map((faq) => (
                                    <div
                                        key={faq.id}
                                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                                    >
                                        <button
                                            onClick={() => toggleQuestion(faq.id)}
                                            className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                                        >
                                            <h3 className="text-[14px] md:text-[16px] font-semibold text-gray-900 pr-4">
                                                {faq.question}
                                            </h3>
                                            <span className="flex-shrink-0">
                                                {openQuestion === faq.id ? (
                                                    <ChevronUp className="w-6 h-6 text-gray-600" />
                                                ) : (
                                                    <ChevronDown className="w-6 h-6 text-gray-600" />
                                                )}
                                            </span>
                                        </button>

                                        {openQuestion === faq.id && (
                                            <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-200">
                                                <p className="text-gray-700 text-[12px] md:text-[14px] leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No FAQs available yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <CTABannerSection />
                <Footer />
            </div>
        </div>
    );
}
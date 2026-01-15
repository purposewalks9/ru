import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Ctasection from '../components/cta';
import Footer from '../components/footer';

const Stories = () => {
    const [expandedStory, setExpandedStory] = useState(null);
    const [storyData, setStoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStoryData();
    }, []);

    const fetchStoryData = async () => {
        try {
            const { data, error } = await supabase
                .from('stories')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (error) throw error;
            if (data) setStoryData(data);
        } catch (error) {
            console.error('Error fetching story:', error);
        } finally {
            setLoading(false);
        }
    };

    // Keep original testimonials as they are
    const testimonials = [
        {
            name: "Ashley M.",
            role: "Product Operations Associate",
            avatar: "https://i.pravatar.cc/150?img=5",
            platform: "trustpilot",
            review: "Rwu Inc. provides a healthy work environment with clear expectations and room to grow.",
            rating: 5
        },
        {
            name: "Sally J.",
            role: "Customer Experience Specialist",
            avatar: "https://i.pravatar.cc/150?img=9",
            platform: "sitejabber",
            review: "Working at Rwu Inc. has allowed me to balance my personal life while still progressing professionally.",
            rating: 5
        },
        {
            name: "Becka A.",
            role: "Digital Support Analyst",
            avatar: "https://i.pravatar.cc/150?img=10",
            platform: "sitejabber",
            review: "The leadership team genuinely listens, and the company culture encourages continuous improvement.",
            rating: 5
        },
        {
            name: "Hollie T.",
            role: "Healthcare Operations Coordinator",
            avatar: "https://i.pravatar.cc/150?img=12",
            platform: "sitejabber",
            review: "Rwu Inc. stands out for its structure, transparency, and respect for employees' time.",
            rating: 5
        },
        {
            name: "Becka A.",
            role: "Digital Support Analyst",
            avatar: "https://i.pravatar.cc/150?img=10",
            platform: "sitejabber",
            review: "The leadership team genuinely listens, and the company culture encourages continuous improvement.",
            rating: 5
        },
        {
            name: "Becka A.",
            role: "Digital Support Analyst",
            avatar: "https://i.pravatar.cc/150?img=10",
            platform: "sitejabber",
            review: "The leadership team genuinely listens, and the company culture encourages continuous improvement.",
            rating: 5
        }
    ];

    const toggleStory = (id) => {
        setExpandedStory(expandedStory === id ? null : id);
    };

    const renderStars = (rating) => (
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-6 h-6 ${i < rating ? 'fill-orange-500 text-orange-500' : 'fill-gray-300 text-gray-300'}`}
                />
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden bg-gray-50">
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-16 pt-32 m-12 items-center justify-center">
                        <div className='lg:w-300 md:w-160 w-80'>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                                {storyData?.pageheading || 'RWU Inc.'}
                                {' '}
                                <span className="relative inline-block">
                                    Success Stories
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
                                {' '}
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed relative z-10">
                                {storyData?.pagetext || 'These are the stories of RWU team members worldwide who advanced their careers through internal opportunities. Their backgrounds and skills may differ, but they had the same goal: to find a role that fits their aspirations and leverages their talents. And with RWU Inc.\'s internal job portal, they found exactly that while growing within our organization.'}
                            </p>
                        </div>

                        <div className="w-160 h-auto hidden lg:flex">
                            <img
                                src={storyData?.pageimage || "https://res.cloudinary.com/do4b0rrte/image/upload/v1767968949/reviewbanner_miswat.png"}
                                alt="RWU team member working remotely"
                                className="rounded-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768062545/Rectangle_34_3_g9a0mx.png')",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }} className="min-h-screen relative px-4 py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto md:mt-32 mt-24 lg:mt-48">
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-24">
                        Team Member Stories
                    </h1>

                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        <div className="space-y-10">
                            {/* Card 1 */}
                            {storyData?.card1description && (
                                <div className="flex gap-4">
                                    <div className="w-2 border-orange-500"></div>
                                    <div className="flex gap-4">
                                        {storyData?.card1pic && (
                                            <img
                                                src={storyData.card1pic}
                                                alt="Rwu Inc. employee"
                                                className="w-32 h-32 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="text-gray-700 text-sm mb-3">
                                                {storyData.card1description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Card 2 */}
                            {storyData?.card2description && (
                                <div className="flex gap-4">
                                    <div className="w-2 border-blue-500"></div>
                                    <div className="flex gap-4">
                                        {storyData?.card2pic && (
                                            <img
                                                src={storyData.card2pic}
                                                alt="Rwu Inc. employee"
                                                className="w-32 h-32 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="text-gray-700 text-sm mb-3">
                                                {storyData.card2description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Card 3 - Quote Section */}
                        <div className="p-8 border-l-2 border-gray-200 flex flex-col justify-center">
                            <div className="text-6xl text-[#498100] mb-6">"</div>
                            <blockquote className="text-lg text-gray-800 mb-6">
                                {storyData?.card3description || 'Working at Rwu Inc. has been both professionally rewarding and personally fulfilling. The company genuinely invests in its people.'}
                            </blockquote>
                            <div className="border-t pt-4">
                                <p className="font-semibold">{storyData?.card3name || 'Brian B.'}</p>
                                <p className="text-sm text-gray-600">{storyData?.card3status || 'Operations Specialist'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-20 px-4 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-center mb-16">
                        Employee Feedback
                    </h1>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 border border-gray-200">
                                <div className="flex justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold">{testimonial.name}</h3>
                                        <p className="text-sm text-teal-600">{testimonial.role}</p>
                                    </div>
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                </div>

                                <p className="text-sm text-gray-700 mb-4">
                                    {testimonial.review}
                                </p>

                                <div className="flex justify-between items-center">
                                    {renderStars(testimonial.rating)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Ctasection />
            <Footer />
        </div>
    );
};

export default Stories;
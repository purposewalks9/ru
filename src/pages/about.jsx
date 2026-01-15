import React from 'react';
import CTABannerSection from '../components/cta';
import Footer from '../components/footer';

const stats = [
    {
        value: "15,000+",
        label: "Employees worldwide",
        image: "https://res.cloudinary.com/do4b0rrte/image/upload/v1767958054/undraw_handshake-deal_nwk6-removebg-preview_sdbof4.png"
    },
    {
        value: "50+",
        label: "Global offices",
        image: "https://res.cloudinary.com/do4b0rrte/image/upload/v1767958061/undraw_agreement_ftet-removebg-preview_zrdcri.png"
    },
    {
        value: "120+",
        label: "Countries of operation",
        image: "https://res.cloudinary.com/do4b0rrte/image/upload/v1767958043/undraw_my-resume_etai_vbukmp.svg"
    },
];

export default function About() {
    return (
        <div style={{
      backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768061867/Rectangle_34_1_jxcucd.png')",
      backgroundPosition: "center",
      backgroundSize: "cover", 
      backgroundRepeat: "no-repeat",
    }}  className="relative overflow-hidden">
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md::px-6 lg:px-8 bg-gray-50">
                    <div className="flex md:flex-row lg:gap-32 flex-col xl:px-0 lg:px-0 px-32 xl:pt-48 lg:pt-48 pt-32 items-center justify-center">
                        <div className='lg:w-300 md:w-160 w-80'>
                            <h1 className="text-3xl font-bold text-gray-900 mb-6">
                                <span className="relative inline-block">
                                   About Us
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
                                {' '} RWU Inc.
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed">
                                These are the stories of <span className="font-bold">RWU Inc. employees from around the globe who have advanced their careers through our internal opportunities.</span> Their backgrounds and expertise may vary, but they share a common goal: finding the right position that aligns with their skills and career aspirations. Through our internal job board, thousands of team members have successfully transitioned to new roles, taken on exciting challenges, and grown professionally within the RWU Inc. family.
                            </p>
                        </div>

                        <div className="w-160 h-auto lg:flex xl:flex hidden md:hidden">
                            <img
                                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768085809/young-female-engineer-office-requests-help-from-coworkers-block-hacker-intrusion-intern_xkzrfq.png"
                                alt="RWU Inc. team member working remotely"
                                className="w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Elegant Redesign */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                        >
                            {/* Animated background element */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-r from-green-50 to-green-100/30 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
                            
                            {/* Icon */}
                            <div className="relative mb-8">
                                <div className="w-20 h-20 rounded-2xl  p-4 transition-shadow">
                                    <img
                                        src={stat.image}
                                        alt={stat.label}
                                        className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                                    />
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div className="relative">
                                <div className="text-5xl font-bold text-gray-900 mb-3 leading-none">
                                    {stat.value}
                                </div>
                                <div className="text-lg text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                            
                            {/* Decorative line */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/0 via-yellow-500 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
            
            <CTABannerSection />
            <Footer />
        </div>
    );
}
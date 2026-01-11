import React from 'react';
import CTABannerSection from '../component/cta';
import Footer from '../component/footer';

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

export default function TeamSection() {
    return (
        <div className="relative overflow-hidden bg-gray-50">
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 bg-gray-50">
                    <div className="flex md:flex-row lg:gap-32 flex-col xl:px-0 lg:px-0 px-8 sm:px-16 md:px-32 xl:pt-48 lg:pt-48 pt-32 items-center justify-center">
                        <div className='lg:w-300 md:w-160 w-full'>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                <span className="relative inline-block">
                                    Our Team
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
                                {' '} at RWU Inc.
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed">
                                <span className="font-bold">Our international team is comprised of talented, dedicated, and innovative professionals who share a passion for excellence and employee development.</span> As we support our workforce across 120+ countries and facilitate internal career growth, it's essential that we maintain our core values of integrity, collaboration, and continuous improvement at the heart of everything we do.
                            </p>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 leading-relaxed">
                                We work with dedication and purpose, value work-life balance, believe integrity is paramount, and always prioritize our people. Our team members are empowered to innovate, collaborate across borders, and contribute to a culture where everyone can thrive.
                            </p>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
             <div className="mb-16">
                    <h2 className="text-2xl m font-bold text-black mb-8">
                        Awards & Recognition
                    </h2>

                    <p className="text-base text-gray-700 leading-relaxed mb-8">
                        RWU Inc. is proud to have been recognized by leading organizations for our commitment to ethical business practices, 
                        outstanding company culture, innovative workplace solutions, and being a trusted name in the global industry.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-56 py-8">
                        <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                            <img 
                                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767958054/undraw_handshake-deal_nwk6-removebg-preview_sdbof4.png" 
                                alt="Best Workplace Award"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                            <img 
                                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767958061/undraw_agreement_ftet-removebg-preview_zrdcri.png" 
                                alt="Top Company Culture"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="w-24 h-24 md:w-40 md:h-40 flex items-center justify-center">
                            <img 
                                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767958043/undraw_my-resume_etai_vbukmp.svg" 
                                alt="Industry Excellence"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <CTABannerSection />
            <Footer />
        </div>
    );
}
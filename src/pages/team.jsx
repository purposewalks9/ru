import CTABannerSection from '../component/cta';
import Footer from '../component/footer';

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
        <h2 className="text-2xl font-bold text-black mb-8">
            Awards & Recognition
        </h2>

        <p className="text-base text-gray-700 leading-relaxed mb-8">
            RWU Inc. is proud to have been recognized by leading organizations for our commitment to ethical business practices, 
            outstanding company culture, innovative workplace solutions, and being a trusted name in the global industry.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center  p-4">
                                <img 
                                    src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768101150/Award_Winner_crthah.png" 
                                    alt="Best Workplace Award"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Best Workplace 2025</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center  p-4">
                                <img 
                                    src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768101150/Award_Winner_Bold_gce7uj.gif" 
                                    alt="Top Company Culture"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Top Company Culture</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center  p-4">
                                <img 
                                    src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768101151/work_place_ezcudr.png" 
                                    alt="Industry Excellence"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Industry Excellence</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-40 h-40 mx-auto mb-4 flex items-center justify-center  p-4">
                                <img 
                                    src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768101151/Company_Culture_edm2rt.png" 
                                    alt="Global Employer Award"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-700">Global Employer Award</p>
                        </div>
                    </div>
                </div>
            </div>
            <CTABannerSection />
            <Footer />
        </div>
    );
}
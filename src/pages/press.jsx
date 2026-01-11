import React from 'react';
import CTABannerSection from '../component/cta';
import Footer from '../component/footer';

const featuredArticle = {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
    title: "RWU Inc. Expands Global Operations with 500+ New Internal Positions in 2025",
    link: "#",
    publisher: "Business Insider"
};

const articles = [
    {
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        title: "How RWU Inc. is Revolutionizing Internal Career Development",
        link: "#",
        publisher: "Forbes"
    },
    {
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
        title: "RWU Inc. Named Top Employer for Career Growth Opportunities",
        link: "#",
        publisher: "Financial Times"
    },
    {
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
        title: "Inside RWU Inc.'s Global Talent Mobility Program",
        link: "#",
        publisher: "Harvard Business Review"
    }
];

export default function PressAwards() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 bg-gray-50">
                    <div className="flex md:flex-row lg:gap-32 flex-col xl:px-0 lg:px-0 px-8 sm:px-16 md:px-32 xl:pt-48 lg:pt-48 pt-32 items-center justify-center">
                        <div className='lg:w-300 md:w-160 w-full'>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                <span className="relative inline-block">
                                    Press & Awards
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
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed">
                                <span className="font-bold">Discover how RWU Inc. is making headlines worldwide.</span> From groundbreaking internal career development programs to recognition as a top global employer, we're proud to share our achievements and the stories that showcase our commitment to employee excellence and innovation.
                            </p>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 leading-relaxed">
                                Our dedication to creating meaningful career opportunities and fostering a world-class workplace culture has earned us recognition from leading publications and industry organizations across the globe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                    Featured Articles
                </h2>
                
                <div className="bg-white rounded-2xl overflow-hidden mb-16 border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="relative h-64 lg:h-auto">
                            <img
                                src={featuredArticle.image}
                                alt={featuredArticle.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                {featuredArticle.title}
                            </h2>
                            <a
                                href={featuredArticle.link}
                                className="text-[#478100] hover:text-[#5a9e00] font-semibold text-lg inline-flex items-center group mb-4"
                            >
                                Read story
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                            <div className="mt-4">
                                <span className="inline-block bg-gray-100 px-4 py-2 rounded-full text-sm font-semibold text-gray-700">
                                    {featuredArticle.publisher}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article, index) => (
                        <div
                            key={index}
                            className="bg-white overflow-hidden transition-all duration-300 border border-gray-100 group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight min-h-[4rem]">
                                    {article.title}
                                </h3>
                                <a
                                    href={article.link}
                                    className="text-[#478100] hover:text-[#5a9e00] font-semibold inline-flex items-center group/link"
                                >
                                    Read story
                                    <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <span className="inline-block bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                                        {article.publisher}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                        Awards & Recognition
                    </h2>
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
             <div className=" mt-24">
                  <CTABannerSection />
                <Footer />
                </div>
        </div>
    );
}
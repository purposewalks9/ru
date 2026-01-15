import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Adjust path as needed
import CTABannerSection from '../components/cta';
import Footer from '../components/footer';

export default function PressAwards() {
    const [loading, setLoading] = useState(true);
    const [headerData, setHeaderData] = useState(null);
    const [featuredArticle, setFeaturedArticle] = useState(null);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch header
            const { data: header } = await supabase
                .from('press_header')
                .select('*')
                .limit(1)
                .maybeSingle();
            if (header) setHeaderData(header);

            // Fetch featured article
            const { data: featured } = await supabase
                .from('press_featured')
                .select('*')
                .limit(1)
                .maybeSingle();
            if (featured) setFeaturedArticle(featured);

            // Fetch articles
            const { data: articlesData } = await supabase
                .from('press_articles')
                .select('*')
                .order('created_at', { ascending: false });
            if (articlesData) setArticles(articlesData);

        } catch (error) {
            console.error('Error fetching press data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 bg-gray-50">
                    <div className="flex md:flex-row lg:gap-32 flex-col xl:px-0 lg:px-0 px-8 sm:px-16 md:px-32 xl:pt-48 lg:pt-48 pt-32 items-center justify-center">
                        <div className='lg:w-300 md:w-160 w-full'>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                <span className="relative inline-block">
                                    {headerData?.title || 'Press At Rwu..'}
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
                                {headerData?.description_1 || (
                                    <>
                                        <span className="font-bold">Discover how RWU Inc. is making headlines worldwide.</span> From groundbreaking internal career development programs to recognition as a top global employer, we're proud to share our achievements and the stories that showcase our commitment to employee excellence and innovation.
                                    </>
                                )}
                            </p>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 leading-relaxed">
                                {headerData?.description_2 || 'Our dedication to creating meaningful career opportunities and fostering a world-class workplace culture has earned us recognition from leading publications and industry organizations across the globe.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                    Featured Articles
                </h2>
                
                {featuredArticle && (
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
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <div
                            key={article.id}
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
                                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight min-h-16">
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

            <div className="mt-24">
                <CTABannerSection />
                <Footer />
            </div>
        </div>
    );
}
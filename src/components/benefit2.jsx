import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase'; // Adjust path as needed

export default function Benefits() {
  const [benefitsData, setBenefitsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setBenefitsData(data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!benefitsData) {
    return null;
  }

  const benefits = [
    {
      title: benefitsData.text1head || "Verified Internal Opportunities",
      description: benefitsData.text1description || "Only legitimate positions across RWU departments."
    },
    {
      title: benefitsData.text2head || "Comprehensive Career Development",
      description: benefitsData.text2description || "Full access to all internal opportunities."
    },
    {
      title: benefitsData.text3head || "Streamlined Application Process",
      description: benefitsData.text3description || "Apply directly to internal positions."
    }
  ];

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl text-black font-bold text-center md:mb-0 mb-16 leading-tight">
          <span className="relative inline-block">
           {benefitsData.heading || "Why RWU Inc. is"}{' '}
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
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-7 h-7 text-[#498100]" fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto py-8 md:py-12">
            <div className="relative w-full h-auto mx-auto">
              <img
                src={benefitsData.benefitimage || "https://res.cloudinary.com/do4b0rrte/image/upload/v1768064057/banner_2_nexhkw.png"}
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
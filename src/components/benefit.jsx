import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function BenefitsSection() {
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
    <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            {benefitsData.heading || "Why RWU Inc. is Different"}
          </h1>
          
          {benefitsData.benefitimage && (
            <div className="mb-12">
              <img
                src={benefitsData.benefitimage}
                alt="Benefits"
                className="w-full max-w-4xl mx-auto rounded-lg shadow-lg object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-10 h-10 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
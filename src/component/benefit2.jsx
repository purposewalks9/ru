import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function Benefits() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <h2 className="text-2xl text-black font-bold text-center mb-16 leading-tight">
          Why RWU Inc. is{' '}
          <span className="relative inline-block">
            Different
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
          {' '}
        </h2> 
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-7 h-7 text-[#498100]" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                    Verified Internal Opportunities
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Only legitimate positions across RWU departments. Every opening is verified by HR and hiring managers to ensure authenticity and role clarity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-7 h-7 text-[#498100]" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                    Comprehensive Career Development
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Full access to all internal opportunities, training resources, and career guidance to support your professional growth within RWU Inc.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-7 h-7 text-[#498100]" fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-gray-900 mb-2">
                    Streamlined Application Process
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Apply directly to internal positions with your employee profile. Simple, transparent transfers across departments and regions worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto py-8 md:py-12">
                        <div className="relative w-full h-auto mx-auto">
                            <img
                                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768064057/banner_2_nexhkw.png"
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
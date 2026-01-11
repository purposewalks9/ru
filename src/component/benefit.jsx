import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: <CheckCircle className="w-12 h-12 text-orange-500" />,
      title: "High-Quality Remote & Flexible Jobs",
      description: "We help people find professional, remote and flexible jobs in 50+ career fields, from entry-level to executive, part-time to full-time, in the U.S. and around the world."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-orange-500" />,
      title: "Every Job & Company Researched for You",
      description: "Our expert team finds and screens the best remote and flexible jobs and provides information on each company to help you decide whether to apply."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-orange-500" />,
      title: "High-Quality Support & Resources",
      description: "When it comes to FlexJobs' remote work, we offer great resources to provide support, guidance, and tools so you can land the remote or flexible job you want, and that includes client support you can talk to."
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-orange-500" />,
      title: "No-Risk Satisfaction Guarantee",
      description: "We want our users to be happy with our service. If for any reason you're not, simply let us know you'd like a refund within 14 days. You'll get it. It's that easy."
    }
  ];

  return (
    <div className=" py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
    
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Benefits of Using FlexJobs
          </h1>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-10 py-4 rounded-md text-lg transition-colors shadow-lg">
            Get Started
          </button>
        </div>

   
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-4">
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

    
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-300 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
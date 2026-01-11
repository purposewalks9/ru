import React, { useState } from 'react';

export default function CTABannerSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{
      backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768032370/bg-15_yh3yed.png')",
      backgroundPosition: "center",
      backgroundColor: "#478100",
      backgroundSize: "cover", 
      backgroundRepeat: "no-repeat",
    }} className="py-20 px-4 sm:px-6 lg:px-8 w-full min-h-[100px] relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10 p-8">
        <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold text-white mb-8 leading-tight">
          Thousands of RWU Inc. Employees Have Advanced Their{' '}
          <span className="relative inline-block">
            Careers
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
          {' '}Through Internal Opportunities
        </h2>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(2);

  const testimonials = [
    {
      text: "RWU Inc. offered me the career advancement opportunity I was looking for",
      author: "Maria T.",
      position: "Senior Operations Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop"
    },
    {
      text: "The internal transfer process was smooth and supportive",
      author: "John D.",
      position: "Technology Lead",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
    },
    {
      text: "RWU Inc. made it easy to transition into a role that perfectly matches my skills and career goals. Highly satisfied.",
      author: "Sedric G.",
      position: "Business Development Manager",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop"
    },
    {
      text: "Found the perfect department fit that supports my work-life balance",
      author: "Sarah L.",
      position: "Client Services Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"
    },
    {
      text: "Excellent opportunities for growth within the organization",
      author: "Emily R.",
      position: "Digital Strategy Coordinator",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop"
    }
  ];

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-gray-50 py-16 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          What Our Team Members Are Saying
        </h1>

        <p className="text-sm text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Real stories from professionals who found their ideal career paths through RWU Inc.
        </p>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 mb-10 relative">
          <button
            onClick={handlePrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <div className="text-center px-4 md:px-8">
            <div className="text-gray-700 mb-6">
              <span className="text-4xl md:text-5xl text-gray-300 font-serif absolute left-4 md:left-8 top-6">"</span>
              <p className="text-base md:text-lg leading-relaxed italic px-4">
                {testimonials[activeIndex].text}
              </p>
              <span className="text-4xl md:text-5xl text-gray-300 font-serif absolute right-4 md:right-8 bottom-6">"</span>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow">
                  <img
                    src={testimonials[activeIndex].avatar}
                    alt={testimonials[activeIndex].author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    {testimonials[activeIndex].author}
                  </p>
                  <p className="text-gray-600 text-xs md:text-sm">
                    {testimonials[activeIndex].position}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 md:gap-4 mb-6 flex-wrap">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden transition-all duration-300 ${
                index === activeIndex
                  ? 'ring-2 ring-[#498100] scale-110 shadow-md'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300 hover:scale-105'
              }`}
              aria-label={`View testimonial from ${testimonial.author}`}
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'bg-[#498100] w-6 h-2'
                  : 'bg-gray-300 hover:bg-gray-400 w-2 h-2'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
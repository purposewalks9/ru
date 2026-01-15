import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReviewsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      quote: "Searching vetted jobs takes the stress of possible scammers away. Love it!",
      name: "Erin U.",
      location: "Illinois",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      quote: "If you are truly serious about landing a work-from-home job, FlexJobs is where you need to be.",
      name: "Michelle D.",
      location: "Virginia",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      quote: "FlexJobs helped me find my dream remote position. The quality of listings is outstanding!",
      name: "Sarah K.",
      location: "California",
      avatar: "https://i.pravatar.cc/150?img=10"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const visibleTestimonials = testimonials.slice(currentSlide * 2, currentSlide * 2 + 2);

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

      <div className="max-w-6xl mx-auto relative">
       
        <h2 className="text-2xl md:text-4xl font-bold text-center text-teal-900 mb-12">
          FlexJobs Reviews & Success Stories
        </h2>

        <div className="relative">
       
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-md">
             
                <div className="text-5xl text-teal-600 font-serif mb-4">"</div>
               
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Searching <span className="text-teal-600 font-semibold">vetted jobs</span> {testimonial.quote.includes('vetted jobs') ? testimonial.quote.split('vetted jobs')[1] : testimonial.quote.includes('work-from-home job') ? <>If you are truly serious about landing a <span className="text-teal-600 font-semibold">work-from-home job</span>, FlexJobs is where you need to be.</> : testimonial.quote}
                </p>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-teal-900">{testimonial.name}</p>
                    <p className="text-sm text-teal-600">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
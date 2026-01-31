import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowLeft, Building2, Clock, DollarSign, Briefcase } from 'lucide-react';
import { supabase } from '../lib/supabase';

const JobCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (data) {
      setJobs(data);
    }
    if (error) {
      console.error('Error loading jobs:', error);
    }
    setLoading(false);
  };

  const itemsPerPage = 6;
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleJobs = jobs.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (selectedJob) {
    return (
      <div className="bg-gray-50 py-8 md:py-12 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
                    {selectedJob.title}
                  </h1>
                  <div className="flex items-center text-black/90 text-sm md:text-base">
                    <Building2 className="w-4 h-4 mr-2" />
                    {selectedJob.department}
                  </div>
                </div>
                {selectedJob.badge && (
                  <span className="text-xs md:text-sm font-bold text-[#478100] bg-white px-4 py-2 rounded-full whitespace-nowrap self-start">
                    {selectedJob.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Job Details Cards */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#478100]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#478100]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedJob.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#478100]/10 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-[#478100]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Salary Range</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedJob.salary}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#478100]/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#478100]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Schedule</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedJob.time_type}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#478100]/10 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-[#478100]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Work Type</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedJob.work_type}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Job Description
                </h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              {/* Back Button */}
              <div className="flex justify-center pt-6 border-t border-gray-200">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
                >
                  View All Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768055520/Rectangle_34_wtd3sg.png')",
      backgroundPosition: "center",
      backgroundSize: "cover", 
      backgroundRepeat: "no-repeat",
    }} className="min-h-screen relative px-4 py-16">
      <div className="max-w-7xl mx-auto mt-32 relative">
        <div className="md:flex absolute hidden xl:top-0 xl:-left-18 w-40 h-auto">
          <img src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767884549/Plus_lwrt80.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute hidden md:flex md:bottom-10 md:-right-18 w-40 h-auto">
          <img src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767885447/Plus_re_ub8ffa.png" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Internal Job Opportunities
          </h1>
          <p className="text-gray-600">Explore {jobs.length} open positions within RWU Inc.</p>
        </div>

        <div className="relative">
          {totalPages > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full p-3 bg-white shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Previous jobs"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full p-3 bg-white shadow-lg hover:bg-gray-50 transition-colors"
                aria-label="Next jobs"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-8">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {job.department}
                  </span>
                  {job.badge && (
                    <span className="text-xs font-bold text-[#478100] bg-green-50 px-3 py-1 rounded-full">
                      {job.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 min-h-[3.5rem] line-clamp-2">
                  {job.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-[#478100]" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <DollarSign className="w-4 h-4 mr-2 text-[#478100]" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {job.work_type}
                  </span>
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {job.time_type}
                  </span>
                </div>

                <button className="w-full mt-4 px-4 py-2.5 bg-[#478100] hover:bg-[#5a9e00] text-white font-semibold rounded-lg transition-colors text-sm">
                  View Details
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#478100] w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCarousel;
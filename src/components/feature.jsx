import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowLeft, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const JobCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setJobs(data);
    }
    if (error) {
      console.error('Error loading jobs:', error);
    }
    setLoading(false);
  };

  const handleApplyClick = () => {
    setShowApplicationForm(true);
    setApplicationSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Application submitted:', { jobId: selectedJob.id, ...formData });
    
    setTimeout(() => {
      setApplicationSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: ''
      });
      
      setTimeout(() => {
        setShowApplicationForm(false);
      }, 3000);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }));
    }
  };

  const ApplicationForm = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl shadow-2xl rounded-xl bg-white my-8">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Apply for {selectedJob.title}
          </h2>
          <button
            onClick={() => setShowApplicationForm(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {applicationSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
              <p className="text-gray-600 mb-8">
                Thank you for applying to {selectedJob.title}. 
                We've received your application and will review it shortly.
              </p>
              <div className="animate-pulse flex justify-center">
                <div className="h-1 w-24 bg-green-500 rounded"></div>
              </div>
              <p className="text-sm text-gray-500 mt-4">Redirecting back to job details...</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#478100] focus:border-transparent text-sm md:text-base"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#478100] focus:border-transparent text-sm md:text-base"
                    placeholder="john@rwu-inc.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#478100] focus:border-transparent text-sm md:text-base"
                  placeholder="(123) 456-7890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-6 text-center hover:border-[#478100] transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="text-gray-600 text-sm md:text-base">
                        {formData.resume ? formData.resume.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">Max file size: 5MB</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#478100] focus:border-transparent text-sm md:text-base"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#478100] hover:bg-[#5a9e00] text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 md:px-8 py-3 md:py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-lg transition-colors text-base md:text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

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
      <>
        {showApplicationForm && <ApplicationForm />}
        
        <div className="bg-gray-50 py-8 md:py-12 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className=" p-6 md:p-8 lg:p-10">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </button>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
                  {selectedJob.title}
                </h1>
                <span className="text-xs md:text-sm font-bold text-black bg-green-50 px-3 md:px-4 py-1.5 md:py-2 rounded-full whitespace-nowrap self-start">
                  {selectedJob.badge}
                </span>
              </div>

              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {selectedJob.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Position Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-gray-700 text-sm md:text-base min-w-[140px]">Department:</span>
                    <span className="text-gray-900 text-sm md:text-base">{selectedJob.department}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-gray-700 text-sm md:text-base min-w-[140px]">Location:</span>
                    <span className="text-gray-900 text-sm md:text-base">{selectedJob.location}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-gray-700 text-sm md:text-base min-w-[140px]">Salary Range:</span>
                    <span className="text-gray-900 text-sm md:text-base">{selectedJob.salary}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-gray-700 text-sm md:text-base min-w-[140px]">Work Type:</span>
                    <span className="text-gray-900 text-sm md:text-base">{selectedJob.work_type}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                    <span className="font-semibold text-gray-700 text-sm md:text-base min-w-[140px]">Schedule:</span>
                    <span className="text-gray-900 text-sm md:text-base">{selectedJob.time_type}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleApplyClick}
                  className="flex-1 bg-[#478100] hover:bg-[#5a9e00] text-white font-bold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply for this Position
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Internal Job Opportunities
          </h1>
          <p className="text-gray-600">Explore {jobs.length} open positions within RWU Inc.</p>
        </div>

        <div className="relative">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-lg border-2 transition-all duration-300 p-6 border-gray-200 cursor-pointer transform hover:scale-105 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-gray-600 font-medium">New</span>
                  <span className="text-xs font-bold text-[#478100] bg-yellow-50 px-3 py-1 rounded-full">
                    {job.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-14">
                  {job.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {job.work_type}
                  </span>
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {job.time_type}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'bg-[#478100] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCarousel;
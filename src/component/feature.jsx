import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowLeft, Clock, DollarSign, Briefcase, X } from 'lucide-react';

const JobCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  const jobs = [
    {
      id: 1,
      title: "Patient Access Manager",
      workType: "100% Remote",
      timeType: "Full-Time",
      location: "MA, CT",
      badge: "New!",
      salary: "65,000 - 85,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Life Insurance",
      jobType: "Employee",
      careerLevel: "Experienced",
      company: "HealthCare Solutions",
      description: "Oversee patient intake and registration processes, ensuring smooth operations and exceptional patient experiences."
    },
    {
      id: 2,
      title: "Solution Engineer",
      workType: "100% Remote",
      timeType: "Full-Time",
      location: "US National",
      badge: "Featured",
      salary: "99,225 - 132,300 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Life Insurance",
      jobType: "Employee",
      careerLevel: "Experienced",
      company: "Tech Innovations Inc",
      description: "Design and implement technical solutions for enterprise clients, working closely with sales and engineering teams."
    },
    {
      id: 3,
      title: "Digital Marketing Specialist",
      workType: "Remote",
      timeType: "Full-Time",
      location: "Worldwide",
      badge: "New!",
      salary: "55,000 - 75,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Dental Insurance",
      jobType: "Employee",
      careerLevel: "Mid-Level",
      company: "Growth Marketing Co",
      description: "Drive digital marketing campaigns across multiple channels to increase brand awareness and engagement."
    },
    {
      id: 4,
      title: "Senior Software Developer",
      workType: "Hybrid",
      timeType: "Full-Time",
      location: "CA, NY",
      badge: "Hot!",
      salary: "120,000 - 160,000 USD Annually",
      remoteLevel: "Hybrid",
      benefits: "Health Insurance, 401k, Stock Options",
      jobType: "Employee",
      careerLevel: "Senior",
      company: "CodeCraft Solutions",
      description: "Build scalable applications using modern frameworks and lead development initiatives for our growing platform."
    },
    {
      id: 5,
      title: "Customer Success Manager",
      workType: "Remote",
      timeType: "Full-Time",
      location: "TX, FL",
      badge: "New!",
      salary: "70,000 - 90,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Dental Insurance",
      jobType: "Employee",
      careerLevel: "Mid-Level",
      company: "ClientFirst Technologies",
      description: "Ensure customer satisfaction and retention through proactive engagement, support, and relationship building."
    },
    {
      id: 6,
      title: "UX/UI Designer",
      workType: "100% Remote",
      timeType: "Contract",
      location: "Anywhere",
      badge: "Featured",
      salary: "80,000 - 110,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Flexible Schedule",
      jobType: "Contract",
      careerLevel: "Mid-Level",
      company: "Design Studio Pro",
      description: "Create intuitive and beautiful user experiences for web and mobile applications across diverse industries."
    },
    {
      id: 7,
      title: "Data Analyst",
      workType: "Remote",
      timeType: "Full-Time",
      location: "IL, WA",
      badge: "New!",
      salary: "65,000 - 85,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Vision Insurance",
      jobType: "Employee",
      careerLevel: "Mid-Level",
      company: "Analytics Hub",
      description: "Transform complex datasets into actionable insights to drive strategic business decisions and growth."
    },
    {
      id: 8,
      title: "Content Writer",
      workType: "Freelance",
      timeType: "Part-Time",
      location: "Global",
      badge: "Hot!",
      salary: "40,000 - 60,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Flexible Schedule",
      jobType: "Freelance",
      careerLevel: "Entry-Level",
      company: "ContentCraft Media",
      description: "Create engaging content for blogs, websites, and marketing materials across various industries and niches."
    },
    {
      id: 9,
      title: "DevOps Engineer",
      workType: "Remote",
      timeType: "Full-Time",
      location: "US, Canada",
      badge: "Featured",
      salary: "110,000 - 145,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, 401k, Life Insurance",
      jobType: "Employee",
      careerLevel: "Senior",
      company: "CloudOps Systems",
      description: "Maintain and optimize cloud infrastructure, deployment pipelines, and system performance monitoring."
    },
    {
      id: 10,
      title: "HR Coordinator",
      workType: "Hybrid",
      timeType: "Full-Time",
      location: "NY, NJ",
      badge: "New!",
      salary: "50,000 - 65,000 USD Annually",
      remoteLevel: "Hybrid",
      benefits: "Health Insurance, Dental Insurance",
      jobType: "Employee",
      careerLevel: "Entry-Level",
      company: "People First HR",
      description: "Support recruitment, onboarding, and employee relations activities to maintain a positive workplace culture."
    },
    {
      id: 11,
      title: "Sales Executive",
      workType: "Remote",
      timeType: "Full-Time",
      location: "US National",
      badge: "Hot!",
      salary: "60,000 - 90,000 USD + Commission",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Commission Structure",
      jobType: "Employee",
      careerLevel: "Mid-Level",
      company: "SalesForce Pro",
      description: "Drive revenue growth by identifying and closing new business opportunities with enterprise clients."
    },
    {
      id: 12,
      title: "Graphic Designer",
      workType: "100% Remote",
      timeType: "Full-Time",
      location: "Worldwide",
      badge: "Featured",
      salary: "55,000 - 75,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Creative Freedom",
      jobType: "Employee",
      careerLevel: "Mid-Level",
      company: "Creative Minds Agency",
      description: "Design visual content for digital and print media, creating compelling brand identities for diverse clients."
    },
    {
      id: 13,
      title: "Project Manager",
      workType: "Hybrid",
      timeType: "Full-Time",
      location: "CA, TX",
      badge: "New!",
      salary: "85,000 - 115,000 USD Annually",
      remoteLevel: "Hybrid",
      benefits: "Health Insurance, 401k, PTO",
      jobType: "Employee",
      careerLevel: "Senior",
      company: "ProjectHub Inc",
      description: "Lead cross-functional teams to deliver projects on time and within budget using agile methodologies."
    },
    {
      id: 14,
      title: "Virtual Assistant",
      workType: "Remote",
      timeType: "Part-Time",
      location: "Global",
      badge: "Hot!",
      salary: "25,000 - 40,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Flexible Schedule",
      jobType: "Contract",
      careerLevel: "Entry-Level",
      company: "Executive Support Services",
      description: "Provide administrative support to executives, managing calendars, emails, and daily operational tasks."
    },
    {
      id: 15,
      title: "Cybersecurity Analyst",
      workType: "Remote",
      timeType: "Full-Time",
      location: "US National",
      badge: "Featured",
      salary: "95,000 - 130,000 USD Annually",
      remoteLevel: "100% Remote",
      benefits: "Health Insurance, Life Insurance, 401k",
      jobType: "Employee",
      careerLevel: "Experienced",
      company: "SecureNet Technologies",
      description: "Protect organizational systems and data from cyber threats through monitoring and vulnerability assessments."
    },
    {
      id: 16,
      title: "Financial Analyst",
      workType: "Hybrid",
      timeType: "Full-Time",
      location: "NY, IL",
      badge: "New!",
      salary: "70,000 - 95,000 USD Annually",
      remoteLevel: "Hybrid",
      benefits: "Health Insurance, 401k, Bonus",
      jobType: "Employee",
      careerLevel: "Mid-Level",
      company: "Finance Solutions Group",
      description: "Analyze financial data and create reports to support business decisions, forecasting, and budgeting processes."
    }
  ];

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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 w-full max-w-2xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 my-6">
            Apply for {selectedJob.title}
          </h2>
          <button
            onClick={() => setShowApplicationForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {applicationSubmitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
            <p className="text-gray-600 mb-8">
              Thank you for applying to {selectedJob.title} at {selectedJob.company}. 
              We've received your application and will review it shortly.
            </p>
            <div className="animate-pulse flex justify-center">
              <div className="h-1 w-24 bg-green-500 rounded"></div>
            </div>
            <p className="text-sm text-gray-500 mt-4">Redirecting back to job details...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="john@example.com"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="(123) 456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume/CV *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-gray-600">
                      {formData.resume ? formData.resume.name : 'Click to upload resume (PDF, DOC, DOCX)'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Tell us why you're a great fit for this position..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleFormSubmit}
                className="flex-1 bg-black hover:bg-[#478100] text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => setShowApplicationForm(false)}
                className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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
        
        <div className=" bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="p-8">
              <button
                onClick={() => setSelectedJob(null)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </button>

              <div className="flex items-start justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedJob.title}
                </h1>
                <span className="text-sm font-bold text-orange-500 bg-orange-50 px-4 py-2 rounded-full">
                  {selectedJob.badge}
                </span>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 mb-8 text-sm">
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Remote Level:</span>
                  <span className="text-gray-900">{selectedJob.remoteLevel}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Location:</span>
                  <span className="text-gray-900">{selectedJob.location}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Salary:</span>
                  <span className="text-gray-900">{selectedJob.salary}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Benefits:</span>
                  <span className="text-gray-900">{selectedJob.benefits}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Job Type:</span>
                  <span className="text-gray-900">{selectedJob.jobType}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Job Schedule:</span>
                  <span className="text-gray-900">{selectedJob.timeType}</span>
                </div>
                <div className="flex">
                  <span className="font-semibold text-gray-700 w-36">Career Level:</span>
                  <span className="text-gray-900">{selectedJob.careerLevel}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={handleApplyClick}
                  className="flex-1 bg-[#489100] hover:bg-[#489100] text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div  style={{
      backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768055520/Rectangle_34_wtd3sg.png')",
      backgroundPosition: "center",
      backgroundSize: "cover", 
      backgroundRepeat: "no-repeat",
    }} className="min-h-screen relative px-4 py-16 ">
      <div className="max-w-7xl mx-auto mt-32 relative">
        <div className="md:flex absolute hidden xl:top-0 xl:-left-18 w-40 h-auto">
          <img src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767884549/Plus_lwrt80.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute  hidden md:flex md:bottom-10 md:-right-18  w-40 h-auto">
          <img src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767885447/Plus_re_ub8ffa.png" alt="" className="w-full h-full object-cover" />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-2xl  font-bold text-gray-900 mb-2">
             Flexible & Online Jobs
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full p-3 mr-4 hover:bg-gray-50 transition-colors"
            aria-label="Previous jobs"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full p-3 hover:bg-gray-50 transition-colors"
            aria-label="Next jobs"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {visibleJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="bg-white rounded-lg border-2 transition-all duration-300 p-6 border-gray-200 cursor-pointer transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-sm text-gray-600 font-medium">Today</span>
                  <span className="text-xs font-bold text-[#478100] bg-yellow-50 px-3 py-1 rounded-full">
                    {job.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-14">
                  {job.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {job.workType}
                  </span>
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                    {job.timeType}
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
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CTABannerSection from '../component/cta';
import Footer from '../component/footer';

export default function Career() {
    const [openQuestion, setOpenQuestion] = useState(null);

    const faqs = [
        {
            id: 1,
            question: "Why should I use the RWU Inc. internal job portal?",
            answer: "The RWU Inc. internal job portal gives you exclusive access to career opportunities across all our global departments and regions. This platform is designed specifically for RWU employees looking to advance their careers, explore new roles, or transition to different teams within the organization. You'll find verified positions that aren't available externally, along with comprehensive information about each role, department culture, and growth potential. Our portal streamlines the internal transfer process, making it easy to discover and apply for positions that align with your career goals while staying within the RWU family."
        },
        {
            id: 2,
            question: "How does the internal application process work?",
            answer: "Applying for internal positions at RWU Inc. is straightforward and employee-friendly. Simply browse available opportunities by department, location, or role type. When you find a position that interests you, click to view full details including responsibilities, requirements, and team information. Submit your application directly through the portal using your employee profile. Your current role, experience within RWU, and professional development history are already on file, making the process seamless. HR and hiring managers review all internal applications with priority consideration. You'll receive updates on your application status and can track your submissions through your dashboard. The entire process is designed to support internal mobility and career growth."
        },
        {
            id: 3,
            question: "What types of opportunities are available internally?",
            answer: "RWU Inc. offers a diverse range of internal opportunities across multiple departments and career levels. You'll find positions in Technology & Engineering, Healthcare Operations, Marketing & Communications, Finance & Accounting, Human Resources, Creative Services, Business Development, Data & Analytics, Project Management, and many more specialized areas. Opportunities include individual contributor roles, team lead positions, management tracks, and executive-level openings. We regularly post positions for both permanent transfers and temporary assignments, project-based roles, and cross-functional collaborations. Whether you're looking to advance in your current field or pivot to a completely new area, RWU's internal job portal connects you with possibilities across our entire global organization."
        },
        {
            id: 4,
            question: "Can I apply for positions in different regions or countries?",
            answer: "Absolutely! RWU Inc. is a global organization with operations across multiple countries and regions. Many of our internal positions offer location flexibility, including fully remote roles that allow you to work from anywhere within approved regions. We also have opportunities for employees interested in relocating to different RWU offices worldwide. Each job listing clearly specifies location requirements, whether it's office-based, hybrid, or fully remote. If you're interested in international opportunities, our HR team provides relocation support and guidance on visa requirements, cultural transitions, and local benefits packages. We encourage employees to explore opportunities across our global footprint as part of their career development journey."
        },
        {
            id: 5,
            question: "Do I need my manager's approval to apply for internal positions?",
            answer: "RWU Inc. values employee growth and career development. While we encourage open communication with your current manager about your career aspirations, you can browse and apply for internal positions confidentially through the portal. Once you've submitted an application and it reaches a certain stage in the review process, HR will typically notify your current manager as a professional courtesy. We believe in supporting employee mobility and recognize that career growth sometimes means moving to new teams or departments. Our internal transfer policy is designed to balance employee development with operational needs, ensuring smooth transitions that benefit both you and the organization."
        },
        {
            id: 6,
            question: "How long does the internal transfer process typically take?",
            answer: "The timeline for internal transfers at RWU Inc. varies depending on the role, department, and specific circumstances. Generally, the process takes between 2-6 weeks from application submission to final decision. This includes initial screening by HR, interviews with the hiring team, skills assessments if required, and coordination with your current department for transition planning. High-priority positions or specialized roles may move faster, while senior-level positions might take longer due to more extensive evaluation processes. Throughout the journey, you'll receive regular updates on your application status. Our goal is to make the process as efficient as possible while ensuring the right fit for both you and the receiving team."
        },
        {
            id: 7,
            question: "What resources are available to help me prepare for internal opportunities?",
            answer: "RWU Inc. provides comprehensive support to help employees succeed in their internal career moves. Through the portal, you'll find career development resources including resume writing guides tailored for internal applications, interview preparation tips specific to RWU culture, and information about different departments and their work styles. Our Learning & Development team offers workshops on career planning, skills assessments to identify your strengths, and mentorship programs connecting you with experienced colleagues. HR business partners are available for one-on-one career counseling to discuss your goals and identify suitable opportunities. We also maintain detailed department profiles and role descriptions to help you make informed decisions about your next career step within RWU."
        },
        {
            id: 8,
            question: "Are there opportunities for skill development and training?",
            answer: "Career growth at RWU Inc. goes beyond just changing positions. We're deeply committed to employee development through continuous learning opportunities. Many internal roles come with dedicated training periods to help you transition successfully. We offer professional development programs, technical certifications, leadership training, and cross-functional learning experiences. Employees can access our learning management system with courses covering technical skills, soft skills, industry knowledge, and RWU-specific systems and processes. Some positions include education reimbursement for relevant degrees or certifications. We believe in promoting from within and investing in our people's growth, which is why we provide extensive resources to help you build the skills needed for your target roles and future career aspirations."
        }
    ];

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 md::px-6 lg:px-32">
                    <div className="flex md:flex-row lg:gap-32 flex-col xl:px-0 lg:px-0 px-32 xl:pt-48 lg:pt-48 pt-32 items-center justify-center relative">
                        <div className="lg:w-300 md:w-160 w-80 relative z-10">
                            {/* Background Decorations */}

                            {/* Text Content */}
                            <h1 className="text-3xl font-bold text-gray-900 mb-6 relative z-10">
                                RWU Inc. {' '}
                                <span className="relative inline-block">
                                    Careers Growth
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
                                {' '}
                            </h1>

                            <p className="md:text-[16px] lg:text-[16px] text-[14px] text-gray-700 mb-6 leading-relaxed relative z-10">
                                These are the stories of{' '}
                                <span className="font-bold">
                                    RWU team members worldwide who advanced their careers through internal opportunities.
                                </span>{' '}
                                Their backgrounds and skills may differ, but they had the same goal: to find a role that fits their aspirations and leverages their talents. And with RWU Inc.'s internal job portal, they found exactly that while growing within our organization.
                            </p>
                        </div>

                        <div className="w-160 h-auto hidden lg:flex">
                            <img
                                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1767968949/reviewbanner_miswat.png"
                                alt="RWU team member working remotely"
                                className="rounded-full w-full object-cover"
                            />
                        </div>

                    </div>
                </div>
                <div
                    style={{
                        backgroundImage: "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768055520/Rectangle_34_wtd3sg.png')",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                    className="py-16 px-4">
                    <div className="max-w-5xl mx-auto mt-32  " >
                        <div className="text-center mb-12">
                            <h1 className="md:text-2xl text-[18px] font-bold text-gray-900 mb-4">
                                Commonly Asked{' '}
                                <span className="relative inline-block">
                                    Questions
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
                                {' '}About RWU Inc.
                            </h1>
                            <p className="text-gray-600 text-[10px] md:text-[12px] max-w-3xl  m-4 mx-auto">
                                Everything you need to know about RWU Inc.'s internal job portal
                            </p>
                        </div>

                        <div className="space-y-4">
                            {faqs.map((faq) => (
                                <div
                                    key={faq.id}
                                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                                >
                                    <button
                                        onClick={() => toggleQuestion(faq.id)}
                                        className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <h3 className="text-[14px] md:text-[16px] font-semibold text-gray-900 pr-4">
                                            {faq.question}
                                        </h3>
                                        <span className="flex-shrink-0">
                                            {openQuestion === faq.id ? (
                                                <ChevronUp className="w-6 h-6 text-gray-600" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-600" />
                                            )}
                                        </span>
                                    </button>

                                    {openQuestion === faq.id && (
                                        <div className="px-6 pb-6 pt-2 bg-gray-50 border-t border-gray-200">
                                            <p className="text-gray-700 text-[12px] md:text-[14px] leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <CTABannerSection />
                <Footer />
            </div>
        </div>
    );
}
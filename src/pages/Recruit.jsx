import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  User,
  Mail,
  Phone,
  Briefcase,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { supabase } from './../lib/supabase';
import Footer from '../components/footer';

const BRAND_COLOR = '#478100';

const getDefaultSettings = () => ({
  page_title: 'Partner with RWU Inc.',
  page_subtitle:
    'Scale your team with elite talent. Our specialized recruitment process ensures high-impact matches for your organization.',
  success_message_title: 'Submission Successful',
  success_message_text:
    "We've received your recruitment request. Our team is already reviewing your requirements and will reach out to schedule a consultation.",
  response_time_text: 'Priority review: You will hear from us within 24 hours.',
  enable_website_field: true,
  submit_button_text: 'Launch Talent Search',
  privacy_notice:
    'Your data is encrypted and handled in accordance with our strict privacy standards.',
  industry_options:
    'Technology, Finance, Healthcare, Manufacturing, Retail, Education, Hospitality, Construction, Aerospace, Energy, Other',
});

const RecruitPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    jobDescription: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('recruit_page_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        setSettings(getDefaultSettings());
      } else {
        setSettings(data || getDefaultSettings());
      }
    } catch (err) {
      setSettings(getDefaultSettings());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const industryOptions =
    settings?.industry_options?.split(',').map((s) => s.trim()) || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (error) setError('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Basic client-side sanity checks
      if (
        !formData.organizationName.trim() ||
        !formData.contactPerson.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim() ||
        !formData.industry.trim() ||
        !formData.jobDescription.trim()
      ) {
        throw new Error('Please complete all required fields.');
      }

      const { error: insertError } = await supabase
        .from('recruitment_applications')
        .insert([
          {
            organization_name: formData.organizationName,
            contact_person: formData.contactPerson,
            email: formData.email,
            phone: formData.phone,
            website: formData.website || null,
            industry: formData.industry,
            job_description: formData.jobDescription,
            status: 'new',
          },
        ]);

      if (insertError) throw insertError;

      setFormSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'We encountered an issue processing your request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartNewRequest = () => {
    setFormSubmitted(false);
    setFormData({
      organizationName: '',
      contactPerson: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      jobDescription: '',
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-[#478100] rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-slate-500 font-medium">Initializing Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div
        className="min-h-screen relative py-16 px-4 flex items-center"
      >
        <div className="w-full max-w-3xl mx-auto">
          {/* Top logo + title */}
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
            <div className="flex justify-center mb-4">
              <img
                src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768272166/Frame_2147226388_1_bk3t7g.png"
                alt="RWU Inc. Logo"
                className="h-14 w-auto"
              />
            </div>
            <h1 className="text-center text-2xl font-extrabold text-slate-900">
              {settings?.page_title}
            </h1>
            <p className="mt-1 text-center text-sm text-slate-700">
              {settings?.page_subtitle}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white py-8 px-6 shadow-sm border rounded-md border-slate-200 sm:px-10">
            {formSubmitted ? (
              <div className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-[#478100]/10 flex items-center justify-center mb-6 border border-[#478100]/20">
                  <CheckCircle2 className="w-10 h-10 text-[#478100]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  {settings?.success_message_title}
                </h2>
                <p className="text-sm text-slate-700 mb-6">{settings?.success_message_text}</p>

                <div className="bg-slate-50 rounded p-4 mb-6 border border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{settings?.response_time_text}</p>
                </div>

                <button
                  onClick={handleStartNewRequest}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#478100] text-white rounded-md font-semibold hover:bg-[#396800] transition-colors"
                >
                  New Talent Request
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <div>{error}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building2 size={16} className="text-slate-400" />
                      </div>
                      <input
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        placeholder="e.g. RWU Global Systems"
                        className="block w-full pl-10 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#478100]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Contact Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-slate-400" />
                      </div>
                      <input
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        placeholder="Full Name"
                        className="block w-full pl-10 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#478100]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-slate-400" />
                      </div>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        placeholder="work@email.com"
                        className="block w-full pl-10 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#478100]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-slate-400" />
                      </div>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        placeholder="+1 (000) 000-0000"
                        className="block w-full pl-10 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#478100]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-600 mb-1">Industry</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase size={16} className="text-slate-400" />
                      </div>
                      <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        className="block w-full pl-10 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#478100] appearance-none"
                      >
                        <option value="">Select Vertical</option>
                        {industryOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronRight size={16} className="rotate-90 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Role Description</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    rows={5}
                    placeholder="Describe the role, key responsibilities, and must-have skills..."
                    className="block w-full px-3 py-2.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#478100] resize-none"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center items-center gap-2 py-2.5 text-white bg-[#478100] rounded-md disabled:opacity-50 hover:bg-[#396800] transition-colors"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>{settings?.submit_button_text || 'Launch Talent Search'}</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-500 max-w-[70%]">
                    {settings?.privacy_notice}
                  </p>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-[#478100]" />
                    </div>
                    <div className="w-8 h-8 rounded bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-[#478100]" />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>


            <Footer />
          </div>

  );
};

export default RecruitPage;
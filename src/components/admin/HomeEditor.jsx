import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Layout, Gift, Image, FileText } from 'lucide-react';

const HomeEditor = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [homeData, setHomeData] = useState(null);
  const [benefitsData, setBenefitsData] = useState(null);
  const [error, setError] = useState(null);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchHomeData();
    fetchBenefits();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) throw error;
      if (data) setHomeData(data);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError(`Error fetching home data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchBenefits = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('benefits')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setBenefitsData(data);
    } catch (error) {
      console.error('Error fetching benefits:', error);
      setError(`Error fetching benefits: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHome = async () => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        hero_title: homeData.hero_title,
        hero_description: homeData.hero_description,
        hero_image_url: homeData.hero_image_url,
      };

      const { error } = await supabase
        .from('home_content')
        .update(updateData)
        .eq('id', homeData.id);

      if (error) throw error;
      
      showSuccess('Hero section updated successfully!');
      setEditing(null);
      await fetchHomeData();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving hero section: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBenefits = async () => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        heading: benefitsData.heading,
        benefitimage: benefitsData.benefitimage,
        text1head: benefitsData.text1head,
        text1description: benefitsData.text1description,
        text2head: benefitsData.text2head,
        text2description: benefitsData.text2description,
        text3head: benefitsData.text3head,
        text3description: benefitsData.text3description,
      };

      const { error } = await supabase
        .from('benefits')
        .update(updateData)
        .eq('id', benefitsData.id);

      if (error) throw error;
      
      showSuccess('Benefits updated successfully!');
      setEditing(null);
      await fetchBenefits();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving benefits: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateHomeField = (field, value) => {
    setHomeData({ ...homeData, [field]: value });
  };

  const updateBenefitField = (field, value) => {
    setBenefitsData({ ...benefitsData, [field]: value });
  };

  if (loading && !homeData && !benefitsData) {
    return (
   <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#478100]/20 border-t-[#478100] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading homepage data...</p>
      </div>
    );
  }

  if (!homeData || !benefitsData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">No data found. Please check your database.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Error Message Display */}
      {error && (
        <div className="p-4 rounded-lg border border-[#E9C236] bg-[#E9C236]/10">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#E9C236] flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[#E9C236]">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSection('hero')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'hero'
              ? 'border-[#E9C236] text-[#E9C236]'
              : 'border-transparent text-slate-500 hover:text-[#E9C236]'
          }`}
        >
          <Layout size={16} />
          Hero Section
        </button>
        <button
          onClick={() => setActiveSection('benefits')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeSection === 'benefits'
              ? 'border-[#E9C236] text-[#E9C236]'
              : 'border-transparent text-slate-500 hover:text-[#E9C236]'
          }`}
        >
          <Gift size={16} />
          Benefits
        </button>
      </div>

      {activeSection === 'hero' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Edit Hero</h3>
                {editing === 'hero' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveHome}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-sm font-medium transition-colors shadow-sm"
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="p-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing('hero')}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Title</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                    value={homeData?.hero_title || ''}
                    onChange={e => updateHomeField('hero_title', e.target.value)}
                    placeholder="Enter hero title..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors resize-none"
                    value={homeData?.hero_description || ''}
                    onChange={e => updateHomeField('hero_description', e.target.value)}
                    placeholder="Enter description..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Image URL</label>
                  <div className="relative">
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                      value={homeData?.hero_image_url || ''}
                      onChange={e => updateHomeField('hero_image_url', e.target.value)}
                      placeholder="https://..."
                    />
                    <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Preview</h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">Live</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">
                    {homeData?.hero_title || 'Untitled'}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {homeData?.hero_description || 'No description yet.'}
                  </p>
                </div>

                {homeData?.hero_image_url && (
                  <div className="relative h-64 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={homeData.hero_image_url}
                      className="w-full h-full object-cover"
                      alt="Hero Preview"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Benefits Section */
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Benefits Header</h3>
                <p className="text-xs text-slate-500 mt-1">Section title and image</p>
              </div>
              
              {editing === 'header' ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBenefits}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-sm font-medium transition-colors shadow-sm"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(null); fetchBenefits(); }}
                    className="p-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing('header')}
                  className="flex items-center gap-2 px-4 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              )}
            </div>

            {editing === 'header' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Heading</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                    value={benefitsData.heading || ''}
                    onChange={e => updateBenefitField('heading', e.target.value)}
                    placeholder="Enter heading..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Image URL</label>
                  <div className="relative">
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                      value={benefitsData.benefitimage || ''}
                      onChange={e => updateBenefitField('benefitimage', e.target.value)}
                      placeholder="https://..."
                    />
                    <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-900">{benefitsData.heading || 'No heading'}</h4>
                {benefitsData.benefitimage ? (
                  <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={benefitsData.benefitimage}
                      alt="Benefits"
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center">
                    <p className="text-sm text-slate-400">No image set</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Benefits List */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Benefits</h3>
                <p className="text-xs text-slate-500 mt-1">Edit your value propositions</p>
              </div>
              <button
                onClick={handleSaveBenefits}
                className="flex items-center gap-2 px-4 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-sm font-medium transition-colors shadow-sm"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save All'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['text1', 'text2', 'text3'].map((n, idx) => (
                <div key={n} className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-400">BENEFIT {idx + 1}</span>
                    <FileText size={16} className="text-slate-300" />
                  </div>
                  <div className="space-y-3">
                    <input
                      className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-200 focus:border-[#E9C236] outline-none text-base font-semibold text-slate-900 transition-colors placeholder:text-slate-300"
                      value={benefitsData?.[`${n}head`] || ''}
                      placeholder="Heading"
                      onChange={e => updateBenefitField(`${n}head`, e.target.value)}
                    />
                    <textarea
                      className="w-full px-0 py-2 bg-transparent border-b border-slate-200 focus:border-[#E9C236] outline-none text-sm text-slate-600 transition-colors placeholder:text-slate-300 resize-none"
                      value={benefitsData?.[`${n}description`] || ''}
                      placeholder="Description..."
                      onChange={e => updateBenefitField(`${n}description`, e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeEditor;
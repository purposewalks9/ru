import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Layout, Gift, Image, FileText, AlertCircle } from 'lucide-react';

const HomeEditor = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [homeData, setHomeData] = useState(null);
  const [benefitsData, setBenefitsData] = useState(null);
  const [error, setError] = useState(null);

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
        hero_subtitle: homeData.hero_subtitle,
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
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading homepage data...</p>
      </div>
    );
  }

  if (!homeData || !benefitsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No data found. Please check your database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveSection('hero')}
            className={`relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all flex-1 sm:flex-initial ${
              activeSection === 'hero'
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Layout size={18} />
            <span className="hidden sm:inline">Hero Section</span>
            <span className="sm:hidden">Hero</span>
            {activeSection === 'hero' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700" />
            )}
          </button>
          <button
            onClick={() => setActiveSection('benefits')}
            className={`relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all flex-1 sm:flex-initial ${
              activeSection === 'benefits'
                ? 'text-gray-900 bg-gray-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Gift size={18} />
            Benefits
            {activeSection === 'benefits' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Section Content */}
      {activeSection === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Editor Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Edit Hero</h3>
                {editing === 'hero' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveHome}
                      disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                    >
                      <Save size={16} />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing('hero')}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Title
                  </label>
                  <input
                    disabled={editing !== 'hero'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    value={homeData?.hero_title || ''}
                    onChange={e => updateHomeField('hero_title', e.target.value)}
                    placeholder="Enter hero title..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Title
                  </label>
                  <input
                    disabled={editing !== 'hero'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    value={homeData?.hero_subtitle || ''}
                    onChange={e => updateHomeField('hero_subtitle', e.target.value)}
                    placeholder="Enter hero subtitle..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    disabled={editing !== 'hero'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    value={homeData?.hero_description || ''}
                    onChange={e => updateHomeField('hero_description', e.target.value)}
                    placeholder="Enter description..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Image URL
                  </label>
                  <div className="relative">
                    <input
                      disabled={editing !== 'hero'}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      value={homeData?.hero_image_url || ''}
                      onChange={e => updateHomeField('hero_image_url', e.target.value)}
                      placeholder="https://..."
                    />
                    <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-green-600">Live</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                    {homeData?.hero_title || 'Untitled'}
                  </h4>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {homeData?.hero_description || 'No description yet.'}
                  </p>
                </div>

                {homeData?.hero_image_url ? (
                  <div className="relative h-72 lg:h-96 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={homeData.hero_image_url}
                      className="w-full h-full object-cover"
                      alt="Hero Preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><div class="text-center"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg><p class="text-sm">Image failed to load</p></div></div>';
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-72 lg:h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <div className="text-center">
                      <Image size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-400 font-medium">No image set</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Section Content */}
      {activeSection === 'benefits' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Benefits Header</h3>
                <p className="text-xs text-gray-500 mt-1">Section title and featured image</p>
              </div>
              
              {editing === 'header' ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveBenefits}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => { setEditing(null); fetchBenefits(); }}
                    className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing('header')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                >
                  <Edit3 size={16} />
                  Edit
                </button>
              )}
            </div>

            {editing === 'header' ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Heading
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                    value={benefitsData?.heading || ''}
                    onChange={e => updateBenefitField('heading', e.target.value)}
                    placeholder="Enter heading..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Image URL
                  </label>
                  <div className="relative">
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                      value={benefitsData?.benefitimage || ''}
                      onChange={e => updateBenefitField('benefitimage', e.target.value)}
                      placeholder="https://..."
                    />
                    <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-2xl font-bold text-gray-900">
                  {benefitsData?.heading || 'No heading'}
                </h4>
                {benefitsData?.benefitimage ? (
                  <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={benefitsData.benefitimage}
                      alt="Benefits"
                      className="w-full h-full object-cover"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <div className="text-center">
                      <Image size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-400 font-medium">No image set</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Benefits List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Benefits</h3>
                <p className="text-xs text-gray-500 mt-1">Edit your value propositions</p>
              </div>
              <button
                onClick={handleSaveBenefits}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50 w-full sm:w-auto justify-center"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save All'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['text1', 'text2', 'text3'].map((n, idx) => (
                <div 
                  key={n} 
                  className="group p-6 rounded-lg border border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-white transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-gray-500 tracking-wider">
                      BENEFIT {idx + 1}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                      <FileText size={16} className="text-gray-600" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <input
                      className="w-full px-0 py-2 bg-transparent border-b border-gray-300 focus:border-gray-600 outline-none text-base font-bold text-gray-900 transition-colors placeholder:text-gray-400"
                      value={benefitsData?.[`${n}head`] || ''}
                      placeholder="Heading"
                      onChange={e => updateBenefitField(`${n}head`, e.target.value)}
                    />
                    <textarea
                      className="w-full px-0 py-2 bg-transparent border-b border-gray-200 focus:border-gray-600 outline-none text-sm text-gray-600 transition-colors placeholder:text-gray-400 resize-none"
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
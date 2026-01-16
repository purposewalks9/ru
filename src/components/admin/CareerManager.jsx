import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Briefcase, HelpCircle, Plus, Trash2, Image, AlertCircle } from 'lucide-react';

const CareerManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCareerData();
    fetchFAQs();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchCareerData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('career')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setCareerData(data);
    } catch (error) {
      console.error('Error fetching career data:', error);
      setError(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError(`Error loading FAQs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCareer = async () => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        page_title: careerData.page_title,
        page_subtitle: careerData.page_subtitle,
        hero_text: careerData.hero_text,
        hero_image: careerData.hero_image,
        faq_section_title: careerData.faq_section_title,
        faq_section_subtitle: careerData.faq_section_subtitle,
      };

      const { error } = await supabase
        .from('career')
        .update(updateData)
        .eq('id', careerData.id);

      if (error) throw error;

      showSuccess('Career page updated successfully!');
      setEditing(null);
      await fetchCareerData();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFAQ = async (faq) => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        question: faq.question,
        answer: faq.answer,
        order_index: faq.order_index
      };

      const { error } = await supabase
        .from('faqs')
        .update(updateData)
        .eq('id', faq.id);

      if (error) throw error;

      showSuccess('FAQ updated successfully!');
      setEditing(null);
      await fetchFAQs();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = async () => {
    setLoading(true);
    setError(null);
    try {
      const newFAQ = {
        question: 'New Question',
        answer: 'New Answer',
        order_index: faqs.length + 1
      };

      const { error } = await supabase
        .from('faqs')
        .insert([newFAQ]);

      if (error) throw error;

      showSuccess('FAQ added successfully!');
      await fetchFAQs();
    } catch (error) {
      console.error('Error adding FAQ:', error);
      setError(`Error adding FAQ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showSuccess('FAQ deleted successfully!');
      await fetchFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setError(`Error deleting FAQ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateCareerField = (field, value) => {
    setCareerData({ ...careerData, [field]: value });
  };

  const updateFAQField = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  if (loading && !careerData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading career data...</p>
      </div>
    );
  }

  if (!careerData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Briefcase size={64} className="text-gray-200 mb-4" />
        <div className="text-gray-500 mb-2 font-semibold">No career data found</div>
        <p className="text-sm text-gray-400">Please add a row to your career table first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Career Page Content</h3>
                <p className="text-xs text-gray-600">Hero section settings</p>
              </div>
            </div>

            {editing === 'hero' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveCareer}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchCareerData(); }}
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
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Page Title
            </label>
            {editing === 'hero' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-lg font-bold text-gray-900 transition-colors"
                value={careerData.page_title || ''}
                onChange={e => updateCareerField('page_title', e.target.value)}
                placeholder="RWU Inc. Careers Growth"
              />
            ) : (
              <h4 className="text-2xl font-bold text-gray-900">
                {careerData.page_title || 'No title set'}
              </h4>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Page Subtitle
            </label>
            {editing === 'hero' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-base font-semibold text-gray-900 transition-colors"
                value={careerData.page_subtitle || ''}
                onChange={e => updateCareerField('page_subtitle', e.target.value)}
                placeholder="Careers Growth"
              />
            ) : (
              <p className="text-lg font-semibold text-gray-700">
                {careerData.page_subtitle || 'No subtitle set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Hero Text
            </label>
            {editing === 'hero' ? (
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                rows={5}
                value={careerData.hero_text || ''}
                onChange={e => updateCareerField('hero_text', e.target.value)}
                placeholder="Hero section text..."
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">
                {careerData.hero_text || 'No text set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Hero Image URL
            </label>
            {editing === 'hero' ? (
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={careerData.hero_image || ''}
                  onChange={e => updateCareerField('hero_image', e.target.value)}
                  placeholder="https://..."
                />
                <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3">
                {careerData.hero_image ? (
                  <>
                    <div className="h-48 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={careerData.hero_image}
                        alt="Hero"
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-mono break-all">
                      {careerData.hero_image}
                    </p>
                  </>
                ) : (
                  <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <div className="text-center">
                      <Image size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-400 font-medium">No image set</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              FAQ Section Title
            </label>
            {editing === 'hero' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-base font-bold text-gray-900 transition-colors"
                value={careerData.faq_section_title || ''}
                onChange={e => updateCareerField('faq_section_title', e.target.value)}
                placeholder="Commonly Asked Questions"
              />
            ) : (
              <p className="text-lg font-bold text-gray-900">
                {careerData.faq_section_title || 'No title set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              FAQ Section Subtitle
            </label>
            {editing === 'hero' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                value={careerData.faq_section_subtitle || ''}
                onChange={e => updateCareerField('faq_section_subtitle', e.target.value)}
                placeholder="Everything you need to know..."
              />
            ) : (
              <p className="text-sm text-gray-600">
                {careerData.faq_section_subtitle || 'No subtitle set'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">FAQs Management</h3>
                <p className="text-xs text-gray-600">{faqs.length} {faqs.length === 1 ? 'Question' : 'Questions'}</p>
              </div>
            </div>
            <button
              onClick={handleAddFAQ}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors"
              disabled={loading}
            >
              <Plus size={18} />
              Add FAQ
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No FAQs yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add FAQ" to create your first question</p>
            </div>
          ) : (
            faqs.map((faq, index) => (
              <div key={faq.id} className="group rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
                <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                        <HelpCircle size={16} className="text-gray-600" />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        FAQ #{index + 1}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {editing === `faq-${faq.id}` ? (
                        <>
                          <button
                            onClick={() => handleSaveFAQ(faq)}
                            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                            disabled={loading}
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => { setEditing(null); fetchFAQs(); }}
                            className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setEditing(`faq-${faq.id}`)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteFAQ(faq.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Question
                    </label>
                    {editing === `faq-${faq.id}` ? (
                      <input
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm font-semibold text-gray-900 transition-colors"
                        value={faq.question}
                        onChange={e => updateFAQField(faq.id, 'question', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-semibold text-gray-900">
                        {faq.question}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                      Answer
                    </label>
                    {editing === `faq-${faq.id}` ? (
                      <textarea
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                        rows={4}
                        value={faq.answer}
                        onChange={e => updateFAQField(faq.id, 'answer', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerManager;
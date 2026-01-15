import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Briefcase, HelpCircle, Plus, Trash2 } from 'lucide-react';

const CareerManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetchCareerData();
    fetchFAQs();
  }, []);

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
      alert(`Error loading data: ${error.message}`);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCareer = async () => {
    setLoading(true);
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
      alert(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFAQ = async (faq) => {
    setLoading(true);
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
      alert(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFAQ = async () => {
    setLoading(true);
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
      alert(`Error adding FAQ: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFAQ = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    setLoading(true);
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
      alert(`Error deleting FAQ: ${error.message}`);
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#478100]/20 border-t-[#478100] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading career data...</p>
      </div>
    );
  }

  if (!careerData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Briefcase size={64} className="text-slate-200 mb-4" />
        <div className="text-slate-500 mb-2 font-semibold">No career data found</div>
        <p className="text-sm text-slate-400">Please add a row to your career table first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
          <Briefcase size={200} />
        </div>

        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#478100]/10 text-[#478100] flex items-center justify-center shadow-sm border border-[#478100]/20">
              <Briefcase size={24} />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Career Page Content</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Hero Section</p>
            </div>
          </div>

          {editing === 'hero' ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveCareer}
                className="px-6 py-2.5 bg-[#478100] text-white rounded-xl text-xs font-bold hover:bg-[#5a9e00] transition-all shadow-xl shadow-[#478100]/20"
                disabled={loading}
              >
                <Save size={16} className="inline mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchCareerData(); }}
                className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('hero')}
              className="flex items-center px-6 py-2.5 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 text-xs font-bold transition-all shadow-sm"
            >
              <Edit3 size={16} className="mr-2" /> Edit Hero
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Page Title</label>
            <input
              disabled={editing !== 'hero'}
              className={`w-full px-6 py-4 rounded-2xl text-2xl font-extrabold tracking-tight transition-all ${
                editing === 'hero'
                  ? 'bg-slate-50 border border-[#478100]/20 ring-4 ring-[#478100]/5 text-slate-900'
                  : 'bg-transparent border-transparent p-0 text-slate-800'
              }`}
              value={careerData.page_title || ''}
              onChange={e => updateCareerField('page_title', e.target.value)}
              placeholder="RWU Inc. Careers Growth"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Page Subtitle</label>
            <input
              disabled={editing !== 'hero'}
              className={`w-full px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                editing === 'hero'
                  ? 'bg-slate-50 border border-slate-100 ring-4 ring-[#478100]/5'
                  : 'bg-transparent border-transparent p-0 text-slate-700'
              }`}
              value={careerData.page_subtitle || ''}
              onChange={e => updateCareerField('page_subtitle', e.target.value)}
              placeholder="Careers Growth"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hero Text</label>
            <textarea
              disabled={editing !== 'hero'}
              className={`w-full px-5 py-4 rounded-2xl text-sm font-medium text-slate-600 transition-all resize-none ${
                editing === 'hero'
                  ? 'bg-slate-50 border border-slate-100 ring-4 ring-[#478100]/5'
                  : 'bg-transparent border-transparent p-0'
              }`}
              rows={6}
              value={careerData.hero_text || ''}
              onChange={e => updateCareerField('hero_text', e.target.value)}
              placeholder="Hero section text..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hero Image URL</label>
            <input
              disabled={editing !== 'hero'}
              className={`w-full px-5 py-4 rounded-2xl text-xs font-mono text-slate-500 transition-all ${
                editing === 'hero'
                  ? 'bg-slate-50 border border-slate-100 ring-4 ring-[#478100]/5'
                  : 'bg-transparent border-transparent p-0'
              }`}
              value={careerData.hero_image || ''}
              onChange={e => updateCareerField('hero_image', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">FAQ Section Title</label>
            <input
              disabled={editing !== 'hero'}
              className={`w-full px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                editing === 'hero'
                  ? 'bg-slate-50 border border-slate-100 ring-4 ring-[#478100]/5'
                  : 'bg-transparent border-transparent p-0 text-slate-800'
              }`}
              value={careerData.faq_section_title || ''}
              onChange={e => updateCareerField('faq_section_title', e.target.value)}
              placeholder="Commonly Asked Questions"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">FAQ Section Subtitle</label>
            <input
              disabled={editing !== 'hero'}
              className={`w-full px-5 py-3 rounded-2xl text-sm text-slate-600 transition-all ${
                editing === 'hero'
                  ? 'bg-slate-50 border border-slate-100 ring-4 ring-[#478100]/5'
                  : 'bg-transparent border-transparent p-0'
              }`}
              value={careerData.faq_section_subtitle || ''}
              onChange={e => updateCareerField('faq_section_subtitle', e.target.value)}
              placeholder="Everything you need to know..."
            />
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E9C236]/10 text-[#E9C236] flex items-center justify-center shadow-sm border border-[#E9C236]/20">
              <HelpCircle size={24} />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">FAQs Management</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{faqs.length} Questions</p>
            </div>
          </div>
          <button
            onClick={handleAddFAQ}
            className="flex items-center px-6 py-3 bg-[#478100] text-white rounded-xl hover:bg-[#5a9e00] text-xs font-bold transition-all shadow-xl shadow-[#478100]/20"
            disabled={loading}
          >
            <Plus size={16} className="mr-2" />
            Add New FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">FAQ #{index + 1}</span>
                <div className="flex gap-2">
                  {editing === `faq-${faq.id}` ? (
                    <>
                      <button
                        onClick={() => handleSaveFAQ(faq)}
                        className="p-2 bg-[#478100] text-white rounded-lg hover:bg-[#5a9e00]"
                        disabled={loading}
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => { setEditing(null); fetchFAQs(); }}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditing(`faq-${faq.id}`)}
                        className="p-2 text-[#478100] hover:bg-[#478100] hover:text-white rounded-lg transition-colors"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Question</label>
                  <input
                    disabled={editing !== `faq-${faq.id}`}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      editing === `faq-${faq.id}`
                        ? 'bg-slate-50 border border-slate-200 ring-2 ring-[#478100]/20'
                        : 'bg-transparent border border-transparent text-slate-800'
                    }`}
                    value={faq.question}
                    onChange={e => updateFAQField(faq.id, 'question', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500">Answer</label>
                  <textarea
                    disabled={editing !== `faq-${faq.id}`}
                    className={`w-full px-4 py-3 rounded-xl text-sm text-slate-600 transition-all resize-none ${
                      editing === `faq-${faq.id}`
                        ? 'bg-slate-50 border border-slate-200 ring-2 ring-[#478100]/20'
                        : 'bg-transparent border border-transparent'
                    }`}
                    rows={4}
                    value={faq.answer}
                    onChange={e => updateFAQField(faq.id, 'answer', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerManager;
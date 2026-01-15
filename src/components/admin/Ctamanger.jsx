import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Image, Type, Palette, Mail } from 'lucide-react';

const CTAManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [ctaData, setCtaData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCtaData();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchCtaData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('cta_banner')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setCtaData(data);
    } catch (error) {
      console.error('Error fetching CTA data:', error);
      setError(`Error loading CTA data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('cta_banner')
        .update({
          headline: ctaData.headline,
          highlighted_word: ctaData.highlighted_word,
          background_image_url: ctaData.background_image_url,
          background_color: ctaData.background_color,
          underline_color: ctaData.underline_color,
          enable_email_collection: ctaData.enable_email_collection,
          email_placeholder: ctaData.email_placeholder,
          email_button_text: ctaData.email_button_text
        })
        .eq('id', ctaData.id);

      if (error) throw error;
      
      showSuccess('CTA banner updated successfully!');
      setEditing(false);
      await fetchCtaData();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving CTA: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setCtaData({ ...ctaData, [field]: value });
  };

  if (loading && !ctaData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Loading CTA data...</div>
      </div>
    );
  }

  if (!ctaData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">No CTA data found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Error Message */}
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

      {/* Editor Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E9C236]/10 text-[#E9C236] flex items-center justify-center">
              <Type size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">CTA Banner Manager</h3>
              <p className="text-xs text-slate-500 mt-1">Edit call-to-action section</p>
            </div>
          </div>
          
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-sm font-medium transition-colors shadow-sm"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(false); fetchCtaData(); }}
                className="p-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
            >
              <Edit3 size={16} />
              Edit CTA
            </button>
          )}
        </div>

        {editing && (
          <div className="space-y-6">
            {/* Content Section */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <Type size={18} className="text-[#E9C236]" />
                <h4 className="font-semibold text-slate-900">Content</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Headline Text
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                    value={ctaData.headline}
                    onChange={e => updateField('headline', e.target.value)}
                    rows={3}
                    placeholder="Enter your headline (include {word} where you want highlighting)"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    The word you specify below will be highlighted in the headline
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Word to Highlight
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                    value={ctaData.highlighted_word}
                    onChange={e => updateField('highlighted_word', e.target.value)}
                    placeholder="e.g., Careers"
                  />
                </div>
              </div>
            </div>

            {/* Styling Section */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <Palette size={18} className="text-[#E9C236]" />
                <h4 className="font-semibold text-slate-900">Styling</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Background Image URL
                  </label>
                  <div className="relative">
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                      value={ctaData.background_image_url || ''}
                      onChange={e => updateField('background_image_url', e.target.value)}
                      placeholder="https://..."
                    />
                    <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Background Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                      value={ctaData.background_color}
                      onChange={e => updateField('background_color', e.target.value)}
                      placeholder="#478100"
                    />
                    <input
                      type="color"
                      className="w-12 h-12 rounded-lg cursor-pointer"
                      value={ctaData.background_color || '#478100'}
                      onChange={e => updateField('background_color', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">
                    Underline Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                      value={ctaData.underline_color}
                      onChange={e => updateField('underline_color', e.target.value)}
                      placeholder="#E9C236"
                    />
                    <input
                      type="color"
                      className="w-12 h-12 rounded-lg cursor-pointer"
                      value={ctaData.underline_color || '#E9C236'}
                      onChange={e => updateField('underline_color', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Email Settings */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <Mail size={18} className="text-[#E9C236]" />
                <h4 className="font-semibold text-slate-900">Email Collection</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableEmail"
                    checked={ctaData.enable_email_collection || false}
                    onChange={e => updateField('enable_email_collection', e.target.checked)}
                    className="w-4 h-4 text-[#E9C236] rounded focus:ring-[#E9C236]"
                  />
                  <label htmlFor="enableEmail" className="text-sm text-slate-700">
                    Enable email subscription form
                  </label>
                </div>
                
                {ctaData.enable_email_collection && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Placeholder Text
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                        value={ctaData.email_placeholder}
                        onChange={e => updateField('email_placeholder', e.target.value)}
                        placeholder="Enter your email..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-2">
                        Button Text
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                        value={ctaData.email_button_text}
                        onChange={e => updateField('email_button_text', e.target.value)}
                        placeholder="Get Started"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preview Section */}
        <div className="mt-8 p-5 rounded-xl border border-slate-200 bg-slate-50">
          <h4 className="font-semibold text-slate-900 mb-4">Preview</h4>
          <div className="rounded-lg overflow-hidden border border-slate-300">
            {/* Simulated CTA Preview */}
            <div style={{
              backgroundColor: ctaData.background_color || '#478100',
              backgroundImage: ctaData.background_image_url ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${ctaData.background_image_url}')` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }} className="p-8 min-h-[200px] flex items-center justify-center">
              <div className="text-center max-w-2xl">
                <div className="text-white font-bold text-xl mb-4">
                  {ctaData.headline.split(ctaData.highlighted_word)[0]}
                  <span style={{ borderBottom: `3px solid ${ctaData.underline_color || '#E9C236'}` }}>
                    {ctaData.highlighted_word}
                  </span>
                  {ctaData.headline.split(ctaData.highlighted_word)[1]}
                </div>
                
                {ctaData.enable_email_collection && (
                  <div className="mt-6 max-w-md mx-auto flex gap-2">
                    <div className="flex-1 h-10 bg-white/20 rounded"></div>
                    <div className="w-24 h-10 bg-[#E9C236] rounded"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <p>Colors: Background: <span className="font-mono">{ctaData.background_color}</span>, Underline: <span className="font-mono">{ctaData.underline_color}</span></p>
            <p className="mt-1">Highlighted word: "{ctaData.highlighted_word}"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAManager;
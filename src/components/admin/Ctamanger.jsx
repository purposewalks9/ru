import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Image, Type, Palette, Mail, AlertCircle, Megaphone } from 'lucide-react';

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
      setError('Error loading CTA data');
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
      setError('Error saving CTA data');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setCtaData({ ...ctaData, [field]: value });
  };

  if (loading && !ctaData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading CTA data...</p>
      </div>
    );
  }

  if (!ctaData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No CTA data found. Please check your database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
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

      {/* Main Editor Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Megaphone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">CTA Banner Manager</h3>
                <p className="text-xs text-gray-600">Customize call-to-action section</p>
              </div>
            </div>
            
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(false); fetchCtaData(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Content Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                <Type size={16} className="text-gray-600" />
              </div>
              <h4 className="font-bold text-gray-900">Content</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Headline Text
                </label>
                {editing ? (
                  <textarea
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                    value={ctaData.headline}
                    onChange={e => updateField('headline', e.target.value)}
                    rows={3}
                    placeholder="Enter your headline (the highlighted word will be styled)"
                  />
                ) : (
                  <p className="text-sm text-gray-900 font-medium">{ctaData.headline}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  The word you specify below will be highlighted with an underline
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Word to Highlight
                </label>
                {editing ? (
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                    value={ctaData.highlighted_word}
                    onChange={e => updateField('highlighted_word', e.target.value)}
                    placeholder="e.g., Careers"
                  />
                ) : (
                  <span className="inline-block px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg">
                    {ctaData.highlighted_word}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Styling Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                <Palette size={16} className="text-gray-600" />
              </div>
              <h4 className="font-bold text-gray-900">Styling</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Background Image URL
                </label>
                {editing ? (
                  <div className="relative">
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                      value={ctaData.background_image_url || ''}
                      onChange={e => updateField('background_image_url', e.target.value)}
                      placeholder="https://..."
                    />
                    <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 font-mono break-all">
                    {ctaData.background_image_url || 'No image set'}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Background Color
                  </label>
                  {editing ? (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                        value={ctaData.background_color}
                        onChange={e => updateField('background_color', e.target.value)}
                        placeholder="#478100"
                      />
                      <input
                        type="color"
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                        value={ctaData.background_color || '#478100'}
                        onChange={e => updateField('background_color', e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-gray-200" 
                        style={{ backgroundColor: ctaData.background_color }}
                      />
                      <span className="text-sm font-mono text-gray-600">{ctaData.background_color}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Underline Color
                  </label>
                  {editing ? (
                    <div className="flex gap-2">
                      <input
                        className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                        value={ctaData.underline_color}
                        onChange={e => updateField('underline_color', e.target.value)}
                        placeholder="#4A5568"
                      />
                      <input
                        type="color"
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                        value={ctaData.underline_color || '#4A5568'}
                        onChange={e => updateField('underline_color', e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-gray-200" 
                        style={{ backgroundColor: ctaData.underline_color }}
                      />
                      <span className="text-sm font-mono text-gray-600">{ctaData.underline_color}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors duration-200">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                <Mail size={16} className="text-gray-600" />
              </div>
              <h4 className="font-bold text-gray-900">Email Collection</h4>
            </div>
            <div className="space-y-4">
              {editing ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      id="enableEmail"
                      checked={ctaData.enable_email_collection || false}
                      onChange={e => updateField('enable_email_collection', e.target.checked)}
                      className="w-4 h-4 text-gray-600 rounded focus:ring-gray-500 border-gray-300"
                    />
                    <label htmlFor="enableEmail" className="text-sm font-medium text-gray-700">
                      Enable email subscription form
                    </label>
                  </div>
                  
                  {ctaData.enable_email_collection && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Placeholder Text
                        </label>
                        <input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                          value={ctaData.email_placeholder}
                          onChange={e => updateField('email_placeholder', e.target.value)}
                          placeholder="Enter your email..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Button Text
                        </label>
                        <input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                          value={ctaData.email_button_text}
                          onChange={e => updateField('email_button_text', e.target.value)}
                          placeholder="Get Started"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      ctaData.enable_email_collection 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ctaData.enable_email_collection ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {ctaData.enable_email_collection && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500 text-xs">Placeholder:</span>
                        <p className="text-gray-900 font-medium">{ctaData.email_placeholder}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Button:</span>
                        <p className="text-gray-900 font-medium">{ctaData.email_button_text}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="rounded-lg border border-gray-200 p-5 bg-white">
            <h4 className="font-bold text-gray-900 mb-4">Live Preview</h4>
            <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <div style={{
                backgroundColor: ctaData.background_color || '#1F2937',
                backgroundImage: ctaData.background_image_url ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${ctaData.background_image_url}')` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }} className="p-12 min-h-[250px] flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <div className="text-white font-bold text-2xl mb-6">
                    {ctaData.headline.split(ctaData.highlighted_word)[0]}
                    <span style={{ 
                      borderBottom: `4px solid ${ctaData.underline_color || '#4A5568'}`,
                      paddingBottom: '2px'
                    }}>
                      {ctaData.highlighted_word}
                    </span>
                    {ctaData.headline.split(ctaData.highlighted_word)[1]}
                  </div>
                  
                  {ctaData.enable_email_collection && (
                    <div className="mt-8 max-w-md mx-auto flex gap-2">
                      <div className="flex-1 h-12 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"></div>
                      <div className="px-6 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {ctaData.email_button_text}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAManager;
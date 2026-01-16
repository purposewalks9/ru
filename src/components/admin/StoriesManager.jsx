import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Image, FileText, AlertCircle, BookOpen } from 'lucide-react';

const StoriesManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStory();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchStory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setStoryData(data);
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('stories')
          .insert([{
            pageheading: '',
            pagetext: '',
            pageimage: '',
            card1pic: '',
            card1description: '',
            card2pic: '',
            card2description: '',
            card3pic: '',
            card3description: '',
            card3name: '',
            card3status: ''
          }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        setStoryData(newData);
      }
    } catch (error) {
      console.error('Error fetching story:', error);
      setError(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', storyData.id);

      if (error) throw error;

      showSuccess(`${field} updated successfully!`);
      setEditing(null);
      fetchStory();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setStoryData({ ...storyData, [field]: value });
  };

  if (!storyData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading stories data...</p>
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

      {/* Page Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Page Header</h3>
                <p className="text-xs text-gray-600">Main story section</p>
              </div>
            </div>
            
            {editing === 'header' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Page Header')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchStory(); }}
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
        </div>

        <div className="p-6">
          {editing === 'header' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Page Heading
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={storyData.pageheading || ''}
                  onChange={e => updateField('pageheading', e.target.value)}
                  placeholder="Main heading for the story page"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Page Text
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                  rows={3}
                  value={storyData.pagetext || ''}
                  onChange={e => updateField('pagetext', e.target.value)}
                  placeholder="Introduction or description text"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Page Image URL
                </label>
                <div className="relative">
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                    value={storyData.pageimage || ''}
                    onChange={e => updateField('pageimage', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                  <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {storyData.pageimage ? (
                <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={storyData.pageimage}
                    alt="Page header"
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
              <h5 className="text-2xl font-bold text-gray-900">
                {storyData.pageheading || 'No heading set'}
              </h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                {storyData.pagetext || 'No text set'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Three Cards in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                  <FileText size={16} className="text-gray-600" />
                </div>
                <h4 className="font-bold text-gray-900">Card 1</h4>
              </div>
              {editing === 'card1' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('Card 1')}
                    className="p-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    disabled={loading}
                    title="Save"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => { setEditing(null); fetchStory(); }}
                    className="p-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing('card1')}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {editing === 'card1' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Image URL
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                    value={storyData.card1pic || ''}
                    onChange={e => updateField('card1pic', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm resize-none transition-colors"
                    rows={4}
                    value={storyData.card1description || ''}
                    onChange={e => updateField('card1description', e.target.value)}
                    placeholder="Card 1 description"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {storyData.card1pic ? (
                  <div className="h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={storyData.card1pic}
                      alt="Card 1"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <Image size={32} className="text-gray-300" />
                  </div>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {storyData.card1description || 'No description'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 2 */}
        <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                  <FileText size={16} className="text-gray-600" />
                </div>
                <h4 className="font-bold text-gray-900">Card 2</h4>
              </div>
              {editing === 'card2' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('Card 2')}
                    className="p-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    disabled={loading}
                    title="Save"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => { setEditing(null); fetchStory(); }}
                    className="p-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing('card2')}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {editing === 'card2' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Image URL
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                    value={storyData.card2pic || ''}
                    onChange={e => updateField('card2pic', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm resize-none transition-colors"
                    rows={4}
                    value={storyData.card2description || ''}
                    onChange={e => updateField('card2description', e.target.value)}
                    placeholder="Card 2 description"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {storyData.card2pic ? (
                  <div className="h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={storyData.card2pic}
                      alt="Card 2"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <Image size={32} className="text-gray-300" />
                  </div>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {storyData.card2description || 'No description'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 3 */}
        <div className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                  <FileText size={16} className="text-gray-600" />
                </div>
                <h4 className="font-bold text-gray-900">Card 3</h4>
              </div>
              {editing === 'card3' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave('Card 3')}
                    className="p-1.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    disabled={loading}
                    title="Save"
                  >
                    <Save size={16} />
                  </button>
                  <button
                    onClick={() => { setEditing(null); fetchStory(); }}
                    className="p-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Cancel"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing('card3')}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="p-5">
            {editing === 'card3' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Image URL
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                    value={storyData.card3pic || ''}
                    onChange={e => updateField('card3pic', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                    value={storyData.card3name || ''}
                    onChange={e => updateField('card3name', e.target.value)}
                    placeholder="Card name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                    value={storyData.card3status || ''}
                    onChange={e => updateField('card3status', e.target.value)}
                    placeholder="e.g., Active"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm resize-none transition-colors"
                    rows={4}
                    value={storyData.card3description || ''}
                    onChange={e => updateField('card3description', e.target.value)}
                    placeholder="Card 3 description"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {storyData.card3pic ? (
                  <div className="h-40 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={storyData.card3pic}
                      alt="Card 3"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <Image size={32} className="text-gray-300" />
                  </div>
                )}
                {storyData.card3name && (
                  <div className="text-sm font-bold text-gray-700">{storyData.card3name}</div>
                )}
                {storyData.card3status && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded">
                    {storyData.card3status}
                  </span>
                )}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {storyData.card3description || 'No description'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesManager;
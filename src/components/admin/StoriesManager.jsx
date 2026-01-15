import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Image, FileText } from 'lucide-react';

const StoriesManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [storyData, setStoryData] = useState(null);

  useEffect(() => {
    fetchStory();
  }, []);

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
        // Create initial empty row if none exists
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
      alert(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (field) => {
    setLoading(true);
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
      alert(`Error saving: ${error.message}`);
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#478100]/20 border-t-[#478100] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading stories data ....</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <FileText size={18} className="mr-2 text-[#478100]" />
            Page Header
          </h4>
          {editing === 'header' ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave('Page Header')}
                className="flex items-center px-3 py-1.5 bg-[#478100] text-white rounded-lg hover:bg-[#5a9e00] text-sm"
                disabled={loading}
              >
                <Save size={16} className="mr-1" /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchStory(); }}
                className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                <X size={16} className="mr-1" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('header')}
              className="flex items-center px-3 py-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded-lg transition-colors text-sm"
            >
              <Edit3 size={16} className="mr-1" /> Edit
            </button>
          )}
        </div>

        {editing === 'header' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Heading</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none"
                value={storyData.pageheading || ''}
                onChange={e => updateField('pageheading', e.target.value)}
                placeholder="Main heading for the story page"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Text</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none"
                rows={3}
                value={storyData.pagetext || ''}
                onChange={e => updateField('pagetext', e.target.value)}
                placeholder="Introduction or description text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Image URL</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none"
                value={storyData.pageimage || ''}
                onChange={e => updateField('pageimage', e.target.value)}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {storyData.pageimage && (
              <img
                src={storyData.pageimage}
                alt="Page header"
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            <h5 className="font-bold text-gray-800">{storyData.pageheading || 'No heading set'}</h5>
            <p className="text-sm text-gray-600">{storyData.pagetext || 'No text set'}</p>
          </div>
        )}
      </div>

      {/* Three Cards in Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Image size={18} className="mr-2 text-[#478100]" />
              Card 1
            </h4>
            {editing === 'card1' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Card 1')}
                  className="p-1.5 bg-[#478100] text-white rounded hover:bg-[#5a9e00]"
                  disabled={loading}
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => { setEditing(null); fetchStory(); }}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('card1')}
                className="p-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {editing === 'card1' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={storyData.card1pic || ''}
                  onChange={e => updateField('card1pic', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  rows={4}
                  value={storyData.card1description || ''}
                  onChange={e => updateField('card1description', e.target.value)}
                  placeholder="Card 1 description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {storyData.card1pic && (
                <img
                  src={storyData.card1pic}
                  alt="Card 1"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <p className="text-sm text-gray-600">{storyData.card1description || 'No description'}</p>
            </div>
          )}
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Image size={18} className="mr-2 text-[#478100]" />
              Card 2
            </h4>
            {editing === 'card2' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Card 2')}
                  className="p-1.5 bg-[#478100] text-white rounded hover:bg-[#5a9e00]"
                  disabled={loading}
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => { setEditing(null); fetchStory(); }}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('card2')}
                className="p-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {editing === 'card2' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={storyData.card2pic || ''}
                  onChange={e => updateField('card2pic', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  rows={4}
                  value={storyData.card2description || ''}
                  onChange={e => updateField('card2description', e.target.value)}
                  placeholder="Card 2 description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {storyData.card2pic && (
                <img
                  src={storyData.card2pic}
                  alt="Card 2"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <p className="text-sm text-gray-600">{storyData.card2description || 'No description'}</p>
            </div>
          )}
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <Image size={18} className="mr-2 text-[#478100]" />
              Card 3
            </h4>
            {editing === 'card3' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Card 3')}
                  className="p-1.5 bg-[#478100] text-white rounded hover:bg-[#5a9e00]"
                  disabled={loading}
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => { setEditing(null); fetchStory(); }}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('card3')}
                className="p-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {editing === 'card3' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={storyData.card3pic || ''}
                  onChange={e => updateField('card3pic', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={storyData.card3name || ''}
                  onChange={e => updateField('card3name', e.target.value)}
                  placeholder="Card name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={storyData.card3status || ''}
                  onChange={e => updateField('card3status', e.target.value)}
                  placeholder="e.g., Active"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  rows={4}
                  value={storyData.card3description || ''}
                  onChange={e => updateField('card3description', e.target.value)}
                  placeholder="Card 3 description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {storyData.card3pic && (
                <img
                  src={storyData.card3pic}
                  alt="Card 3"
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              {storyData.card3name && (
                <div className="text-sm font-semibold text-[#478100]">{storyData.card3name}</div>
              )}
              {storyData.card3status && (
                <div className="text-xs text-gray-500 font-medium">{storyData.card3status}</div>
              )}
              <p className="text-sm text-gray-600">{storyData.card3description || 'No description'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoriesManager;
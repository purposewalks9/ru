import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Gift, CheckCircle, Image as ImageIcon } from 'lucide-react';

const BenefitsManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [benefitsData, setBenefitsData] = useState(null);

  useEffect(() => {
    fetchBenefits();
  }, []);

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
      alert(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('benefits')
        .update(benefitsData)
        .eq('id', benefitsData.id);

      if (error) throw error;

      showSuccess(`${section} updated successfully!`);
      setEditing(null);
      fetchBenefits();
    } catch (error) {
      console.error('Error saving:', error);
      alert(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setBenefitsData({ ...benefitsData, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!benefitsData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="text-gray-500 mb-4">No benefits data found in database.</div>
        <p className="text-sm text-gray-400">Please add a row to your benefits table first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Image Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <Gift size={18} className="mr-2 text-[#478100]" />
            Section Header
          </h4>
          {editing === 'header' ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave('Header')}
                className="flex items-center px-3 py-1.5 bg-[#478100] text-white rounded-lg hover:bg-[#5a9e00] text-sm"
                disabled={loading}
              >
                <Save size={16} className="mr-1" /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchBenefits(); }}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none"
                value={benefitsData.heading || ''}
                onChange={e => updateField('heading', e.target.value)}
                placeholder="Why RWU Inc. is Different"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Benefit Image URL</label>
              <input
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none"
                value={benefitsData.benefitimage || ''}
                onChange={e => updateField('benefitimage', e.target.value)}
                placeholder="https://example.com/benefit-image.jpg"
                type="url"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h5 className="font-bold text-gray-800 text-2xl">{benefitsData.heading || 'No heading set'}</h5>
            {benefitsData.benefitimage && (
              <img
                src={benefitsData.benefitimage}
                alt="Benefits"
                className="w-full h-48 object-cover rounded-lg mt-3"
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
            {!benefitsData.benefitimage && (
              <p className="text-sm text-gray-400">No image set</p>
            )}
          </div>
        )}
      </div>

      {/* Three Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Benefit 1 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <CheckCircle size={18} className="mr-2 text-orange-500" />
              Benefit 1
            </h4>
            {editing === 'benefit1' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Benefit 1')}
                  className="p-1.5 bg-[#478100] text-white rounded hover:bg-[#5a9e00]"
                  disabled={loading}
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => { setEditing(null); fetchBenefits(); }}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('benefit1')}
                className="p-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {editing === 'benefit1' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={benefitsData.text1head || ''}
                  onChange={e => updateField('text1head', e.target.value)}
                  placeholder="Benefit title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  rows={4}
                  value={benefitsData.text1description || ''}
                  onChange={e => updateField('text1description', e.target.value)}
                  placeholder="Benefit description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h5 className="font-bold text-blue-900">{benefitsData.text1head || 'No title set'}</h5>
              <p className="text-sm text-gray-600">{benefitsData.text1description || 'No description set'}</p>
            </div>
          )}
        </div>

        {/* Benefit 2 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <CheckCircle size={18} className="mr-2 text-orange-500" />
              Benefit 2
            </h4>
            {editing === 'benefit2' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Benefit 2')}
                  className="p-1.5 bg-[#478100] text-white rounded hover:bg-[#5a9e00]"
                  disabled={loading}
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => { setEditing(null); fetchBenefits(); }}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('benefit2')}
                className="p-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {editing === 'benefit2' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={benefitsData.text2head || ''}
                  onChange={e => updateField('text2head', e.target.value)}
                  placeholder="Benefit title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  rows={4}
                  value={benefitsData.text2description || ''}
                  onChange={e => updateField('text2description', e.target.value)}
                  placeholder="Benefit description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h5 className="font-bold text-blue-900">{benefitsData.text2head || 'No title set'}</h5>
              <p className="text-sm text-gray-600">{benefitsData.text2description || 'No description set'}</p>
            </div>
          )}
        </div>

        {/* Benefit 3 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800 flex items-center">
              <CheckCircle size={18} className="mr-2 text-orange-500" />
              Benefit 3
            </h4>
            {editing === 'benefit3' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Benefit 3')}
                  className="p-1.5 bg-[#478100] text-white rounded hover:bg-[#5a9e00]"
                  disabled={loading}
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => { setEditing(null); fetchBenefits(); }}
                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('benefit3')}
                className="p-1.5 text-[#478100] hover:bg-[#478100] hover:text-white rounded transition-colors"
                title="Edit"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {editing === 'benefit3' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  value={benefitsData.text3head || ''}
                  onChange={e => updateField('text3head', e.target.value)}
                  placeholder="Benefit title"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#478100] outline-none text-sm"
                  rows={4}
                  value={benefitsData.text3description || ''}
                  onChange={e => updateField('text3description', e.target.value)}
                  placeholder="Benefit description"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <h5 className="font-bold text-blue-900">{benefitsData.text3head || 'No title set'}</h5>
              <p className="text-sm text-gray-600">{benefitsData.text3description || 'No description set'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitsManager;
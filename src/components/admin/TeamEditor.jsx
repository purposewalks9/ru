import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Users, Award, Sparkles, Trophy, Star, AlertCircle } from 'lucide-react';

const TeamManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [teamData, setTeamData] = useState(null);
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
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('team')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setTeamData(data);
    } catch (error) {
      console.error('Error fetching team data:', error);
      setError(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section) => {
    setLoading(true);
    setError(null);
    try {
      const updateData = {
        pageheading: teamData.pageheading,
        pagetext1: teamData.pagetext1,
        pagetext2: teamData.pagetext2,
        awardsheading: teamData.awardsheading,
        awardstext: teamData.awardstext,
        award1image: teamData.award1image,
        award1name: teamData.award1name,
        award2image: teamData.award2image,
        award2name: teamData.award2name,
        award3image: teamData.award3image,
        award3name: teamData.award3name,
        award4image: teamData.award4image,
        award4name: teamData.award4name,
      };

      console.log('Updating with data:', updateData);

      const { error } = await supabase
        .from('team')
        .update(updateData)
        .eq('id', teamData.id);

      if (error) throw error;

      showSuccess(`${section} updated successfully!`);
      setEditing(null);
      await fetchTeamData();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving ${section.toLowerCase()}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setTeamData({ ...teamData, [field]: value });
  };

  if (loading && !teamData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading team data...</p>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Users size={64} className="text-gray-200 mb-4" />
        <div className="text-gray-500 mb-2 font-semibold">No team data found</div>
        <p className="text-sm text-gray-400">Please add a row to your team table first.</p>
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

      {/* Page Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Team Overview</h3>
                <p className="text-xs text-gray-600">Public page content</p>
              </div>
            </div>

            {editing === 'header' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Page Header')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchTeamData(); }}
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

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Page Heading
            </label>
            {editing === 'header' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-xl font-bold text-gray-900 transition-colors"
                value={teamData.pageheading || ''}
                onChange={e => updateField('pageheading', e.target.value)}
                placeholder="Our Team at RWU Inc"
              />
            ) : (
              <h4 className="text-2xl font-bold text-gray-900">
                {teamData.pageheading || 'No heading set'}
              </h4>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Narrative Block 1
              </label>
              {editing === 'header' ? (
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-600 transition-colors resize-none"
                  rows={5}
                  value={teamData.pagetext1 || ''}
                  onChange={e => updateField('pagetext1', e.target.value)}
                  placeholder="First paragraph about the team"
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {teamData.pagetext1 || 'No text set'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Narrative Block 2
              </label>
              {editing === 'header' ? (
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-600 transition-colors resize-none"
                  rows={5}
                  value={teamData.pagetext2 || ''}
                  onChange={e => updateField('pagetext2', e.target.value)}
                  placeholder="Second paragraph about the team"
                />
              ) : (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {teamData.pagetext2 || 'No text set'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Awards Section Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recognition Hub</h3>
                <p className="text-xs text-gray-600">Awards & accolades</p>
              </div>
            </div>

            {editing === 'awards-header' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('Awards Header')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchTeamData(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('awards-header')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Section Heading
            </label>
            {editing === 'awards-header' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-lg font-bold text-gray-900 transition-colors"
                value={teamData.awardsheading || ''}
                onChange={e => updateField('awardsheading', e.target.value)}
                placeholder="Awards & Recognition"
              />
            ) : (
              <h4 className="text-xl font-bold text-gray-900">
                {teamData.awardsheading || 'No heading set'}
              </h4>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Description
            </label>
            {editing === 'awards-header' ? (
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-600 transition-colors resize-none"
                rows={3}
                value={teamData.awardstext || ''}
                onChange={e => updateField('awardstext', e.target.value)}
                placeholder="Description about awards"
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">
                {teamData.awardstext || 'No description set'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Four Awards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((n) => (
          <div 
            key={n} 
            className="group bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
          >
            <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                    <Star size={16} className="text-gray-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">Award {n}</h4>
                </div>
                {editing !== `award${n}` && (
                  <button
                    onClick={() => setEditing(`award${n}`)}
                    className="group-hover:opacity-100 p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="p-5">
              {editing === `award${n}` ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Image URL
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                      value={teamData[`award${n}image`] || ''}
                      onChange={e => updateField(`award${n}image`, e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Award Name
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm transition-colors"
                      value={teamData[`award${n}name`] || ''}
                      onChange={e => updateField(`award${n}name`, e.target.value)}
                      placeholder="Award title"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSave(`Award ${n}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                      disabled={loading}
                    >
                      <Save size={14} />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => { setEditing(null); fetchTeamData(); }}
                      className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-center">
                  {teamData[`award${n}image`] ? (
                    <div className="w-full h-32 flex items-center justify-center">
                      <img
                        src={teamData[`award${n}image`]}
                        alt={`Award ${n}`}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                      <Award size={48} className="text-gray-200" />
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-2">
                      {teamData[`award${n}name`] || 'No award name'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
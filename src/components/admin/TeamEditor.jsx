import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Users, Award, Sparkles, Trophy, Star } from 'lucide-react';

const TeamManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [teamData, setTeamData] = useState(null);
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
      // Create explicit update object matching database columns
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

      // CRITICAL: Check for error BEFORE using the data
      const { error } = await supabase
        .from('team')
        .update(updateData)
        .eq('id', teamData.id);

      // THIS WAS MISSING IN YOUR CODE - must check error first!
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E9C236]/20 border-t-[#E9C236] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading team data...</p>
      </div>
    );
  }

  if (!teamData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Users size={64} className="text-slate-200 mb-4" />
        <div className="text-slate-500 mb-2 font-semibold">No team data found</div>
        <p className="text-sm text-slate-400">Please add a row to your team table first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Error Message Display */}
      {error && (
        <div className="p-4 rounded-2xl border border-[#E9C236] bg-[#E9C236]/10">
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

      {/* Page Header Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Users size={200} />
        </div>

        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E9C236]/10 text-[#E9C236] flex items-center justify-center shadow-sm border border-[#E9C236]/20">
              <Users size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Team Overview</h4>
              <p className="text-xs text-slate-500 mt-1">Public Page Content</p>
            </div>
          </div>

          {editing === 'header' ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave('Page Header')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#E9C236] text-white rounded-lg text-sm font-medium hover:bg-[#D1A92F] transition-colors shadow-sm"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchTeamData(); }}
                className="p-2.5 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('header')}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
            >
              <Edit3 size={16} />
              Edit Header
            </button>
          )}
        </div>

        <div className={`space-y-6 ${editing === 'header' ? 'opacity-100' : 'opacity-100'}`}>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Page Heading</label>
            <input
              disabled={editing !== 'header'}
              className={`w-full px-4 py-3 rounded-lg text-xl font-bold transition-all ${editing === 'header'
                  ? 'bg-slate-50 border border-slate-200 focus:border-[#E9C236] focus:ring-2 focus:ring-[#E9C236]/10 text-slate-900'
                  : 'bg-transparent border-transparent p-0 text-slate-800'
                }`}
              value={teamData.pageheading || ''}
              onChange={e => updateField('pageheading', e.target.value)}
              placeholder="Our Team at RWU Inc"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Narrative Block 1</label>
              <textarea
                disabled={editing !== 'header'}
                className={`w-full px-4 py-3 rounded-lg text-sm text-slate-600 transition-all resize-none ${editing === 'header'
                    ? 'bg-slate-50 border border-slate-200 focus:border-[#E9C236] focus:ring-2 focus:ring-[#E9C236]/10'
                    : 'bg-transparent border-transparent p-0'
                  }`}
                rows={5}
                value={teamData.pagetext1 || ''}
                onChange={e => updateField('pagetext1', e.target.value)}
                placeholder="First paragraph about the team"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600 mb-2">Narrative Block 2</label>
              <textarea
                disabled={editing !== 'header'}
                className={`w-full px-4 py-3 rounded-lg text-sm text-slate-600 transition-all resize-none ${editing === 'header'
                    ? 'bg-slate-50 border border-slate-200 focus:border-[#E9C236] focus:ring-2 focus:ring-[#E9C236]/10'
                    : 'bg-transparent border-transparent p-0'
                  }`}
                rows={5}
                value={teamData.pagetext2 || ''}
                onChange={e => updateField('pagetext2', e.target.value)}
                placeholder="Second paragraph about the team"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Awards Section Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute -bottom-8 -right-8 opacity-5">
          <Trophy size={150} className="text-[#E9C236]" />
        </div>

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#E9C236]/10 text-[#E9C236] flex items-center justify-center shadow-sm border border-[#E9C236]/20">
              <Sparkles size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900">Recognition Hub</h4>
              <p className="text-xs text-slate-500 mt-1">Awards & Accolades</p>
            </div>
          </div>

          {editing === 'awards-header' ? (
            <div className="flex gap-2">
              <button
                onClick={() => handleSave('Awards Header')}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#E9C236] text-white rounded-lg text-sm font-medium hover:bg-[#D1A92F] transition-colors shadow-sm"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save Section'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchTeamData(); }}
                className="p-2.5 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('awards-header')}
              className="flex items-center gap-2 px-4 py-2.5 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
            >
              <Edit3 size={16} />
              Edit Section
            </button>
          )}
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Section Heading</label>
            <input
              disabled={editing !== 'awards-header'}
              className={`w-full px-4 py-3 rounded-lg text-lg font-bold transition-all ${editing === 'awards-header'
                  ? 'bg-slate-50 border border-slate-200 focus:border-[#E9C236] focus:ring-2 focus:ring-[#E9C236]/10 text-slate-900'
                  : 'bg-transparent border-transparent p-0 text-slate-800'
                }`}
              value={teamData.awardsheading || ''}
              onChange={e => updateField('awardsheading', e.target.value)}
              placeholder="Awards & Recognition"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-600 mb-2">Description</label>
            <textarea
              disabled={editing !== 'awards-header'}
              className={`w-full px-4 py-3 rounded-lg text-sm text-slate-600 transition-all resize-none ${editing === 'awards-header'
                  ? 'bg-slate-50 border border-slate-200 focus:border-[#E9C236] focus:ring-2 focus:ring-[#E9C236]/10'
                  : 'bg-transparent border-transparent p-0'
                }`}
              rows={3}
              value={teamData.awardstext || ''}
              onChange={e => updateField('awardstext', e.target.value)}
              placeholder="Description about awards"
            />
          </div>
        </div>
      </div>

      {/* Four Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="group bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E9C236]/0 to-[#E9C236]/0 group-hover:from-[#E9C236]/5 group-hover:to-[#E9C236]/5 transition-all duration-500" />

            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-[#E9C236] group-hover:text-white transition-all duration-500">
                <Star size={18} />
              </div>
              <button
                onClick={() => setEditing(`award${n}`)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-[#E9C236] transition-all"
              >
                <Edit3 size={16} />
              </button>
            </div>

            {editing === `award${n}` ? (
              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                  <input
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                    value={teamData[`award${n}image`] || ''}
                    onChange={e => updateField(`award${n}image`, e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Award Name</label>
                  <input
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none text-sm"
                    value={teamData[`award${n}name`] || ''}
                    onChange={e => updateField(`award${n}name`, e.target.value)}
                    placeholder="Award title"
                  />
                </div>
                <button
                  onClick={() => handleSave(`Award ${n}`)}
                  className="w-full flex items-center justify-center gap-1 py-2.5 bg-[#E9C236] text-white rounded-lg text-sm font-medium hover:bg-[#D1A92F] transition-colors mt-4"
                  disabled={loading}
                >
                  <Save size={14} />
                  {loading ? 'Saving...' : 'Save Award'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center relative z-10">
                {teamData[`award${n}image`] ? (
                  <div className="w-full h-32 flex items-center justify-center mb-4">
                    <img
                      src={teamData[`award${n}image`]}
                      alt={`Award ${n}`}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 flex items-center justify-center mb-4 bg-slate-50 rounded-xl">
                    <Award size={48} className="text-slate-200" />
                  </div>
                )}
                <p className="text-sm font-semibold text-slate-700 group-hover:text-[#E9C236] transition-colors">
                  {teamData[`award${n}name`] || 'No award name'}
                </p>
                <div className="pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-400">
                    Recognition {n}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
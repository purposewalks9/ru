import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Info, BarChart3, Image, AlertCircle } from 'lucide-react';

const AboutManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAboutData();
    fetchStats();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) setAboutData(data);
    } catch (error) {
      setError(`Error loading about data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('about_stats')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setStats(data);
    } catch (error) {
      setError(`Error loading stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbout = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('about')
        .update({
          title: aboutData.title,
          description: aboutData.description,
          hero_image: aboutData.hero_image
        })
        .eq('id', aboutData.id);

      if (error) throw error;

      showSuccess('About section updated successfully!');
      setEditing(null);
      await fetchAboutData();
    } catch (error) {
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStat = async (stat) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('about_stats')
        .update({
          value: stat.value,
          label: stat.label,
          image: stat.image,
          order_index: stat.order_index
        })
        .eq('id', stat.id);

      if (error) throw error;

      showSuccess('Stat updated successfully!');
      setEditing(null);
      await fetchStats();
    } catch (error) {
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateAboutField = (field, value) => {
    setAboutData({ ...aboutData, [field]: value });
  };

  const updateStatField = (id, field, value) => {
    setStats(stats.map(stat => 
      stat.id === id ? { ...stat, [field]: value } : stat
    ));
  };

  if (loading && !aboutData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading about data...</p>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <Info size={64} className="text-gray-200 mb-4" />
        <div className="text-gray-500 mb-2 font-semibold">No about data found</div>
        <p className="text-sm text-gray-400">Please add a row to your about table first.</p>
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

      {/* About Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Info size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">About Section</h3>
                <p className="text-xs text-gray-600">Main about content</p>
              </div>
            </div>

            {editing === 'about' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAbout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchAboutData(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('about')}
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
              Title
            </label>
            {editing === 'about' ? (
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-base font-bold text-gray-900 transition-colors"
                value={aboutData.title || ''}
                onChange={e => updateAboutField('title', e.target.value)}
                placeholder="About Us RWU Inc."
              />
            ) : (
              <h4 className="text-2xl font-bold text-gray-900">
                {aboutData.title || 'No title set'}
              </h4>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Description
            </label>
            {editing === 'about' ? (
              <textarea
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                rows={6}
                value={aboutData.description || ''}
                onChange={e => updateAboutField('description', e.target.value)}
                placeholder="Description about your company..."
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">
                {aboutData.description || 'No description set'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
              Hero Image URL
            </label>
            {editing === 'about' ? (
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={aboutData.hero_image || ''}
                  onChange={e => updateAboutField('hero_image', e.target.value)}
                  placeholder="https://..."
                />
                <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            ) : (
              <div className="space-y-3">
                {aboutData.hero_image ? (
                  <>
                    <div className="h-48 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={aboutData.hero_image}
                        alt="Hero"
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                    <p className="text-xs text-gray-500 font-mono break-all">
                      {aboutData.hero_image}
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
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Statistics</h3>
                <p className="text-xs text-gray-600">{stats.length} {stats.length === 1 ? 'Stat' : 'Stats'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {stats.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No stats yet</p>
              <p className="text-xs text-gray-400 mt-1">Statistics will appear here once added</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={stat.id} className="group rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden">
                  <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-gray-100 transition-colors border border-gray-200">
                          <BarChart3 size={16} className="text-gray-600" />
                        </div>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Stat #{index + 1}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {editing === `stat-${stat.id}` ? (
                          <>
                            <button
                              onClick={() => handleSaveStat(stat)}
                              className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                              disabled={loading}
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => { setEditing(null); fetchStats(); }}
                              className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setEditing(`stat-${stat.id}`)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Value
                      </label>
                      {editing === `stat-${stat.id}` ? (
                        <input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm font-bold text-gray-900 transition-colors"
                          value={stat.value}
                          onChange={e => updateStatField(stat.id, 'value', e.target.value)}
                          placeholder="15,000+"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Label
                      </label>
                      {editing === `stat-${stat.id}` ? (
                        <input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                          value={stat.label}
                          onChange={e => updateStatField(stat.id, 'label', e.target.value)}
                          placeholder="Employees worldwide"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {stat.label}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Icon Image URL
                      </label>
                      {editing === `stat-${stat.id}` ? (
                        <input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                          value={stat.image}
                          onChange={e => updateStatField(stat.id, 'image', e.target.value)}
                          placeholder="https://..."
                        />
                      ) : (
                        <div className="space-y-2">
                          {stat.image ? (
                            <>
                              <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={stat.image}
                                  alt={stat.label}
                                  className="w-full h-full object-contain"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              </div>
                              <p className="text-xs text-gray-500 font-mono break-all">
                                {stat.image.substring(0, 40)}...
                              </p>
                            </>
                          ) : (
                            <div className="h-20 w-20 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                              <Image size={24} className="text-gray-300" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
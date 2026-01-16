import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Image, AlertCircle, Newspaper, Award } from 'lucide-react';

const PressAwardsManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
    
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('User authenticated:', !!session?.user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchHeader(),
        fetchFeaturedArticle(),
        fetchArticles()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeader = async () => {
    const { data, error } = await supabase
      .from('press_header')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data) setHeaderData(data);
  };

  const fetchFeaturedArticle = async () => {
    const { data, error } = await supabase
      .from('press_featured')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data) setFeaturedArticle(data);
  };

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('press_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data) setArticles(data);
  };

  const handleSaveHeader = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Saving header data:', headerData);
      
      const { data, error } = await supabase
        .from('press_header')
        .update({
          title: headerData.title,
          description_1: headerData.description_1,
          description_2: headerData.description_2
        })
        .eq('id', headerData.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No rows were updated. Check if the ID exists.');
      }
      
      showSuccess('Header updated successfully!');
      setEditing(null);
      await fetchHeader();
    } catch (error) {
      console.error('Error saving header:', error);
      setError(`Error saving header: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFeatured = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Saving featured article:', featuredArticle);
      
      const { data, error } = await supabase
        .from('press_featured')
        .update({
          image: featuredArticle.image,
          title: featuredArticle.title,
          link: featuredArticle.link,
          publisher: featuredArticle.publisher
        })
        .eq('id', featuredArticle.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No rows were updated. Check if the ID exists.');
      }
      
      showSuccess('Featured article updated!');
      setEditing(null);
      await fetchFeaturedArticle();
    } catch (error) {
      console.error('Error saving featured:', error);
      setError(`Error saving featured article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveArticle = async (article) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Saving article:', article);
      
      const { data, error } = await supabase
        .from('press_articles')
        .update({
          image: article.image,
          title: article.title,
          link: article.link,
          publisher: article.publisher
        })
        .eq('id', article.id)
        .select();

      console.log('Update result:', { data, error });

      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No rows were updated. Check if the ID exists.');
      }
      
      showSuccess('Article updated!');
      setEditing(null);
      await fetchArticles();
    } catch (error) {
      console.error('Error saving article:', error);
      setError(`Error saving article: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateArticle = (id, field, value) => {
    setArticles(articles.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  if (loading && !headerData && !featuredArticle) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading press & award data...</p>
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

      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Newspaper size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Page Header</h3>
                <p className="text-xs text-gray-600">Main title and descriptions</p>
              </div>
            </div>
            
            {editing === 'header' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveHeader}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchHeader(); }}
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
          {editing === 'header' && headerData ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={headerData.title || ''}
                  onChange={e => setHeaderData({ ...headerData, title: e.target.value })}
                  placeholder="Press At RWU..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Description 1
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                  value={headerData.description_1 || ''}
                  onChange={e => setHeaderData({ ...headerData, description_1: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Description 2
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors resize-none"
                  value={headerData.description_2 || ''}
                  onChange={e => setHeaderData({ ...headerData, description_2: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          ) : headerData ? (
            <div className="space-y-3">
              <h4 className="text-2xl font-bold text-gray-900">{headerData.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{headerData.description_1}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{headerData.description_2}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Featured Article */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Featured Article</h3>
                <p className="text-xs text-gray-600">Main spotlight article</p>
              </div>
            </div>
            
            {editing === 'featured' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveFeatured}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchFeaturedArticle(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('featured')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {editing === 'featured' && featuredArticle ? (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Image URL
                </label>
                <div className="relative">
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                    value={featuredArticle.image || ''}
                    onChange={e => setFeaturedArticle({ ...featuredArticle, image: e.target.value })}
                    placeholder="https://..."
                  />
                  <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={featuredArticle.title || ''}
                  onChange={e => setFeaturedArticle({ ...featuredArticle, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Link
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={featuredArticle.link || ''}
                  onChange={e => setFeaturedArticle({ ...featuredArticle, link: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Publisher
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm text-gray-900 transition-colors"
                  value={featuredArticle.publisher || ''}
                  onChange={e => setFeaturedArticle({ ...featuredArticle, publisher: e.target.value })}
                />
              </div>
            </div>
          ) : featuredArticle ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 rounded-lg overflow-hidden bg-gray-100">
                {featuredArticle.image ? (
                  <img 
                    src={featuredArticle.image} 
                    alt="" 
                    className="w-full h-full object-cover" 
                    onError={(e) => e.target.style.display = 'none'} 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image size={48} className="text-gray-300" />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-gray-900">{featuredArticle.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    {featuredArticle.publisher}
                  </span>
                </div>
                <a 
                  href={featuredArticle.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-medium hover:underline transition-colors"
                >
                  View Article →
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Press Articles</h3>
            <p className="text-xs text-gray-500 mt-1">
              Manage your press coverage ({articles.length} {articles.length === 1 ? 'article' : 'articles'})
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((article) => (
            <div 
              key={article.id} 
              className="rounded-lg border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden"
            >
              {editing === `article-${article.id}` ? (
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Image URL
                    </label>
                    <input
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none transition-colors"
                      value={article.image}
                      onChange={e => updateArticle(article.id, 'image', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Title
                    </label>
                    <textarea
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none resize-none transition-colors"
                      value={article.title}
                      onChange={e => updateArticle(article.id, 'title', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Link
                    </label>
                    <input
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none transition-colors"
                      value={article.link}
                      onChange={e => updateArticle(article.id, 'link', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Publisher
                    </label>
                    <input
                      className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none transition-colors"
                      value={article.publisher}
                      onChange={e => updateArticle(article.id, 'publisher', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSaveArticle(article)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-xs font-medium transition-colors"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={() => { setEditing(null); fetchArticles(); }}
                      className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-xs transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        onError={(e) => e.target.style.display = 'none'} 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={32} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded mb-3">
                      {article.publisher}
                    </span>
                    <button
                      onClick={() => setEditing(`article-${article.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-xs font-medium transition-colors"
                    >
                      <Edit3 size={14} />
                      Edit Article
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Newspaper size={32} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No articles found</p>
            <p className="text-xs text-gray-400 mt-1">Articles will appear here once added</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressAwardsManager;
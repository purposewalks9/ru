import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, Image } from 'lucide-react';

const PressAwardsManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
    
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      console.log('User authenticated:', !!session?.user);
    };
    checkAuth();
  }, []);

  // Clear error after 5 seconds
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
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#478100]/20 border-t-[#478100] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading press&award data ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Error Message Display */}
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

      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Page Header</h3>
            <p className="text-xs text-slate-500 mt-1">Main title and descriptions</p>
          </div>
          
          {editing === 'header' ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveHeader}
                className="flex items-center gap-2 px-4 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-sm font-medium transition-colors shadow-sm"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchHeader(); }}
                className="p-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('header')}
              className="flex items-center gap-2 px-4 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
            >
              <Edit3 size={16} />
              Edit
            </button>
          )}
        </div>

        {editing === 'header' && headerData ? (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Title</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                value={headerData.title || ''}
                onChange={e => setHeaderData({ ...headerData, title: e.target.value })}
                placeholder="Press At RWU..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Description 1</label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors resize-none"
                value={headerData.description_1 || ''}
                onChange={e => setHeaderData({ ...headerData, description_1: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Description 2</label>
              <textarea
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors resize-none"
                value={headerData.description_2 || ''}
                onChange={e => setHeaderData({ ...headerData, description_2: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        ) : headerData ? (
          <div className="space-y-3">
            <h4 className="text-xl font-bold text-slate-900">{headerData.title}</h4>
            <p className="text-sm text-slate-600">{headerData.description_1}</p>
            <p className="text-sm text-slate-600">{headerData.description_2}</p>
          </div>
        ) : null}
      </div>

      {/* Featured Article */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Featured Article</h3>
            <p className="text-xs text-slate-500 mt-1">Main spotlight article</p>
          </div>
          
          {editing === 'featured' ? (
            <div className="flex gap-2">
              <button
                onClick={handleSaveFeatured}
                className="flex items-center gap-2 px-4 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-sm font-medium transition-colors shadow-sm"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchFeaturedArticle(); }}
                className="p-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('featured')}
              className="flex items-center gap-2 px-4 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-sm font-medium transition-colors"
            >
              <Edit3 size={16} />
              Edit
            </button>
          )}
        </div>

        {editing === 'featured' && featuredArticle ? (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Image URL</label>
              <div className="relative">
                <input
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                  value={featuredArticle.image || ''}
                  onChange={e => setFeaturedArticle({ ...featuredArticle, image: e.target.value })}
                  placeholder="https://..."
                />
                <Image size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Title</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                value={featuredArticle.title || ''}
                onChange={e => setFeaturedArticle({ ...featuredArticle, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Link</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                value={featuredArticle.link || ''}
                onChange={e => setFeaturedArticle({ ...featuredArticle, link: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Publisher</label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-[#E9C236] focus:outline-none text-sm text-slate-900 transition-colors"
                value={featuredArticle.publisher || ''}
                onChange={e => setFeaturedArticle({ ...featuredArticle, publisher: e.target.value })}
              />
            </div>
          </div>
        ) : featuredArticle ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 rounded-lg overflow-hidden bg-slate-100">
              <img src={featuredArticle.image} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-slate-900">{featuredArticle.title}</h4>
              <p className="text-sm text-slate-600">Publisher: {featuredArticle.publisher}</p>
              <a href={featuredArticle.link} className="text-sm text-[#E9C236] hover:underline hover:text-[#D1A92F] transition-colors">View Link</a>
            </div>
          </div>
        ) : null}
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Press Articles</h3>
            <p className="text-xs text-slate-500 mt-1">Edit existing articles (3 total)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <div key={article.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all">
              {editing === `article-${article.id}` ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL</label>
                    <input
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none"
                      value={article.image}
                      onChange={e => updateArticle(article.id, 'image', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Title</label>
                    <textarea
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none resize-none"
                      value={article.title}
                      onChange={e => updateArticle(article.id, 'title', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Link</label>
                    <input
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none"
                      value={article.link}
                      onChange={e => updateArticle(article.id, 'link', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Publisher</label>
                    <input
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:border-[#E9C236] focus:outline-none"
                      value={article.publisher}
                      onChange={e => updateArticle(article.id, 'publisher', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleSaveArticle(article)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-[#E9C236] text-white rounded-lg hover:bg-[#D1A92F] text-xs font-medium shadow-sm"
                    >
                      <Save size={14} />
                      Save
                    </button>
                    <button
                      onClick={() => { setEditing(null); fetchArticles(); }}
                      className="px-3 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-xs transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-32 rounded-lg overflow-hidden bg-slate-100 mb-3">
                    <img src={article.image} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-slate-600 mb-3">{article.publisher}</p>
                  <button
                    onClick={() => setEditing(`article-${article.id}`)}
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 border border-[#E9C236] text-[#E9C236] rounded-lg hover:bg-[#E9C236] hover:text-white text-xs font-medium transition-colors"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PressAwardsManager;
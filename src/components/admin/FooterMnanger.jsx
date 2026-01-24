import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Edit3, Save, X, AlertCircle, Plus, Trash2, ImageIcon } from 'lucide-react';

const FooterManager = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [footerData, setFooterData] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchFooterData();
    fetchSocialLinks();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('footer')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setFooterData(data);
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('footer')
          .insert([{
            description: '',
            location: '',
            phone: '',
            email: '',
            copyright_text: '',
            logo_url: ''
          }])
          .select()
          .single();
        
        if (insertError) throw insertError;
        setFooterData(newData);
      }
    } catch (error) {
      console.error('Error fetching footer:', error);
      setError(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) setSocialLinks(data);
    } catch (error) {
      console.error('Error fetching social links:', error);
      setError(`Error loading social links: ${error.message}`);
    }
  };

  const handleSaveLogo = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('footer')
        .update({ logo_url: footerData.logo_url })
        .eq('id', footerData.id);

      if (error) throw error;

      showSuccess('Logo URL updated successfully!');
      setEditing(null);
      fetchFooterData();
    } catch (error) {
      console.error('Error saving logo:', error);
      setError(`Error saving logo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFooter = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('footer')
        .update(footerData)
        .eq('id', footerData.id);

      if (error) throw error;

      showSuccess('Footer information updated successfully!');
      setEditing(null);
      fetchFooterData();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSocialLink = async (link) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('social_links')
        .update(link)
        .eq('id', link.id);

      if (error) throw error;

      showSuccess('Social link updated successfully!');
      setEditing(null);
      fetchSocialLinks();
    } catch (error) {
      console.error('Error saving:', error);
      setError(`Error saving: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSocialLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const maxOrder = socialLinks.length > 0 
        ? Math.max(...socialLinks.map(link => link.order_index || 0))
        : 0;

      const { error } = await supabase
        .from('social_links')
        .insert([{
          platform: 'New Platform',
          url: '',
          icon: 'link',
          order_index: maxOrder + 1
        }]);

      if (error) throw error;

      showSuccess('Social link added successfully!');
      fetchSocialLinks();
    } catch (error) {
      console.error('Error adding:', error);
      setError(`Error adding: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSocialLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showSuccess('Social link deleted successfully!');
      fetchSocialLinks();
    } catch (error) {
      console.error('Error deleting:', error);
      setError(`Error deleting: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateFooterField = (field, value) => {
    setFooterData({ ...footerData, [field]: value });
  };

  const updateSocialLink = (id, field, value) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  if (!footerData) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="mt-4 text-gray-600 font-medium">Loading footer data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Logo URL Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Footer Logo</h3>
            {editing === 'logo' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveLogo}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchFooterData(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('logo')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            {footerData.logo_url ? (
              <div className="flex-shrink-0">
                <div className="w-40 h-40 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img 
                    src={footerData.logo_url} 
                    alt="Footer Logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              {editing === 'logo' ? (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm"
                    value={footerData.logo_url || ''}
                    onChange={e => updateFooterField('logo_url', e.target.value)}
                    placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                  />
                  <p className="text-xs text-gray-500">
                    Paste your Cloudinary image URL here
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Logo URL</p>
                  {footerData.logo_url ? (
                    <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 break-all">
                      {footerData.logo_url}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No logo URL set</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Footer Information</h3>
            {editing === 'footer' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveFooter}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchFooterData(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('footer')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                <Edit3 size={16} />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {editing === 'footer' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm resize-none"
                  rows={2}
                  value={footerData.description || ''}
                  onChange={e => updateFooterField('description', e.target.value)}
                  placeholder="Footer description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm"
                  value={footerData.location || ''}
                  onChange={e => updateFooterField('location', e.target.value)}
                  placeholder="e.g., Remote First • Global Team"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm"
                  value={footerData.phone || ''}
                  onChange={e => updateFooterField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm"
                  value={footerData.email || ''}
                  onChange={e => updateFooterField('email', e.target.value)}
                  placeholder="hello@rwu-inc.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copyright Text
                </label>
                <input
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-sm"
                  value={footerData.copyright_text || ''}
                  onChange={e => updateFooterField('copyright_text', e.target.value)}
                  placeholder="© 2023 RWU Inc. All rights reserved."
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-700">
              <div><strong>Description:</strong> {footerData.description || 'Not set'}</div>
              <div><strong>Location:</strong> {footerData.location || 'Not set'}</div>
              <div><strong>Phone:</strong> {footerData.phone || 'Not set'}</div>
              <div><strong>Email:</strong> {footerData.email || 'Not set'}</div>
              <div><strong>Copyright:</strong> {footerData.copyright_text || 'Not set'}</div>
            </div>
          )}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Social Links</h3>
            <button
              onClick={handleAddSocialLink}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium"
              disabled={loading}
            >
              <Plus size={16} />
              Add Link
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {socialLinks.map((link) => (
              <div key={link.id} className="border border-gray-200 rounded-lg p-4">
                {editing === `social-${link.id}` ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 outline-none text-sm"
                        value={link.platform || ''}
                        onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}
                        placeholder="Platform name"
                      />
                      <input
                        className="w-24 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 outline-none text-sm"
                        value={link.icon || ''}
                        onChange={e => updateSocialLink(link.id, 'icon', e.target.value)}
                        placeholder="Icon"
                      />
                    </div>
                    <input
                      type="url"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-gray-600 outline-none text-sm"
                      value={link.url || ''}
                      onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                      placeholder="https://..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveSocialLink(link)}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm"
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditing(null); fetchSocialLinks(); }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{link.platform}</div>
                      <div className="text-sm text-gray-500">{link.url || 'No URL set'}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(`social-${link.id}`)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteSocialLink(link.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {socialLinks.length === 0 && (
              <p className="text-center text-gray-500 py-8">No social links added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterManager;
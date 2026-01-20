import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Mail, Shield, Lock, Eye, EyeOff, Save, X, AlertCircle } from 'lucide-react';

const Profile = ({ showSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [session, setSession] = useState(null);
  
  const [profileData, setProfileData] = useState({
    id: null,
    fullName: '',
    email: '',
    role: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const sessionData = localStorage.getItem('admin_session');
      
      if (!sessionData) {
        setError('No user found. Please log in again.');
        return;
      }

      const sessionObj = JSON.parse(sessionData);
      setSession(sessionObj);

      if (new Date().getTime() > sessionObj.expiresAt) {
        localStorage.removeItem('admin_session');
        setError('Session expired. Please log in again.');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', sessionObj.user.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (data) {
        setProfileData({
          id: data.id,
          fullName: data.full_name || '',
          email: data.email || '',
          role: data.role || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setError('');

    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) throw new Error('Session expired. Please log in again.');

      const sessionObj = JSON.parse(sessionData);
      const userId = sessionObj.user.id;

      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          full_name: profileData.fullName,
          email: profileData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) throw updateError;
      
      const updatedSession = {
        ...sessionObj,
        user: {
          ...sessionObj.user,
          full_name: profileData.fullName,
          email: profileData.email,
          role: profileData.role
        }
      };
      localStorage.setItem('admin_session', JSON.stringify(updatedSession));
      
      showSuccess('Profile updated successfully!');
      setEditing(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) throw new Error('Session expired. Please log in again.');

      const sessionObj = JSON.parse(sessionData);
      const userId = sessionObj.user.id;

      const { data: userData, error: fetchError } = await supabase
        .from('admin_users')
        .select('password')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Direct password comparison
      if (passwordData.currentPassword !== userData.password) {
        setError('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Store plain text password
      const { error: updateError } = await supabase
        .from('admin_users')
        .update({
          password: passwordData.newPassword,
          updated_at: new Date().toISOString(),
          failed_attempts: 0,
          locked_until: null
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      showSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setEditing(null);
    } catch (error) {
      console.error('Error changing password:', error);
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.email) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#478100]/20 border-t-[#478100] rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-900 mb-1">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Profile Information</h3>
                <p className="text-xs text-gray-600">Update your account details</p>
              </div>
            </div>

            {editing === 'profile' ? (
              <div className="flex gap-2">
                <button
                  onClick={handleProfileUpdate}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(null); fetchProfileData(); }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('profile')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <User size={16} />
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
            <input
              disabled={editing !== 'profile'}
              className={`w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                editing === 'profile'
                  ? 'bg-gray-50 border border-gray-300 focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-gray-900'
                  : 'bg-gray-50 border border-gray-300 text-gray-700'
              }`}
              value={profileData.fullName}
              onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                disabled={editing !== 'profile'}
                type="email"
                className={`w-full pl-11 pr-4 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'profile'
                    ? 'bg-gray-50 border border-gray-300 focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-gray-900'
                    : 'bg-gray-50 border border-gray-300 text-gray-700'
                }`}
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Role</label>
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-700">{profileData.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Security Settings</h3>
                <p className="text-xs text-gray-600">Change your password</p>
              </div>
            </div>

            {editing === 'password' ? (
              <div className="flex gap-2">
                <button
                  onClick={handlePasswordChange}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => { 
                    setEditing(null); 
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
                  }}
                  className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing('password')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                <Lock size={16} />
                Change Password
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                disabled={editing !== 'password'}
                type={showCurrentPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'password'
                    ? 'bg-gray-50 border border-gray-300 focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-gray-900'
                    : 'bg-gray-50 border border-gray-300 text-gray-400'
                }`}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
              {editing === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                disabled={editing !== 'password'}
                type={showNewPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'password'
                    ? 'bg-gray-50 border border-gray-300 focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-gray-900'
                    : 'bg-gray-50 border border-gray-300 text-gray-400'
                }`}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Enter new password (min 8 characters)"
              />
              {editing === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                disabled={editing !== 'password'}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'password'
                    ? 'bg-gray-50 border border-gray-300 focus:bg-white focus:border-gray-600 focus:ring-1 focus:ring-gray-300 outline-none text-gray-900'
                    : 'bg-gray-50 border border-gray-300 text-gray-400'
                }`}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
              {editing === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
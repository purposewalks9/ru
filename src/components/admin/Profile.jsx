import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, Mail, Shield, Lock, Eye, EyeOff, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Get user from localStorage session
      const sessionData = localStorage.getItem('admin_session');
      
      if (!sessionData) {
        setErrorMessage('No user found. Please log in again.');
        return;
      }

      const sessionObj = JSON.parse(sessionData);
      setSession(sessionObj);

      // Check if session is expired
      if (new Date().getTime() > sessionObj.expiresAt) {
        localStorage.removeItem('admin_session');
        setErrorMessage('Session expired. Please log in again.');
        return;
      }

      // Fetch user data from admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', sessionObj.user.id)
        .single();
      
      if (error) throw error;
      
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
      setErrorMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Get session to verify user
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) throw new Error('Session expired. Please log in again.');

      const sessionObj = JSON.parse(sessionData);
      const userId = sessionObj.user.id;

      // Update user in admin_users table
      const { error } = await supabase
        .from('admin_users')
        .update({
          full_name: profileData.fullName,
          email: profileData.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update session data
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
      
      setSuccessMessage('Profile updated successfully!');
      setEditing(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      // Get session
      const sessionData = localStorage.getItem('admin_session');
      if (!sessionData) throw new Error('Session expired. Please log in again.');

      const sessionObj = JSON.parse(sessionData);
      const userEmail = sessionObj.user.email;
      const userId = sessionObj.user.id;

      // First, verify current password by checking against database
      const { data: userData, error: fetchError } = await supabase
        .from('admin_users')
        .select('password')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      if (userData.password !== passwordData.currentPassword) {
        setErrorMessage('Current password is incorrect');
        setLoading(false);
        return;
      }

      // Update password in admin_users table
      const { error } = await supabase
        .from('admin_users')
        .update({
          password: passwordData.newPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      setSuccessMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setEditing(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage(error.message || 'Failed to change password');
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
        <p className="mt-4 text-slate-600 font-medium">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-sm text-green-700 font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-sm text-red-700 font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>
            <p className="text-xs text-slate-500 mt-1">Update your account details</p>
          </div>

          {editing === 'profile' ? (
            <div className="flex gap-2">
              <button
                onClick={handleProfileUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                disabled={loading}
              >
                <Save size={16} />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setEditing(null); fetchProfileData(); }}
                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('profile')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <User size={16} />
              Edit
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Full Name</label>
            <input
              disabled={editing !== 'profile'}
              className={`w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                editing === 'profile'
                  ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900'
                  : 'bg-slate-50 border border-slate-200 text-slate-700'
              }`}
              value={profileData.fullName}
              onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                disabled={editing !== 'profile'}
                type="email"
                className={`w-full pl-11 pr-4 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'profile'
                    ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-700'
                }`}
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Role</label>
            <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="text-blue-600" size={18} />
              <span className="text-sm font-semibold text-blue-700">{profileData.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
            <p className="text-xs text-slate-500 mt-1">Change your password</p>
          </div>

          {editing === 'password' ? (
            <div className="flex gap-2">
              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
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
                className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing('password')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
            >
              <Lock size={16} />
              Change Password
            </button>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                disabled={editing !== 'password'}
                type={showCurrentPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'password'
                    ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-400'
                }`}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
              {editing === 'password' && (
                <button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                disabled={editing !== 'password'}
                type={showNewPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'password'
                    ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-400'
                }`}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Enter new password (min 8 characters)"
              />
              {editing === 'password' && (
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Password must be at least 8 characters</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                disabled={editing !== 'password'}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full pl-11 pr-12 py-3 rounded-lg text-sm transition-colors ${
                  editing === 'password'
                    ? 'bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-400'
                }`}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
              />
              {editing === 'password' && (
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Shield } from 'lucide-react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Check if user exists in admin_users table
      const { data: adminUser, error: queryError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (queryError) {
        console.error('Database error:', queryError);
        throw new Error('Database connection error');
      }

      if (!adminUser) {
        throw new Error('Invalid email or password');
      }

      // 2. Check if password matches
      // For now, let's use a default password or check if password column exists
      // If you added password column to your table, use this:
      // if (adminUser.password !== password) {
      //   throw new Error('Invalid email or password');
      // }
      
      // For testing with your current table (no password column), use default
      const defaultPassword = 'admin123';
      if (password !== defaultPassword) {
        throw new Error('Invalid email or password');
      }

      // 3. Create a simple session in localStorage
      const sessionData = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role,
          created_at: adminUser.created_at
        },
        expiresAt: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
      };

      localStorage.setItem('admin_session', JSON.stringify(sessionData));

      // 4. Redirect to admin dashboard
      navigate('/admin');

    } catch (err) {
      console.error('Sign in error:', err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-g flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Admin Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700">
          Enter your credentials to access the dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/5  py-8 px-4  sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="admin@rwu.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-700 rounded-2xl  text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-700 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl text-sm font-bold text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/25"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn size={18} className="text-blue-300" />
                </span>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
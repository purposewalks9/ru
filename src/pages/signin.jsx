import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import bcrypt from 'bcryptjs';

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const emailNormalized = email.trim().toLowerCase();

      const { data: adminUser, error: queryError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', emailNormalized)
        .maybeSingle();

      if (queryError || !adminUser) {
        throw new Error('Invalid email or password');
      }

      if (
        adminUser.locked_until &&
        new Date(adminUser.locked_until).getTime() > Date.now()
      ) {
        throw new Error('Too many attempts. Try again later.');
      }

      console.log('Testing bcrypt...');
      console.log('Password entered:', password);
      console.log('Hash from DB:', adminUser.password);

      // Test if bcrypt is working
      let passwordMatch = false;
      
      try {
        // Try bcrypt compare
        passwordMatch = await bcrypt.compare(password, adminUser.password);
        console.log('Bcrypt compare result:', passwordMatch);
      } catch (bcryptError) {
        console.error('Bcrypt error:', bcryptError);
        // Fallback: direct comparison (only for debugging)
        passwordMatch = password === adminUser.password;
        console.log('Fallback comparison result:', passwordMatch);
      }

      if (!passwordMatch) {
        const attempts = (adminUser.failed_attempts || 0) + 1;

        const updates = {
          failed_attempts: attempts,
        };

        if (attempts >= MAX_ATTEMPTS) {
          updates.locked_until = new Date(
            Date.now() + LOCK_TIME_MS
          ).toISOString();
        }

        await supabase
          .from('admin_users')
          .update(updates)
          .eq('id', adminUser.id);

        throw new Error('Invalid email or password');
      }

      await supabase
        .from('admin_users')
        .update({
          failed_attempts: 0,
          locked_until: null,
        })
        .eq('id', adminUser.id);

      const sessionData = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: adminUser.role,
        },
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      localStorage.setItem('admin_session', JSON.stringify(sessionData));
      navigate('/admin');

    } catch (err) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center xl:py-48 lg:py-32 md:py-24 py-12">
      <div
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/do4b0rrte/image/upload/v1768055520/Rectangle_34_wtd3sg.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className="min-h-screen relative py-16 px-4"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
            <img
              src="https://res.cloudinary.com/do4b0rrte/image/upload/v1768272166/Frame_2147226388_1_bk3t7g.png"
              alt="RWU Inc. Logo"
              className="h-16 w-auto"
            />
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-900">
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the dashboard
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border rounded-md border-gray-200 sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#478100]"
                    placeholder="admin@rwu.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#478100]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 text-white bg-[#478100] rounded-md disabled:opacity-50 hover:bg-[#3a6800] transition-colors"
              >
                {loading ? 'Signing in...' : <><LogIn size={18} /> Sign in</>}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-gray-500">
              Authorized access only. All activities are monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if user exists in our JSON server
      const response = await axios.get(`http://localhost:3001/users?email=${formData.email}`);
      const users = response.data;

      if (users.length === 0) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const user = users[0];
      if (user.password !== formData.password) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      // Login successful
      login(user);
      navigate('/');
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-slate-200 mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to continue to TaskFlow</p>
        </div>
        
        {/* Form Container */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 rounded-2xl shadow-xl p-6 sm:p-8">
          {error && (
            <div className="bg-red-950/30 border border-red-800/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-slate-200 font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-slate-200"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-slate-300 hover:text-slate-200 font-medium transition duration-200 underline underline-offset-4 decoration-slate-500">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
        </div>
      </div>
    </div>
  );
};

export default Login;

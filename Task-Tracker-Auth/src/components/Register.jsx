import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const existingUser = await axios.get(`http://localhost:3001/users?email=${formData.email}`);
      if (existingUser.data.length > 0) {
        setError('User with this email already exists');
        setLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        id: Date.now().toString() // Simple ID generation
      };

      const response = await axios.post('http://localhost:3001/users', newUser);
      
      // Auto-login after registration
      login(response.data);
      navigate('/');
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-light text-slate-200 mb-2">Create Account</h2>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

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
                placeholder="Create a secure password"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600/40 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 transition duration-200"
                placeholder="Confirm your password"
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
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-300 hover:text-slate-200 font-medium transition duration-200 underline underline-offset-4 decoration-slate-500">
                Sign in here
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

export default Register;

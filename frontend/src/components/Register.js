import React, { useState } from 'react';
import { authAPI } from '../api';

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'CUSTOMER'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        if (onSwitchToLogin) {
          onSwitchToLogin();
        } else {
          window.location.href = '/';
        }
      }, 1500);
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500/60 to-red-600/60 rounded-lg shadow-lg p-6 w-full max-w-sm border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-12 h-12  rounded-lg mx-auto mb-3 flex items-center justify-center">
          <span className="text-xl text-white">👤</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Create Account</h2>
        <p className="text-sm text-white">Join our restaurant reservation system</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            required
          />
        </div>

        <button type="submit" className="w-full bg-black hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
          Create Account
        </button>
        
        {message && (
          <p className={`text-sm text-center p-3 rounded-lg ${
            message.includes('successful') 
              ? 'text-green-700 bg-green-50 border border-green-200' 
              : 'text-red-700 bg-red-50 border border-red-200'
          }`}>
            {message}
          </p>
        )}
      </form>
      
      {onSwitchToLogin && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2 text-sm">Already have an account?</p>
          <button 
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
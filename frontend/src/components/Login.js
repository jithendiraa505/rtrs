import React, { useState } from 'react';
import { authAPI } from '../api';
import { useAuth } from '../AuthContext';

const Login = ({ onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(credentials);
      login(response.data.message);
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500/60 to-red-600/60 rounded-lg shadow-lg p-6 w-full max-w-sm border border-gray-200">
      <div className="text-center mb-8">
        <div className="w-12 h-12  rounded-lg mx-auto mb-3 flex items-center justify-center">
          <span className="text-xl text-white">🍽️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-sm text-white">Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white mb-2">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-black hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
          Sign In
        </button>
        
        {error && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-white mb-1 text-sm">Don't have an account?</p>
        <button 
          onClick={onSwitchToRegister}
          className="text-black-600 hover:text-indigo-500 font-medium transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  );
};

export default Login;
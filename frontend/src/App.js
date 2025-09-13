import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('login');

  if (isAuthenticated) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
<h1 className="font-display text-3xl font-bold bg-white bg-clip-text text-transparent">RestaurantHub</h1>
            <div className="space-x-4">
              <button
                onClick={() => setCurrentView('login')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'login' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                    : 'text-white hover:bg-primary/10'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'register' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' 
                    : 'text-white hover:bg-secondary/10'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        {currentView === 'login' ? 
          <Login onSwitchToRegister={() => setCurrentView('register')} /> : 
          <Register />
        }
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
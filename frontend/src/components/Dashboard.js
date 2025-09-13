import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { reservationAPI, restaurantAPI } from '../api';
import RestaurantList from './RestaurantList';
import ReservationForm from './ReservationForm';
import AdminPanel from './AdminPanel';
import OwnerDashboard from './OwnerDashboard';
import MyReservations from './MyReservations';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [activeCustomerTab, setActiveCustomerTab] = useState('reservations');

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      loadMyReservations();
    }
  }, [user]);

  const loadMyReservations = async () => {
    try {
      const response = await reservationAPI.getMy();
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to load reservations');
    }
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowBooking(true);
  };

  const updateReservationStatus = async (id, status) => {
    try {
      await reservationAPI.updateStatus(id, status);
      loadMyReservations();
    } catch (error) {
      console.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-white  ">
      <nav className="bg-gray-800 shadow-sm border-b border-yellow-700 fixed top-0 left-0 right-0 z-50" style={{ height: '1.5cm' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-9 sm:h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm sm:text-lg">{user?.username?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl font-semibold text-white">
                {user?.username}
              </h1>
            </div>
          </div>
          <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base">
            Signout
          </button>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-4 sm:p-6" style={{ marginTop: '1.5cm' }}>

        {user?.role === 'CUSTOMER' && (
          <>
           <div className="bg-gradient-to-r from-orange-500/80 to-red-500/80 rounded-xl shadow-lg p-1 flex space-x-4">
  <nav className="flex space-x-4">
    <button
      onClick={() => setActiveCustomerTab('reservations')}
      className={`py-3 px-4 font-medium text-sm rounded-lg transition-all ${
        activeCustomerTab === 'reservations'
          ? 'bg-black text-white shadow-lg'
          : 'text-white hover:bg-white/20'
      }`}
    >
      📋 My Reservations
    </button>

    <button
      onClick={() => setActiveCustomerTab('restaurants')}
      className={`py-3 px-4 font-medium text-sm rounded-lg transition-all ${
        activeCustomerTab === 'restaurants'
          ? 'bg-black text-white shadow-lg'
          : 'text-white hover:bg-white/20'
      }`}
    >
      🍽️ Browse Restaurants
    </button>
  </nav>
</div>


            {activeCustomerTab === 'reservations' && <MyReservations />}

            {activeCustomerTab === 'restaurants' && (
              showBooking ? (
                <div style={{marginTop: '1cm'}}>
                  <ReservationForm
                    restaurant={selectedRestaurant}
                    onClose={() => setShowBooking(false)}
                    onSuccess={() => {
                      setShowBooking(false);
                      setActiveCustomerTab('reservations');
                    }}
                  />
                </div>
              ) : (
                <RestaurantList onSelectRestaurant={handleSelectRestaurant} />
              )
            )}
          </>
        )}

        {user?.role === 'OWNER' && <OwnerDashboard />}

        {user?.role === 'ADMIN' && <AdminPanel />}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800  mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <p className="text-white text-sm">
              © 2025 Restaurant Reservation System. All rights reserved.
            </p>
            <p className="text-blue-200 text-xs mt-2">
              Built with React & Spring Boot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
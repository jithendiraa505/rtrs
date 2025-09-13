import React, { useState, useEffect, useCallback } from 'react';
import { reservationAPI } from '../api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadReservations();
    
    // Set up automatic refresh every 30 seconds to catch status updates
    const interval = setInterval(() => {
      loadReservations(true); // Silent refresh
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadReservations = useCallback(async (silent = false) => {
    if (!silent) {
      setRefreshing(true);
    }
    try {
      const response = await reservationAPI.getMy();
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to load reservations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = () => {
    loadReservations();
  };

  const cancelReservation = async (id) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationAPI.cancel(id);
        loadReservations();
      } catch (error) {
        console.error('Failed to cancel reservation');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-10" style={{marginTop: '1.5cm'}}>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">📋 My Reservations</h2>
        <p className="text-xl text-white mb-6">Manage your dining reservations</p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-300 flex items-center gap-2 mx-auto"
        >
          <span className={refreshing ? 'animate-spin' : ''}>🔄</span>
          {refreshing ? 'Refreshing...' : 'Refresh Reservations'}
        </button>
      </div>
      
      {reservations.length === 0 ? (
        <div className="bg-gradient-to-r from-orange-500/80 to-red-600/80 backdrop-blur-sm border border-white/20 rounded-3xl p-16 text-center shadow-xl">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-white rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No Reservations Yet</h3>
          <p className="text-white text-lg">Start exploring restaurants to make your first reservation!</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🍽️</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{reservation.restaurantName}</h3>
                      <p className="text-gray-500 text-lg">Reservation #{reservation.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-indigo-600 text-sm font-semibold mb-2">📅 Date</p>
                      <p className="text-gray-800 font-bold text-lg">{reservation.date}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-indigo-600 text-sm font-semibold mb-2">⏰ Time</p>
                      <p className="text-gray-800 font-bold text-lg">{reservation.time}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-indigo-600 text-sm font-semibold mb-2">👥 Party Size</p>
                      <p className="text-gray-800 font-bold text-lg">{reservation.partySize} guests</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
                      <p className="text-indigo-600 text-sm font-semibold mb-2">📊 Status</p>
                      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${
                        reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border border-green-200' :
                        reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  {reservation.status !== 'CANCELLED' && (
                    <button
                      onClick={() => cancelReservation(reservation.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
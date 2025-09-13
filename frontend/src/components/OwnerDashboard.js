import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { restaurantAPI, reservationAPI } from '../api';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', location: '', cuisine: '', capacity: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      console.log('Loading restaurants for owner:', user.id);
      const response = await restaurantAPI.getMy();
      console.log('Owner restaurants response:', response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
    }
  };

  const loadReservations = async (restaurantId) => {
    try {
      const response = await reservationAPI.getForRestaurant(restaurantId);
      setReservations(response.data);
    } catch (error) {
      console.error('Failed to load reservations');
    }
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      const restaurantData = {
        ...newRestaurant,
        capacity: parseInt(newRestaurant.capacity)
      };
      await restaurantAPI.add(restaurantData);
      setNewRestaurant({ name: '', location: '', cuisine: '', capacity: '' });
      setShowAddRestaurant(false);
      loadRestaurants();
    } catch (error) {
      console.error('Failed to add restaurant');
    }
  };

  const updateReservationStatus = async (reservationId, status) => {
    try {
      await reservationAPI.updateStatus(reservationId, status);
      if (selectedRestaurant) {
        loadReservations(selectedRestaurant.id);
      }
    } catch (error) {
      console.error('Failed to update reservation status');
    }
  };

  const toggleAvailability = async (restaurantId, available) => {
    try {
      console.log('Toggling availability for restaurant:', restaurantId, 'to:', available);
      const response = await restaurantAPI.updateAvailability(restaurantId, available);
      console.log('Availability update response:', response);
      loadRestaurants();
    } catch (error) {
      console.error('Failed to update restaurant availability:', error);
      alert('Failed to update restaurant availability: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteRestaurant = async (restaurantId, restaurantName) => {
    if (window.confirm(`Are you sure you want to delete "${restaurantName}"? This action cannot be undone.`)) {
      try {
        await restaurantAPI.delete(restaurantId);
        loadRestaurants();
        if (selectedRestaurant && selectedRestaurant.id === restaurantId) {
          setSelectedRestaurant(null);
        }
      } catch (error) {
        console.error('Failed to delete restaurant:', error);
        if (error.message.includes('No static resource')) {
          alert('Backend server is not running. Please start the Spring Boot server first.');
        } else {
          alert('Failed to delete restaurant: ' + (error.response?.data?.message || error.message));
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* My Restaurants */}
<div className="rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg border border-white/20 bg-gradient-to-r from-black/30 to-black/30 backdrop-blur-md backdrop-saturate-150">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="font-display text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"> My Restaurants</h2>
          <button
            onClick={() => setShowAddRestaurant(true)}
            className="bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white px-4 py-2 rounded-full transition-colors w-full sm:w-auto"
          >
            Add Restaurant
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {Array.isArray(restaurants) && restaurants
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map(restaurant => (
            <div key={restaurant.id} className="bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white rounded-xl p-4 sm:p-6">
              <h3 className="font-display text-lg sm:text-xl font-bold mb-2 truncate">{restaurant.name}</h3>
              <p className="mb-1 text-sm sm:text-base">📍 {restaurant.location}</p>
              <p className="mb-1 text-sm sm:text-base">🍽️ {restaurant.cuisine}</p>
              <p className="mb-2 text-sm sm:text-base">👥 Capacity: {restaurant.capacity}</p>
              <p className={`mb-4 text-xs sm:text-sm font-semibold ${restaurant.available !== false ? 'text-green-200' : 'text-red-200'
                }`}>
                {restaurant.available !== false ? '✓ Available' : '✗ Unavailable'}
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      loadReservations(restaurant.id);
                    }}
                    className="bg-white text-primary px-3 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm flex-1"
                  >
                    View Reservations
                  </button>
                  <button
                    onClick={() => toggleAvailability(restaurant.id, restaurant.available === false)}
                    className={`px-3 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm flex-1 ${restaurant.available !== false
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                  >
                    {restaurant.available !== false ? 'Unavailable' : 'Available'}
                  </button>
                </div>
                <button
                  onClick={() => deleteRestaurant(restaurant.id, restaurant.name)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm w-full"
                >
                  🗑️ Delete Restaurant
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {Array.isArray(restaurants) && restaurants.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-black font-medium">
              Page {currentPage} of {Math.ceil(restaurants.length / itemsPerPage)}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(restaurants.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(restaurants.length / itemsPerPage)}
              className="px-4 py-2 bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Reservations */}
      {selectedRestaurant && (
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
              Reservations - <span className="block sm:inline">{selectedRestaurant.name}</span>
            </h2>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
            >
              Back to Restaurants
            </button>
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-sm sm:text-base">Customer</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-sm sm:text-base">Date</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-sm sm:text-base">Time</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-sm sm:text-base">Party</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-sm sm:text-base">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reservations) && reservations.map(reservation => (
                  <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">{reservation.customerName}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">{reservation.date}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">{reservation.time}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-sm sm:text-base">{reservation.partySize}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${reservation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                        {reservation.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {reservation.status === 'CONFIRMED' && (
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">Add New Restaurant</h3>
            <form onSubmit={addRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newRestaurant.location}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, location: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Cuisine Type"
                value={newRestaurant.cuisine}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newRestaurant.capacity}
                onChange={(e) => setNewRestaurant({ ...newRestaurant, capacity: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg">
                  Add Restaurant
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRestaurant(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-orange-500/80 to-red-600/80 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-white mb-2">My Restaurants</h3>
          <p className="text-3xl font-bold text-gray-800">{Array.isArray(restaurants) ? restaurants.length : 0}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500/80 to-red-600/80 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-white mb-2">Total Reservations</h3>
          <p className="text-3xl font-bold text-gray-800">{Array.isArray(reservations) ? reservations.length : 0}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500/80 to-red-600/80 rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-white mb-2">Pending Reservations</h3>
          <p className="text-3xl font-bold text-gray-800">
            {Array.isArray(reservations) ? reservations.filter(r => r.status === 'PENDING').length : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
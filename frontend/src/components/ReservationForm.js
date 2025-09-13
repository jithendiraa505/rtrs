import React, { useState } from 'react';
import { reservationAPI } from '../api';

const ReservationForm = ({ restaurant, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    restaurantId: restaurant?.id || '',
    date: '',
    time: '',
    partySize: 1
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Booking reservation with data:', formData);
      const response = await reservationAPI.book(formData);
      console.log('Reservation response:', response);
      setMessage('Reservation booked successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Reservation error:', error);
      setMessage(error.response?.data?.message || 'Failed to book reservation');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
      >
        ×
      </button>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-indigo-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <span className="text-xl text-white">📅</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Make Reservation</h3>
        <p className="text-gray-600 text-sm">Book your table</p>
      </div>
      
      {restaurant && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-lg text-white">🍽️</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
              <p className="text-sm text-gray-600">{restaurant.location}</p>
              <p className="text-xs text-gray-500">{restaurant.cuisine} • Capacity: {restaurant.capacity}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Party Size</label>
          <input
            type="number"
            min="1"
            max={restaurant?.capacity}
            value={formData.partySize}
            onChange={(e) => setFormData({...formData, partySize: parseInt(e.target.value)})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">
          Confirm Reservation
        </button>
        
        {message && (
          <div className={`text-center p-3 rounded-lg text-sm ${
            message.includes('success') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ReservationForm;
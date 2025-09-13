import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../api';

const RestaurantList = ({ onSelectRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState({ location: '', cuisine: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await restaurantAPI.getAll();
      setRestaurants(response.data);
    } catch (error) {
      console.error('Failed to load restaurants');
    }
  };

  const handleSearch = async (type) => {
    try {
      const response = type === 'location' 
        ? await restaurantAPI.searchByLocation(search.location)
        : await restaurantAPI.searchByCuisine(search.cuisine);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Search failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8 sm:mb-10" style={{marginTop: '1.5cm'}}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-500/80 to-red-600/80 bg-clip-text text-transparent mb-4">🍽️ Discover Restaurants</h2>
        <p className="text-lg sm:text-xl text-gray-600">Find your perfect dining experience</p>
      </div>
      
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="🌍 Search by location"
            value={search.location}
            onChange={(e) => setSearch({...search, location: e.target.value})}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-white backdrop-blur-sm border border-indigo-200 rounded-2xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg w-full sm:min-w-[200px] lg:min-w-[250px] text-sm sm:text-base"
          />
          <button onClick={() => handleSearch('location')} className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-black to-black hover:from-yellow-500/80 hover:to-red-400/80 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Search
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="🍜 Search by cuisine"
            value={search.cuisine}
            onChange={(e) => setSearch({...search, cuisine: e.target.value})}
            className="px-4 sm:px-6 py-3 sm:py-4 bg-white backdrop-blur-sm border border-indigo-200 rounded-2xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg w-full sm:min-w-[200px] lg:min-w-[250px] text-sm sm:text-base"
          />
          <button onClick={() => handleSearch('cuisine')} className="px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-black to-black hover:from-yellow-500/80 hover:to-red-400/80 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
            Search
          </button>
        </div>
        
        <button onClick={loadRestaurants} className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-black to-black hover:from-yellow-500/80 hover:to-red-400/80 text-white rounded-full font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
          Show All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {Array.isArray(restaurants) && restaurants
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map(restaurant => (
          <div key={restaurant.id} className="bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white rounded-xl p-4 sm:p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-white-600/80 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg">🍽️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-yellow-200 transition-colors duration-300 truncate">{restaurant.name}</h3>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm">📍</span>
                <span className="font-medium text-sm truncate">{restaurant.location}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm">🍜</span>
                <span className="font-medium text-sm">{restaurant.cuisine}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm">👥</span>
                <span className="font-medium text-sm">Capacity: {restaurant.capacity}</span>
              </div>
            </div>
            
            {onSelectRestaurant && (
              <button 
                onClick={() => onSelectRestaurant(restaurant)}
                disabled={!restaurant.available}
                className={`w-full py-2 rounded-xl font-bold text-sm shadow-lg transition-all duration-300 ${
                  restaurant.available 
                    ? 'bg-white/20 hover:bg-white/30 text-white transform hover:scale-105 hover:shadow-xl border border-white/30' 
                    : 'bg-gray-600/50 text-gray-300 cursor-not-allowed'
                }`}
              >
                {restaurant.available ? '✨ Book Table' : '❌ Unavailable'}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {Array.isArray(restaurants) && restaurants.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gradient-to-r from-orange-500/80 to-red-600/80 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-700 transition-all"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700 font-medium">
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
  );
};

export default RestaurantList;
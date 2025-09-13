import React, { useState, useEffect } from 'react';
import { authAPI, restaurantAPI, reservationAPI } from '../api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showUserHistory, setShowUserHistory] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showEditRestaurant, setShowEditRestaurant] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUser, setEditUser] = useState({ id: '', username: '', email: '', role: '', password: '' });
  const [editRestaurant, setEditRestaurant] = useState({ id: '', name: '', location: '', cuisine: '', capacity: '', ownerId: '' });
  const [userReservations, setUserReservations] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'OWNER' });
  const [newRestaurant, setNewRestaurant] = useState({ name: '', location: '', cuisine: '', capacity: '', ownerId: '' });

  useEffect(() => {
    loadUsers();
    loadRestaurants();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await authAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      console.log('Loading all restaurants for admin');
      const response = await restaurantAPI.getAll();
      console.log('Admin restaurants response:', response.data);
      setRestaurants(response.data || []);
    } catch (error) {
      console.error('Failed to load restaurants:', error);
      setRestaurants([]);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await authAPI.deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error('Failed to delete user');
      }
    }
  };

  const changeRole = async (id, role) => {
    try {
      await authAPI.changeUserRole(id, role);
      loadUsers();
    } catch (error) {
      console.error('Failed to change role');
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      await authAPI.register(newUser);
      setNewUser({ username: '', email: '', password: '', role: 'OWNER' });
      setShowAddUser(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to add user');
    }
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      const restaurantData = {
        ...newRestaurant,
        capacity: parseInt(newRestaurant.capacity),
        owner: { id: parseInt(newRestaurant.ownerId) }
      };
      await restaurantAPI.adminAdd(restaurantData);
      setNewRestaurant({ name: '', location: '', cuisine: '', capacity: '', ownerId: '' });
      setShowAddRestaurant(false);
      loadRestaurants();
    } catch (error) {
      console.error('Failed to add restaurant');
    }
  };

  const viewUserHistory = async (user) => {
    setSelectedUser(user);
    if (user.role === 'CUSTOMER') {
      try {
        // Note: This would need a backend endpoint to get user reservations by admin
        // For now, we'll show user info only
        setUserReservations([]);
      } catch (error) {
        console.error('Failed to load user reservations');
      }
    }
    setShowUserHistory(true);
  };

  const editUserInfo = (user) => {
    setEditUser({ id: user.id, username: user.username, email: user.email, role: user.role, password: '' });
    setShowEditUser(true);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const originalUser = users.find(u => u.id === editUser.id);
      
      // Update username and email
      await authAPI.updateUser(editUser.id, {
        username: editUser.username,
        email: editUser.email
      });
      
      // Update role if changed
      if (editUser.role !== originalUser?.role) {
        await authAPI.changeUserRole(editUser.id, editUser.role);
      }
      
      // Update password if provided
      if (editUser.password.trim()) {
        await authAPI.changeUserPassword(editUser.id, editUser.password);
      }
      
      setShowEditUser(false);
      loadUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please check if username/email already exists.');
    }
  };

  const editRestaurantInfo = (restaurant) => {
    setEditRestaurant({
      id: restaurant.id,
      name: restaurant.name,
      location: restaurant.location,
      cuisine: restaurant.cuisine,
      capacity: restaurant.capacity,
      ownerId: restaurant.owner?.id || ''
    });
    setShowEditRestaurant(true);
  };

  const updateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const restaurantData = {
        ...editRestaurant,
        capacity: parseInt(editRestaurant.capacity),
        owner: { id: parseInt(editRestaurant.ownerId) }
      };
      await restaurantAPI.adminUpdate(editRestaurant.id, restaurantData);
      setShowEditRestaurant(false);
      loadRestaurants();
    } catch (error) {
      console.error('Failed to update restaurant');
    }
  };

  const deleteRestaurant = async (id) => {
    if (window.confirm('Delete this restaurant?')) {
      try {
        await restaurantAPI.adminDelete(id);
        loadRestaurants();
      } catch (error) {
        console.error('Failed to delete restaurant');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
<div className="bg-gradient-to-r from-orange-500/80 to-red-500/80 rounded-xl shadow-lg p-1 flex space-x-4">
  <button
    onClick={() => setActiveTab('users')}
    className={`px-6 py-3 font-semibold rounded-lg transition-all ${
      activeTab === 'users'
        ? 'bg-black text-white shadow-lg'   // active tab shows box style
        : 'text-white hover:bg-white/20'     // inactive tab remains plain
    }`}
  >
    User Management
  </button>

  <button
    onClick={() => setActiveTab('restaurants')}
    className={`px-6 py-3 font-semibold rounded-lg transition-all ${
      activeTab === 'restaurants'
        ? 'bg-black text-white shadow-lg'   // active tab shows box style
        : 'text-white hover:bg-white/20'     // inactive tab remains plain
    }`}
  >
    Restaurant Management
  </button>
</div>

      {activeTab === 'users' && (
<div className="bg-gradient-to-r from-orange-500/80 to-red-600/80 rounded-xl p-8 shadow-lg text-white">        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-3xl font-bold text-white">User Management</h2>
          <button
            onClick={() => setShowAddUser(true)}
              className="bg-gradient-to-r from-yellow-500/80 to-green-600/80 hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Add Owner
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">ID</th>
                <th className="text-left py-3 px-4 font-semibold">Username</th>
                <th className="text-left py-3 px-4 font-semibold">Email</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
<tr
  key={user.id}
  className="border-b border-gray-100 hover:bg-white/10 hover:backdrop-blur-md hover:backdrop-saturate-150 transition-colors"
>
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-primary text-black"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="OWNER">Owner</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editUserInfo(user)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => viewUserHistory(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        History
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="bg-gradient-to-r from-orange-500/80 to-red-600/80 rounded-xl p-8 shadow-lg text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-3xl font-bold text-white">Restaurant Management</h2>
            <button
              onClick={() => setShowAddRestaurant(true)}
              className="bg-gradient-to-r from-yellow-500/80 to-green-600/80 hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Add Restaurant
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Location</th>
                  <th className="text-left py-3 px-4 font-semibold">Cuisine</th>
                  <th className="text-left py-3 px-4 font-semibold">Capacity</th>
                  <th className="text-left py-3 px-4 font-semibold">Owner</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(restaurants) && restaurants.length > 0 ? restaurants.map(restaurant => (
                  <tr
  key={restaurant.id}
  className="border-b border-gray-100 hover:bg-white/10 hover:backdrop-blur-md hover:backdrop-saturate-150 transition-colors"
>

                    <td className="py-3 px-4">{restaurant.id}</td>
                    <td className="py-3 px-4 font-semibold">{restaurant.name}</td>
                    <td className="py-3 px-4">{restaurant.location}</td>
                    <td className="py-3 px-4">{restaurant.cuisine}</td>
                    <td className="py-3 px-4">{restaurant.capacity}</td>
                    <td className="py-3 px-4">{restaurant.owner?.username || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editRestaurantInfo(restaurant)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRestaurant(restaurant.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500">
                      {Array.isArray(restaurants) ? 'No restaurants found' : 'Loading restaurants...'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">Add Restaurant Owner</h3>
            <form onSubmit={addUser} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg">
                  Add Owner
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">Add Restaurant</h3>
            <form onSubmit={addRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={newRestaurant.location}
                onChange={(e) => setNewRestaurant({...newRestaurant, location: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Cuisine Type"
                value={newRestaurant.cuisine}
                onChange={(e) => setNewRestaurant({...newRestaurant, cuisine: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newRestaurant.capacity}
                onChange={(e) => setNewRestaurant({...newRestaurant, capacity: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <select
                value={newRestaurant.ownerId}
                onChange={(e) => setNewRestaurant({...newRestaurant, ownerId: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Owner</option>
                {Array.isArray(users) && users.filter(u => u.role === 'OWNER').map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.username}</option>
                ))}
              </select>
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

      {/* User History Modal */}
      {showUserHistory && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-2xl font-bold text-primary">User History - {selectedUser.username}</h3>
              <button 
                onClick={() => setShowUserHistory(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">User Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <p><span className="font-medium">ID:</span> {selectedUser.id}</p>
                  <p><span className="font-medium">Username:</span> {selectedUser.username}</p>
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
                </div>
              </div>

              {/* Reservations History */}
              {selectedUser.role === 'CUSTOMER' && (
                <div>
                  <h4 className="font-semibold text-lg mb-4">Reservation History</h4>
                  <div className="text-gray-600">
                    <p>Reservation history would be displayed here.</p>
                    <p className="text-sm mt-2">Note: Backend endpoint needed to fetch user reservations by admin.</p>
                  </div>
                </div>
              )}

              {/* Restaurant History for Owners */}
              {selectedUser.role === 'OWNER' && (
                <div>
                  <h4 className="font-semibold text-lg mb-4">Owned Restaurants</h4>
                  <div className="space-y-2">
                    {Array.isArray(restaurants) && restaurants.filter(r => r.owner?.id === selectedUser.id).map(restaurant => (
                      <div key={restaurant.id} className="border p-3 rounded">
                        <p className="font-medium">{restaurant.name}</p>
                        <p className="text-sm text-gray-600">{restaurant.location} • {restaurant.cuisine}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">Edit User</h3>
            <form onSubmit={updateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={editUser.username}
                onChange={(e) => setEditUser({...editUser, username: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={editUser.email}
                onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={editUser.password}
                onChange={(e) => setEditUser({...editUser, password: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              />
              <select
                value={editUser.role}
                onChange={(e) => setEditUser({...editUser, role: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="OWNER">Owner</option>
                <option value="ADMIN">Admin</option>
              </select>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg">
                  Update User
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditUser(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Restaurant Modal */}
      {showEditRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl font-bold text-primary mb-6">Edit Restaurant</h3>
            <form onSubmit={updateRestaurant} className="space-y-4">
              <input
                type="text"
                placeholder="Restaurant Name"
                value={editRestaurant.name}
                onChange={(e) => setEditRestaurant({...editRestaurant, name: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={editRestaurant.location}
                onChange={(e) => setEditRestaurant({...editRestaurant, location: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                placeholder="Cuisine Type"
                value={editRestaurant.cuisine}
                onChange={(e) => setEditRestaurant({...editRestaurant, cuisine: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={editRestaurant.capacity}
                onChange={(e) => setEditRestaurant({...editRestaurant, capacity: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              />
              <select
                value={editRestaurant.ownerId}
                onChange={(e) => setEditRestaurant({...editRestaurant, ownerId: e.target.value})}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Owner</option>
                {Array.isArray(users) && users.filter(u => u.role === 'OWNER').map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.username}</option>
                ))}
              </select>
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg">
                  Update Restaurant
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditRestaurant(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-primary mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-primary mb-2">Customers</h3>
          <p className="text-3xl font-bold text-gray-800">{users.filter(u => u.role === 'CUSTOMER').length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-primary mb-2">Owners</h3>
          <p className="text-3xl font-bold text-gray-800">{users.filter(u => u.role === 'OWNER').length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-lg text-primary mb-2">Restaurants</h3>
          <p className="text-3xl font-bold text-gray-800">{Array.isArray(restaurants) ? restaurants.length : 0}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
import React, { useState, useEffect } from 'react';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    id:'',
    name: '',
    username: '',
    email: '',
    address: { city: '' },
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        if (!response.ok) {
          console.log("response",response)
          throw new Error(`${"Failed to load data. Please try again later."}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError(err.message || 'Unknown error occurred');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e) => {
    console.log("e",e)
    const { name, value } = e.target;
    if (name === 'city') {
      setNewUser((prev) => ({ ...prev, address: { ...prev.address, city: value } }));
    } else {
      setNewUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddUser = () => {
    setUsers((prev) => [...prev, { ...newUser, id: prev.length + 1 }]);
    setNewUser({id:"", name: '', username: '', email: '', address: { city: '' } });
  };

  const handleAction = (user, type) => {
    setSelectedUser(user);
    setActionType(type);
  };

  const handleSaveEdit = () => {
    setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
    setSelectedUser(null);
    setActionType('');
  };

  const handleDelete = () => {
    setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
    setSelectedUser(null);
    setActionType('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city') {
      setSelectedUser((prev) => ({ ...prev, address: { ...prev.address, city: value } }));
    } else {
      setSelectedUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;

  }

  return (
    <div className="p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-lg font-bold mb-2">User Management Dashboard</h2>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <input
            type="number"
            name="id"
            value={newUser.id}
            onChange={handleInputChange}
            placeholder="id"
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="border p-2 w-full"
            required
          />
          <input
            type="text"
            name="username"
            value={newUser.username}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="border p-2 w-full"
            required

          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 w-full"
            required

          />
          <input
            type="text"
            name="city"
            value={newUser.address.city}
            onChange={handleInputChange}
            placeholder="Department"
            className="border p-2 w-full"
            required

          />
        </div>
        <button
          onClick={handleAddUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Id</th>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Department</th>

            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              { console.log("user",user)}
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.username}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.address.city}</td>
              <td className="border border-gray-300 px-4 py-2">
           
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleAction(user, 'view')}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleAction(user, 'edit')}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleAction(user, 'delete')}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {actionType && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 capitalize">{actionType} User</h2>
            {actionType === 'view' && (
              <div>
                <p><strong>Id:</strong> {selectedUser.id}</p>
                <p><strong>First Name:</strong> {selectedUser.name}</p>
                <p><strong>Last Name:</strong> {selectedUser.username}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Department</strong> {selectedUser.address.city}</p>
              </div>
            )}

            {actionType === 'edit' && (
              <div className="grid gap-4">
                <input
                  type="text"
                  name="name"
                  value={selectedUser.name}
                  onChange={handleEditChange}
                  placeholder="Name"
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  name="username"
                  value={selectedUser.username}
                  onChange={handleEditChange}
                  placeholder="Username"
                  className="border p-2 w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={selectedUser.email}
                  onChange={handleEditChange}
                  placeholder="Email"
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  name="city"
                  value={selectedUser.address.city}
                  onChange={handleEditChange}
                  placeholder="City"
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  name="phone"
                  value={selectedUser.phone}
                  onChange={handleEditChange}
                  placeholder="Phone"
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  name="website"
                  value={selectedUser.website}
                  onChange={handleEditChange}
                  placeholder="Website"
                  className="border p-2 w-full"
                />
              </div>
            )}

            {actionType === 'delete' && (
              <p>Are you sure you want to delete this user?</p>
            )}

            <div className="mt-4 flex justify-end gap-2">
              {actionType === 'edit' && (
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )}
              {actionType === 'delete' && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setActionType('');
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
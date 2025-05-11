'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(token)
      const response = await fetch('http://localhost:4000/api/admin/users', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',  
      });

      if (!response.ok) {
        throw new Error('Error deleting user');
      }

      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingId(user._id);
    setEditForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error('Failed to update user');
      setUsers(prev => prev.map(u => u._id === id ? { ...u, ...editForm } : u));
      setEditingId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {error && <p className="text-red-500">{error}</p>}  {/* Display any error */}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user._id} className="border rounded-lg p-4 bg-white shadow flex flex-col gap-2">
              {editingId === user._id ? (
                <>
                  <input
                    className="border p-2 rounded mb-2 w-full"
                    name="firstname"
                    value={editForm.firstname}
                    onChange={handleEditChange}
                    placeholder="First Name"
                  />
                  <input
                    className="border p-2 rounded mb-2 w-full"
                    name="lastname"
                    value={editForm.lastname}
                    onChange={handleEditChange}
                    placeholder="Last Name"
                  />
                  <input
                    className="border p-2 rounded mb-2 w-full"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="Email"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleEditSave(user._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={handleEditCancel} className="bg-gray-300 text-gray-800 px-3 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-lg">{user.firstname} {user.lastname}</div>
                  <div className="text-gray-600">{user.email}</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No users available</p>
          </div>
        )}
      </div>
    </div>
  );
}

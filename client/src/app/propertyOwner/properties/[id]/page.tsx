'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';

export default function OwnerPropertiesPage() {
  const router = useRouter();
  const params = useParams();
  const ownerId = params.id as string; // get the [id] param from the URL

  const [properties, setProperties] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    if (!ownerId) return;
    const fetchProperties = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/propertyOwner/properties/${ownerId}`);
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        setProperties(data);
      } catch (error: any) {
        setError(error.message);
      }
    };
    fetchProperties();
  }, [ownerId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/propertyOwner/properties/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete property');
      setProperties(prev => prev.filter(property => property._id !== id));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClick = (property: any) => {
    setEditingId(property._id);
    setEditForm({
      name: property.name,
      description: property.description,
      pricePerNight: property.pricePerNight,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/propertyOwner/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update property');
      setProperties(prev => prev.map(p => p._id === id ? { ...p, ...editForm } : p));
      setEditingId(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (!ownerId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Properties</h1>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {properties.length > 0 ? (
          properties.map(property => (
            <div key={property._id} className="border rounded-lg p-4 bg-white shadow flex flex-col gap-2">
              {editingId === property._id ? (
                <>
                  <input
                    className="border p-2 rounded mb-2 w-full"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Name"
                  />
                  <textarea
                    className="border p-2 rounded mb-2 w-full"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                  />
                  <input
                    className="border p-2 rounded mb-2 w-full"
                    name="pricePerNight"
                    type="number"
                    value={editForm.pricePerNight}
                    onChange={handleEditChange}
                    placeholder="Price per Night"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleEditSave(property._id)} className="bg-blue-500 text-white px-3 py-1 rounded">Save</button>
                    <button onClick={handleEditCancel} className="bg-gray-300 text-gray-800 px-3 py-1 rounded">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-semibold text-lg">{property.name}</div>
                  <div className="text-gray-600">{property.description}</div>
                  <div className="text-gray-700">${property.pricePerNight} per night</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleEditClick(property)} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(property._id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No properties available</p>
          </div>
        )}
      </div>
    </div>
  );
}
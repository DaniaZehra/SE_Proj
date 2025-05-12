'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: {
      city: '',
      country: ''
    },
    propertyType: '',
    pricePerNight: '',
    amenities: [],
    images: [],
    filters: {
      space: '',
      specialNeeds: []
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.name || !formData.description || !formData.location.city || 
          !formData.location.country || !formData.propertyType || !formData.pricePerNight) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Convert pricePerNight to number
      const dataToSend = {
        ...formData,
        pricePerNight: Number(formData.pricePerNight)
      };

      const response = await fetch('http://localhost:4000/api/propertyOwner/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials : 'include',
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create property');
      }

      toast.success('Property created successfully');
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        location: {
          city: '',
          country: ''
        },
        propertyType: '',
        pricePerNight: '',
        amenities: [],
        images: [],
        filters: {
          space: '',
          specialNeeds: []
        }
      });
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Property</h1>
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter property name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Enter property description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Input
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <Select
                value={formData.propertyType}
                onValueChange={(value) => handleSelectChange('propertyType', value)}
                required
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Hotel" className="hover:bg-blue-100 focus:bg-blue-100">Hotel</SelectItem>
                  <SelectItem value="Rest House" className="hover:bg-blue-100 focus:bg-blue-100">Rest House</SelectItem>
                  <SelectItem value="Apartment" className="hover:bg-blue-100 focus:bg-blue-100">Apartment</SelectItem>
                  <SelectItem value="Hostel" className="hover:bg-blue-100 focus:bg-blue-100">Hostel</SelectItem>
                  <SelectItem value="Room" className="hover:bg-blue-100 focus:bg-blue-100">Room</SelectItem>
                  <SelectItem value="Home" className="hover:bg-blue-100 focus:bg-blue-100">Home</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price per Night</label>
              <Input
                name="pricePerNight"
                type="number"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                required
                placeholder="Enter price per night"
                min="0"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 
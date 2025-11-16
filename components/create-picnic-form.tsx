'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CreatePicnicFormProps {
  onSuccess: () => void;
}

export function CreatePicnicForm({ onSuccess }: CreatePicnicFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    startDate: '',
    endDate: '',
    maxPeople: '',
    registrationDeadline: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/picnics/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          maxPeople: parseInt(formData.maxPeople),
        }),
      });

      if (response.ok) {
        setSuccess('Picnic created successfully!');
        setFormData({
          title: '',
          description: '',
          price: '',
          startDate: '',
          endDate: '',
          maxPeople: '',
          registrationDeadline: '',
          upiId: '',
        });
        setTimeout(() => {
          setSuccess('');
          onSuccess();
        }, 1500);
      } else {
        setError('Failed to create picnic');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Picnic Event</CardTitle>
        <CardDescription>Fill in all details to create a new picnic event</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Beach Picnic Day"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your picnic event..."
              className="w-full px-3 py-2 border border-input rounded-md text-sm"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price per Person (₹)</label>
              <Input
                name="price"
                type="number"
                step="1"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Participants</label>
              <Input
                name="maxPeople"
                type="number"
                min="1"
                value={formData.maxPeople}
                onChange={handleChange}
                placeholder="50"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Picnic Start Date & Time</label>
              <Input
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Picnic End Date & Time</label>
              <Input
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Registration Deadline</label>
            <Input
              name="registrationDeadline"
              type="datetime-local"
              value={formData.registrationDeadline}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your UPI ID (for payment QR)</label>
            <Input
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="name@upi"
              required
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating Picnic...' : 'Create Picnic Event'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Picnic } from '@/app/lib/types';
import { QRCodeGenerator } from './qr-code-generator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserRegistrationFormProps {
  picnic: Picnic;
  onSuccess: () => void;
}

export function UserRegistrationForm({ picnic, onSuccess }: UserRegistrationFormProps) {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/registrations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          picnicId: picnic.id,
          ...formData,
        }),
      });

      if (response.ok) {
        setStep('success');
        setTimeout(() => onSuccess(), 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to register');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">Registration Submitted!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-green-600">Your registration has been submitted successfully.</p>
          <Alert className="bg-green-100 border-green-200">
            <AlertDescription>
              Your application is pending admin approval. You will receive an email once it's reviewed. If approved, you'll get payment details. If rejected, we'll explain why.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>Scan the QR code to make payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <QRCodeGenerator upiId={picnic.upiId} amount={picnic.price} />
          <div className="space-y-2 text-center">
            <p className="font-medium">Amount to pay: ₹{picnic.price}</p>
            <p className="text-sm text-muted-foreground">Please share your UPI transaction ID in the form below</p>
          </div>
          <Button onClick={() => setStep('form')} variant="outline" className="w-full">
            Back to Form
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register for {picnic.title}</CardTitle>
        <CardDescription>Fill in your details to register for this picnic</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">UPI ID (Payment Sent From)</label>
            <Input
              name="upiId"
              value={formData.upiId}
              onChange={handleChange}
              placeholder="name@upi"
              required
            />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setStep('payment')}>
              View QR Code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

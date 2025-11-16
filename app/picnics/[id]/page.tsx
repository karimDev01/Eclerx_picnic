'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Picnic } from '@/app/lib/types';
import { UserRegistrationForm } from '@/components/user-registration-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Calendar, MapPin, Users, Clock, AlertCircle } from 'lucide-react';

export default function PicnicDetail() {
  const params = useParams();
  const [picnic, setPicnic] = useState<(Picnic & { participantCount?: number }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    fetchPicnic();
  }, [params.id]);

  const fetchPicnic = async () => {
    try {
      const response = await fetch('/api/picnics/list');
      const picnics = await response.json();
      const found = picnics.find((p: Picnic) => p.id === params.id);
      setPicnic(found || null);
    } catch (error) {
      console.error('Error fetching picnic:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading picnic details...</p>
      </div>
    );
  }

  if (!picnic) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link href="/">
              <Button variant="outline">← Back to Picnics</Button>
            </Link>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Picnic not found</p>
        </div>
      </div>
    );
  }

  const isExpired = new Date(picnic.registrationDeadline) < new Date();
  const spotsLeft = picnic.maxPeople - (picnic.participantCount || 0);
  const isFullyBooked = spotsLeft <= 0;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="outline">← Back to All Picnics</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Picnic Details */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-2">{picnic.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{picnic.description}</p>

            {/* Status Alerts */}
            {isExpired && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Registration deadline has passed for this event.</AlertDescription>
              </Alert>
            )}

            {isFullyBooked && !isExpired && (
              <Alert className="mb-6 bg-orange-50 border-orange-200">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">This picnic is fully booked. Check back for other events!</AlertDescription>
              </Alert>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-semibold">{new Date(picnic.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{new Date(picnic.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-semibold">{new Date(picnic.endDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{new Date(picnic.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Users className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Participants</p>
                      <p className="font-semibold">{picnic.participantCount || 0}/{picnic.maxPeople}</p>
                      <p className="text-sm text-muted-foreground">{spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} left` : 'Fully booked'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price per Person</p>
                      <p className="font-bold text-2xl">₹{picnic.price}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Registration Deadline */}
            <Card className="bg-blue-50 border-blue-200 mb-8">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Registration closes on</p>
                <p className="font-semibold text-lg">{new Date(picnic.registrationDeadline).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-muted-foreground">{new Date(picnic.registrationDeadline).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            {registered ? (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900">Registration Submitted!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-green-700">Your registration for <strong>{picnic.title}</strong> has been submitted successfully.</p>
                  <Alert className="bg-white border-green-200">
                    <AlertDescription className="text-sm">
                      Your application is now pending admin approval. Check your email for updates.
                    </AlertDescription>
                  </Alert>
                  <Link href="/">
                    <Button className="w-full" variant="outline">Browse Other Picnics</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <UserRegistrationForm picnic={picnic} onSuccess={() => { setRegistered(true); fetchPicnic(); }} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

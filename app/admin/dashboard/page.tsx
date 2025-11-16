'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Picnic, Registration } from '@/app/lib/types';
import { CreatePicnicForm } from '@/components/create-picnic-form';
import { PicnicCard } from '@/components/picnic-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Users, Calendar, DollarSign, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [picnics, setPicnics] = useState<(Picnic & { participantCount?: number })[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const picnicResponse = await fetch('/api/picnics/list');
      const picnicData = await picnicResponse.json();
      setPicnics(picnicData);

      // Fetch all registrations for stats
      let allRegs: Registration[] = [];
      for (const picnic of picnicData) {
        const regResponse = await fetch(`/api/picnics/${picnic.id}/registrations`);
        const regs = await regResponse.json();
        allRegs = [...allRegs, ...regs];
      }
      setAllRegistrations(allRegs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/admin');
  };

  const totalPicnics = picnics.length;
  const totalRegistrations = allRegistrations.length;
  const approvedRegistrations = allRegistrations.filter(r => r.status === 'approved').length;
  const pendingRegistrations = allRegistrations.filter(r => r.status === 'pending').length;
  const totalRevenue = picnics.reduce((sum, p) => sum + (p.price * (p.participantCount || 0)), 0);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your picnic events</p>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Picnics</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPicnics}</div>
              <p className="text-xs text-muted-foreground">Events created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">{pendingRegistrations} pending approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedRegistrations}</div>
              <p className="text-xs text-muted-foreground">Confirmed participants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estimated Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
              <p className="text-xs text-muted-foreground">From approved registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Picnic Form */}
        <div className="mb-12">
          <CreatePicnicForm onSuccess={fetchData} />
        </div>

        {/* Picnics List */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Your Picnics</h2>
            <p className="text-muted-foreground">Click on a picnic to manage registrations</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading picnics...</p>
            </div>
          ) : picnics.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No picnics created yet. Create one above to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {picnics.map(picnic => (
                <Link key={picnic.id} href={`/admin/picnics/${picnic.id}`}>
                  <div className="cursor-pointer hover:opacity-80 transition-opacity">
                    <PicnicCard
                      picnic={picnic}
                      isAdmin={true}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

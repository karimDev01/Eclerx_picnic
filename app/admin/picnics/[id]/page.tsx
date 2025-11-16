'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Picnic, Registration } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeGenerator } from '@/components/qr-code-generator';
import { RegistrationActions } from '@/components/registration-actions';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function PicnicDetailAdmin() {
  const params = useParams();
  const [picnic, setPicnic] = useState<Picnic | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const picnicResponse = await fetch('/api/picnics/list');
      const picnics = await picnicResponse.json();
      const found = picnics.find((p: Picnic) => p.id === params.id);
      setPicnic(found || null);

      if (found) {
        const regResponse = await fetch(`/api/picnics/${params.id}/registrations`);
        const regs = await regResponse.json();
        setRegistrations(regs);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!picnic) return <div className="text-center py-12">Picnic not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{picnic.title}</CardTitle>
                <CardDescription>{picnic.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Start Date</p>
                    <p>{new Date(picnic.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">End Date</p>
                    <p>{new Date(picnic.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Price</p>
                    <p className="font-semibold">₹{picnic.price}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Registration Deadline</p>
                    <p>{new Date(picnic.registrationDeadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Max People</p>
                    <p className="font-semibold">{picnic.maxPeople}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Approved Registrations</p>
                    <p className="font-semibold">{approvedCount}/{picnic.maxPeople}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <QRCodeGenerator upiId={picnic.upiId} amount={picnic.price} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Registrations Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  {registrations.filter(r => r.status === 'pending').length === 0 ? (
                    <p className="text-muted-foreground">No pending registrations</p>
                  ) : (
                    <div className="space-y-4">
                      {registrations
                        .filter(r => r.status === 'pending')
                        .map(reg => (
                          <div key={reg.id} className="border rounded-lg p-4 flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold">{reg.name}</p>
                              <p className="text-sm text-muted-foreground">{reg.email}</p>
                              <p className="text-sm text-muted-foreground">{reg.phone}</p>
                              <p className="text-xs text-muted-foreground mt-1">UPI: {reg.upiId}</p>
                              <p className="text-xs text-muted-foreground">Applied: {new Date(reg.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="ml-4">
                              <RegistrationActions registration={reg} onStatusChange={fetchData} />
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved">
              <Card>
                <CardHeader>
                  <CardTitle>Approved Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {registrations.filter(r => r.status === 'approved').length === 0 ? (
                    <p className="text-muted-foreground">No approved registrations</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Name</th>
                            <th className="text-left py-2 px-2">Email</th>
                            <th className="text-left py-2 px-2">Phone</th>
                            <th className="text-left py-2 px-2">UPI ID</th>
                            <th className="text-left py-2 px-2">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations
                            .filter(r => r.status === 'approved')
                            .map(reg => (
                              <tr key={reg.id} className="border-b hover:bg-muted/50">
                                <td className="py-2 px-2">{reg.name}</td>
                                <td className="py-2 px-2">{reg.email}</td>
                                <td className="py-2 px-2">{reg.phone}</td>
                                <td className="py-2 px-2 font-mono text-xs">{reg.upiId}</td>
                                <td className="py-2 px-2">{new Date(reg.createdAt).toLocaleDateString()}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected">
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  {registrations.filter(r => r.status === 'rejected').length === 0 ? (
                    <p className="text-muted-foreground">No rejected registrations</p>
                  ) : (
                    <div className="space-y-4">
                      {registrations
                        .filter(r => r.status === 'rejected')
                        .map(reg => (
                          <div key={reg.id} className="border rounded-lg p-4 bg-red-50">
                            <p className="font-semibold">{reg.name}</p>
                            <p className="text-sm text-muted-foreground">{reg.email}</p>
                            {reg.rejectionReason && (
                              <p className="text-sm text-red-700 mt-2"><strong>Reason:</strong> {reg.rejectionReason}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

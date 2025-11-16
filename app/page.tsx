'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PicnicCard } from '@/components/picnic-card';
import { Picnic } from '@/app/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Users, MapPin } from 'lucide-react';

export default function Home() {
  const [picnics, setPicnics] = useState<(Picnic & { participantCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPicnics();
  }, []);

  const fetchPicnics = async () => {
    try {
      const response = await fetch('/api/picnics/list');
      const data = await response.json();
      setPicnics(data);
    } catch (error) {
      console.error('Error fetching picnics:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPicnics = picnics.filter(picnic =>
    picnic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    picnic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Picnic Hub</h1>
            <p className="text-xs text-muted-foreground">Discover & book amazing picnic events</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">Admin Panel</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-balance">Explore Amazing Picnic Events</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover and register for exciting picnic adventures. Make memories with friends and family.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <Input
              placeholder="Search picnics by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{picnics.length}</p>
                <p className="text-sm text-muted-foreground">Events Available</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{picnics.reduce((sum, p) => sum + (p.participantCount || 0), 0)}</p>
                <p className="text-sm text-muted-foreground">People Registered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{Math.max(...picnics.map(p => p.maxPeople), 0)}</p>
                <p className="text-sm text-muted-foreground">Max Group Size</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Picnics Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading available picnics...</p>
          </div>
        ) : filteredPicnics.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <p className="text-muted-foreground mb-4">No picnics found matching "{searchTerm}"</p>
                <Button onClick={() => setSearchTerm('')} variant="outline">Clear Search</Button>
              </>
            ) : (
              <p className="text-muted-foreground">No picnics available at the moment. Check back soon!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPicnics.map(picnic => (
              <Link key={picnic.id} href={`/picnics/${picnic.id}`}>
                <PicnicCard picnic={picnic} />
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-background/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>Picnic Hub - Book your next adventure today!</p>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PicnicCard } from '@/components/picnic-card';
import { Picnic } from '@/app/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar, Users, MapPin } from 'lucide-react';
import { toast } from "sonner";
export default function Home() {
  const fallbackNames = [
    "Rahul Sharma",
    "Priya Patel",
    "Amit Verma",
    "Sneha Iyer",
    "Arjun Singh"
  ];

  const [picnics, setPicnics] = useState<(Picnic & { participantCount?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const total = picnics.reduce((sum, p) => sum + (p.participantCount || 0), 0);
  useEffect(() => {
    fetchPicnics();
  }, []);

  const fetchPicnics = async () => {
    try {
      const response = await fetch('/api/picnics/list');
      const data: PicnicWithNames[] = await response.json();
      setPicnics(data);

      // Extract last 5 names from all picnics
      const recentNames = data
        .flatMap((p) => p.registrations?.map(r => r.name) ?? [])
        .slice(-5);

      const namesToShow = recentNames.length > 0 ? recentNames : fallbackNames;

      // Delay 2 seconds before starting interval
      setTimeout(() => {
        let index = 0;

        const interval = setInterval(() => {
          toast.success(`🌈 Recently Registered: ${namesToShow[index]}`, {
            style: {
              background: "linear-gradient(to right, #ff00cc, #3333ff, #00e1ff)",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
            }
          });

          index++;

          if (index >= namesToShow.length) {
            clearInterval(interval);
          }
        }, 5000);

      }, 3000); // wait 2 seconds before starting

    } catch (error) {
      console.error("Error fetching picnics:", error);
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
            <p className="text-xs text-muted-foreground hidden md:block">Discover & book amazing picnic events</p>
          </div>
          <div className='flex gap-3 items-center'>

            <Link href="/developer">
              <div className="relative group inline-block">
                {/* Aura Glow */}
                <div className="
      absolute inset-0 
      rounded-xl 
      blur-xl 
      opacity-50 
      bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400
      group-hover:blur-2xl group-hover:opacity-80
      transition-all duration-500
    " />

                {/* Actual Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="
        relative z-10 
        backdrop-blur-sm 
        border-white/40 
        
        transition-all 
        duration-300 
        hover:border-white hover:shadow-lg
      "
                >
                  Aura
                </Button>
              </div>
            </Link>

            <Link href="/admin">
              <Button variant="outline" size="sm">Admin Panel</Button>
            </Link>
          </div>
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
                <p className="font-semibold">{total < 10 ? 15 : total}</p>
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
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Video 1 */}
          <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg bg-neutral-800">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/wDIF7B8KTWg?si=jh-cM3MYUVCGtS8X"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video 2 */}
          <div className="relative w-full pb-[56.25%] rounded-xl overflow-hidden shadow-lg bg-neutral-800">
            <iframe className="absolute top-0 left-0 w-full h-full" width="560" height="315" src="https://www.youtube.com/embed/jwRXSDWBiOM?si=TBARZ9gd_ZkyPnSk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
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

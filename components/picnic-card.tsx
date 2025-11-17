import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Picnic } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface PicnicCardProps {
  picnic: Picnic & { participantCount?: number };
  isAdmin?: boolean;
}

export function PicnicCard({ picnic, isAdmin = false }: PicnicCardProps) {
  const isExpired = new Date(picnic.registrationDeadline) < new Date();
  const participantCount = picnic.participantCount || 0;
  const spotsLeft = picnic.maxPeople - participantCount;

  // Random image between park1.jpg to park10.jpg
  const randomImage = `/park${Math.floor(Math.random() * 10) + 1}.jpg`;

  return (
    <Card>
      {/* Image Section */}
     <div className="w-full h-42 relative overflow-hidden group">
  <Image
    src={randomImage}
    alt="Picnic Place"
    fill
    className="object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-95 active:scale-95"
  />
</div>


      <CardHeader>
        <CardTitle>{picnic.title}</CardTitle>
        <CardDescription>
          {new Date(picnic.startDate).toLocaleDateString()} to{' '}
          {new Date(picnic.endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{picnic.description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-semibold">₹{picnic.price}</p>
          </div>
          <div>
            <p className="text-muted-foreground">People Joined</p>
            <p className="font-semibold">{participantCount}/{picnic.maxPeople}</p>
          </div>
        </div>

        <div className="pt-2">
          {isAdmin ? (
            <Link href={`/admin/picnics/${picnic.id}`}>
              <Button variant="outline" className="w-full">View & Manage</Button>
            </Link>
          ) : (
            <Link href={`/picnics/${picnic.id}`}>
              <Button disabled={isExpired || spotsLeft <= 0} className="w-full">
                {isExpired ? 'Registration Closed' : spotsLeft <= 0 ? 'Fully Booked' : 'Register Now'}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

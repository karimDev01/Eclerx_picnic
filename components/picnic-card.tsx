import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Picnic } from '@/app/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PicnicCardProps {
  picnic: Picnic & { participantCount?: number };
  isAdmin?: boolean;
}

export function PicnicCard({ picnic, isAdmin = false }: PicnicCardProps) {
  const isExpired = new Date(picnic.registrationDeadline) < new Date();
  const participantCount = picnic.participantCount || 0;
  const spotsLeft = picnic.maxPeople - participantCount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{picnic.title}</CardTitle>
        <CardDescription>
          {new Date(picnic.startDate).toLocaleDateString()} to {new Date(picnic.endDate).toLocaleDateString()}
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

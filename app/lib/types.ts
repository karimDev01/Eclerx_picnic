export interface Picnic {
  id: string;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
  maxPeople: number;
  registrationDeadline: string;
  upiId: string;
  adminId: string;
  createdAt: string;
}

export interface Registration {
  id: string;
  picnicId: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

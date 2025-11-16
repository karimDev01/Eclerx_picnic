export interface Picnic {
  id: string;
  title: string;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  maxPeople: number;
  registrationDeadline: Date;
  upiId: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Registration {
  id: string;
  picnicId: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

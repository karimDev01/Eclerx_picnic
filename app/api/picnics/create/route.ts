import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, description, price, startDate, endDate, maxPeople, registrationDeadline, upiId } = await request.json();
    const adminId = process.env.ADMIN_ID || 'admin';

    const picnic = await prisma.picnic.create({
      data: {
        title,
        description,
        price: parseInt(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        maxPeople: parseInt(maxPeople),
        registrationDeadline: new Date(registrationDeadline),
        upiId,
        adminId,
      },
    });

    return NextResponse.json({ success: true, id: picnic.id });
  } catch (error) {
    console.error('Error creating picnic:', error);
    return NextResponse.json({ error: 'Failed to create picnic' }, { status: 500 });
  }
}

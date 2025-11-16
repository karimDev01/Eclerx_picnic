import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendAdminNotificationEmail, sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { picnicId, name, email, phone, upiId } = await request.json();

    const picnic = await prisma.picnic.findUnique({
      where: { id: picnicId },
    });

    if (!picnic) {
      return NextResponse.json({ error: 'Picnic not found' }, { status: 404 });
    }

    // Check if registration deadline passed
    if (new Date(picnic.registrationDeadline) < new Date()) {
      return NextResponse.json({ error: 'Registration deadline has passed' }, { status: 400 });
    }

    // Check if max approved people reached
    const approvedCount = await prisma.registration.count({
      where: { picnicId, status: 'approved' },
    });

    if (approvedCount >= picnic.maxPeople) {
      return NextResponse.json({ error: 'Picnic is fully booked' }, { status: 400 });
    }

    // Create registration with pending status
    const registration = await prisma.registration.create({
      data: {
        picnicId,
        name,
        email,
        phone,
        upiId,
        status: 'pending',
      },
    });

    // Send confirmation email to user
    await sendConfirmationEmail(email, name, picnic.title);

    // Send admin notification
    await sendAdminNotificationEmail(picnic.title, name, email, phone);

    return NextResponse.json({ 
      success: true, 
      id: registration.id,
      message: 'Registration submitted. Check your email for confirmation.' 
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}

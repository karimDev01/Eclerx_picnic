import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendApprovalEmail, sendConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { picnic: true },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.status !== 'pending') {
      return NextResponse.json({ error: 'Only pending registrations can be approved' }, { status: 400 });
    }

    // Update registration status to approved
    const updated = await prisma.registration.update({
      where: { id },
      data: { status: 'approved' },
    });

    // Send approval email to user
    await sendApprovalEmail(
      registration.email, 
      registration.picnic.title, 
      registration.name,
      new Date(registration.picnic.startDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Registration approved and user notified' 
    });
  } catch (error) {
    console.error('Error approving registration:', error);
    return NextResponse.json({ error: 'Failed to approve registration' }, { status: 500 });
  }
}

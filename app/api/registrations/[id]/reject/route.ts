import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendRejectionEmail } from '@/lib/email';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { reason } = await request.json();

    if (!reason || reason.trim().length === 0) {
      return NextResponse.json({ error: 'Rejection reason is required' }, { status: 400 });
    }

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { picnic: true },
    });

    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    if (registration.status !== 'pending') {
      return NextResponse.json({ error: 'Only pending registrations can be rejected' }, { status: 400 });
    }

    // Update registration status to rejected with reason
    const updated = await prisma.registration.update({
      where: { id },
      data: { 
        status: 'rejected',
        rejectionReason: reason.trim(),
      },
    });

    // Send rejection email to user
    await sendRejectionEmail(
      registration.email, 
      registration.picnic.title, 
      registration.name, 
      reason.trim()
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Registration rejected and user notified' 
    });
  } catch (error) {
    console.error('Error rejecting registration:', error);
    return NextResponse.json({ error: 'Failed to reject registration' }, { status: 500 });
  }
}

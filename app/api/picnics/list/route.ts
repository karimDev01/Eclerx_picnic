import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const picnics = await prisma.picnic.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        _count: {
          select: {
            registrations: {
              where: { status: 'approved' },
            },
          },
        },
      },
    });

    // Format response to include participant count
    const formattedPicnics = picnics.map(p => ({
      ...p,
      participantCount: p._count.registrations,
      _count: undefined,
    }));

    return NextResponse.json(formattedPicnics);
  } catch (error) {
    console.error('Error fetching picnics:', error);
    return NextResponse.json({ error: 'Failed to fetch picnics' }, { status: 500 });
  }
}

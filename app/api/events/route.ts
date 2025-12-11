
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  const events = await prisma.event.findMany({
    where: { userId: user.id },
  });

  return new NextResponse(JSON.stringify(events), { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
  });

  if (!user) {
    return new NextResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
  }

  try {
    const { title, date, startTime, endTime } = await req.json();

    if (!title || !date || !startTime || !endTime) {
      return new NextResponse(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        date,
        startTime,
        endTime,
        userId: user.id,
      },
    });

    return new NextResponse(JSON.stringify(newEvent), { status: 201 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}

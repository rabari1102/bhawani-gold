import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({ 
      orderBy: { displayOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.testimonial.count()
  ]);
  
  return NextResponse.json({ 
    testimonials, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  });
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const testimonial = await prisma.testimonial.create({ data: { customerName: data.customerName, location: data.location, reviewText: data.reviewText, displayOrder: data.displayOrder || 0, isVisible: data.isVisible !== false } });
  return NextResponse.json({ testimonial }, { status: 201 });
}

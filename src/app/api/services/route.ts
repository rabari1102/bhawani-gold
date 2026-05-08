import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [services, total] = await Promise.all([
    prisma.service.findMany({ 
      orderBy: { displayOrder: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.service.count()
  ]);
  
  return NextResponse.json({ 
    services, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  });
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const service = await prisma.service.create({ data });
  return NextResponse.json({ service }, { status: 201 });
}

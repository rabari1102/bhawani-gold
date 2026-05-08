import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const [rates, total] = await Promise.all([
    prisma.metalRate.findMany({ 
      orderBy: { type: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.metalRate.count()
  ]);
  
  return NextResponse.json({ 
    rates, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  });
}

export async function PUT(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const results = [];
  for (const rate of data.rates) {
    const updated = await prisma.metalRate.update({
      where: { id: rate.id },
      data: { ratePerGram: parseFloat(rate.ratePerGram), lastUpdated: new Date() },
    });
    results.push(updated);
  }
  return NextResponse.json({ rates: results });
}

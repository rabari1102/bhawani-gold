import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      parent: true,
      children: true,
      _count: { select: { products: true } }
    }
  });
  
  const total = await prisma.category.count();
  
  return NextResponse.json({ 
    categories, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  });
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  try {
    const category = await prisma.category.create({
      data: { 
        name: data.name, 
        slug: data.slug, 
        description: data.description || '', 
        image: data.image || null, 
        displayOrder: data.displayOrder || 0,
        parentId: data.parentId || null
      },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to create';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

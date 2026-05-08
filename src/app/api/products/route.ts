import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const trending = searchParams.get('trending');
  const newArrival = searchParams.get('newArrival');
  const special = searchParams.get('special');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const idsParam = searchParams.get('ids');

  const where: Record<string, unknown> = { isVisible: true };
  if (category) where.categoryId = category;
  if (trending === 'true') where.isTopTrending = true;
  if (newArrival === 'true') where.isNewArrival = true;
  if (special === 'true') where.isSpecialSelection = true;
  if (search) where.OR = [
    { name: { contains: search } },
    { sku: { contains: search } },
  ];
  if (idsParam) {
    const ids = idsParam.split(',').filter(Boolean);
    if (ids.length > 0) {
      where.id = { in: ids };
    }
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where, include: { category: true },
      skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = await request.json();

    // BUG-08 fix: Validate numeric fields
    const weight = data.weight ? parseFloat(data.weight) : null;
    const price = data.price ? parseFloat(data.price) : null;
    if (weight !== null && weight < 0) {
      return NextResponse.json({ error: 'Weight cannot be negative' }, { status: 400 });
    }
    if (price !== null && price < 0) {
      return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
    }

    if (!data.sku || !data.name || !data.categoryId) {
      return NextResponse.json({ error: 'SKU, Name, and Category are required' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        sku: data.sku, name: data.name, slug: data.slug,
        categoryId: data.categoryId, description: data.description || '',
        weight,
        metalType: data.metalType || 'GOLD_22K',
        purity: data.purity || '22K 916',
        availabilityStatus: data.availabilityStatus || 'In Stock',
        isHallmarked: data.isHallmarked !== undefined ? data.isHallmarked : true,
        price,
        isTopTrending: data.isTopTrending || false,
        isNewArrival: data.isNewArrival || false,
        isSpecialSelection: data.isSpecialSelection || false,
        isVisible: data.isVisible !== false,
        images: JSON.stringify(data.images || []),
        primaryImage: data.primaryImage || null,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (e: any) {
    // BUG-09 fix: Catch unique constraint violation for duplicate SKU/slug
    if (e?.code === 'P2002') {
      const field = e.meta?.target?.[0] || 'field';
      return NextResponse.json({ error: `A product with this ${field} already exists. Please use a unique value.` }, { status: 409 });
    }
    const message = e instanceof Error ? e.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await request.json();
  try {
    // BUG-08 fix: Validate numeric fields on update
    if (data.weight !== undefined) {
      const w = data.weight ? parseFloat(data.weight) : null;
      if (w !== null && w < 0) return NextResponse.json({ error: 'Weight cannot be negative' }, { status: 400 });
    }
    if (data.price !== undefined) {
      const p = data.price ? parseFloat(data.price) : null;
      if (p !== null && p < 0) return NextResponse.json({ error: 'Price cannot be negative' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.sku && { sku: data.sku }),
        ...(data.slug && { slug: data.slug }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.weight !== undefined && { weight: data.weight ? parseFloat(data.weight) : null }),
        ...(data.metalType && { metalType: data.metalType }),
        ...(data.purity && { purity: data.purity }),
        ...(data.availabilityStatus && { availabilityStatus: data.availabilityStatus }),
        ...(data.isHallmarked !== undefined && { isHallmarked: data.isHallmarked }),
        ...(data.price !== undefined && { price: data.price ? parseFloat(data.price) : null }),
        ...(data.isTopTrending !== undefined && { isTopTrending: data.isTopTrending }),
        ...(data.isNewArrival !== undefined && { isNewArrival: data.isNewArrival }),
        ...(data.isSpecialSelection !== undefined && { isSpecialSelection: data.isSpecialSelection }),
        ...(data.isVisible !== undefined && { isVisible: data.isVisible }),
        ...(data.images && { images: JSON.stringify(data.images) }),
        ...(data.primaryImage !== undefined && { primaryImage: data.primaryImage }),
      },
    });
    return NextResponse.json({ product });
  } catch (e: any) {
    // BUG-09 fix: Catch unique constraint violation
    if (e?.code === 'P2002') {
      const field = e.meta?.target?.[0] || 'field';
      return NextResponse.json({ error: `A product with this ${field} already exists.` }, { status: 409 });
    }
    const message = e instanceof Error ? e.message : 'Failed to update';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isVisible: true,
        OR: [
          { name: { contains: query } },
          { sku: { contains: query } },
          { description: { contains: query } },
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true,
        sku: true,
        price: true,
        primaryImage: true,
      },
      take: 10,
      orderBy: { isTopTrending: 'desc' }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

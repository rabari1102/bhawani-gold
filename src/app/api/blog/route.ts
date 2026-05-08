import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const all = searchParams.get('all') === 'true';

  const where = all ? {} : { isPublished: true };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({ 
      where,
      orderBy: { publishDate: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.blogPost.count({ where })
  ]);
  
  return NextResponse.json({ 
    posts, 
    total, 
    page, 
    totalPages: Math.ceil(total / limit) 
  });
}

export async function POST(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const post = await prisma.blogPost.create({ data: { title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content, coverImage: data.coverImage || null, publishDate: data.publishDate ? new Date(data.publishDate) : new Date(), isPublished: data.isPublished || false } });
  return NextResponse.json({ post }, { status: 201 });
}

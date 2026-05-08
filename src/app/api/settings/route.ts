import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET() {
  let settings = await prisma.storeSettings.findUnique({ where: { id: 'default' } });
  if (!settings) {
    settings = await prisma.storeSettings.create({ data: { id: 'default' } });
  }
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const auth = authenticateRequest(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  const settings = await prisma.storeSettings.update({ where: { id: 'default' }, data });
  return NextResponse.json({ settings });
}

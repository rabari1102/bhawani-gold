import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const payload = authenticateRequest(request);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = await prisma.admin.findUnique({ where: { id: payload.adminId }, select: { id: true, name: true, email: true } });
  if (!admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }
  return NextResponse.json({ admin });
}

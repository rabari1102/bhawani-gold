import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const auth = authenticateRequest(request, 'user');
  
  if (!auth || !auth.userId) {
    return NextResponse.json({ user: null });
  }

  const user = await prisma.user.findUnique({ 
    where: { id: auth.userId },
    select: { id: true, name: true, email: true }
  });

  return NextResponse.json({ user });
}

import prisma from '@/lib/prisma';
import NavbarClient from './NavbarClient';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('user_token')?.value;
  let user = null;
  if (token) {
    const payload = verifyToken(token);
    if (payload?.userId) {
      user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, name: true, email: true } });
    }
  }

  const [categories, settings] = await Promise.all([
    prisma.category.findMany({ 
      where: { parentId: null },
      orderBy: { displayOrder: 'asc' },
      include: { children: { orderBy: { displayOrder: 'asc' } } }
    }),
    prisma.storeSettings.findFirst()
  ]);

  return <NavbarClient categories={categories} settings={settings} user={user} />;
}

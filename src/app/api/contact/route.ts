import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

// Simple HTML tag stripper to prevent stored XSS
function sanitize(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  // Allow digits, spaces, hyphens, plus, parentheses — 7 to 15 digits total
  const digitsOnly = phone.replace(/[\s\-\+\(\)]/g, '');
  return /^\d{7,15}$/.test(digitsOnly);
}

export async function POST(request: Request) {
  // Rate limit: 5 submissions per minute per IP
  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(ip, { maxRequests: 5, windowMs: 60 * 1000 });

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting again.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

  try {
    const data = await request.json();
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }

    // BUG-04 fix: Sanitize all text inputs to prevent stored XSS
    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const message = sanitize(data.message);
    const phone = data.phone ? sanitize(data.phone) : null;
    const interestedIn = data.interestedIn ? sanitize(data.interestedIn) : null;

    // BUG-10 fix: Validate phone format
    if (data.phone && !isValidPhone(data.phone)) {
      return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 });
    }

    // Honeypot check — if hidden field has a value, it's a bot
    if (data._hp) {
      return NextResponse.json({ success: true, enquiry: { id: 'ok' } }, { status: 201 });
    }

    const enquiry = await prisma.contactEnquiry.create({
      data: { name, email, phone, message, interestedIn },
    });
    return NextResponse.json({ success: true, enquiry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const enquiries = await prisma.contactEnquiry.findMany({
    orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit,
  });
  const total = await prisma.contactEnquiry.count();
  return NextResponse.json({ 
    enquiries, 
    total,
    page,
    totalPages: Math.ceil(total / limit)
  });
}

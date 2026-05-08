import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { authenticateRequest } from '@/lib/auth';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  // BUG-03 fix: Require admin authentication
  const auth = authenticateRequest(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    // BUG-02 fix: Validate file type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type "${file.type}". Only images (JPEG, PNG, WebP, GIF, SVG) are allowed.` },
        { status: 400 }
      );
    }

    // BUG-02 fix: Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 5MB.` },
        { status: 400 }
      );
    }

    // Sanitize filename — strip path traversal characters
    const originalExt = path.extname(file.name).toLowerCase();
    const safeExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);
    const ext = safeExtensions.has(originalExt) ? originalExt : '.png';

    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}`, filename });
  } catch {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { requireRole, canAccessListingDataroom } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import fs from 'node:fs/promises';
import path from 'node:path';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: { listingId: string } }) {
  try {
    const user = await requireRole(['SELLER', 'ADMIN']);
    if (!(await canAccessListingDataroom(user.id, params.listingId, user.role))) throw new Error('FORBIDDEN');
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'File required' }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), 'uploads', 'dataroom', params.listingId);
    await fs.mkdir(dir, { recursive: true });
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const fullPath = path.join(dir, safeName);
    await fs.writeFile(fullPath, bytes);

    const dbFile = await prisma.dataRoomFile.create({
      data: {
        listingId: params.listingId,
        uploaderId: user.id,
        filename: file.name,
        path: path.relative(process.cwd(), fullPath),
        mimeType: file.type || 'application/octet-stream',
        size: bytes.byteLength
      }
    });
    await logAudit(user.id, 'dataroom.file_uploaded', 'dataroom_file', dbFile.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

import { NextResponse } from 'next/server';
import { requireAuth, canAccessListingDataroom } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import fs from 'node:fs/promises';
import path from 'node:path';
import { apiError } from '@/lib/http';

export async function GET(_: Request, { params }: { params: { fileId: string } }) {
  try {
    const user = await requireAuth();
    const file = await prisma.dataRoomFile.findUnique({ where: { id: params.fileId } });
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!(await canAccessListingDataroom(user.id, file.listingId, user.role))) throw new Error('FORBIDDEN');
    const fullPath = path.join(process.cwd(), file.path);
    const data = await fs.readFile(fullPath);
    return new NextResponse(data, { headers: { 'Content-Type': file.mimeType, 'Content-Disposition': `attachment; filename="${file.filename}"` } });
  } catch (e) {
    return apiError(e);
  }
}

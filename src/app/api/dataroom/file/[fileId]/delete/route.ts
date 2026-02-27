import { NextResponse } from 'next/server';
import { requireRole, canAccessListingDataroom } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import fs from 'node:fs/promises';
import path from 'node:path';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(_: Request, { params }: { params: { fileId: string } }) {
  try {
    const user = await requireRole(['SELLER', 'ADMIN']);
    const file = await prisma.dataRoomFile.findUnique({ where: { id: params.fileId } });
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!(await canAccessListingDataroom(user.id, file.listingId, user.role))) throw new Error('FORBIDDEN');
    await prisma.dataRoomFile.delete({ where: { id: params.fileId } });
    await fs.rm(path.join(process.cwd(), file.path), { force: true });
    await logAudit(user.id, 'dataroom.file_deleted', 'dataroom_file', params.fileId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

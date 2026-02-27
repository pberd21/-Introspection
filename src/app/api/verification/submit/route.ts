import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request) {
  try {
    const user = await requireRole(['INVESTOR']);
    const { documentsNote } = await req.json();
    await prisma.verification.update({ where: { userId: user.id }, data: { status: 'PENDING', documentsNote: documentsNote?.slice(0, 2000) ?? null } });
    await logAudit(user.id, 'verification.submitted', 'user', user.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

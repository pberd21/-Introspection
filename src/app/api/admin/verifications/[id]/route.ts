import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole(['ADMIN']);
    const { status } = await req.json();
    if (!['VERIFIED', 'REJECTED'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    const v = await prisma.verification.update({ where: { id: params.id }, data: { status } });
    await logAudit(admin.id, status === 'VERIFIED' ? 'verification.verified' : 'verification.rejected', 'user', v.userId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

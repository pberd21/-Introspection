import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireRole(['ADMIN']);
    const { status } = await req.json();
    if (!['APPROVED', 'REJECTED'].includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    await prisma.listing.update({ where: { id: params.id }, data: { status } });
    await logAudit(admin.id, status === 'APPROVED' ? 'listing.approved' : 'listing.rejected', 'listing', params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

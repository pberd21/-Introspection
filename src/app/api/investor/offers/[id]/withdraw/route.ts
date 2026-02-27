import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const investor = await requireRole(['INVESTOR']);
    const offer = await prisma.offer.findUnique({ where: { id: params.id } });
    if (!offer || offer.investorId !== investor.id) throw new Error('FORBIDDEN');
    await prisma.offer.update({ where: { id: params.id }, data: { status: 'WITHDRAWN' } });
    await logAudit(investor.id, 'offer.withdrawn', 'offer', params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

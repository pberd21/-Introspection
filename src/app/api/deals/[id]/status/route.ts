import { NextResponse } from 'next/server';
import { requireRole, canAccessDeal } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

const stages = ['LOI', 'DOCS', 'PREEMPTIVE_RIGHT', 'NOTARY_OR_REGISTRAR', 'ESCROW_PAYMENT', 'CLOSED'];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(['SELLER', 'ADMIN']);
    const access = await canAccessDeal(user.id, params.id, user.role);
    if (!access) throw new Error('FORBIDDEN');
    const { status } = await req.json();
    if (!stages.includes(status) && status !== 'CANCELLED') return NextResponse.json({ error: 'Invalid stage' }, { status: 400 });
    await prisma.deal.update({ where: { id: params.id }, data: { status } });
    await logAudit(user.id, 'deal.status_changed', 'deal', params.id, { status });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

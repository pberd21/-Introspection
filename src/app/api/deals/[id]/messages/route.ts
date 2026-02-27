import { NextResponse } from 'next/server';
import { requireAuth, canAccessDeal } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { apiError } from '@/lib/http';
import { logAudit } from '@/lib/audit';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    if (!(await canAccessDeal(user.id, params.id, user.role))) throw new Error('FORBIDDEN');
    const { text } = await req.json();
    const msg = await prisma.message.create({ data: { dealId: params.id, senderId: user.id, text: String(text).slice(0, 2000) } });
    await logAudit(user.id, 'message.sent', 'message', msg.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}

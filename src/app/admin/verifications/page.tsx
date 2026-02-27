import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';
import { AdminVerificationActions } from '@/components/AdminActions';

export default async function AdminVerificationsPage() {
  await requireRole(['ADMIN']);
  const verifications = await prisma.verification.findMany({ where: { status: 'PENDING' }, include: { user: true } });
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Pending verifications</h1>{verifications.map((v)=><div key={v.id} className="rounded border bg-white p-3"><p>{v.user.email}</p><p>{v.documentsNote || 'No note provided'}</p><AdminVerificationActions id={v.id} /></div>)}</div>;
}

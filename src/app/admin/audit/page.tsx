import { requireRole } from '@/lib/rbac';
import { prisma } from '@/lib/prisma';

export default async function AdminAuditPage({ searchParams }: { searchParams: { page?: string } }) {
  await requireRole(['ADMIN']);
  const page = Number(searchParams.page || '1');
  const pageSize = 20;
  const logs = await prisma.auditLog.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize });
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Audit log</h1>{logs.map((l)=><div key={l.id} className="rounded border bg-white p-2 text-sm"><p>{l.createdAt.toISOString()} · {l.action} · {l.entityType}:{l.entityId}</p><p className="text-slate-500">By {l.user?.email || 'system'}</p></div>)}<div className="flex gap-2"><a className="text-blue-700" href={`/admin/audit?page=${Math.max(1,page-1)}`}>Prev</a><a className="text-blue-700" href={`/admin/audit?page=${page+1}`}>Next</a></div></div>;
}

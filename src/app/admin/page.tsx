import { requireRole } from '@/lib/rbac';
import Link from 'next/link';

export default async function AdminPage() {
  await requireRole(['ADMIN']);
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Admin dashboard</h1><div className="flex gap-3"><Link href="/admin/listings" className="text-blue-700">Listing review</Link><Link href="/admin/verifications" className="text-blue-700">Investor verifications</Link><Link href="/admin/audit" className="text-blue-700">Audit logs</Link></div></div>;
}

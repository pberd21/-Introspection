import { requireAuth } from '@/lib/rbac';
import Link from 'next/link';

export default async function ProfilePage() {
  const user = await requireAuth();
  return <div className="space-y-3"><h1 className="text-2xl font-semibold">Profile</h1><p>Role: {user.role}</p><p>Verification: {user.verificationStatus}</p><div className="flex gap-3">{user.role==='INVESTOR' && <Link className="text-blue-700" href="/verification">Verification</Link>}{user.role==='SELLER' && <Link className="text-blue-700" href="/seller/listings">My listings</Link>}{user.role==='ADMIN' && <Link className="text-blue-700" href="/admin">Admin dashboard</Link>}</div></div>;
}

import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { RoleBadge } from '@/components/RoleBadge';
import { SignOutButton } from '@/components/SignOutButton';

export async function Navbar() {
  const session = await getServerSession(authOptions);
  return (
    <nav className="border-b bg-white">
      <div className="container flex items-center justify-between py-3">
        <div className="flex gap-4">
          <Link href="/" className="font-semibold">PrivateShares</Link>
          <Link href="/marketplace">Marketplace</Link>
        </div>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/profile">{session.user.email}</Link>
              <RoleBadge role={session.user.role} />
              <SignOutButton />
            </>
          ) : (
            <Link href="/auth/sign-in" className="rounded bg-slate-900 px-3 py-1 text-white">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

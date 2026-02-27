'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return <button onClick={() => signOut({ callbackUrl: '/' })} className="rounded bg-slate-900 px-3 py-1 text-white">Sign out</button>;
}

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function SignInForm() {
  const [error, setError] = useState('');
  return <form className="space-y-2" onSubmit={async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await signIn('credentials', { email: form.get('email'), password: form.get('password'), redirect: false });
    if (res?.error) setError('Invalid credentials'); else location.href = '/profile';
  }}>
    <input name="email" type="email" required className="w-full rounded border px-2 py-1" placeholder="Email" />
    <input name="password" type="password" required className="w-full rounded border px-2 py-1" placeholder="Password" />
    {error && <p className="text-red-600">{error}</p>}
    <button className="rounded bg-slate-900 px-4 py-1 text-white">Sign in</button>
  </form>;
}

export function SignUpForm() {
  const [error, setError] = useState('');
  return <form className="space-y-2" onSubmit={async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const res = await fetch('/api/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) setError('Could not sign up'); else location.href = '/auth/sign-in';
  }}>
    <input name="name" required className="w-full rounded border px-2 py-1" placeholder="Full name" />
    <input name="email" type="email" required className="w-full rounded border px-2 py-1" placeholder="Email" />
    <input name="password" type="password" required className="w-full rounded border px-2 py-1" placeholder="Password" />
    <select name="role" className="w-full rounded border px-2 py-1"><option value="INVESTOR">Investor</option><option value="SELLER">Seller</option></select>
    {error && <p className="text-red-600">{error}</p>}
    <button className="rounded bg-slate-900 px-4 py-1 text-white">Sign up</button>
  </form>;
}

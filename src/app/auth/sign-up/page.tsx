import Link from 'next/link';
import { SignUpForm } from '@/components/AuthForms';

export default function SignUpPage() {
  return <div className="mx-auto max-w-md space-y-3 rounded border bg-white p-4"><h1 className="text-xl font-semibold">Create account</h1><SignUpForm /><p>Have account? <Link className="text-blue-700" href="/auth/sign-in">Sign in</Link></p></div>;
}

import Link from 'next/link';
import { SignInForm } from '@/components/AuthForms';

export default function SignInPage() {
  return <div className="mx-auto max-w-md space-y-3 rounded border bg-white p-4"><h1 className="text-xl font-semibold">Sign in</h1><SignInForm /><p>No account? <Link className="text-blue-700" href="/auth/sign-up">Sign up</Link></p></div>;
}

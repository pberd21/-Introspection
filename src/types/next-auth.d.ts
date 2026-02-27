import { Role, VerificationStatus } from '@prisma/client';
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      verificationStatus: VerificationStatus;
      name?: string | null;
      email?: string | null;
    };
  }

  interface User {
    id: string;
    role: Role;
    verificationStatus: VerificationStatus;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    verificationStatus: VerificationStatus;
  }
}

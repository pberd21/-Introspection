export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/profile', '/seller/:path*', '/investor/:path*', '/verification', '/admin/:path*', '/deals/:path*']
};

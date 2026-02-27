# PrivateShares.RU MVP

PrivateShares is a gated private-secondary marketplace for participations in non-public Russian companies.

## Stack
- Next.js 14 App Router + TypeScript
- TailwindCSS
- Prisma ORM
- NextAuth v4 credentials auth
- SQLite local DB (PostgreSQL-ready Prisma schema)

## Quick start
1. Copy env:
   ```bash
   cp .env.example .env
   ```
2. Install:
   ```bash
   npm install
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Seed credentials
- admin@privateshares.local / Admin123!
- seller1@privateshares.local / Seller123!
- seller2@privateshares.local / Seller123!
- investor1@privateshares.local / Investor123! (VERIFIED)
- investor2@privateshares.local / Investor123! (PENDING)
- investor3@privateshares.local / Investor123! (UNVERIFIED)

## PostgreSQL switch
1. Set `DATABASE_PROVIDER="postgresql"`
2. Set `DATABASE_URL` to your postgres DSN.
3. Run:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Notes
- Uploads are stored in `./uploads/dataroom/<listingId>/` and metadata in DB.
- RBAC and IDOR checks are done server-side in route handlers.
- Audit logging implemented for key lifecycle actions.

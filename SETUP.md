# Naya Backend Setup Guide

## 1. Install Dependencies

```bash
cd ~/naya
npm install @prisma/client bcryptjs jose zod
npm install -D prisma @types/bcryptjs
```

## 2. Set Up Supabase

1. Go to **supabase.com** → Create new project
   - Name: `naya-production`
   - Password: strong password (save it)
   - Region: `West EU` (closest to Nigeria)

2. Go to **Settings → Database**
   - Copy the **Connection string** (URI format)
   - Copy the **Direct URL**

3. Go to **Settings → API**
   - Copy the **Project URL**
   - Copy the **anon/public** key
   - Copy the **service_role** key

## 3. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
nano .env.local
```

## 4. Generate & Push Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to Supabase (first time)
npm run db:push

# Or use migrations for production
npm run db:migrate
```

## 5. Seed the Database

```bash
npm run db:seed
```

This creates:
- 1 admin account (admin@naya.ng)
- 6 verified agent accounts
- 3 sample neighbourhoods
- 12 months of market stats

## 6. Set Up Supabase Storage Buckets

In Supabase Dashboard → Storage → New bucket:

| Bucket Name        | Public | Max File Size |
|--------------------|--------|---------------|
| `listing-images`   | ✅ Yes  | 10MB          |
| `agent-documents`  | ❌ No   | 5MB           |
| `avatars`          | ✅ Yes  | 2MB           |

## 7. Enable Row Level Security (RLS)

Run in Supabase SQL Editor:

```sql
-- Users can only read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Listings are public read
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Listings are public" ON listings
  FOR SELECT USING (status = 'ACTIVE');

-- Agents can only manage their own listings
CREATE POLICY "Agents manage own listings" ON listings
  FOR ALL USING (
    agent_id IN (
      SELECT id FROM agent_profiles WHERE user_id = auth.uid()::text
    )
  );
```

## 8. API Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Create account |
| POST | `/api/auth/login` | None | Sign in |
| POST | `/api/auth/logout` | Session | Sign out |
| GET | `/api/auth/me` | Session | Current user |
| POST | `/api/auth/forgot-password` | None | Request reset |
| POST | `/api/auth/reset-password` | None | Set new password |

### Listings
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/listings` | None | Search listings |
| POST | `/api/listings` | Agent | Create listing |
| GET | `/api/listings/[id]` | None | Get listing |
| PATCH | `/api/listings/[id]` | Owner | Update listing |
| DELETE | `/api/listings/[id]` | Owner | Unpublish listing |

### Enquiries
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/enquiries` | Optional | Submit enquiry |
| GET | `/api/enquiries` | Agent | Agent's inbox |

### Agents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/agents` | None | List agents |
| GET | `/api/agents/[id]` | None | Agent profile |

### Saved & Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/saved` | Session | My saved listings |
| POST | `/api/saved` | Session | Save/unsave listing |
| POST | `/api/reviews` | Session | Submit review |

## 9. Query Examples

### Search listings
```
GET /api/listings?type=RENT&neighborhood=Woji&minBeds=3&maxPrice=3000000&sort=newest
```

### Create listing (Agent, POST /api/listings)
```json
{
  "title": "3-Bed Luxury Apartment, GRA Phase 2",
  "description": "Fully serviced 3-bedroom apartment...",
  "propertyType": "APARTMENT",
  "listingType": "RENT",
  "price": 3500000,
  "pricePeriod": "YEARLY",
  "bedrooms": 3,
  "bathrooms": 3,
  "address": "Plot 47, Aba Road, GRA Phase 2",
  "neighborhood": "GRA Phase 2",
  "lga": "Port Harcourt",
  "amenities": ["Generator", "Swimming Pool", "24-hr Security"],
  "features": ["Fully Serviced", "Smart Home Ready"]
}
```

### Submit enquiry (POST /api/enquiries)
```json
{
  "listingId": "clxxxxx",
  "message": "I am interested in viewing this property...",
  "enquiryType": "RENT",
  "guestName": "Emeka Obi",
  "guestPhone": "+2348012345678"
}
```

## 10. Deployment Checklist

- [ ] All `.env.local` variables set on Vercel
- [ ] `prisma migrate deploy` run on production DB
- [ ] Supabase RLS policies enabled
- [ ] Storage buckets created with correct permissions
- [ ] Custom domain `naya.ng` configured on Vercel
- [ ] Email provider (Resend) verified sender domain
- [ ] Paystack account activated for billing
- [ ] Admin account password changed after seed

# Email Service Integration Guide for Nihri's hope

## 🏆 RECOMMENDED: Resend (Best Option)

**Why Resend is the best choice:**
- ✅ **3,000 emails/month FREE** (more than enough for < 1000 subscribers)
- ✅ **1,000 contacts FREE**
- ✅ Built for modern developers (React/Next.js friendly)
- ✅ Simple API integration
- ✅ Excellent deliverability
- ✅ Works perfectly with Prisma + Neon DB

### Resend Free Tier Limits:
| Feature | Free Plan |
|---------|-----------|
| Emails/month | 3,000 |
| Contacts | 1,000 |
| Data Retention | 1 day |
| Support | Ticket |
| Price | FREE |

### Setup Instructions:

#### 1. Sign Up
- Go to https://resend.com
- Sign up with your email
- Verify your domain (nihrihope.com)

#### 2. Get API Key
- Go to Dashboard → API Keys
- Create new API key
- Copy the key (starts with `re_`)

#### 3. Install Resend
```bash
npm install resend
```

#### 4. Add Environment Variable
Create or update `.env.local`:
```env
RESEND_API_KEY=re_your_api_key_here
```

#### 5. Enable Email Sending
Uncomment the code in `/lib/email/resend.ts`

#### 6. Run Database Migration
```bash
npx prisma migrate dev --name add_newsletter_subscriber
```

---

## Alternative Options

### Option 2: SendGrid
**Free Tier:** 100 emails/day (3,000/month)
- Well established
- Good documentation
- More complex setup

### Option 3: Brevo (formerly SendinBlue)
**Free Tier:** 300 emails/day (9,000/month)
- Unlimited contacts
- Marketing automation
- Can get expensive after free tier

### Option 4: AWS SES
**Pricing:** $0.10 per 1,000 emails
- Very cheap
- 62,000 emails/month free if sent from EC2
- Complex setup
- No free tier for external hosting

### Option 5: Mailgun
**Free Tier:** 100 emails/day
- Good for startups
- Recently reduced free tier

---

## Current Implementation

### Database Schema
The `NewsletterSubscriber` model has been added to Prisma:
```prisma
model NewsletterSubscriber {
  id             Int       @id @default(autoincrement())
  email          String    @unique
  subscribed     Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  unsubscribedAt DateTime?
}
```

### API Endpoints
- `POST /api/newsletter` - Subscribe
- `DELETE /api/newsletter?email=xxx` - Unsubscribe

### Frontend Components
- `NewsletterCTA` - Subscription form with Resend integration ready
- `useNewsletter` hook - Handle subscribe/unsubscribe
- `/unsubscribe` page - Unsubscribe form

---

## Next Steps to Go Live

1. **Choose Resend** (recommended)
2. **Sign up at resend.com**
3. **Verify your domain** (nihrihope.com)
4. **Install Resend**: `npm install resend`
5. **Add API key to .env.local**
6. **Uncomment code** in `/lib/email/resend.ts`
7. **Run migration**: `npx prisma migrate dev`
8. **Test subscription**
9. **Send first newsletter**

---

## Estimated Costs

### With Resend:
- **0 - 1,000 subscribers**: FREE
- **1,000 - 3,000 emails/month**: FREE
- **After 3,000 emails**: $0.40 per 1,000 emails

### Example:
- 500 subscribers
- 2 newsletters/month
- Total: 1,000 emails/month
- **Cost: FREE**

---

## Questions?

Contact support:
- Resend: support@resend.com
- Or check Resend documentation: https://resend.com/docs

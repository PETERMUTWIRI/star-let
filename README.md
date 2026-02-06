# Rahab Kinity Music - Gospel Artist Website

A modern, full-stack musician portfolio website built with Next.js 16, TypeScript, Prisma, and Stripe.

![Rahab Kinity Music](https://starletmusic.com/og-image.jpg)

## ✨ Features

### Public Pages
- **Home** - Animated hero with artist name, streaming links, latest release, upcoming events
- **Music** - Albums and singles showcase with track listings and streaming links
- **Videos** - YouTube video gallery with categories (Music Videos, Live Performances, Behind the Scenes)
- **Events** - Upcoming shows with ticket purchase integration
- **About** - Artist bio, musical influences, career timeline, press quotes
- **Blog** - News and updates

### Admin Dashboard
- **Content Management** - Blog posts, Events, Videos
- **Registration Tracking** - View ticket sales, export to CSV
- **SEO Tools** - Meta titles, descriptions, OG images for all content

### E-Commerce Integration
- **Stripe Checkout** - Secure ticket purchasing for paid events
- **Free Registration** - Simple email capture for free events
- **Registration Management** - Track sales, attendance, revenue

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Neon Auth
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons, Lucide React

## 📦 Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.template .env.local
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXT_PUBLIC_NEON_AUTH_URL="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# File Upload (imgbb)
NEXT_PUBLIC_IMGBB_API_KEY="..."
```

3. **Set up the database:**
```bash
npx prisma generate
npx prisma db push
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🎫 Admin Access

Navigate to `/admin/sign-in` to access the admin dashboard. The first user to sign up gets admin privileges.

## 💳 Stripe Setup

1. Create a Stripe account and get your API keys
2. Add webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Listen for events: `checkout.session.completed`, `checkout.session.expired`

For local development, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🗄️ Database Schema

```prisma
model Post {
  id          Int       @id @default(autoincrement())
  title       String
  slug        String    @unique
  content     String
  excerpt     String?
  category    String
  cover       String?
  published   Boolean   @default(true)
  publishedAt DateTime?
  // ... SEO fields
}

model Event {
  id               Int       @id @default(autoincrement())
  title            String
  slug             String    @unique
  description      String?
  venue            String?
  location         String
  startDate        DateTime
  ticketPriceCents Int?      // For Stripe
  stripeProductId  String?   // Stripe product
  stripePriceId    String?   // Stripe price
  isFree           Boolean   @default(true)
  maxAttendees     Int?
  registrations    Registration[]
  // ... SEO fields
}

model Video {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  youtubeId   String   // YouTube video ID
  category    String   // Music Video, Live Performance, etc.
  thumbnail   String?
  published   Boolean  @default(true)
  order       Int      @default(0)
}

model Registration {
  id              Int      @id @default(autoincrement())
  eventId         Int
  email           String
  name            String
  stripeSessionId String?  // Stripe checkout session
  amountPaid      Int?     // In cents
  status          String   @default("pending")
  event           Event    @relation(fields: [eventId], references: [id])
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      String   @default("user")
}

model NewsletterSubscriber {
  id         Int      @id @default(autoincrement())
  email      String   @unique
  subscribed Boolean  @default(true)
}
```

## 📁 Project Structure

```
app/
├── page.tsx                 # Home page
├── layout.tsx               # Root layout
├── globals.css              # Global styles
├── music/                   # Albums showcase
├── videos/                  # YouTube gallery
├── events/                  # Concerts with tickets
├── about/                   # Artist bio
├── blog/                    # News/updates
├── tickets/success/         # Purchase confirmation
├── admin/                   # Admin dashboard
│   ├── page.tsx             # Dashboard overview
│   ├── blog/                # Blog editor
│   ├── events/              # Event editor
│   ├── videos/              # Video manager
│   └── registrations/       # Sales viewer
└── api/                     # API routes
    ├── blog/                # Blog CRUD
    ├── events/              # Events CRUD
    ├── videos/              # Videos CRUD
    ├── registrations/       # Registration CRUD
    └── stripe/              # Stripe integration
        ├── checkout/        # Create sessions
        └── webhook/         # Payment webhooks

components/
├── Navbar.tsx               # Site navigation
├── Footer.tsx               # Site footer
├── YouTubeEmbed.tsx         # Video embed
├── VideoModal.tsx           # Video player
├── TicketButton.tsx         # Purchase button
├── ScrollReveal.tsx         # Animations
└── ...

lib/
├── prisma.ts                # Prisma client
├── stripe.ts                # Stripe client
├── utils.ts                 # Helper functions
└── auth/                    # Auth utilities

prisma/
└── schema.prisma            # Database schema

public/                      # Static assets
```

## 🎨 Customization

### Brand Colors
Edit `tailwind.config.ts` and `app/globals.css`:
- `brand-primary`: Primary yellow (#f3ec59)
- `brand-text`: Dark text (#655c13)
- `cyan-600`: Accent color

### Artist Info
Update metadata in `app/layout.tsx` and content in `app/about/page.tsx`.

### Streaming Links
Update links in `app/page.tsx` and `app/music/page.tsx`.

### Social Media
Update links in `components/Navbar.tsx` and `components/Footer.tsx`.

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The project is optimized for [Vercel](https://vercel.com) deployment:
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

## 📄 License

MIT License - feel free to use this project as a template for your own musician portfolio.

---

Built with ❤️ for musicians everywhere.

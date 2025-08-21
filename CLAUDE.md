# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working on the new hosting discount platform to be built from scratch.

## Project Context

This document analyzes an existing Flask-based hosting comparison platform as reference for building a **new Next.js application from scratch** with modern technologies:

**Target Tech Stack:**
- **Frontend:** Next.js with shadcn/ui components
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **IDs:** UUID for all entities
- **Authentication:** Supabase Auth

## Current Project Status

**✅ Completed Setup:**
- Next.js 15.5.0 project initialized with TypeScript
- App Router structure configured
- Tailwind CSS v4 integrated
- shadcn/ui components library configured (New York style)
- Development server running on `http://localhost:3000`
- Turbopack enabled for faster development
- Lucide React icons library
- ESLint configured
- Supabase MCP server connected

**🔧 Development Commands:**
- `npm run dev` - Start development server on port 3000 (with Turbopack)
- `npm run build` - Build production application (with Turbopack)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**📁 Project Structure:**
```
├── app/                # Next.js App Router
│   ├── globals.css     # Global styles with Tailwind
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/         # Reusable components (shadcn/ui)
├── lib/               # Utility functions
│   └── utils.ts       # Tailwind utilities
├── public/            # Static assets
└── components.json    # shadcn/ui configuration
```

**🎯 Immediate Next Steps:**
1. **Database Schema Setup**: Create Supabase tables for Users, Providers, Plans, Reviews
2. **Environment Configuration**: Set up `.env.local` with Supabase credentials
3. **Supabase Client Setup**: Configure Supabase client in Next.js
4. **Basic UI Components**: Add essential shadcn/ui components (Button, Input, Card, etc.)
5. **Authentication Flow**: Implement Supabase Auth with login/register pages

## Reference Architecture (Flask System Analysis)

### Core Business Logic to Replicate

**User Management System:**
- Three-tier user roles: `user`, `provider_rep`, `admin`
- Email verification with OTP system
- Login attempt tracking and account locking
- Provider representative assignments to specific providers

**Provider Management:**
- Comprehensive hosting provider profiles
- Multiple hosting types (shared, VPS, dedicated, cloud, WordPress)
- Hosting plans with flexible pricing structure
- Features and datacenter location tracking
- Affiliate link click tracking with analytics

**Review System:**
- User reviews with 1-5 star ratings
- Structured content: title, content, pros, cons
- Provider representative replies to reviews
- Review moderation and verification workflow
- Helpful voting system for community curation

**Invitation System:**
- Email-based customer review invitations
- Customizable email templates for representatives
- Bulk invitation capabilities
- Analytics tracking (open rates, click rates, conversions)
- Guest review submission via email verification

**Coupon Management:**
- Percentage and fixed amount discounts
- Date-based activation and expiration
- Usage tracking and effectiveness analytics
- Hosting type restrictions
- User feedback on coupon validity

**Content Management:**
- Expert reviews by staff members
- FAQ systems for providers
- SEO optimization with AI-generated content
- Blog system with categorization
- Provider comparison tools

**Analytics & Tracking:**
- Comprehensive affiliate click tracking
- Geographic and device information collection
- UTM parameter support for campaigns
- Provider page view analytics
- Conversion event tracking

### Key Database Models to Implement

**User Models:**
```typescript
// Reference: app/models/user.py
User {
  id: UUID
  email: string
  username: string
  user_role: 'user' | 'provider_rep' | 'admin'
  is_verified: boolean
  is_disabled: boolean
  login_attempts: number
  last_login_attempt: timestamp
}

ProviderRepresentative {
  id: UUID
  user_id: UUID
  provider_id: UUID
  job_title: string
  can_reply_to_reviews: boolean
  can_moderate_content: boolean
  is_active: boolean
}
```

**Provider Models:**
```typescript
// Reference: app/models/provider.py
Provider {
  id: UUID
  name: string
  description: text
  website: string
  logo_url: string
  hosting_types: string[]
  affiliate_url: string
  rating_average: decimal
  total_reviews: integer
}

Plan {
  id: UUID
  provider_id: UUID
  hosting_type: string
  name: string
  monthly_price: decimal
  annual_price: decimal
  features: object
  is_featured: boolean
}
```

**Review Models:**
```typescript
// Reference: app/models/review.py
Review {
  id: UUID
  provider_id: UUID
  user_id: UUID
  rating: integer (1-5)
  title: string
  content: text
  pros: text
  cons: text
  is_verified: boolean
  helpful_count: integer
  created_at: timestamp
}

ReviewReply {
  id: UUID
  review_id: UUID
  user_id: UUID
  content: text
  is_by_provider_representative: boolean
  created_at: timestamp
}
```

### Key Features to Implement

**Authentication System:**
- Email/password registration and login
- Email verification with OTP
- Password reset functionality
- Role-based access control
- Account security features (login attempt limits)

**Provider Management:**
- CRUD operations for hosting providers
- Plan management with pricing tiers
- Feature assignment and categorization
- Affiliate link tracking and analytics
- SEO-optimized provider pages

**Review Platform:**
- User review submission with ratings
- Provider representative reply system
- Review moderation workflow
- Community helpful voting
- Invitation system for customer reviews

**Administrative Interface:**
- User management and role assignment
- Provider and content moderation
- System analytics and reporting
- Activity logging and audit trails
- Bulk operations for efficiency

**Public Features:**
- Provider search and filtering
- Comparison tools between providers
- Coupon search and management
- Blog/content system
- Responsive design for all devices

## Development Priorities for New Build

1. **✅ Foundation Setup** (COMPLETED)
   - ✅ Next.js project with TypeScript
   - ✅ Tailwind CSS v4 integration
   - ✅ shadcn/ui component library setup
   - 🔧 Supabase integration and database schema (IN PROGRESS - MCP connected)
   - ⏳ Authentication system implementation

2. **⏳ Core Models & Database** (NEXT PRIORITY)
   - Supabase database schema creation
   - User management with role system
   - Provider and plan management
   - Review system with replies
   - Analytics and tracking models

3. **Authentication & Authorization**
   - Supabase Auth integration
   - Role-based access control
   - Email verification workflow
   - Security features (rate limiting, etc.)

4. **Provider Management**
   - Provider CRUD operations
   - Plan management interface
   - Affiliate tracking system
   - SEO optimization features

5. **Review System**
   - Review submission and display
   - Provider reply functionality
   - Moderation workflow
   - Invitation system

6. **Administrative Interface**
   - Admin dashboard
   - User management
   - Content moderation
   - System analytics

7. **Public Features**
   - Search and filtering
   - Comparison tools
   - Coupon system
   - Blog/content management

## Technology Implementation Notes

**Next.js Patterns:**
- App Router for file-based routing
- Server Components for data fetching
- Client Components for interactivity
- API routes for backend functionality

**Supabase Integration:**
- Row Level Security (RLS) policies
- Real-time subscriptions where appropriate
- Database functions for complex operations
- Edge Functions for serverless logic

**UI/UX with shadcn/ui:**
- Consistent component library usage
- Dark/light mode support
- Responsive design patterns
- Accessible form components

**State Management:**
- React Context for global state
- Server state with React Query/SWR
- Form state with React Hook Form
- URL state for filters and pagination

This reference material should guide the development of a modern, scalable hosting comparison platform built from scratch with Next.js and associated technologies.
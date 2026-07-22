# FundSpark - Crowdfunding Platform

A full-stack MERN (MongoDB, Express, React/Next.js, Node.js) crowdfunding platform where creators raise money for projects and causes by collecting contributions from supporters.

## Live Site

- **Client:** [https://fundspark-client.vercel.app](https://fundspark-client.vercel.app)
- **Server:** [https://fundspark-server.vercel.app](https://fundspark-server.vercel.app)

## Admin Credentials

- **Email:** admin@fundspark.com
- **Password:** Admin@123

## Features

- **User Authentication** - Email/password registration and Google Sign-In with JWT token-based auth and role-based access control (Supporter, Creator, Admin)
- **Credit System** - Supporters get 50 free credits, Creators get 20 free credits on registration; supporters purchase credits via Stripe and contribute to campaigns
- **Campaign Management** - Creators can create, update, and delete campaigns; campaigns require admin approval before going live
- **Contribution System** - Supporters browse and contribute credits to campaigns; creators approve or reject contributions
- **Withdrawal System** - Creators withdraw raised credits at a 20:1 ratio ($1 per 20 credits); admin processes withdrawal requests
- **Notification System** - Real-time notifications for contribution approvals/rejections, campaign approvals, and withdrawal processing
- **Dashboard for Each Role** - Dedicated dashboards for Supporters, Creators, and Admin with role-specific functionality
- **Responsive Design** - Fully responsive layout for mobile, tablet, and desktop devices with collapsible sidebar
- **Image Upload** - imgBB integration for profile pictures and campaign images
- **Search & Filter** - Search campaigns by title/creator and filter by category
- **Pagination** - Paginated contribution history for supporters
- **Report System** - Supporters can report suspicious campaigns; admin reviews and takes action
- **Animated Homepage** - Hero slider, testimonial carousel, and animated sections using Swiper

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Swiper, React Icons
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs
- **Authentication:** Firebase Auth (Google Sign-In), JWT tokens
- **Payment:** Stripe integration for credit purchases
- **Image Hosting:** imgBB API for image uploads

## Environment Variables

### Server (.env)

```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
```

## Getting Started

### Server

```bash
cd server
npm install
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google-login` - Google authentication
- `GET /api/campaigns/approved` - Get all approved campaigns
- `POST /api/campaigns` - Create campaign (Creator)
- `PUT /api/campaigns/approve/:id` - Approve campaign (Admin)
- `POST /api/contributions` - Create contribution (Supporter)
- `PUT /api/contributions/approve/:id` - Approve contribution (Creator)
- `POST /api/payments` - Process payment
- `POST /api/withdrawals` - Request withdrawal (Creator)
- `PUT /api/withdrawals/approve/:id` - Process withdrawal (Admin)
- `GET /api/notifications` - Get user notifications

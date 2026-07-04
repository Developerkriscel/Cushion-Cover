# Elegant Home Decor

Premium MERN e-commerce application for a home decor brand selling table covers, cushion covers, aprons, and custom fabric home products.

## Architecture

```text
/client
  /src
    /components      Reusable UI pieces
    /pages           Storefront, account, admin, policy pages
    /features        Redux slices
    /routes          Protected route guards
    /services        Axios API client
    /utils           Formatters and helpers
    /assets          Static app assets
/server
  /config            MongoDB, Cloudinary, payment clients
  /controllers       MVC route handlers
  /middleware        Auth, upload, validation, error handling
  /models            Mongoose schemas
  /routes            REST API routes
  /utils             JWT, seed data, helpers
```

## Backend Setup

```bash
cd server
npm install
copy .env.example .env
npm run seed
npm run dev
```

Required environment values are listed in [server/.env.example](server/.env.example). Use Razorpay by default, or add Stripe keys if you prefer Stripe checkout.

Email delivery is production-ready with either:
- Gmail App Password auth using `EMAIL_USER` + `EMAIL_PASS`
- A generic SMTP provider using `SMTP_HOST` + `SMTP_PORT` + `SMTP_USER` + `SMTP_PASS`

For production, set `CLIENT_URL` to your deployed frontend origin and set `ADMIN_EMAIL` or `EMAIL_ALERT_TO` to the inbox that should receive admin notifications and low-stock alerts.

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

The Vite app reads `VITE_API_URL`; see [client/.env.example](client/.env.example).

## Default Seed Admin

- Email: `admin@eleganthomedecor.com`
- Password: `Admin@12345`

Change these values before production.

## Main API Areas

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `PUT /api/auth/profile`
- `PUT /api/auth/password`
- `GET /api/products`
- `GET /api/products/:idOrSlug`
- `POST /api/products` admin
- `PUT /api/products/:id` admin
- `DELETE /api/products/:id` admin
- `POST /api/products/:id/reviews`
- `GET /api/categories`
- `POST /api/categories` admin
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/:itemId`
- `DELETE /api/cart/:itemId`
- `GET /api/wishlist`
- `POST /api/wishlist/:productId`
- `DELETE /api/wishlist/:productId`
- `POST /api/orders`
- `GET /api/orders/my`
- `GET /api/orders/:id`
- `GET /api/admin/stats`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/:id/status`
- `POST /api/payments/razorpay/order`
- `POST /api/payments/razorpay/verify`
- `POST /api/payments/stripe/intent`

## Deployment Guidance

Backend:
1. Deploy the `server` folder to Render, Railway, Fly.io, or an equivalent Node host.
2. Set all `.env` values in the provider dashboard.
3. Configure `CLIENT_URL` or `FRONTEND_URL` to the deployed frontend origin.
4. Use MongoDB Atlas with IP access configured for the host.
5. Store Cloudinary, payment, and email secrets only as backend environment variables.
6. For email, prefer Gmail App Password auth or a single SMTP provider path. Do not mix Gmail credentials with unrelated SMTP username/password values.

Frontend:
1. Deploy the `client` folder to Vercel, Netlify, or a static host.
2. Set `VITE_API_URL` to the deployed backend URL.
3. Add the frontend URL to backend CORS.

## Production Environment Variables

### Backend
- `NODE_ENV`
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URL` or `FRONTEND_URL`
- `EMAIL_USER` and `EMAIL_PASS` for Gmail App Password auth, or `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` for SMTP auth
- `MAIL_FROM_NAME`
- `MAIL_FROM`
- `ADMIN_EMAIL` or `EMAIL_ALERT_TO`
- `LOW_STOCK_THRESHOLD`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `STRIPE_SECRET_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Frontend
- `VITE_API_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_FRONTEND_URL`

Production hardening:
- Rotate seed credentials.
- Enable HTTPS only cookies if switching JWT storage from localStorage to cookies.
- Add rate limiting on auth/payment endpoints.
- Configure payment webhooks for final settlement verification.
- Add server-side address validation and tax/shipping rules for your operating regions.
- Use the Admin Dashboard "Send Test Email" button or `POST /api/admin/email/test` to verify production SMTP delivery after deployment.

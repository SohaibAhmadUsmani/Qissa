# Qissa Wear — E-Commerce Clothing Store

<img width="1352" height="635" alt="qissa" src="https://github.com/user-attachments/assets/bbb8aadc-082e-4666-a935-04f9c1f9f228" />


A full-stack MERN e-commerce application for a Pakistani clothing brand.

## Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Stripe, Groq AI

## Features

- User authentication (admin & customer roles)
- Product catalog with categories, variants, and search
- Shopping cart, wishlist, checkout (Stripe & COD)
- Order management with status tracking
- Admin dashboard with analytics, product/order/user management
- AI stylist recommendations (powered by Groq)

## Quick Start

```bash
# Install dependencies
npm run install:all

# Configure environment
# Copy backend/.env.example -> backend/.env and fill in your keys

# Seed database
npm run seed:all --prefix backend

# Start both frontend & backend
npm run dev
```

- Frontend: `http://localhost:5174`
- Backend API: `http://localhost:5000`

## Environment Variables (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `GROQ_API_KEY` | Groq AI API key |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5174`) |

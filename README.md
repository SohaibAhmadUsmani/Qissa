# Qissa Wear — E-Commerce Clothing Store

<img width="1352" height="635" alt="qissa" src="https://github.com/user-attachments/assets/bbb8aadc-082e-4666-a935-04f9c1f9f228" />


# Qissa Wear — E-Commerce Clothing Store

A full-stack e-commerce platform for a Pakistani clothing brand, featuring role-based dashboards, AI-powered stylist recommendations, integrated payments, and a modern shopping experience.

## Link : 

## Features

### Authentication & User Management
- JWT Authentication
- Role-Based Access Control (Admin & Customer)
- Admin Dashboard with Analytics
- Secure Protected Routes

### Product Management
- Product Catalog with Categories & Subcategories
- Variant Management (Size, Color, Stock)
- Image Gallery per Product
- Search & Filter Products
- Featured & New Arrival tagging

### Shopping Experience
- Shopping Cart with Quantity Management
- Wishlist
- Address Management
- Multiple Payment Methods (Stripe & COD)

### Order Management
- Order Placement & History
- Real-time Order Status Tracking
- Admin Order Management
- Payment Verification

### Interactive Features
- AI Stylist Recommendations
- Blog System
- Newsletter Subscription
- Product Reviews & Ratings

### AI Stylist
Get personalized outfit recommendations based on:

- Occasion (Wedding, Casual, Formal, etc.)
- Budget Range
- Style Preference (Elegant, Traditional, Modern, etc.)
- Season
- Color Preference
- Powered by Groq LLM for intelligent fashion advice

## System Architecture

```
                 React Frontend (Vite)
                        │
                        ▼
              Express.js REST API
                        │
                        ▼
                     MongoDB
```

## Technology Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router
- Axios
- Lucide React Icons

### Backend
- Node.js
- Express.js
- Mongoose ODM

### Database
- MongoDB

### AI
- Groq API

### Payments
- Stripe

## Project Structure

```
backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── seed/
│   ├── services/
│   ├── utils/
│   └── validations/
│
frontend/
├── public/
└── src/
    ├── assets/
    ├── components/
    ├── features/
    ├── pages/
    ├── routes/
    └── services/
```

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
```

### Backend

```bash
cd backend

npm install

cp .env.example .env
# Fill in your environment variables

npm run seed:all

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

## Environment Variables (`backend/.env`)

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `GROQ_API_KEY` | Groq AI API key |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5174`) |

## Roadmap

- [ ] AI Teaching Assistant
- [ ] Personalized Recommendations
- [ ] Mobile App
- [ ] Multi-vendor Support
- [ ] Advanced Analytics Dashboard
- [ ] Live Chat Support

## Author

**Sohaib Usmani**

Computer Science Undergraduate

Full Stack Developer

# QR Menu System

A comprehensive QR Menu System for restaurants, cafes, and food establishments.

## Features

- Multi-role system (Admin, Restaurant Owner, Staff)
- QR code generation for each table
- Real-time order tracking
- Dashboard with analytics
- Table management
- Staff management
- Order management

## Tech Stack

- Frontend: React.js
- Backend: Node.js (Express.js)
- Database: PostgreSQL

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database named 'qr_menu'

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the database credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── models/          # Database models
├── routes/          # API routes
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
└── utils/           # Utility functions
```

## API Documentation

The API documentation will be available at `/api-docs` when the server is running.

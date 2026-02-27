# BloodLife | Blood Donation Management Portal

A full-stack MERN application connecting blood donors with hospitals in real-time.

## Features

- **Role-based Authentication**: Secure JWT-based login for Donors, Hospitals, and Admins.
- **Donor Portal**: Browse nearby requests, pledge donations, manage eligibility (90-day cooldown).
- **Hospital Portal**: Post blood requests, manage donor pledges, schedule appointments.
- **Admin Dashboard**: System-wide analytics, user management (block/activate).
- **Modern UI**: Clean, medical-themed interface using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Axios, Lucide Icons, Recharts.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS.

## Prerequisites

- Node.js (v18+)
- MongoDB (Local installation or MongoDB Atlas Cloud)

## Setup Instructions

### 1. Clone the repository
Extract the files to your desired directory.

### 2. Backend Setup
1. Open a terminal in the `server` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file with your MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Seed the database with sample data:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a terminal in the `client` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Default Credentials (Seed Data)
- **Admin**: `admin@blood.com` / `password123`
- **Hospitals**: `hospital1@test.com`, `hospital2@test.com` / `password123`
- **Donors**: `donor1@test.com` ... `donor5@test.com` / `password123`

## Deployment
- **Frontend**: Deploy `client` folder to Vercel/Netlify.
- **Backend**: Deploy `server` folder to Render/Heroku. Update CORS settings in `index.js` as needed.
